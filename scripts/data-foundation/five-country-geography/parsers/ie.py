"""IE parser: Census 2022 local authorities + towns, OSI geometry.

Local authority populations come from SAP2022T1T2CTY (sex=Both, marital=Total);
town populations from SAP2022T2T4TOWN22 (religion=Total). OSI provides town
centroids (Irish Transverse Mercator) and LA boundary polygons. CSO local
authority labels are mapped to OSI BDY_ID by a verified name normalization
(31/31); town centroids are joined to LA councils by point-in-polygon with a
nearest-council fallback.
"""

import json
import re
import unicodedata

from shapely.geometry import Polygon
from shapely.ops import unary_union

from ._common import (clean_name, entity, join_metric, read_csv, stage_path,
                      to_int)

from geo import itm_to_wgs84, nearest_polygon, point_in_polygon

POP_REF = "2022-04-03"


def _ascii(s):
    return unicodedata.normalize("NFKD", s.upper()).encode(
        "ascii", "ignore").decode()


def _la_core(s):
    s = _ascii(s).replace("&", "AND").replace("-", " ")
    s = s.replace("COUNCIL", " ")
    s = re.sub(r"[^A-Z ]", " ", s)
    return " ".join(s.split())


def _load_la_geometry(raw_dir):
    path = stage_path(raw_dir, "ie_la_geometry.json")
    data = json.load(open(path))
    polygons = {}   # bd_id -> list of shapely polygons
    for feat in data["features"]:
        attrs = feat.get("attributes", {})
        bd = str(attrs.get("BDY_ID")).strip()
        geom = feat.get("geometry")
        if not geom or not geom.get("rings"):
            continue
        rings = geom["rings"]
        outer = [tuple(p) for p in rings[0]]
        holes = [[tuple(p) for p in r] for r in rings[1:]]
        polygons.setdefault(bd, []).append(Polygon(outer, holes))
    unions = {}
    for bd, polys in polygons.items():
        if len(polys) == 1:
            unions[bd] = polys[0]
        else:
            unions[bd] = unary_union(polys)
    return unions


def parse(raw_dir):
    cty = json.load(open(stage_path(raw_dir, "ie_sap2022t1t2cty.json")))
    town = json.load(open(stage_path(raw_dir, "ie_sap2022t2t4town22.json")))

    # --- CSO county table ---
    geog_dim = cty["dimension"]["C03789V04537"]["category"]
    cty_codes = list(geog_dim["index"])
    cty_labels = {c: geog_dim["label"].get(c) for c in cty_codes}
    cty_vals = cty["value"]
    state_pop = int(cty_vals[geog_dim["index"].index("IE0") * 18 + 17])

    # --- OSI LA names (deduped per BDY_ID) ---
    la_rows = read_csv(raw_dir, "ie_local_authorities_2026.csv")
    osi_names = {}   # BDY_ID -> (ENG_NAME_VALUE, GLE_NAME_VALUE)
    for r in la_rows:
        bd = str(r.get("BDY_ID")).strip()
        if bd and bd not in osi_names:
            osi_names[bd] = (clean_name(r.get("ENG_NAME_VALUE")),
                             clean_name(r.get("GLE_NAME_VALUE")))

    la_geom = _load_la_geometry(raw_dir)

    # --- CSO label -> BDY_ID mapping ---
    label_to_bd = {}
    for bd, (en, gle) in osi_names.items():
        label_to_bd.setdefault(_la_core(en), bd)
    mapped = 0
    la_labels = {}   # BDY_ID -> CSO label
    for code in cty_codes:
        lab = cty_labels[code]
        if code == "IE0":
            continue
        bd = label_to_bd.get(_la_core(lab))
        if bd is not None:
            la_labels[bd] = lab
            mapped += 1

    # --- regions (local authorities) ---
    regions = []
    region_by_bd = {}
    for code in cty_codes:
        lab = cty_labels[code]
        if code == "IE0":
            continue
        bd = label_to_bd.get(_la_core(lab))
        if bd is None:
            continue
        g = cty_codes.index(code)
        pop = int(cty_vals[g * 18 + 17])
        geom = la_geom.get(bd)
        c = (geom.centroid.x, geom.centroid.y) if geom is not None else None
        short = re.sub(r"\s+(County|City)\s*&\s*County Council$", "",
                       re.sub(r"\s+(County|City) Council$", "", lab))
        gle = osi_names.get(bd, (None, None))[1]
        regions.append(entity(
            "region", "ie-cso-sap2022-t1t2cty-v1", "IE:la:%s" % bd,
            lab, short, pop, POP_REF, bd, "local authority",
            coordinates=({"latitude": c[1], "longitude": c[0]}
                         if c is not None else None),
            coordinate_derivation="polygon_centroid",
            area_km2=None, local_name=gle,
            parent_region_code="IE", parent_region_name="Ireland",
            parent_join_method="direct"))
        region_by_bd[bd] = regions[-1]

    # --- towns ---
    t_geog = town["dimension"]["C04160V04929"]["category"]
    t_codes = list(t_geog["index"])
    t_labels = {c: t_geog["label"].get(c) for c in t_codes}
    t_vals = town["value"]
    town_pop = {}
    for g, code in enumerate(t_codes):
        town_pop[code] = int(t_vals[g * 5 + 4])

    urban = read_csv(raw_dir, "ie_cso_urban_areas_2022.csv")
    la_list = [la_geom[b] for b in la_geom]
    la_ids = [b for b in la_geom]

    cities = []
    pip_matched = 0
    nearest_matched = 0
    guid_joined = 0
    for r in urban:
        guid = str(r.get("URBAN_AREA_GUID")).strip()
        pop = town_pop.get(guid)
        if pop is None:
            continue
        guid_joined += 1
        name = clean_name(r.get("URBAN_AREA_NAME"))
        cso_label = t_labels.get(guid)
        x = to_int(r.get("Centroid_x"))
        y = to_int(r.get("Centroid_y"))
        coords = None
        if x is not None and y is not None:
            lon, lat = itm_to_wgs84(x, y)
            coords = {"latitude": lat, "longitude": lon}
        bd = None
        method = None
        if coords is not None:
            for i, geom in enumerate(la_list):
                if point_in_polygon(coords["longitude"], coords["latitude"],
                                    geom):
                    bd = la_ids[i]
                    method = "point_in_polygon"
                    pip_matched += 1
                    break
        if bd is None and coords is not None:
            idx = nearest_polygon(coords["longitude"], coords["latitude"],
                                  la_list)
            if idx is not None:
                bd = la_ids[idx]
                method = "nearest_council"
                nearest_matched += 1
        reg = region_by_bd.get(bd) if bd else None
        cities.append(entity(
            "city", "ie-cso-sap2022-t2t4town22-v1", "IE:town:%s" % guid,
            cso_label or name, name, pop, POP_REF, guid,
            "urban area (CSO 2022)",
            coordinates=coords, coordinate_derivation="source_centroid_transformed",
            area_km2=None,
            parent_region_code=bd,
            parent_region_name=reg["short_name"] if reg else None,
            parent_join_method=method))

    # --- country ---
    lat = [r["coordinates"]["latitude"] for r in regions
           if r.get("coordinates")]
    lon = [r["coordinates"]["longitude"] for r in regions
           if r.get("coordinates")]
    country = entity(
        "country", "ie-cso-sap2022-t1t2cty-v1", "IE:country",
        "Ireland", "Ireland", state_pop, POP_REF, None, "country",
        coordinates={"latitude": sum(lat) / len(lat),
                     "longitude": sum(lon) / len(lon)},
        coordinate_derivation="derived_mean",
        area_km2=None, parent_region_code=None, parent_region_name=None,
        parent_join_method=None)

    return {
        "country": country,
        "regions": regions,
        "cities": cities,
        "join_metrics": [
            join_metric("la_label_join", 31, mapped, "name_normalization"),
            join_metric("town_guid_join", len(town_pop) - 1, guid_joined,
                        "guid_join"),
            join_metric("town_to_la_point_in_polygon", len(cities),
                        pip_matched, "point_in_polygon"),
            join_metric("town_to_la_nearest", len(cities) - pip_matched,
                        nearest_matched, "nearest_council"),
        ],
        "notes": [
            "CSO local authority labels mapped to OSI BDY_ID via verified name "
            "normalization (31/31, incl. Dún Laoghaire Rathdown).",
            "Town centroids (ITM) transformed to WGS84 and joined to councils "
            "by point-in-polygon; coastal towns fall back to nearest council.",
            "Town population is CSO 2022 religion=Total; state total 5,149,139 "
            "is used for the country record.",
        ],
    }

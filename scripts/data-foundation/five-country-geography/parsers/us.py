"""US parser: Census sub-county population estimates + gazetteer + TIGER.

Population source: 2020-2022 subcounty estimates (POPESTIMATE2022 = July 1,
2022). Coordinates for states come from TIGER official internal points; for
cities from the 2020 Gazetteer official internal points. The national total
comes from NA-EST2022-POP (July 1, 2022 = 333,287,557).
"""

import io
import os
import re
import tempfile
import zipfile

import openpyxl

from ._common import (clean_name, entity, join_metric, read_csv, stage_path,
                      to_float, to_int)

from geo import extract_shapefile_zip, read_shapefile

POP_REF = "2022-07-01"
CLASS_SUFFIX_RE = re.compile(
    r"\s+(city|town|village|cdp|borough|municipality|plantation|ut|gv|county|"
    r"balance|ccd|precinct|reservation|adp|barrio|zone|civil township|"
    r"township|unified government)$", re.I)


def _short_name(name):
    return CLASS_SUFFIX_RE.sub("", name) or name


def _read_gazetteer(raw_dir):
    zip_path = stage_path(raw_dir, "us_gaz_place_national.zip")
    with zipfile.ZipFile(zip_path) as zf:
        member = "2020_Gaz_place_national.txt"
        text = zf.read(member).decode("utf-8").splitlines()
    header = [h.strip() for h in text[0].split("\t")]
    out = {}
    for line in text[1:]:
        cells = [c.strip() for c in line.split("\t")]
        row = dict(zip(header, cells))
        out[row["GEOID"]] = row
    return out


def _read_national_pop(raw_dir):
    path = stage_path(raw_dir, "us_na-est2022-pop.xlsx")
    wb = openpyxl.load_workbook(path, read_only=True, data_only=True)
    ws = wb["NA-EST2022-POP"]
    current_year = None
    for row in ws.iter_rows(values_only=True):
        a = str(row[0]).strip() if row[0] is not None else ""
        m = re.match(r"^(\d{4})", a)
        if m and 2020 <= int(m.group(1)) <= 2023:
            current_year = m.group(1)
            continue
        if current_year == "2022" and a.startswith(".July 1"):
            return to_int(row[1])
    raise ValueError("could not find July 1 2022 national population")


def parse(raw_dir):
    pop_rows = read_csv(raw_dir, "us_sub-est2022.csv")
    gaz = _read_gazetteer(raw_dir)
    national_pop = _read_national_pop(raw_dir)

    shp_dir = os.path.join(tempfile.gettempdir(), "geo10c_us_tiger")
    shp_path, _ = extract_shapefile_zip(
        stage_path(raw_dir, "us_tiger_state.zip"), shp_dir)
    geoms, tiger_recs = read_shapefile(shp_path)

    tiger = {}
    for rec in tiger_recs:
        stf = str(rec.get("STATEFP")).strip()
        tiger[stf] = {
            "name": clean_name(rec.get("NAME")),
            "usps": clean_name(rec.get("STUSPS")),
            "lat": to_float(str(rec.get("INTPTLAT")).strip().lstrip("+")),
            "lon": to_float(str(rec.get("INTPTLON")).strip()),
            "aland": to_float(rec.get("ALAND")),
        }

    # --- states (regions) ---
    regions = []
    for row in pop_rows:
        if row.get("SUMLEV") != "040" or row.get("PLACE") != "00000":
            continue
        stf = str(row.get("STATE")).strip()
        t = tiger.get(stf, {})
        pop = to_int(row.get("POPESTIMATE2022"))
        if pop is None:
            continue
        regions.append(entity(
            "region", "us-census-sub-est2022-v1", "US:state:%s" % stf,
            t.get("name") or clean_name(row.get("NAME")),
            t.get("name") or clean_name(row.get("NAME")),
            pop, POP_REF, stf, "state",
            coordinates=({"latitude": t["lat"], "longitude": t["lon"]}
                         if t.get("lat") is not None else None),
            coordinate_derivation="official_source_centroid",
            area_km2=(t["aland"] / 1e6 if t.get("aland") is not None else None),
            parent_region_code="US", parent_region_name="United States",
            parent_join_method="direct"))

    # --- cities ---
    cities = []
    city_total = 0
    city_matched = 0
    for row in pop_rows:
        if row.get("SUMLEV") != "162" or not row.get("PLACE") or \
                row.get("PLACE") == "00000":
            continue
        state = str(row.get("STATE")).strip()
        place = str(row.get("PLACE")).strip()
        geoid = state + place
        g = gaz.get(geoid)
        pop = to_int(row.get("POPESTIMATE2022"))
        if pop is None:
            continue
        city_total += 1
        name = clean_name(row.get("NAME"))
        lat = lon = None
        aland = None
        if g is not None:
            city_matched += 1
            lat = to_float(g.get("INTPTLAT"))
            lon = to_float(g.get("INTPTLONG"))
            aland = to_float(g.get("ALAND"))
        cities.append(entity(
            "city", "us-census-sub-est2022-v1", "US:place:%s" % geoid,
            name, _short_name(name), pop, POP_REF, geoid, "incorporated place",
            coordinates=({"latitude": lat, "longitude": lon}
                         if lat is not None and lon is not None else None),
            coordinate_derivation="official_source_centroid",
            area_km2=(aland / 1e6 if aland is not None else None),
            parent_region_code=state,
            parent_region_name=(tiger.get(state) or {}).get("name"),
            parent_join_method="code"))

    # --- country ---
    st_lats = [r["coordinates"]["latitude"] for r in regions
               if r.get("coordinates")]
    st_lons = [r["coordinates"]["longitude"] for r in regions
               if r.get("coordinates")]
    country = entity(
        "country", "us-census-na-est2022-pop-v1", "US:country",
        "United States of America", "United States", national_pop, POP_REF,
        None, "country",
        coordinates={"latitude": sum(st_lats) / len(st_lats),
                     "longitude": sum(st_lons) / len(st_lons)},
        coordinate_derivation="derived_mean",
        area_km2=sum(r.get("area_km2") or 0 for r in regions),
        parent_region_code=None, parent_region_name=None,
        parent_join_method=None)

    return {
        "country": country,
        "regions": regions,
        "cities": cities,
        "join_metrics": [
            join_metric("state_population_join", 51, len(regions), "direct"),
            join_metric("city_gazetteer_join", city_total, city_matched,
                        "code_join_geoid"),
        ],
        "notes": [
            "City universe is 19,493 incorporated places (SUMLEV 162) from the "
            "2020-2022 subcounty estimates; coordinates from the 2020 Gazetteer.",
            "Country population is the July 1, 2022 national estimate "
            "(NA-EST2022-POP).",
            "State and country area are land area (ALAND) from TIGER/Line 2022.",
        ],
    }

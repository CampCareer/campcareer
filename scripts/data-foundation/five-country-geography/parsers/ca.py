"""CA parser: 2021 Census population by province and census subdivision.

Population from the 98100002 Census Profile CSV; geometry from the 2021 CSD
cartographic boundary file. The DGUID encodes the province in positions 10-11
(e.g. 2021A00053520005 -> province 35, Ontario). Province/country centroids
are derived (mean of member CSD polygon centroids).
"""

import os
import tempfile

from ._common import (clean_name, entity, join_metric, read_zip_member_csv,
                      stage_path, to_int)

from geo import centroid_of, extract_shapefile_zip, read_shapefile, wkt_to_wgs84

POP_REF = "2021-05-11"
PROVINCE_NAMES = {
    "10": "Newfoundland and Labrador", "11": "Prince Edward Island",
    "12": "Nova Scotia", "13": "New Brunswick", "24": "Quebec",
    "35": "Ontario", "46": "Manitoba", "47": "Saskatchewan",
    "48": "Alberta", "59": "British Columbia", "60": "Yukon",
    "61": "Northwest Territories", "62": "Nunavut",
}


def parse(raw_dir):
    pop_rows = read_zip_member_csv(
        raw_dir, "ca_98100002-eng.zip", "98100002.csv")
    pop_col = "Population and dwelling counts (13): Population, 2021 [1]"

    prov_rows = {}
    csd_pop = {}
    country_pop = None
    for row in pop_rows:
        dguid = (row.get("DGUID") or "").strip()
        pop = to_int(row.get(pop_col))
        if not dguid or pop is None:
            continue
        if dguid.startswith("2021A0002") and len(dguid) == 11:
            prov_rows[dguid[9:11]] = (clean_name(row.get("GEO")), pop)
        elif dguid.startswith("2021A0005") and len(dguid) == 16:
            csd_pop[dguid] = (clean_name(row.get("GEO")), pop)
        elif dguid == "2021A000011124":
            country_pop = pop

    shp_dir = os.path.join(tempfile.gettempdir(), "geo10c_ca_lcsd")
    shp_path, _ = extract_shapefile_zip(
        stage_path(raw_dir, "ca_lcsd000a21a_e.zip"), shp_dir)
    prj_path = shp_path[:-4] + ".prj"
    prj_wkt = open(prj_path).read() if os.path.exists(prj_path) else None
    geoms, recs = read_shapefile(shp_path)

    # CSD geometry: dguid -> centroid (transformed to WGS84)
    csd_centroid = {}
    csd_area = {}
    csd_total = 0
    csd_matched = 0
    for geom, rec in zip(geoms, recs):
        dguid = str(rec.get("DGUID")).strip()
        csd_total += 1
        c = centroid_of(geom)
        if c is None:
            continue
        if prj_wkt:
            lon, lat = wkt_to_wgs84(prj_wkt, c[0], c[1])
            c = (lon, lat)
        csd_matched += 1
        csd_centroid[dguid] = c
        landarea = rec.get("LANDAREA")
        csd_area[dguid] = to_int(landarea)

    prov_centroids = {code: [] for code in PROVINCE_NAMES}
    prov_area = {code: 0.0 for code in PROVINCE_NAMES}
    prov_csd_count = {code: 0 for code in PROVINCE_NAMES}
    for dguid, (name, pop) in csd_pop.items():
        pr = dguid[9:11]
        prov_centroids[pr].append(csd_centroid.get(dguid))
        if dguid in csd_area:
            prov_area[pr] += csd_area[dguid] or 0
        prov_csd_count[pr] += 1

    # --- regions (provinces/territories) ---
    regions = []
    for pr, (name, pop) in prov_rows.items():
        pts = [p for p in prov_centroids.get(pr, []) if p]
        coords = None
        if pts:
            coords = {"latitude": sum(p[1] for p in pts) / len(pts),
                      "longitude": sum(p[0] for p in pts) / len(pts)}
        regions.append(entity(
            "region", "ca-statcan-98100002-v1", "CA:province:%s" % pr,
            name, name, pop, POP_REF, pr, "province/territory",
            coordinates=coords, coordinate_derivation="derived_mean",
            area_km2=(prov_area.get(pr) if prov_area.get(pr) else None),
            parent_region_code="CA", parent_region_name="Canada",
            parent_join_method="direct"))

    # --- cities (census subdivisions) ---
    cities = []
    city_pop_total = 0
    city_geom_total = 0
    for dguid, (name, pop) in csd_pop.items():
        city_pop_total += 1
        c = csd_centroid.get(dguid)
        if c is not None:
            city_geom_total += 1
        pr = dguid[9:11]
        cities.append(entity(
            "city", "ca-statcan-98100002-v1", "CA:csd:%s" % dguid,
            name, name, pop, POP_REF, dguid, "census subdivision (CSD)",
            coordinates=({"latitude": c[1], "longitude": c[0]}
                         if c is not None else None),
            coordinate_derivation="polygon_centroid",
            area_km2=csd_area.get(dguid),
            parent_region_code=pr,
            parent_region_name=PROVINCE_NAMES.get(pr),
            parent_join_method="code"))

    # --- country ---
    lat = [r["coordinates"]["latitude"] for r in regions
           if r.get("coordinates")]
    lon = [r["coordinates"]["longitude"] for r in regions
           if r.get("coordinates")]
    country = entity(
        "country", "ca-statcan-98100002-v1", "CA:country",
        "Canada", "Canada", country_pop, POP_REF, None, "country",
        coordinates={"latitude": sum(lat) / len(lat),
                     "longitude": sum(lon) / len(lon)},
        coordinate_derivation="derived_mean",
        area_km2=sum(r.get("area_km2") or 0 for r in regions),
        parent_region_code=None, parent_region_name=None,
        parent_join_method=None)

    return {
        "country": country,
        "regions": regions,
        "cities": cities,
        "join_metrics": [
            join_metric("province_population_join", 13, len(regions), "direct"),
            join_metric("csd_population_rows", city_pop_total, len(cities),
                        "direct"),
            join_metric("csd_geometry_join", city_pop_total, city_geom_total,
                        "dguid_join"),
        ],
        "notes": [
            "City universe is 5,098 census subdivisions with a 2021 population "
            "(63 of the 5,161 CSDs have suppressed counts and are skipped).",
            "CSD polygons from the 2021 cartographic boundary file joined to "
            "population by DGUID (5161/5161); centroids transformed from the "
            "Statistics Canada Lambert projection to WGS84.",
            "Province and country centroids are derived means of member CSD "
            "polygon centroids.",
        ],
    }

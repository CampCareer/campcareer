"""Five-country official geography source registry (AU/CA/IE/GB/US).

Each entry is a 10.7B source manifest plus pipeline-only fields used by
retrieve.py (stage filename in the raw scratch dir, kind file|api, api spec).

Checksums are pinned where the raw artifact is a stable file download that was
verified live. For API-assembled artifacts the checksum is computed by
retrieve.py at assembly time and written into the manifest (None here).

Pipeline-only keys (kind, stage, api, manifest_skip) are stripped before the
manifest is written to a package.
"""

MANIFEST_KEYS = [
    "source_id", "country_code", "data_domain", "authority", "official_url",
    "retrieval_method", "licence", "usage_restriction", "refresh_cadence",
    "retrieved_at", "reviewed_at", "content_type", "checksum", "file_size",
    "parser_version", "candidate_schema_version", "raw_storage_tier", "notes",
]

XLSX_CT = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
GEOJSON_CT = "application/geo+json"
JSON_CT = "application/json"

# ---------------------------------------------------------------------------
# US
# ---------------------------------------------------------------------------
_US_POP = {
    "source_id": "us-census-sub-est2022-v1",
    "country_code": "US",
    "data_domain": "geography",
    "authority": "United States Census Bureau",
    "official_url": "https://www.census.gov/data/tables/time-series/demo/popest/2020s-national-total.html",

    "download_url": "https://www2.census.gov/programs-surveys/popest/datasets/2020-2022/cities/totals/sub-est2022.csv",    "retrieval_method": "http_download",
    "licence": "U.S. Government work - public domain",
    "usage_restriction": "attribution required",
    "refresh_cadence": "yearly",
    "content_type": "text/csv",
    "checksum": "sha256:68f32c2b125db5bd3c32e01cf604dfb72be8f48e3bffb3fb7496cbc99be8adcf",
    "file_size": 6340474,
    "raw_storage_tier": "t1",
    "notes": "2020-2022 sub-county population estimates (incorporated places). "
             "POPESTIMATE2022 is the July 1, 2022 reference population.",
    "kind": "file",
    "stage": "us_sub-est2022.csv",
}

_US_GAZ = {
    "source_id": "us-census-gazetteer-place-2020-v1",
    "country_code": "US",
    "data_domain": "geography",
    "authority": "United States Census Bureau",
    "official_url": "https://www.census.gov/geographies/reference-files/time-series/geo/gazetteer-files.html",

    "download_url": "https://www2.census.gov/geo/docs/maps-data/data/gazetteer/2020_Gazetteer/2020_Gaz_place_national.zip",    "retrieval_method": "http_download",
    "licence": "U.S. Government work - public domain",
    "usage_restriction": "attribution required",
    "refresh_cadence": "decennial",
    "content_type": "application/zip",
    "checksum": "sha256:6e5745b3e1adf7a1e024a988301d484697e2a0f25b3cf10114eef676f09d5c18",
    "file_size": 1206088,
    "raw_storage_tier": "t2",
    "notes": "2020 Gazetteer place records; official internal-point coordinates "
             "(INTPTLAT/INTPTLONG) used for city coordinates.",
    "kind": "file",
    "stage": "us_gaz_place_national.zip",
    "zip_member": "2020_Gaz_place_national.txt",
}

_US_TIGER = {
    "source_id": "us-census-tiger-state-2022-v1",
    "country_code": "US",
    "data_domain": "geography",
    "authority": "United States Census Bureau",
    "official_url": "https://www.census.gov/cgi-bin/geo/shapefiles/index.html",

    "download_url": "https://www2.census.gov/geo/tiger/TIGER2022/STATE/tl_2022_us_state.zip",    "retrieval_method": "http_download",
    "licence": "U.S. Government work - public domain",
    "usage_restriction": "attribution required",
    "refresh_cadence": "yearly",
    "content_type": "application/zip",
    "checksum": "sha256:9f3a8f72d40f7531dc10b83af742a2071170cdaf9abb88576faf4d0621770454",
    "file_size": 9967184,
    "raw_storage_tier": "t2",
    "notes": "TIGER/Line 2022 state shapefile; official state-level centroids.",
    "kind": "file",
    "stage": "us_tiger_state.zip",
}

_US_NAT = {
    "source_id": "us-census-na-est2022-pop-v1",
    "country_code": "US",
    "data_domain": "geography",
    "authority": "United States Census Bureau",
    "official_url": "https://www.census.gov/data/tables/time-series/demo/popest/2020s-national-total.html",

    "download_url": "https://www2.census.gov/programs-surveys/popest/tables/2020-2022/national/totals/NA-EST2022-POP.xlsx",    "retrieval_method": "http_download",
    "licence": "U.S. Government work - public domain",
    "usage_restriction": "attribution required",
    "refresh_cadence": "yearly",
    "content_type": XLSX_CT,
    "checksum": "sha256:df34b048747ef04a1ce0febc08bebeb9d5bafcdd644a4ab1fddf06af8635d6fa",
    "file_size": 14140,
    "raw_storage_tier": "t1",
    "notes": "National population estimates; July 1, 2022 resident population "
             "333,287,557 used for the US country record.",
    "kind": "file",
    "stage": "us_na-est2022-pop.xlsx",
}

# ---------------------------------------------------------------------------
# CA
# ---------------------------------------------------------------------------
_CA_POP = {
    "source_id": "ca-statcan-98100002-v1",
    "country_code": "CA",
    "data_domain": "geography",
    "authority": "Statistics Canada",
    "official_url": "https://www150.statcan.gc.ca/n1/tbl/csv/98100002-eng.zip",
    "download_url": "https://www150.statcan.gc.ca/n1/tbl/csv/98100002-eng.zip",    "retrieval_method": "http_download",
    "retrieval_method": "http_download",
    "licence": "Statistics Canada Open Licence",
    "usage_restriction": "attribution required",
    "refresh_cadence": "five-yearly",
    "content_type": "application/zip",
    "checksum": "sha256:36ab6c8f3f6b82d70d9dea927cb5cf04f6fbf9b543a7ad543695e6ea70d22876",
    "file_size": 551875,
    "raw_storage_tier": "t2",
    "notes": "2021 Census population counts by province and census subdivision; "
             "DGUID encodes the province in positions 10-11.",
    "kind": "file",
    "stage": "ca_98100002-eng.zip",
    "zip_member": "98100002.csv",
}

_CA_LCSD = {
    "source_id": "ca-statcan-lcsd-2021-v1",
    "country_code": "CA",
    "data_domain": "geography",
    "authority": "Statistics Canada",
    "official_url": "https://www12.statcan.gc.ca/census-recensement/2021/geo/sip-pis/boundary-limites/files-geometriques-eng.cfm",

    "download_url": None,    "retrieval_method": "http_download",
    "licence": "Statistics Canada Open Licence",
    "usage_restriction": "attribution required",
    "refresh_cadence": "five-yearly",
    "content_type": "application/zip",
    "checksum": "sha256:79a6b5022e33f2c89ead0356bf9b51c645b47684f643e916700e97842a69dbb2",
    "file_size": 40389252,
    "raw_storage_tier": "t2",
    "notes": "2021 Census Subdivision cartographic boundary file; used for CSD "
             "polygon centroids. Seed-only: no stable public download URL; "
             "archived raw file required (provide via seed_dir).",
    "kind": "file",
    "stage": "ca_lcsd000a21a_e.zip",
}

# ---------------------------------------------------------------------------
# IE
# ---------------------------------------------------------------------------
_IE_CTY = {
    "source_id": "ie-cso-sap2022-t1t2cty-v1",
    "country_code": "IE",
    "data_domain": "geography",
    "authority": "Central Statistics Office (Ireland)",
    "official_url": "https://ws.cso.ie/public/api.restful/PxStat.Data.Cube_API.ReadDataset/SAP2022T1T2CTY/PX/2013/en",
    "retrieval_method": "api_json",
    "licence": "Creative Commons Attribution 4.0",
    "usage_restriction": "attribution required",
    "refresh_cadence": "five-yearly",
    "content_type": JSON_CT,
    "checksum": "sha256:e71625803dbe1b253c99f76a261c8290dde9c0e9de9a6b886b1b11b9c211c5fb",
    "file_size": 10215,
    "raw_storage_tier": "t1",
    "notes": "Census 2022 usual resident population by local authority; sex=Both "
             "Sexes, marital-status=Total used for LA population. Seed-only: "
             "PxStat endpoint returns PX text, not this JSON; archived raw file "
             "required (provide via seed_dir).",
    "kind": "file",
    "stage": "ie_sap2022t1t2cty.json",
}

_IE_TOWN = {
    "source_id": "ie-cso-sap2022-t2t4town22-v1",
    "country_code": "IE",
    "data_domain": "geography",
    "authority": "Central Statistics Office (Ireland)",
    "official_url": "https://ws.cso.ie/public/api.restful/PxStat.Data.Cube_API.ReadDataset/SAP2022T2T4TOWN22/PX/2013/en",
    "retrieval_method": "api_json",
    "licence": "Creative Commons Attribution 4.0",
    "usage_restriction": "attribution required",
    "refresh_cadence": "five-yearly",
    "content_type": JSON_CT,
    "checksum": "sha256:b15a39ee98e1c1a9bdda708630e08057799efc028cc0751a63f03fc7b3c6aadb",
    "file_size": 115788,
    "raw_storage_tier": "t1",
    "notes": "Census 2022 town population; religion=Total used per town. "
             "Seed-only: PxStat endpoint returns PX text, not this JSON; "
             "archived raw file required (provide via seed_dir).",
    "kind": "file",
    "stage": "ie_sap2022t2t4town22.json",
}

_IE_URBAN = {
    "source_id": "ie-osi-cso-urban-areas-2022-v1",
    "country_code": "IE",
    "data_domain": "geography",
    "authority": "Tailte Eireann / Central Statistics Office (Ireland)",
    "official_url": "https://data-osi.opendata.arcgis.com/datasets/8e526e870da5496994fb3cf2f98a02c2_0",

    "download_url": "https://data-osi.opendata.arcgis.com/api/download/v1/items/8e526e870da5496994fb3cf2f98a02c2/csv?layers=0",    "retrieval_method": "http_download",
    "licence": "Creative Commons Attribution 4.0",
    "usage_restriction": "attribution required",
    "refresh_cadence": "five-yearly",
    "content_type": "text/csv",
    "checksum": "sha256:b8acb0c7f15f171575ce5a17ddf51f0e13cf58adeb9c0ed25e6ba814ad858b29",
    "file_size": 110418,
    "raw_storage_tier": "t1",
    "notes": "Census 2022 urban areas with OSI centroids (Irish Transverse "
             "Mercator) and CSO GUIDs matching SAP2022T2T4TOWN22.",
    "kind": "file",
    "stage": "ie_cso_urban_areas_2022.csv",
}

_IE_LA = {
    "source_id": "ie-osi-local-authorities-2026-v1",
    "country_code": "IE",
    "data_domain": "geography",
    "authority": "Tailte Eireann",
    "official_url": "https://data-osi.opendata.arcgis.com/datasets/74b839e09e1c48f2b2fe4efccb52a73d_3",

    "download_url": "https://data-osi.opendata.arcgis.com/api/download/v1/items/74b839e09e1c48f2b2fe4efccb52a73d/csv?layers=3",    "retrieval_method": "http_download",
    "licence": "Creative Commons Attribution 4.0",
    "usage_restriction": "attribution required",
    "refresh_cadence": "irregular",
    "content_type": "text/csv",
    "checksum": "sha256:8a9d7c11c745e1ff6a122ff8a8649e8fde8637e51c0363776b86dab397261ce9",
    "file_size": 6285176,
    "raw_storage_tier": "t2",
    "notes": "OSI PRIME2 polygon table for the 31 local authority areas; BDY_ID "
             "is the council identifier (55001-56031).",
    "kind": "file",
    "stage": "ie_local_authorities_2026.csv",
}

_IE_LA_GEOM = {
    "source_id": "ie-osi-local-authorities-geometry-2026-v1",
    "country_code": "IE",
    "data_domain": "geography",
    "authority": "Tailte Eireann",
    "official_url": "https://services-eu1.arcgis.com/FH5XCsx8rYXqnjF5/arcgis/rest/services/National_Statutory_Boundaries_-_Local_Authorities__Ungeneralised_-_2026/FeatureServer/0",
    "retrieval_method": "api_rest",
    "licence": "Creative Commons Attribution 4.0",
    "usage_restriction": "attribution required",
    "refresh_cadence": "irregular",
    "content_type": JSON_CT,
    "checksum": "sha256:98a2c1bad8570b1b9860e3616d8f372928b4db8e1da76537c588d1c959b42266",
    "file_size": 80392784,
    "raw_storage_tier": "t2",
    "notes": "LA boundary geometry assembled deterministically from the "
             "FeatureServer (sorted by OBJECTID). 9,161 ring features. "
             "Seed-only: FeatureServer rejects geojson/query params; archived "
             "raw file required (provide via seed_dir).",
    "kind": "file",
    "stage": "ie_la_geometry.json",
}

# ---------------------------------------------------------------------------
# GB
# ---------------------------------------------------------------------------
_GB_TOWNS = {
    "source_id": "gb-ons-understanding-towns-v1",
    "country_code": "GB",
    "data_domain": "geography",
    "authority": "Office for National Statistics (UK)",
    "official_url": "https://www.ons.gov.uk/peoplepopulationandcommunity/populationandmigration/populationestimates/datasets/understandingtownsandcitiesinenglandandwales",
    "retrieval_method": "http_download",
    "licence": "Open Government Licence v3.0",
    "usage_restriction": "attribution required",
    "refresh_cadence": "irregular",
    "content_type": XLSX_CT,
    "checksum": "sha256:ab675fac4f7f6e7ff37ade021a48728af362e0b23905e8458a57edd78cb84c9a",
    "file_size": 1035058,
    "raw_storage_tier": "t1",
    "notes": "Understanding Towns and Cities in England and Wales. 2019 "
             "population (final data column) used; 1,186 towns + 53 cities. "
             "Seed-only: ONS page requires interactive download; archived raw "
             "file required (provide via seed_dir).",
    "kind": "file",
    "stage": "gb_towns_datadownloadv2.xlsx",
}

_GB_BUA = {
    "source_id": "gb-ons-bua11-geojson-v1",
    "country_code": "GB",
    "data_domain": "geography",
    "authority": "Office for National Statistics (UK)",
    "official_url": "https://open-geography-portalx-ons.hub.arcgis.com/datasets/0249dcf56c7d41e5a82bcd89cc37668f",

    "download_url": "https://open-geography-portalx-ons.hub.arcgis.com/api/download/v1/items/0249dcf56c7d41e5a82bcd89cc37668f/geojson?layers=0",    "retrieval_method": "http_download",
    "licence": "Open Government Licence v3.0",
    "usage_restriction": "attribution required",
    "refresh_cadence": "decennial",
    "content_type": GEOJSON_CT,
    "checksum": "sha256:7980f0fb838a0a2b90109b85eab576d4c970efda608d64807303eedc02a55747",
    "file_size": 44214410,
    "raw_storage_tier": "t2",
    "notes": "2011 Built-up Areas (England and Wales) boundaries.",
    "kind": "file",
    "stage": "gb_bua11.geojson",
}

_GB_BUASD = {
    "source_id": "gb-ons-buasd11-geojson-v1",
    "country_code": "GB",
    "data_domain": "geography",
    "authority": "Office for National Statistics (UK)",
    "official_url": "https://open-geography-portalx-ons.hub.arcgis.com/datasets/a9ccc7783f2c40f1a52e92d20daadb1f",

    "download_url": "https://open-geography-portalx-ons.hub.arcgis.com/api/download/v1/items/a9ccc7783f2c40f1a52e92d20daadb1f/geojson?layers=0",    "retrieval_method": "http_download",
    "licence": "Open Government Licence v3.0",
    "usage_restriction": "attribution required",
    "refresh_cadence": "decennial",
    "content_type": GEOJSON_CT,
    "checksum": "sha256:527537e1ebdb93fe059e8b8888f97be9def0fe70f1abe2d91d008c6cc9ebff67",
    "file_size": 22371704,
    "raw_storage_tier": "t2",
    "notes": "2011 Built-up Area Sub-divisions (England and Wales) boundaries.",
    "kind": "file",
    "stage": "gb_buasd11.geojson",
}

_GB_REGIONS = {
    "source_id": "gb-ons-regions-2022-boundaries-v1",
    "country_code": "GB",
    "data_domain": "geography",
    "authority": "Office for National Statistics (UK)",
    "official_url": "https://open-geography-portalx-ons.hub.arcgis.com/datasets/9399e6f8c6a24a4c9ce38f95981cd86e",

    "download_url": "https://open-geography-portalx-ons.hub.arcgis.com/api/download/v1/items/9399e6f8c6a24a4c9ce38f95981cd86e/geojson?layers=0",    "retrieval_method": "http_download",
    "licence": "Open Government Licence v3.0",
    "usage_restriction": "attribution required",
    "refresh_cadence": "yearly",
    "content_type": GEOJSON_CT,
    "checksum": "sha256:bb235da5c113983448711ec0bcde4cc3eabbe2d0991fa2dcb8bba6d21caaf89e",
    "file_size": 3601017,
    "raw_storage_tier": "t2",
    "notes": "Regions (December 2022) Boundaries EW BGC; RGN22CD/RGN22NM for the "
             "9 English regions.",
    "kind": "file",
    "stage": "gb_regions_2022_boundaries.geojson",
}

_GB_COUNTRIES = {
    "source_id": "gb-ons-countries-2022-geometry-v1",
    "country_code": "GB",
    "data_domain": "geography",
    "authority": "Office for National Statistics (UK)",
    "official_url": "https://services1.arcgis.com/ESMARspQHYMw9BZ9/arcgis/rest/services/Countries_December_2022_GB_BGC/FeatureServer/0",
    "retrieval_method": "api_rest",
    "licence": "Open Government Licence v3.0",
    "usage_restriction": "attribution required",
    "refresh_cadence": "yearly",
    "content_type": GEOJSON_CT,
    "checksum": "sha256:1c30185695c779af079dc76c4ad34fcfe6b29f7048ed3ff93c5f03772c318731",
    "file_size": 12426701,
    "raw_storage_tier": "t2",
    "notes": "Countries (December 2022) GB BGC; England, Scotland and Wales "
             "polygons used for GB country centroid. Seed-only: FeatureServer "
             "output not byte-stable; archived raw file required (provide via "
             "seed_dir).",
    "kind": "file",
    "stage": "gb_countries_2022_geometry.geojson",
}

_GB_MYE = {
    "source_id": "gb-ons-mye22-v1",
    "country_code": "GB",
    "data_domain": "geography",
    "authority": "Office for National Statistics (UK)",
    "official_url": "https://www.ons.gov.uk/peoplepopulationandcommunity/populationandmigration/populationestimates/datasets/populationestimatesforukenglandandwalesscotlandandnorthernireland",
    "download_url": "https://www.ons.gov.uk/file?uri=/peoplepopulationandcommunity/populationandmigration/populationestimates/datasets/populationestimatesforukenglandandwalesscotlandandnorthernireland/mid2022/mye22final.xlsx",    "retrieval_method": "http_download",
    "retrieval_method": "http_download",
    "licence": "Open Government Licence v3.0",
    "usage_restriction": "attribution required",
    "refresh_cadence": "yearly",
    "content_type": XLSX_CT,
    "checksum": "sha256:89211116c238425a68b098b900d80b4f2f032578cf9c0d7cf5b38b20c96b6fcb",
    "file_size": 3504736,
    "raw_storage_tier": "t1",
    "notes": "Mid-2022 population estimates. MYE1 = country totals (United "
             "Kingdom 67,596,281); MYE2 Persons = region populations.",
    "kind": "file",
    "stage": "gb_mye22final.xlsx",
}

# ---------------------------------------------------------------------------
# AU
# ---------------------------------------------------------------------------
_AU_SUA = {
    "source_id": "au-abs-32180ds0004-v1",
    "country_code": "AU",
    "data_domain": "geography",
    "authority": "Australian Bureau of Statistics",
    "official_url": "https://www.abs.gov.au/statistics/people/population/regional-population/latest-release",

    "download_url": "https://www.abs.gov.au/statistics/people/population/regional-population/latest-release/32180DS0004_2001-25.xlsx",    "retrieval_method": "http_download",
    "licence": "Creative Commons Attribution 4.0 International",
    "usage_restriction": "attribution required",
    "refresh_cadence": "yearly",
    "content_type": XLSX_CT,
    "checksum": "sha256:625c7c3de3b7df1776adeb4f92764d6b332c8ff5bf4cae1b883ca5aa0abeca39",
    "file_size": 300045,
    "raw_storage_tier": "t1",
    "notes": "Regional population by age and sex; Table 2 Significant Urban "
             "Area ERP at 30 June 2025.",
    "kind": "file",
    "stage": "au_32180DS0004_2001-25.xlsx",
}

_AU_NAT = {
    "source_id": "au-abs-31010do002-v1",
    "country_code": "AU",
    "data_domain": "geography",
    "authority": "Australian Bureau of Statistics",
    "official_url": "https://www.abs.gov.au/statistics/people/population/national-state-and-territory-population/dec-2025",

    "download_url": "https://www.abs.gov.au/statistics/people/population/national-state-and-territory-population/dec-2025/31010do002_202512.xlsx",    "retrieval_method": "http_download",
    "licence": "Creative Commons Attribution 4.0 International",
    "usage_restriction": "attribution required",
    "refresh_cadence": "yearly",
    "content_type": XLSX_CT,
    "checksum": "sha256:71f6993327c4e764e7ce701129ddee6ed70d6d304a187c1944243bc3914d3a19",
    "file_size": 151736,
    "raw_storage_tier": "t1",
    "notes": "National, state and territory population; Table 8 persons all "
             "ages at 30 June 2025 for STE and national totals.",
    "kind": "file",
    "stage": "au_31010do002_202512.xlsx",
}

_AU_SUA_GEOM = {
    "source_id": "au-abs-asgs2021-sua-v1",
    "country_code": "AU",
    "data_domain": "geography",
    "authority": "Australian Bureau of Statistics",
    "official_url": "https://geo.abs.gov.au/arcgis/rest/services/ASGS2021/SUA/MapServer/0",
    "retrieval_method": "api_rest",
    "licence": "Creative Commons Attribution 4.0 International",
    "usage_restriction": "attribution required",
    "refresh_cadence": "quinary",
    "content_type": GEOJSON_CT,
    "checksum": None,
    "file_size": None,
    "raw_storage_tier": "t2",
    "notes": "ASGS 2021 Significant Urban Areas boundaries; assembled "
             "deterministically by retrieve.py (checksum computed at retrieval).",
    "kind": "api",
    "stage": "au_sua_asgs2021.geojson",
    "api": {"type": "mapserver", "url": "https://geo.abs.gov.au/arcgis/rest/services/ASGS2021/SUA/MapServer/0"},
}

_AU_STE_GEOM = {
    "source_id": "au-abs-asgs2021-ste-v1",
    "country_code": "AU",
    "data_domain": "geography",
    "authority": "Australian Bureau of Statistics",
    "official_url": "https://geo.abs.gov.au/arcgis/rest/services/ASGS2021/STE/MapServer/0",
    "retrieval_method": "api_rest",
    "licence": "Creative Commons Attribution 4.0 International",
    "usage_restriction": "attribution required",
    "refresh_cadence": "quinary",
    "content_type": GEOJSON_CT,
    "checksum": None,
    "file_size": None,
    "raw_storage_tier": "t2",
    "notes": "ASGS 2021 State and Territory boundaries; assembled "
             "deterministically by retrieve.py (checksum computed at retrieval).",
    "kind": "api",
    "stage": "au_ste_asgs2021.geojson",
    "api": {"type": "mapserver", "url": "https://geo.abs.gov.au/arcgis/rest/services/ASGS2021/STE/MapServer/0"},
}

SOURCES = [
    _US_POP, _US_GAZ, _US_TIGER, _US_NAT,
    _CA_POP, _CA_LCSD,
    _IE_CTY, _IE_TOWN, _IE_URBAN, _IE_LA, _IE_LA_GEOM,
    _GB_TOWNS, _GB_BUA, _GB_BUASD, _GB_REGIONS, _GB_COUNTRIES, _GB_MYE,
    _AU_SUA, _AU_NAT, _AU_SUA_GEOM, _AU_STE_GEOM,
]

BY_ID = {s["source_id"]: s for s in SOURCES}


def sources_for_country(cc):
    return [s for s in SOURCES if s["country_code"] == cc]

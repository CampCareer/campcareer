# Five-country official geography - coverage report

Package date: 2026-08-04  
Generated: 2026-08-04T09:03:00Z  

Selection policy: top-100 cities per country, 20-city per-region cap.

| Country | status | regions | cities (total) | cities (selected) | candidates | sources |
|---|---|---|---|---|---|---|
| US | valid | 51 | 19493 | 100 | 152 | 4 |
| CA | valid | 13 | 5098 | 100 | 114 | 2 |
| IE | valid | 31 | 867 | 100 | 132 | 5 |
| GB | valid | 9 | 1239 | 100 | 110 | 6 |
| AU | valid | 9 | 102 | 100 | 110 | 4 |
| **Total** | | **113** | **26799** | **500** | **618** | **21** |

## Per-country detail

### US  
Package: `data/candidates/geography/US/2026-08-04`  
Status: valid  
Records: {"valid": 152}  

Sources (4):
- `us-census-sub-est2022-v1`
- `us-census-gazetteer-place-2020-v1`
- `us-census-tiger-state-2022-v1`
- `us-census-na-est2022-pop-v1`

City selection by region (cap 20):
- 01: 20/462 selected
- 02: 20/149 selected
- 04: 20/91 selected
- 05: 20/500 selected
- 06: 20/482 selected
- 08: 20/272 selected
- 09: 20/30 selected
- 10: 20/57 selected
- 11: 1/1 selected
- 12: 20/411 selected
- 13: 20/538 selected
- 15: 1/1 selected
- 16: 20/199 selected
- 17: 20/1296 selected
- 18: 20/567 selected
- 19: 20/941 selected
- 20: 20/626 selected
- 21: 20/419 selected
- 22: 20/304 selected
- 23: 20/23 selected
- 24: 20/157 selected
- 25: 20/58 selected
- 26: 20/533 selected
- 27: 20/854 selected
- 28: 20/298 selected
- 29: 20/939 selected
- 30: 20/128 selected
- 31: 20/529 selected
- 32: 19/19 selected
- 33: 13/13 selected
- 34: 20/323 selected
- 35: 20/105 selected
- 36: 20/596 selected
- 37: 20/551 selected
- 38: 20/356 selected
- 39: 20/926 selected
- 40: 20/590 selected
- 41: 20/240 selected
- 42: 20/1013 selected
- 44: 8/8 selected
- 45: 20/271 selected
- 46: 20/311 selected
- 47: 20/345 selected
- 48: 20/1223 selected
- 49: 20/253 selected
- 50: 20/40 selected
- 51: 20/228 selected
- 53: 20/281 selected
- 54: 20/232 selected
- 55: 20/605 selected
- 56: 20/99 selected

Join metrics:
- state_population_join: 51 (direct)
- city_gazetteer_join: 19480 (code_join_geoid)

Notes:
- City universe is 19,493 incorporated places (SUMLEV 162) from the 2020-2022 subcounty estimates; coordinates from the 2020 Gazetteer.
- Country population is the July 1, 2022 national estimate (NA-EST2022-POP).
- State and country area are land area (ALAND) from TIGER/Line 2022.

### CA  
Package: `data/candidates/geography/CA/2026-08-04`  
Status: valid  
Records: {"valid": 114}  

Sources (2):
- `ca-statcan-98100002-v1`
- `ca-statcan-lcsd-2021-v1`

City selection by region (cap 20):
- 10: 20/372 selected
- 11: 20/98 selected
- 12: 20/95 selected
- 13: 20/266 selected
- 24: 20/1274 selected
- 35: 20/564 selected
- 46: 20/229 selected
- 47: 20/950 selected
- 48: 20/415 selected
- 59: 20/728 selected
- 60: 20/35 selected
- 61: 20/41 selected
- 62: 20/31 selected

Join metrics:
- province_population_join: 13 (direct)
- csd_population_rows: 5098 (direct)
- csd_geometry_join: 5098 (dguid_join)

Notes:
- City universe is 5,098 census subdivisions with a 2021 population (63 of the 5,161 CSDs have suppressed counts and are skipped).
- CSD polygons from the 2021 cartographic boundary file joined to population by DGUID (5161/5161); centroids transformed from the Statistics Canada Lambert projection to WGS84.
- Province and country centroids are derived means of member CSD polygon centroids.

### IE  
Package: `data/candidates/geography/IE/2026-08-04`  
Status: valid  
Records: {"valid": 132}  

Sources (5):
- `ie-cso-sap2022-t1t2cty-v1`
- `ie-cso-sap2022-t2t4town22-v1`
- `ie-osi-cso-urban-areas-2022-v1`
- `ie-osi-local-authorities-2026-v1`
- `ie-osi-local-authorities-geometry-2026-v1`

City selection by region (cap 20):
- 105001: 20/21 selected
- 115001: 14/14 selected
- 125002: 20/45 selected
- 135001: 11/11 selected
- 145001: 20/21 selected
- 15001: 17/17 selected
- 155001: 20/34 selected
- 165001: 20/33 selected
- 175001: 19/19 selected
- 185001: 20/27 selected
- 195001: 20/23 selected
- 205001: 20/21 selected
- 215003: 20/48 selected
- 225002: 20/23 selected
- 235001: 20/21 selected
- 245001: 20/45 selected
- 25001: 19/19 selected
- 255001: 20/33 selected
- 265001: 1/1 selected
- 265002: 18/18 selected
- 265003: 4/4 selected
- 265011: 1/1 selected
- 35001: 20/39 selected
- 45501: 20/107 selected
- 45511: 3/3 selected
- 55001: 20/64 selected
- 65001: 20/43 selected
- 65011: 1/1 selected
- 75001: 20/40 selected
- 85001: 20/44 selected
- 95001: 20/27 selected

Join metrics:
- la_label_join: 31 (name_normalization)
- town_guid_join: 867 (guid_join)
- town_to_la_point_in_polygon: 862 (point_in_polygon)
- town_to_la_nearest: 5 (nearest_council)

Notes:
- CSO local authority labels mapped to OSI BDY_ID via verified name normalization (31/31, incl. Dún Laoghaire Rathdown).
- Town centroids (ITM) transformed to WGS84 and joined to councils by point-in-polygon; coastal towns fall back to nearest council.
- Town population is CSO 2022 religion=Total; state total 5,149,139 is used for the country record.

### GB  
Package: `data/candidates/geography/GB/2026-08-04`  
Status: valid  
Records: {"valid": 110}  

Sources (6):
- `gb-ons-understanding-towns-v1`
- `gb-ons-bua11-geojson-v1`
- `gb-ons-buasd11-geojson-v1`
- `gb-ons-regions-2022-boundaries-v1`
- `gb-ons-countries-2022-geometry-v1`
- `gb-ons-mye22-v1`

City selection by region (cap 20):
- E12000001: 20/71 selected
- E12000002: 20/171 selected
- E12000003: 20/125 selected
- E12000004: 20/134 selected
- E12000005: 20/94 selected
- E12000006: 20/150 selected
- E12000007: 20/34 selected
- E12000008: 20/217 selected
- E12000009: 20/138 selected
- W92000004: 20/105 selected

Join metrics:
- town_geometry_join: 1239 (code_join_bua_buasd)
- region_population_join: 9 (code_join)
- town_region_join: 1239 (label_join)

Notes:
- Towns dataset uses a mix of BUA (E3400/W3800) and BUASD (E3500/W3700/K0600) 2011 codes; all 1,239 codes resolve to a boundary polygon.
- City population is the 2019 TOTAL row; region/country population is mid-2022 from the MYE2 estimates.
- The dataset covers England and Wales; English towns are assigned to the 9 English regions, Welsh towns to Wales (W92000004).

### AU  
Package: `data/candidates/geography/AU/2026-08-04`  
Status: valid  
Records: {"valid": 110}  

Sources (4):
- `au-abs-32180ds0004-v1`
- `au-abs-31010do002-v1`
- `au-abs-asgs2021-sua-v1`
- `au-abs-asgs2021-ste-v1`

City selection by region (cap 20):
- 1: 36/36 selected
- 2: 20/22 selected
- 3: 19/19 selected
- 4: 7/7 selected
- 5: 10/10 selected
- 6: 5/5 selected
- 7: 2/2 selected
- 8: 1/1 selected

Join metrics:
- sua_population_join: 102 (code_join)
- sua_to_ste_point_in_polygon: 99 (point_in_polygon)
- sua_to_ste_nearest: 3 (nearest_ste)

Notes:
- City universe is the 102 ASGS 2021 Significant Urban Areas with ERP at 30 June 2025 (cross-border SUAs appear once under their centroid state).
- State/territory population is ABS 3101.0 persons all ages at 30 June 2025; Other Territories = Australia minus the 8 states and territories.
- SUA areas are the ASGS Albers equal-area square-kilometres.

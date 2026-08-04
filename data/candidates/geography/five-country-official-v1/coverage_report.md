# Five-country official geography - coverage report

Package date: 2026-08-04
Generated: 2026-08-04T10:36:51Z

Selection policy: top-100 cities per country (population descending, no per-region cap).

| Country | status | regions | cities (total) | cities (selected) | candidates | sources |
|---|---|---|---|---|---|---|
| AU | valid | 9 | 102 | 100 | 110 | 4 |
| **Total** | | **9** | **102** | **100** | **110** | **4** |

## Per-country detail

### AU
Package: `data/candidates/geography/AU/2026-08-04`
Status: valid
Records: {"valid": 110}

Sources (4):
- `au-abs-32180ds0004-v1`
- `au-abs-31010do002-v1`
- `au-abs-asgs2021-sua-v1`
- `au-abs-asgs2021-ste-v1`

City selection by population (top-100):
- 1: 36/36 selected
- 2: 21/22 selected
- 3: 18/19 selected
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

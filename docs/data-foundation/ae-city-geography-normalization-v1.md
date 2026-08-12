# United Arab Emirates Cities — Phase 2 geography normalization v1

Status: `PHASE_2_COMPLETE`

Checkpoint: `FOUR_CITY_GEOGRAPHY_LOCKED`

Country: `AE` — United Arab Emirates

Checked: 2026-08-12

Branch: `agent/ae-cities-v1`

## Scope

Phase 2 normalizes exactly the four Phase 1 Cities:

- Abu Dhabi — `abu-dhabi`
- Sharjah — `sharjah`
- Al Ain — `al-ain`
- Dubai — `dubai`

Existing UUIDs and slugs are preserved for all four.

## Geography contract

Every selected geography uses:

- `geography_type='city'`
- `scope_kind='city'`
- `publication_tier='A'`
- `publication_status='approved_not_indexed'`
- `study_destination_scope='official_city_locality'`
- `population_geography_contract='city_scope_only_no_emirate_substitution'`
- explicit `containing_emirate`
- official local-government provenance
- `city_identifier_status='no_verified_federal_city_code'`

No unverified national City code is invented.

## City / emirate separation

Abu Dhabi, Sharjah and Dubai share names with their containing emirates. The City product remains a physical study-destination locality, not the full emirate.

Al Ain remains a distinct City/locality within Abu Dhabi emirate.

## Authority references

- Abu Dhabi City Municipality / DMT
- Al Ain City Municipality / DMT
- Sharjah City Municipality
- Dubai Municipality

Phase 2 stores these source URLs in geography metadata.

## Aliases

Two safe aliases are created per selected City:

- canonical City name
- route slug

Expected selected alias count: 8.

## Deferred scope

Phase 2 does not promote or create Tier A geography for:

- Khor Fakkan
- Ajman
- Fujairah
- Ras Al Khaimah
- Umm Al Quwain

## Validation

The Phase 2 migration was replayed transactionally against the connected production schema and rolled back. The controlled result was:

- Tier A Cities: 4
- selected aliases: 8

No production change was retained.

## Conclusion

UAE Cities Phase 2 is complete for the exact four-City scope. Physical study-location and programme assignment remain Phase 3 responsibilities.
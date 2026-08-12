# South Korea Cities — Phase 6 City Compare v1

Status: `PHASE_6_COMPLETE`

Checkpoint: `COMPARE_COMPLETE`

Country: `KR` — South Korea

Audit date: 2026-08-12

## Compare surface

Phase 6 enables South Korea on the shared City Compare route:

`/compare?type=city&country=KR&left={slug}&right={slug}`

Default pair:

- Seoul
- Busan

Duplicate-city pairs are rejected by selecting a different verified city.

## Compare-ready gate

A South Korea city is compare-ready only when it is in `SUPPORTED_KR_CITY_SLUGS` and has:

- at least one verified teaching-location representative
- at least one linked canonical institution
- verified `city_population`
- verified `student_living_cost_monthly_range`
- verified `student_transport_reference`
- verified `student_work_hours_week`
- verified `employment_focus_sectors`

Programme count is deliberately not a Compare readiness requirement. All six current Tier A cities already have strict verified-partial programme evidence, but Compare readiness remains independent of that count.

Production foundation supports all six Tier A cities under this contract.

## Comparison semantics

### Population

Population compares the exact Phase 2 MOIS/KOSIS administrative boundary with the same June 2026 resident-registration reference month.

Seoul, Busan and Daejeon use their metropolitan/special-city administrative boundaries. Suwon, Yongin and Pohang use their city administrative boundaries. No metropolitan-area or university-brand expansion is silently introduced.

### Student living-cost planning reference

The current Study in Korea living-cost planning range is national rather than city-specific.

Every row remains:

- `city_specific=false`
- `ranking_safe=false`

City Compare therefore shows the planning range as national context and never calculates a cheapest-city winner from it.

### Transport

Transport retains each local operator's current source-native fare/product basis. Per-trip, card, or other source-native products are not converted into a synthetic monthly price.

### Student work

The current student-work evidence is national immigration context and remains subject to permission, visa/status, language, academic and other eligibility conditions. It is not treated as a city differentiator.

### Institution and programme evidence

Verified institution/location counts describe the current Study in Korea provider foundation, not the complete Korean higher-education universe.

Programme evidence uses strict source-city linkage and the Phase 3 repaired teaching-location assignments:

- Seoul: 110
- Busan: 23
- Daejeon: 14
- Suwon: 8
- Yongin: 17
- Pohang: 10

The former inherited-campus leakage is prohibited:

- SKKU Suwon-source programmes must not inherit Seoul
- Kyung Hee Yongin-source programmes must not inherit Seoul

### Career environment

Official local economic-sector context is displayed without converting it into a shortage score or employment guarantee.

## SEO boundary

The shared parameterized `/compare` route remains:

`robots: { index: false, follow: false }`

Phase 6 does not add Compare URLs to the sitemap.

## Phase 6 conclusion

South Korea Cities has reached `COMPARE_COMPLETE`.

Phase 7 may publish the exact six Tier A city profiles while keeping parameterized City Compare noindex.

# Spain Cities — Phase 6 City Compare v1

Status: `PHASE_6_COMPLETE`

Checkpoint: `COMPARE_COMPLETE`

Country: `ES` — Spain

Audit date: 2026-08-11

## Compare surface

Phase 6 enables Spain on the shared City Compare route:

`/compare?type=city&country=ES&left={slug}&right={slug}`

Default pair:

- Madrid
- Barcelona

Duplicate-city pairs are rejected by selecting a different verified city.

## Compare-ready gate

A Spain city is compare-ready only when it is in `SUPPORTED_ES_CITY_SLUGS` and has:

- at least one verified teaching-location representative
- at least one linked canonical institution
- verified `city_population`
- verified `student_living_cost_monthly_range`
- verified `student_transport_reference`
- verified `student_work_hours_week`
- verified `employment_focus_sectors`

Programme count is deliberately not a Compare readiness requirement. Valencia, Granada and Bilbao therefore remain compare-ready while their programme delivery status stays `verification_pending`.

Production foundation supports all seven Tier A cities under this contract.

## Comparison semantics

### Population

Population compares like with like: the Phase 2 INE municipality boundary with the same 2025 official reference date.

### Student living-cost references

Spain does not have one equivalent official city-cost series across the seven destinations. The current records mix full-budget estimates, calculated partial components and accommodation-only references.

Every record remains `ranking_safe=false`.

City Compare therefore:

- shows the source-native range and budget scope
- does not calculate a cheapest-city winner
- does not normalize partial-cost and full-budget evidence into one synthetic index

### Transport

Transport retains each operator's own ticket eligibility and validity period. Per-trip, 30-day, 90-day and calendar-month products are not converted into a synthetic monthly price.

### Student work

The 30-hour student-work rule is national immigration context and is not treated as a city differentiator.

### Institution and programme evidence

Verified institution/location counts describe the current selected provider foundation, not Spain's complete higher-education universe.

Programme evidence is shown conservatively:

- Madrid: verified-partial
- Barcelona: verified-partial
- Sevilla: verified-partial
- Málaga: verified-partial
- Valencia: verification pending
- Granada: verification pending
- Bilbao: verification pending

A zero programme count is never presented as evidence that a city has no programmes.

### Career environment

Official local economic-sector context is displayed without converting it into a shortage score or employment guarantee.

## SEO boundary

The shared parameterized `/compare` route remains:

`robots: { index: false, follow: false }`

Phase 6 does not add Compare URLs to the sitemap.

## Phase 6 conclusion

Spain Cities has reached `COMPARE_COMPLETE`.

Phase 7 may publish the exact seven Tier A city profiles while keeping parameterized City Compare noindex.

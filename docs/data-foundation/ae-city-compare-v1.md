# United Arab Emirates Cities — Phase 6 City Compare v1

Status: `PHASE_6_COMPLETE`

Checkpoint: `COMPARE_COMPLETE`

Country: `AE` — United Arab Emirates

Audit date: 2026-08-12

Branch: `agent/ae-cities-v1`

## Compare surface

Phase 6 enables the UAE on the shared City Compare route:

`/compare?type=city&country=AE&left={slug}&right={slug}`

Default pair:

- Abu Dhabi
- Dubai

Duplicate-city pairs are rejected by selecting another compare-ready City.

## Compare-ready gate

A UAE City is compare-ready only when it is in `SUPPORTED_AE_CITY_SLUGS` and has:

- at least one verified teaching-location representative
- at least one linked canonical institution
- verified `city_population` evidence, including an explicit unavailable-at-City-scope record where appropriate
- verified `student_living_cost_monthly_range`
- verified `student_transport_reference`
- verified `student_work_hours_week`
- verified `employment_focus_sectors`

Production verification on 2026-08-12 confirms all four Tier A Cities are compare-ready:

- Abu Dhabi: 4 verified locations, 4 providers, 39 strict City-linked programmes, 5/5 core metrics
- Sharjah: 1 verified location, 1 provider, 26 strict City-linked programmes, 5/5 core metrics
- Al Ain: 1 verified location, 1 provider, 18 strict City-linked programmes, 5/5 core metrics
- Dubai: 5 verified locations, 5 providers, 15 strict City-linked programmes, 5/5 core metrics

## Comparison semantics

### Population

No emirate-wide population figure is relabelled as a City-locality population figure. The current four records explicitly preserve the unavailable-at-verified-City-scope state and therefore do not fabricate a numeric ranking.

### Student living-cost references

The four Cities do not share one equivalent official cost series. References include provider accommodation in USD, semester accommodation in AED, an explicit unavailable numeric reference, and monthly accommodation in AED.

Every record remains `ranking_safe=false`.

Compare therefore shows source-native values and does not calculate a cheapest-City winner.

### Transport

Transport retains operator-native periods and eligibility. Annual Hafilat student permits, a 30-day Sharjah Sayer subscription and the Dubai student nol product are not converted into a synthetic monthly comparison.

### Student work

The MOHRE student training and employment permit is national context. No universal weekly-hour cap is invented and it is not treated as a City differentiator.

### Institution and programme evidence

Institution and campus counts describe the selected verified provider foundation, not the complete licensed UAE higher-education universe. Programme counts remain `verified_partial` and require strict source-City linkage.

### Career environment

Local economic-sector evidence is context only. It is not converted into a shortage score, hiring probability or employment guarantee.

## SEO boundary

The shared parameterized `/compare` route remains:

`robots: { index: false, follow: false }`

Phase 6 does not add Compare URLs to the sitemap.

## Phase 6 conclusion

UAE Cities has reached `COMPARE_COMPLETE`.

Phase 7 may publish the exact four Tier A City profiles while keeping parameterized City Compare noindex.

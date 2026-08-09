# New Zealand city metrics v1

Status: `PHASE_4_COMPLETE`

Checkpoint: `METRICS_COMPLETE`

Branch: `agent/nz-cities-metrics-v1`

Base Phase 3: `03dfa695eec78ad91f3766df87a480fda20a75a9`

Production migration: `20260809123214_publish_nz_tier_a_city_metrics_v1`

Verification date: 2026-08-09

## Purpose

Publish the same five decision metrics for every approved New Zealand Tier A city without inventing programme coverage, student concessions, monthly transport products, or false methodological uniformity.

Tier A remains exactly:

- `auckland`
- `christchurch`
- `hamilton`
- `wellington`
- `dunedin`

Required metrics:

1. `city_population`
2. `student_living_cost_monthly_range`
3. `student_transport_reference`
4. `student_work_hours_week`
5. `employment_focus_sectors`

Production acceptance result: `5 cities × 5 metrics = 25 verified rows`.

## Population

All values are Stats NZ estimated resident population at 30 June 2025. The evidence stores the exact geography label and geography type rather than presenting unlike boundaries as identical.

| City | Population | Official geography used |
| --- | ---: | --- |
| Auckland | 1,547,200 | Auckland urban area |
| Christchurch | 419,200 | Christchurch City territorial authority |
| Hamilton | 192,100 | Hamilton City territorial authority |
| Wellington | 210,800 | Wellington City territorial authority |
| Dunedin | 132,800 | Dunedin City territorial authority |

Auckland uses the directly available Stats NZ urban-area place summary. The other four use the current Stats NZ territorial-authority place summaries. This is deliberately recorded in `value.geography` and `value.geography_kind` so Phase 5/6 can disclose the actual statistical basis.

These figures must not be relabelled as one common metropolitan population series.

Sources:

- https://tools.summaries.stats.govt.nz/places/UR/auckland
- https://tools.summaries.stats.govt.nz/places/TA/christchurch-city
- https://tools.summaries.stats.govt.nz/places/TA/hamilton-city
- https://tools.summaries.stats.govt.nz/places/TA/wellington-city
- https://tools.summaries.stats.govt.nz/places/TA/dunedin-city

## Student living-cost reference

CampCareer stores a monthly comparison value while retaining the official weekly source values and an explicit conversion:

`weekly source × 52 / 12`

The result is indicative, not a guaranteed budget.

| City | Monthly reference NZD | Source basis |
| --- | ---: | --- |
| Auckland | 1,867.67–1,871.70 | UoA estimated weekly university accommodation vs nearby shared-flat examples: 431–431.93 |
| Christchurch | 1,889.33–2,275.00 | UC 2026 weekly flatting and halls estimates: 436–525 |
| Hamilton | 1,521.00–2,751.67 | University of Waikato Hamilton weekly basic expenses: 351–635 |
| Wellington | 2,127.67 | Manaaki scholarship basic-living allowance proxy: 982 fortnightly / 491 weekly |
| Dunedin | 2,383.33–2,925.00 | Otago recommended 22,000–27,000 for 40 academic weeks: 550–675 weekly |

Wellington is intentionally labelled as a scholarship basic-living allowance proxy and not a market-cost survey. It remains medium-confidence comparison context rather than a claim that every Wellington student spends exactly that amount.

Sources:

- https://www.auckland.ac.nz/en/on-campus/accommodation/accommodation-options/why-live-with-us.html
- https://www.canterbury.ac.nz/study/getting-started/study-and-living-costs/living-costs
- https://www.waikato.ac.nz/study/international/preparing-to-come-to-new-zealand/cost-of-living/
- https://www.wgtn.ac.nz/international/scholarships-fees/manaaki-new-zealand-scholarships-programme/what-the-scholarship-covers
- https://www.otago.ac.nz/international/future-students/accommodation-living/living-costs

## Student transport reference

Transport is kept in source-native single-trip units. No monthly equivalent is manufactured.

| City | Reference | Eligibility / interpretation |
| --- | --- | --- |
| Auckland | NZ$1.55, one-zone single trip | registered AT HOP tertiary concession; full-time Auckland tertiary eligibility applies |
| Christchurch | NZ$2.50, single bus trip | Metrocard youth fare for ages 19–24; tertiary-specific concession ended 30 June 2025 |
| Hamilton | NZ$2.67, one-zone single trip | Bee Card adult reference; no generic tertiary concession asserted |
| Wellington | NZ$1.59, one-zone peak single trip | Metlink tertiary concession, fares effective 15 May 2026 |
| Dunedin | NZ$2.50, single bus trip | adult 19+ Bee Card flat fare; no generic tertiary concession asserted |

Sources:

- https://at.govt.nz/bus-train-ferry/fares-and-discounts/bus-and-train-fares
- https://www.metroinfo.co.nz/metrocard-and-fares/fares/
- https://www.busit.co.nz/fares/
- https://www.metlink.org.nz/getting-started/tickets-and-fares
- https://www.orc.govt.nz/orbus/fares/

## Student work rights

This is a national immigration rule, not a city differentiator.

Stored contract:

- eligible student-visa holder: up to `25` hours/week during study;
- full-time work may be allowed during eligible scheduled breaks when visa conditions permit;
- eligibility conditions apply;
- check the actual eVisa conditions;
- visas granted before 3 November 2025 may still show a 20-hour condition unless varied or replaced.

Source:

https://www.immigration.govt.nz/study/once-you-have-a-student-visa/working-on-a-student-visa/

Effective-date context:

https://www.immigration.govt.nz/about-us/news-centre/upcoming-changes-to-student-visa-work-rights/

## Employment-focus sectors

This metric is career/economic context only. It is not a shortage ranking and does not promise graduate employment or visa outcomes.

### Auckland

- Technology
- Screen and creative
- Circular economy
- Building and infrastructure
- Food and beverage
- Medtech

Source: Auckland NZ / Auckland economic-development key industries.

https://industry.aucklandnz.com/invest/key-industries

### Christchurch

- Aerospace and future transport
- Healthtech
- Cleantech
- Bioeconomy
- Antarctic gateway

Source: ChristchurchNZ growth sectors.

https://www.christchurchnz.com/business/growth-sectors/

### Hamilton

- Tech and innovation
- Logistics
- Manufacturing
- Education
- Healthcare

Source: Hamilton City Council economic-development key sectors.

https://hamilton.govt.nz/your-city/our-citys-economy/economic-development

### Wellington

- Science
- Climate action and environment
- Technology
- Screen

Source: WellingtonNZ sectors of strength.

https://www.wellingtonnz.com/business-events-conferences/hosting-your-conference-in-wellington/wellingtons-sectors-of-strength

### Dunedin

- Healthcare and social assistance
- Education and training
- Professional, scientific and technical services
- Construction
- Transport

Source: Dunedin City Council significant forecasting assumptions and current economy context.

https://www.dunedin.govt.nz/council/annual-and-long-term-plans/9-year-plan-2025-2034/section-4/significant-forecasting-assumptions

## Data contract

All Phase 4 rows are stored in `public.report_metric_evidence_city` with:

- `scope_type = city`
- the canonical Tier A geography UUID as `geography_id` and `scope_id`
- an explicit `source_name` and `source_url`
- `data_as_of`
- `last_verified_at`
- `review_status = verified`
- evidence confidence and evidence kind

The migration uses the existing `(geography_id, metric_key)` conflict contract, so reruns update evidence rather than duplicating a city metric.

## Production verification

Post-migration query confirmed every Tier A city has exactly the five required verified keys:

- Auckland: 5
- Christchurch: 5
- Hamilton: 5
- Wellington: 5
- Dunedin: 5

Total: `25`.

The migration also contains an in-transaction guard that fails unless:

- total verified rows across the five required keys equals 25; and
- every NZ Tier A city has exactly five required verified metrics.

## Programme independence

Phase 4 does not change programme coverage.

New Zealand remains at:

- canonical city programme directory rows: `0`
- programme coverage: `verification_pending`

The absence of programme rows must not block profile/compare work once the institution/location and metric gates are satisfied, and institution presence must not be converted into programme delivery.

## Phase 4 acceptance criteria

- [x] exact five-city Tier A scope retained
- [x] five required metrics exist for every city
- [x] 25 verified metric rows in production
- [x] official/primary sources used for every metric
- [x] population geography basis stored explicitly
- [x] living-cost conversion method stored explicitly
- [x] transport kept source-native
- [x] current 25-hour student-work rule stored as conditional national evidence
- [x] employment sectors labelled as context, not shortage rankings
- [x] programme catalogue gap remains independent
- [x] migration contains exact-count guards
- [x] repo contract test added

## Handoff

Proceed to Phase 5 — City Profile — using:

- `public.city_directory_nz_v1`
- `public.city_institution_directory_nz_v1`
- `public.city_programme_directory_nz_v1`
- verified rows from `public.report_metric_evidence_city`

The profile must expose the population geography label and transport eligibility/reference semantics rather than flattening them into false uniformity.

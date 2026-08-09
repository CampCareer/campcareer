# United Kingdom city metrics v1

Status: `PHASE_4_COMPLETE`

Branch: `agent/uk-cities-metrics-v1`

Parent linkage branch: `agent/uk-cities-linkage-v1`

Production migration: `20260808211719_publish_uk_tier_a_city_metrics_v1`

## Purpose

Publish the same five decision metrics used by the Canada and United States city rollouts for the ten approved UK Tier A study destinations.

Phase 4 is independent of the Phase 3 programme-verification gap. A city can have complete decision metrics while its canonical programme-to-campus coverage remains pending. Programme delivery is never inferred from institution presence.

## Metric contract

Every Tier A city must have exactly one verified row for each key in `public.report_metric_evidence_city`:

1. `city_population`
2. `student_living_cost_monthly_range`
3. `student_transport_reference`
4. `student_work_hours_week`
5. `employment_focus_sectors`

The migration guards exactly 10 Tier A cities, exactly 50 rows across these keys, and exactly five verified rows per city.

## Population

Population follows the Phase 2 publication boundary rather than a loose metro definition. The reference date is 30 June 2024 and the primary source is the Office for National Statistics Explore Local Statistics population dataset.

| City | Population | Scope |
| --- | ---: | --- |
| London | 9,089,736 | Greater London, calculated as the sum of its 33 local-authority areas |
| Manchester | 589,670 | Manchester local authority |
| Birmingham | 1,183,618 | Birmingham local authority |
| Edinburgh | 530,680 | City of Edinburgh council area |
| Glasgow | 650,300 | Glasgow City council area |
| Cardiff | 383,919 | Cardiff local authority |
| Belfast | 352,390 | Belfast local government district |
| Oxford | 166,034 | Oxford local authority |
| Cambridge | 149,352 | Cambridge local authority |
| Bristol | 494,399 | Bristol, City of local authority |

London is marked `calculated` because the public product scope is Greater London and the stored amount is the sum of the 33 constituent local-authority estimates. The other nine are source-native published geographies.

## Indicative student living cost

Living cost excludes tuition. It uses a current representative-university student budget or observed student spending benchmark and preserves source caveats rather than pretending to be a universal city price index.

| City | GBP / month | Evidence basis |
| --- | ---: | --- |
| London | 1,812.67 | UCL 2026/27 self-catered hall rent plus monthly essential costs |
| Manchester | 1,484–1,503 | University of Manchester 2026/27 undergraduate estimate |
| Birmingham | 1,373.67 | University of Birmingham weekly self-catered essential + variable budget, monthly-normalized |
| Edinburgh | 1,546 | University of Edinburgh 2026/27 undergraduate estimate |
| Glasgow | 2,318.33 | University of Glasgow 2026/27 living allowance, excluding visa/IHS/flights, monthly-normalized |
| Cardiff | 1,125.91–1,304.80 | Cardiff University private to university-accommodation international UG scenarios |
| Belfast | 1,300 | Queen's University Belfast living-cost guide including accommodation |
| Oxford | 1,405–2,105 | University of Oxford 2026/27 likely living-cost range |
| Cambridge | 1,655 | University of Cambridge 2026/27 postgraduate maintenance benchmark |
| Bristol | 1,401–1,862 | University of Bristol 2025/26 undergraduate to postgraduate observed monthly spend |

These values are directional decision evidence, not a promise that every student will spend this amount. The value JSON records special source contexts, including Cambridge's postgraduate benchmark, Bristol's 2025/26 reference year, Cardiff's exclusion of travel, and Glasgow's federal-loan allowance context.

## Student transport reference

Transport keeps the source-native ticket period. We do not force a day ticket, 28-day pass and monthly pass into a misleading single monthly figure.

| City | Reference | Product |
| --- | --- | --- |
| London | £119.90 / month | TfL 18+ Student Oyster Zones 1–2 Travelcard |
| Manchester | £63.30 / 28 days | Bee Network young person/student AnyBus product |
| Birmingham | £56 / 4 weeks | TfWM Student Regional bus |
| Edinburgh | £68 / 4 weeks | Lothian Student Ridacard |
| Glasgow | £60 / 28 days | SPT Subway adult Smartcard; no student-specific discount claimed |
| Cardiff | £49 / 28 days | Cardiff Bus 16–21 My Travel Pass product |
| Belfast | £2.50 / day | Translink yLink Metro/Glider day ticket |
| Oxford | £4.50 / day | Oxford Bus CityZone FreeFlow adult daily cap; no student-specific discount claimed |
| Cambridge | £1 / journey | CPCA Tiger Pass for age 25 or under |
| Bristol | £91.08 / month | First Bus Bristol Zone student month ticket |

Eligibility is stored explicitly where a student, youth or age-limited product is used.

## Student visa work rule

All ten cities use the same national rule because this is not a city-level differentiator.

For a Student visa holder studying full-time at degree level or above with a compliant higher education provider, the stored reference is up to 20 hours per week during term time and full-time outside term, subject to the immigration conditions that apply to the student and course.

The metric explicitly warns that below-degree, part-time and other study categories can have different or no work permission. The product must not simplify this to “all UK students can work 20 hours”.

Primary source: GOV.UK Immigration Rules Appendix Student, work conditions (ST 26).

## Employment focus sectors

Sector evidence is intended as career-market context. City-level official sources are preferred. Where the functioning labour market is published through a regional economic body, the value records that regional scope explicitly.

Regional-context examples:

- Manchester uses Greater Manchester frontier sectors.
- Cardiff uses Cardiff Capital Region priority sectors.
- Cambridge uses Cambridgeshire & Peterborough priority sectors.

London, Birmingham, Edinburgh, Glasgow, Belfast, Oxford and Bristol use city/city-authority or city investment evidence.

## Production verification

Post-migration verification confirmed:

- 10 Tier A UK cities;
- 50 rows across the five required metric keys;
- 5 metric rows per city;
- 5 `verified` rows per city;
- GBP currency for living-cost and transport references;
- no programme row or institution-to-programme inference is created by Phase 4.

## Key official references

- ONS Explore Local Statistics — Total population, mid-2024
- GOV.UK Immigration Rules Appendix Student
- UCL, University of Manchester, University of Birmingham, University of Edinburgh, University of Glasgow, Cardiff University, Queen's University Belfast, University of Oxford, University of Cambridge and University of Bristol student-cost guidance
- Transport for London, Bee Network, Transport for West Midlands, Lothian Buses, SPT, Cardiff Bus, Translink, Oxford Bus Company, Cambridgeshire & Peterborough Combined Authority and First Bus
- London City Hall, Greater Manchester Combined Authority, Growth Birmingham, City of Edinburgh Council, Invest Glasgow, Cardiff Capital Region, Belfast City Council, Oxford City Council, Cambridgeshire & Peterborough Combined Authority and Bristol City Council

## Phase 4 completion gate

Phase 4 is complete because the five-metric contract is fully populated and verified for all ten approved Tier A cities with explicit source URLs, source dates/context and guard tests.

Next branch:

`agent/uk-cities-city-compare-v1`

Phase 5 should build UK city profiles and City/Compare only from the approved Tier A allowlist, the Phase 3 linkage read models and these verified metric rows. The programme-verification gap must remain visible rather than being represented as zero available programmes.

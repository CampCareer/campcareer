# Ireland city metrics v1

Status: `PHASE_4_COMPLETE`

Branch: `agent/ie-cities-metrics-v1`

Parent branch: `agent/ie-cities-linkage-v1`

Production migration: `20260809094322_publish_ie_tier_a_city_metrics_v1`

## Scope

Phase 4 publishes the standard five verified decision metrics for the four approved Ireland Tier A destinations:

- Dublin
- Cork
- Galway
- Limerick

The programme catalogue gap from Phase 3 does not block these city metrics. Programme delivery remains `verification_pending` and must not be inferred from institution presence.

## Metric contract

Every Tier A city has exactly one verified row for each of:

1. `city_population`
2. `student_living_cost_monthly_range`
3. `student_transport_reference`
4. `student_work_hours_week`
5. `employment_focus_sectors`

Production post-check: `4 cities × 5 metrics = 20 verified rows`.

## Population

Source: Central Statistics Office, Census of Population 2022.

| City | Population | Geography basis |
| --- | ---: | --- |
| Dublin | 1,458,154 | the four Dublin local-authority areas, aligned to the Phase 2 Dublin study-market scope |
| Cork | 222,335 | Cork city and suburbs |
| Galway | 85,856 | Galway city and suburbs |
| Limerick | 103,611 | Limerick city and suburbs |

Dublin deliberately does not use the narrower `Dublin city and suburbs` value because the public Dublin destination is defined across Dublin City, Fingal, Dún Laoghaire-Rathdown and South Dublin.

## Indicative student living costs

Living-cost values remain source-specific rather than pretending the four universities use the same methodology.

| City | Monthly reference | Evidence basis |
| --- | ---: | --- |
| Dublin | €2,318 | UCD Global estimated monthly living costs per student |
| Cork | €1,181–€2,923 | UCC international monthly guide including accommodation |
| Galway | €1,628–€2,128 | calculated from current University of Galway shared-room range (€700–€1,200) plus its 2026 summer-school allowance of up to €928/month for meals and other living expenses excluding accommodation |
| Limerick | €1,547.33 | calculated from MIC 2026/27 monthly accommodation (€719), food (€322), other expenses (€452), plus €489 annual textbooks/materials amortised over nine academic months |

All are marked `indicative=true`. Galway and Limerick are marked `calculated`; Dublin and Cork preserve observed source totals/ranges.

Primary references:

- UCD: `https://www.ucd.ie/global/study-at-ucd/scholarshipsfinances/livingcosts/`
- UCC: `https://www.ucc.ie/en/international/studentinfohub/beforeyouarrive/costofliving/`
- University of Galway accommodation: `https://www.universityofgalway.ie/student-life/accommodation/off-campus/`
- University of Galway 2026 living allowance: `https://www.universityofgalway.ie/international-summer-school/faqs_contact/`
- MIC: `https://www.mic.ul.ie/international/international/essential-information/the-basics`

## Student transport reference

Source: Transport for Ireland current Leap fares.

| City | Student / Young Adult reference | Period |
| --- | ---: | --- |
| Dublin | €1.00 | TFI Dublin Zone 1 90-minute fare |
| Cork | €0.85 | city bus single journey |
| Galway | €0.65 | city bus single journey |
| Limerick | €0.65 | city bus single journey |

These are stored in their source-native periods. No artificial monthly conversion is created. Eligibility for the relevant Student/Young Adult Leap product applies.

Reference: `https://www.transportforireland.ie/fares/bus-fares/`

## Student work rights

This is national immigration evidence, not a city differentiator.

Stored contract:

- term time: up to 20 hours/week
- designated holidays: up to 40 hours/week
- context: eligible non-EEA student on Stamp 2 conditions
- `eligibility_conditions_apply=true`
- `national_rule=true`

Immigration Service Delivery currently identifies the designated vacation periods as June, July, August and September, and 15 December to 15 January. The UI must not describe this as unconditional permission for every student.

Reference: `https://www.irishimmigration.ie/registering-your-immigration-permission/information-on-registering/immigration-permission-stamps/`

## Employment-focus sectors

These rows provide local career/economic context and are explicitly not shortage rankings or employment guarantees.

### Dublin

- Technology
- Financial services
- Professional services
- Life sciences
- Transport and logistics
- Arts and recreation

Basis: Dublin city-region key industry sectors.

### Cork

- Technology and ICT
- Life sciences
- Cybersecurity
- International and business services
- Engineering and clean technology
- Energy and food innovation

Basis: Cork City Council economic profile and cluster-development priorities.

### Galway

- MedTech
- ICT and digital
- Research and innovation
- Creative and cultural industries

Basis: Galway City Council's current cluster/economic-development context. The Council explicitly describes a strong MedTech cluster and an emerging ICT cluster; research and creative activity are contextual ecosystem signals, not shortage designations.

### Limerick

- Digital and technology
- Life sciences and healthcare
- Financial and professional services
- Advanced manufacturing
- Smart energy
- Creative and media

Basis: Limerick City and County Council's published key sectors.

## Data-quality notes

1. Population definitions are aligned as closely as possible to the Phase 2 public geography contract; Dublin therefore uses the four-local-authority aggregate while the other three use CSO city-and-suburbs urban values.
2. Living-cost ranges are not directly harmonised across institutions. The UI must disclose that they are indicative source-specific student budgets.
3. Galway's value combines two current official University of Galway guides and is therefore a calculated range rather than a directly published total.
4. Transport values remain single/90-minute source-native fares rather than being converted into fictitious monthly costs.
5. Stamp 2 work hours are conditional immigration permissions.
6. Employment sectors are economic context only.
7. Phase 3 programme coverage remains `verification_pending` in all four cities.

## Phase 4 decision

`PHASE_4_COMPLETE`

All four Tier A cities have the five required verified decision metrics. Ireland can proceed to Phase 5 City profile while clearly exposing the Phase 3 programme verification gap.

Next branch:

`agent/ie-cities-profile-v1`

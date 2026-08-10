# Netherlands city metrics v1

Status: `PHASE_4_COMPLETE`

Checkpoint: `METRICS_COMPLETE`

Branch: `agent/nl-cities-metrics-v1`

Base Phase 3: `0547d915ef8f187461af2b9d90123f94cfd10f49`

Production migration: `20260810164813_publish_nl_tier_a_city_metrics_v1`

Audit date: 2026-08-10

## Purpose

Publish the same five decision metrics for exactly the five Netherlands Tier A study destinations while preserving the municipality scope established in Phase 2 and the evidence boundaries established in Phase 3.

Tier A remains exactly:

- `amsterdam`
- `maastricht`
- `rotterdam`
- `groningen`
- `eindhoven`

The required metrics are:

1. `city_population`
2. `student_living_cost_monthly_range`
3. `student_transport_reference`
4. `student_work_hours_week`
5. `employment_focus_sectors`

Production contains exactly 25 verified NL Tier A metric rows: five metrics for each of five cities.

## Population

Population uses one consistent source geography: the CBS municipality boundary fixed in Phase 2.

Source: Statistics Netherlands (CBS), `Gebieden in Nederland 2026`.

| City | CBS code | Population, 1 Jan 2026 |
| --- | --- | ---: |
| Amsterdam | `GM0363` | 941,927 |
| Maastricht | `GM0935` | 126,026 |
| Rotterdam | `GM0599` | 673,804 |
| Groningen | `GM0014` | 244,427 |
| Eindhoven | `GM0772` | 249,783 |

Every population row records `geography_kind = cbs_municipality` and the official municipality code. Province, COROP or metropolitan figures are not substituted.

## Student living-cost references

Living-cost evidence is intentionally indicative. Source methodologies are not falsely presented as a uniform market survey.

| City | Monthly EUR reference | Evidence basis |
| --- | ---: | --- |
| Amsterdam | €975–€1,500 | UvA international-student living-expense range, rent included, tuition excluded |
| Maastricht | €1,550 | UM 2026/27 Brightlands scholarship living-expense budget, normalized from a 13-month total |
| Rotterdam | €1,390 | Erasmus University College 2026/27 housing + insurance + daily-expense budget |
| Groningen | €1,000–€1,100 | University of Groningen current international-student average, tuition excluded |
| Eindhoven | €1,000–€1,500 | Study in NL national student-spending baseline |

Amsterdam and Groningen are direct city-university references. Maastricht and Rotterdam are explicit budget proxies rather than general city-market estimates.

A sufficiently complete current TU/e city-specific all-in total was not verified. Eindhoven therefore deliberately stores `reference_scope = national_baseline` and `city_specific = false` rather than fabricating precision.

## Student transport references

Transport references preserve the source-native product period. They are not converted into artificial monthly costs and they are not claimed to be student-specific concessions.

| City | Reference | Native period |
| --- | --- | --- |
| Amsterdam | GVB €3.40 | 1 hour |
| Maastricht | Arriva Dal Korting Limburg €10 | month; subscription price, 40% off-peak discount |
| Rotterdam | RET €5.50 | 2 hours |
| Groningen | Arriva Dal Korting Noord €5 | month; subscription price, 40% off-peak discount |
| Eindhoven | Bravo €5.15 | single bus trip |

The metric is a transport-price reference for decision context, not a monthly transport budget.

## Student work context

The same national IND rule is stored for all five cities because it is not a city-specific policy.

For employee work under the relevant student residence-permit context:

- up to 16 hours per week; **or**
- full-time in June, July and August;
- the employer requires a TWV;
- the choice between the weekly limit and the summer full-time route is explicit;
- self-employment is a separate rule path;
- other nationality or residence statuses may have different rights.

The city metric exists so every profile can disclose the national work context consistently. It must not be interpreted as an individual entitlement.

## Employment-focus sectors

Employment sectors are contextual summaries from municipal economic evidence. They are not shortage rankings, job guarantees or occupation-specific labour-market scores.

### Amsterdam

- ICT and digitalisation
- Financial services
- Creative industries
- Retail
- Hospitality and tourism

### Maastricht

- Health and preventive healthcare
- Knowledge economy and education
- Business services
- Retail and hospitality
- Manufacturing
- Culture and creative industries

### Rotterdam

- Port and maritime economy
- Energy transition and hydrogen
- Life Sciences and Health
- Circular economy
- Digitalisation and innovative manufacturing

### Groningen

- Knowledge and education
- Energy transition
- Health and healthy ageing
- Digital economy and ICT
- Food and agriculture

### Eindhoven

- High-tech manufacturing
- Semiconductors and microchips
- Knowledge industry and R&D
- Advanced supply-chain manufacturing
- Technology education

## Programme independence

Phase 4 does not change programme or offering linkage.

A city having all five metrics does not prove that any canonical programme is delivered there. `programme_coverage_status` remains controlled by explicit `programme_offerings.campus_id` evidence through the Phase 3 read model.

## Production verification

After migration application:

- Tier A cities: `5`
- required metrics per Tier A city: `5`
- verified required metric rows: `25`
- population rows using CBS municipality geography: `5/5`
- Phase 3 city/institution read models: unchanged
- programme delivery inference: none

## Contract test

`tests/nl-city-metrics-contract.test.ts` guards:

- the exact five-city allowlist;
- all five required metric keys;
- exactly 25 verified Phase 4 rows;
- CBS municipality codes and population scope;
- source-specific living-cost semantics;
- Eindhoven national-baseline disclosure;
- source-native transport periods;
- the 16-hour/TWV/summer work context;
- employment sectors as context rather than shortage ranking.

## Phase 4 acceptance criteria

- [x] exactly five Tier A cities are in scope
- [x] exactly five required metrics exist per Tier A city
- [x] population uses the Phase 2 CBS municipality contract
- [x] living-cost provenance and proxy/baseline limitations are explicit
- [x] transport periods remain source-native
- [x] national work context is stored consistently
- [x] employment sectors are non-ranking context
- [x] programme delivery is not inferred
- [x] production migration is applied and verified
- [x] contract test is committed

## Handoff

Proceed to Phase 5 — City Profile — using the existing Phase 3 city/institution read models plus only verified Phase 4 metric evidence.

Phase 5 must keep all five routes `noindex, follow`, show programme coverage as verification pending, disclose that the current institution set is research-university core coverage with HBO expansion still pending, and leave City Compare for Phase 6.

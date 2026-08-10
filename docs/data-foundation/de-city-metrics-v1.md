# Germany city metrics v1

Status: `PHASE_4_COMPLETE`

Checkpoint: `FIVE_CORE_METRICS_COMPLETE`

Branch: `agent/de-cities-metrics-v1`

Base Phase 3: `1030d65125a2d6764b43bbac09f27a961596a2d9`

Production migration: `20260810170732_publish_de_tier_a_city_metrics_v1`

Audit date: 2026-08-10

## Purpose

Publish the five source-backed decision metrics required for every Germany Tier A city while preserving the municipality boundary and campus/programme verification contracts established in Phases 2 and 3.

The five metrics are:

1. `city_population`
2. `student_living_cost_monthly_range`
3. `student_transport_reference`
4. `student_work_hours_week`
5. `employment_focus_sectors`

Tier A remains exactly nine cities:

- Berlin
- Munich
- Hamburg
- Aachen
- Bonn
- Dresden
- Heidelberg
- Karlsruhe
- Tübingen

Production contains exactly `45` verified Germany Tier A metric rows: five per city.

## 1. Population

Population follows the Phase 2 contract rather than each municipality's local resident-register methodology.

All nine values use the Statistische Ämter des Bundes und der Länder GV-ISys municipality geography and the official eight-digit AGS already stored on the canonical CampCareer city row.

Reference date: `2024-12-31`.

| City | AGS | Population |
| --- | --- | ---: |
| Berlin | `11000000` | 3,685,265 |
| Munich | `09162000` | 1,505,005 |
| Hamburg | `02000000` | 1,862,565 |
| Aachen | `05334002` | 262,670 |
| Bonn | `05314000` | 323,336 |
| Dresden | `14612000` | 564,904 |
| Heidelberg | `08221000` | 155,756 |
| Karlsruhe | `08212000` | 309,050 |
| Tübingen | `08416041` | 92,322 |

The values are deliberately not mixed with newer municipal registration-office counts. Those may use different population definitions and dates and would break cross-city comparability.

## 2. Student living-cost references

The living-cost metric preserves source-native university guidance. It is an indicative planning reference, not a harmonized cost-of-living index.

| City | Monthly reference | Source basis | Confidence |
| --- | ---: | --- | --- |
| Berlin | €900–1,150 | TU Berlin IMES student guidance | medium |
| Munich | about €1,500 | LMU international student guide | medium |
| Hamburg | €1,000–1,600+ | University of Hamburg MIBAS guidance | medium |
| Aachen | at least about €1,100 | RWTH international student costs | medium |
| Bonn | about €1,000 | University of Bonn international student costs | medium |
| Dresden | €750–900 | TU Dresden Hydro Science & Engineering | medium |
| Heidelberg | €895–2,013 | Heidelberg University international student financing | medium |
| Karlsruhe | €800–900 | KIT Mechanical Engineering student FAQ | medium |
| Tübingen | €900–1,200 | University of Tübingen Germany-average guidance; local housing warning | low |

Tübingen is intentionally lower-confidence because its current university page gives a Germany-wide student average while separately warning that Tübingen housing is expensive. The value is not presented as a local market survey.

## 3. Student transport references

Transport remains source-native because Germany does not have one identical student-ticket implementation across the nine destinations.

| City | Reference | Period | Important condition |
| --- | ---: | --- | --- |
| Berlin | €226.80 | semester | WS 2026/27 Deutschlandsemesterticket; equivalent €37.80/month |
| Munich | €43 | month | LMU-listed Deutschlandticket for students; provider eligibility applies |
| Hamburg | €226.80 | semester | WS 2026/27 semester public-transport pass component |
| Aachen | €226.80 | semester | WS 2026/27 Deutschlandsemesterticket; separate €7.77 Zuid-Limburg add-on |
| Bonn | €226.80 | semester | WS 2026/27 Deutschlandsemesterticket component |
| Dresden | €226.80 | semester | WS 2026/27 Deutschlandsemesterticket component |
| Heidelberg | €45–63 | month | University budget range; eligibility varies by ticket product |
| Karlsruhe | €45 | month | D-Ticket JugendBW for eligible students under 27; no local Deutschlandsemesterticket agreement |
| Tübingen | €45 | month | D-Ticket JugendBW for eligible students; naldo also offers a semester-ticket alternative |

The metric stores eligibility/enrolment conditions explicitly. Ticket references must not be read as universally available to every international student.

## 4. International student work rule

The work-rights metric is intentionally identical across all nine cities because this is a federal immigration/employment rule, not a city differentiator.

For third-country students, the source-backed reference records:

- up to `140` full days or `280` half-days per year without Federal Employment Agency approval under the student rule;
- alternatively up to `20 hours/week` during the lecture period;
- unrestricted work during semester breaks under the cited student-working framework;
- student auxiliary academic tasks are exempt from those restrictions;
- individual residence-title conditions still apply.

Source: Make it in Germany, the Federal Government's official portal for international qualified professionals.

The row carries `national_rule = true` to prevent Compare or profile code from treating work rights as a city advantage.

## 5. Employment focus sectors

Employment sectors are official economic-context signals only. They are not occupation-shortage rankings, job guarantees or visa eligibility statements.

| City | Official-context sectors |
| --- | --- |
| Berlin | Healthcare/life sciences; DigiTech; media/creative; mobility/logistics; energy/environment; photonics/microelectronics; manufacturing; services |
| Munich | ICT; automotive/mobility; life sciences/biotech/pharma; green economy; finance; creative industries |
| Hamburg | Logistics; industry/aviation; IT/ICT; media/creative; medical/pharma/biotech; life sciences; renewable energy; mobility/marine technology |
| Aachen | Energy; AI/digital; automotive/mobility; semiconductors; circular economy; high-tech research/startups; sustainable industry |
| Bonn | ICT/telecommunications; IT security; healthcare; science/research; knowledge-intensive services |
| Dresden | Microelectronics/semiconductors; nanotechnology; robotics; IoT/cloud; AI/6G; life sciences; sustainability technologies |
| Heidelberg | Healthcare/social work; scientific/technical services; education; ICT; manufacturing |
| Karlsruhe | ICT; automotive/mobility; energy; cultural/creative industries; R&D |
| Tübingen | Medical technology; biotechnology; AI/research; mechanical/tool engineering; industrial production; public research/healthcare |

Every row carries:

- `indicative = true`
- `not_shortage_ranking = true`
- `not_job_guarantee = true`

## Evidence model

All Phase 4 data is stored in existing `public.report_metric_evidence_city` rows. No new public table or client-facing privilege surface is introduced.

Each row includes:

- canonical `geography_id`
- metric key
- structured JSON value
- source name and URL
- `data_as_of`
- verification timestamp
- confidence
- evidence kind
- review status

The April 2026 Supabase Data API default-grant change therefore does not require a new table grant for this phase. Phase 4 writes into an existing evidence table and does not expand client permissions.

## Production verification

Post-migration checks returned:

- Germany Tier A verified core-metric rows: `45`
- distinct Tier A cities represented: `9`
- municipality-contract population rows: `9`
- work-rule rows with `national_rule = true`: `9`
- employment-sector rows with `not_shortage_ranking = true`: `9`
- city programme directory rows: `0`

Every city has exactly five verified core metrics.

The population guard also verifies that each metric AGS equals the Phase 2 `official_municipality_code_ags` on the same geography row.

## Programme boundary remains unchanged

Phase 4 does not convert the existing 72 Germany programmes or 72 legacy offering links into city programme evidence.

`public.city_programme_directory_de_v1` remains empty because Phase 3 has not verified explicit programme-to-teaching-campus delivery.

The truthful state remains:

`programme_coverage_status = verification_pending`

This is non-blocking for city metrics and later profile construction, but later city pages and Compare must disclose it rather than showing inferred programme counts.

## Acceptance criteria

- [x] exactly nine Tier A cities remain in scope
- [x] exactly five verified core metrics exist per city
- [x] total verified Phase 4 rows equal 45
- [x] all population values use the GV-ISys municipality/AGS contract
- [x] living costs preserve source-native methodology and confidence
- [x] transport records preserve ticket period and eligibility conditions
- [x] student work rights are explicitly federal/shared rather than city-specific
- [x] sector profiles are explicitly not shortage rankings or job guarantees
- [x] no city programme delivery is inferred
- [x] no new public table or client permission is introduced

## Handoff

Proceed to Phase 5 city detail/profile surfaces using these five verified metrics plus the Phase 3 institution linkage.

Phase 5 must continue to show programme coverage as `verification_pending` unless separate campus-level programme delivery verification is completed first.

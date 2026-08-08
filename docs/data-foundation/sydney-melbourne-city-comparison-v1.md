# Sydney vs Melbourne city comparison v1

## Scope
The first Australian city comparison uses the same canonical city and CRICOS delivery-location model for Sydney and Melbourne.

Routes:
- `/cities/au/sydney`
- `/cities/au/melbourne`
- `/cities/au/compare`
- `/programs?country=AU&city=sydney`
- `/programs?country=AU&city=melbourne`

## Verified delivery-location baseline
CRICOS Locations and Course Locations are the authority for program-city membership.

Current 4 August 2026 CRICOS snapshot after state-aware locality normalization:

| Metric | Sydney | Melbourne |
| --- | ---: | ---: |
| Registered delivery locations | 79 | 47 |
| Providers with a registered location | 22 | 17 |
| Active programs with a verified location | 3,332 | 3,025 |
| Programs registered in both cities | 397 | 397 |

A program can legitimately belong to both cities. No representative/headquarter institution city is used for this claim.

## Comparison metric contract
The comparison uses evidence rows in `public.report_metric_evidence_city` backed by `evidence.metric_observations` and dated source snapshots.

### Population
- Sydney: ABS Greater Sydney GCCSA, 5,638,830 at 30 June 2025.
- Melbourne: ABS Greater Melbourne GCCSA, 5,435,590 at 30 June 2025.
- Evidence kind: observed.

### Student living costs
- Sydney: UNSW indicative monthly range, AUD 2,645–4,166.
- Melbourne: Monash indicative annual range AUD 30,000–45,000 converted to AUD 2,500–3,750 per month by dividing by 12.
- Melbourne is explicitly `calculated`; the UI must not present it as a directly published monthly figure.
- Tuition is excluded from both comparison ranges.

### Student transport
The two cities do not publish directly equivalent student products.

Sydney comparison reference:
- AUD 50/week adult Opal weekly travel cap.
- Eligible concession cap is AUD 25/week.
- Evidence kind: observed.

Melbourne comparison reference:
- AUD 556 365-day International Student Travel Pass for eligible international students.
- Comparison-only weekly equivalent: AUD 10.69 (`556 / 52`).
- Evidence kind: calculated.
- This is not a weekly fare cap and eligibility conditions apply.

The UI must keep this caveat visible and must not declare a transport-cost winner from these two references alone.

### Student work rights
Both city pages use the national student-visa work-hours rule surfaced by the relevant state study portal: 48 hours per fortnight during study periods, with the course-not-in-session qualification retained.

### Career context
Sydney and Melbourne sector lists are qualitative destination context from Study NSW / Study Melbourne. They are not shortage rankings, salary rankings or guarantees of employment.

## Primary sources
- Australian Bureau of Statistics — Regional population 2024-25.
- UNSW Sydney — Sydney international-student cost of living.
- Monash University — Melbourne cost of living.
- Transport for NSW — Opal fares and caps.
- Transport Victoria — International Student Travel Pass.
- Study NSW — Sydney destination and student work rights.
- Study Melbourne — Melbourne career context and work while studying.
- Australian Government CRICOS — Locations and Course Locations.

## Migrations
- `20260807133904_normalize_melbourne_cricos_city_v1.sql`
- `20260807134828_publish_melbourne_city_metrics_v1.sql`

## Expansion rule
Brisbane, Perth and Adelaide should not be added by copying a city name onto institutions. Each city must first receive a state-aware CRICOS locality mapping, verified program index and an evidence-compatible city metric set.

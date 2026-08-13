# AU Electrician Career Data Foundation E2E Report

Verified checkpoint: 2026-08-13

Scope: Australia × Electrician (General) only. This work reuses the frozen `career-opportunity-v4-foundation` / 100-point methodology already used for AU Carpenter. AU Carpenter is the structural benchmark only; Electrician facts must be independently verified from current official sources.

## Current state

| State | Result |
| --- | --- |
| `decision_ready` | `false` |
| `score_ready` | `false` |
| `publish_ready` | `false` |
| score components | research in progress |
| formula | `career-opportunity-v4-foundation` |

No Opportunity Score is frozen at this checkpoint. Readiness must remain false until all nine required components have reproducible official evidence and relational lineage.

## Frozen methodology

The required components remain:

1. Shortage Signal — 20
2. Vacancy Intensity — 15
3. Industry Diversity — 5
4. Employment Momentum — 10
5. Entry Accessibility — 15
6. Relative Salary — 10
7. Projected Growth — 10
8. Visa Accessibility — 10
9. Entry Burden / Licensing — 5

Broader occupation data may be used only when the exact occupation does not publish the required statistic, and any such use must be stored and described as a proxy rather than exact Electrician (General) evidence.

## Occupation mapping — verified

Primary current Australian mapping:

- taxonomy: ABS OSCA 2024 v1;
- code: `381231`;
- title: `Electrician (General)`;
- relation: exact;
- mapping quality: high.

ABS explicitly states that registration or licensing is required for OSCA 381231.

Companion labour-market / migration mapping:

- taxonomy: ANZSCO;
- code: `341111`;
- title: `Electrician (General)`;
- relation: exact;
- mapping quality: high.

The current National Training Register maps UEE30820 Certificate III in Electrotechnology Electrician to ANZSCO 341111. Jobs and Skills Australia also retains ANZSCO 341111 while its legacy ANZSCO occupation series transitions to OSCA.

Primary sources:

- ABS OSCA 381231: https://www.abs.gov.au/statistics/classifications/osca-occupation-standard-classification-australia/2024-version-1-0/browse-classification/3/38/381/3812/381231
- JSA ANZSCO 341111 profile: https://www.jobsandskills.gov.au/data/occupation-and-industry-profiles/occupations/341111-electricians-general
- National Training Register UEE30820: https://training.gov.au/training/details/UEE30820

## Labour-market baseline — verified but not yet fully scored

JSA's exact ANZSCO 341111 profile shows 128,300 employed; this exact six-digit employment figure is Census-based rather than the current Labour Force Survey trend series.

The broader ANZSCO 3411 Electricians profile is the current JSA Labour Force Survey series and reports:

- February 2026 employment: 197,300;
- annual employment growth: +7,200;
- May 2025 median weekly earnings: AUD 2,191 versus AUD 1,852 for all occupations;
- May 2025 median hourly earnings: AUD 55 versus AUD 47 for all occupations.

These broader values are candidate inputs only where not already frozen below. The exact-vs-broader proxy relation must remain explicit in lineage.

Source: https://www.jobsandskills.gov.au/data/occupation-and-industry-profiles/occupations/3411-electricians

## Shortage Signal — frozen at 12 / 20

Canonical source is the 2025 Jobs and Skills Australia Occupation Shortage List six-digit ANZSCO/OSCA workbook.

The exact ANZSCO occupation row used for the component is:

- code: `341111`;
- title: `Electrician (General)`;
- Australia: `S`;
- ACT: `S`;
- NSW: `S`;
- NT: `S`;
- QLD: `S`;
- SA: `S`;
- TAS: `S`;
- VIC: `S`;
- WA: `S`.

JSA defines `Shortage` as an occupation in national or overall shortage. Therefore the scoring input is `severity=shortage`, `scope=national`. Under the frozen CampCareer rubric, shortage severity contributes 12 base points and national scope has a 1.00 multiplier:

`12 × 1.00 = 12 / 20`.

Evidence treatment:

- availability: `available`;
- directness: `direct`;
- mapping quality: `high`;
- evidence status: `direct_verified`;
- normalized value: `12`.

This is not a broader occupation proxy: ANZSCO 341111 is an exact companion mapping for Electrician (General). The primary current Australian identity remains OSCA 381231.

Primary source: https://www.jobsandskills.gov.au/data/occupation-shortage

Verification note: the JSA download is the production fact source. The row values were cross-checked against independent transcriptions of the 2025 JSA six-digit download because the current research toolchain does not render the XLSX binary directly; no secondary source is stored as the production source.

## Vacancy Intensity — frozen at 3 / 15 fallback

Canonical source is Jobs and Skills Australia's Internet Vacancy Index (IVI). The latest available release at this checkpoint is June 2026, released 22 July 2026.

JSA defines the IVI as a monthly count of online job advertisements lodged on SEEK, CareerOne and Workforce Australia during the reference month. Public occupation detail is available down to the ANZSCO four-digit level, so the relevant occupation series is `3411 Electricians`, not exact six-digit `341111 Electrician (General)`.

This makes the vacancy evidence an explicit broader occupation proxy:

- target occupation: ANZSCO `341111 Electrician (General)`;
- IVI occupation series: ANZSCO `3411 Electricians`;
- relation: broader;
- mapping quality: medium.

The June 2026 JSA download set includes the official `Internet Vacancies, ANZSCO4 Occupations, States and Territories - June 2026` workbook. An independent Australian government publication also reproduces JSA IVI data for Western Australia and reports 746 Electricians job advertisements for May 2026, confirming substantial live recruitment activity in the 3411 series. The JSA occupation profile reports 197,300 employed for broader 3411 Electricians in February 2026.

CampCareer vacancy methodology v1 has a stricter primary definition: distinct job postings over 90 days divided by occupation employment stock. The IVI monthly series, or a three-month average derived from it, is not a clean distinct 90-day posting numerator because the same recruitment episode may be represented across monthly periods and the published statistic is not a deduplicated 90-day inventory.

Therefore no monthly or three-month IVI count is divided by 197,300 employment and presented as a precise vacancy-rate ratio.

Frozen conservative fallback:

- intensity band: `low` = 3;
- persistence bonus: `0`;
- source quality: `official_partial`;
- employment denominator available: `true`;
- Vacancy Intensity score: `3 / 15`.

Persistence is intentionally not awarded at this checkpoint. The latest official occupation workbook is the correct source for a same-period occupation comparator, but the current research toolchain cannot render the XLSX binary row directly. A positive economy-wide annual IVI change, a shortage classification, or one state-level occupation count is not substituted for the required occupation-series persistence evidence.

Evidence treatment:

- availability: `available`;
- directness: `proxy`;
- mapping quality: `medium`;
- evidence status: `fallback`;
- normalized value: `3`;
- proxy reason: IVI is published at broader ANZSCO 3411 and does not provide a clean distinct 90-day numerator for exact Electrician (General).

Primary sources:

- JSA IVI: https://www.jobsandskills.gov.au/data/internet-vacancy-index
- JSA IVI methodology: https://www.jobsandskills.gov.au/data/internet-vacancy-index/methodology
- JSA 3411 Electricians profile: https://www.jobsandskills.gov.au/data/occupation-and-industry-profiles/occupations/3411-electricians

Official corroboration for the May 2026 WA 3411 count:

- Government of Western Australia, SkillsWest Expo showcases pathways to WA's hottest trades: https://www.wa.gov.au/government/media-statements/Cook%20Labor%20Government/SkillsWest-Expo-showcases-pathways-to-WA%27s-hottest-trades-20260723

This 3/15 result is deliberately more conservative than AU Carpenter's 4/15 fallback because Carpenter had a directly captured same-period persistence comparator supporting a +1 bonus. Electrician does not receive that bonus without equivalent evidence.

## Employment Momentum — frozen at 8.21 / 10

The frozen methodology uses recent actual occupation employment growth relative to actual same-country all-employment growth over the same period:

`occupation CAGR - national employment CAGR`.

The Australian Jobs 2025 Occupation Matrix publishes the broader ANZSCO `3411 Electricians` five-year employment row:

- November 2024 employment: 185.2k;
- five-year change to November 2024: +30.4k;
- five-year change: +19.6%;
- period: November 2019 to November 2024.

The source is based on ABS Labour Force, Australia, Detailed data trended by Jobs and Skills Australia. Because this historical series is published for ANZSCO 3411 rather than exact six-digit 341111, it is an explicit broader/medium-quality proxy for Electrician (General).

Occupation CAGR:

`(1 + 0.196)^(1/5) - 1 = 3.6445%/year`.

For the national benchmark, the same ABS Labour Force trend series gives approximately:

- November 2019 employment: 12,898.9k;
- November 2024 employment: 14,495.9k.

National employment CAGR:

`(14,495.9 / 12,898.9)^(1/5) - 1 = 2.3619%/year`.

Excess actual CAGR:

`3.6445% - 2.3619% = +1.2826 percentage points/year`.

Frozen score formula:

`clamp(5 + excess CAGR pp/year × 2.5, 0, 10)`.

Result:

`5 + 1.2826 × 2.5 = 8.21 / 10`.

Evidence treatment:

- availability: `available`;
- directness: `proxy`;
- mapping quality: `medium`;
- evidence status: `derived`;
- normalized value: `+1.2826` excess CAGR percentage points/year;
- proxy reason: the official five-year historical occupation series is published at broader ANZSCO 3411 rather than exact Electrician (General) 341111.

Primary sources:

- Australian Jobs 2025 Occupation Matrix: https://www.yourcareer.gov.au/resources/australian-jobs-report/occupation-matrix-tables
- Australian Jobs 2025 sources/methodology: https://www.yourcareer.gov.au/resources/australian-jobs-report/sources
- ABS Labour Force, Australia trend employment series: https://www.abs.gov.au/statistics/labour/employment-and-unemployment/labour-force-australia

The February 2026 3411 employment level is not mixed into this calculation. The momentum component intentionally uses the comparable November 2019 → November 2024 five-year historical window already used by the Australian Jobs 2025 matrix and the AU Carpenter benchmark.

## Visa Accessibility — strong official evidence verified

Department of Home Affairs lists Electrician (General) `341111` as eligible across multiple skilled routes, including:

- Skilled Independent subclass 189;
- Skilled Nominated subclass 190;
- Skilled Work Regional subclass 491;
- Skills in Demand subclass 482 Core Skills stream;
- Employer Nomination Scheme subclass 186 Direct Entry.

The occupation is shown on MLTSSL and CSOL, with Trades Recognition Australia as the assessing authority.

In the 4 June 2026 SkillSelect subclass 189 invitation round, Electrician (General) was invited at a minimum score of 65.

Primary sources:

- Home Affairs skilled occupation list: https://immi.homeaffairs.gov.au/visas/working-in-australia/skill-occupation-list?srckeyword=341111
- Home Affairs invitation rounds: https://immi.homeaffairs.gov.au/visas/working-in-australia/skillselect/invitation-rounds
- TRA OSAP occupations: https://www.tradesrecognitionaustralia.gov.au/osap-nominated-occupations-countries-and-sars

TRA states that Electrician (General) applicants from all countries require an OSAP assessment, subject to the stated 482/485 exceptions.

The final Visa Accessibility score is not frozen yet because the representative primary route and all rubric deductions must be reproduced in the Electrician migration/test fixture.

## Entry Accessibility — pathway verified, score pending

UEE30820 Certificate III in Electrotechnology Electrician is the current national qualification mapped to Electrician (General) 341111.

The qualification has no formal entry requirements. It includes the competencies for an unrestricted electrician licence. The National Training Register states that, where a licence/permit is not already held, competency development may require an Australian Apprenticeship contract of training; in most jurisdictions the unrestricted licence pathway requires the qualification to be completed through an apprenticeship or TRA pathway.

Primary source: https://training.gov.au/training/details/UEE30820

For overseas-qualified workers, the current `11297NAT Course in Electrician - Minimum Australian Context Gap` is specifically designed for holders of an Offshore Technical Skills Record or Australian Technical Competencies Statement for UEE30820 (or successor).

Source: https://training.gov.au/training/details/11297NAT

## Entry Burden / Licensing — material difference from Carpenter

Electrician must not inherit Carpenter's licensing score.

ABS OSCA explicitly states that registration or licensing is required. NSW provides a concrete jurisdictional example: an electrical licence or certificate is required before doing electrical wiring work, regardless of whether the work is residential, commercial or industrial. Approved qualifications and experience are required.

Primary source: https://www.nsw.gov.au/business-and-economy/licences-and-credentials/building-and-trade-licences-and-registrations/electrical

This means licensing and overseas-recognition burden must be modelled explicitly before `entry_burden` is scored. Interstate mutual-recognition rules are separate evidence and must not be generalized into a claim that an overseas worker can immediately practise nationwide.

## Components still to freeze

- industry distribution and whether a defensible HHI is available;
- final relative salary proxy/value;
- 2025–2035 occupation projection and aligned national benchmark;
- final Entry Accessibility rubric;
- final Visa Accessibility rubric;
- licensing/recognition evidence sufficient for Entry Burden rubric.

## Guardrails

- Do not copy AU Carpenter numeric values into Electrician.
- Do not use the historical `codex/au-electrician-profile-v1*` branches as fact sources.
- Do not set `decision_ready`, `score_ready` or `publish_ready` true until 9/9 components and raw → normalized → component lineage are complete.
- Do not treat a visa-list appearance as shortage evidence.
- Do not treat a live job listing as Vacancy Score evidence.
- Do not describe ANZSCO 3411 values as exact six-digit Electrician (General) values.
- Do not infer an occupation persistence bonus from economy-wide IVI changes or a single state-level count.
- Do not mix the February 2026 3411 employment stock into the November 2019 → November 2024 historical momentum calculation.

## Next implementation checkpoint

Build the Electrician raw-observation set and regression fixture only after the remaining official labour-market rows are captured. The migration should reuse the existing career-foundation schema and scoring function rather than introduce new schema or formula behavior.

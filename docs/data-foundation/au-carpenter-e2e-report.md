# AU Carpenter Career Data Foundation E2E Report

Verified: 2026-08-13

Scope: Australia × Carpenter only. This is the first cross-country extension of the frozen US Carpenter Opportunity Score methodology v1. Legacy Australia Carpenter data is regression/reference only and was not used as a fact source.

## Outcome

| State | Result |
| --- | --- |
| `decision_ready` | `true` |
| `score_ready` | `true` |
| `publish_ready` | `true` |
| `opportunity_score` | `53.98 / 100` |
| score components | `9 / 9` |
| score coverage weight | `100 / 100` |
| formula | `career-opportunity-v4-foundation` |
| user-facing confidence | `Estimated` |

## Score

| Component | Max | AU Carpenter | Evidence status |
| --- | ---: | ---: | --- |
| Shortage Signal | 20 | 12.00 | `direct_verified` |
| Vacancy Intensity | 15 | 4.00 | `fallback` |
| Industry Diversity | 5 | 0.00 | `insufficient_industry_coverage` |
| Employment Momentum | 10 | 3.95 | `derived` via broader official proxy |
| Entry Accessibility | 15 | 14.00 | `proxy` |
| Relative Salary | 10 | 4.57 | `derived` via broader official proxy |
| Projected Growth | 10 | 4.46 | `derived` via broader official proxy |
| Visa Accessibility | 10 | 9.00 | `proxy` |
| Entry Burden / Licensing | 5 | 2.00 | `proxy` |
| Total | 100 | 53.98 | `Estimated` |

## Occupation mapping

Primary current mapping is ABS OSCA 2024 v1 `372132 Carpenter`, exact/high quality.

JSA labour-market series still publish several metrics under ANZSCO, so exact `331212 Carpenter` is retained as a companion mapping. Where wage, historical change, vacancy or projection data are not published at the exact 6-digit level, `3312 Carpenters and Joiners` is stored as a broader/medium-quality proxy. The broader mapping is never presented as exact Carpenter data.

## Shortage

The 2025 Jobs and Skills Australia Occupation Shortage List classifies Carpenter as `Shortage` nationally.

Methodology mapping:

`shortage severity 12 × national scope 1.00 = 12 / 20`.

Growth and vacancy evidence are not used to infer this shortage score.

## Vacancy

The JSA Internet Vacancy Index is the official vacancy evidence source. It covers major online job-ad platforms and is a recruitment-activity proxy, not a complete count of all vacancies.

For ANZSCO 3312, the May 2026 three-month-average online-job-ad level used in the evidence record is 1,002. It is explicitly stored with `clean_distinct_90_day_numerator=false`, so it is not divided by employment as if it were a clean distinct 90-day numerator.

The v1 fallback result is:

- low intensity = 3;
- repeated-period persistence = +1;
- Vacancy Score = `4 / 15`.

## Industry Diversity

The official occupation profile names Construction and Manufacturing but does not publish usable occupation-employment shares for a comparable broad-sector HHI calculation.

No shares are invented. Result: `0 / 5 + insufficient_industry_coverage`.

## Employment Momentum

Official five-year occupation history is available at the broader ANZSCO 3312 level:

- November 2024 employment: 143.9k;
- five-year change: +10.1%;
- implied occupation CAGR: about 1.9430%/year.

The same-period Australian employment benchmark is approximately 2.3619%/year, producing excess actual CAGR of about `-0.4189 percentage points/year`.

Frozen score formula:

`clamp(5 + excess CAGR pp/year × 2.5, 0, 10)`

Result: `3.95 / 10`.

## Relative Salary

Official ANZSCO 3312 median hourly earnings are AUD 45 versus AUD 47 for all occupations in the same JSA profile.

Ratio: `45 / 47 = 0.95745`.

Result: `4.57 / 10`.

This is explicitly a broader official proxy because the exact Carpenter profile does not publish a separate median wage.

## Projected Growth

The JSA 2025–2035 projection evidence uses the broader ANZSCO 3312 row:

- Carpenters and Joiners: 149,259 → 165,554;
- projected CAGR: about 1.0415%/year.

National employment projection:

- 14.7010m → 16.6555m;
- projected CAGR: about 1.2561%/year.

Excess projected CAGR: about `-0.2145 percentage points/year`.

Result: `4.46 / 10`.

## Entry Accessibility

CPC30220 Certificate III in Carpentry has no qualification entry requirements and supports an apprenticeship pathway. Government trade-pathway evidence supports a paid, employment-linked apprenticeship structure.

Frozen rubric:

- education = 7;
- prior related experience = 3;
- paid employment-linked structured training = 4;
- total = `14 / 15`.

The four-year apprenticeship duration is not treated as four years of unpaid pre-employment study.

## Visa Accessibility

Primary representative pathway: Skilled Independent visa (subclass 189).

Carpenter appeared in the 4 June 2026 SkillSelect invitation round. The route is permanent and does not require employer sponsorship, while invitation, points and skills assessment remain meaningful eligibility requirements.

Rubric:

- occupation applicability = 3;
- employer independence = 3;
- visa eligibility burden = 1;
- long-term/permanent pathway = 2;
- total = `9 / 10`.

Subclass 482 is retained as a secondary employer-sponsored pathway and is not added to the primary score.

## Licensing and Entry Burden

Australia does not get a single generalized national Carpenter occupational-licence claim. Evidence is stored by jurisdiction and work mode.

Key evidence:

- construction induction / white-card training is mandatory for construction work and is treated as safety certification, not an occupational Carpenter licence;
- NSW contractor/licensing evidence is stored subnationally;
- WA explicitly distinguishes ordinary employees from contractor/builder registration requirements.

Ordinary employee Entry Burden under the frozen rubric:

`5 - effectively-national scope 2 - mandatory certification 1 - low acquisition difficulty 0 = 2 / 5`.

Contractor-only licences do not create an extra deduction from the employee score.

## Relational lineage

Live DB validation:

- normalized-metric input links: 15;
- component → metric links: 9;
- component → raw links: 15;
- visa pathways: 2;
- licensing evidence: 3;
- practical entry points: 5.

Reverse trace was verified for Shortage, Relative Salary, Projected Growth and Visa Accessibility from score component through normalized metric/raw observation to source key.

## Live jobs

Scoring evidence and user-facing current jobs remain separate.

At this verification cut, no individual current official-government job listing was stored in `career_foundation_job_opportunities`. A live Workforce Australia Carpenter search entry point is stored instead. This avoids preserving an expired listing as if it were active and avoids treating an individual listing as Vacancy Score evidence.

## Regression

- AU Carpenter now has an authoritative decision-ready foundation row, so the foundation read path takes precedence over legacy AU Carpenter data.
- Australia Registered Nurse remains on its existing legacy/reference path: one legacy profile remains and no AU Registered Nurse foundation profile was created.
- No second new occupation was seeded.

## Database validation

Live Supabase result after `career_data_foundation_au_carpenter`:

- snapshot `AU:carpenter:2026-08-13:v1`;
- formula `career-opportunity-v4-foundation`;
- score `53.98`;
- 9/9 components;
- coverage 100/100;
- `decision_ready=true`;
- `score_ready=true`;
- `publish_ready=true`.

No new exposed table or scoring function was created by the AU migration; it reuses the already-reviewed US foundation schema and v4 scoring function.

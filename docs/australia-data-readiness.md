# Australia report data readiness

Status: Step 1 audit, 22 July 2026
Scope: evidence required to sell Australia reports, not merely display discovery data

## Executive finding

CampCareer already has a meaningful Australia research foundation, but the first paid reports are **not ready to sell automatically**. The source registry, Jobs and Skills Australia pipeline, CRICOS lifecycle fields, QILT provider-outcome ingestion, and 39-field aggregate signal snapshot are valuable starting points. The remaining work is to bind every material report number to a dated, reviewed evidence record and to fill the city and programme-level gaps.

The release gate is intentionally strict: a recently generated aggregate snapshot is not proof that the salary, tuition, living-cost, and policy data inside it each remain current.

## Current audited coverage

The static `au-major-signals.json` snapshot was generated on **18 July 2026**. It contains 39 Australia study concepts:

| Check | Result | Interpretation |
| --- | ---: | --- |
| Concepts with a source list and aggregate verification date | 39 / 39 | Useful discovery provenance |
| Concepts with a median salary | 36 / 39 | Three salary mappings are incomplete |
| Concepts with bachelor or diploma tuition | 23 / 39 | Sixteen concepts need international-fee coverage |
| Concepts with salary, tuition, and a labour-market signal | 20 / 39 | Draft candidates for a field report |
| Concepts with per-metric data-as-of and reviewer dates | 0 / 39 | No automatic paid-report release yet |
| City-specific living-cost evidence contract | Not implemented | City reports and city-adjusted ROI are blocked |
| Course-level outcomes linked to a course | Not implemented | Provider QILT data cannot be presented as course-specific |

The 20 research candidates are: computer science, cybersecurity, nursing, aged care, allied health, dental, psychology, paramedic/emergency health, accounting, law, early childhood education, primary/secondary education, social/community services, sport/fitness, architecture, photography/film, environmental science, hospitality management, culinary arts, and beauty/wellness.

This is a coverage observation, not a publication approval. Each one still needs the metric-level evidence record below.

## Product readiness matrix

| Report | Current status | Required to open the gate |
| --- | --- | --- |
| A$9 field deep-dive | Blocked for automatic sale | Salary, bachelor/diploma tuition, and labour-market value; each must have official source URL, dataset date, review date, confidence, and observed/calculated/estimated label |
| A$9 city deep-dive | Blocked | City-specific annual living cost, housing scenario, city provider coverage, and dated source evidence |
| A$9 university deep-dive | Blocked | Active CRICOS record, verified course page, annual tuition, provider earnings/employment outcomes, and dated course/outcome evidence |
| A$29 Australia Study ROI Index 2026 | Blocked | Comparable bachelor, master, and VET rankings; provider outcomes; city costs; payback and AI methodology; policy review; full source appendix |
| A$59 personalised decision report | Blocked | The chosen options must individually pass their university, city, and field gates before personalised scenarios can be generated |
| A$149 expert review | Blocked | Expert operations, scheduling, payment, consent, and cancellation rules; it does not bypass data-quality gates |

## Source hierarchy and confidence labels

Every material number receives one of these labels in the report and its internal record:

| Label | Allowed source | Report treatment |
| --- | --- | --- |
| High | Official primary dataset or regulator record, current and directly mapped | May support a primary conclusion |
| Medium | Official aggregate, provider-level outcome, transparent calculation, or dated market estimate | May support a qualified conclusion; the limitation is visible beside the value |
| Low | Broad proxy, incomplete mapping, unreviewed extraction, or user assumption | Scenario/context only; never drives a ranking or the single recommendation alone |

`Observed` means published by the source. `Calculated` means CampCareer applied a documented formula to observed inputs. `Estimated` means a transparent proxy was required. `User-provided` is a customer assumption such as scholarship expectation or household size.

## Required evidence record

For every tuition, salary, living-cost, employment, shortage, policy, or regulatory fact used in a paid report, store:

```text
metric → source organisation → https URL → dataset/policy as-of date
       → CampCareer review date → confidence → observed/calculated/estimated
       → mapping key → methodology/assumptions → reviewer note
```

The backend contract is now represented by `report_metric_evidence_au` and `city_living_cost_profiles_au` in migration `20260722100000_au_report_evidence_and_city_costs.sql`. These tables are service-role only; a public page must never read operational review data directly.

Freshness windows are enforced in the readiness code:

- underlying data may be at most 550 days old unless an operator explicitly updates the policy;
- source review may be at most 120 days old;
- a missing or invalid date blocks sale rather than being silently replaced by the report-generation date.

For policy and visa facts, the more frequent monthly review requirement in the source registry still applies. The 550-day window is a maximum data age, not permission to ignore a policy change.

## Existing assets to preserve

- **JSA** occupation profiles, shortages, outlook, vacancies, NERO, and pathways: strong labour-market inputs with tables and ingestion migrations already present.
- **CRICOS** lifecycle fields and official-course evidence: the right foundation for international-student eligibility and tuition verification.
- **QILT GOS 2024** provider-level outcomes: useful for provider comparison, but must be labelled provider-level rather than course-level.
- **Program-page facts, TEQSA checks, training and regulatory tables**: correct private review pattern; records need to reach verified status before product claims use them.
- **Immutable source-run log**: the `data_source_runs` table can record content hashes and import status for auditable refreshes.

## Priority backlog before any paid catalogue UI

1. Add per-metric evidence records for the 20 field-report candidates, starting with nursing, computer science, cybersecurity, allied health, accounting, and early-childhood education.
2. Import and review international course tuition by provider, field, AQF level, and effective date; remove legacy hardcoded provider tuition from any report calculation.
3. Create a city living-cost dataset with rent, non-rent cost, housing scenario, city, data date, and source; do not use a national average as a personal city estimate.
4. Import QILT outcome records with cohort, outcome period, international/domestic status, provider, source date, and exact scope. Preserve the provider-versus-course limitation.
5. Build the reproducible ROI methodology version and calculation input ledger before ranking bachelor, master, or VET options.
6. Review policy, licensing, skills-assessment, and visa statements as separate evidence; an occupation-list entry is not a permanent-residency promise.

## Operational command

Run `npm run check:au-report-readiness` to print the static field backlog. Add `-- --strict` in CI or before publishing to fail while commercial evidence is incomplete.

The gate implementation is in `src/lib/au-report-readiness.ts`; it is deliberately independent of the current display cards so an attractive UI cannot accidentally make an unsupported report purchasable.

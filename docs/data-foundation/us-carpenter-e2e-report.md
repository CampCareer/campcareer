# US Carpenter Career Data Foundation E2E Report

Verified: 2026-08-12

Scope: United States × Carpenter only. This pilot does not seed or convert any second country or occupation. Australia × Registered Nurse remains the existing landing-result reference implementation and legacy regression fixture.

## Outcome

| State | Result | Meaning |
| --- | --- | --- |
| `decision_ready` | `true` | Sufficient verified market, entry, work-right/visa, jurisdiction-sensitive licensing, job-search and apprenticeship information exists for a practical country × occupation result. |
| `score_ready` | `false` | Five of nine required Opportunity Score components do not yet meet the cross-country definition and source standard. |
| `publish_ready` | `false` | Defined as `decision_ready AND score_ready`. |
| `opportunity_score` | `null` | No incomplete score is scaled, zero-filled or published. |
| scoreable component coverage | 4 of 9 components, 45 maximum-weight points | Coverage metadata only. It is not a partial Opportunity Score. |

The landing read model can use the foundation because the record is decision-ready. Ranking and comparison cannot use it because the record is not score-ready.

## Architecture

The implemented path is:

`official source -> raw observation -> canonical occupation mapping -> normalized metric -> score component -> opportunity score snapshot -> result/rank read model -> career-insight API -> landing result`

The layers are stored separately:

- `career_official_sources`: source register and verification metadata.
- `career_foundation_profiles`: country × canonical occupation and decision readiness.
- `career_occupation_mappings`: canonical-to-official taxonomy mappings.
- `career_raw_observations`: source observations, including explicit unavailable observations.
- `career_normalized_metrics`: deterministic transformations from raw observation references.
- `career_score_components`: component inputs and generated component scores.
- `career_opportunity_score_snapshots`: versioned required-component set.
- `career_foundation_blockers`: hard, conditional and informational blockers.
- `career_foundation_entry_points`: job-search, apprenticeship, visa and licensing-check starting points.
- `career_opportunity_score_calculated_v1`: calculates readiness and final score.
- `career_foundation_result_v1`: latest landing/API result.
- `career_foundation_rankable_v1`: only score-ready and publish-ready rows.

`score_value` is a generated database column. The final `opportunity_score` is calculated by a view only when all required components are present and scoreable. There is no manually seeded final score column in the foundation.

## Source hierarchy

Priority used for this pilot:

1. Official federal primary sources and official taxonomies.
2. Official federal services when the service is the appropriate user entry point.
3. No commercial aggregation was promoted into a score input.
4. Legacy CampCareer v1/v2 values were used only as regression comparison data.

Registered sources:

| Source key | Authority | Use |
| --- | --- | --- |
| `us-soc-2018` | U.S. Bureau of Labor Statistics | Federal occupation taxonomy. |
| `us-onet-carpenters` | U.S. Department of Labor / O*NET | Detailed Carpenter occupation definition and apprenticeship linkage. |
| `us-bls-oews-2025` | U.S. Bureau of Labor Statistics | May 2025 national wage benchmark. |
| `us-bls-ep-2024-2034` | U.S. Bureau of Labor Statistics | 2024 to 2034 employment projections and annual openings. |
| `us-bls-ooh-carpenters` | U.S. Bureau of Labor Statistics | Entry pathway and employer-industry context. |
| `us-careeronestop` | U.S. Department of Labor ETA | Official job-search entry point and annual wage display context. |
| `us-apprenticeship-job-finder` | U.S. Department of Labor | Verified apprenticeship search starting point. |
| `us-dol-h2b` | U.S. Department of Labor | H-2B temporary non-agricultural requirements. |
| `us-dol-perm` | U.S. Department of Labor | Permanent labor certification requirements. |
| `us-osha-outreach` | Occupational Safety and Health Administration | Federal Outreach Training status and caveats. |

Source URLs and `last_verified_on` are stored in `career_official_sources` and repeated where blocker applicability requires direct traceability.

## Canonical occupation mapping

Primary mapping:

- canonical occupation: `carpenter`
- country: `US`
- taxonomy: `SOC`
- taxonomy version: `2018`
- official code: `47-2031`
- official title: `Carpenters`
- relation: `exact`
- mapping quality: `high`
- rationale: CampCareer Carpenter scope matches the federal detailed SOC occupation without broadening or narrowing.

Companion detailed mapping:

- taxonomy: `O*NET-SOC`
- version recorded for verification: `2026`
- code: `47-2031.00`
- title: `Carpenters`
- relation: `exact`
- mapping quality: `high`

The mapping is not inferred from legacy occupation rows.

## Raw observations

| Metric | Raw value | Availability | Direct/proxy | Source |
| --- | ---: | --- | --- | --- |
| occupation definition | O*NET 47-2031.00 Carpenters | available | direct | O*NET |
| median hourly wage | USD 29.12/hour, May 2025 | available | direct | BLS OEWS |
| all-occupations median hourly benchmark | USD 24.51/hour, May 2025 | available | direct | BLS OEWS |
| median annual wage for result display | USD 60,580/year, May 2025 | available | direct | CareerOneStop, BLS OEWS-backed official service |
| employment total | 959,000, 2024 projection base | available | direct | BLS Employment Projections |
| projected employment | 1,002,100, 2034 | available | direct | BLS Employment Projections |
| projected growth | 4.5%, 2024 to 2034 | available | direct | BLS Employment Projections |
| all-occupations growth benchmark | 3.1%, 2024 to 2034 | available | direct benchmark | BLS Employment Projections |
| projected annual openings | 74,100/year, 2024 to 2034 average | available | direct | BLS Employment Projections |
| all-occupations annual openings | 18,863,300/year | available | direct benchmark | BLS Employment Projections |
| all-occupations employment | 169,956,100 | available | direct benchmark | BLS Employment Projections |
| major employer-industry shares | 84% published coverage across listed major groups | available | direct | BLS OOH |
| typical entry education | High school diploma or equivalent | available | direct | BLS Employment Projections |
| related work experience | None | available | direct | BLS Employment Projections |
| typical on-the-job training | Apprenticeship | available | direct | BLS Employment Projections |
| nationwide formal shortage signal | `null` | unavailable | direct assessment of source gap | See reason below |
| nationally comparable vacancy intensity | `null` | unavailable | direct assessment of source gap | CareerOneStop evaluated but not promoted |
| H-2B route conditions | employer required; qualifying temporary need required | available | direct | U.S. DOL |
| PERM route conditions | employer-filed, case-specific labor certification | available | direct | U.S. DOL |
| single federal Carpenter personal license | `null` | unavailable as a national rule | direct assessment of scope | BLS national entry context |
| OSHA Outreach status | voluntary federally; not a certification or license | available | direct | OSHA |

Unavailable observations always have `raw_value = null`, `availability = unavailable` and a non-empty reason.

## Normalized metrics

### Relative salary

Input:

`29.12 / 24.51`

Result:

`relative_salary_ratio = 1.1880864953...`

This uses an occupation wage divided by the same-period national all-occupations benchmark. It does not use absolute USD bands.

### Projected growth relative to national benchmark

Input:

`4.5% - 3.1%`

Result:

`projected_growth_excess_pp = 1.4 percentage points`

### Employment momentum

Input:

`(74,100 / 959,000) / (18,863,300 / 169,956,100)`

Result:

`annual_openings_intensity_ratio = 0.6961754204...`

This is named `employment_momentum`. It is not called vacancy trend or vacancy intensity because the input is projected annual openings, not a live vacancy observation.

### Entry accessibility proxy

BLS qualitative inputs are converted through a deterministic CampCareer rubric:

- high school diploma or equivalent: 7 points
- no related work experience: 3 points
- apprenticeship training burden: 0 points

Result: `10 / 15`

This normalized metric is explicitly stored as `directness = proxy`, `mapping_quality = medium` with `proxy_reason`. It must never be represented as a BLS score.

## Opportunity Score components

Formula version: `career-opportunity-v2-foundation`

| Component | Max | Normalized input | Score | Availability | Direct/proxy | Decision |
| --- | ---: | ---: | ---: | --- | --- | --- |
| `shortage_signal` | 20 | `null` | `null` | unavailable | direct | No validated nationwide comparable Carpenter shortage designation. Growth/openings are not relabeled as shortage. |
| `vacancy_intensity` | 15 | `null` | `null` | unavailable | direct | CareerOneStop has listings, but a comprehensive national SOC-level vacancy series with stable denominator and cross-country methodology was not validated. |
| `industry_diversity` | 5 | `null` | `null` | unavailable | direct | Major industry shares exist, but residual coverage and cross-country normalization are not yet sufficient for a score. |
| `employment_momentum` | 10 | 0.6961754204... | 3.48 | available | direct | Relative projected openings intensity. |
| `entry_accessibility` | 15 | 10 | 10.00 | available | proxy | Deterministic ordinal rubric from BLS entry categories. |
| `relative_salary` | 10 | 1.1880864953... | 6.88 | available | direct | Same-country relative wage benchmark. |
| `projected_growth` | 10 | 1.4 pp | 5.70 | available | direct | Growth above the all-occupations benchmark. |
| `visa_accessibility` | 10 | `null` | `null` | unavailable | direct | H-2B and PERM are employer/case/status dependent and do not justify a single occupation-level access score independent of the applicant. |
| `entry_burden` | 5 | `null` | `null` | unavailable | direct | State, municipal, contractor, employer, project and safety requirements vary too much for one national Carpenter burden score. |

Because five required components are unavailable, `score_ready = false` and final `opportunity_score = null`. The four component scores are diagnostic intermediates and are not summed or rescaled into a public score.

## Visa and work-right blockers

`work_rights` is a hard blocker for a foreign national who does not otherwise hold applicable U.S. employment authorization. The foundation does not infer an individual's right to work.

`visa` is a conditional blocker. H-2B requires a qualifying employer temporary need. PERM is employer-filed and case-specific. Neither route is an occupation-specific Carpenter entitlement or a sponsorship/approval guarantee.

These facts are exposed as decision data and blockers, while `visa_accessibility` remains unavailable as a country × occupation score component until a defensible non-personalized comparative method exists.

## Licensing, registration and safety training

The foundation does not assert one nationwide Carpenter personal-license requirement.

A conditional licensing blocker instructs the read model to check state, municipality, contractor role, project and employer rules for the intended work location. OSHA Outreach Training is recorded separately: federal OSHA describes the Outreach program as voluntary and not a certification or license, while state/local/employer/union requirements may still apply.

For that reason `entry_burden` remains unavailable instead of treating absence of a federal personal license as a low burden score.

## Employer, job-search and training entry points

Decision-ready entry points:

- CareerOneStop job search: official government-sponsored job-search starting point. Listing counts are not used as a national vacancy statistic.
- Apprenticeship.gov Job Finder: verified training/apprenticeship search starting point.
- U.S. DOL H-2B requirements: official temporary-work route context.
- U.S. DOL PERM requirements: official permanent labor-certification context.
- OSHA Outreach: official federal safety-training status plus prompt to verify subnational requirements.

The pilot does not invent an employer list. A real official job-search entry point satisfies the employer/job-search decision requirement without presenting scraped or stale employer names as canonical data.

## Landing and API read behavior

`/api/home/career-insight` continues to use the existing route but its server read layer now checks the foundation first.

For United States × Carpenter:

- `readModelSource = career_data_foundation`
- the full `foundation` object is returned with readiness, raw observations, normalized metrics, score components, blockers, sources and entry points
- the compatibility `profile` is derived from foundation data only so the existing landing layout does not require a redesign
- `profile.metric.opportunityScore = null`
- `profile.metric.scoreStatus = not_ready`
- `vacanciesThreeMonthAvg = null`
- `employmentGrowth5yPct = null`
- BLS 2024 to 2034 growth is carried only as the ten-year projection field
- market-demand display context uses projected annual openings and growth with an explicit statement that these are not live vacancies or a formal shortage signal
- CareerOneStop and Apprenticeship.gov feed work/training entry links
- H-2B/PERM feed official visa-pathway context

If a foundation row exists but is not decision-ready, the read layer suppresses legacy country-occupation data rather than falling back to it. This prevents an old record from silently overriding a newer but incomplete foundation record.

For ranking/comparison:

- any country present in foundation is removed from the legacy recommendation candidate set
- the foundation country is added back only when `decision_ready`, `score_ready`, `publish_ready` and final score are all valid
- current US Carpenter is therefore not rankable

## Legacy regression comparison

Legacy values are not used as facts in the foundation.

Current legacy regression snapshots in Supabase at verification time:

| Profile | Legacy state | Legacy score | Legacy formula |
| --- | --- | ---: | --- |
| `US:carpenter` | `profile_ready` | 30 provisional | `career-opportunity-us-v1` |
| `AU:registered-nurse` | `decision_ready` | 93 provisional | `career-opportunity-v1` |

The old US Carpenter score is intentionally suppressed whenever the foundation row exists. The new foundation returns no final score because required inputs are missing rather than interpreting missing shortage/vacancy/etc. as zero.

Australia × Registered Nurse has no new foundation profile in this pilot. It therefore continues through the existing legacy/reference path and its dedicated landing implementation remains unchanged.

## QA and database validation

Validated against the live Supabase project after migration:

- foundation profile count: 1
- profile: `US:carpenter` only
- normalized-metric references missing a raw observation: 0
- component raw-input references missing a raw observation: 0
- component normalized references missing a normalized metric: 0
- unavailable raw observations violating null/reason rules: 0
- proxy normalized/component rows missing a proxy reason: 0
- `US:carpenter` rows in `career_foundation_rankable_v1`: 0
- `decision_ready = true`
- `score_ready = false`
- `publish_ready = false`
- `opportunity_score = null`
- scored required components: 4 of 9
- scoreable weight coverage: 45 of 100, metadata only

Supabase security advisor initially detected mutable `search_path` on the two new scoring functions. A follow-up migration fixes both functions to `search_path = pg_catalog`. Performance advisor initially identified four new foreign keys without covering indexes; the follow-up index migration fixes them. Remaining advisor findings are pre-existing project-wide items or expected unused-index notices on newly created indexes and were not changed as part of this pilot.

## Test coverage

Repository tests cover:

- 100-point component maxima contract
- deterministic score formulas
- missing data remains null and cannot become zero
- unavailable reason requirement
- proxy reason requirement
- incomplete component set cannot yield a final score
- non-score-ready record cannot become rankable
- foundation precedence over legacy US Carpenter
- legacy fallback remains available for AU Registered Nurse when no foundation exists
- schema layer separation
- raw unavailable constraint contract
- generated component scores and calculated final score
- exact SOC/O*NET canonical mapping
- rank-view readiness filter
- career-insight suppression of legacy data when foundation exists
- no fake vacancy, five-year growth or final score in compatibility projection
- foundation API read includes provenance, normalized metrics, components, blockers and entry points

## Structural issues to resolve before a second occupation

Do not start a second country × occupation until the team makes explicit decisions on these cross-country contracts:

1. Define or source a country-comparable `shortage_signal` methodology that does not relabel generic growth/openings as shortage.
2. Define a vacancy-intensity source standard with occupation coverage, denominator, observation window and cross-country comparability.
3. Define `industry_diversity` normalization and the minimum sector-share coverage required for scoring.
4. Define a non-personalized `visa_accessibility` market score, or remove it from the country × occupation score if it cannot be separated from applicant/employer circumstances.
5. Build a subnational licensing/registration evidence model if `entry_burden` is to be comparable for decentralized occupations such as U.S. Carpenter.
6. Replace array-based lineage references with relational lineage tables if database-enforced observation-to-normalization-to-component foreign-key integrity is required at scale. The pilot currently combines DB constraints with QA reference checks.
7. Add an explicit landing readiness/status treatment so users can see `score_ready = false` without depending on the absence of a number. The API contract already exposes the state.
8. Freeze and review the entry-accessibility proxy rubric before reuse. It is deterministic and labeled as a proxy, but it is still a CampCareer methodology choice rather than an official-source score.

## Checklist for the next country × occupation worker

- [ ] Start from the reviewed foundation schema and do not alter the legacy values to make the new profile look complete.
- [ ] Create one canonical country × occupation profile only.
- [ ] Register every source with authority, source type and verification date.
- [ ] Record canonical mapping relation and mapping quality before ingesting market observations.
- [ ] Store official observations as raw data before normalization.
- [ ] Record unavailable observations explicitly with `null` and a reason.
- [ ] Keep direct observations and proxies separate; proxies require `proxy_reason` and quality metadata.
- [ ] Use same-country benchmark normalization for cross-country score inputs where the concept is relative.
- [ ] Name metrics after what is actually observed.
- [ ] Add licensing/work-right/visa facts both to decision data and blocker records with applicability scope.
- [ ] Add a real official employer/job-search starting point and a verified education/training path.
- [ ] Calculate component scores deterministically from normalized inputs.
- [ ] Do not calculate a final score until every required component satisfies its source and formula definition.
- [ ] Verify `decision_ready`, `score_ready` and `publish_ready` independently.
- [ ] Confirm a foundation row suppresses the corresponding legacy row in API, ranking and comparison selection.
- [ ] Run provenance, missing-data, proxy, deterministic-formula, API and regression tests before considering the profile complete.

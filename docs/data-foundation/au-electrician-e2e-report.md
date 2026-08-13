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

## Labour-market baseline — verified but not yet scored

JSA's exact ANZSCO 341111 profile shows 128,300 employed; this exact six-digit employment figure is Census-based rather than the current Labour Force Survey trend series.

The broader ANZSCO 3411 Electricians profile is the current JSA Labour Force Survey series and reports:

- February 2026 employment: 197,300;
- annual employment growth: +7,200;
- May 2025 median weekly earnings: AUD 2,191 versus AUD 1,852 for all occupations;
- May 2025 median hourly earnings: AUD 55 versus AUD 47 for all occupations.

These broader values are candidate inputs only. Before scoring, historical momentum, vacancy and projection periods must be aligned to the same methodology used for AU Carpenter and the exact-vs-broader proxy relation must be explicit in lineage.

Source: https://www.jobsandskills.gov.au/data/occupation-and-industry-profiles/occupations/3411-electricians

## Shortage Signal — source fixed, value pending direct row capture

Canonical source is the 2025 Jobs and Skills Australia Occupation Shortage List six-digit ANZSCO/OSCA workbook.

The official workbook has been identified. The Electrician (General) row must be captured directly from that official dataset before the Shortage component is frozen; no secondary transcription will be used as the production fact source.

Source: https://www.jobsandskills.gov.au/data/occupation-shortage

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

- direct 2025 OSL Electrician (General) row and shortage severity/scope;
- JSA IVI vacancy evidence and persistence semantics;
- industry distribution and whether a defensible HHI is available;
- five-year actual employment history and aligned national benchmark;
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

## Next implementation checkpoint

Build the Electrician raw-observation set and regression fixture only after the remaining official labour-market rows are captured. The migration should reuse the existing career-foundation schema and scoring function rather than introduce new schema or formula behavior.

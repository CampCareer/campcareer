# Japan city scope v1

Status: `PHASE_1_COMPLETE`

Branch: `agent/jp-cities-v1`

Base Phase 0 commit: `a40dc01291bec9c8c56e31f111921a42aaa64a33`

Audit date: 2026-08-12

Checkpoint: `TIER_A_SCOPE_LOCKED`

## Purpose

Select the first public Japan `/cities` cohort and define Phase 2 geography-normalisation guardrails without allowing raw Study in Japan location labels, prefecture labels, primary-publication campus rows or inherited programme offering links to dictate city delivery.

Phase 1 does not mutate production geography, create teaching-campus records, publish city routes, create city read models, change SEO, or assign programme delivery.

## Decision

Japan Tier A v1 contains exactly seven initial study destinations, in publication order:

1. Tokyo — `tokyo`
2. Kyoto — `kyoto`
3. Nagoya — `nagoya`
4. Sendai — `sendai`
5. Suita — `suita`
6. Tsukuba — `tsukuba`
7. Fukuoka — `fukuoka`

Initial route contract:

- `/cities/jp/tokyo`
- `/cities/jp/kyoto`
- `/cities/jp/nagoya`
- `/cities/jp/sendai`
- `/cities/jp/suita`
- `/cities/jp/tsukuba`
- `/cities/jp/fukuoka`

This is a bounded first CampCareer Japan destination cohort. The order is a publication sequence, not a ranking of Japanese student cities.

## Selection methodology

A destination qualifies for Tier A v1 when the current foundation supports all of the following without inventing evidence:

1. a meaningful programme/provider anchor or a high-value reconciliation case exists;
2. an official administrative/statistical geography can be encoded in Phase 2;
3. official institution evidence can establish physical teaching locations in Phase 3;
4. the destination can be kept separate from neighbouring municipalities and prefecture labels;
5. multi-campus assignment risk is surfaced rather than hidden;
6. later Five Core Metrics can be sourced with explicit scope semantics;
7. programme counts can remain unpublished until strict teaching-location verification is complete.

## Current source evidence used for scope selection

Raw source labels are not normalized city counts. They are shown only to explain why each destination is in the first verification cohort.

| Tier A destination | Current raw source evidence | Current provider signal | Scope implication |
| --- | ---: | ---: | --- |
| Tokyo | 26 rows under raw `Tokyo` | 3 institutions | Two Hitotsubashi rows conflict with current Kunitachi publication location; all Tokyo rows remain verification-pending until actual teaching location is resolved. |
| Kyoto | 12 | 4 | City label is usable as a reconciliation anchor, but each provider/programme still needs physical teaching-location verification. |
| Nagoya | 25 | 1 | Strong current programme foundation at Nagoya University; Aichi-labelled private-provider rows do not automatically join Nagoya. |
| Sendai | 23 | 1 | Strong current Tohoku University foundation. |
| Suita | 15 rows under raw `Osaka` from The University of Osaka | 1 | High-value correctness case: raw `Osaka` cannot become Osaka City. Current primary publication location is Suita, but programme-level assignment remains unverified. |
| Tsukuba | 11 | 1 | Strong University of Tsukuba foundation. |
| Fukuoka | 5 | 1 | Current Kyushu University foundation supports a bounded first profile once physical locations are verified. |

These numbers are scope/reconciliation evidence only. They are not publication-ready programme inventories.

## Tier A decisions

### Tokyo

Decision: `TIER_A`

Public slug: `tokyo`

Current production geography: exists.

Raw source evidence: `26` rows across `3` institutions.

Phase 2 scope lock:

- public `tokyo` is the Tokyo 23 special wards urban-core aggregate for this city product, not all of Tokyo Metropolis;
- Phase 2 must encode that aggregate explicitly and must not invent a single municipality code for the 23-ward aggregate;
- population must use one reproducible official Tokyo source for the same 23-ward aggregate;
- Kunitachi, Kashiwa, Yokohama, Ichikawa and other municipalities outside the 23 special wards must never be silently inherited into `tokyo`.

Phase 3 guardrails:

- The University of Tokyo operates major campuses including Hongo, Komaba and Kashiwa; only programmes with teaching evidence inside the locked Tokyo scope may count toward Tokyo;
- Science Tokyo operates Tokyo campuses as well as Yokohama and Konodai/Ichikawa locations; institution identity must not pull all programmes into Tokyo;
- Hitotsubashi University's Kunitachi campus is outside the locked Tokyo core; the two raw `Tokyo` programme rows are blocked from Tokyo city coverage until explicit programme teaching evidence proves otherwise.

Official location sources:

- https://www.u-tokyo.ac.jp/en/about/access.html
- https://www.isct.ac.jp/en/001/access
- https://www.hit-u.ac.jp/eng/about/direction/kunitachi.html

### Kyoto

Decision: `TIER_A`

Public slug: `kyoto`

Current production geography: exists.

Raw source evidence: `12` rows across `4` institutions.

Why selected:

- current source coverage is broader than a single provider;
- an exact Kyoto City geography can be normalized;
- official provider pages can support a bounded teaching-location verification pass.

Guardrail:

- Kyoto City must remain distinct from Kyoto Prefecture and neighbouring municipalities;
- a provider carrying `Kyoto` branding does not automatically prove delivery inside Kyoto City.

### Nagoya

Decision: `TIER_A`

Public slug: `nagoya`

Current production geography: exists.

Raw source evidence: `25` rows from Nagoya University.

Why selected:

- it has one of the deepest current verified programme-source foundations;
- an exact Nagoya City geography can be normalized in Phase 2.

Guardrail:

- the additional `Aichi` source rows from Aichi Shukutoku University and Aichi Toho University remain outside Nagoya programme coverage until their actual teaching municipalities are verified;
- prefecture identity `Aichi` is never treated as a Nagoya alias.

### Sendai

Decision: `TIER_A`

Public slug: `sendai`

Current production geography: exists.

Raw source evidence: `23` rows from Tohoku University.

Why selected:

- the current programme foundation is substantial;
- an exact Sendai City administrative/statistical boundary can be normalized;
- official campus evidence can support programme-location verification.

Guardrail:

- only explicitly Sendai-linked teaching locations may contribute to city programme counts.

### Suita

Decision: `TIER_A`

Public slug: `suita`

Current production geography: exists.

Raw source evidence: `15` rows labelled `Osaka`, all from The University of Osaka.

Why selected:

- it is a required correctness case in the current foundation;
- the current canonical publication location is Suita;
- official University of Osaka material confirms a multi-campus network including Suita, Toyonaka and Minoh.

Phase 2 / Phase 3 guardrails:

- Suita must be represented as Suita City, Osaka Prefecture;
- raw `Osaka` cannot be interpreted as Osaka City;
- the 15 rows remain `verification_pending` for Suita until programme/faculty teaching-location evidence is confirmed;
- Toyonaka and Minoh must remain distinct municipalities if later evidence requires separate destination coverage;
- no Osaka City programme count may be generated from these 15 rows.

Official source:

- https://www.osaka-u.ac.jp/en/access/bus

### Tsukuba

Decision: `TIER_A`

Public slug: `tsukuba`

Current production geography: exists.

Raw source evidence: `11` rows from University of Tsukuba.

Why selected:

- meaningful current programme evidence exists;
- Tsukuba City is a distinct municipality and research-oriented study destination;
- current geography identity already exists and can be normalized in place if Phase 2 confirms it.

Guardrail:

- do not broaden Tsukuba to Ibaraki Prefecture.

### Fukuoka

Decision: `TIER_A`

Public slug: `fukuoka`

Current production geography: exists.

Raw source evidence: `5` rows from Kyushu University.

Why selected:

- current provider/programme evidence is sufficient for a bounded first verification pass;
- Fukuoka City can be normalized independently from Fukuoka Prefecture;
- inclusion broadens initial geographic coverage beyond the Kanto/Kansai/Chubu/Tohoku destinations.

Guardrail:

- provider identity does not guarantee every Kyushu University programme is taught inside Fukuoka City; Phase 3 remains programme-location specific.

## Explicit later candidates

### Thin but already represented

- Kunitachi — current Hitotsubashi foundation creates a clear physical-location anchor, but only `2` raw programme rows currently exist and those are labelled `Tokyo`; keep separate from Tokyo and promote only after programme-location reconciliation.
- Chiba — `5` raw rows / `1` provider; raw label may denote prefecture rather than Chiba City, so actual municipality must be resolved first.
- Okayama — `4` rows / `1` provider; candidate after location verification.
- Chitose — `1` row / `1` provider.
- Niigata — `1` row / `1` provider; raw label requires municipality/prefecture disambiguation.

### Prefecture-label remediation candidates

These are not city candidates under their current labels:

- Aichi — `3` rows / `2` providers
- Tochigi — `2` rows / `1` provider
- Gunma — `1` row / `1` provider

Their actual teaching municipalities must be resolved before any future scope decision.

### Multi-campus locality candidates

Official campus evidence may later justify separate treatment for places such as:

- Toyonaka
- Minoh
- Kashiwa
- Yokohama
- Ichikawa

None enter Tier A automatically. A future scope revision must document provider/programme evidence and exact administrative geography.

### Major provider-expansion destinations

Important Japanese study markets such as Sapporo, Kobe, Hiroshima and other major university destinations remain provider-expansion candidates rather than being treated as lower-quality destinations simply because the current 20-provider programme foundation is incomplete.

## Administrative geography contract for Phase 2

Phase 2 must normalize exactly the seven Tier A destinations and no others.

Required work:

1. preserve existing UUIDs for the seven selected geography rows where identity remains correct;
2. attach official municipality/statistical codes for Kyoto, Nagoya, Sendai, Suita, Tsukuba and Fukuoka;
3. encode Tokyo as an explicit 23-special-wards aggregate with constituent/official-source metadata rather than fabricating one municipality code;
4. attach prefecture/region context to every destination;
5. establish one reproducible official population contract per destination using the same locked geography scope;
6. never map Aichi, Tochigi, Gunma or other prefecture labels into city slugs;
7. keep Kunitachi separate from Tokyo;
8. keep Suita separate from Osaka City, Toyonaka and Minoh;
9. add contract tests for exact Tier A slugs and these separation rules.

## Programme boundary

The existing `134` Japan canonical programmes remain national/source programme evidence only.

Phase 1 assigns none of them to public Tier A city programme coverage.

Until Phase 3 verifies programme-to-teaching-location relationships:

`programme_coverage_status = verification_pending`

Known relationships that must remain blocked from automatic publication:

- The University of Osaka: `15` raw `Osaka` rows must not be published as Osaka City or Suita solely from current inherited/publication location
- Hitotsubashi University: `2` raw `Tokyo` rows must not be published as Tokyo-core or Kunitachi solely from current inherited/publication location
- Aichi/Tochigi/Gunma raw rows must not create city coverage
- any University of Tokyo or Science Tokyo programme whose teaching location falls outside the locked Tokyo core must remain outside Tokyo coverage

## Phase 1 result

Japan Phase 1 is complete.

Checkpoint: `TIER_A_SCOPE_LOCKED`

Exact Tier A count: `7`

Exact slugs:

`tokyo`, `kyoto`, `nagoya`, `sendai`, `suita`, `tsukuba`, `fukuoka`

Production mutation: `NONE`

Route/publication change: `NONE`

Next phase: Phase 2 geography normalization on the same branch.

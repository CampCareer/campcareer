# Japan city readiness v1

Status: `PHASE_0_COMPLETE`

Branch: `agent/jp-cities-v1`

Base main: `2019dbe23235171cb6bb6b848a95da20f31c5731`

Audit date: 2026-08-12

Verdict: `READY_WITH_GATES`

Checkpoint: `READINESS_COMPLETE`

## Purpose

Establish the authoritative higher-education, geography and production-data baseline required before selecting the first public Japan `/cities` cohort.

Phase 0 is diagnostic only. It does not mutate production data, publish routes, create city read models, alter SEO/indexing, or convert current publication-location rows into programme teaching-location claims.

## Product identity

Current canonical country contract:

- country code: `JP`
- country name: Japan
- intended city route contract: `/cities/jp/{city-slug}`

Required invariants:

`Study in Japan location label != municipality by itself`

`prefecture label != city`

`primary publication location != complete campus inventory`

`institution presence in one place != all programmes delivered there`

`programme_offering.campus_id != verified city delivery when programme_assignment_verified=false`

These rules are material in Japan because current source labels mix city and prefecture semantics and several universities operate across multiple municipalities.

## Authoritative source families

### International-study provider/programme source — Study in Japan

Use the official Study in Japan portal as the international-student discovery source family. The portal itself states that school information is provided by individual institutions, does not include every school, and should be confirmed directly with the institution for the latest information.

Primary source:

- https://www.studyinjapan.go.jp/en/search-for-schools/school_search.php?lang=en

The portal is useful for provider/programme discovery and international-student context. Its geographic labels must not be assumed to be municipality identities.

### Higher-education authority — MEXT

Use the Ministry of Education, Culture, Sports, Science and Technology for national higher-education authority context and designated/national university evidence where applicable.

MEXT authority evidence is not a substitute for a programme teaching address.

### Official geography/population — Statistics Bureau / official municipality codes

Use Japanese official municipality/statistical geography for Phase 2. The Statistics Bureau publishes municipality code-based geographic material using prefecture/municipality codes and official administrative boundaries.

Primary source family:

- https://www.stat.go.jp/data/mesh/m_itiran.htm

Phase 2 must store a reproducible administrative identity and explicit population-boundary contract for each Tier A destination. No prefecture label may be silently normalized into a city.

### Teaching location — official institution campus pages

Physical teaching-location evidence must come from official university/school campus or faculty pages.

Examples already relevant to known reconciliation risks:

- University of Tokyo campus map: https://www.u-tokyo.ac.jp/en/about/access.html
- Science Tokyo campus access: https://www.isct.ac.jp/en/001/access
- University of Osaka campus network: https://www.osaka-u.ac.jp/en/access/bus
- Hitotsubashi Kunitachi Campus: https://www.hit-u.ac.jp/eng/about/direction/kunitachi.html

## Production database audit

Checked against Supabase project `babylusxcknjerxtepoc` on 2026-08-12.

### Existing Japan geography seed

Production contains exactly `8` Japan geography rows, all currently typed as city:

1. Fukuoka — `fukuoka`
2. Kunitachi — `kunitachi`
3. Kyoto — `kyoto`
4. Nagoya — `nagoya`
5. Sendai — `sendai`
6. Suita — `suita`
7. Tokyo — `tokyo`
8. Tsukuba — `tsukuba`

Current quality:

- geography rows: `8`
- geography type `city`: `8/8`
- official `code`: `0/8`
- `region_code`: `0/8`
- `scope_kind`: `0/8`
- current status: `active`
- normalization batch: `fi_no_jp_kr_fastpath_v1`

These are authority-backed publication-location seeds, not publication-complete administrative geography contracts.

Tokyo requires special care because `Tokyo` is not one ordinary municipality. Phase 2 must define one explicit reproducible public scope and must not silently mix Tokyo Metropolis, the 23 special wards, Kunitachi, Kashiwa, Yokohama or other surrounding municipalities.

### Canonical institution foundation

Production contains:

- Japan canonical institutions: `20`
- current programme-source institutions: `20`

This is a selected current programme foundation, not the complete Japanese higher-education provider universe.

### Existing campus/location rows

Production contains exactly `20` Japan campus/location rows.

Quality:

- geography-linked rows: `9/20`
- programme-provenance-only rows: `11/20`
- `programme_assignment_verified=true`: `0/20`

The current campus rows are therefore not complete teaching-campus inventories and cannot be used as final city-programme evidence.

### Programmes and offerings

Production contains:

- staged Japan programmes: `134`
- verification tier A staging rows: `134`
- canonical Japan programmes: `134`
- canonical Japan offerings: `134`
- current provider identities: `20`
- raw source location labels: `14`

Current raw source-location distribution:

| Raw location label | Programmes | Institutions |
| --- | ---: | ---: |
| Tokyo | 26 | 3 |
| Nagoya | 25 | 1 |
| Sendai | 23 | 1 |
| Osaka | 15 | 1 |
| Kyoto | 12 | 4 |
| Tsukuba | 11 | 1 |
| Chiba | 5 | 1 |
| Fukuoka | 5 | 1 |
| Okayama | 4 | 1 |
| Aichi | 3 | 2 |
| Tochigi | 2 | 1 |
| Chitose | 1 | 1 |
| Gunma | 1 | 1 |
| Niigata | 1 | 1 |

These values are reconciliation evidence only. They are not publication-ready city programme counts.

### Critical geographic-semantic defects

#### Defect 1: prefecture labels in a city field

At least `6` programme rows use obvious prefecture-level labels in the current `city` field:

- Aichi: `3`
- Tochigi: `2`
- Gunma: `1`

These must not generate `Aichi`, `Tochigi` or `Gunma` city pages. Actual teaching municipalities must be verified from official institution sources.

Other labels such as `Chiba` or `Niigata` may also require municipality-versus-prefecture disambiguation before publication.

#### Defect 2: current source-location vs inherited campus mismatch

Using the current one-campus-per-provider foundation, exactly `17` staged programme rows have a raw source location different from the inherited/current publication campus city:

- The University of Osaka: `15` rows use raw source label `Osaka` while the current canonical publication location is `Suita`
- Hitotsubashi University: `2` rows use raw source label `Tokyo` while the current canonical publication location is `Kunitachi`

These are known reconciliation conflicts, not proof that the programmes belong to Suita or Kunitachi. Phase 3 must verify programme-level teaching location before assigning city programme coverage.

#### Defect 3: multi-campus institutions cross public destination boundaries

Official university sources show that several current providers operate across multiple municipalities:

- The University of Tokyo includes Hongo, Komaba and Kashiwa among its major campuses
- Science Tokyo includes Tokyo campuses plus Yokohama and Konodai/Ichikawa locations
- The University of Osaka operates Suita, Toyonaka and Minoh campuses

Therefore institution identity or a single primary-publication location cannot be used to assign all programmes to one city.

### International admission evidence

The 134 Japan staging rows have current international-admission evidence records with a mix of `verified_general` and `verified_program` statuses. This supports national/programme readiness, but does not solve city teaching-location verification.

### City metrics and read models

Phase 0 treats Japan city metrics and city-specific read models as not established for this rollout. No city metric or route publication work is introduced in Phase 0.

## Reusable foundation

The following can be reused safely:

1. canonical country `JP`;
2. 20 current canonical provider identities;
3. 134 canonical programme identities and source records;
4. Study in Japan/source location labels as reconciliation evidence only;
5. existing geography UUIDs where Phase 2 confirms the identity remains correct;
6. official Statistics Bureau/municipality-code sources for geography normalization;
7. official institution campus/faculty pages for Phase 3 teaching-location evidence;
8. the existing fastpath geography separation of Suita and Kunitachi from broader `Osaka`/`Tokyo` labels.

## Data that must not be treated as publication-complete

Do not treat the following as final city evidence:

1. the current 8 geography rows as publication-ready administrative contracts;
2. `Tokyo` as an ordinary municipality without an explicit scope decision;
3. the 20 campus rows as complete campus inventories;
4. the current `city` staging field as municipality-normalized;
5. `Aichi`, `Tochigi` or `Gunma` as city identities;
6. `Osaka` source labels as proof of Osaka City delivery;
7. The University of Osaka's current Suita publication row as proof that all 15 source programmes are taught in Suita;
8. `Tokyo` source labels for Hitotsubashi as proof of Tokyo-core delivery;
9. provider presence as proof that every provider programme belongs to the same city;
10. current provider absence as a judgement about destination quality.

## Phase 0 blockers and remediation

### Blocker 1: administrative geography metadata is absent

All 8 current geography seeds lack official code, region code and scope metadata.

Remediation: Phase 2 must attach explicit official scope/identity metadata and population contracts.

### Blocker 2: Tokyo is an aggregate destination problem

`Tokyo` cannot be treated as one ordinary municipality.

Remediation: Phase 1 must lock a public Tokyo scope; Phase 2 must encode it explicitly; Phase 3 must exclude campuses outside that scope unless separately represented.

### Blocker 3: source location semantics are mixed

The staging `city` field contains both cities and prefectures.

Remediation: Phase 2/3 must separate administrative geography resolution from provider/programme reconciliation. Raw source labels remain provenance only.

### Blocker 4: campus inventories are incomplete

All 20 existing Japan campus rows have programme assignment unverified.

Remediation: Phase 3 must create/verify actual teaching-location representatives before city programme counts are exposed.

### Blocker 5: 17 current source/publication-location conflicts

The University of Osaka (`15`) and Hitotsubashi (`2`) are the clearest known cases.

Remediation: block these rows from city programme publication until official programme/campus evidence resolves them.

### Blocker 6: provider universe is incomplete

The current 20 providers are selected programme-source institutions, not the national provider universe.

Remediation: use a bounded first cohort and keep major omitted destinations as explicit expansion candidates.

## Readiness gates

Japan may proceed to Phase 1 if these rules remain fixed:

1. Tier A is a bounded initial publication cohort, not a national city ranking;
2. raw Study in Japan location labels are provenance/reconciliation evidence only;
3. prefecture labels never become city pages automatically;
4. Tokyo receives an explicit scope contract before publication;
5. current geography UUIDs are reused only after identity normalization;
6. current publication campuses are not treated as complete campus inventories;
7. programme delivery is never inferred from institution presence or inherited campus assignment;
8. the 17 known source/publication-location conflicts remain blocked until repaired;
9. multi-campus providers remain location-specific;
10. major omitted destinations remain expansion candidates, not rejected cities.

## Phase 0 result

Japan Phase 0 is complete.

Verdict: `READY_WITH_GATES`

Checkpoint: `READINESS_COMPLETE`

Production mutation: `NONE`

Route/publication change: `NONE`

Next phase: Phase 1 Tier A scope lock on the same branch.

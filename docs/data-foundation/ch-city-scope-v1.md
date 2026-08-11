# Switzerland Cities — Phase 1 city scope v1

Status: `PHASE_1_COMPLETE`
Checkpoint: `TIER_A_SCOPE_LOCKED`
Country: `CH` — Switzerland
Checked: 2026-08-11
Branch: `agent/ch-cities-v1`

## Scope decision

The first Switzerland Cities publication cohort is locked to exactly six municipality-based study destinations:

1. Zurich — `zurich` — 74 programmes
2. Lausanne — `lausanne` — 39 programmes
3. Basel — `basel` — 24 programmes
4. Lugano — `lugano` — 22 programmes
5. Fribourg — `fribourg` — 20 programmes
6. Geneva — `geneva` — 20 programmes

Planned route shape:

- `/cities/ch/zurich`
- `/cities/ch/lausanne`
- `/cities/ch/basel`
- `/cities/ch/lugano`
- `/cities/ch/fribourg`
- `/cities/ch/geneva`

Phase 1 does not publish these routes. Phase 2 must first normalize the municipality geography contract.

## Why these six

This cohort is selected from the current 243-programme Switzerland foundation using a deterministic rollout rule:

- rank current source-City labels by verified staged programme volume
- take the top five positions
- expand the cutoff to include all Cities tied with the fifth-ranked City

Fribourg and Geneva are tied at 20 programmes. Rather than apply an arbitrary tie-break, both are included, producing a six-City Tier A cohort.

| Rank | Tier A City | Current staged programmes | Current university institutions represented |
|---:|---|---:|---:|
| 1 | Zurich | 74 | 2 |
| 2 | Lausanne | 39 | 2 |
| 3 | Basel | 24 | 1 |
| 4 | Lugano | 22 | 1 |
| 5= | Fribourg | 20 | 1 |
| 5= | Geneva | 20 | 1 |

Together the six contain 199 of the current 243 Switzerland staged programmes and eight of the 12 current canonical university institutions.

This is a rollout-size decision, not a ranking of student experience, university quality, labour-market strength or City importance.

## Explicitly deferred Cities

The current ten-City source foundation also contains:

- Neuchâtel — 16 programmes
- Bern — 15 programmes
- St. Gallen — 10 programmes
- Lucerne — 3 programmes

These Cities remain reusable foundation data but are outside Tier A v1. Phase 2–5 must not silently mark them as Tier A, create indexable City profiles for them, or include them in Tier A City metrics.

Their exclusion is purely a first-rollout boundary. In particular, Bern's exclusion must not be interpreted as a judgement on the City or University of Bern.

## Geography principle

The comparison boundary is the official municipality from the Swiss Federal Statistical Office Official Directory of Municipalities, state 01.01.2026.

Authority:

https://www.agvchapp.bfs.admin.ch/

Rules:

- Zurich route scope means the municipality of Zürich, with `zurich` retained as the English routing slug
- Lausanne means Lausanne municipality
- Basel means Basel municipality, not the full Basel metropolitan area or both Basel cantons
- Lugano means Lugano municipality
- Fribourg means Fribourg/Freiburg municipality
- Geneva means Genève/Geneva municipality, not the full canton or cross-border metropolitan area
- cantons are regional context only
- no neighbouring municipality may be absorbed without explicit location evidence

Phase 2 is responsible for official municipality numbers, canonical official-name handling, canton relationships and aliases.

## Multilingual naming rule

Switzerland requires explicit separation between public routing labels and official/local names.

Routing slugs remain ASCII and stable:

`zurich, lausanne, basel, lugano, fribourg, geneva`

Phase 2 must preserve authoritative/local aliases where applicable, including forms such as `Zürich`, `Fribourg/Freiburg` and `Genève`, without changing the route contract.

No accent-stripped routing identifier may be presented as an assertion that it is the sole official municipal name.

## Current coverage represented by the six-City cohort

The six-City cohort currently represents:

- 199 / 243 staged programmes
- 8 / 12 canonical university institutions
- all current programme rows in those Cities as linkage candidates
- six of the ten existing fast-path City geography seeds

These counts are scope-selection evidence only. They are not complete municipal programme or institution totals because the current provider foundation covers the 12 swissuniversities `Universities` category rather than the full accredited Swiss higher-education universe.

## Campus and programme-delivery rule

The six selected Cities currently have primary publication campus rows, but none is marked as a complete campus inventory or verified programme-assignment location.

Therefore Tier A membership does not itself verify programme delivery.

Phase 3 must require the complete chain:

`FSO municipality -> verified study location -> accredited canonical institution -> official programme -> canonical programme offering`

Rules:

- source City text is reconciliation evidence, not sufficient alone
- a current primary publication campus is not sufficient alone
- institution presence never implies that all of its programmes are taught in that City
- programme source evidence and provider location evidence must agree before a City programme count becomes verified
- multi-location institutions must not have programmes duplicated across Cities without evidence

## Institution coverage state carried forward

All six Tier A destinations inherit the Phase 0 coverage state:

`selected_swissuniversities_university_core_full_hei_coverage_pending`

Therefore:

- City institution counts are partial
- absence of a university of applied sciences, teacher education institution or other accredited provider from the current foundation is not evidence of absence from the municipality
- later provider expansion may increase City institution and programme coverage
- published copy must retain the provider-coverage caveat until the broader accredited universe is reconciled

## International publication boundary

Current programme international evidence includes only three `verified_program` rows; the remaining 240 rows are `verified_general`.

Tier A scope selection does not upgrade this evidence.

Later City publication must preserve:

- current programme existence
- current international/admission evidence status
- verified physical study location
- municipality assignment

A programme may be a valid City delivery candidate while its current international application window remains unknown or not yet open. Those concepts must remain separate.

## Phase 2 normalization targets

Phase 2 must operate only on these six Tier A City seeds and add:

- official FSO/BFS municipality number
- municipality `scope_kind`
- canton code and relationship
- 01.01.2026 FSO source metadata
- Tier A publication metadata
- official/local name aliases and stable route aliases
- UUID preservation checks
- explicit guard that the four deferred Cities are not promoted

No Phase 2 migration may silently add Neuchâtel, Bern, St. Gallen or Lucerne to Tier A.

## Phase 1 conclusion

The exact Switzerland Tier A v1 allowlist is locked to:

`zurich, lausanne, basel, lugano, fribourg, geneva`

Phase 0 and Phase 1 make no production database mutation and publish no new City routes. Phase 2 may now normalize exactly these six municipalities on the same Switzerland-only branch.
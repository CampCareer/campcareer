# Finland Cities — Phase 1 city scope v1

Status: `PHASE_1_COMPLETE`
Checkpoint: `TIER_A_SCOPE_LOCKED`
Country: `FI` — Finland
Checked: 2026-08-11
Branch: `agent/fi-cities-v1`

## Scope decision

The first Finland Cities publication cohort is locked to exactly eight municipality-based study destinations:

1. Helsinki — `helsinki`
2. Espoo — `espoo`
3. Tampere — `tampere`
4. Turku — `turku`
5. Oulu — `oulu`
6. Jyväskylä — `jyvaskyla`
7. Lappeenranta — `lappeenranta`
8. Joensuu — `joensuu`

Planned route shape:

- `/cities/fi/helsinki`
- `/cities/fi/espoo`
- `/cities/fi/tampere`
- `/cities/fi/turku`
- `/cities/fi/oulu`
- `/cities/fi/jyvaskyla`
- `/cities/fi/lappeenranta`
- `/cities/fi/joensuu`

No route is published by Phase 1 itself. Phase 2 must first normalize the geography contract.

## Why these eight

Phase 1 is an initial publication cohort, not a claim that these are the only important Finnish student cities.

The eight were selected because all of the following are already true in the current canonical foundation:

- each has a stable FI geography UUID/slug seed
- each has at least one current canonical university presence in the existing university-core foundation
- each has a non-trivial set of current officially sourced programme records with explicit city labels
- together they provide useful national geographic coverage rather than concentrating the entire first release in the capital region

Current university-core programme evidence by source city:

| Tier A city | Current staged programmes | Current university-core institutions represented |
|---|---:|---:|
| Espoo | 81 | 1 |
| Helsinki | 49 | 2 |
| Tampere | 47 | 1 |
| Turku | 42 | 2 |
| Lappeenranta | 40 | 1 |
| Joensuu | 30 | 1 |
| Oulu | 27 | 1 |
| Jyväskylä | 26 | 1 |

These counts are selection evidence only. They must not be shown as complete municipal programme inventories while full HEI/UAS coverage remains pending.

## Geography principle

The publication boundary for each Tier A destination is the official Statistics Finland municipality, using the 2026 municipality classification as the Phase 2 authority:

https://stat.fi/en/luokitukset/kunta/kunta_1_20260101

Statistics Finland describes municipality as the basic regional unit for most statistics. The rollout therefore uses municipality-to-municipality comparison unless a later explicit exception is documented.

### Capital region

Helsinki and Espoo remain distinct municipalities and distinct public study destinations.

Do not:
- merge them into a synthetic `Helsinki metropolitan area` geography
- attribute Espoo programmes or Aalto locations to Helsinki merely because they are in the same capital region
- use capital-region provider marketing language to override municipality boundaries

Vantaa is not part of the initial Tier A allowlist.

## Coverage rationale

### Southern / capital region

- Helsinki
- Espoo

This preserves the country's largest international study market while keeping the two municipality boundaries separate.

### Western / southwest

- Tampere
- Turku

Both have substantial current university-core programme foundations and distinct municipality-based study ecosystems.

### Northern Finland

- Oulu

Oulu provides the initial northern Tier A anchor rather than allowing the first release to become south-only.

### Central Finland

- Jyväskylä

Jyväskylä provides a central inland university destination with verified current programme evidence.

### Southeast / eastern Finland

- Lappeenranta
- Joensuu

Both have substantial current programme evidence and preserve eastern geographic representation in the initial release.

## Explicit exclusions and expansion candidates

The following are not Tier A in v1. Their exclusion is not a quality judgement; it reflects the Phase 0 coverage gate that CampCareer currently contains only a 10-university core and an incomplete physical campus inventory.

### Priority expansion candidates

- Kuopio
  - important because University of Eastern Finland has a Kuopio campus and Savonia UAS has major Kuopio presence
  - current CampCareer university fastpath represents UEF only through a Joensuu primary publication location, so Kuopio cannot be safely promoted until Phase 3-grade location evidence is added

- Vaasa
  - recognised university/UAS ecosystem exists but is outside the current 10-university city foundation

- Rovaniemi
  - northern HEI ecosystem exists but is outside the current canonical institution foundation

- Vantaa
  - capital-region UAS activity exists, but it is not currently represented as a mature canonical city/institution linkage

- Lahti
  - higher-education activity exists, but current FI city foundation does not yet provide the same canonical evidence chain as the Tier A cohort

Other Finnish municipalities may enter later only after provider/location evidence is expanded and the same city contract can be satisfied.

## Programme publication boundary

The eight-city allowlist does not automatically publish all current staged programmes in those cities.

Later Phase 3 publication requires the full evidence chain:

`municipality -> verified study location -> recognised canonical institution -> verified programme offering -> canonical programme`

Rules:
- source city text is strong reconciliation evidence, not sufficient by itself
- the current `Primary publication location` campus rows are not sufficient by themselves
- institution presence never implies programme delivery
- multi-campus institutions require city-specific location verification

## Institution coverage state carried forward

All eight Tier A cities inherit the Phase 0 coverage disclosure:

`selected_university_core_full_hei_coverage_pending`

This means:
- the first release can proceed with verified locations and metrics
- institution counts must not be described as complete municipality-wide HEI totals until the 35-recognised-HEI universe is reconciled
- UAS absence from the current canonical layer must remain visible in QA and profiles where relevant

## Phase 2 normalization targets

Phase 2 must preserve the existing UUIDs/slugs for these eight where there is no identity conflict, while adding:

- official 2026 Statistics Finland municipality code
- municipality scope kind
- official region relationship/code
- Statistics Finland source metadata
- publication tier/status metadata
- duplicate/alias handling where needed

No additional FI city may be silently promoted to Tier A during Phase 2.

## Phase 1 conclusion

The exact Finland Tier A v1 allowlist is locked to:

`helsinki, espoo, tampere, turku, oulu, jyvaskyla, lappeenranta, joensuu`

Phase 1 is complete. Next step is Phase 2 municipality/region normalization on the same `agent/fi-cities-v1` branch.

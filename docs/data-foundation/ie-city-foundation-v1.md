# Ireland city foundation v1

Status: `PHASE_2_COMPLETE`

Branch: `agent/ie-cities-foundation-v1`

Parent branch: `agent/ie-cities-scope-v1`

Production migration: `20260809092442_normalize_ie_tier_a_city_slugs_v1`

Repository migration:

`supabase/migrations/20260809092442_normalize_ie_tier_a_city_slugs_v1.sql`

## Purpose

Normalize only the approved four Ireland Tier A study destinations into stable canonical city geographies before institution/campus/programme linkage.

Phase 2 changes geography identity, route slug, aliases and scope metadata only. Existing campus rows and programme offerings remain discovery/staging evidence.

## Approved Tier A geographies

| City | Stable UUID | Legacy code | Canonical slug | Province | Study-destination scope |
| --- | --- | --- | --- | --- | --- |
| Dublin | `ebcbc645-0792-46a3-905c-eee25267a55a` | `dublin-ie` | `dublin` | Leinster | `dublin_four_local_authorities` |
| Cork | `e3604abf-cee2-4fd4-a76a-29825382ae78` | `cork-ie` | `cork` | Munster | `cork_city` |
| Galway | `f2ad7336-54d9-42e7-8bb4-f3e3c2cf191d` | `galway-ie` | `galway` | Connacht | `galway_city` |
| Limerick | `e64fc1f0-eef3-4be9-9970-5d8e2b3f8587` | `limerick-ie` | `limerick` | Munster | `limerick_urban` |

All four retain their existing `core.geographies.id`. No new canonical geography row was created.

## Scope contracts

### Dublin

Public route scope is the Dublin study destination covering these four local-authority areas:

- Dublin City
- Fingal
- Dún Laoghaire-Rathdown
- South Dublin

This is a product study-market boundary, not permission to infer campus membership from a `Dublin` text label. Phase 3 still requires explicit official location evidence for each campus.

### Cork

Public `cork` represents a Cork City study destination. County-wide inference is prohibited and an institution using `Cork` in its name does not establish city membership.

### Galway

Public `galway` represents Galway City. Legacy locality strings `Galway` and `Galway City` are resolution/discovery aliases only until campus address evidence is verified.

### Limerick

Public `limerick` represents the Limerick urban higher-education study destination. Verified Limerick/Castletroy locations may qualify in Phase 3, but the scope does not cover County Limerick by default.

## Alias contract

Each Tier A geography now has:

- canonical-name alias;
- legacy source name from `public.cities_ie`;
- legacy `*-ie` source code alias;
- canonical public slug alias;
- one safe city/locality spelling alias (`Dublin City`, `Cork City`, `Galway City`, `Limerick City`).

Aliases support resolution only. They are not campus verification.

## Tier B remains untouched

The six deferred first-expansion destinations remain unnormalized and non-public:

- Maynooth
- Waterford
- Athlone
- Sligo
- Dundalk
- Letterkenny

Post-migration verification confirmed each still has no Phase 2 public slug/scope metadata from `ie_city_normalization_v1`.

This means the earlier Waterford legacy `region_code='Leinster'` issue and Maynooth University's legacy Dublin linkage are intentionally deferred rather than modified as part of the four-city first release.

## Production verification

The production migration guard requires:

- exactly four normalized Ireland Tier A geographies;
- `scope_kind='city'`;
- active status;
- canonical slugs `dublin`, `cork`, `galway`, `limerick`;
- `publication_tier='A'`;
- `campus_membership_contract='phase_3_explicit_location_evidence_required'`;
- zero Tier B rows tagged by this normalization migration.

The migration applied successfully on 2026-08-09.

A post-migration query confirmed:

- all four approved UUIDs were preserved;
- all four canonical slugs/scopes are present;
- all six deferred expansion geographies remain with `slug IS NULL`, `scope_kind IS NULL`, and no Tier A metadata;
- canonical/source/legacy/slug/locality aliases exist for all four.

## Explicit non-changes

Phase 2 did not:

- verify or relink any campus;
- change `campus.geography_id` or locality membership;
- verify any institution identity;
- change any programme or programme offering;
- promote any of the existing `legacy_backfill + unverified` Ireland offerings;
- repair Tier B geography/campus issues.

## Contract test

`tests/ie-city-foundation-contract.test.ts`

The contract pins:

- exact four-city Tier A allowlist;
- six-city deferred expansion guard;
- UUID-preserving update pattern;
- Dublin four-local-authority study-market contract;
- explicit Cork/Galway/Limerick scope semantics;
- Phase 3 campus-evidence gate;
- alias registration requirements.

Full repository CI is not claimed at this phase. The production migration guard and post-migration SQL verification succeeded.

## Phase 2 decision

`PHASE_2_COMPLETE`

Current Ireland rollout:

`0 Readiness ✅ → 1 City scope ✅ → 2 Slug/geography normalization ✅`

Next branch:

`agent/ie-cities-linkage-v1`

Phase 3 must build the canonical relationship chain:

`city -> verified campus/location -> canonical institution -> explicit programme offering -> programme`

No programme delivery may be inferred from institution presence.
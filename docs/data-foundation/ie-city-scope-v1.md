# Ireland city scope v1

Status: `PHASE_1_COMPLETE`

Branch: `agent/ie-cities-scope-v1`

Parent branch: `agent/ie-cities-readiness-v1`

## Purpose

Fix the first public Ireland `/cities` perimeter before geography normalization or publication work. Existing Ireland campus/programme data remains discovery evidence until provider identity, campus location, programme delivery and international-student eligibility are verified.

The first release is intentionally narrow. The product will publish the four dominant Irish higher-education study markets first and keep the next six previously approved candidates as Tier B expansion targets.

## Selection method

Tier A selection uses these signals in order:

1. current HEA / QQI recognised higher-education provider presence;
2. international-student demand and material higher-education scale;
3. a defensible user-facing study destination with explicit campus geography;
4. current CampCareer institution/programme density as discovery signal only.

Primary references:

- https://hea.ie/statistics/data-for-download-and-visualisations/key-facts-figures-report/
- https://hea.ie/higher-education-institutions/
- https://www.qqi.ie/trusted-ireland-reports
- https://www.educationinireland.com/en/where-can-i-study-in-ireland

## Tier A — approved first public Ireland city set

Publish and compare exactly these four destinations first:

| Public city | Public slug | Geographic role | Primary higher-education evidence | Phase 2 scope direction |
| --- | --- | --- | --- | --- |
| Dublin | `dublin` | national / east-coast hub | UCD, Trinity, DCU, TU Dublin, RCSI, NCAD, NCI and private HE providers | explicit Dublin study-market boundary covering Dublin City, Fingal, Dún Laoghaire-Rathdown and South Dublin; campus membership still requires explicit address/location evidence |
| Cork | `cork` | south / major university city | UCC plus MTU Cork presence | Cork city study scope; do not absorb county campuses merely because an institution uses a Cork label |
| Galway | `galway` | west / major university city | University of Galway plus ATU Galway presence | Galway City study scope; legacy `Galway` / `Galway City` strings are discovery-only until campus evidence is verified |
| Limerick | `limerick` | mid-west / major university city | University of Limerick, Mary Immaculate College and TUS Limerick presence | Limerick urban study scope based on explicit Limerick/Castletroy campus evidence; no County Limerick inference |

These four provide the highest-value first release while materially reducing the verification burden in Phases 2–8.

## Why these four

### Dublin

Dublin is the clear first destination and has the broadest public/private higher-education concentration. The public label `Dublin` must not be interpreted as Dublin City Council only. For CampCareer v1, the study destination covers the four Dublin local-authority areas: Dublin City, Fingal, Dún Laoghaire-Rathdown and South Dublin. Every linked campus still requires explicit address/location evidence.

### Cork

Cork combines UCC and MTU presence and is one of the strongest Irish international higher-education destinations outside Dublin. Public city membership must be based on verified campus address, not institution name.

### Galway

University of Galway is a major international-study destination and ATU adds additional higher-education presence. Phase 2 will normalize one public `galway` geography while Phase 3 decides campus membership from official location evidence.

### Limerick

Limerick has multiple significant higher-education providers and a strong existing discovery cluster. The public destination uses an urban study-market contract that may include verified Castletroy higher-education campuses but must not expand to all of County Limerick.

## Tier B — approved later expansion pool

The six destinations removed from the initial Tier A set are retained as the first expansion pool:

1. `maynooth`
2. `waterford`
3. `athlone`
4. `sligo`
5. `dundalk`
6. `letterkenny`

They are not rejected. They are deferred so the first Ireland release can reach verified City profile / Compare / SEO / QA with less data work. They may be added later using the same country rollout standard without redesigning the first four.

Additional later candidates remain Carlow, Wexford, Tralee, Thurles, Castlebar, Drogheda and Kilkenny.

`dun-laoghaire` is not a separate v1 destination. Verified campuses in Dún Laoghaire-Rathdown may belong to the Dublin study market when explicit location evidence supports that membership.

## Phase 2 geography rules

Phase 2 must normalize exactly four Tier A destinations:

1. `dublin`
   - public label `Dublin`;
   - `scope_kind='city'` with an explicit Dublin study-market contract in metadata;
   - study-market boundary: Dublin City + Fingal + Dún Laoghaire-Rathdown + South Dublin;
   - legacy locality labels are not authoritative campus evidence.
2. `cork`
   - public label `Cork`;
   - Cork city study scope;
   - no county-wide or institution-name inference.
3. `galway`
   - public label `Galway`;
   - Galway City study scope;
   - `Galway` / `Galway City` locality variants are resolved only through official campus evidence in Phase 3.
4. `limerick`
   - public label `Limerick`;
   - Limerick urban study scope including verified Limerick/Castletroy higher-education locations;
   - no County Limerick inference.

Phase 2 changes geography identity/scope only. It must not mark any legacy campus or programme offering as verified.

## Publication allowlist

Every later Ireland city publication surface is bounded to exactly:

```text
dublin
cork
galway
limerick
```

Tier B destinations remain non-public until separately approved.

## Programme coverage rule

The Tier A reduction does not validate any current Ireland programme offering. All current offerings remain discovery/staging evidence until Phase 3 verifies explicit programme/offering-to-campus delivery.

Institution presence in a Tier A destination is never sufficient to infer programme delivery.

## Phase 1 decision

`PHASE_1_COMPLETE`

Approved Tier A count: `4`

Approved first-public destinations:

`Dublin, Cork, Galway, Limerick`

Deferred first expansion pool:

`Maynooth, Waterford, Athlone, Sligo, Dundalk, Letterkenny`

Next branch:

`agent/ie-cities-foundation-v1`

Phase 2 should preserve the existing four geography UUIDs, add canonical slugs and aliases, store explicit scope metadata, and leave institution/campus/programme verification to Phase 3.
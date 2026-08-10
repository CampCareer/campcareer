# Germany city linkage v1

Status: `PHASE_3_COMPLETE`

Branch: `agent/de-cities-linkage-v1`

Base Phase 2: `72264a7b82759f16a2e264f40525d55e83a988a8`

Production migration: `20260810163850_publish_de_tier_a_city_linkage_v1`

Audit date: 2026-08-10

## Purpose

Build the source-backed Germany city relationship chain required by the city rollout standard:

`city -> verified teaching campus/location -> canonical institution -> explicit programme offering -> programme`

Phase 3 verifies a conservative campus/institution set for the nine Tier A destinations. It does not treat institution presence or an institution-level programme catalogue as proof that a programme is taught at a specific city campus.

## Tier A cities

Exactly nine cities participate:

- `berlin`
- `munich`
- `hamburg`
- `aachen`
- `bonn`
- `dresden`
- `heidelberg`
- `karlsruhe`
- `tuebingen`

No additional German city is introduced in Phase 3.

## Canonical institution identity

All twelve linked institutions resolve through the existing Germany canonical institution layer and the identifier system:

`DE_HRK_VERIFIED_DOMAIN`

The verified domain is used as the stable source-backed institution identity signal already present in `catalog.institution_identifiers`.

Phase 3 does not fuzzy-match institutions by display name and does not create replacement identities.

## Existing pre-Phase-3 location state

Before Phase 3, Germany had twelve active `catalog.campuses` rows, one for each current canonical institution.

Those rows were intentionally only institution-city seed records:

- `record_scope = tier_a_institution_city`
- `location_quality = verified_official_city`
- source provenance from the DFG Excellence institution seed
- `programme_assignment_verified = false`

The 72 existing canonical Germany programme offerings were attached to those city seed rows and had offering-level `verification_status = verified`, but none of those campus rows had programme assignment verified.

Therefore the existing 72 offerings are useful programme catalogue/admission records but are not campus-specific delivery evidence for city publication.

Phase 3 does not rewrite or promote those 72 relationships.

## Verified campus evidence rule

Phase 3 inserts a separate conservative official teaching-location layer with:

- `record_scope = verified_teaching_campus`
- `location_quality = verified_official`
- `source_tier = institution_official`
- `normalization_batch = de_city_linkage_v1`
- `programme_assignment_verified = false`
- `coordinate_precision = not_asserted`

No coordinates are invented.

One representative verified teaching location is stored for each current institution/city relationship. This is not an assertion that every campus, building or teaching site has been enumerated.

## Verified campus set

### Berlin — 3

1. Freie Universität Berlin — Dahlem Campus
   - official university material identifies Dahlem as the major university campus and describes teaching departments and lecture facilities there
   - source: https://www.fu-berlin.de/en/redaktion/orientierung/dahlem/index.html

2. Humboldt-Universität zu Berlin — Campus Mitte
   - official university material describes Campus Mitte as a core HU campus and states that humanities, cultural, social and legal scholars study, research and teach there
   - source: https://www.hu-berlin.de/en/about/campus/campus-mitte/sites

3. Technische Universität Berlin — Main Campus Charlottenburg
   - TU Berlin identifies Charlottenburg-Wilmersdorf as its main campus and states that all seven faculties are located there
   - source: https://www.tu.berlin/en/about/campuses-and-offices/berlin

All three locations fall inside the Phase 2 Berlin municipality/city-state scope.

### Munich — 2

1. Ludwig-Maximilians-Universität München — Campus Geschwister-Scholl-Platz
   - LMU identifies this as the campus containing the historic Main Building and teaching in humanities, law, economics, business and social sciences
   - source: https://www.standorte.lmu.de/en/campus-geschwister-scholl-platz/

2. Technical University of Munich — TUM Munich City Campus
   - TUM identifies Arcisstraße 21 as the downtown/city campus in Munich and lists several schools and student services at that site
   - source: https://www.tum.de/en/about-tum/locations/munich

Critical boundary rule:

TUM Campus Garching is not part of the Munich municipality and is not folded into `/cities/de/munich`. TUM programme delivery must therefore be campus-specific before a programme can count toward Munich.

LMU also operates locations outside the selected city boundary, including Oberschleißheim. These are not inferred into Munich.

### Hamburg — 1

Universität Hamburg — Von-Melle-Park Main Campus

- Universität Hamburg identifies Von-Melle-Park as its main campus in Eimsbüttel and notes the Main Building and largest lecture hall there
- source: https://www.uni-hamburg.de/en/uhh/standorte-uni-hamburg.html

Other Hamburg university locations may be added later through the same official-location rule.

### Aachen — 1

RWTH Aachen University — RWTH Central Campus / Templergraben

- RWTH's official building directory identifies the Main Building at Templergraben 55 in Aachen and the central university facilities around that location
- source: https://www.rwth-aachen.de/cms/root/Die-RWTH/Kontakt-Anreise/RWTH-Navigator/~cxcq/Maps-Gebaeude/lidx/1/

The city link is to Aachen municipality, not the entire Städteregion Aachen.

### Bonn — 1

University of Bonn — Central Bonn Campus

- the University of Bonn states that its main building remains in Bonn city centre and identifies the Central Bonn Campus as one of its principal campus areas
- source: https://www.uni-bonn.de/en/university/about-the-university/locations-1/locations?set_language=en

Teaching/research estates outside Bonn city limits are not included in the Bonn city scope.

### Dresden — 1

Technische Universität Dresden — TUD Campus Südvorstadt

- TU Dresden identifies Campus Südvorstadt as its main campus south of Dresden city centre and explicitly distinguishes external locations including Tharandt, Pirna and Zittau
- source: https://tu-dresden.de/tu-dresden/campus/standorte?set_language=en

External TU Dresden locations are not inferred into Dresden.

### Heidelberg — 1

Heidelberg University — Neuenheimer Feld Campus

- Heidelberg University provides official directions for its Neuenheimer Feld university institutes and campus area in Heidelberg
- source: https://www.uni-heidelberg.de/en/university/locations-and-how-to-get-there

Phase 3 does not claim that all Heidelberg programmes are taught at Neuenheimer Feld; humanities and other subjects may use other city locations.

### Karlsruhe — 1

Karlsruhe Institute of Technology — KIT Campus South

- KIT states that Campus South is in the heart of Karlsruhe and provides the official address Kaiserstraße 12
- source: https://www.kit.edu/kit/english/directions.php

Critical boundary rule:

KIT Campus North is in the administrative district of Karlsruhe near Eggenstein-Leopoldshafen and is not treated as part of Karlsruhe city merely because it belongs to KIT.

### Tübingen — 1

University of Tübingen — Wilhelmstraße / Neue Aula Campus

- the university's official maps identify the Wilhelmstraße area, Neue Aula, lecture halls and other central teaching facilities in Tübingen
- source: https://uni-tuebingen.de/en/university/how-to-get-here/maps/

Other Tübingen city teaching areas such as Morgenstelle may be added later without changing the canonical city identity.

## Read models

Phase 3 creates three server-only views.

### `public.city_institution_directory_de_v1`

One row per Phase 3 verified teaching campus/location.

It exposes:

- canonical city ID
- canonical campus ID
- canonical institution ID/name/slug
- verified institution domain and identity evidence URL
- institution website
- campus name/city/region
- address where explicitly supported
- official campus source URL
- location quality and record scope

Current result: `12` rows across `12` institutions.

### `public.city_programme_directory_de_v1`

A programme can appear only when all of the following are true:

- the programme is canonical and active;
- the offering references a Phase 3 verified campus ID;
- the offering has `verification_status = verified`;
- the offering carries a source URL;
- the verified campus has `programme_assignment_verified = true`;
- the offering is not closed or suspended.

Current result: `0` rows.

This is deliberate. The existing 72 Germany programme offerings are linked to the earlier institution-city seed records rather than the new verified teaching-campus records, and no Phase 3 campus has programme assignment verified.

### `public.city_directory_de_v1`

Aggregates city readiness counts and exposes:

- linked campus count
- linked institution count
- linked programme count
- institution coverage status
- programme coverage status

Current institution coverage status:

`initial_verified_set`

Current programme coverage status:

`verification_pending`

## Production result

| City | Verified campuses | Verified institutions | Verified programmes |
| --- | ---: | ---: | ---: |
| Aachen | 1 | 1 | 0 |
| Berlin | 3 | 3 | 0 |
| Bonn | 1 | 1 | 0 |
| Dresden | 1 | 1 | 0 |
| Hamburg | 1 | 1 | 0 |
| Heidelberg | 1 | 1 | 0 |
| Karlsruhe | 1 | 1 | 0 |
| Munich | 2 | 2 | 0 |
| Tübingen | 1 | 1 | 0 |

Overall:

- Tier A city directory rows: `9`
- verified teaching-campus rows: `12`
- distinct linked canonical institutions: `12`
- city programme directory rows: `0`

## Programme decision

Germany now has `72` canonical active programmes and `72` existing programme offerings in the current bounded programme foundation.

However, offering-level verification is not the same as campus-level delivery verification.

Phase 3 therefore refuses to derive city programme counts from:

- institution presence in a city;
- the previous `tier_a_institution_city` seed campus;
- an institution-level programme directory;
- an application/admission source that does not prove teaching location;
- metropolitan branding such as Munich when the actual campus may be in Garching.

The correct current state is:

`programme_coverage_status = verification_pending`

A later programme-location verification pass may promote individual offerings by linking them to the appropriate Phase 3 campus and setting campus assignment verification only where the official programme evidence supports it.

## Security

All three Germany city directory views use:

`security_invoker = true`

They revoke direct access from:

- `public`
- `anon`
- `authenticated`

and explicitly grant `SELECT` only to:

- `service_role`

## Acceptance criteria

Phase 3 is complete because:

- [x] exactly nine Tier A city directory rows exist;
- [x] every Tier A city has at least one official verified teaching location;
- [x] Berlin resolves three institutions and Munich resolves two;
- [x] all twelve current Germany canonical institutions are represented;
- [x] every relationship resolves through `DE_HRK_VERIFIED_DOMAIN` identity evidence;
- [x] all Phase 3 location rows use institution-owned official sources;
- [x] metro-boundary leaks such as TUM Garching and KIT Campus North are explicitly excluded from city inference;
- [x] no coordinates are fabricated;
- [x] programme delivery is not inferred from the existing 72 offerings;
- [x] city programme directory remains empty until explicit campus-level assignment evidence exists;
- [x] all three read models are service-role-only security-invoker views;
- [x] production migration guards passed.

## Handoff

Proceed to Phase 4 — Five Core Metrics.

Germany has a materially stronger programme catalogue than New Zealand, but city programme coverage must remain `verification_pending` until explicit offering-to-campus evidence is verified. This gap does not block Phase 4 city metrics.
# New Zealand city scope v1

Status: `PHASE_1_COMPLETE`

Branch: `agent/nz-cities-scope-v1`

Base Phase 0: `bc3f15aa55d7c41c6592a0886e2ede0d550716e1`

Audit date: 2026-08-09

## Purpose

Select the first public New Zealand `/cities` cohort and define the Phase 2 scope contract for each selected study destination.

Phase 1 does not change production geography rows, publish routes, create programme links, or infer programme delivery from institution presence.

## Decision

New Zealand Tier A v1 contains exactly five public study destinations:

1. `auckland`
2. `christchurch`
3. `hamilton`
4. `wellington`
5. `dunedin`

The initial public route contract is therefore:

- `/cities/nz/auckland`
- `/cities/nz/christchurch`
- `/cities/nz/hamilton`
- `/cities/nz/wellington`
- `/cities/nz/dunedin`

The following current or discovered locations remain expansion candidates rather than Tier A v1:

- `palmerston-north`
- `lincoln`
- `tauranga`
- other New Zealand tertiary destinations discovered during later provider expansion

## Selection methodology

Tier A selection uses the following order of evidence:

1. current official international-student concentration;
2. material current university teaching-campus presence;
3. distinct national study-destination value rather than duplicate nearby geography;
4. North Island / South Island geographic spread;
5. ability to define an honest city/study-market boundary from Stats NZ geography;
6. current production registry-location rows only as a discovery signal, not as complete campus coverage.

No city is selected merely because a provider's NZQA registered location happens to be there.

## National demand signal

Education New Zealand reported 92,580 international students across New Zealand education providers in 2025, with university international enrolments at 38,025. Auckland hosted around 55% of international students, followed by Canterbury and Waikato.

Source:

https://www.enz.govt.nz/news-and-research/ed-news/latest-data-shows-continued-growth-in-international-enrolments

Education Counts maintains current international-student statistics and reports its international-student statistical section as updated in June 2026.

Source:

https://www.educationcounts.govt.nz/statistics/international-students-in-new-zealand

These regional signals support Auckland, Christchurch and Hamilton particularly strongly. Wellington and Dunedin are retained because each is a distinct, material university study destination with strong current university-campus evidence.

## Tier A city decisions

### Auckland

Decision: `TIER_A`

Canonical slug: `auckland`

Why selected:

- Auckland is by far the largest current international-student centre, hosting around 55% of New Zealand international students in the 2025 Education New Zealand data.
- The University of Auckland and Auckland University of Technology both have multiple teaching campuses in Auckland.
- Massey University also has an Auckland campus, so Auckland's actual university presence is broader than the current one-row-per-university registry-location seed.
- Auckland is the country's largest and most internationally significant study market and must be in v1.

Official university evidence:

Universities New Zealand lists University of Auckland campuses including City, Grafton, Epsom, Newmarket and Tāmaki, as well as Tai Tokerau in Whangārei.

https://www.universitiesnz.ac.nz/universities/university-auckland

Universities New Zealand lists AUT South, North and City campuses.

https://www.universitiesnz.ac.nz/universities/aut

Universities New Zealand lists Massey campuses in Auckland, Manawatū and Wellington.

https://www.universitiesnz.ac.nz/universities/massey-university

Phase 2 preliminary scope contract:

- public label: `Auckland`
- intended semantics: Auckland metropolitan / major-urban study market, not the entire Auckland Region
- exact Stats NZ urban-area and locality mapping must be fixed in Phase 2
- Whangārei must not be folded into Auckland merely because University of Auckland has Tai Tokerau presence there
- programme availability must later be verified campus by campus

### Christchurch

Decision: `TIER_A`

Canonical slug: `christchurch`

Why selected:

- Canterbury is the second major regional international-student concentration after Auckland in the latest Education New Zealand reporting.
- University of Canterbury is explicitly located in Ōtautahi Christchurch.
- University of Otago also has a Christchurch campus, which becomes relevant to campus linkage in Phase 3.
- Christchurch gives the rollout a major South Island metropolitan study destination.

Official university evidence:

Universities New Zealand lists University of Canterbury's location/campus as Ōtautahi, Christchurch.

https://www.universitiesnz.ac.nz/universities/university-canterbury

Universities New Zealand lists University of Otago campuses including Dunedin, Christchurch, Wellington, Auckland and Southland.

https://www.universitiesnz.ac.nz/universities/university-otago

Phase 2 preliminary scope contract:

- public label: `Christchurch`
- intended semantics: Christchurch urban study destination
- Lincoln is not automatically included; it remains a distinct place and Tier B expansion candidate
- field stations and non-city research facilities must not be treated as city teaching campuses

### Hamilton

Decision: `TIER_A`

Canonical slug: `hamilton`

Why selected:

- Waikato is the third major regional international-student concentration identified by Education New Zealand after Auckland and Canterbury.
- University of Waikato has a current Hamilton campus and a separate Tauranga campus.
- Hamilton gives v1 a distinct inland North Island university market rather than concentrating entirely on Auckland/Wellington.

Official university evidence:

Universities New Zealand lists University of Waikato campuses at Hamilton and Tauranga.

https://www.universitiesnz.ac.nz/universities/university-waikato

Phase 2 preliminary scope contract:

- public label: `Hamilton`
- intended semantics: Hamilton urban study destination
- Tauranga must remain separate and must not be inferred into Hamilton
- Waikato regional statistics are a selection signal, not the publication boundary

### Wellington

Decision: `TIER_A`

Canonical slug: `wellington`

Why selected:

- Wellington is a major independent university study destination and the national capital.
- Victoria University of Wellington has multiple teaching campuses in Wellington.
- Massey University also operates a Wellington campus.
- University of Otago has Wellington teaching/clinical presence that requires explicit Phase 3 classification.
- The city adds an important public-sector, design, policy, creative and professional study context distinct from Auckland.

Official university evidence:

Universities New Zealand lists Victoria University of Wellington campuses at Kelburn, Pipitea, Te Aro and Miramar Creative Centre.

https://www.universitiesnz.ac.nz/universities/te-herenga-waka%E2%80%94victoria-university-wellington

Universities New Zealand lists Massey University campuses in Auckland, Manawatū and Wellington.

https://www.universitiesnz.ac.nz/universities/massey-university

Universities New Zealand lists University of Otago campuses including Wellington.

https://www.universitiesnz.ac.nz/universities/university-otago

Phase 2 preliminary scope contract:

- public label: `Wellington`
- intended semantics: Wellington city study destination
- Phase 2 must explicitly determine whether any Hutt Valley / Porirua localities are excluded or included; do not infer a whole Wellington Region scope
- campus-specific programme delivery remains Phase 3 work

### Dunedin

Decision: `TIER_A`

Canonical slug: `dunedin`

Why selected:

- Dunedin is the primary home of the University of Otago, one of New Zealand's largest universities and its oldest university.
- It is a highly distinct university city whose student-market characteristics are materially different from Auckland, Wellington, Christchurch and Hamilton.
- Including Dunedin improves South Island and student-town comparison value even though Otago is not one of the top three international-student regions cited by the current ENZ summary.

Official university evidence:

Universities New Zealand lists University of Otago's Dunedin campus alongside its other national campuses.

https://www.universitiesnz.ac.nz/universities/university-otago

Universities New Zealand reports University of Otago student headcount of 21,315 in 2024.

https://www.universitiesnz.ac.nz/universities/university-otago

Phase 2 preliminary scope contract:

- public label: `Dunedin`
- intended semantics: Dunedin urban study destination
- do not infer Southland, Queenstown or other Otago teaching/research locations into Dunedin
- exact city metric geography must be fixed before Phase 4

## Tier B / expansion decisions

### Palmerston North

Decision: `TIER_B`

Rationale:

- Massey University's Manawatū campus makes Palmerston North a genuine university city.
- However, the first five already provide stronger current international-demand and national-comparison coverage.
- It should be the leading North Island expansion candidate after Tier A.

Do not remove the existing `palmerston-north` geography row.

### Lincoln

Decision: `TIER_B`

Rationale:

- Lincoln University is a distinct specialist university and Lincoln is a legitimate study destination.
- It should not be silently collapsed into Christchurch.
- For a first public cohort, Christchurch provides the broader Canterbury study-market signal and larger city comparison value.

Do not remove the existing `lincoln` geography row.

### Tauranga

Decision: `TIER_B_DISCOVERED`

Rationale:

- University of Waikato explicitly has a Tauranga campus.
- Tauranga is not represented in the current seven-city geography seed because the seed was based on registered university locations, not complete campus inventory.
- This is direct evidence that the production geography seed is incomplete.
- Tauranga should be considered in the next expansion round after a canonical geography row and campus evidence are normalized.

## Existing production geography relationship

Current production geography seed contains seven active rows:

- Auckland
- Christchurch
- Dunedin
- Hamilton
- Lincoln
- Palmerston North
- Wellington

All five Tier A cities already have canonical slugs and stable UUIDs in production. Phase 2 should preserve those UUIDs and normalize scope metadata rather than recreating the rows.

Lincoln and Palmerston North remain active non-Tier-A geographies.

Tauranga is an official university-campus discovery outside the current seed and therefore demonstrates why city inventory must not be defined by existing rows alone.

## Phase 2 normalization targets

Phase 2 should normalize exactly the five Tier A rows first:

| City | Slug | Preliminary region | Phase 2 scope requirement |
| --- | --- | --- | --- |
| Auckland | `auckland` | Auckland | major urban / metropolitan study-market boundary; not whole Auckland Region |
| Christchurch | `christchurch` | Canterbury | Christchurch urban study destination; exclude Lincoln by default |
| Hamilton | `hamilton` | Waikato | Hamilton urban study destination; exclude Tauranga |
| Wellington | `wellington` | Wellington | Wellington city study destination; not whole Wellington Region |
| Dunedin | `dunedin` | Otago | Dunedin urban study destination; not wider Otago/Southland |

Phase 2 must inspect the supported `scope_kind` values and existing country patterns before writing production metadata. Do not invent an unsupported enum/value.

Phase 2 should add aliases only where they map deterministically to the selected publication scope. Māori/English place-name presentation should be preserved in user-facing labels where the existing product conventions support it, without changing canonical English slugs unless the global routing contract changes.

## Phase 3 campus-linkage implications

The Tier A selection intentionally creates these high-priority campus audits:

### Auckland

At minimum review:

- University of Auckland Auckland teaching campuses
- AUT City / North / South campuses
- Massey Auckland campus

Do not include University of Auckland Tai Tokerau / Whangārei under Auckland.

### Christchurch

At minimum review:

- University of Canterbury Christchurch campus
- University of Otago Christchurch campus, with teaching scope classified accurately

Do not include Lincoln University under Christchurch merely due proximity.

### Hamilton

At minimum review:

- University of Waikato Hamilton campus

Do not include University of Waikato Tauranga delivery under Hamilton.

### Wellington

At minimum review:

- Victoria University of Wellington teaching campuses
- Massey Wellington campus
- University of Otago Wellington presence with teaching/clinical scope classified accurately

### Dunedin

At minimum review:

- University of Otago Dunedin campus

Other Otago locations require separate evidence and geography.

## Programme coverage rule

Current canonical NZ programmes and offerings remain zero.

This does not block the city rollout.

If Phase 3 cannot establish programme-specific official campus delivery evidence, the correct state is:

`programme_coverage_status = verification_pending`

City profile, Compare and publication may proceed later if the standard's institution/location and metric gates are met. A provider's presence in a selected Tier A city must never be used to infer programme delivery.

## Why Tier A is five rather than all seven current geographies

Publishing all seven seed geographies would incorrectly treat a university registered-location seed as a product-priority city list.

The five-city cohort gives:

- the dominant international market: Auckland;
- the next two strongest current regional demand signals: Canterbury/Christchurch and Waikato/Hamilton;
- the national-capital university market: Wellington;
- a distinctive South Island university city: Dunedin.

Palmerston North and Lincoln remain legitimate expansion destinations and retain their existing production geographies.

## Phase 1 acceptance criteria

Phase 1 is complete when all are true:

- [x] exact Tier A allowlist is defined;
- [x] Tier B / expansion destinations are recorded;
- [x] current international-student demand signal is documented;
- [x] each Tier A city has current university-campus evidence;
- [x] multi-campus institutions are explicitly identified as Phase 3 linkage work;
- [x] preliminary Phase 2 geography semantics are documented;
- [x] existing production UUID/slug preservation rule is recorded;
- [x] programme absence is treated as a catalogue gap rather than zero availability;
- [x] no production DB mutation occurs in Phase 1;
- [x] no city route is published in Phase 1.

## Handoff

Proceed to Phase 2 — Slug & Geography Normalization — with the exact Tier A allowlist:

`auckland`, `christchurch`, `hamilton`, `wellington`, `dunedin`

Retain:

`palmerston-north`, `lincoln`

as non-public expansion geographies, and add `tauranga` only through a later canonical geography decision rather than inferring it from the University of Waikato provider record.
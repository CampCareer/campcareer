# UK Programs — Phase 2 Collection

Date: 2026-08-09
Branch: `agent/programs-uk`
Scope: United Kingdom only.

## Collection target

Collect only programmes with a defensible relationship to CampCareer's canonical 80-career taxonomy. The 185 legacy `courses_uk` rows remain discovery/provenance seeds and are not bulk-promoted.

## Source hierarchy

1. Current official provider programme page for programme identity, award, duration, campus and current intake evidence.
2. Home Office / UKVI Register of Student sponsors for institution-level Student-route sponsor evidence.
3. Official provider international/admissions page for programme-level international eligibility, application timing and CAS evidence.
4. Discover Uni / HESA current course data for UK-wide undergraduate discovery.
5. DfE LARS / Ofqual Register for vocational, FE, apprenticeship and regulated-qualification discovery.
6. Legacy CampCareer `courses_uk` only as a discovery hint or provenance link.

Aggregators and ranking sites are not authoritative programme sources.

## Evidence separation

The following facts are independent and must remain independently nullable/holdable:

- provider recognition / UKPRN identity;
- Student-route sponsor status;
- exact programme identity and current existence;
- international-student eligibility for that exact programme;
- current application window;
- CAS eligibility/issuance;
- occupation relevance;
- publication readiness.

A Student sponsor does not prove every programme can sponsor a Student visa. An international tuition fee does not prove applications are currently open. A visible Apply button does not by itself prove unconditional CAS eligibility.

## Qualification normalization

Do not use the legacy `aqf_level` field.

Store native framework and native level separately from CampCareer's normalized level:

- FHEQ/RQF-style levels for England/Wales/Northern Ireland higher education where applicable;
- SCQF levels for Scottish programmes;
- CQFW/other native evidence where it is the authoritative source;
- canonical level such as BACHELOR, INTEGRATED_MASTER, MASTER, DOCTORATE, FOUNDATION_DEGREE, APPRENTICESHIP or OTHER.

## Provider relationship

For each programme preserve whether the provider relationship is:

- direct award;
- validated;
- franchised;
- embedded pathway;
- joint award;
- other/unknown.

Do not duplicate a host university degree under an embedded pathway college unless the pathway itself is the target programme being represented.

## Occupation linkage

Use conservative reviewed relations:

- `direct_career_path`: exact or explicit graduate-career evidence;
- `professional_registration_pathway`: regulated course leading toward professional registration;
- `professional_pathway_stage`: a documented required/recognised stage that is not sufficient alone for full registration;
- `direct_discipline` / `related_discipline`: only when the official curriculum or course description directly supports the target field.

Never approve a relationship from a broad legacy field label alone.

## International-admission rules

Phase 2 records evidence but does not force publication tiers.

- All newly collected programmes currently remain Tier C pending Phase 3 verification.
- CAS stays `NULL` unless exact official evidence establishes programme-level CAS handling.
- Explicit current closure is recorded as closure rather than converted to generic unknown.
- Programme existence and occupation relevance can remain approved even when the current international intake is closed.

## Current Phase 2 state

As of 2026-08-09:

- UK Phase 2 staging tables created and server-only.
- 16 existing canonical institutions matched to the 2026-08-07 UKVI Student sponsor register in sponsor seed batch 1.
- 3 institutions have programme batches collected:
  - Aston University: 10 programmes
  - Brunel University of London: 17 programmes
  - Cardiff University: 11 programmes
- Total programme staging rows: 38.
- Total international-evidence rows: 38.
- Programme rows currently marked international-eligible: 38, based on exact programme-level official evidence; this is separate from application-window/CAS verification.
- CAS known: 0; CAS unknown: 38.
- Explicit current overseas-admission closure: Cardiff Adult Nursing BN for 2026/27.
- Approved programme-occupation relations: 46.
- Distinct canonical target careers currently covered: 18/80.

Covered careers currently include:

`accountant`, `architect`, `auditor`, `business-analyst`, `civil-engineer`, `cybersecurity-analyst`, `data-analyst`, `data-engineer`, `electrical-engineer`, `environmental-engineer`, `financial-analyst`, `mechanical-engineer`, `network-administrator`, `occupational-therapist`, `pharmacist`, `physiotherapist`, `registered-nurse`, `software-developer`.

## Next collection direction

Continue institution-by-institution from the canonical seed while prioritising uncovered careers and regulated/vocational pathways. University-only discovery is insufficient for the full 80-career set, so later Phase 2 batches must deliberately include recognised/listed FE and vocational providers for trades, maritime, aviation, agriculture, hospitality and technician pathways.

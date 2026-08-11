# NL Programs — Phase 2 Collection

Date: 2026-08-10
Branch: `agent/programs-nl`
Scope: Netherlands only. Do not advance to another country without explicit user instruction.

## Outcome

Phase 2 bounded collection is complete for the first Netherlands programme cohort.

Production verification after migration:

- 16 IND Study sponsor staging rows
  - 13 matched to existing canonical NL institutions
  - 3 HBO provider candidates intentionally left without canonical institution IDs
- 37 current programme staging rows
  - WO: 26
  - HBO: 11
- 26 programme rows linked to existing canonical NL institutions
- 11 HBO programme rows retained as provider candidates only
- 37/37 programme-level international-evidence rows
- 37/37 have institution-level recognised Study sponsor evidence
- 12/37 have explicit programme-level international-student evidence in the checked provider source
- 10/37 have explicit accreditation/recognition evidence captured at Phase 2 level
- 80 approved programme-to-career staging relations
- 36/80 canonical CampCareer target careers covered
- 0 missing official programme URLs

This is intentionally a bounded collection, not an exhaustive Netherlands programme crawl.

## Source hierarchy

### DUO / RIO

Primary official recognition/discovery source:

- https://onderwijsdata.duo.nl/datasets/ho_opleidingsoverzicht
- https://onderwijsdata.duo.nl/datasets/overzicht-erkenningen-ho

RIO contains recognised/accredited higher-education programme information. Exact recognised programme codes are stored only when directly evidenced by an official DUO/provider source; codes are never inferred from titles.

### IND Study sponsor register

Institution-level residence sponsorship source:

- https://ind.nl/en/public-register-recognised-sponsors/public-register-study

The register used for this collection was current as of 2026-08-03.

Sponsor recognition is not treated as proof that a specific programme admits a specific international applicant.

### Official provider programme pages

Current programme pages/listings were checked from:

- University of Twente
- Wageningen University & Research
- University of Amsterdam
- University of Groningen
- Radboud University
- Maastricht University
- Tilburg University
- HZ University of Applied Sciences
- HAN University of Applied Sciences
- Breda University of Applied Sciences

## WO / HBO handling

The Dutch binary higher-education structure is preserved in staging:

- `WO` for research-university programmes
- `HBO` for higher professional education / university-of-applied-sciences programmes

The HBO providers HZ, HAN and Breda University of Applied Sciences were not added to the canonical institution catalogue during Phase 2. Their programmes remain valid collection candidates with `institution_id IS NULL` until provider identity and recognition are reviewed in Phase 3.

This avoids expanding `/institutions/nl` as a side effect of programme discovery.

## International-evidence policy

The collection separates three facts:

1. institution is an IND recognised Study sponsor;
2. programme is current/full-time and has accreditation/recognition evidence where directly captured;
3. programme page contains explicit evidence relevant to international applicants.

Unknown programme-level international eligibility remains null rather than being inferred from English language or sponsor status.

## Programme-to-career coverage

The first cohort contains 80 approved relations across 36 canonical careers.

Strong initial coverage includes:

- software / cyber / data / network / database roles
- civil, electrical, mechanical, chemical and industrial engineering
- manufacturing and automotive pathways
- environmental / sustainability / food technology
- business analytics, finance, marketing and HR
- logistics / supply chain / warehousing
- tourism / hotel / hospitality
- UX / multimedia / web design

Phase 3 should focus first on verification quality and provider identity before expanding coverage toward all 80 careers.

## Security

All four Phase 2 staging tables are server-only:

- `public.institution_student_sponsor_nl_staging`
- `public.program_catalog_nl_staging`
- `public.program_international_nl_staging`
- `public.program_occupation_nl_staging`

Production privilege verification:

- `anon`: no SELECT
- `authenticated`: no SELECT
- `service_role`: SELECT allowed

RLS is enabled on all four tables.

## Migrations

- `20260810103000_nl_program_phase2_staging_foundation.sql`
- `20260810104200_nl_program_phase2_bounded_seed.sql`

Both were committed to `agent/programs-nl` before being applied to linked production Supabase.

## Phase 3 handoff

Phase 3 should not expand another country. For NL only:

1. assign verification tiers to the 37 collected programmes;
2. resolve HZ/HAN/BUas provider identities without automatically publishing them to the institution surface;
3. verify exact RIO/NVAO programme identity for rows without captured recognition codes;
4. verify programme-level international admission evidence for the 25 rows currently carrying sponsor-only evidence;
5. normalise application/intake state without inferring eligibility;
6. keep WO/HBO distinctions and source provenance intact.

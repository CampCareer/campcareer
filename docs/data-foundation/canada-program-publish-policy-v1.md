# Canada Programs Publish Policy v1

Status: draft policy locked for implementation
Country: Canada (`CA`)
Scope: public `/programs` catalogue and program detail eligibility
Effective baseline: 2026-08-08

## Purpose

This policy defines when a Canadian program collected into `program_catalog_ca_staging` may be exposed in CampCareer. It separates catalogue publication from PGWP eligibility so that missing immigration evidence never becomes an inferred positive claim.

The staging catalogue is an evidence layer, not a public catalogue. A row must pass the rules below before it can enter the canonical Canadian Programs read model.

## Publication tiers

### Tier A — public detail

A program may receive a public list card and canonical detail page when all mandatory catalogue checks pass and the row has a program-specific official URL.

Mandatory catalogue checks:

1. `title` is present and non-empty.
2. `institution_id` is present and resolves to a canonical Canadian institution.
3. The institution is a current post-secondary DLI for international students, unless the program is deliberately published as domestic-only outside the international catalogue.
4. `international_program_admission_status` is not explicitly closed or ineligible for international students.
5. `source_url` is present and is an official institution, government, or approved provincial catalogue source.
6. `source_as_of` or another collected/verified timestamp is present.
7. `source_status` does not indicate exclusion, suspension, cancellation, legacy-only status, closed intake, or pending verification.
8. `official_program_url` is present and points to the institution's current program page.
9. The row is not a duplicate or a non-standalone child/option record that would create a misleading separate program page.

Tuition, duration, city, CIP and PGWP are enrichment fields. Their absence does not by itself block Tier A publication, but missing values must render as unavailable rather than estimated.

### Tier B — public list only / limited detail

A program may appear in search results without a fully indexed detail page when the mandatory catalogue checks pass but `official_program_url` is missing and the program is supported only by an official catalogue or directory source.

Tier B rules:

1. All Tier A mandatory catalogue checks except item 8 must pass.
2. `source_url` must directly support the existence of the program.
3. The UI must not fabricate tuition, duration, city, intake or PGWP status.
4. Until a program-specific official URL is verified, the detail route should be `noindex` or omitted from sitemap.

### Tier C — hold / do not publish

A row remains staging-only when any of the following is true:

1. Institution is not a current DLI for the international-student catalogue.
2. International admission is explicitly unavailable.
3. Program is suspended, cancelled, not accepting new students, legacy-only, closed one-time delivery, or pending verification.
4. Row is tagged as excluded non-core content such as pathway-only, academic upgrading, continuing learning, EAP-only, or similar non-program content unless a later product decision explicitly includes that category.
5. The program identity is ambiguous or duplicate resolution is incomplete.
6. The source cannot be tied to an official or approved authoritative catalogue.

## PGWP publication policy

Catalogue publication and PGWP claims are separate decisions.

CampCareer must never infer program-level PGWP eligibility merely because an institution is a DLI or offers some PGWP-eligible programs. IRCC explicitly states that not all programs at a PGWP-eligible DLI are PGWP eligible.

Expose one of three PGWP states:

### `eligible`

Use only when the program has affirmative program-level evidence or falls into an IRCC rule category that does not require a field-of-study test and the institution/program otherwise meets the applicable PGWP program rules.

For the current 2026 rule baseline, bachelor’s, master’s and doctoral degree graduates do not need to meet the field-of-study requirement. This does not waive the other PGWP requirements.

### `ineligible`

Use only when authoritative evidence explicitly makes the program or institution ineligible, including an institution that is not a current qualifying DLI/PGWP provider or a program explicitly listed as not PGWP eligible.

### `unknown`

Use whenever exact program-level evidence is incomplete. In particular, a non-degree program that requires an eligible field of study remains `unknown` until its exact six-digit CIP code is verified against the applicable IRCC list or the institution publishes authoritative program-level PGWP eligibility.

Never convert `unknown` to `eligible` using title keywords, broad fields, NOC mappings, institution type, or approximate CIP inference.

## 2026 field-of-study baseline

For 2026, IRCC states that the list of eligible fields of study is frozen for the year. The implementation must still store the rule/evidence date and source because a future year can change the list.

The canonical layer should therefore retain:

- exact six-digit `cip_code` where verified
- whether a field-of-study requirement applies
- program-level PGWP state: `eligible`, `ineligible`, `unknown`
- rule category and concise evidence note
- IRCC or institution evidence URL
- evidence `source_as_of` / `verified_at`

## Required canonical fields

A publishable Canadian program read model should contain at minimum:

- stable canonical program id
- country code `CA`
- institution id and institution slug
- institution name
- source program key
- program title
- credential type / education level
- field name when available
- province and city when verified
- program code when available
- official program URL when verified
- official source URL
- source status
- source/evidence date
- international-student admission state
- DLI number / DLI evidence state
- PGWP state
- PGWP rule category
- exact CIP code when verified
- duration and tuition only when source-backed

## Search and SEO rules

1. Public search may include Tier A and Tier B.
2. Sitemap/indexable detail pages are Tier A only until Tier B program-specific URLs are verified.
3. Tier C never appears in public search, comparison, sitemap or recommendation surfaces.
4. Missing tuition or duration is displayed as `Not verified` or equivalent, never `0`, an average, or an estimate presented as fact.
5. PGWP `unknown` is displayed as `Needs program-level verification`, not as a negative result.
6. Search ranking should prefer Tier A, then Tier B, with evidence freshness as a secondary signal.

## Current staging baseline

At policy lock on 2026-08-08, `program_catalog_ca_staging` contains 6,638 rows across 49 institutions. `program_pgwp_ca_staging` also contains 6,638 rows. The current data contains substantial catalogue coverage but limited tuition, duration and program-specific URL coverage, so staging must not be exposed wholesale.

The next implementation step is to classify every staging row into Tier A, Tier B or Tier C and resolve duplicate/current-offering status before building the canonical Canadian program view.

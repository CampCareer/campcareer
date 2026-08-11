# Switzerland Cities — Phase 8 release QA v1

Status: `PHASE_8_COMPLETE`
Checkpoint: `PUBLISH_READY_WITH_EXTERNAL_CI_LIMIT`
Country: `CH` — Switzerland
Checked: 2026-08-11
Branch: `agent/ch-cities-v1`

## QA scope

Phase 8 validates the Switzerland Cities Phase 0–7 contract before main reconciliation.

## Data cardinality

The controlled Phase 2–4 Supabase replay was executed transactionally and rolled back after verification. The verified branch contract is:

- Tier A municipalities: 6
- municipality aliases: 15
- verified university study-location representatives: 7
- verified-partial municipality programme links: 170
- verified City metric rows: 30
- required metrics per City: 5

Expected programme distribution:

| City | Programmes |
|---|---:|
| Zurich | 74 |
| Lausanne | 10 |
| Basel | 24 |
| Lugano | 22 |
| Fribourg | 20 |
| Geneva | 20 |

The production database was not left mutated by the replay.

## Geography checks

Required published municipality contracts:

- Zürich `261` / canton `ZH`
- Lausanne `5586` / canton `VD`
- Basel `2701` / canton `BS`
- Lugano `5192` / canton `TI`
- Fribourg `2196` / canton `FR`
- Genève `6621` / canton `GE`

Deferred Cities must not acquire Tier A publication metadata:

`neuchatel, bern, st-gallen, lucerne`

## Lausanne / EPFL boundary check

The Lausanne municipality read model must contain the verified UNIL cohort and must not count EPFL's 29 Lausanne-labelled programmes as Lausanne municipality delivery without physical-location evidence inside the municipality.

Expected Lausanne programme count: `10`.

Expected total across the six published municipalities: `170`.

## Linkage checks

The City read model requires:

- exact `CH_SWISSUNIVERSITIES` offering provenance
- active canonical institution and programme
- active Phase 3 verified study-location representative
- source City agreement with the selected municipality label
- verified offering state
- current official programme evidence

Institution presence alone is not sufficient for programme delivery.

## Metric checks

Every published City requires exactly these five verified metric families:

1. `city_population`
2. `student_living_cost_monthly_range`
3. `student_transport_reference`
4. `student_work_hours_week`
5. `employment_focus_sectors`

Population uses one common FSO STATPOP 2022 reference date. Living and transport remain source-native rather than a fabricated harmonized cost ranking. Third-country student-work context is national and explicitly non-City-specific.

## Compare checks

Compare readiness requires:

- six-City support/publication allowlist membership
- all five verified metric families
- at least one linked verified study location
- at least one linked canonical institution
- a resolvable Switzerland City profile

Default pair is Zurich/Lausanne. Duplicate left/right pairs are rejected. The matrix does not score a winner.

## Publication checks

Exactly six City routes are indexable and root-sitemap-listed:

`zurich, lausanne, basel, lugano, fribourg, geneva`

The shared parameterized `/compare` surface remains globally `noindex, nofollow`.

## Read-model security

Switzerland City read-model migrations use `security_invoker=true`. They revoke access from `public`, `anon`, and `authenticated`, and grant SELECT only to `service_role`.

The Phase 8 Supabase advisor scan reports project-wide pre-existing advisory inventory including:

- RLS-enabled tables without policies
- leaked-password protection disabled
- unindexed foreign keys
- unused indexes

Phase 6–8 creates no new database object and does not weaken the Switzerland service-role-only read-model contract. These project-wide advisories remain separate from the Switzerland Cities release gate.

Supabase remediation references include:

- RLS no-policy lint: https://supabase.com/docs/guides/database/database-linter?lint=0008_rls_enabled_no_policy
- leaked-password protection: https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection
- unindexed foreign keys: https://supabase.com/docs/guides/database/database-linter?lint=0001_unindexed_foreign_keys
- unused indexes: https://supabase.com/docs/guides/database/database-linter?lint=0005_unused_index

## CI state

Vercel deployment verification remains externally blocked by the account build-rate limit. The returned status is `Deployment rate limited — retry in 24 hours`, not a reported application build failure.

No GitHub Actions run has been created for this branch state. This QA record therefore does not claim a full remote build pass.

## Known coverage boundaries

- provider coverage is the 12 swissuniversities university-category institutions, not the complete accredited HEI universe
- campus inventories are intentionally incomplete
- programme coverage remains `verified_partial`
- most international evidence is `verified_general`
- Lausanne municipality deliberately excludes the EPFL main-campus programme cohort
- source-native budget and fare references are not normalized City rankings
- third-country work rules are national context and EU/EFTA cases can differ

## Phase 8 conclusion

The Switzerland-specific data, profile, Compare, publication and disclosure contracts are release-ready. Phase 9 may reconcile the branch with current main, while the external Vercel rate limit remains the unresolved remote deployment check.

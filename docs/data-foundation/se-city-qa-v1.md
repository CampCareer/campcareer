# Sweden city cross-phase QA v1

Status: `PHASE_8_COMPLETE`

Checkpoint: `PUBLISH_READY`

Branch: `agent/se-cities-v1`

Audit date: 2026-08-10

## Production recheck

Production was re-queried after Phase 7.

Verified state:

- Tier A cities: 6
- unexpected Sweden Tier A cities: 0
- verified university city-location rows: 10
- distinct linked canonical universities: 10
- verified-partial programme rows: 271
- source-city / published-city mismatches: 0
- verified core metric rows: 30
- Tier A cities missing any of the five required metric families: 0
- compare-ready cities: 6

## Read-model security

The three Sweden city read models were directly rechecked:

- `public.city_directory_se_v1`
- `public.city_institution_directory_se_v1`
- `public.city_programme_directory_se_v1`

All three have:

- `security_invoker=true`
- `service_role` SELECT: yes
- `anon` SELECT: no
- `authenticated` SELECT: no

## Cross-phase product checks

The repository QA contract verifies:

- exact six-city route allowlist;
- SCB municipality geography contract;
- UKÄ-backed institution identity;
- `SE_UNIVERSITYADMISSIONS` verified offering linkage;
- exact programme source-city reconciliation;
- all five metric families;
- national budget/work-rule non-ranking semantics;
- source-native transport semantics;
- profile-to-Compare navigation;
- exactly six indexable Sweden city profiles;
- sitemap derivation from `PUBLISHED_SE_CITY_SLUGS`;
- unsupported routes remain noindex/not found;
- shared parameterized Compare remains noindex.

## Supabase advisors

Security and performance advisors were run after the Phase 2–4 DDL work and again at Phase 8.

No Sweden city read-model exposure regression was identified. Existing project-wide notices remain, including:

- `rls_enabled_no_policy` INFO notices for many service-only/staging tables;
- leaked-password protection disabled WARN for Supabase Auth;
- pre-existing unindexed-foreign-key and unused-index INFO notices.

The Sweden staging catalogue also has an existing unused-index INFO notice; Phase 8 does not treat that as a city-rollout correctness failure.

## CI gate

GitHub Actions on draft PR #207 is the compilation/test gate for Phase 8. The required pipeline is:

- dependency install/audit;
- typecheck;
- lint;
- full test suite including Sweden Phase 2–8 contracts;
- production build;
- Git-history secret scan.

No production database mutation is introduced in Phase 8.

Next: Phase 9 current-main integration reconciliation.
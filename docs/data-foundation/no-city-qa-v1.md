# Norway Cities — Phase 8 release QA v1

Status: `PHASE_8_COMPLETE`
Checkpoint: `PUBLISH_READY_WITH_EXTERNAL_CI_LIMIT`
Country: `NO` — Norway
Checked: 2026-08-11
Branch: `agent/no-cities-v1`

## QA scope

Phase 8 validates the Norway Cities Phase 0–7 contract before main reconciliation.

## Data cardinality

The controlled Phase 2–4 Supabase replay was executed transactionally and rolled back after verification. The expected branch contract resolved to:

- Tier A municipalities: 5
- verified institution/study-location rows: 6
- verified-partial city programme links: 97
- verified City metric rows: 25
- required metrics per city: 5

Expected programme distribution:

| City | Programmes |
|---|---:|
| Oslo | 34 |
| Trondheim | 27 |
| Stavanger | 14 |
| Ås | 11 |
| Tromsø | 11 |

The production database was not left mutated by that QA replay.

## Geography and scope checks

Required published municipality contracts:

- Oslo `0301`
- Trondheim `5001`
- Stavanger `1103`
- Ås `3218`
- Tromsø `5501`

Deferred cities must not acquire Tier A publication metadata:

`bodo, kongsberg, kristiansand, bergen, elverum`

## Linkage checks

The City read model requires:

- exact `NO_STUDYINNORWAY` offering provenance
- active canonical institution
- active verified study-location representative
- programme source city equal to the verified municipality display name
- `programme_assignment_verified=true`

Institution presence alone is not sufficient for programme delivery.

## Metric checks

Every published city requires exactly these five verified metric families:

1. `city_population`
2. `student_living_cost_monthly_range`
3. `student_transport_reference`
4. `student_work_hours_week`
5. `employment_focus_sectors`

National student-funds/living and UDI work-rights context remain explicitly non-city-specific. Local transport remains source-native.

## Compare checks

Compare readiness requires:

- published/support allowlist membership
- all five verified metric families
- at least one linked study location
- at least one linked canonical institution
- a resolvable Norway City profile

Default pair is Oslo/Trondheim. Duplicate left/right pairs are rejected. The matrix does not score a winner.

## Publication checks

Exactly five City routes are indexable and sitemap-listed:

`oslo, trondheim, stavanger, as, tromso`

The shared parameterized `/compare` surface remains `noindex, nofollow`.

## Read-model security

Norway City read-model migrations use `security_invoker=true`. They revoke access from `public`, `anon`, and `authenticated`, and grant SELECT only to `service_role`.

The Phase 8 Supabase advisor scan reported project-wide pre-existing advisory inventory including RLS-enabled tables without policies, unindexed foreign keys, unused indexes, and disabled leaked-password protection. Phase 6–8 introduces no new database object and does not weaken the Norway service-role-only read-model contract. These project-wide advisories are tracked separately from the Norway Cities release gate.

## CI state

Vercel deployment verification is externally blocked by the account build-rate limit. The previously returned status is `Deployment rate limited — retry in 24 hours`, not a reported application build failure.

Because this environment has no runnable repository checkout and no GitHub Actions run was created for the branch, Phase 8 records this as an external CI limitation rather than claiming a full remote build pass.

## Known coverage boundaries

- provider coverage is not Norway's complete approved HEI universe
- campus inventory is intentionally incomplete
- programme coverage remains `verified_partial`
- admissions verification may still be general rather than programme-specific
- national rules are not city rankings

## Phase 8 conclusion

The Norway-specific data, route, Compare, publication and disclosure contracts are release-ready. Phase 9 may reconcile the branch with current main, while the external Vercel rate limit remains the only unresolved remote deployment check.

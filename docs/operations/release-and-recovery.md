# CampCareer release and recovery runbook

## Stop-ship checks

- Confirm leaked GitHub and Anthropic credentials have been revoked and audit logs reviewed.
- Confirm the production Supabase schema baseline matches the repository before applying new migrations.
- Require typecheck, lint, unit tests, production build, gitleaks, policy diff and desktop/mobile E2E to pass.
- Do not publish a data version containing `review_required` policy sources.

## Data release

1. Collect source files into an immutable candidate version.
2. Normalize and validate in a non-production environment.
3. Record source ID, reference period, retrieval time and reviewer for every metric.
4. Run deterministic recommendation snapshots against the candidate.
5. Publish the new version atomically; never mutate the previous version in place.
6. Purge only affected CDN keys and retain the previous version for rollback.
7. Saved plans retain their original `engineVersion` and `dataVersion`. Users explicitly choose `Recalculate with latest data`.

## Data rollback

1. Mark the affected version unavailable for new recommendations.
2. Point the current-version alias to the last approved immutable version.
3. Purge taxonomy, recommendation, course-offering and map bundle CDN keys.
4. Run recommendation determinism and source-link smoke tests.
5. Keep saved-plan snapshots unchanged and record the rollback reason and approver.

Target recovery time: 15 minutes after the rollback decision.

## Supabase restore drill

Perform quarterly in a separate project:

1. Record production migration version and take a provider backup/PITR marker.
2. Restore to an isolated Supabase project in Dublin.
3. Apply repository migrations only after the restored baseline reports diff zero.
4. Verify owner-only RLS with two test users, including cross-user reads, updates and recalculation attempts.
5. Verify decision-plan counts, version history and save-intent uniqueness.
6. Record restore duration, missing objects and remediation actions. Never repoint production clients during a drill.

## Bounded load test

Use the manually triggered `Load smoke test` workflow only against a deployment explicitly approved for testing. Default thresholds are error rate below 0.5% and p95 below 500 ms. Increase traffic in stages and stop if database CPU p95 exceeds 60%.

## Incident ownership

- Policy change: mark affected results `review_required`, remove them from rankings and assign editorial review.
- Course registration change: remove the offering from shortlist and invalidate its CDN entry.
- Credential exposure: revoke first, inspect audit and billing logs, then rewrite Git history and invalidate old clones.
- Database incident: disable writes if necessary, preserve evidence, restore into isolation, validate RLS, then approve cutover.

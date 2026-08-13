# Pre-Marketing Stabilization

Date: 2026-08-13
Baseline: `main` at `fbbef42469dc5c109244baa3e4275c93334e1127`
Release branch: `release/pre-marketing-stabilization`

## Objective

Freeze the product experience required for a controlled beta before large-scale promotion. The release gate is the end-to-end user journey, not feature count.

Primary reference journey:

`Landing -> Career result -> Sign in -> Personalisation -> Career result -> Save -> Home -> Compare`

Australia Registered Nurse remains the highest-confidence reference path for product QA. Other career/country combinations must never silently fall back to unrelated nursing content.

## Release blockers

### P0. Authentication and result continuity

- Signed-in users must not receive a primary `Sign in` CTA on career results.
- Personalisation completion must be detected from `user_preferences.career_personalisation_completed_at`.
- Finishing personalisation must return the user to the career result that initiated the flow when a valid country and occupation were supplied.
- Re-login must preserve the requested result destination.

### P0. Result save continuity

- A career result must expose an obvious save action.
- A signed-out save request must return to the same result after authentication.
- A saved career path must be visible again from Home.
- Saved state must be idempotent and user-owned under RLS.

### P0. Compare context

- Compare must preserve the current country and career when a supported comparison contract exists.
- Unsupported contexts must not fall back to unrelated default content.
- Australia Software Developer must enter Career Compare with Software Engineer preselected under the current AU comparison contract.

### P1. Korean UI separation

- Workspace navigation, country controls, Compare mode labels, empty states and action labels must use the active locale.
- Korean routes must not expose mixed English workspace chrome except proper nouns that are intentionally untranslated.

### P1. Result loading state

- Replace the dominant spinner/`Preparing...` treatment with a stable result skeleton.
- The skeleton should reserve visible space for score, evidence/source status and key result sections to reduce perceived layout shift.

## Automation gates

The stabilization branch is not releasable until CI covers:

1. signed-out career result -> login -> personalisation -> same result
2. signed-in incomplete personalisation -> onboarding -> same result
3. signed-in completed personalisation -> personalised result
4. result -> save -> Home -> reopen
5. AU Software Developer result -> Career Compare with current career preselected
6. AU Registered Nurse reference result and program comparison regression
7. Korean workspace navigation and result actions
8. typecheck, lint, full unit suite and production build

## Branch policy

Do not merge old feature branches into this release branch by branch name alone. The repository contains many cumulative and stacked draft PRs based on historical `main` heads. Stabilization changes must be rebuilt or selectively replayed on the current baseline and validated independently.

Active product-expansion PRs remain outside this release unless explicitly accepted into the stabilization scope. In particular, country occupation/city expansion is not a pre-marketing blocker.

## Current implementation

First stabilization patch: PR #228, `agent/pre-marketing-stabilization-context` -> `release/pre-marketing-stabilization`.

It introduces auth-aware result actions and prevents supported AU career results from dropping into unrelated nursing program comparison. Further auth-flow, save, Korean UI, loading-state and E2E changes remain gated work on this release branch.

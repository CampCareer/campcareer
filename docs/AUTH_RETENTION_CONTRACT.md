# CampCareer Authentication & Retention Contract

Status: Canonical product contract

## Principle

> Value first. Account second.

Authentication exists to remember a user's state and continue a decision over time. It is not a prerequisite for receiving CampCareer's core career value.

## Public without an account

A signed-out visitor must be able to use the core decision journey:

`Home / Search → Career Page → CampCareer Score → Evidence → Path → Study / Programs → Jobs`

The following remain public by default:

- CampCareer Score and verdict
- Demand, Pay and Entry evidence
- basic career pathway
- licensing, registration and work-rights context
- Study / Programs discovery
- Jobs and verified employer/job-search links
- Compare
- country, city, visa and map context reached from the career decision

Do not insert login, signup, onboarding or personalisation gates into this journey merely to increase account creation.

## Account-required capabilities

Authentication is appropriate when CampCareer must persist user-specific state, including:

- Save a career
- manage multiple saved careers
- profile and account settings
- history
- alerts and notifications
- persistent personalised recommendations
- persistent `Your Path` preferences or other user-specific pathway state

The rule is:

`View = public`  
`Persist = account`

## Post-login routing

Authentication must return the user to the action or context that caused the login.

Rules:

1. A validated explicit `next` destination always wins.
2. Login without a `next` destination returns to public Career discovery at `/` in the active locale.
3. Signup or first sign-in must never force onboarding.
4. `/onboarding` is used only when the user explicitly requested personalisation/onboarding.
5. Generic login links preserve the current pathname, query string and hash where practical.
6. Public `/home` compatibility redirects must never be turned into an authentication gate.

## Save intent

Signed-out Save follows:

`Career Page → Save → Authentication → Save completed → same Career Page`

Authentication should complete the intent rather than make the user click Save again.

The one-time Save marker is validated only for an internal Career Page URL. The save mutation happens as part of successful authentication, and the marker is removed before returning to the Career Page. Ordinary Career Page GETs remain read-only.

## Personalisation

Personalisation is an optional post-value action, not account onboarding.

A future CTA may explicitly start flows such as:

- `Personalize your path`
- `Get recommendations for me`

Only those explicit intents may lead into personalisation questions. A newly created account by itself is not consent to begin onboarding.

Personalisation changes `Your Path`; it never changes the public CampCareer Score.

## Protected routes

Account/retention surfaces may remain protected, such as saved careers, profile, settings, history, alerts and explicit personalisation flows.

Do not protect the core Career Page, Score, Evidence, Path, Programs, Jobs or Compare merely because authentication infrastructure exists.

## Copy rule

Login copy should explain the retention benefit that caused the request.

Good:

- `Save this career`
- `Sign in to keep this career and come back to it anytime.`
- `Save careers and keep your progress.`

Avoid copy that implies an account is required to access CampCareer's core career judgment.

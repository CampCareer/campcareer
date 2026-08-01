# Local authentication

This document records the local authentication baseline used by the Home search,
saved pathway, and Dashboard flows.

## Required local environment

Set these values in `.env.local` before starting the app:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<publishable-or-anon-key>
NEXT_PUBLIC_SITE_URL=http://localhost:3102
```

`NEXT_PUBLIC_SITE_URL` is used by absolute-link helpers. Never put a service-role
key in a `NEXT_PUBLIC_` variable.

## Supabase redirect allow list

The login page builds OAuth and email redirects from the active browser origin:

```
${location.origin}/auth/callback?next=<safe-relative-home-path>
```

For the current local dev server, open **Supabase Dashboard → Authentication →
URL Configuration** and add this to **Additional Redirect URLs**:

```
http://localhost:3102/**
```

If you run the app on a different local port, add that exact origin instead (for
example `http://localhost:3000/**`). The wildcard is for local development only;
production should allow only its exact HTTPS callback path. Keep the production
domain as the Supabase **Site URL** so redirects without an explicit
`redirectTo` remain safe.

The callback route validates the `next` path before redirecting. This allows the
guest-save flow to return to the original Home result and run its controlled
`save=1` action after sign-in.

## Functional baseline

- Guest `/home` shows Explore; a valid Home query always shows Result mode.
- An authenticated user without a valid Home query sees the Dashboard.
- `mode=explore` restores the authenticated Explore screen, unless a valid result
  query is also present (Result mode wins).
- Saved pathways are keyed by user, country, and field. Saving a later status
  updates that same pathway rather than inserting a duplicate.

Reference: [Supabase redirect URL documentation](https://supabase.com/docs/guides/auth/redirect-urls).

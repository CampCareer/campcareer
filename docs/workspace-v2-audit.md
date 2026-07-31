# Workspace V2 — Codebase Audit

**Date**: 2026-07-31  
**Scope**: Pre-implementation audit for introducing a shared left-sidebar app layout across `/home`, `/compare`, `/visas` while preserving existing Maps functionality.  
**Rule**: Zero code changes — all findings are observational.

---

## 1. Next.js Routing & Layout Structure

| Aspect | Details |
|---|---|
| Router | Next.js App Router (`src/app/`) |
| Global layout | `src/app/layout.tsx` — wraps with `LayoutShell`, `LocaleProvider`, `PageViewTracker`, `AnalyticsConsent` |
| Nested layouts | `onboarding/`, `login/`, `us/`, `ca/`, `roi-explorer/`, `de/`, `au/` — each exports only metadata, renders children as-is |
| i18n strategy | Locale prefix via `LOCALE_META[].prefix`. `en` → no prefix (default), `ko` → `/ko/...`. `localeFromPathname()` detects prefix, `withoutLocalePrefix()` strips it |
| Locale routes | `/ko/page.tsx`, `/ko/maps/[country]/[slug]/page.tsx`, `/ko/regional-workspace/page.tsx`, `/ko/routes/...`, `/ko/[country]/...` |

### Key files
- `src/app/layout.tsx` (root)
- `src/components/layout/layout-shell.tsx`
- `src/lib/i18n/config.ts`
- `src/lib/i18n/locale-provider.tsx`

---

## 2. Global Header & Navigation

| Component | File | Behavior |
|---|---|---|
| `LayoutShell` | `src/components/layout/layout-shell.tsx` | Renders `TopNav` + `<main>` + `SiteFooter`. Hides TopNav for `/map/*` (interactive canvas), hides footer for the same. Detects landing page (`/`) for dark bg. |
| `TopNav` | `src/components/layout/top-nav.tsx` | Sticky header (h-16, z-40). Wordmark (left), Maps link, language modal (Globe icon), Login/Profile link (right). No sidebar. |
| `SiteFooter` | `src/components/layout/site-footer.tsx` | Three-column footer with Routes/Info links. Hidden on interactive map. |
| `ToolNavActions` | `src/components/layout/tool-nav-actions.tsx` | Shared account/avatar/app-switcher widget. Used by Maps toolbar and Planner toolbar. Supports `minimal` prop for compact mode. |

### Collision note
`LayoutShell` owns the global page structure. A WorkspaceShell can either:
(a) replace `LayoutShell` for specific routes (via layout nesting), or
(b) be injected inside `<main>` alongside the current TopNav.

---

## 3. Maps Routes (full tree)

### Public content route (`/maps`)
| Path | Type | Description |
|---|---|---|
| `/maps` | Server page | Wraps `CampCareerMaps` with `getInitialMapShellData()`. Title: "Australia opportunity map". |
| `/maps/[country]` | Server page | Redirects to `/maps?country=...` for legacy aliases (`au`, `australia`, `gb`, `usa`, etc.) |
| `/maps/[country]/[slug]` | Server page | **Static** occupation detail pages (SG, KR, FR, ES, IE, UK, DE, NL, BE, US). Title: "{Name} Map in {Country}". Breadcrumbs + JSON-LD. |
| `/maps/[country]/regions/[region]` | Server page | Region profile for NZ, NO, SE, DK, FI. SSG with `generateStaticParams`. |
| `/maps/es/regions/[region]` | Dynamic route | Spain region sub-pages |
| `/maps/es/provinces/[province]` | Dynamic route | Spain province sub-pages |
| `/maps/es/cities/[city]` | Dynamic route | Spain city sub-pages |
| `/maps/fr/regions/[region]` | Dynamic route | France region sub-pages |
| `/maps/fr/cities/[city]` | Dynamic route | France city sub-pages |
| `/maps/kr/regions/[region]` | Dynamic route | Korea region sub-pages |
| `/maps/jp/cities/[city]` | Dynamic route | Japan city sub-pages |
| `/maps/jp/prefectures/[prefecture]` | Dynamic route | Japan prefecture sub-pages |
| `/maps/sg/areas/[area]` | Dynamic route | Singapore area sub-pages |
| `/ko/maps/[country]/[slug]` | Server page | Korean locale occupation map page |

### Interactive tool route (`/map`)
| Path | Type | Description |
|---|---|---|
| `/map` | Client page | 7704-line **CampCareerMaps** — Leaflet-based interactive map. Hides TopNav/Footer. Has its own toolbar (`ToolNavActions`). Covers AU, CA, CH, DE, DK, ES, FI, FR, IE, JP, KR, NL, NO, NZ, SE, UK, US. |

### Key files
- `src/app/maps/page.tsx`
- `src/app/map/CampCareerMaps.tsx`
- `src/app/maps/[country]/page.tsx`
- `src/app/maps/[country]/[slug]/page.tsx`
- `src/app/maps/[country]/regions/[region]/page.tsx`
- `src/app/map/LeafletMap.tsx`
- `src/app/map/states.ts`
- `src/lib/map-data.ts`
- `src/lib/map-slugs.ts`

---

## 4. Login & User Session Handling

| File | Pattern |
|---|---|
| `src/app/login/page.tsx` | Client component. Google OAuth + email/password. `createClient()` from `supabase-client`. Uses `searchParams.next` for post-login redirect. |
| `src/app/login/layout.tsx` | Metadata only (children passthrough). |
| `src/app/auth/callback/route.ts` | Server route. Exchanges `?code` for session via `createClient()` (server). Redirects to `?next` or `/profile`. |
| Session check pattern | Client: `supabase.auth.getUser()` + `onAuthStateChange` subscription in `useEffect`. Server: `(await createClient()).auth.getUser()` |

### Auth flow
1. User clicks "Log in" → `/login?next=/profile`
2. OAuth redirects to `/auth/callback?code=...&next=/profile`
3. Callback exchanges code → redirects to `/profile`
4. Profile page reads session client-side, queries `user_preferences`, `saved_occupations`, etc.

### No middleware
No `middleware.ts` exists. Route protection is handled client-side (redirect to `/login` if no user).

---

## 5. Supabase Client & Server Patterns

| File | Export | Scope |
|---|---|---|
| `src/lib/supabase-client.ts` | `createClient()` → `createBrowserClient` | Client components (browser bundle) |
| `src/lib/supabase-server.ts` | `createClient()` → `createServerClient` (async, cookies) | Server components + Route handlers |
| `src/lib/supabase-admin.ts` | `supabaseAdmin` → `createClient` with service_role key | Server-only (writes, bypasses RLS) |
| `src/lib/supabase.ts` | `supabase` → `createClient` (legacy, anon key) | Read-only, used in data scripts |

### Common tables queried
- `user_preferences`
- `saved_occupations`
- `saved_universities`
- `program_completions`
- `programme_evidence`
- `reputation_ledger`
- `assessments`
- `decision_plans`
- `decision_plan_versions`

---

## 6. Existing Feature Routes

| Route | Type | Description |
|---|---|---|
| `/planner` | Client page | Full planner with tabs, toolbar, sidebar (7 areas). 1058-line orchestrator. Uses localStorage for tab state. |
| `/planner/applications` | — | Sub-view |
| `/planner/english` | — | Sub-view |
| `/planner/money` | — | Sub-view |
| `/planner/notes` | — | Sub-view |
| `/planner/pathway` | — | Sub-view |
| `/planner/report` | — | Sub-view |
| `/planner/research` | — | Sub-view |
| `/home` | Server page | Delegates to `PlannerPage` with `initialArea="home"` |
| `/compare` | Server page | Delegates to `PlannerPage` with `initialArea="compare"` |
| `/compare/careers` | Client page | Career comparison tool (occupation picker) |
| `/compare/majors` | Client page | Major comparison tool |
| `/compare/schools` | Client page | School comparison tool |
| `/plans/[id]` | Server page | Decision plan view with recalculate button. Protected: redirects to `/login` if no session. |
| `/profile` | Client page | User profile with stats, planning direction, saved careers/providers, achievements |
| `/profile/achievements` | — | Sub-route |
| `/profile/contributions` | — | Sub-route |
| `/profile/programs` | — | Sub-route |
| `/profile/portfolio` | — | Sub-route |
| `/profile/evidence` | — | Sub-route |
| `/settings` | Client page | Account settings, username, sign out, delete account |
| `/dashboard` | Server page | Redirects to `/home` |
| `/decision-brief` | Client page | Decision brief tool |
| `/regional-workspace` | Server page | Australia ROI workspace with filters, universities, career signals |
| `/onboarding` | Client page | Onboarding flow |

### Routes that do NOT exist
- `/visas` — target for Workspace V2 sidebar
- `/saved` — no dedicated route; saved items shown via `/profile`

---

## 7. Mobile Navigation

| Component | File | Behavior |
|---|---|---|
| `MobileBottomBar` | `src/components/layout/mobile-bottom-bar.tsx` | Fixed bottom bar (z-50) on `< sm`. 4-column grid: Find Path, Compare Study, Plan, Profile/Login. |
| Visibility | Hidden when "search-modal-open" custom event fires (search overlay). Uses `safe-area-bottom` padding. |
| Auth awareness | `supabase.auth.getUser()` + `onAuthStateChange` — shows avatar or login icon. |
| **Not used in Workspace V2** | The mobile bar lives in `LayoutShell` context. A sidebar-based workspace must decide whether to keep, hide, or replace it. |

---

## 8. Design Tokens & Common UI Components

### CSS Variables (`src/app/globals.css`)
- `--brand` (blue-600 `#2563EB`), `--brand-foreground`, `--brand-press`, `--brand-tint`
- `--background`, `--foreground`, `--card`, `--border`, `--ring`, etc. (shadcn-compatible)
- Utility classes: `.campcareer-wordmark`, `.btn-3d`, `.text-question`, `.text-option`, `.safe-area-bottom`, `.no-scrollbar`

### Tailwind config (`tailwind.config.ts`)
- Font families: `sans` (Geist), `display` (Fraunces), `mono` (Geist Mono)
- Color extensions: `brand`, `chart-1..5` via OKLCH
- Border radius: `lg: var(--radius)` (0.5rem default)

### Shared UI Components (`src/components/ui/`)
| File | Exports |
|---|---|
| `button.tsx` | `Button` with CVA variants: default, destructive, outline, secondary, ghost, link, tactile |
| `badge.tsx` | Badge component (shadcn-style) |
| `card.tsx` | Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter |
| `tabs.tsx` | Tabs, TabsList, TabsTrigger, TabsContent |
| `select.tsx` | Select, SelectTrigger, SelectValue, SelectContent, SelectItem |
| `separator.tsx` | Separator (Radix) |
| `progress.tsx` | Progress bar (Radix) |
| `choice-card.tsx` | ChoiceCard component |

### Third-party UI dependencies
- `@radix-ui/react-slot` (Slot for polymorphic Button)
- `class-variance-authority` (CVA)
- `clsx` + `tailwind-merge` (via `cn()`)
- `lucide-react` (icons)
- `framer-motion` (animations)
- `@base-ui/react` (headless UI primitives)
- `tw-animate-css` (CSS animations)

---

## 9. Commands

```json
{
  "dev":         "next dev",
  "build":       "next build",
  "start":       "next start",
  "lint":        "eslint .",
  "typecheck":   "tsc --noEmit",
  "test":        "npm run test:unit",
  "test:unit":   "tsx --test tests/**/*.test.ts",
  "test:e2e":    "playwright test"
}
```

---

## 10. Collision Risk Analysis for WorkspaceShell

### 10.1 Risk matrix

| Area | Risk | Explanation |
|---|---|---|
| `/home` → `PlannerPage` | **HIGH** | Currently delegates to the full Planner. Any new layout must either replace or coexist with Planner's own sidebar + toolbar + tabs. |
| `/compare` → `PlannerPage` | **HIGH** | Same as above. `initialArea="compare"` triggers Planner's CompareSpace. |
| `/maps/*` (public) | **LOW** | Uses standard `LayoutShell` with TopNav. New layout for `/home/compare/visas` should not affect Maps routes. |
| `/map` (interactive) | **NONE** | Already isolated — no TopNav, no footer, full-viewport canvas. No conflict. |
| `/plans/[id]` | **LOW** | Standalone server page, no shared layout. Easy to coexist. |
| `/profile` | **LOW** | Full-page client component. Could optionally adopt workspace shell later. |
| `/settings` | **LOW** | Full-page client component. Same as profile. |
| `/dashboard` | **LOW** | Redirects to `/home`. No direct conflict. |
| `MobileBottomBar` | **MEDIUM** | If workspace shell has its own mobile nav, the global `MobileBottomBar` must be conditionally hidden. |
| `/visas` | **NONE** | Route does not exist — no regression risk. |
| `/ko/…` locale routes | **MEDIUM** | Need parallel sidebar routes. No `/ko/home` or `/ko/compare` routes exist yet — they'd fall through to the Planner. |

### 10.2 PlannerPage architecture (key collision factor)

`PlannerPage` (`src/app/planner/page.tsx`, ~1058 lines) is a monolithic client component that:

1. Manages its own sidebar (`PlannerSidebar` — left, 288px, 7 nav items)
2. Manages its own toolbar (`PlannerToolbar` — top, tabs, back/forward, app switcher)
3. Stores tabs in `localStorage` (not URL-driven)
4. Handles user auth independently
5. Delegates `/home` and `/compare` to different initial areas

**Any WorkspaceShell that wraps `/home` and `/compare` must address this conflict.** Options:
- Option A: Extract PlannerSidebar/nav into WorkspaceShell, refactor PlannerPage to use WorkspaceShell internally
- Option B: Create separate `/home` and `/compare` pages (not delegating to Planner), keep Planner as a standalone tool
- Option C: WorkspaceShell wraps only new routes (`/visas`), leaving `/home` and `/compare` unchanged

---

## Summary

### Reusable files (no changes needed, import directly)
- `src/lib/supabase-client.ts` — browser Supabase client
- `src/lib/supabase-server.ts` — server Supabase client
- `src/lib/utils.ts` — `cn()` utility
- `src/components/ui/button.tsx` — Button with CVA
- `src/components/ui/card.tsx` — Card components
- `src/components/ui/tabs.tsx` — Tabs primitive
- `src/components/layout/tool-nav-actions.tsx` — Account/app switcher
- `src/lib/i18n/config.ts` — locale routing utilities
- `src/lib/i18n/locale-provider.tsx` — locale context
- `src/app/globals.css` — design tokens + utility classes
- `tailwind.config.ts` — design system config

### Files needing modification
- `src/components/layout/layout-shell.tsx` — may need to accept a sidebar variant or disable for workspace routes
- `src/components/layout/top-nav.tsx` — may need to hide on workspace pages (sidebar replaces top nav)
- `src/components/layout/mobile-bottom-bar.tsx` — may need to hide when workspace sidebar is active
- `src/app/layout.tsx` — minor, if workspace routes need a different layout wrapper
- `src/app/home/page.tsx` — currently delegates to Planner; may need to route to workspace
- `src/app/compare/page.tsx` — same as above
- `src/lib/supabase-server.ts` — potential minor if workspace adds server-side data loading

### New files to create
- `src/components/layout/workspace-shell.tsx` — new shared app layout with left sidebar
- `src/components/layout/workspace-sidebar.tsx` — sidebar nav for home/compare/visas
- `src/app/visas/page.tsx` — new visas route
- `src/app/visas/layout.tsx` — workspace layout wrapper for visas
- `src/app/home/layout.tsx` — workspace layout wrapper for home (if separating from Planner)
- `src/app/compare/layout.tsx` — workspace layout wrapper for compare (if separating from Planner)
- `src/lib/visas/…` — visas data layer
- `src/components/visas/…` — visas UI components

### Existing Maps regression risks
| Risk | Severity | Mitigation |
|---|---|---|
| LayoutShell changes affect `/maps` | Medium | Gate workspace layout changes behind pathname checks (same pattern as `isInteractiveMap`) |
| TopNav visibility changes affect `/maps` | Low | `/maps` should keep TopNav — it's a public page |
| CSS variable changes | Low | New sidebar tokens should extend, not override |
| MobileBottomBar hiding logic | Low | Workspace routes should explicitly hide it, Maps should not |
| `/ko/maps/[country]/[slug]` remains stable | None | No changes to maps routes |

### Recommended implementation order
1. Create `WorkspaceShell` and `WorkspaceSidebar` as optional layout components (no route changes)
2. Create `/visas` route with `WorkspaceShell` layout
3. Add pathname gating to `LayoutShell` so workspace routes can hide TopNav / MobileBottomBar
4. Refactor `/home` to use `WorkspaceShell` (stop delegating to Planner; or make Planner embed WorkspaceShell)
5. Refactor `/compare` to use `WorkspaceShell`
6. Add locale-prefixed workspace routes (`/ko/home`, `/ko/compare`, `/ko/visas`)
7. Test all `/maps/*` routes for regression
8. Test all `/map` interactive routes for regression

### Verification
- No actual code changes have been made in this audit.
- All findings are observational.
- `git diff --stat` confirms zero file modifications.

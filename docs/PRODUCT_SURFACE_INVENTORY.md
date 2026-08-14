# CampCareer Product Surface Inventory

Status: canonical product-surface policy for the current core-product cleanup.

CampCareer scores careers and shows people the path to get there. The public product should therefore feel like one continuous decision flow, not a dashboard containing many equal tools.

Core flow:

`Search / Social → Career Page → CampCareer Score → Evidence → Path → Study / Programs → Jobs`

Primary rule: **Value first. Account second.**

Cleanup objective: **remove cognitive load, not capability.** Hide before deleting. Existing data, APIs and route implementations can remain dormant until there is evidence they should be removed.

## Surface classification

### Keep

These are part of the core product and may be first-class destinations or sections in the core flow.

| Surface | Current route family | Rule |
| --- | --- | --- |
| Career discovery | `/` | Public starting point. Ask for career + country and go directly to Career Page. |
| Career Page | `/career` and future `/career/[country]/[occupation]` | Primary product surface. Score first, then evidence and path. |
| CampCareer Score | Career Page component/read model | Primary judgment object. Never compete with another public score. |
| Study | `/study/*` and contextual Career Page study sections | Appears as a step in the path, not as the first decision. |
| Programs | `/programs`, `/courses`, Career Page program links | Core action surface when a program helps enter the selected career. |
| Jobs | country/job route families such as `/{country}/jobs` and Career Page job links | Core action surface in career context. |

### Secondary

These support retention or deliberate comparison after value has been delivered. They are not acquisition gates and do not belong in primary navigation by default.

| Surface | Current route/capability | Rule |
| --- | --- | --- |
| Save | `saved_career_results` and Career Page action | Show after the result. Signed-out users may be asked to log in only when they choose Save. |
| Compare | `/compare` and contextual compare links | Keep accessible from relevant results. Do not present it as an equal top-level product. |
| Login / Account | `/login`, `/profile`, `/settings` | Utility only. Login must not be required to see Score, Evidence or the basic Path. |

### Contextual

These capabilities remain useful but should normally be entered from a career, path, study or job context rather than global navigation.

| Surface | Current route family | New role |
| --- | --- | --- |
| Countries / Cities | `/countries`, `/cities`, country profile routes | Geographic evidence and context for a selected career. |
| Visa | `/visas` and country visa content | Work-rights/pathway context. Visa is excluded from CampCareer Score. |
| Maps | `/maps`, legacy `/map` | Geographic support when a Career Page or Path benefits from location context. No independent exploration CTA in the primary journey. |
| Institutions | `/institutions` | Provider context behind relevant Programs. |
| Occupation explorer | `/occupation` | Supporting discovery surface. Career Page remains the result surface. |
| SEO country/job/study routes | country-specific route families | Preserve for search/discovery, but connect visitors into Career Page and the core flow. |

### Hide for now

Keep implementation/data unless deletion is clearly safe, but do not make these visible product destinations.

| Surface | Current route/capability | Current behavior |
| --- | --- | --- |
| Member dashboard Home | `/home`, member hub/dashboard components | `/home` redirects to public Career discovery. Components remain in repo. |
| Early onboarding | `/onboarding` | Remove Career Page entry points. Keep route/data for later pathway refinement. |
| Early personalisation | `personalised=1`, user preference prompts | Do not ask before public Score/Evidence/basic Path. |
| Workspace tool suite | legacy sidebar and equal-tool nav | Sidebar is not rendered. Routes remain directly accessible. |
| Legacy Career market brief | `CareerMarketResults` and related dashboard-era presentation | Keep implementation for compatibility/dormant surfaces, but do not render it on the primary Career Page. |
| Legacy planner/application/budget surfaces | `/planner`, `/applications`, `/budget` and related tools | No primary navigation entry. Preserve until later audit. |
| Legacy interactive map entry | `/map` | No primary navigation entry. Preserve implementation. |

## Navigation policy

CampCareer should not expose a menu of every capability.

1. The wordmark always returns to public Career discovery, never to a member dashboard.
2. Public navigation is deliberately minimal: brand, language, account utility.
3. Career, Study, Programs and Jobs should be connected by the user journey and contextual CTAs rather than a tool dashboard.
4. Save, Compare and Login are secondary actions.
5. Maps, Countries, Cities, Visa and Institutions may be linked when the current career/path requires them.
6. Hidden routes must not be re-added to global navigation merely because the implementation exists.

## Account and personalisation policy

The public Career Page must work without an account.

Allowed pre-account value:

- CampCareer Score
- verdict
- Demand / Pay / Entry
- interpretation
- evidence
- basic pathway
- relevant Study / Programs / Jobs

Account prompts are justified only by a user-initiated retention action such as Save, or a later pathway refinement that clearly benefits from personal information.

## Wave 1 implementation

Wave 1 changed product perception without destructive deletion:

- removed Maps from public TopNav
- made the wordmark return to `/` for signed-in and signed-out users
- removed the legacy workspace sidebar from the rendered shell
- reduced workspace topbar to brand + language + account utility
- redirected `/home` to `/`
- removed Career Page onboarding/personalisation actions
- kept Save and Compare as secondary Career Page actions
- hid remaining Career Page links whose destination is onboarding
- simplified public Home around Career → Score → Evidence → Path

## Wave 2 implementation

Wave 2 consolidates the full Career Page below the Hero.

The primary Career Page now renders:

`CampCareer Score Hero → Why this score → Path → Study / Programs → Jobs → Save / Compare`

Implementation rules:

- `career-core-sections.tsx` owns Evidence → Path → Study / Programs → Jobs.
- `CareerMarketResults` is no longer rendered by the Career Page.
- legacy `Job market score`, `FREE CAREER MARKET BRIEF`, duplicated market-score disclaimers and early personalisation blocks are therefore removed from the primary result experience without deleting their dormant implementation.
- Evidence explains Demand, Pay and Entry and surfaces official sources.
- Path carries licensing, training, work-rights/visa and job-market conditions without changing the public Score.
- Study / Programs uses verified career-relevant program, training and apprenticeship resources.
- Jobs uses verified live opportunities, employer entry points and official job-search resources.
- missing program/job evidence produces an explicit not-ready state rather than fabricated recommendations.

See `docs/CAREER_PAGE_CORE_FLOW.md` for the canonical Career Page contract.

## Future wave

Wave 3: rework Programs, Jobs, Compare, account, Countries, Visa and Maps around the new hierarchy; delete dormant code only after usage and dependency audits show it is safe.

## Do not regress

Do not restore any of the following without an explicit product decision:

- dashboard-first Home
- mandatory onboarding before value
- personalisation before the public career judgment
- Maps/Countries/Visas/Institutions as equal primary products
- sidebar navigation that presents every route as a user choice
- login as the destination after clicking the CampCareer wordmark
- legacy `CareerMarketResults` on the primary Career Page
- a second public career score below CampCareer Score

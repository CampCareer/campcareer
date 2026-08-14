# CampCareer Secondary and Contextual Surfaces

Status: canonical Wave 3 contract.

The core product remains:

`Career → CampCareer Score → Evidence → Path → Study / Programs → Jobs`

Everything in this document exists to support that flow. None of these surfaces may become an equal alternative product home.

## Programs

Programs are a core action surface only when education or training helps someone enter a selected career.

Rules:

- Career Page remains the preferred entry point.
- When `career` and `country` context are present, Programs must preserve and display that context.
- Changing country should keep the selected career when possible so users compare routes to the same outcome.
- Program copy should answer: “Can this program help me enter this career?”
- Institution prestige or catalogue breadth must not become the primary product promise.
- Missing verified career-program linkage must not be invented.

## Jobs

Jobs are the final action layer after Score, Evidence and Path.

Rules:

- The Career Page Jobs section is the primary Jobs surface.
- Show verified live opportunities, employer entry points and official job-search sources only.
- Existing country-specific job routes may remain for SEO/discovery or compatibility, but they are not a global Jobs dashboard.
- Do not add a top-level Jobs hub merely to expose existing route inventory.
- Job listings never alter the public CampCareer Score directly; they support Demand evidence and action.

## Compare

Compare is secondary.

Rules:

- Compare should be entered after the user has a decision to test.
- Career, program, country and city comparison capabilities may remain, but they must not be presented as an equal product suite.
- Comparison never replaces the Career Page verdict.
- Compare copy must direct users back to Score, Evidence and Path when they need the primary judgment.

## Account, Login and Save

Account is a retention utility.

Rules:

- Login is never required to see Score, Evidence, the basic Path, Study/Programs or Jobs.
- Profile is for saved careers, saved supporting items and account settings.
- Do not restore “workspace”, “set your direction”, dashboard-first Home or onboarding as the account’s primary purpose.
- Saved preference data may provide a recent Career context, but it must not silently change the public Score.

## Countries and Cities

Geography is context for a career.

Rules:

- Country and city pages may expose cost, labour-market, regional and policy evidence.
- They must not present themselves as destination dashboards competing with the Career Page.
- When career context is present, preserve a path back to that Career Page.
- Country/city evidence can inform Path and supporting evidence, not create a separate public career score.

## Visa and work rights

Visa is Path context, not Score input.

Rules:

- Visa/work-rights surfaces should describe verified routes and official requirements.
- Visa information may make a pathway easier, harder or impossible for an individual, but does not change the public CampCareer Score.
- Do not use visa-category colors or gamified attractiveness styling as a product judgment.
- Career Page remains the decision surface; Visa is a supporting check.

## Maps

Maps are regional context.

Rules:

- Map routes remain hidden from global navigation.
- Maps are useful after a career is selected, when regional demand, licensing or access matters.
- A map does not create a separate opportunity score or destination ranking product.
- When `country + career` context is passed, provide a direct return path to the Career Page.

## Common contextual-surface rule

Contextual and secondary routes should explicitly state their role in the product hierarchy.

The shared workspace notice may communicate:

- Career Path support for Study / Programs
- Secondary Action for Compare
- Country Context for Countries / Cities
- Path Context for Visa
- Provider Context for Institutions
- Career Discovery for Occupation explorer

This notice is deliberately compact. It is not a second navigation system.

## Wave 3 implementation

Wave 3 applies the contract without destructive deletion:

- adds a shared contextual-surface notice under workspace navigation
- reframes Programs around career outcomes and preserves career context while switching countries
- reframes Compare as a secondary decision tool
- rewrites Profile around saved careers and account settings; removes workspace/onboarding/Home CTAs
- aligns the account menu with saved-career retention
- reframes Countries metadata and shared route context around career evidence
- simplifies Visa explorer into a neutral Path-context surface and removes the independent purple product identity
- reframes Maps as regional career context with an optional Career Page return link
- keeps Jobs centered in the Career Page; existing SEO/discovery job routes remain without becoming a new global hub

## Deletion policy

Wave 3 still follows:

`Hide first → observe dependencies and usage → delete later`

Country dashboards, comparison adapters, visa catalogues, map data, program catalogues, saved-data schemas and SEO routes remain available unless a later audit proves they are safe to remove.

## Do not regress

Do not restore:

- Programs as an unrelated education marketplace
- Compare as a top-level suite of tools
- Account as a dashboard/workspace or onboarding gateway
- Countries as a destination-first product home
- Visa as a score dimension or independent attractiveness product
- Maps as a global exploration entry point
- Jobs as an unrelated global board detached from Career context

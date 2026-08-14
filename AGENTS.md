<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# CampCareer product rules

Before changing product navigation or user journeys, read:

- `docs/PRODUCT_SURFACE_INVENTORY.md`
- `docs/INITIAL_INFORMATION_ARCHITECTURE.md`
- `docs/CAMPCAREER_SCORE_CONTRACT.md`
- `docs/CAMPCAREER_BRAND_SYSTEM.md`

Current product hierarchy is authoritative:

`Career → CampCareer Score → Evidence → Path → Study / Programs → Jobs`

Rules:

- Career Page is the primary product surface.
- Value first. Account second.
- Save, Compare and Login are secondary.
- Countries, Cities, Visa, Maps and Institutions are contextual capabilities, not equal top-level products.
- `/home` dashboard, early onboarding and early personalisation are dormant/hidden unless an explicit later product decision restores them.
- Do not add a route to global navigation merely because the route exists.
- Prefer hiding legacy capability before deleting data, APIs or route implementations.

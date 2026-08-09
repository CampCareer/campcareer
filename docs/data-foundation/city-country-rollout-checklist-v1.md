# City country rollout checklist v1

Use this sequence when starting the next CampCareer Cities country after Australia and Canada. Re-check GitHub and Supabase first; never infer state from an older rollout.

## 0. Fresh state and scope

- confirm `main` and the active country branch have not diverged unexpectedly;
- inspect existing canonical geographies, campuses, institutions, programmes and offerings;
- choose the approved public city list before building UI;
- define whether each city means named municipality, metro area or another official geography;
- keep public Compare scope explicitly allowlisted.

## 1. Canonical city foundation

- reuse stable geography IDs when they already exist;
- normalize public slugs without replacing canonical IDs;
- store source aliases needed for matching;
- prohibit inference from neighbouring municipalities unless the product scope explicitly uses a metro geography.

## 2. Institution and programme linkage

- verify campus → institution integrity;
- verify programme → institution integrity;
- verify offering → campus → city traceability;
- count only canonical offerings on city-facing pages;
- do not mark legacy or staging programme records as officially verified without source evidence.

## 3. Five decision metrics

Publish equivalent city signals using source-native units and periods:

1. population;
2. student living-cost reference;
3. student transport reference;
4. international-student work rule;
5. employment / career-context sectors.

Every metric needs source name, source URL, data-as-of date, verification timestamp and confidence/provenance status.

## 4. City detail pages

- canonical route: `/cities/{country}/{city}`;
- show study, living, transport, work and career context;
- link canonical institutions to `/institutions/{country}/{institution}`;
- avoid dead programme-detail links before that country has a live programme surface;
- preserve clear source/freshness disclosure.

## 5. City Compare

Primary route shape:

`/compare?type=city&country={CC}&left={city-a}&right={city-b}`

- keep `/compare` as the single comparison runtime;
- legacy `/compare/{mode}` routes are redirects only;
- derive shared-programme counts from exact canonical programme IDs;
- return both compared cities to `/cities/{country}/{city}`;
- keep the public selector bounded to the approved city allowlist;
- keep Compare itself non-indexable.

## 6. SEO publication gate

For every approved city:

- unique title and description;
- canonical `/cities/{country}/{city}`;
- explicit `robots: { index: true, follow: true }`;
- exactly one sitemap entry;
- no Compare URLs in sitemap;
- no unapproved city accidentally published or indexed.

## 7. Final QA and release state

Run:

- `npm audit --omit=dev --audit-level=high`;
- `npm run typecheck`;
- `npm run lint`;
- `npm test`;
- `npm run build`.

Then record branch HEAD and `main...branch` ahead/behind state. Remove temporary branch-only QA workflows after success. Merge and deploy only when explicitly scheduled so multiple country rollouts can be accumulated without unnecessary Vercel deployments.

# CampCareer SEO, URL and Career Identifier Contract

## Purpose

CampCareer has one primary public decision surface: the Career Page. SEO routing, social sharing, metadata, sitemaps and internal links must point to that same product surface instead of maintaining a separate search-only occupation page.

The canonical Career URL is:

`/career/{country-slug}/{career-id}`

Example:

`/career/australia/electrician`

Attribution parameters may be appended when distributed externally:

`/career/australia/electrician?utm_source=tiktok`

The canonical link always excludes tracking and transient state parameters.

## Identity model

The durable internal identity remains:

`country_code + career_id`

Example:

`AU + electrician`

Rules:

- `country_code` is the data/storage key and uses CampCareer's launch-country code (`AU`, `CA`, `UK`, etc.).
- `country-slug` is the human-readable URL projection from the launch-country registry (`australia`, `canada`, `united-kingdom`, etc.).
- `career_id` is the stable canonical Career identifier (`registered-nurse`, `electrician`, `software-developer`, etc.).
- Career labels, translated labels and aliases are display/search vocabulary only. They are never database or URL identity.
- Do not create a second Career identifier for SEO.
- Do not derive Career identity from an external occupation code. Official codes remain source mappings attached to the canonical Career.

## Canonicalization

The canonical product page is the only indexable Career detail route.

Legacy URLs permanently redirect to it:

- `/career?country=AU&occupation=electrician` → `/career/australia/electrician`
- `/occupation/au/electrician` → `/career/australia/electrician`

Locale-prefixed routes preserve their locale:

- `/ko/career?country=AU&occupation=electrician` → `/ko/career/australia/electrician`

Query parameters that are not part of identity, such as `utm_source`, may survive a redirect for measurement. They are never included in `rel=canonical`.

## Indexing gate

A valid Career route and an indexable Career route are not the same thing.

A Career Page may render when:

1. the country exists in the launch-country registry,
2. the Career exists in the canonical Career catalogue, and
3. a public Career insight exists.

A Career Page may be indexed only when:

1. it is in the explicit Career SEO publication inventory, and
2. a public CampCareer Score is ready.

Missing evidence must not become a thin indexable page. The product may still show `Score not ready yet`, but metadata must remain `noindex` until the publication gate is satisfied.

## Server rendering

The canonical Career route is server-rendered.

The initial HTML should contain the primary user value:

`Career → Country → CampCareer Score → Verdict → Demand / Pay / Entry → Evidence → Path → Study / Programs → Jobs`

Interactive account actions such as Save may hydrate on the client, but the Career judgment and evidence must not depend on a browser-only fetch to appear.

The server and API must use the same public Career read model so legacy/internal score totals cannot diverge between rendered HTML and hydrated UI.

## Metadata

Each canonical Career Page owns dynamic metadata derived from the same route identity and public Career insight:

- title
- description
- canonical URL
- language alternates
- robots/indexing state
- Open Graph metadata
- Twitter metadata

Metadata must describe the Career judgment without guaranteeing personal outcomes.

## Structured data

Career Pages emit JSON-LD that describes only visible, supported content:

- `WebPage`
- `Occupation`
- `BreadcrumbList`

Do not represent CampCareer Score as a user rating, employer rating or job-posting rating. Do not invent salary, location or eligibility properties solely to make structured data richer.

## Sitemap

The sitemap must use the explicit Career SEO publication inventory and the canonical Career URL resolver.

Changing the canonical route resolver must automatically change sitemap Career URLs. Do not maintain a separate handwritten list of `/occupation/...` or query-style Career URLs.

## Social distribution

External social links should point directly to the canonical Career Page. Tracking parameters are allowed:

`/career/australia/electrician?utm_source=tiktok&utm_medium=social`

The receiving page must show the same Career, country, Score, verdict and dimensions promised by the social content.

## Migration rule

Prefer redirects and compatibility aliases over changing stored Career data.

This migration changes the public URL projection, not the core Career data model. Existing saved careers, Score evidence, official mappings, programs, jobs and account data continue to join on `country_code + career_id`.

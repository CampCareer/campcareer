# CampCareer Blog Search Console Relaunch Runbook

## Purpose

This runbook begins after the SEO/GEO relaunch branch is deployed to the production `campcareer.com` domain. The objective is to restore crawl/index discovery for the audited Blog without losing historical URL evidence, then measure whether organic readers move into the canonical Career product.

## Preconditions

Do not submit the Blog sitemap until production verification confirms:

- `/blog` returns `200` and renders the Career Guides hub.
- A sampled KEEP article returns `200` with a self-referencing canonical.
- A sampled REWRITE article returns `200` with its existing canonical URL preserved.
- `/blog/sitemap.xml` returns `200` and contains only the promoted Blog inventory.
- The four audit holdouts are not listed in the Blog sitemap.
- `/robots.txt` advertises `/blog/sitemap.xml`.
- Article, Breadcrumb and applicable FAQ JSON-LD validate against the visible content.
- Retired in-product Blog links do not send users into a broad homepage redirect.

## Search Console submission

1. Open the `campcareer.com` property in Google Search Console.
2. In `Sitemaps`, submit `blog/sitemap.xml`.
3. Confirm the sitemap is fetched successfully and record the discovered URL count.
4. Use URL Inspection for these initial samples:
   - `/blog/electrician-salary-australia-2026`
   - `/blog/engineering-graduate-salary-comparison-2026`
   - `/blog/study-nursing-australia-international-students-2026`
   - `/blog/study-in-australia-2026`
5. Request indexing for the new Electrician salary article after the live inspection confirms the canonical and rendered content.
6. Do not request removal for any 301/410 candidate until the historical evidence gate is complete.

## Historical evidence export

Before activating any destructive migration, export at least the last 16 months of Search Console data:

### Pages export

For every `/blog/` landing URL capture:

- clicks
- impressions
- CTR
- average position

### Queries export

For each candidate URL capture:

- top queries
- clicks
- impressions
- average position

### Indexing evidence

Capture where available:

- indexed/not indexed state
- last crawl
- Google-selected canonical
- crawl/index reason

Join this to referring-domain/backlink evidence before deciding 301 or 410.

## Destructive migration gate

### `best-country-to-study-indian-students-2026`

Current state: 301 candidate.

Only redirect if query and backlink evidence show that the replacement by-field Indian guide substantially satisfies the same user intent and is the stronger canonical asset.

### 410 candidates

- `ielts-score-requirements-2026`
- `ireland-language-school-guide-2026`
- `study-abroad-checklist-korean-students-2026`

Return `410 Gone` only when historical search and backlink evidence shows no material acquisition value and no exact replacement exists.

Never replace these decisions with a broad permanent redirect to `/`.

## Weekly measurement

Track the following for the Blog acquisition surface:

| Metric | Why it matters |
| --- | --- |
| Indexed promoted Blog URLs | Crawl/index health |
| Blog impressions | Search discovery |
| Blog clicks | Organic acquisition |
| CTR by query | Snippet/search-intent fit |
| Average position by query | Ranking trajectory |
| New vs returning organic sessions | Acquisition quality |
| Blog → Career Page click-through | Product handoff |
| Career Page Save after Blog entry | Retention intent |
| Career Page Compare after Blog entry | Decision intent |
| Programs/Jobs continuation after Blog entry | Core-loop continuation |

## 7-day review

After seven complete days of production data:

- identify pages receiving impressions but weak CTR
- identify queries where a Blog post is cannibalising its Career Page
- identify discovered/crawled but not indexed URLs
- inspect whether Google selected a different canonical
- fix technical/indexing faults before increasing publishing volume

Do not interpret seven days as enough data for a strategic content verdict. It is an early technical and intent check.

## 28-day review

After 28 complete days:

- re-rank the editorial roadmap using actual CampCareer query impressions and positions
- expand articles already earning impressions before creating near-duplicate URLs
- create new URLs only for clearly distinct user intent
- compare organic Blog entrants with direct Career entrants on downstream Career Page actions
- decide whether any holdout URL is ready for 301 or 410 review

## GEO monitoring

Where referral analytics are available, segment inbound visits from answer/search engines separately from Google organic. Track the landing article and the next CampCareer page rather than treating AI referral traffic as an isolated vanity metric.

For answer-engine readiness, periodically verify that published pages remain crawlable, contain a direct answer near the top, show primary-source evidence and expose stable canonical URLs.

## Ownership

The Blog is successful only when it acquires a real decision question and hands the reader into the core product. Traffic without a credible path into Career → Score → Evidence → Path → Study / Programs → Jobs is not a sufficient publishing reason.

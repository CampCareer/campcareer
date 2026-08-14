# CampCareer Blog SEO/GEO Audit — 2026-08-14

## Decision

`/blog` should return as a public acquisition surface, but it is not a second product. Its job is to answer high-intent career, study-to-work, cost, salary and work-rights questions and then move the reader into the canonical CampCareer product loop:

`Career → CampCareer Score → Evidence → Path → Study / Programs → Jobs`

The canonical product destination remains `/career/{country-slug}/{career-id}`.

## Current technical state

- 50 MDX posts exist under `content/blog/`.
- `/blog` and every `/blog/{slug}` are currently swallowed by the temporary `/blog/:path* → /` redirect in `next.config.mjs`.
- Blog pages already have canonical metadata, Article JSON-LD, Breadcrumb JSON-LD, FAQ JSON-LD, author/review metadata and related-post internal links.
- Search engines still retain and surface a number of existing CampCareer blog URLs, so the redirect is suppressing a real indexed asset rather than protecting an empty section.
- The main sitemap does not currently publish the blog inventory.
- Historical GSC coverage evidence exists, but URL-level clicks, impressions, queries, CTR and average position are still required before activating destructive 301/410 decisions.

## Audit policy

### KEEP

Publish now. The search intent already overlaps strongly with CampCareer’s career, earnings, cost, work-rights or study-to-profession decision model. Refresh CTA routing and factual freshness before major promotion.

### REWRITE

Keep the current URL alive so historical search equity is not discarded, but rewrite the page around career outcomes and the new product hierarchy. The old URL may remain if the primary search intent is still valid.

### 301 CANDIDATE

Likely intent duplication. Do not redirect until URL-level GSC and backlink evidence confirms which URL has the stronger history and whether the replacement fully satisfies the old query intent.

### 410 CANDIDATE

Low alignment with the new product and weak strategic conversion value. Do not return 410 until URL-level GSC and backlink evidence is reviewed. Until then, preserve the page rather than converting a potentially useful indexed URL into an irreversible loss.

## Inventory summary

| Disposition | Count | Action now |
| --- | ---: | --- |
| Keep | 14 | Publish, refresh CTA/internal links, include in blog sitemap |
| Rewrite | 32 | Publish, preserve URL, rewrite in priority order, include in blog sitemap |
| 301 candidate | 1 | Keep live for now, exclude from relaunch sitemap until evidence review |
| 410 candidate | 3 | Keep live for now, exclude from relaunch sitemap until evidence review |
| Total | 50 | |

## Full audit

| Slug | Disposition | Rationale |
| --- | --- | --- |
| australia-485-graduate-visa-guide-2026 | KEEP | Graduate work rights are directly relevant to the study-to-work path. |
| australia-graduate-salary-2026 | KEEP | Earnings evidence is central to Career decisions and comparison. |
| australia-student-visa-500-guide-2026 | REWRITE | Useful acquisition intent, but currently visa-first rather than career-first. |
| australia-vs-canada-international-students-2026 | REWRITE | Strong destination comparison intent; verdict should be career-specific rather than generic. |
| australia-vs-uk-singaporean-students-2026 | REWRITE | Useful audience-specific comparison; needs Career and Score-led decision structure. |
| australia-vs-uk-vs-canada-2026 | REWRITE | High-value comparison but currently study-destination first. |
| best-country-study-abroad-indian-students-by-field-2026 | KEEP | Field-by-field structure already maps naturally to career outcomes. |
| best-country-study-abroad-singaporean-students-2026 | REWRITE | Preserve audience demand but move from generic destination ranking to career evidence. |
| best-country-study-chinese-students-2026 | REWRITE | Same rationale; nationality segmentation is acquisition context, not the product. |
| best-country-study-korean-students-2026 | REWRITE | Same rationale; career outcome must become the decision axis. |
| best-country-study-vietnamese-students-2026 | REWRITE | Same rationale; retain intent while removing generic study-abroad positioning. |
| best-country-to-study-indian-students-2026 | 301 CANDIDATE | Likely cannibalisation with the stronger by-field Indian destination guide. |
| best-courses-study-australia-international-students-2026 | KEEP | Already framed as a career guide and links course choice to work outcomes. |
| canada-graduate-salary-2026 | KEEP | Earnings evidence is directly aligned with Career evaluation. |
| canada-international-student-pr-pathway-2026 | REWRITE | Migration-heavy framing should become work/career pathway framing with visa context secondary. |
| canada-pgwp-guide-2026 | KEEP | Graduate work rights are a legitimate path-stage decision input. |
| canada-vs-usa-international-students-2026 | REWRITE | Valuable comparison intent; needs career-specific verdicts and evidence. |
| cheapest-country-study-abroad-international-students-2026 | REWRITE | Cost intent is valuable, but cheapest-country ranking alone is not CampCareer’s decision model. |
| cheapest-universities-australia-2026 | REWRITE | Reframe price around career/program outcome and total path cost. |
| cheapest-universities-uk-2026 | REWRITE | Same rationale as Australia university-cost content. |
| cost-of-studying-australia-2026 | KEEP | Total path cost is a high-value decision input and existing search asset. |
| cost-of-studying-canada-2026 | KEEP | Same rationale. |
| cost-of-studying-uk-2026 | KEEP | Same rationale. |
| cost-of-studying-usa-2026 | KEEP | Same rationale. |
| engineering-graduate-salary-comparison-2026 | KEEP | Strong career-first comparative intent and direct monetisable discovery path. |
| how-to-get-pr-australia-international-student-2026 | REWRITE | Avoid migration-outcome promise framing; lead with occupation, evidence and work path. |
| ielts-score-requirements-2026 | 410 CANDIDATE | Broad admissions utility with weak connection to the Career product loop. |
| indian-students-us-h1b-vs-canada-pr-vs-australia-pr-2026 | REWRITE | High intent but immigration-first; convert to career/work-rights comparison. |
| ireland-language-school-guide-2026 | 410 CANDIDATE | Language-school selection is outside the core Career/Programs/Jobs loop. |
| monash-university-international-student-guide-2026 | REWRITE | Institution content can support Programs, but must be organised around career outcomes. |
| nursing-salary-study-abroad-comparison-2026 | KEEP | Career-first salary and country comparison. |
| scholarships-international-students-australia-2026 | REWRITE | Funding remains useful but must support a career/program decision rather than stand alone. |
| scholarships-international-students-uk-2026 | REWRITE | Same rationale. |
| singapore-overseas-degree-worth-it-2026 | KEEP | ROI and career outcome question strongly matches CampCareer positioning. |
| study-abroad-checklist-korean-students-2026 | 410 CANDIDATE | Operational study-abroad checklist is peripheral and weakly differentiated. |
| study-in-australia-2026 | REWRITE | Broad destination guide needs a Career-first entry point and updated claims. |
| study-in-canada-2026 | REWRITE | Same rationale. |
| study-in-ireland-2026 | REWRITE | Same rationale. |
| study-in-uk-2026 | REWRITE | Same rationale. |
| study-in-usa-2026 | REWRITE | Same rationale. |
| study-nursing-australia-international-students-2026 | KEEP | Clear study-to-profession route with regulator and labour evidence. |
| ucl-international-student-guide-2026 | REWRITE | Institution content should feed Programs and career outcomes. |
| uk-student-visa-guide-2026 | REWRITE | Useful context but should not be a primary CampCareer promise. |
| uk-vs-australia-international-students-2026 | REWRITE | Strong comparison query; needs Career-specific verdict architecture. |
| uk-vs-ireland-international-students-2026 | REWRITE | Same rationale. |
| university-of-melbourne-guide-2026 | REWRITE | Institution guide should become program/career outcome support. |
| university-of-sydney-guide-2026 | REWRITE | Same rationale. |
| university-of-toronto-guide-2026 | REWRITE | Same rationale. |
| unsw-sydney-guide-2026 | REWRITE | Same rationale. |
| usa-f1-student-visa-guide-2026 | REWRITE | Preserve high-intent work-rights/OPT discovery but make career path primary. |

## Rewrite priority

### P0: highest strategic value

1. `study-in-australia-2026`
2. `australia-vs-canada-international-students-2026`
3. `uk-vs-australia-international-students-2026`
4. `how-to-get-pr-australia-international-student-2026`
5. `canada-international-student-pr-pathway-2026`
6. `australia-student-visa-500-guide-2026`
7. `usa-f1-student-visa-guide-2026`
8. `monash-university-international-student-guide-2026`
9. `university-of-melbourne-guide-2026`
10. `unsw-sydney-guide-2026`

These already sit close to work outcomes or cover large study/country intents that can be converted into Career discovery.

### P1

Remaining country comparison, destination, cost-ranking, scholarship and institution pages.

### P2

Nationality-specific generic destination pages after we have query-level GSC data proving which variants deserve continued dedicated URLs.

## Mandatory rewrite template

Every rewritten or new acquisition article should follow this hierarchy where the intent permits it:

1. Direct answer in the first 80–120 words.
2. Career or decision verdict.
3. Evidence table using official or primary sources.
4. Demand, Pay and Entry where a Career is the subject.
5. Registration/licensing or practical path requirements.
6. Study/Programs only after the target Career is clear.
7. Jobs or labour-market evidence.
8. Visa/work rights as contextual constraints, not a promise of eligibility or permanent residence.
9. Clear `Last reviewed` date and source list.
10. Internal CTA to a canonical Career Page when a reviewed Career is available; otherwise to the narrowest valid Programs/Compare surface.

## SEO/GEO requirements

- One primary search intent per URL.
- Canonical URL is self-referencing for every live blog page.
- Answer the core query early and in plain language suitable for citation by search and answer engines.
- Prefer primary sources for salary, labour demand, registration, course eligibility and immigration/work-rights claims.
- Use compact factual tables and FAQ sections only where they answer real sub-queries.
- Do not manufacture statistics, rankings, reviews or user ratings for schema enrichment.
- Keep Article, Breadcrumb and valid FAQ structured data aligned with visible content.
- Preserve authorship, editorial review and last-reviewed timestamps.
- Every article must have a meaningful internal path into the current CampCareer product.

## Eight-step relaunch sequence

1. Define Blog as a public SEO/GEO acquisition surface under the Career product contract.
2. Remove the blanket `/blog/:path* → /` redirect so existing indexed documents can return their real content.
3. Use this audit as the canonical `KEEP / REWRITE / 301 CANDIDATE / 410 CANDIDATE` inventory.
4. Publish only KEEP + REWRITE inventory in a dedicated blog sitemap; hold destructive candidates out pending GSC review.
5. Route old blog CTAs away from retired product surfaces and toward canonical Career pages when the post has enough career/country context.
6. Produce new content from verified keyword demand, starting with Career questions that directly connect to Ready Career pages.
7. After deployment, submit the blog sitemap in GSC and track URL/query performance, index state, CTR, average position and conversion into Career pages.
8. Operate the editorial strategy as “the most reliable answer to whether a career is worth pursuing and how to reach it”, not as a generic study-abroad publication.

## GSC evidence gate before destructive migration

Before activating any 301 or 410 from this audit, export at least the last 16 months for:

- Pages: clicks, impressions, CTR, average position
- Queries by URL
- Indexing state / last crawl where available
- External links / referring domains from the backlink source in use

For a 301, the replacement must satisfy the old intent substantially and specifically. A broad redirect to `/` is not an acceptable permanent replacement.

# SEO baseline — 2026-07-29

Source: local Search Console Coverage export at `/Users/yehunlee/Downloads/campcareer.com-Coverage-2026-07-29/`.

## Snapshot

| Date | Not indexed | Indexed | Impressions |
| --- | ---: | ---: | ---: |
| 2026-07-24 | 20,575 | 1,164 | 9 |

The supplied export contains Coverage aggregates and issue summaries, not URL-level Search performance, referring-domain/backlink, query, click, or impression exports. Those exports are required before a URL-specific redirect map can be activated.

## Coverage issues in supplied export

| Issue | URLs |
| --- | ---: |
| Alternate page with proper canonical tag | 1,657 |
| Page with redirect | 80 |
| Duplicate without user-selected canonical | 74 |
| Not found (404) | 40 |
| Crawled — currently not indexed | 2,430 |
| Excluded by `noindex` tag | 2 |
| Soft 404 | 1 |
| Blocked due to other 4xx issue | 12,792 |
| Discovered — currently not indexed | 3,499 |

## Baseline procedure before redirect activation

1. Export Search Console **Pages** and **Queries** for the last 16 months: clicks, impressions, CTR, and position by URL.
2. Export referring pages/domains from the backlink provider in use and join them to the URL list.
3. Add each URL to the transition map with one disposition: `keep`, exact-meaning `301`, or `410`.
4. Only after review, remove the current temporary root redirects for the affected URL classes and deploy the exact map.
5. Verify samples with HTTP status checks, then submit the reduced sitemap.

The aggregate snapshot above is preserved so the route-result exposure and useful outbound-click funnel can be evaluated against the previous index footprint.

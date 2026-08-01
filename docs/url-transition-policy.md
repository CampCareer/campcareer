# URL transition policy — CampCareer v1

## Keep indexed

- `/home`
- `/maps`
- public `/routes/**` and `/ko/routes/**`
- `/methodology`, `/privacy`, `/terms`

## 301 only for an exact replacement

An old URL may return a permanent redirect only if its previous intent is fully answered by one specific published route result. The mapping record must contain both URLs and the reason they are equivalent. No broad redirect to the root search page is allowed.

## 410 after URL-level review

Planner, onboarding, dashboard, comparison, ranking, degree-risk, ROI, university, major, country-profile, saved-item, and partner-support URLs have no v1 replacement. Once the Search Console and backlink export described in the baseline document has been attached, these should return `410 Gone`, not a root redirect.

The current broad temporary redirects stay unchanged until that URL-level map exists; changing them now would discard the required evidence and risks creating additional soft 404s.

## Retired locale Home aliases

- The former Home/search roots (`/`, `/en`, `/ko`, `/zh-hans`, `/vi`, `/hi`, `/es-419`) permanently redirect to `/home`.
- Their former top-level Workspace aliases (`/home`, `/maps`, `/compare`, `/visas` under one of those prefixes) permanently redirect to the same bare canonical pathname.
- Query parameters are preserved by the central 308 redirect. Reviewed Korean content URLs such as `/ko/fr`, `/ko/fields/**`, and `/ko/maps/**/**` are not included in this policy.

## Sitemap and robots

- The canonical sitemap is `/sitemap.xml` and contains only v1 product, route, and legal URLs.
- Legacy segmented sitemap URLs and `/sitemap-index.xml` return `410` with `X-Robots-Tag: noindex`.
- The legacy sitemap namespace is disallowed in `robots.txt`.

## Release validation

For every mapped sample, assert exactly one of: intended `200`, exact `301`, or intended `410`. Check both locale variants and ensure neither the response body nor the sitemap introduces an unrelated replacement.

# United States city publication v1

## Scope

This publication batch exposes only the eight approved Tier A named-city study destinations:

- `new-york`
- `boston`
- `los-angeles`
- `chicago`
- `seattle`
- `san-diego`
- `philadelphia`
- `tempe`

No Tier B city is included in City pages, City Compare or the sitemap.

## Phase 3 linkage contract

Production migration `20260808184326_publish_us_tier_a_city_linkage_v1.sql` publishes canonical city, campus and institution linkage. Membership is accepted only from `catalog.campuses.geography_id`.

The eight cities currently contain 308 active campus-city links representing 306 distinct canonical institutions. Every published institution link has a canonical institution slug and `US_UNIT_ID`.

Programme membership may only come from `catalog.programme_offerings.campus_id`. The canonical U.S. programme catalogue currently contains no programme or offering rows. The product therefore presents a programme catalogue coverage gap and must not translate that data gap into a claim that a city has zero programmes.

## Phase 4 metric contract

Production migration `20260808185727_publish_us_tier_a_city_metrics_v1.sql` publishes exactly five verified decision metrics for each Tier A city:

1. `city_population`
2. `student_living_cost_monthly_range`
3. `student_transport_reference`
4. `student_work_hours_week`
5. `employment_focus_sectors`

The production database contains exactly 40 verified metric rows for the eight cities.

Transport values retain their source-native period. A rolling 7-day fare cap, a semester student pass and a monthly pass are not normalized into a false like-for-like monthly product.

The F-1 work reference is also qualified: the 20-hour academic-session limit is the general on-campus rule. Off-campus employment requires separate authorization and is not presented as an unconditional 20-hour entitlement.

## Phase 5 City and Compare publication

Branch `agent/us-cities-city-compare-v1` publishes the U.S. city experience through the existing canonical architecture rather than creating a parallel surface.

City profiles use `/cities/us/{slug}`. A single allowlisted dynamic route serves the eight Tier A slugs and returns not-found behavior for any unapproved slug. Metadata is indexable only for an allowlisted city. The sitemap derives its U.S. entries from the same `PUBLISHED_US_CITY_SLUGS` contract.

The root `/compare` surface accepts `type=city&country=US`. U.S. Compare readiness requires all five verified metrics plus positive canonical campus and institution linkage. It deliberately does not require a positive programme count while the canonical U.S. programme catalogue is unavailable.

City profiles link to root Compare, and Compare links back to both selected City profiles. This preserves the existing AU/CA architecture and the single root Compare contract.

## Geography guard

All eight destinations remain named-city products. Publication does not authorize metro inference.

Examples:

- New York does not silently absorb separately represented borough or neighbouring-city campus rows.
- Boston does not automatically absorb Cambridge.
- Chicago does not automatically absorb Evanston.
- Tempe remains Tempe and is not relabelled Phoenix.
- Los Angeles and San Diego require explicit canonical campus geography membership.

A future metro-study-market product must use an explicit separate scope model rather than changing named-city membership implicitly.

## Publication gate

The U.S. city batch is publication-ready when all of the following remain true:

- exactly eight allowlisted public slugs;
- exactly five verified metrics per city;
- positive canonical campus and institution linkage per city;
- no programme-delivery inference from institution presence;
- City to Compare and Compare to City links use canonical routes;
- sitemap contains the eight approved U.S. city routes and no Tier B city routes.

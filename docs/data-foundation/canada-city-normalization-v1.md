# Canada city normalization v1

## Purpose

Canada Cities reuse the canonical `core.geographies` city rows and the shared `catalog.campuses` / `catalog.programmes` graph. The user-facing city product is a study-destination decision surface, but programme delivery claims must remain tied to explicit city or campus evidence.

## Scope rule

Canada v1 uses **named-city study markets**. A programme or institution location in a neighbouring municipality is not automatically attributed to a larger metro label.

For Toronto v1 this means:

- Toronto is published as `/cities/ca/toronto`.
- Toronto programme/campus counts use canonical records explicitly linked to Toronto.
- Mississauga, Brampton, Oakville, Markham and other GTA municipalities are not inferred into Toronto programme delivery.
- A Toronto CMA or GTA-wide statistic must not be mixed with City of Toronto programme scope unless the UI explicitly labels the different geography and the comparison is methodologically justified.

This rule is intentionally conservative. It prevents institution-wide DLI records or broad marketing labels from becoming false campus-level programme claims.

## Canonical geography normalization

Migration `20260808100208_normalize_canada_city_slugs_v1.sql`:

- preserves the existing Canada city UUIDs;
- creates stable user-facing slugs from the existing city codes;
- sets `scope_kind='city'` where missing;
- records the named-city scope in geography metadata;
- stores canonical/source aliases for future matching.

No new Toronto UUID is created.

## Toronto MVP

Migration `20260808100251_publish_toronto_city_mvp_v1.sql` creates:

- `public.city_directory_ca_v1`
- `public.city_institution_directory_ca_v1`
- Toronto city metric evidence in the shared `public.report_metric_evidence_city` layer.

The current Toronto canonical graph contains:

- 3 canonical locations
- 3 canonical institutions
- 26 canonical linked programmes

The richer official Canada programme catalogue is being normalized in a separate programme-data workflow. Those staging rows are not added to the city-facing linked-program count until they become canonical offerings.

## Toronto metric semantics

Toronto metrics keep the source-native period and geography:

- population: City of Toronto, not Toronto CMA;
- living cost: CAD/month, calculated from an official university annual planning range;
- transport: TTC post-secondary monthly pass, CAD/month;
- work rule: IRCC 24 hours/week during regular academic sessions for eligible students;
- employment sectors: qualitative City of Toronto economic context, not a shortage ranking.

Do not convert transport or work metrics into Australian weekly/fortnight formats merely to make the UI look uniform.

## Expansion rule

For each subsequent Canada city:

1. keep or create one stable canonical city geography;
2. verify explicit campus/city membership;
3. publish the city only after population, living cost, transport, work-rule and employment-context evidence is available;
4. link only canonical programmes to the user-facing programme count;
5. add the route and Canada dashboard link only when the city page is publishable;
6. add Canada City Compare only after at least two cities satisfy the same comparison-readiness contract.

# Canada city normalization v1

## Purpose

Canada Cities reuse the canonical `core.geographies` city rows and the shared `catalog.campuses` / `catalog.programmes` graph. The user-facing city product is a study-destination decision surface, but programme delivery claims must remain tied to explicit city or campus evidence.

## Scope rule

Canada v1 uses **named-city study markets**. A programme or institution location in a neighbouring municipality is not automatically attributed to a larger metro label.

For Toronto this means:

- Toronto is published as `/cities/ca/toronto`.
- Toronto programme/campus counts use canonical records explicitly linked to Toronto.
- Mississauga, Brampton, Oakville, Markham and other GTA municipalities are not inferred into Toronto programme delivery.
- A Toronto CMA or GTA-wide statistic must not be mixed with City of Toronto programme scope unless the UI explicitly labels the different geography and the comparison is methodologically justified.

The same named-city rule applies to Vancouver, Montreal, Ottawa and Calgary. This prevents institution-wide DLI records or broad marketing labels from becoming false campus-level programme claims.

## Canonical geography normalization

Migration `20260808100208_normalize_canada_city_slugs_v1.sql`:

- preserves the existing Canada city UUIDs;
- creates stable user-facing slugs from the existing city codes;
- sets `scope_kind='city'` where missing;
- records the named-city scope in geography metadata;
- stores canonical/source aliases for future matching.

No replacement UUIDs are created for the five launch cities.

## Read models

Migration `20260808100251_publish_toronto_city_mvp_v1.sql` creates:

- `public.city_directory_ca_v1`
- `public.city_institution_directory_ca_v1`
- Toronto city metric evidence in the shared `public.report_metric_evidence_city` layer.

Migration `20260808102538_publish_canada_city_programme_directory_v1.sql` creates:

- `public.city_programme_directory_ca_v1`

The programme directory is a thin read index over canonical `catalog.programme_offerings` and campus geographies. It is used for city programme counts and exact shared-programme intersections in City Compare.

## Five launch cities

Current comparison-ready canonical coverage:

| City | Canonical locations | Canonical institutions | Canonical linked programmes |
| --- | ---: | ---: | ---: |
| Toronto | 3 | 3 | 26 |
| Montreal | 4 | 4 | 23 |
| Ottawa | 2 | 2 | 16 |
| Vancouver | 1 | 1 | 13 |
| Calgary | 1 | 1 | 9 |

The richer official Canada programme catalogue is being normalized in a separate programme-data workflow. Staging rows are not added to city-facing linked-program counts until they become canonical offerings.

## Metric publication

The five launch cities each require the same five verified metric families:

1. `city_population`
2. `student_living_cost_monthly_range`
3. `student_transport_reference`
4. `student_work_hours_week`
5. `employment_focus_sectors`

Production migrations:

- `20260808100251_publish_toronto_city_mvp_v1.sql`
- `20260808101741_publish_canada_city_metrics_batch_v1.sql` — Vancouver, Montreal, Ottawa and generic Canada transport contract
- `20260808102328_publish_calgary_city_metrics_v1.sql`

Metric periods remain source-native:

- work rule: IRCC 24 hours/week during regular academic sessions for eligible students;
- Toronto transport: TTC post-secondary monthly pass;
- Vancouver transport: U-Pass BC monthly fee;
- Montreal transport: STM student monthly All Modes A fare;
- Ottawa transport: U-Pass term fee;
- Calgary transport: Calgary Transit Fall 2026 U-Pass term fee.

Do not convert transport or work metrics into Australian weekly/fortnight formats merely to make the UI look uniform.

Population uses named-city/census-subdivision geography rather than CMA population. Living-cost sources and scenarios differ by city and remain labelled as observed/calculated evidence in the read model.

## Canada City Compare

`/compare?type=city&country=CA` uses the same first-class Cities mode as Australia but a Canada-specific comparison adapter.

A Canada city enters the selector automatically only when:

- all five required metric families are verified;
- canonical campus count is greater than zero;
- canonical institution count is greater than zero;
- canonical linked programme count is greater than zero.

The current automatic selector therefore contains Toronto, Montreal, Ottawa, Vancouver and Calgary. New Canada cities can enter without adding their names to Compare code once they satisfy the same data contract.

Shared programme count is calculated from canonical city-programme links only. It does not use DLI location strings or staging programme rows.

## Expansion rule

For each subsequent Canada city:

1. keep or create one stable canonical city geography;
2. verify explicit campus/city membership;
3. publish the city only after population, living cost, transport, work-rule and employment-context evidence is available;
4. link only canonical programmes to the user-facing programme count;
5. add the route and Canada dashboard link only when the city page is publishable;
6. let Compare register the city automatically through the readiness contract rather than hardcoding city names.

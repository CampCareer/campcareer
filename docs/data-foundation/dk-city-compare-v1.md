# Denmark city compare v1

Status: `PHASE_6_COMPLETE`

Checkpoint: `COMPARE_COMPLETE`

Branch: `agent/dk-cities-v1`

Audit date: 2026-08-10

## Scope

Phase 6 connects the five Denmark Tier A municipality profiles to the shared City Compare surface:

`/compare?type=city&country=DK`

The compare-ready set remains exactly:

- Copenhagen
- Frederiksberg
- Odense
- Aarhus
- Aalborg

Default pair: Copenhagen vs Aarhus.

## Readiness gate

A Denmark city is compare-ready when it has:

- all five verified core city metrics;
- at least one verified Phase 3 university location;
- at least one linked canonical institution.

All five cities pass this gate in production.

Programme count is not used as the readiness gate. Denmark already has meaningful verified-partial programme coverage, so the count is displayed as additional decision evidence while incomplete professional-provider coverage remains explicit.

## Comparison semantics

Population uses the same Statistics Denmark municipality boundary family for all five cities.

The current student living value is the Study in Denmark national monthly budget baseline. Compare therefore does not rank cities by this shared national value or pretend identical values prove equal local costs.

Transport references remain source-native products and periods. No synthetic monthly student fare is created.

Student permit work remains the national SIRI context: up to 90 hours per month September through May and full-time work in June, July and August for the relevant permit context. The monthly cap is not converted into a weekly entitlement or presented as a city differentiator.

Employment sectors remain official municipality economic context, not shortage rankings or employment guarantees.

## Programme coverage

Compare displays verified-partial programme counts from `city_programme_directory_dk_v1`.

Only Study in Denmark programme rows whose source city matches a verified official university location are counted. Missing professional higher-education providers and unverified delivery locations remain explicit coverage gaps.

## Navigation and indexing

Profiles link to City Compare once the five-metric/location/institution readiness gate is satisfied. Compare links back to both city profiles.

The shared `/compare` page remains `noindex, nofollow`.

No database migration is introduced by Phase 6.

Next: Phase 7 publication and SEO on the same country branch.

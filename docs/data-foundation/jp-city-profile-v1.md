# Japan city profile v1

Status: `PHASE_5_COMPLETE`

Checkpoint: `PROFILE_COMPLETE`

Branch: `agent/jp-cities-v1`

## Functional route cohort

Phase 5 supports exactly:

- `/cities/jp/tokyo`
- `/cities/jp/kyoto`
- `/cities/jp/nagoya`
- `/cities/jp/sendai`
- `/cities/jp/suita`
- `/cities/jp/tsukuba`
- `/cities/jp/fukuoka`

The route source of truth is `SUPPORTED_JP_CITY_SLUGS`.

Phase 5 deliberately does **not** create `PUBLISHED_JP_CITY_SLUGS`.

## Publication boundary

Supported profiles:

- canonical URL is generated;
- `robots: { index: false, follow: true }`;
- no sitemap entry;
- no Japan City Compare integration.

Unsupported slugs:

- `robots: { index: false, follow: false }`;
- `notFound()`.

SEO publication remains a later phase.

## Data boundary

The server loader reads only:

- `city_directory_jp_v1`
- `city_institution_directory_jp_v1`
- `city_programme_directory_jp_v1`
- `city_metric_directory_jp_v1`

It does not infer profile claims directly from raw campuses, canonical offerings or staging tables.

## Display safeguards

- Tokyo is labelled using the Tokyo 23-special-wards scope.
- JASSO living cost is labelled as a national planning baseline and not a cheapest-city ranking.
- transport remains source-native and is not normalized into a synthetic monthly score.
- national student-work rules remain permission-gated context.
- zero linked programmes are displayed as verification pending, not as no programmes.
- local economic sectors are context only, not a shortage ranking or job guarantee.

## Result

`PROFILE_COMPLETE`

No main merge, sitemap promotion, index publication, Compare release or Vercel production deployment is part of Phase 5.

Next: Phase 6 City Compare when requested.

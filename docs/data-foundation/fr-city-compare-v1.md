# France city compare v1

Status: `PHASE_6_COMPLETE`

Branch: `agent/fr-cities-v1`

Audit date: 2026-08-11

Checkpoint: `COMPARE_COMPLETE`

## Surface

France City Compare uses the shared query contract:

`/compare?type=city&country=FR&left={slug}&right={slug}`

Default pair:

`Paris vs Paris-Saclay`

The selector is restricted to the seven approved Tier A destinations:

- Paris
- Paris-Saclay
- Bordeaux
- Strasbourg
- Grenoble
- Aix-Marseille
- Nice

## Readiness gate

A France destination is compare-ready only when it has:

- an approved Tier A route slug;
- at least one verified linked institution;
- at least one verified teaching location;
- verified `city_population`;
- verified `student_living_cost_monthly_range`;
- verified `student_transport_reference`;
- verified `student_work_hours_year`;
- verified `employment_focus_sectors`.

Current production state satisfies this gate for all seven destinations.

## Geography guard

France comparison does not pretend every row is the same geography type.

Paris population uses the Paris commune contract while the other metropolitan study destinations use their approved EPCI/metropolitan contracts. The comparison matrix therefore keeps the public geography label next to every population value and labels population as contextual rather than a perfectly equivalent city-size ranking.

Physical teaching localities remain separate from public population geography.

## Metric guard

Living-cost references remain source-native and methodology-aware.

Transport products retain their published fare period and eligibility model. No synthetic monthly transport amount is produced.

The France student-work row uses the national `964 hours / year` rule unchanged. It is not converted into a weekly city score.

INSEE employment-sector shares remain descriptive context, not shortage rankings, job guarantees or immigration eligibility.

## Programme boundary

France City Compare does not query `city_programme_directory_fr_v1` and does not present the 132 verified national programme offerings as city delivery.

Programme coverage remains `verification_pending` for every Tier A destination.

## Navigation

Each France city profile links to City Compare with its own slug preselected as the left destination.

Compare remains a decision surface and stays `noindex` in Phase 6.

## Release boundary

- no main merge
- no Vercel deployment
- Phase 7 controls profile indexability and sitemap publication

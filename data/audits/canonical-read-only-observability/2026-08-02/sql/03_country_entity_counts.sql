-- 03_country_entity_counts.sql
-- Read-only five-country canonical entity counts (AU/GB/US/CA/IE).
--
-- Uses only columns and foreign keys confirmed in migration SQL
-- (20260730172000 foundation, 20260730180000 taxonomy/geographies,
-- 20260730211500 source_register_records). No column names are guessed.
--
-- NOTE: the canonical seed (20260730180000) inserts core.countries with
-- 'UK' as the United Kingdom code, not 'GB'. The five-country programmatic
-- set uses GB. Both codes are therefore observed here (surfaced as-is per
-- actual country_code) so the GB-vs-UK discrepancy stays visible and is
-- never silently merged.
--
-- Relationship resolution used:
--   direct country_code : core.countries, core.geographies, catalog.institutions,
--                         catalog.campuses, taxonomy.occupations, evidence.sources,
--                         labour.outcome_observations, reporting.products
--   via institutions    : catalog.programmes, catalog.programme_offerings,
--                         catalog.programme_identifiers
--   via offerings       : catalog.programme_fees, catalog.programme_requirements,
--                         catalog.programme_accreditations
--   via occupations     : taxonomy.occupation_identifiers
--   via sources         : evidence.source_snapshots, evidence.metric_observations,
--                         evidence.source_register_records
--   unresolvable        : evidence.claims, evidence.claim_evidence, evidence.review_events,
--                         taxonomy.study_concepts (no country linkage) -> relationship_unresolved
--
-- Safe statement audit: SELECT + metadata functions only.

-- 1. core.countries (only the five canonical codes observed).
select 'countries' as entity, code as country_code, count(*) as actual_count,
       'resolved' as resolution_status
from core.countries
where code in ('AU', 'GB', 'UK', 'US', 'CA', 'IE')
group by code
order by code;

-- 2. core.geographies split by geography_type (region / city / country / sa4 / state / province).
select 'geographies:' || geography_type as entity, country_code, count(*) as actual_count,
       'resolved' as resolution_status
from core.geographies
where country_code in ('AU', 'GB', 'UK', 'US', 'CA', 'IE')
group by geography_type, country_code
order by geography_type, country_code;

-- 3. catalog.institutions.
select 'institutions' as entity, country_code, count(*) as actual_count, 'resolved' as resolution_status
from catalog.institutions
where country_code in ('AU', 'GB', 'UK', 'US', 'CA', 'IE')
group by country_code
order by country_code;

-- 4. catalog.campuses.
select 'campuses' as entity, country_code, count(*) as actual_count, 'resolved' as resolution_status
from catalog.campuses
where country_code in ('AU', 'GB', 'UK', 'US', 'CA', 'IE')
group by country_code
order by country_code;

-- 5. catalog.programmes via institution country (LEFT JOIN keeps programmes whose
--    institution is missing or non-canonical out of canonical-country buckets).
select 'programmes' as entity, i.country_code, count(p.id) as actual_count,
       'resolved_via_institutions' as resolution_status
from catalog.programmes p
left join catalog.institutions i on i.id = p.institution_id
where i.country_code in ('AU', 'GB', 'UK', 'US', 'CA', 'IE')
group by i.country_code
order by i.country_code;

-- 6. catalog.programme_offerings via programme -> institution.
select 'programme_offerings' as entity, i.country_code, count(o.id) as actual_count,
       'resolved_via_programmes' as resolution_status
from catalog.programme_offerings o
join catalog.programmes p on p.id = o.programme_id
left join catalog.institutions i on i.id = p.institution_id
where i.country_code in ('AU', 'GB', 'UK', 'US', 'CA', 'IE')
group by i.country_code
order by i.country_code;

-- 7. catalog.programme_fees via offering -> programme -> institution.
select 'programme_fees' as entity, i.country_code, count(f.id) as actual_count,
       'resolved_via_offerings' as resolution_status
from catalog.programme_fees f
join catalog.programme_offerings o on o.id = f.offering_id
join catalog.programmes p on p.id = o.programme_id
left join catalog.institutions i on i.id = p.institution_id
where i.country_code in ('AU', 'GB', 'UK', 'US', 'CA', 'IE')
group by i.country_code
order by i.country_code;

-- 8. catalog.programme_identifiers via programme -> institution.
select 'programme_identifiers' as entity, i.country_code, count(pi.id) as actual_count,
       'resolved_via_programmes' as resolution_status
from catalog.programme_identifiers pi
join catalog.programmes p on p.id = pi.programme_id
left join catalog.institutions i on i.id = p.institution_id
where i.country_code in ('AU', 'GB', 'UK', 'US', 'CA', 'IE')
group by i.country_code
order by i.country_code;

-- 9. taxonomy.occupations.
select 'occupations' as entity, country_code, count(*) as actual_count, 'resolved' as resolution_status
from taxonomy.occupations
where country_code in ('AU', 'GB', 'UK', 'US', 'CA', 'IE')
group by country_code
order by country_code;

-- 10. taxonomy.occupation_identifiers via occupation country.
select 'occupation_identifiers' as entity, o.country_code, count(oi.id) as actual_count,
       'resolved_via_occupations' as resolution_status
from taxonomy.occupation_identifiers oi
left join taxonomy.occupations o on o.id = oi.occupation_id
where o.country_code in ('AU', 'GB', 'UK', 'US', 'CA', 'IE')
group by o.country_code
order by o.country_code;

-- 11. evidence.sources.
select 'sources' as entity, country_code, count(*) as actual_count, 'resolved' as resolution_status
from evidence.sources
where country_code in ('AU', 'GB', 'UK', 'US', 'CA', 'IE')
group by country_code
order by country_code;

-- 12. evidence.source_snapshots via source country.
select 'source_snapshots' as entity, s.country_code, count(snp.id) as actual_count,
       'resolved_via_sources' as resolution_status
from evidence.source_snapshots snp
left join evidence.sources s on s.id = snp.source_id
where s.country_code in ('AU', 'GB', 'UK', 'US', 'CA', 'IE')
group by s.country_code
order by s.country_code;

-- 13. evidence.metric_observations via snapshot -> source country.
select 'metric_observations' as entity, s.country_code, count(mo.id) as actual_count,
       'resolved_via_source_snapshots' as resolution_status
from evidence.metric_observations mo
left join evidence.source_snapshots snp on snp.id = mo.source_snapshot_id
left join evidence.sources s on s.id = snp.source_id
where s.country_code in ('AU', 'GB', 'UK', 'US', 'CA', 'IE')
group by s.country_code
order by s.country_code;

-- 14. evidence.source_register_records via metric_observation -> snapshot -> source.
select 'source_register_records' as entity, s.country_code, count(rr.record_id) as actual_count,
       'resolved_via_metric_observations' as resolution_status
from evidence.source_register_records rr
left join evidence.metric_observations mo on mo.id = rr.metric_observation_id
left join evidence.source_snapshots snp on snp.id = mo.source_snapshot_id
left join evidence.sources s on s.id = snp.source_id
where s.country_code in ('AU', 'GB', 'UK', 'US', 'CA', 'IE')
group by s.country_code
order by s.country_code;

-- 15. labour.outcome_observations.
select 'labour_outcome_observations' as entity, country_code, count(*) as actual_count,
       'resolved' as resolution_status
from labour.outcome_observations
where country_code in ('AU', 'GB', 'UK', 'US', 'CA', 'IE')
group by country_code
order by country_code;

-- 16. Entities with no resolvable country relationship.
select 'claims' as entity, null::text as country_code, count(*) as actual_count,
       'relationship_unresolved' as resolution_status
from evidence.claims
union all
select 'claim_evidence' as entity, null, count(*), 'relationship_unresolved'
from evidence.claim_evidence
union all
select 'review_events' as entity, null, count(*), 'relationship_unresolved'
from evidence.review_events
union all
select 'study_concepts' as entity, null, count(*), 'relationship_unresolved'
from taxonomy.study_concepts;

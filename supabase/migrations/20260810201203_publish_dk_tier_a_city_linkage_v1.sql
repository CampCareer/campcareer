-- Denmark Cities Phase 3: publish source-backed Tier A institution and programme linkage.
-- Old DK programme canonicalization could fall back to an institution's first campus;
-- this city read model accepts only exact programme-source city + verified city-anchor matches.

with anchors(institution_name,city_slug,campus_name,address_line,postal_code,source_url) as (
  values
    ('Aalborg Universitet','aalborg','Campus Aalborg','Fredrik Bajers Vej 7K','9220 Aalborg Ø','https://www.staff.aau.dk/contact'),
    ('Aarhus Universitet','aarhus','Aarhus University — main Aarhus location','Nordre Ringgade 1','8000 Aarhus C','https://www.au.dk/om/kontakt'),
    ('Copenhagen Business School','frederiksberg','CBS Solbjerg Plads','Solbjerg Plads 3','2000 Frederiksberg','https://www.cbs.dk/en/about-cbs/contact-cbs'),
    ('IT-Universitetet i København','copenhagen','IT University of Copenhagen','Rued Langgaards Vej 7','2300 Copenhagen S','https://en.itu.dk/about-itu/contact'),
    ('Københavns Universitet','copenhagen','University of Copenhagen — central location','Krystalgade 25','1172 Copenhagen K','https://about.ku.dk/contact/'),
    ('Syddansk Universitet','odense','SDU Odense','Campusvej 55','5230 Odense M','https://www.sdu.dk/en/service/vejviser/odense')
)
update catalog.campuses c
set name=a.campus_name,city=g.name,locality=g.name,geography_id=g.id,locality_geography_id=g.id,
    address_line=a.address_line,postal_code=a.postal_code,official_url=a.source_url,source_url=a.source_url,source_checked_at=now(),
    metadata=coalesce(c.metadata,'{}'::jsonb)||jsonb_build_object('normalization_batch','dk_city_linkage_v1','record_scope','verified_city_study_location','location_quality','verified_official','programme_assignment_verified',true,'campus_inventory_complete',false,'source_tier','official_institution'),updated_at=now()
from anchors a
join catalog.institutions i on i.country_code='DK' and i.canonical_name=a.institution_name
join core.geographies g on g.country_code='DK' and g.slug=a.city_slug and g.metadata->>'publication_tier'='A'
where c.institution_id=i.id and c.status='active' and lower(coalesce(c.city,''))=lower(g.name);

insert into catalog.campuses(id,institution_id,name,city,region,country_code,status,geography_id,locality,locality_geography_id,address_line,postal_code,official_url,source_url,source_checked_at,metadata,created_at,updated_at)
select md5('DK|CITY_LINKAGE|AAU|COPENHAGEN')::uuid,i.id,'Campus Copenhagen','Copenhagen','Region Hovedstaden','DK','active',g.id,'Copenhagen',g.id,'A. C. Meyers Vænge 15','2450 København SV','https://www.staff.aau.dk/contact','https://www.staff.aau.dk/contact',now(),jsonb_build_object('normalization_batch','dk_city_linkage_v1','record_scope','verified_city_study_location','location_quality','verified_official','programme_assignment_verified',true,'campus_inventory_complete',false,'source_tier','official_institution','location_key','campus-copenhagen'),now(),now()
from catalog.institutions i join core.geographies g on g.country_code='DK' and g.slug='copenhagen' and g.metadata->>'publication_tier'='A'
where i.country_code='DK' and i.canonical_name='Aalborg Universitet'
on conflict(id) do update set name=excluded.name,city=excluded.city,region=excluded.region,status='active',geography_id=excluded.geography_id,locality=excluded.locality,locality_geography_id=excluded.locality_geography_id,address_line=excluded.address_line,postal_code=excluded.postal_code,official_url=excluded.official_url,source_url=excluded.source_url,source_checked_at=excluded.source_checked_at,metadata=excluded.metadata,updated_at=now();

update catalog.programme_offerings po
set campus_id=c.id,updated_at=now()
from public.program_catalog_dk_staging p
join core.geographies g on g.country_code='DK' and g.metadata->>'publication_tier'='A' and lower(g.name)=lower(trim(p.city))
join catalog.campuses c on c.institution_id=p.institution_id and c.geography_id=g.id and c.status='active' and c.metadata->>'normalization_batch'='dk_city_linkage_v1'
where po.source_system='DK_STUDYINDENMARK' and po.source_record_key=p.source_name||':'||p.source_program_key and po.verification_status='verified' and p.verification_tier in ('A','B') and p.official_program_url is not null;

create or replace view public.city_institution_directory_dk_v1 with (security_invoker=true) as
select g.id city_id,g.slug city_slug,g.name city_name,g.region_code,g.metadata->>'dst_municipality_code' municipality_code,i.id institution_id,i.canonical_name institution_name,i.slug institution_slug,i.website_url,ii.identifier_value authority_identifier,ii.source_url authority_source_url,c.id campus_id,c.name campus_name,c.address_line,c.postal_code,c.source_url location_source_url,c.metadata->>'record_scope' record_scope,c.metadata->>'location_quality' location_quality
from core.geographies g join catalog.campuses c on c.geography_id=g.id and c.status='active' join catalog.institutions i on i.id=c.institution_id and i.status='active' join catalog.institution_identifiers ii on ii.institution_id=i.id and ii.identifier_system='DK_UFM_UNIVERSITY_NAME'
where g.country_code='DK' and g.metadata->>'publication_tier'='A' and c.metadata->>'normalization_batch'='dk_city_linkage_v1' and c.metadata->>'location_quality'='verified_official';

create or replace view public.city_programme_directory_dk_v1 with (security_invoker=true) as
select g.id city_id,g.slug city_slug,g.name city_name,i.id institution_id,i.canonical_name institution_name,i.slug institution_slug,c.id campus_id,c.name campus_name,pr.id programme_id,pr.canonical_title programme_title,pr.programme_type,pr.field_name,po.id offering_id,po.market,po.delivery_mode,po.enrolment_status,po.source_url offering_source_url,p.official_program_url,p.source_program_key,p.verification_tier
from catalog.programme_offerings po join public.program_catalog_dk_staging p on po.source_system='DK_STUDYINDENMARK' and po.source_record_key=p.source_name||':'||p.source_program_key join catalog.programmes pr on pr.id=po.programme_id and pr.status='active' and pr.institution_id=p.institution_id join catalog.institutions i on i.id=pr.institution_id and i.status='active' join catalog.campuses c on c.id=po.campus_id and c.institution_id=i.id and c.status='active' join core.geographies g on g.id=c.geography_id and g.country_code='DK' and g.metadata->>'publication_tier'='A'
where po.verification_status='verified' and p.verification_tier in ('A','B') and p.official_program_url is not null and lower(trim(p.city))=lower(trim(g.name)) and c.metadata->>'normalization_batch'='dk_city_linkage_v1' and coalesce((c.metadata->>'programme_assignment_verified')::boolean,false) is true;

create or replace view public.city_directory_dk_v1 with (security_invoker=true) as
select g.id city_id,g.slug,g.name,g.region_code,g.metadata->>'dst_municipality_code' municipality_code,g.metadata->>'study_destination_scope' study_destination_scope,count(distinct ci.campus_id)::integer linked_campus_count,count(distinct ci.institution_id)::integer linked_institution_count,count(distinct cp.programme_id)::integer linked_program_count,'university_core_professional_providers_pending'::text institution_coverage_status,case when count(distinct cp.programme_id)>0 then 'verified_partial' else 'verification_pending' end::text programme_coverage_status
from core.geographies g left join public.city_institution_directory_dk_v1 ci on ci.city_id=g.id left join public.city_programme_directory_dk_v1 cp on cp.city_id=g.id
where g.country_code='DK' and g.metadata->>'publication_tier'='A' group by g.id,g.slug,g.name,g.region_code,g.metadata;

revoke all on public.city_institution_directory_dk_v1 from public,anon,authenticated;
revoke all on public.city_programme_directory_dk_v1 from public,anon,authenticated;
revoke all on public.city_directory_dk_v1 from public,anon,authenticated;
grant select on public.city_institution_directory_dk_v1 to service_role;
grant select on public.city_programme_directory_dk_v1 to service_role;
grant select on public.city_directory_dk_v1 to service_role;

do $$ declare anchor_n integer; programme_n integer; begin
select count(*) into anchor_n from public.city_institution_directory_dk_v1; if anchor_n<>7 then raise exception 'DK Tier A anchors expected 7 rows, found %',anchor_n; end if;
select count(*) into programme_n from public.city_programme_directory_dk_v1; if programme_n<>115 then raise exception 'DK Tier A programme linkage expected 115 rows, found %',programme_n; end if;
end $$;
-- South Korea Cities Phase 2: normalize the six approved Tier A public study destinations to MOIS administrative-area scope.

do $$
declare existing_reuse integer; new_collision integer;
begin
  select count(*) into existing_reuse from core.geographies
  where country_code='KR' and geography_type='city' and canonical_geography_id is null and slug in ('seoul','busan','daejeon','pohang');
  if existing_reuse<>4 then raise exception 'KR Phase 2 expected four reusable canonical city rows, found %', existing_reuse; end if;
  select count(*) into new_collision from core.geographies
  where country_code='KR' and canonical_geography_id is null and slug in ('suwon','yongin');
  if new_collision<>0 then raise exception 'KR Phase 2 new Tier A slug collision detected'; end if;
end $$;

with approved(city_name,public_slug,region_code,region_name,admin_code,official_admin_name,scope_kind_label,scope_note) as (values
 ('Seoul','seoul','11','Seoul','1100000000','서울특별시','metropolitan_city','Use the full Seoul Special City administrative area as the public study-destination and resident-registration population boundary; the wider capital region is not included.'),
 ('Busan','busan','26','Busan','2600000000','부산광역시','metropolitan_city','Use the full Busan Metropolitan City administrative area as the public study-destination and resident-registration population boundary.'),
 ('Daejeon','daejeon','30','Daejeon','3000000000','대전광역시','metropolitan_city','Use the full Daejeon Metropolitan City administrative area as the public study-destination and resident-registration population boundary.'),
 ('Pohang','pohang','47','Gyeongsangbuk-do','4711000000','경상북도 포항시','municipal_city','Use Pohang-si as the public study-destination and resident-registration population boundary; other Gyeongsangbuk-do university locations remain separate.')
)
update core.geographies g set geography_type='city',code=a.admin_code,scope_kind='city',region_code=a.region_code,status='active',metadata=coalesce(g.metadata,'{}'::jsonb)||jsonb_build_object(
 'kr_city_normalization_v1',true,'publication_tier','A','publication_status','approved_not_indexed','public_slug',a.public_slug,'region_code',a.region_code,'region_name',a.region_name,
 'mois_region_code',a.admin_code,'mois_official_admin_name',a.official_admin_name,'admin_area_kind',a.scope_kind_label,'study_destination_scope','mois_administrative_city',
 'population_geography_contract','mois_resident_registration_admin_area','scope_boundary_label',a.official_admin_name||' ('||a.admin_code||')','scope_note',a.scope_note,
 'scope_standard','MOIS Standard Administrative Region Code / resident-registration administrative area','scope_source_url','https://www.data.go.kr/data/15077871/openapi.do',
 'population_source_url','https://jumin.mois.go.kr/','source_system','MOIS_STANDARD_REGION_CODE','source_tier','government_official','normalization_batch','kr_cities_phase_2_v1',
 'campus_membership_contract','phase_3_explicit_location_evidence_required','programme_coverage_status','verification_pending'),updated_at=now()
from approved a where g.country_code='KR' and g.geography_type='city' and g.canonical_geography_id is null and g.slug=a.public_slug;

insert into core.geographies(country_code,geography_type,code,name,region_code,metadata,slug,scope_kind,status)
select 'KR','city',a.admin_code,a.city_name,a.region_code,jsonb_build_object(
 'kr_city_normalization_v1',true,'publication_tier','A','publication_status','approved_not_indexed','public_slug',a.public_slug,'region_code',a.region_code,'region_name',a.region_name,
 'mois_region_code',a.admin_code,'mois_official_admin_name',a.official_admin_name,'admin_area_kind',a.scope_kind_label,'study_destination_scope','mois_administrative_city',
 'population_geography_contract','mois_resident_registration_admin_area','scope_boundary_label',a.official_admin_name||' ('||a.admin_code||')','scope_note',a.scope_note,
 'scope_standard','MOIS Standard Administrative Region Code / resident-registration administrative area','scope_source_url','https://www.data.go.kr/data/15077871/openapi.do',
 'population_source_url','https://jumin.mois.go.kr/','source_system','MOIS_STANDARD_REGION_CODE','source_tier','government_official','normalization_batch','kr_cities_phase_2_v1',
 'campus_membership_contract','phase_3_explicit_location_evidence_required','programme_coverage_status','verification_pending'),a.public_slug,'city','active'
from (values
 ('Suwon','suwon','41','Gyeonggi-do','4111000000','경기도 수원시','municipal_city','Use Suwon-si as the public study-destination and resident-registration population boundary; Seoul and other Gyeonggi municipalities remain separate.'),
 ('Yongin','yongin','41','Gyeonggi-do','4146000000','경기도 용인시','municipal_city','Use Yongin-si as the public study-destination and resident-registration population boundary; Seoul and Suwon remain separate even where universities share a brand.')
) as a(city_name,public_slug,region_code,region_name,admin_code,official_admin_name,scope_kind_label,scope_note);

insert into core.geography_aliases(geography_id,country_code,alias,alias_normalized,region_code,alias_type,source_system,source_url)
select g.id,'KR',g.name,lower(regexp_replace(trim(g.name),'\s+',' ','g')),g.region_code,'canonical_name','MOIS_STANDARD_REGION_CODE','https://www.data.go.kr/data/15077871/openapi.do'
from core.geographies g where g.country_code='KR' and g.canonical_geography_id is null and g.slug in ('seoul','busan','daejeon','suwon','yongin','pohang') on conflict do nothing;
insert into core.geography_aliases(geography_id,country_code,alias,alias_normalized,region_code,alias_type,source_system,source_url)
select g.id,'KR',g.slug,lower(trim(g.slug)),g.region_code,'slug','core.geographies','https://www.data.go.kr/data/15077871/openapi.do'
from core.geographies g where g.country_code='KR' and g.canonical_geography_id is null and g.slug in ('seoul','busan','daejeon','suwon','yongin','pohang') on conflict do nothing;
with aliases(slug,alias) as (values ('seoul','서울특별시'),('busan','부산광역시'),('daejeon','대전광역시'),('suwon','수원시'),('yongin','용인시'),('pohang','포항시'))
insert into core.geography_aliases(geography_id,country_code,alias,alias_normalized,region_code,alias_type,source_system,source_url)
select g.id,'KR',a.alias,lower(trim(a.alias)),g.region_code,'source','MOIS_STANDARD_REGION_CODE','https://www.data.go.kr/data/15077871/openapi.do'
from aliases a join core.geographies g on g.country_code='KR' and g.slug=a.slug and g.canonical_geography_id is null on conflict do nothing;

do $$
declare normalized_count integer; unexpected_tier_a integer; bad_code integer; alias_count integer;
begin
 select count(*) into normalized_count from core.geographies g where g.country_code='KR' and g.geography_type='city' and g.canonical_geography_id is null
  and g.slug in ('seoul','busan','daejeon','suwon','yongin','pohang') and g.scope_kind='city' and g.status='active' and g.metadata->>'publication_tier'='A'
  and g.metadata->>'publication_status'='approved_not_indexed' and g.metadata->>'study_destination_scope'='mois_administrative_city'
  and g.metadata->>'population_geography_contract'='mois_resident_registration_admin_area' and g.metadata->>'mois_region_code'=g.code and g.metadata->>'programme_coverage_status'='verification_pending';
 if normalized_count<>6 then raise exception 'KR Tier A normalization expected 6 rows, found %',normalized_count; end if;
 select count(*) into unexpected_tier_a from core.geographies g where g.country_code='KR' and g.geography_type='city' and g.canonical_geography_id is null and g.metadata->>'publication_tier'='A'
  and g.slug not in ('seoul','busan','daejeon','suwon','yongin','pohang');
 if unexpected_tier_a<>0 then raise exception 'Unexpected KR Tier A geography detected'; end if;
 select count(*) into bad_code from core.geographies g where g.country_code='KR' and g.metadata->>'publication_tier'='A' and
  ((g.slug='seoul' and (g.code<>'1100000000' or g.region_code<>'11')) or (g.slug='busan' and (g.code<>'2600000000' or g.region_code<>'26')) or
   (g.slug='daejeon' and (g.code<>'3000000000' or g.region_code<>'30')) or (g.slug='suwon' and (g.code<>'4111000000' or g.region_code<>'41')) or
   (g.slug='yongin' and (g.code<>'4146000000' or g.region_code<>'41')) or (g.slug='pohang' and (g.code<>'4711000000' or g.region_code<>'47')));
 if bad_code<>0 then raise exception 'KR MOIS administrative-code contract failed'; end if;
 select count(*) into alias_count from core.geography_aliases a join core.geographies g on g.id=a.geography_id where g.country_code='KR' and g.metadata->>'publication_tier'='A';
 if alias_count<18 then raise exception 'Expected at least 18 KR Tier A aliases, found %',alias_count; end if;
end $$;

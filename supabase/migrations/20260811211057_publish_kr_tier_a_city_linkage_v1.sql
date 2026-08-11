-- South Korea Cities Phase 3: verified teaching-location representatives, strict programme-to-city linkage and private read models.

with locations(institution_name,city_slug,campus_name,address_line,postal_code,official_url) as (values
 ('Seoul National University','seoul','Gwanak Main Campus','1 Gwanak-ro, Gwanak-gu','08826','https://en.snu.ac.kr/about/campus/gwanak/address'),
 ('Korea University','seoul','Seoul Campus — Anam','145 Anam-ro, Seongbuk-gu','02841','https://www.korea.edu/'),
 ('Yonsei University','seoul','Sinchon Campus','50 Yonsei-ro, Seodaemun-gu','03722','https://www.yonsei.ac.kr/en_sc/intro/address.jsp'),
 ('Hanyang University','seoul','Seoul Campus','222 Wangsimni-ro, Seongdong-gu','04763','https://www.hanyang.ac.kr/web/eng/seoul-campus'),
 ('Kyung Hee University','seoul','Seoul Campus','26 Kyungheedae-ro, Dongdaemun-gu','02447','https://www.khu.ac.kr/eng/user/contents/view.do?menuNo=300051'),
 ('Sungkyunkwan University (SKKU)','seoul','Humanities and Social Sciences Campus','25-2 Sungkyunkwan-ro, Jongno-gu','03063','https://www.skku.edu/eng/About/campusinfo/campusMap.do'),
 ('Ewha Womans University','seoul','Ewha Seoul Campus','52 Ewhayeodae-gil, Seodaemun-gu','03760','https://www.ewha.ac.kr/ewhaen/intro/location.do'),
 ('Pusan National University','busan','Busan Campus','2 Busandaehak-ro 63beon-gil, Geumjeong-gu','46241','https://www.pusan.ac.kr/eng/CMS/CampusMgr/list.do?mCode=MN059'),
 ('Korea Maritime & Ocean University','busan','Main Campus','727 Taejong-ro, Yeongdo-gu','49112','https://www.kmou.ac.kr/english/cm/cntnts/cntntsView.do?mi=3802&cntntsId=1948'),
 ('KAIST (Korea Advanced Institute of Science and Technology)','daejeon','Daejeon Main Campus','291 Daehak-ro, Yuseong-gu','34141','https://www.kaist.ac.kr/en/html/kaist/011402.html'),
 ('Daejeon Health University','daejeon','Daejeon Health University Campus','21 Chungjeong-ro, Dong-gu','34504','https://www.hit.ac.kr/english'),
 ('Sungkyunkwan University (SKKU)','suwon','Natural Sciences Campus','2066 Seobu-ro, Jangan-gu','16419','https://www.skku.edu/eng/About/campusinfo/campusMap.do'),
 ('Kyung Hee University','yongin','Global Campus','1732 Deogyeong-daero, Giheung-gu','17104','https://www.khu.ac.kr/eng/user/contents/view.do?menuNo=300051'),
 ('Pohang University of Science and Technology (POSTECH)','pohang','POSTECH Campus','77 Cheongam-ro, Nam-gu','37673','https://www.postech.ac.kr/eng/about/visit/overview/')
)
insert into catalog.campuses(institution_id,name,city,region,country_code,geography_id,locality,locality_geography_id,address_line,postal_code,official_url,source_url,source_checked_at,metadata,status)
select i.id,l.campus_name,g.name,g.metadata->>'region_name','KR',g.id,g.name,g.id,l.address_line,l.postal_code,l.official_url,l.official_url,now(),
 jsonb_build_object('source_tier','institution_official','record_scope','verified_teaching_location_representative','source_system','UNIVERSITY_OFFICIAL_TEACHING_LOCATION',
 'location_quality','verified_official_institution_city','normalization_batch','kr_city_linkage_v1','campus_inventory_complete',false,'programme_assignment_verified',true,
 'city_membership_contract','phase_2_mois_administrative_city'),'active'
from locations l join catalog.institutions i on i.country_code='KR' and i.canonical_name=l.institution_name and i.status='active'
join core.geographies g on g.country_code='KR' and g.slug=l.city_slug and g.metadata->>'publication_tier'='A' and g.canonical_geography_id is null
on conflict do nothing;

with assignment(institution_name,source_city,campus_name) as (values
 ('Seoul National University','Seoul','Gwanak Main Campus'),('Korea University','Seoul','Seoul Campus — Anam'),('Yonsei University','Seoul','Sinchon Campus'),
 ('Hanyang University','Seoul','Seoul Campus'),('Kyung Hee University','Seoul','Seoul Campus'),('Sungkyunkwan University (SKKU)','Seoul','Humanities and Social Sciences Campus'),
 ('Ewha Womans University','Seoul','Ewha Seoul Campus'),('Pusan National University','Busan','Busan Campus'),('Korea Maritime & Ocean University','Busan','Main Campus'),
 ('KAIST (Korea Advanced Institute of Science and Technology)','Daejeon','Daejeon Main Campus'),('Daejeon Health University','Daejeon','Daejeon Health University Campus'),
 ('Sungkyunkwan University (SKKU)','Suwon','Natural Sciences Campus'),('Kyung Hee University','Yongin','Global Campus'),
 ('Pohang University of Science and Technology (POSTECH)','Pohang','POSTECH Campus')
)
update catalog.programme_offerings po set campus_id=c.id,updated_at=now()
from public.program_catalog_kr_staging s
join assignment a on a.institution_name=s.institution_name and a.source_city=s.city
join catalog.institutions i on i.id=s.institution_id and i.country_code='KR' and i.canonical_name=a.institution_name
join catalog.campuses c on c.institution_id=i.id and c.name=a.campus_name and c.city=s.city and c.country_code='KR' and c.status='active' and c.metadata->>'normalization_batch'='kr_city_linkage_v1'
join catalog.programmes p on p.institution_id=i.id and p.status='active'
where po.programme_id=p.id and po.source_system='KR_STUDYINKOREA' and po.source_record_key=s.source_program_key
  and po.verification_status='verified' and s.verification_tier in ('A','B');

create or replace view public.city_institution_directory_kr_v1 with (security_invoker=true) as
select g.id city_id,g.slug city_slug,g.name city_name,g.region_code,g.metadata->>'region_name' region_name,g.code admin_code,
 i.id institution_id,i.canonical_name institution_name,i.slug institution_slug,i.website_url,
 ii.identifier_system authority_identifier_system,ii.identifier_value authority_identifier,ii.source_url authority_source_url,
 'studyinkorea_code_or_ieqas_name_mixed_verified'::text identifier_maturity,
 c.id campus_id,c.name campus_name,c.address_line,c.postal_code,coalesce(c.source_url,c.official_url,i.website_url) location_source_url,
 c.metadata->>'record_scope' record_scope,c.metadata->>'location_quality' location_quality,
 coalesce((c.metadata->>'programme_assignment_verified')::boolean,false) programme_assignment_verified
from core.geographies g
join catalog.campuses c on c.geography_id=g.id and c.status='active' and c.metadata->>'normalization_batch'='kr_city_linkage_v1'
join catalog.institutions i on i.id=c.institution_id and i.status='active' and i.country_code='KR'
join lateral (
 select x.identifier_system,x.identifier_value,x.source_url from catalog.institution_identifiers x where x.institution_id=i.id
 order by case x.identifier_system when 'KR_STUDYINKOREA_UNIV_CD' then 1 when 'KR_IEQAS_TIER_A_NAME' then 2 else 9 end,x.identifier_system limit 1
) ii on true
where g.country_code='KR' and g.metadata->>'publication_tier'='A' and c.metadata->>'location_quality'='verified_official_institution_city';

create or replace view public.city_programme_directory_kr_v1 with (security_invoker=true) as
select g.id city_id,g.slug city_slug,g.name city_name,i.id institution_id,i.canonical_name institution_name,i.slug institution_slug,
 c.id campus_id,c.name campus_name,pr.id programme_id,pr.canonical_title programme_title,pr.programme_type,pr.field_name,
 s.degree_level source_degree_level,po.id offering_id,po.market,po.delivery_mode,po.enrolment_status,po.source_url offering_source_url,
 coalesce(s.official_program_url,s.studyinkorea_url) official_program_url,s.studyinkorea_url,s.source_program_key,s.city source_city,s.verification_tier,s.collection_status
from catalog.programme_offerings po
join public.program_catalog_kr_staging s on po.source_system='KR_STUDYINKOREA' and po.source_record_key=s.source_program_key
join catalog.programmes pr on pr.id=po.programme_id and pr.status='active' and pr.institution_id=s.institution_id
join catalog.institutions i on i.id=pr.institution_id and i.status='active' and i.country_code='KR'
join catalog.campuses c on c.id=po.campus_id and c.institution_id=i.id and c.status='active'
join core.geographies g on g.id=c.geography_id and g.country_code='KR' and g.metadata->>'publication_tier'='A'
where po.verification_status='verified' and s.verification_tier in ('A','B') and lower(trim(s.city))=lower(trim(g.name))
 and c.metadata->>'normalization_batch'='kr_city_linkage_v1' and coalesce((c.metadata->>'programme_assignment_verified')::boolean,false) is true;

create or replace view public.city_directory_kr_v1 with (security_invoker=true) as
select g.id city_id,g.slug,g.name,g.region_code,g.metadata->>'region_name' region_name,g.code admin_code,
 g.metadata->>'study_destination_scope' study_destination_scope,
 count(distinct ci.campus_id)::integer linked_campus_count,count(distinct ci.institution_id)::integer linked_institution_count,count(distinct cp.programme_id)::integer linked_program_count,
 'selected_studyinkorea_provider_core_full_hei_coverage_pending'::text institution_coverage_status,
 'studyinkorea_code_or_ieqas_name_mixed_verified'::text institution_identifier_maturity,
 case when count(distinct cp.programme_id)>0 then 'verified_partial' else 'verification_pending' end::text programme_coverage_status
from core.geographies g left join public.city_institution_directory_kr_v1 ci on ci.city_id=g.id left join public.city_programme_directory_kr_v1 cp on cp.city_id=g.id
where g.country_code='KR' and g.metadata->>'publication_tier'='A'
group by g.id,g.slug,g.name,g.region_code,g.code,g.metadata;

revoke all on public.city_institution_directory_kr_v1 from public,anon,authenticated;
revoke all on public.city_programme_directory_kr_v1 from public,anon,authenticated;
revoke all on public.city_directory_kr_v1 from public,anon,authenticated;
grant select on public.city_institution_directory_kr_v1 to service_role;
grant select on public.city_programme_directory_kr_v1 to service_role;
grant select on public.city_directory_kr_v1 to service_role;

do $$
declare location_n integer; programme_n integer; city_n integer; bad_city integer; mismatch_n integer; suwon_n integer; yongin_n integer; excluded_n integer;
begin
 select count(*) into location_n from public.city_institution_directory_kr_v1;
 if location_n<>14 then raise exception 'KR Tier A verified teaching locations expected 14 rows, found %',location_n; end if;
 select count(*) into programme_n from public.city_programme_directory_kr_v1;
 if programme_n<>182 then raise exception 'KR strict city programme linkage expected 182 rows, found %',programme_n; end if;
 select count(*) into city_n from public.city_directory_kr_v1;
 if city_n<>6 then raise exception 'KR city directory expected 6 rows, found %',city_n; end if;
 select count(*) into bad_city from public.city_directory_kr_v1 where linked_campus_count<1 or linked_institution_count<1;
 if bad_city<>0 then raise exception 'Every KR Tier A city must have verified institution/location linkage'; end if;
 select count(*) into mismatch_n from public.city_programme_directory_kr_v1 where lower(trim(source_city))<>lower(trim(city_name));
 if mismatch_n<>0 then raise exception 'KR programme source-city mismatch detected'; end if;
 select count(*) into suwon_n from public.city_programme_directory_kr_v1 where city_slug='suwon' and institution_name='Sungkyunkwan University (SKKU)';
 if suwon_n<>8 then raise exception 'KR Suwon SKKU repair expected 8 programmes, found %',suwon_n; end if;
 select count(*) into yongin_n from public.city_programme_directory_kr_v1 where city_slug='yongin' and institution_name='Kyung Hee University';
 if yongin_n<>17 then raise exception 'KR Yongin Kyung Hee repair expected 17 programmes, found %',yongin_n; end if;
 select count(*) into excluded_n from public.city_programme_directory_kr_v1 where source_city in ('Cheonan','Goyang');
 if excluded_n<>0 then raise exception 'KR later-candidate programme leakage detected'; end if;
end $$;

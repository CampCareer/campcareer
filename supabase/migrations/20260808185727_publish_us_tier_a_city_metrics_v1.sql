-- Publish five verified decision metrics for the eight approved U.S. Tier A cities.
-- Metric contract mirrors the Canada rollout: population, indicative student living cost,
-- transport reference, F-1 work-hours reference, and employment-focus sectors.

with tier_a as (
  select id, slug
  from core.geographies
  where country_code='US' and geography_type='city' and status='active'
    and canonical_geography_id is null
    and coalesce(metadata->>'publication_tier','')='A'
), rows as (
  select id geography_id, slug,
    case slug
      when 'new-york' then '{"amount":8584629,"geography":"New York city, New York","estimate_vintage":"V2025"}'::jsonb
      when 'boston' then '{"amount":672973,"geography":"Boston city, Massachusetts","estimate_vintage":"V2025"}'::jsonb
      when 'los-angeles' then '{"amount":3869089,"geography":"Los Angeles city, California","estimate_vintage":"V2025"}'::jsonb
      when 'chicago' then '{"amount":2731585,"geography":"Chicago city, Illinois","estimate_vintage":"V2025"}'::jsonb
      when 'seattle' then '{"amount":784777,"geography":"Seattle city, Washington","estimate_vintage":"V2025"}'::jsonb
      when 'san-diego' then '{"amount":1406106,"geography":"San Diego city, California","estimate_vintage":"V2025"}'::jsonb
      when 'philadelphia' then '{"amount":1574281,"geography":"Philadelphia city, Pennsylvania","estimate_vintage":"V2025"}'::jsonb
      when 'tempe' then '{"amount":190571,"geography":"Tempe city, Arizona","estimate_vintage":"V2025"}'::jsonb
    end value,
    case slug
      when 'boston' then 'U.S. Census Bureau QuickFacts — Boston city, Massachusetts'
      when 'chicago' then 'U.S. Census Bureau QuickFacts — Chicago city, Illinois'
      when 'seattle' then 'U.S. Census Bureau QuickFacts — Seattle city, Washington'
      when 'philadelphia' then 'U.S. Census Bureau QuickFacts — Philadelphia city, Pennsylvania'
      when 'tempe' then 'U.S. Census Bureau QuickFacts — Tempe city, Arizona'
      else 'U.S. Census Bureau Vintage 2025 City and Town Population Estimates'
    end source_name,
    case slug
      when 'boston' then 'https://www.census.gov/quickfacts/fact/table/bostoncitymassachusetts/SBO020223'
      when 'chicago' then 'https://www.census.gov/quickfacts/fact/table/chicagocityillinois/PST045219'
      when 'seattle' then 'https://www.census.gov/quickfacts/fact/table/seattlecitywashington/PST045224'
      when 'philadelphia' then 'https://www.census.gov/quickfacts/fact/table/philadelphiacitypennsylvania/POP010210'
      when 'tempe' then 'https://www.census.gov/quickfacts/fact/table/tempecityarizona/POP010210'
      else 'https://www.census.gov/newsroom/press-releases/2026/vintage-2025-city-town-pop-estimates.html'
    end source_url
  from tier_a
)
insert into public.report_metric_evidence_city
(id,geography_id,scope_type,scope_id,metric_key,value,source_name,source_url,data_as_of,last_verified_at,confidence,evidence_kind,review_status,created_at,updated_at)
select gen_random_uuid(),geography_id,'city',geography_id::text,'city_population',value,source_name,source_url,'2025-07-01'::date,now(),'high','observed','verified',now(),now()
from rows
on conflict (geography_id,metric_key) do update set value=excluded.value,source_name=excluded.source_name,source_url=excluded.source_url,data_as_of=excluded.data_as_of,last_verified_at=now(),confidence=excluded.confidence,evidence_kind=excluded.evidence_kind,review_status='verified',updated_at=now();

with tier_a as (
  select id, slug from core.geographies
  where country_code='US' and geography_type='city' and status='active'
    and canonical_geography_id is null and coalesce(metadata->>'publication_tier','')='A'
), rows as (
  select id geography_id, slug,
    case slug
      when 'new-york' then '{"low":3436.67,"high":3436.67,"period":"month","currency":"USD","scenario":"NYU Tisch 2026-27 two-semester food/housing + transportation + personal expenses, divided across 9 months","indicative":true}'::jsonb
      when 'boston' then '{"low":2884.56,"high":2884.56,"period":"month","currency":"USD","scenario":"Boston University 2026/27 international-student 9-month room/board + incidentals, divided across 9 months","indicative":true}'::jsonb
      when 'los-angeles' then '{"low":2754.00,"high":2795.11,"period":"month","currency":"USD","scenario":"USC 2026-27 off-campus to on-campus housing + food + transportation + personal/miscellaneous, divided across 9 months","indicative":true}'::jsonb
      when 'chicago' then '{"low":3166.67,"high":3166.67,"period":"month","currency":"USD","scenario":"UChicago 2026-27 three-quarter housing/food + personal + transportation, divided across 9 months","indicative":true}'::jsonb
      when 'seattle' then '{"low":2493.33,"high":2493.33,"period":"month","currency":"USD","scenario":"UW Seattle 2026-27 nine-month on/off-campus rent/utilities/food + personal + transportation, divided across 9 months","indicative":true}'::jsonb
      when 'san-diego' then '{"low":3024.67,"high":3180.67,"period":"month","currency":"USD","scenario":"UC San Diego Summer Session 2026 weekly living/personal/transport estimate for on-campus to off-campus students, converted using 52/12 weeks per month","indicative":true,"summer_reference":true}'::jsonb
      when 'philadelphia' then '{"low":2450.44,"high":2450.44,"period":"month","currency":"USD","scenario":"Penn 2026-27 fall/spring housing + food + personal + transportation, divided across 9 months","indicative":true}'::jsonb
      when 'tempe' then '{"low":2534.67,"high":2534.67,"period":"month","currency":"USD","scenario":"ASU Tempe on-campus housing + food + travel + personal standard allowance, divided across 9 months","indicative":true}'::jsonb
    end value,
    case slug
      when 'new-york' then 'NYU Tisch Cost of Attendance 2026-2027'
      when 'boston' then 'Boston University ISSO Undergraduate Estimate of Expenses 2026/2027'
      when 'los-angeles' then 'USC Undergraduate Cost of Attendance 2026-2027'
      when 'chicago' then 'University of Chicago Graduate Cost of Attendance 2026-2027'
      when 'seattle' then 'University of Washington Student Budgets 2026-27'
      when 'san-diego' then 'UC San Diego Summer Session Cost of Attendance 2026'
      when 'philadelphia' then 'Penn LPS Graduate Program Costs 2026-2027'
      when 'tempe' then 'Arizona State University Cost of Attendance — Tempe'
    end source_name,
    case slug
      when 'new-york' then 'https://bulletins.nyu.edu/undergraduate/arts/cost-attendance/'
      when 'boston' then 'https://www.bu.edu/isso/undergraduate-estimate-of-expenses/'
      when 'los-angeles' then 'https://admission.usc.edu/cost-and-financial-aid/financial-aid-and-scholarships/'
      when 'chicago' then 'https://financialaid.uchicago.edu/graduate/costs/cost-of-attendance/'
      when 'seattle' then 'https://www.washington.edu/financialaid/getting-started/student-budgets/'
      when 'san-diego' then 'https://fas.ucsd.edu/resources/summer-session/cost-of-attendance.html'
      when 'philadelphia' then 'https://srfs.upenn.edu/costs-budgeting/LPS-grad'
      when 'tempe' then 'https://tuition.asu.edu/cost-of-attendance'
    end source_url
  from tier_a
)
insert into public.report_metric_evidence_city
(id,geography_id,scope_type,scope_id,metric_key,value,source_name,source_url,data_as_of,last_verified_at,confidence,evidence_kind,review_status,created_at,updated_at)
select gen_random_uuid(),geography_id,'city',geography_id::text,'student_living_cost_monthly_range',value,source_name,source_url,'2026-08-08'::date,now(),'medium','calculated','verified',now(),now()
from rows
on conflict (geography_id,metric_key) do update set value=excluded.value,source_name=excluded.source_name,source_url=excluded.source_url,data_as_of=excluded.data_as_of,last_verified_at=now(),confidence=excluded.confidence,evidence_kind=excluded.evidence_kind,review_status='verified',updated_at=now();

with tier_a as (
  select id, slug from core.geographies
  where country_code='US' and geography_type='city' and status='active'
    and canonical_geography_id is null and coalesce(metadata->>'publication_tier','')='A'
), rows as (
  select id geography_id, slug,
    case slug
      when 'new-york' then '{"amount":35,"period":"rolling_7_days","currency":"USD","transport_kind":"mta_omny_rolling_7_day_fare_cap","base_fare":3,"effective_from":"2026-01-04","eligibility_required":false}'::jsonb
      when 'boston' then '{"amount":320,"period":"fall_2026_4_month_semester","currency":"USD","transport_kind":"bu_mbta_student_link_pass","monthly_equivalent":80,"discount_pct":11,"eligibility_required":true}'::jsonb
      when 'los-angeles' then '{"amount":6,"period":"rolling_7_days","currency":"USD","transport_kind":"la_metro_college_vocational_fare_cap","base_fare":0.75,"daily_cap":2.5,"eligibility_required":true}'::jsonb
      when 'chicago' then '{"amount":75,"period":"30_days","currency":"USD","transport_kind":"cta_pace_30_day_full_fare_pass","eligibility_required":false}'::jsonb
      when 'seattle' then '{"amount":210,"period":"9_month_academic_year","currency":"USD","transport_kind":"uw_seattle_upass_annual_expense","included_in_tuition_and_fees_budget":true,"eligibility_required":true}'::jsonb
      when 'san-diego' then '{"amount":72,"period":"month","currency":"USD","transport_kind":"mts_pronto_regional_month_pass","eligibility_required":false}'::jsonb
      when 'philadelphia' then '{"amount":116,"period":"month","currency":"USD","transport_kind":"septa_monthly_transpass_plus","eligibility_required":false}'::jsonb
      when 'tempe' then '{"amount":150,"period":"academic_year_aug16_may15","currency":"USD","transport_kind":"asu_student_upass","eligibility_required":true}'::jsonb
    end value,
    case slug
      when 'new-york' then 'MTA 2026 Fare Change Materials'
      when 'boston' then 'Boston University Student MBTA Options — Fall 2026 Semester Pass'
      when 'los-angeles' then 'LA Metro College/Vocational Reduced Fare'
      when 'chicago' then 'Chicago Transit Authority Fare Information'
      when 'seattle' then 'University of Washington Student Budgets 2026-27 — U-Pass'
      when 'san-diego' then 'San Diego MTS PRONTO Regional Month Pass'
      when 'philadelphia' then 'SEPTA Fare Information — Monthly TransPass+'
      when 'tempe' then 'Arizona State University Student U-Pass'
    end source_name,
    case slug
      when 'new-york' then 'https://www.mta.info/document/186881'
      when 'boston' then 'https://www.bu.edu/transportation/public-transit/student-mbta-options/'
      when 'los-angeles' then 'https://www.metro.net/fares/collegevocational/'
      when 'chicago' then 'https://www.transitchicago.com/fares/'
      when 'seattle' then 'https://www.washington.edu/financialaid/getting-started/student-budgets/'
      when 'san-diego' then 'https://www.sdmts.com/fares/pass-programs/employer-programs'
      when 'philadelphia' then 'https://www.septa.org/fares'
      when 'tempe' then 'https://cfo.asu.edu/transit-passes'
    end source_url,
    case when slug='new-york' then '2026-01-04'::date else '2026-08-08'::date end data_as_of
  from tier_a
)
insert into public.report_metric_evidence_city
(id,geography_id,scope_type,scope_id,metric_key,value,source_name,source_url,data_as_of,last_verified_at,confidence,evidence_kind,review_status,created_at,updated_at)
select gen_random_uuid(),geography_id,'city',geography_id::text,'student_transport_reference',value,source_name,source_url,data_as_of,now(),'high','observed','verified',now(),now()
from rows
on conflict (geography_id,metric_key) do update set value=excluded.value,source_name=excluded.source_name,source_url=excluded.source_url,data_as_of=excluded.data_as_of,last_verified_at=now(),confidence=excluded.confidence,evidence_kind=excluded.evidence_kind,review_status='verified',updated_at=now();

with tier_a as (
  select id, slug from core.geographies
  where country_code='US' and geography_type='city' and status='active'
    and canonical_geography_id is null and coalesce(metadata->>'publication_tier','')='A'
), rows as (
  select id geography_id, slug,
    case slug
      when 'new-york' then '{"basis":"NYCEDC legacy and emerging growth industries","sectors":["Finance","Media","Technology","Life sciences","Green economy"]}'::jsonb
      when 'boston' then '{"basis":"City of Boston Business Strategy Team key industries","sectors":["Technology","Life sciences","Manufacturing","Creative economy"]}'::jsonb
      when 'los-angeles' then '{"basis":"City of Los Angeles EWDD economic and workforce strategy sectors","sectors":["Entertainment and media","International trade","Technology and innovation","Manufacturing","Healthcare and biotechnology","Tourism"]}'::jsonb
      when 'chicago' then '{"basis":"World Business Chicago key industries","sectors":["Life science and healthcare","Food and agtech","Transportation and logistics","Manufacturing","Fintech"],"growth_pillars":["Cleantech","Quantum computing"]}'::jsonb
      when 'seattle' then '{"basis":"City of Seattle Office of Economic Development key industries","sectors":["Construction","Creative economy","Green economy","Health services","Maritime, manufacturing and logistics","Life sciences","Technology"]}'::jsonb
      when 'san-diego' then '{"basis":"City of San Diego base sectors plus innovative industries","sectors":["International trade","Manufacturing","Military and defense","Tourism","Life sciences and biotechnology","Technology and software"]}'::jsonb
      when 'philadelphia' then '{"basis":"Philadelphia Department of Commerce key industries","sectors":["Advanced manufacturing, logistics and industrial real estate","Commercial investment","Creative economy","Life sciences","Nighttime economy","Technology"]}'::jsonb
      when 'tempe' then '{"basis":"City of Tempe Economic Development key industries","sectors":["Advanced business services","Advanced manufacturing","Healthcare and biotechnology","Hospitality and tourism","Technology"]}'::jsonb
    end value,
    case slug
      when 'new-york' then 'NYCEDC Growth Industries'
      when 'boston' then 'Boston''s Open for Business'
      when 'los-angeles' then 'Los Angeles Comprehensive Economic Development Strategy and Jobs Plan'
      when 'chicago' then 'World Business Chicago — Key Industries'
      when 'seattle' then 'Seattle Key Industries'
      when 'san-diego' then 'City of San Diego Key Facts and Figures'
      when 'philadelphia' then 'Philadelphia Support for Key Industries'
      when 'tempe' then 'Tempe Key Industries'
    end source_name,
    case slug
      when 'new-york' then 'https://edc.nyc/growth-industries'
      when 'boston' then 'https://www.boston.gov/government/cabinets/economic-opportunity-and-inclusion/bostons-open-business'
      when 'los-angeles' then 'https://ewdd.lacity.gov/index.php/ceds'
      when 'chicago' then 'https://worldbusinesschicago.com/'
      when 'seattle' then 'https://www.seattle.gov/economic-development/key-industries'
      when 'san-diego' then 'https://www.sandiego.gov/economic-development/sandiego/facts'
      when 'philadelphia' then 'https://www.phila.gov/departments/department-of-commerce/for-businesses/support-for-key-industries/'
      when 'tempe' then 'https://www.tempe.gov/government/economic-development/key-industries'
    end source_url
  from tier_a
)
insert into public.report_metric_evidence_city
(id,geography_id,scope_type,scope_id,metric_key,value,source_name,source_url,data_as_of,last_verified_at,confidence,evidence_kind,review_status,created_at,updated_at)
select gen_random_uuid(),geography_id,'city',geography_id::text,'employment_focus_sectors',value,source_name,source_url,'2026-08-08'::date,now(),'medium','observed','verified',now(),now()
from rows
on conflict (geography_id,metric_key) do update set value=excluded.value,source_name=excluded.source_name,source_url=excluded.source_url,data_as_of=excluded.data_as_of,last_verified_at=now(),confidence=excluded.confidence,evidence_kind=excluded.evidence_kind,review_status='verified',updated_at=now();

insert into public.report_metric_evidence_city
(id,geography_id,scope_type,scope_id,metric_key,value,source_name,source_url,data_as_of,last_verified_at,confidence,evidence_kind,review_status,created_at,updated_at)
select gen_random_uuid(),g.id,'city',g.id::text,'student_work_hours_week',
  '{"hours":20,"period":"week_during_academic_sessions","work_context":"f1_on_campus","eligibility_conditions_apply":true,"full_time_during_eligible_breaks":true,"off_campus_requires_separate_authorization":true}'::jsonb,
  'ICE SEVP Employment — F-1 Student On-Campus','https://www.ice.gov/sevis/employment','2026-08-08'::date,now(),'high','observed','verified',now(),now()
from core.geographies g
where g.country_code='US' and g.geography_type='city' and g.status='active'
  and g.canonical_geography_id is null and coalesce(g.metadata->>'publication_tier','')='A'
on conflict (geography_id,metric_key) do update set value=excluded.value,source_name=excluded.source_name,source_url=excluded.source_url,data_as_of=excluded.data_as_of,last_verified_at=now(),confidence=excluded.confidence,evidence_kind=excluded.evidence_kind,review_status='verified',updated_at=now();

do $$
declare metric_total integer; bad_cities integer;
begin
  select count(*) into metric_total
  from public.report_metric_evidence_city e
  join core.geographies g on g.id=e.geography_id
  where g.country_code='US' and g.geography_type='city'
    and coalesce(g.metadata->>'publication_tier','')='A'
    and e.metric_key in ('city_population','student_living_cost_monthly_range','student_transport_reference','student_work_hours_week','employment_focus_sectors');
  if metric_total <> 40 then
    raise exception 'US Tier A five-metric contract expected 40 rows, found %', metric_total;
  end if;

  select count(*) into bad_cities from (
    select g.id
    from core.geographies g
    left join public.report_metric_evidence_city e on e.geography_id=g.id
      and e.metric_key in ('city_population','student_living_cost_monthly_range','student_transport_reference','student_work_hours_week','employment_focus_sectors')
    where g.country_code='US' and g.geography_type='city' and g.status='active'
      and g.canonical_geography_id is null and coalesce(g.metadata->>'publication_tier','')='A'
    group by g.id having count(e.id) <> 5
  ) x;
  if bad_cities <> 0 then
    raise exception 'US Tier A five-metric contract has % cities without exactly five metrics', bad_cities;
  end if;
end $$;

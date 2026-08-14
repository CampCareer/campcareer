-- Australia relative Pay reassessment, 2026-08-15.
--
-- Public Pay is country-relative. Prefer an exact official occupation earnings
-- measure when available; otherwise use the closest defensible official ANZSCO
-- occupation-group earnings measure and lower evidence confidence to estimated.
-- Missing earnings evidence must remain missing rather than silently scoring 0.
--
-- Benchmark: all occupations median full-time weekly earnings = AUD 1,852.
-- Source: Jobs and Skills Australia occupation profiles, sourced from the ABS
-- Survey of Employee Earnings and Hours, May 2025 customised report.

with pay_input(career_id, anzsco_group, group_title, weekly_median, premium_pct, pay_score, confidence) as (
  values
  ('accountant','2211','Accountants',2003,8.15,6,'estimated'),
  ('agronomist','2341','Agricultural and Forestry Scientists',2074,11.99,7,'estimated'),
  ('aircraft-maintenance-technician','3231','Aircraft Maintenance Engineers',1980,6.91,6,'estimated'),
  ('animal-science-technician','3111','Agricultural Technicians',1808,-2.38,5,'estimated'),
  ('animator','2324','Graphic and Web Designers, and Illustrators',1850,-0.11,5,'estimated'),
  ('architect','2321','Architects and Landscape Architects',2308,24.62,9,'estimated'),
  ('auditor','2212','Auditors, Company Secretaries and Corporate Treasurers',2104,13.61,7,'estimated'),
  ('automotive-service-technician','3212','Motor Mechanics',1622,-12.42,3,'estimated'),
  ('baker','3511','Bakers and Pastrycooks',1417,-23.49,1,'estimated'),
  ('business-analyst','2247','Management and Organisation Analysts',2444,31.97,10,'estimated'),
  ('chef','3513','Chefs',1423,-23.16,1,'verified'),
  ('chemical-engineer','2331','Chemical and Materials Engineers',2849,53.83,10,'estimated'),
  ('civil-engineer','2332','Civil Engineering Professionals',2217,19.71,8,'estimated'),
  ('cloud-engineer','2613','Software and Applications Programmers',2537,36.99,10,'estimated'),
  ('commercial-pilot','2311','Air Transport Professionals',2651,43.14,10,'estimated'),
  ('community-worker','4117','Welfare Support Workers',1844,-0.43,5,'estimated'),
  ('cook','3514','Cooks',1432,-22.68,1,'verified'),
  ('counsellor','2721','Counsellors',2154,16.31,8,'estimated'),
  ('cybersecurity-analyst','2621','Database and Systems Administrators, and ICT Security Specialists',2461,32.88,10,'estimated'),
  ('data-analyst','2241','Actuaries, Mathematicians and Statisticians',2072,11.88,7,'estimated'),
  ('data-engineer','2613','Software and Applications Programmers',2537,36.99,10,'estimated'),
  ('database-administrator','2621','Database and Systems Administrators, and ICT Security Specialists',2461,32.88,10,'estimated'),
  ('deck-officer','2312','Marine Transport Professionals',3365,81.70,10,'estimated'),
  ('early-childhood-teacher','2411','Early Childhood (Pre-primary School) Teachers',1906,2.92,5,'verified'),
  ('electrical-engineer','2333','Electrical Engineers',2553,37.85,10,'estimated'),
  ('environmental-engineer','2339','Other Engineering Professionals',2649,43.03,10,'estimated'),
  ('environmental-scientist','2343','Environmental Scientists',1953,5.45,6,'estimated'),
  ('event-planner','1493','Conference and Event Organisers',1634,-11.77,3,'estimated'),
  ('film-editor','2123','Film, Television, Radio and Stage Directors',1975,6.64,6,'estimated'),
  ('financial-analyst','2211','Accountants',2003,8.15,6,'estimated'),
  ('food-technologist','2342','Chemists, and Food and Wine Scientists',2194,18.47,8,'estimated'),
  ('forestry-technician','3114','Science Technicians',1794,-3.13,5,'estimated'),
  ('graphic-designer','2324','Graphic and Web Designers, and Illustrators',1850,-0.11,5,'estimated'),
  ('hotel-manager','1413','Hotel and Motel Managers',1827,-1.35,5,'verified'),
  ('human-resources-specialist','2231','Human Resource Professionals',1970,6.37,6,'estimated'),
  ('ict-support-technician','3131','ICT Support Technicians',1687,-8.91,4,'estimated'),
  ('industrial-engineer','2335','Industrial, Mechanical and Production Engineers',2614,41.14,10,'estimated'),
  ('interior-designer','2325','Interior Designers',1692,-8.64,4,'estimated'),
  ('logistics-coordinator','5912','Transport and Despatch Clerks',1707,-7.83,4,'estimated'),
  ('manufacturing-engineer','2335','Industrial, Mechanical and Production Engineers',2614,41.14,10,'estimated'),
  ('marine-engineer','2312','Marine Transport Professionals',3365,81.70,10,'estimated'),
  ('marketing-specialist','2251','Advertising and Marketing Professionals',1957,5.67,6,'estimated'),
  ('mechanical-engineer','2335','Industrial, Mechanical and Production Engineers',2614,41.14,10,'estimated'),
  ('medical-laboratory-technician','3112','Medical Technicians',1539,-16.90,2,'estimated'),
  ('multimedia-designer','2324','Graphic and Web Designers, and Illustrators',1850,-0.11,5,'estimated'),
  ('network-administrator','2631','Computer Network Professionals',2309,24.68,9,'estimated'),
  ('pharmacist','2515','Pharmacists',1956,5.62,6,'estimated'),
  ('primary-school-teacher','2412','Primary School Teachers',2226,20.19,9,'verified'),
  ('project-manager','5111','Contract, Program and Project Administrators',2130,15.01,8,'estimated'),
  ('radiographer','2512','Medical Imaging Professionals',2360,27.43,10,'estimated'),
  ('restaurant-manager','1411','Cafe and Restaurant Managers',1644,-11.23,3,'verified'),
  ('secondary-school-teacher','2414','Secondary School Teachers',2322,25.38,10,'verified'),
  ('software-developer','2613','Software and Applications Programmers',2537,36.99,10,'estimated'),
  ('special-education-teacher','2415','Special Education Teachers',2160,16.63,8,'verified'),
  ('supply-chain-analyst','2247','Management and Organisation Analysts',2444,31.97,10,'estimated'),
  ('sustainability-specialist','2343','Environmental Scientists',1953,5.45,6,'estimated'),
  ('tourism-manager','1419','Other Accommodation and Hospitality Managers',1923,3.83,5,'estimated'),
  ('truck-driver','7331','Truck Drivers',1960,5.83,6,'estimated'),
  ('ux-designer','2324','Graphic and Web Designers, and Illustrators',1850,-0.11,5,'estimated'),
  ('warehouse-manager','1336','Supply, Distribution and Procurement Managers',2834,53.02,10,'estimated'),
  ('web-designer','2324','Graphic and Web Designers, and Illustrators',1850,-0.11,5,'estimated'),
  ('youth-worker','4117','Welfare Support Workers',1844,-0.43,5,'estimated')
),
latest as (
  select distinct on (m.profile_key) m.id, m.profile_key, m.salary_component
  from country_occupation_metric_snapshots m
  order by m.profile_key, m.as_of_date desc, m.id desc
),
target as (
  select l.id, pi.*
  from pay_input pi
  join country_occupation_profiles p
    on p.country_code = 'AU'
   and p.canonical_career_id = pi.career_id
  join latest l on l.profile_key = p.profile_key
  where coalesce(l.salary_component, 0) = 0
)
update country_occupation_metric_snapshots m
set median_weekly_earnings = t.weekly_median,
    annualised_median_salary = t.weekly_median * 52,
    all_occupations_median_weekly = 1852,
    salary_component = t.pay_score,
    score_evidence = coalesce(m.score_evidence, '{}'::jsonb) || jsonb_build_object(
      'salary_premium_pct', t.premium_pct,
      'pay_evidence_policy', 'relative_to_all_occupations',
      'pay_evidence_confidence', t.confidence,
      'pay_source_authority', 'Jobs and Skills Australia',
      'pay_source_dataset', 'ABS Survey of Employee Earnings and Hours, May 2025, customised report',
      'pay_source_group_code', t.anzsco_group,
      'pay_source_group_title', t.group_title,
      'pay_source_scope', 'ANZSCO 4-digit occupation group',
      'pay_source_weekly_median', t.weekly_median,
      'pay_benchmark_weekly_median', 1852,
      'pay_source_url', 'https://www.jobsandskills.gov.au/data/occupation-and-industry-profiles/occupations',
      'pay_source_note', 'Uses the closest defensible official ANZSCO 4-digit earnings group where a more specific JSA median is unavailable. Broader-group use lowers confidence but does not make Pay missing.'
    ),
    source_checked_at = date '2026-08-15'
from target t
where m.id = t.id;

-- These three profiles were already decision-ready apart from the Pay evidence
-- interpretation. Refresh the profile review date now that Pay is complete.
update country_occupation_profiles
set source_checked_at = date '2026-08-15'
where country_code = 'AU'
  and canonical_career_id in (
    'medical-laboratory-technician',
    'pharmacist',
    'radiographer'
  )
  and publication_status = 'decision_ready';

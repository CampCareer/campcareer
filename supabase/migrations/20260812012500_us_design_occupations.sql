-- United States Design occupation cohort: 8 canonical careers.
-- Detailed scoring checked 2026-08-12 using BLS May 2025 OEWS, May 2024 OEWS industry/employment baselines,
-- BLS 2024-2034 Employment Projections via CareerOneStop, current NLx snapshots where directly verified,
-- DOL H-1B/PERM boundaries, and NCARB licensure evidence for architects.
--
-- career-opportunity-us-v2 component model for this cohort:
-- shortage (0-20): authoritative nationwide occupation-shortage designation only; none found for these eight.
-- vacancy intensity (0-15): round(clamp((annual projected openings / 2024 EP employment * 100) / 10 * 15, 0, 15)).
-- employer diversity (0-5): BLS top-industry concentration proxy, round(clamp(5 * (1 - top-industry share), 0, 5)).
-- vacancy trend (0-10): transparent recent-labour-momentum proxy, round(clamp(5 + (May-2024-to-May-2025 OEWS employment change %) / 2, 0, 10)); NOT vacancy YoY.
-- entry level (0-15): BLS EP education/training assignment, with documented training/licensure deductions.
-- salary (0-10): round(clamp(((May-2025 median hourly / all-occupation median hourly 24.51) - 0.5) / 1.5 * 10, 0, 10)).
-- growth (0-10): round(clamp(((2024-2034 exact growth %) + 2) / 12 * 10, 0, 10)).
-- visa (0-10): job-specific H-1B specialty-degree fit; no filing-volume premium because occupation-level FY2026 LCA/PERM aggregates were not directly ingested.
-- entry burden (0-5): statutory/licensure/training burden, with 5 meaning no universal statutory personal licence.

insert into public.country_occupation_profiles (
  profile_key,country_code,canonical_career_id,official_title,official_code_system,official_code_version,
  official_unit_group_code,currency,registration_required,registration_authority,registration_url,
  publication_status,source_checked_at,updated_at
) values
  ('US:graphic-designer','US','graphic-designer','Graphic Designers','SOC','SOC 2018','27-1024','USD',false,null,null,'profile_ready','2026-08-12',now()),
  ('US:ux-designer','US','ux-designer','Web and Digital Interface Designers — UX scope','SOC','SOC 2018','15-1255','USD',false,null,null,'profile_ready','2026-08-12',now()),
  ('US:multimedia-designer','US','multimedia-designer','Special Effects Artists and Animators — multimedia design scope','SOC','SOC 2018','27-1014','USD',false,null,null,'profile_ready','2026-08-12',now()),
  ('US:animator','US','animator','Special Effects Artists and Animators — animator scope','SOC','SOC 2018','27-1014','USD',false,null,null,'profile_ready','2026-08-12',now()),
  ('US:interior-designer','US','interior-designer','Interior Designers','SOC','SOC 2018','27-1025','USD',false,null,null,'profile_ready','2026-08-12',now()),
  ('US:film-editor','US','film-editor','Film and Video Editors','SOC','SOC 2018','27-4032','USD',false,null,null,'profile_ready','2026-08-12',now()),
  ('US:architect','US','architect','Architects, Except Landscape and Naval','SOC','SOC 2018','17-1011','USD',true,'State architecture licensing boards (NCARB pathway)','https://www.ncarb.org/architecture-essentials','profile_ready','2026-08-12',now()),
  ('US:web-designer','US','web-designer','Web and Digital Interface Designers — web-design scope','SOC','SOC 2018','15-1255','USD',false,null,null,'profile_ready','2026-08-12',now())
on conflict (profile_key) do update set
  official_title=excluded.official_title,official_code_system=excluded.official_code_system,official_code_version=excluded.official_code_version,
  official_unit_group_code=excluded.official_unit_group_code,currency=excluded.currency,registration_required=excluded.registration_required,
  registration_authority=excluded.registration_authority,registration_url=excluded.registration_url,publication_status=excluded.publication_status,
  source_checked_at=excluded.source_checked_at,updated_at=now();

insert into public.country_occupation_metric_snapshots (
  profile_key,as_of_date,employment_total,median_hourly_earnings,annualised_median_salary,employment_growth_10y_pct,
  shortage_component,vacancy_intensity_component,employer_diversity_component,vacancy_trend_component,
  entry_level_component,salary_component,growth_component,visa_component,entry_burden_component,
  opportunity_score,score_methodology_version,score_status,score_evidence,source_checked_at
) values
  ('US:graphic-designer','2026-08-12',197830,30.27,62962,2.11,
    0,11,4,1,9,5,3,4,5,42,'career-opportunity-us-v2','provisional',jsonb_build_object(
      'classification_scope','SOC 2018 27-1024 Graphic Designers.',
      'oews_reference','BLS May 2025 OEWS; wage-and-salary workers, self-employed excluded.',
      'employment_2025_oews',197830,'employment_2024_oews',214260,'oews_employment_momentum_pct',-7.67,
      'recent_momentum_note','Used only as a recent employment-stock momentum proxy for the vacancy_trend component; it is not a historical vacancy YoY series.',
      'ep_employment_2024',265900,'ep_employment_2034',271500,'annual_projected_openings',20000,'annual_openings_intensity_pct',7.52,
      'vacancy_intensity_formula','round(clamp(openings_intensity_pct / 10 * 15, 0, 15))','vacancy_intensity_score',11,
      'live_nlx_postings',8947,'live_nlx_checked_at','2026-08-12','live_nlx_posting_intensity_pct',4.52,
      'live_nlx_note','Current CareerOneStop/NLx point-in-time postings are corroborating evidence, not a three-month vacancy average and are not double-counted in the component.',
      'top_industry','Specialized Design Services','top_industry_employment_2024',25220,'top_industry_share_pct',11.77,
      'employer_diversity_proxy_note','BLS top-industry employment concentration is used as a transparent industry-diversity proxy because posting-level unique-employer counts were not consistently available across all Design SOCs.',
      'employer_diversity_formula','round(clamp(5 * (1 - top_industry_share), 0, 5))','employer_diversity_score',4,
      'all_occupations_median_hourly_2025',24.51,'median_hourly_2025',30.27,'salary_ratio_to_all_occupations_median',1.235,
      'salary_formula','round(clamp(((occupation_median_hourly / 24.51) - 0.5) / 1.5 * 10, 0, 10))','salary_score',5,
      'growth_exact_pct',2.11,'growth_formula','round(clamp((growth_pct + 2) / 12 * 10, 0, 10))','growth_score',3,
      'entry_level_basis','BLS EP/CareerOneStop: bachelor degree, no related work experience, no formal OJT; 9/15. Portfolio requirements are not nationally standardized and are not converted into a hidden deduction.',
      'shortage_basis','No authoritative federal Graphic Designer shortage designation was found; BLS openings and NLx postings are demand evidence, not shortage status.',
      'visa_basis','H-1B/PERM remains job and filing specific; bachelor-level design positions can qualify only when the actual duties require a specific specialty. No occupation-level FY2026 filing-volume premium is added; 4/10.',
      'entry_burden_basis','No universal personal occupational licence; 5/5.'
    ),'2026-08-12'),
  ('US:ux-designer','2026-08-12',113330,50.00,104000,6.98,
    0,11,4,6,9,10,7,5,5,57,'career-opportunity-us-v2','provisional',jsonb_build_object(
      'classification_scope','UX/user-experience, usability, interaction and HCI scope within SOC 2018 15-1255 Web and Digital Interface Designers; shared national series with Web Designer.',
      'shared_soc_note','UX Designer and Web Designer intentionally share employment, pay, projection, industry and posting data because BLS does not publish separate UX-only national statistics.',
      'oews_reference','BLS May 2025 OEWS; wage-and-salary workers, self-employed excluded.',
      'employment_2025_oews',113330,'employment_2024_oews',111400,'oews_employment_momentum_pct',1.73,
      'recent_momentum_note','Employment-stock momentum proxy, not vacancy YoY.','ep_employment_2024',128900,'ep_employment_2034',137900,
      'annual_projected_openings',9100,'annual_openings_intensity_pct',7.06,'vacancy_intensity_formula','round(clamp(openings_intensity_pct / 10 * 15, 0, 15))','vacancy_intensity_score',11,
      'live_nlx_postings',3710,'live_nlx_checked_at','2026-08-12','live_nlx_posting_intensity_pct',3.27,
      'live_nlx_note','Shared 15-1255 NLx snapshot includes UX/UI and web/interface roles; corroborating only and not double-counted.',
      'top_industry','Computer Systems Design and Related Services','top_industry_employment_2024',15240,'top_industry_share_pct',13.68,
      'employer_diversity_proxy_note','Top-industry concentration proxy; not a unique-employer count.','employer_diversity_formula','round(clamp(5 * (1 - top_industry_share), 0, 5))','employer_diversity_score',4,
      'all_occupations_median_hourly_2025',24.51,'median_hourly_2025',50.00,'salary_ratio_to_all_occupations_median',2.040,
      'salary_formula','round(clamp(((occupation_median_hourly / 24.51) - 0.5) / 1.5 * 10, 0, 10))','salary_score',10,
      'growth_exact_pct',6.98,'growth_formula','round(clamp((growth_pct + 2) / 12 * 10, 0, 10))','growth_score',7,
      'entry_level_basis','BLS EP/CareerOneStop 15-1255: bachelor degree, no related work experience, no formal OJT; 9/15.',
      'shortage_basis','No authoritative federal UX Designer shortage designation; Bright Outlook/growth/postings are kept as demand evidence.',
      'visa_basis','Degree-specific HCI, interaction-design, informatics or related positions may fit H-1B when the actual job establishes a specific-specialty requirement; no title-only presumption or filing-volume premium; 5/10.',
      'entry_burden_basis','No universal statutory licence; 5/5.'
    ),'2026-08-12'),
  ('US:multimedia-designer','2026-08-12',19970,49.06,102045,1.58,
    0,13,4,2,9,10,3,4,5,50,'career-opportunity-us-v2','provisional',jsonb_build_object(
      'classification_scope','Motion, digital-effects and multimedia design scope within SOC 2018 27-1014 Special Effects Artists and Animators; shared national series with Animator.',
      'shared_soc_note','Multimedia Designer and Animator intentionally share national labor metrics; no separate multimedia-only BLS series is claimed.',
      'employment_2025_oews',19970,'employment_2024_oews',21280,'oews_employment_momentum_pct',-6.16,'recent_momentum_note','Employment-stock momentum proxy, not vacancy YoY.',
      'ep_employment_2024',57100,'ep_employment_2034',58000,'annual_projected_openings',5000,'annual_openings_intensity_pct',8.76,'vacancy_intensity_formula','round(clamp(openings_intensity_pct / 10 * 15, 0, 15))','vacancy_intensity_score',13,
      'live_nlx_postings',419,'live_nlx_checked_at','2026-08-12','live_nlx_posting_intensity_pct',2.10,'live_nlx_note','Shared 27-1014 NLx point-in-time snapshot; corroborating only.',
      'top_industry','Motion Picture and Video Industries','top_industry_employment_2024',6090,'top_industry_share_pct',28.62,'employer_diversity_proxy_note','Top-industry concentration proxy; not a unique-employer count.','employer_diversity_score',4,
      'all_occupations_median_hourly_2025',24.51,'median_hourly_2025',49.06,'salary_ratio_to_all_occupations_median',2.002,'salary_score',10,
      'growth_exact_pct',1.58,'growth_score',3,'entry_level_basis','BLS EP/CareerOneStop 27-1014: bachelor degree, no related work experience, no formal OJT; 9/15.',
      'shortage_basis','No authoritative federal multimedia-design shortage designation; replacement openings and postings do not create shortage status.',
      'visa_basis','Creative-technology positions may qualify for H-1B only where a specific-specialty degree relationship is actually required; no filing-volume premium; 4/10.','entry_burden_basis','No universal occupational licence; 5/5.'
    ),'2026-08-12'),
  ('US:animator','2026-08-12',19970,49.06,102045,1.58,
    0,13,4,2,9,10,3,4,5,50,'career-opportunity-us-v2','provisional',jsonb_build_object(
      'classification_scope','Animator scope within SOC 2018 27-1014 Special Effects Artists and Animators; shared national series with Multimedia Designer.',
      'shared_soc_note','Animator and Multimedia Designer intentionally share national labor metrics rather than receiving invented separate counts.',
      'employment_2025_oews',19970,'employment_2024_oews',21280,'oews_employment_momentum_pct',-6.16,'recent_momentum_note','Employment-stock momentum proxy, not vacancy YoY.',
      'ep_employment_2024',57100,'ep_employment_2034',58000,'annual_projected_openings',5000,'annual_openings_intensity_pct',8.76,'vacancy_intensity_score',13,
      'live_nlx_postings',419,'live_nlx_checked_at','2026-08-12','live_nlx_posting_intensity_pct',2.10,'live_nlx_note','Shared 27-1014 NLx point-in-time snapshot; corroborating only.',
      'top_industry','Motion Picture and Video Industries','top_industry_employment_2024',6090,'top_industry_share_pct',28.62,'employer_diversity_proxy_note','Top-industry concentration proxy; not a unique-employer count.','employer_diversity_score',4,
      'all_occupations_median_hourly_2025',24.51,'median_hourly_2025',49.06,'salary_ratio_to_all_occupations_median',2.002,'salary_score',10,
      'growth_exact_pct',1.58,'growth_score',3,'entry_level_basis','BLS EP/CareerOneStop: bachelor degree, no related work experience, no formal OJT; 9/15. Portfolio/reel is acknowledged editorially but has no standardized national numeric deduction.',
      'shortage_basis','No authoritative federal Animator shortage designation.','visa_basis','Degree-specific animation/VFX positions may qualify only where the actual role meets specialty-occupation requirements; no filing-volume premium; 4/10.','entry_burden_basis','No universal occupational licence; 5/5.'
    ),'2026-08-12'),
  ('US:interior-designer','2026-08-12',71500,32.31,67205,3.21,
    0,13,3,6,9,5,4,4,3,47,'career-opportunity-us-v2','provisional',jsonb_build_object(
      'classification_scope','SOC 2018 27-1025 Interior Designers.',
      'employment_2025_oews',71500,'employment_2024_oews',69580,'oews_employment_momentum_pct',2.76,'recent_momentum_note','Employment-stock momentum proxy, not vacancy YoY.',
      'ep_employment_2024',87100,'ep_employment_2034',89900,'annual_projected_openings',7800,'annual_openings_intensity_pct',8.96,'vacancy_intensity_score',13,
      'live_nlx_postings',null,'live_nlx_note','No directly verified comparable national NLx snapshot was ingested for this scoring date; no posting count is invented.',
      'top_industry','Specialized Design Services','top_industry_employment_2024',29610,'top_industry_share_pct',42.56,'employer_diversity_proxy_note','Top-industry concentration proxy; not a unique-employer count.','employer_diversity_score',3,
      'all_occupations_median_hourly_2025',24.51,'median_hourly_2025',32.31,'salary_ratio_to_all_occupations_median',1.318,'salary_score',5,
      'growth_exact_pct',3.21,'growth_score',4,'entry_level_basis','BLS EP/CareerOneStop: bachelor degree, no related work experience, no formal OJT; 9/15.',
      'shortage_basis','No authoritative federal Interior Designer shortage designation.',
      'visa_basis','Degree-specific interior-design positions can qualify only when the actual role requires a specific specialty; no filing-volume premium; 4/10.',
      'entry_burden_basis','Interior-design licensing/title regulation exists in some jurisdictions rather than universally nationwide; partial burden 3/5.'
    ),'2026-08-12'),
  ('US:film-editor','2026-08-12',25610,36.26,75421,3.91,
    0,12,3,0,9,7,5,4,5,45,'career-opportunity-us-v2','provisional',jsonb_build_object(
      'classification_scope','SOC 2018 27-4032 Film and Video Editors.',
      'employment_2025_oews',25610,'employment_2024_oews',28860,'oews_employment_momentum_pct',-11.26,'recent_momentum_note','Employment-stock momentum proxy, not vacancy YoY; formula floors the component at zero.',
      'ep_employment_2024',43500,'ep_employment_2034',45200,'annual_projected_openings',3600,'annual_openings_intensity_pct',8.28,'vacancy_intensity_score',12,
      'live_nlx_postings',null,'live_nlx_note','No directly verified comparable national NLx count was ingested; no value is fabricated.',
      'top_industry','Motion Picture and Video Industries','top_industry_employment_2024',13760,'top_industry_share_pct',47.68,'employer_diversity_proxy_note','Top-industry concentration proxy; not a unique-employer count.','employer_diversity_score',3,
      'all_occupations_median_hourly_2025',24.51,'median_hourly_2025',36.26,'salary_ratio_to_all_occupations_median',1.479,'salary_score',7,
      'growth_exact_pct',3.91,'growth_score',5,'entry_level_basis','BLS EP/CareerOneStop: bachelor degree, no related work experience, no formal OJT; 9/15.',
      'shortage_basis','No authoritative federal Film/Video Editor shortage designation.',
      'visa_basis','Degree-specific film/post-production roles may qualify only when the specific-specialty relationship is established; no filing-volume premium; 4/10.','entry_burden_basis','No universal national professional registration; 5/5.',
      'coverage_note','OEWS excludes self-employed workers, which matters for freelance creative work.'
    ),'2026-08-12'),
  ('US:architect','2026-08-12',106770,47.73,99278,3.88,
    0,9,1,3,4,10,5,7,1,40,'career-opportunity-us-v2','provisional',jsonb_build_object(
      'classification_scope','SOC 2018 17-1011 Architects, Except Landscape and Naval.',
      'employment_2025_oews',106770,'employment_2024_oews',111140,'oews_employment_momentum_pct',-3.93,'recent_momentum_note','Employment-stock momentum proxy, not vacancy YoY.',
      'ep_employment_2024',123600,'ep_employment_2034',128400,'annual_projected_openings',7800,'annual_openings_intensity_pct',6.31,'vacancy_intensity_score',9,
      'live_nlx_postings',null,'live_nlx_note','No directly verified comparable national NLx count was ingested; no value is fabricated.',
      'top_industry','Architectural, Engineering, and Related Services','top_industry_employment_2024',95290,'top_industry_share_pct',85.74,'employer_diversity_proxy_note','Top-industry concentration proxy; very high concentration materially lowers the component.','employer_diversity_score',1,
      'all_occupations_median_hourly_2025',24.51,'median_hourly_2025',47.73,'salary_ratio_to_all_occupations_median',1.947,'salary_score',10,
      'growth_exact_pct',3.88,'growth_score',5,
      'entry_level_basis','BLS: bachelor-level education plus internship/residency; all states and DC require licensure for architects. Base bachelor accessibility is reduced for mandatory experience/exam path; 4/15.',
      'licensure_detail','NCARB AXP requires 3,740 documented hours across six experience areas; licensure also requires examination and jurisdiction-specific requirements.',
      'shortage_basis','No authoritative federal Architect shortage designation.',
      'visa_basis','Architecture-specific professional positions have stronger specific-specialty fit than broadly defined creative roles, but H-1B/PERM still depends on the actual filing and required credentials; 7/10.',
      'entry_burden_basis','Nationwide state/DC licensure boundary plus documented experience and examination produces high burden; 1/5.'
    ),'2026-08-12'),
  ('US:web-designer','2026-08-12',113330,50.00,104000,6.98,
    0,11,4,6,9,10,7,5,5,57,'career-opportunity-us-v2','provisional',jsonb_build_object(
      'classification_scope','Website/interface visual design, navigation, accessibility and interaction scope within SOC 2018 15-1255 Web and Digital Interface Designers; shared national series with UX Designer.',
      'shared_soc_note','Web Designer and UX Designer intentionally share national labor metrics; no separate BLS Web-versus-UX series is claimed.',
      'employment_2025_oews',113330,'employment_2024_oews',111400,'oews_employment_momentum_pct',1.73,'recent_momentum_note','Employment-stock momentum proxy, not vacancy YoY.',
      'ep_employment_2024',128900,'ep_employment_2034',137900,'annual_projected_openings',9100,'annual_openings_intensity_pct',7.06,'vacancy_intensity_score',11,
      'live_nlx_postings',3710,'live_nlx_checked_at','2026-08-12','live_nlx_posting_intensity_pct',3.27,'live_nlx_note','Shared 15-1255 point-in-time NLx snapshot; corroborating only.',
      'top_industry','Computer Systems Design and Related Services','top_industry_employment_2024',15240,'top_industry_share_pct',13.68,'employer_diversity_proxy_note','Top-industry concentration proxy; not a unique-employer count.','employer_diversity_score',4,
      'all_occupations_median_hourly_2025',24.51,'median_hourly_2025',50.00,'salary_ratio_to_all_occupations_median',2.040,'salary_score',10,
      'growth_exact_pct',6.98,'growth_score',7,'entry_level_basis','BLS EP/CareerOneStop 15-1255: bachelor degree, no related work experience, no formal OJT; 9/15.',
      'shortage_basis','No authoritative federal Web Designer shortage designation; growth/postings remain demand evidence.',
      'visa_basis','Degree-specific digital-interface positions may fit H-1B where the actual duties require a specific specialty; no title-only presumption or filing-volume premium; 5/10.','entry_burden_basis','No universal statutory licence; 5/5.'
    ),'2026-08-12')
on conflict (profile_key,as_of_date) do update set
  employment_total=excluded.employment_total,median_hourly_earnings=excluded.median_hourly_earnings,annualised_median_salary=excluded.annualised_median_salary,
  employment_growth_10y_pct=excluded.employment_growth_10y_pct,shortage_component=excluded.shortage_component,vacancy_intensity_component=excluded.vacancy_intensity_component,
  employer_diversity_component=excluded.employer_diversity_component,vacancy_trend_component=excluded.vacancy_trend_component,entry_level_component=excluded.entry_level_component,
  salary_component=excluded.salary_component,growth_component=excluded.growth_component,visa_component=excluded.visa_component,entry_burden_component=excluded.entry_burden_component,
  opportunity_score=excluded.opportunity_score,score_methodology_version=excluded.score_methodology_version,score_status=excluded.score_status,
  score_evidence=excluded.score_evidence,source_checked_at=excluded.source_checked_at;

delete from public.country_occupation_specialisations where profile_key in (
  'US:graphic-designer','US:ux-designer','US:multimedia-designer','US:animator','US:interior-designer','US:film-editor','US:architect','US:web-designer'
);
insert into public.country_occupation_specialisations (
  profile_key,official_code,official_title,shortage_rating,visa_eligible,included_in_rollup,sort_order,source_url,source_checked_at
) values
  ('US:graphic-designer','27-1024','Graphic Designers',null,true,true,1,'https://www.bls.gov/oes/2025/may/oes271024.htm','2026-08-12'),
  ('US:ux-designer','15-1255','Web and Digital Interface Designers — UX scope',null,true,true,1,'https://www.bls.gov/oes/2025/may/oes151255.htm','2026-08-12'),
  ('US:multimedia-designer','27-1014','Special Effects Artists and Animators — multimedia design scope',null,true,true,1,'https://www.bls.gov/oes/2025/may/oes271014.htm','2026-08-12'),
  ('US:animator','27-1014','Special Effects Artists and Animators — animator scope',null,true,true,1,'https://www.bls.gov/oes/2025/may/oes271014.htm','2026-08-12'),
  ('US:interior-designer','27-1025','Interior Designers',null,true,true,1,'https://www.bls.gov/oes/2025/may/oes271025.htm','2026-08-12'),
  ('US:film-editor','27-4032','Film and Video Editors',null,true,true,1,'https://www.bls.gov/oes/2025/may/oes274032.htm','2026-08-12'),
  ('US:architect','17-1011','Architects, Except Landscape and Naval',null,true,true,1,'https://www.bls.gov/oes/2025/may/oes171011.htm','2026-08-12'),
  ('US:web-designer','15-1255','Web and Digital Interface Designers — web-design scope',null,true,true,1,'https://www.bls.gov/oes/2025/may/oes151255.htm','2026-08-12');

-- Replace only this cohort's source and current-job-search evidence.
delete from public.country_occupation_links where profile_key in (
  'US:graphic-designer','US:ux-designer','US:multimedia-designer','US:animator','US:interior-designer','US:film-editor','US:architect','US:web-designer'
) and link_type in ('source','job_search');

insert into public.country_occupation_links (profile_key,link_type,label,url,provider_type,sort_order,source_checked_at) values
  ('US:graphic-designer','source','BLS May 2025 OEWS — Graphic Designers','https://www.bls.gov/oes/2025/may/oes271024.htm','official',1,'2026-08-12'),
  ('US:graphic-designer','source','CareerOneStop — projections, education and wage distribution','https://www.careeronestop.org/Toolkit/Careers/Occupations/occupation-profile.aspx?keyword=Graphic%20Designers&onetcode=27102400','official',2,'2026-08-12'),
  ('US:graphic-designer','source','BLS May 2024 occupation-by-industry employment chart','https://www.bls.gov/oes/2024/may/occ_ind_emp_chart/occ_ind_emp_chart_data.htm','official',3,'2026-08-12'),
  ('US:graphic-designer','source','DOL H-1B specialty occupation program','https://www.dol.gov/agencies/eta/foreign-labor/programs/h-1b','official',4,'2026-08-12'),
  ('US:graphic-designer','source','DOL permanent labor certification (PERM)','https://www.dol.gov/agencies/eta/foreign-labor/programs/permanent','official',5,'2026-08-12'),
  ('US:graphic-designer','job_search','CareerOneStop/NLx current Graphic Designer postings — 8,947 at check','https://cloudfront.careeronestop.org/JusticeImpacted/Toolkit/find-jobs-results.aspx?keyword=Graphic+Designers&location=UNITED+STATES&onetcode=27-1024.00&radius=25','official-nlx',20,'2026-08-12'),

  ('US:ux-designer','source','BLS May 2025 OEWS — Web and Digital Interface Designers','https://www.bls.gov/oes/2025/may/oes151255.htm','official',1,'2026-08-12'),
  ('US:ux-designer','source','CareerOneStop — shared 15-1255 projections and education','https://www.careeronestop.org/Toolkit/Careers/Occupations/occupation-profile.aspx?keyword=Web%20and%20Digital%20Interface%20Designers&onetcode=15125500','official',2,'2026-08-12'),
  ('US:ux-designer','source','BLS May 2024 occupation-by-industry employment chart','https://www.bls.gov/oes/2024/may/occ_ind_emp_chart/occ_ind_emp_chart_data.htm','official',3,'2026-08-12'),
  ('US:ux-designer','source','DOL H-1B specialty occupation program','https://www.dol.gov/agencies/eta/foreign-labor/programs/h-1b','official',4,'2026-08-12'),
  ('US:ux-designer','source','DOL permanent labor certification (PERM)','https://www.dol.gov/agencies/eta/foreign-labor/programs/permanent','official',5,'2026-08-12'),
  ('US:ux-designer','job_search','CareerOneStop/NLx current shared 15-1255 postings — 3,710 at check','https://cloudfront.careeronestop.org/JusticeImpacted/Toolkit/find-jobs-results.aspx?keyword=Web+and+Digital+Interface+Designers&location=UNITED+STATES&onetcode=15-1255.00&radius=25','official-nlx',20,'2026-08-12'),

  ('US:multimedia-designer','source','BLS May 2025 OEWS — Special Effects Artists and Animators','https://www.bls.gov/oes/2025/may/oes271014.htm','official',1,'2026-08-12'),
  ('US:multimedia-designer','source','CareerOneStop — shared 27-1014 projections and education','https://www.careeronestop.org/Toolkit/Careers/Occupations/occupation-profile.aspx?keyword=Special%20Effects%20Artists%20and%20Animators&onetcode=27101400','official',2,'2026-08-12'),
  ('US:multimedia-designer','source','BLS May 2024 occupation-by-industry employment chart','https://www.bls.gov/oes/2024/may/occ_ind_emp_chart/occ_ind_emp_chart_data.htm','official',3,'2026-08-12'),
  ('US:multimedia-designer','source','DOL H-1B specialty occupation program','https://www.dol.gov/agencies/eta/foreign-labor/programs/h-1b','official',4,'2026-08-12'),
  ('US:multimedia-designer','source','DOL permanent labor certification (PERM)','https://www.dol.gov/agencies/eta/foreign-labor/programs/permanent','official',5,'2026-08-12'),
  ('US:multimedia-designer','job_search','CareerOneStop/NLx current shared 27-1014 postings — 419 at check','https://cloudfront.careeronestop.org/JusticeImpacted/Toolkit/find-jobs-results.aspx?keyword=Special+Effects+Artists+and+Animators&location=UNITED+STATES&onetcode=27-1014.00&radius=25','official-nlx',20,'2026-08-12'),

  ('US:animator','source','BLS May 2025 OEWS — Special Effects Artists and Animators','https://www.bls.gov/oes/2025/may/oes271014.htm','official',1,'2026-08-12'),
  ('US:animator','source','CareerOneStop — shared 27-1014 projections and education','https://www.careeronestop.org/Toolkit/Careers/Occupations/occupation-profile.aspx?keyword=Special%20Effects%20Artists%20and%20Animators&onetcode=27101400','official',2,'2026-08-12'),
  ('US:animator','source','BLS May 2024 occupation-by-industry employment chart','https://www.bls.gov/oes/2024/may/occ_ind_emp_chart/occ_ind_emp_chart_data.htm','official',3,'2026-08-12'),
  ('US:animator','source','DOL H-1B specialty occupation program','https://www.dol.gov/agencies/eta/foreign-labor/programs/h-1b','official',4,'2026-08-12'),
  ('US:animator','source','DOL permanent labor certification (PERM)','https://www.dol.gov/agencies/eta/foreign-labor/programs/permanent','official',5,'2026-08-12'),
  ('US:animator','job_search','CareerOneStop/NLx current shared 27-1014 postings — 419 at check','https://cloudfront.careeronestop.org/JusticeImpacted/Toolkit/find-jobs-results.aspx?keyword=Special+Effects+Artists+and+Animators&location=UNITED+STATES&onetcode=27-1014.00&radius=25','official-nlx',20,'2026-08-12'),

  ('US:interior-designer','source','BLS May 2025 OEWS — Interior Designers','https://www.bls.gov/oes/2025/may/oes271025.htm','official',1,'2026-08-12'),
  ('US:interior-designer','source','CareerOneStop — projections, education and jurisdictional license context','https://www.careeronestop.org/Toolkit/Careers/Occupations/occupation-profile.aspx?keyword=Interior%20Designers&onetcode=27102500','official',2,'2026-08-12'),
  ('US:interior-designer','source','BLS May 2024 occupation-by-industry employment chart','https://www.bls.gov/oes/2024/may/occ_ind_emp_chart/occ_ind_emp_chart_data.htm','official',3,'2026-08-12'),
  ('US:interior-designer','source','DOL H-1B specialty occupation program','https://www.dol.gov/agencies/eta/foreign-labor/programs/h-1b','official',4,'2026-08-12'),
  ('US:interior-designer','source','DOL permanent labor certification (PERM)','https://www.dol.gov/agencies/eta/foreign-labor/programs/permanent','official',5,'2026-08-12'),

  ('US:film-editor','source','BLS May 2025 OEWS — Film and Video Editors','https://www.bls.gov/oes/2025/may/oes274032.htm','official',1,'2026-08-12'),
  ('US:film-editor','source','CareerOneStop — 2024-2034 projection, education and wage distribution','https://www.careeronestop.org/Toolkit/Careers/Occupations/occupation-profile.aspx?keyword=Film%20and%20Video%20Editors&onetcode=27403200','official',2,'2026-08-12'),
  ('US:film-editor','source','BLS May 2024 occupation-by-industry employment chart','https://www.bls.gov/oes/2024/may/occ_ind_emp_chart/occ_ind_emp_chart_data.htm','official',3,'2026-08-12'),
  ('US:film-editor','source','DOL H-1B specialty occupation program','https://www.dol.gov/agencies/eta/foreign-labor/programs/h-1b','official',4,'2026-08-12'),
  ('US:film-editor','source','DOL permanent labor certification (PERM)','https://www.dol.gov/agencies/eta/foreign-labor/programs/permanent','official',5,'2026-08-12'),

  ('US:architect','source','BLS May 2025 OEWS — Architects, Except Landscape and Naval','https://www.bls.gov/oes/2025/may/oes171011.htm','official',1,'2026-08-12'),
  ('US:architect','source','BLS Occupational Outlook Handbook — Architect pathway and openings','https://www.bls.gov/ooh/architecture-and-engineering/architects.htm','official',2,'2026-08-12'),
  ('US:architect','source','BLS May 2024 occupation-by-industry employment chart','https://www.bls.gov/oes/2024/may/occ_ind_emp_chart/occ_ind_emp_chart_data.htm','official',3,'2026-08-12'),
  ('US:architect','source','DOL H-1B specialty occupation program','https://www.dol.gov/agencies/eta/foreign-labor/programs/h-1b','official',4,'2026-08-12'),
  ('US:architect','source','DOL permanent labor certification (PERM)','https://www.dol.gov/agencies/eta/foreign-labor/programs/permanent','official',5,'2026-08-12'),
  ('US:architect','source','NCARB Architecture Essentials — licensure framework','https://www.ncarb.org/architecture-essentials','official-professional-regulator-network',6,'2026-08-12'),
  ('US:architect','source','NCARB AXP experience requirements — 3,740 hours','https://www.ncarb.org/gain-axp-experience/experience-requirements','official-professional-regulator-network',7,'2026-08-12'),

  ('US:web-designer','source','BLS May 2025 OEWS — Web and Digital Interface Designers','https://www.bls.gov/oes/2025/may/oes151255.htm','official',1,'2026-08-12'),
  ('US:web-designer','source','CareerOneStop — shared 15-1255 projections and education','https://www.careeronestop.org/Toolkit/Careers/Occupations/occupation-profile.aspx?keyword=Web%20and%20Digital%20Interface%20Designers&onetcode=15125500','official',2,'2026-08-12'),
  ('US:web-designer','source','BLS May 2024 occupation-by-industry employment chart','https://www.bls.gov/oes/2024/may/occ_ind_emp_chart/occ_ind_emp_chart_data.htm','official',3,'2026-08-12'),
  ('US:web-designer','source','DOL H-1B specialty occupation program','https://www.dol.gov/agencies/eta/foreign-labor/programs/h-1b','official',4,'2026-08-12'),
  ('US:web-designer','source','DOL permanent labor certification (PERM)','https://www.dol.gov/agencies/eta/foreign-labor/programs/permanent','official',5,'2026-08-12'),
  ('US:web-designer','job_search','CareerOneStop/NLx current shared 15-1255 postings — 3,710 at check','https://cloudfront.careeronestop.org/JusticeImpacted/Toolkit/find-jobs-results.aspx?keyword=Web+and+Digital+Interface+Designers&location=UNITED+STATES&onetcode=15-1255.00&radius=25','official-nlx',20,'2026-08-12');

-- Publish only programme relations that were already reviewed/approved in US staging and verified Tier A.
delete from public.country_occupation_program_links where profile_key in (
  'US:graphic-designer','US:ux-designer','US:multimedia-designer','US:animator','US:interior-designer','US:film-editor','US:architect','US:web-designer'
);
insert into public.country_occupation_program_links (profile_key,program_ref,relation_type,source_checked_at) values
  ('US:animator','nyu-bs-integrated-design-media','related','2026-08-12'),
  ('US:architect','cornell-barch-architecture','direct','2026-08-12'),
  ('US:interior-designer','utaustin-bsid-interior-design','direct','2026-08-12'),
  ('US:multimedia-designer','nyu-bs-integrated-design-media','direct','2026-08-12'),
  ('US:ux-designer','nyu-bs-integrated-design-media','related','2026-08-12'),
  ('US:ux-designer','uw-bs-informatics','related','2026-08-12'),
  ('US:ux-designer','wisc-ba-information-science','related','2026-08-12'),
  ('US:web-designer','nyu-bs-computer-science','related','2026-08-12'),
  ('US:web-designer','nyu-bs-integrated-design-media','related','2026-08-12')
on conflict (profile_key,program_ref) do update set relation_type=excluded.relation_type,source_checked_at=excluded.source_checked_at;

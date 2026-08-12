update public.country_occupation_specialisations
set source_url='https://enterprise.gov.ie/en/what-we-do/workplace-and-skills/employment-permits/employment-permit-eligibility/classification-of-employments/',
    source_checked_at='2026-08-10'
where profile_key='IE:database-administrator'
  and official_code='3131';

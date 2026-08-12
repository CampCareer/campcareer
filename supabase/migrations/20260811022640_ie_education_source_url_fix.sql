update public.country_occupation_links
set url='https://enterprise.gov.ie/en/what-we-do/workplace-and-skills/employment-permits/employment-permit-eligibility/classification-of-employments/',
    source_checked_at='2026-08-11'
where profile_key='IE:primary-school-teacher'
  and link_type='source'
  and label='DETE — employment-permit occupation classification'
  and url='https://enterprise.gov.ie/en/what-we-do/workplace-and-skills/employment-permit-eligibility/classification-of-employments/';

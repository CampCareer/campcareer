-- Grant SELECT to anon and authenticated roles for all public schema tables.
-- RLS policies further restrict access on user-owned tables.

grant select on all tables in schema public to anon, authenticated;
alter default privileges in schema public grant select on tables to anon, authenticated;

do $$
begin
  -- occupations
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='occupations_au' and policyname='Public can read occupations_au') then
    create policy "Public can read occupations_au" on public.occupations_au for select to anon, authenticated using (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='occupations_ca' and policyname='Public can read occupations_ca') then
    create policy "Public can read occupations_ca" on public.occupations_ca for select to anon, authenticated using (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='occupations_uk' and policyname='Public can read occupations_uk') then
    create policy "Public can read occupations_uk" on public.occupations_uk for select to anon, authenticated using (true);
  end if;

  -- occupation state
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='occupation_state_au' and policyname='Public can read occupation_state_au') then
    create policy "Public can read occupation_state_au" on public.occupation_state_au for select to anon, authenticated using (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='occupation_state_ca' and policyname='Public can read occupation_state_ca') then
    create policy "Public can read occupation_state_ca" on public.occupation_state_ca for select to anon, authenticated using (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='occupation_state_uk' and policyname='Public can read occupation_state_uk') then
    create policy "Public can read occupation_state_uk" on public.occupation_state_uk for select to anon, authenticated using (true);
  end if;

  -- courses
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='courses_ie' and policyname='Public can read courses_ie') then
    create policy "Public can read courses_ie" on public.courses_ie for select to anon, authenticated using (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='courses_au' and policyname='Public can read courses_au') then
    create policy "Public can read courses_au" on public.courses_au for select to anon, authenticated using (true);
  end if;

  -- colleges
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='colleges_au' and policyname='Public can read colleges_au') then
    create policy "Public can read colleges_au" on public.colleges_au for select to anon, authenticated using (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='colleges_ca' and policyname='Public can read colleges_ca') then
    create policy "Public can read colleges_ca" on public.colleges_ca for select to anon, authenticated using (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='colleges_uk' and policyname='Public can read colleges_uk') then
    create policy "Public can read colleges_uk" on public.colleges_uk for select to anon, authenticated using (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='colleges_nl' and policyname='Public can read colleges_nl') then
    create policy "Public can read colleges_nl" on public.colleges_nl for select to anon, authenticated using (true);
  end if;

  -- cities
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='cities_ca' and policyname='Public can read cities_ca') then
    create policy "Public can read cities_ca" on public.cities_ca for select to anon, authenticated using (true);
  end if;

  -- majors
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='majors' and policyname='Public can read majors') then
    create policy "Public can read majors" on public.majors for select to anon, authenticated using (true);
  end if;

  -- language schools
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='language_schools_ie' and policyname='Public can read language_schools_ie') then
    create policy "Public can read language_schools_ie" on public.language_schools_ie for select to anon, authenticated using (true);
  end if;

  -- pr pathways
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='country_pr_pathways' and policyname='Public can read country_pr_pathways') then
    create policy "Public can read country_pr_pathways" on public.country_pr_pathways for select to anon, authenticated using (true);
  end if;

  -- roi explorer views
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='roi_explorer_au' and policyname='Public can read roi_explorer_au') then
    create policy "Public can read roi_explorer_au" on public.roi_explorer_au for select to anon, authenticated using (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='roi_explorer_us' and policyname='Public can read roi_explorer_us') then
    create policy "Public can read roi_explorer_us" on public.roi_explorer_us for select to anon, authenticated using (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='roi_explorer_ca' and policyname='Public can read roi_explorer_ca') then
    create policy "Public can read roi_explorer_ca" on public.roi_explorer_ca for select to anon, authenticated using (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='roi_explorer_nl' and policyname='Public can read roi_explorer_nl') then
    create policy "Public can read roi_explorer_nl" on public.roi_explorer_nl for select to anon, authenticated using (true);
  end if;
end$$;

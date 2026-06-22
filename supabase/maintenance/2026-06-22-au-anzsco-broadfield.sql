-- Backfill occupations_au.related_broad_field for DEGREE-pathway occupations
-- (ANZSCO major group 1=Managers, 2=Professionals) that were NULL.
-- Field = ASCED Broad Field of Education, matching courses_au.broad_field exactly,
-- assigned by occupation-name keyword with a 2-digit sub-major-group fallback.
-- Reversible: only touches rows that are currently NULL. VET occupations
-- (major 3-8) are intentionally left NULL so trade roles don't surface degrees.
-- See plan: maps-graceful-rossum.md. Source build: scripts dry-run 2026-06-22.


UPDATE occupations_au SET related_broad_field = '01 - Natural and Physical Sciences'
WHERE related_broad_field IS NULL AND anzsco_code IN (
  '244232',
  '244531',
  '244532'
);

UPDATE occupations_au SET related_broad_field = '02 - Information Technology'
WHERE related_broad_field IS NULL AND anzsco_code IN (
  '113232',
  '223431',
  '271132',
  '271232',
  '272131',
  '273231',
  '273232',
  '273331',
  '273332'
);

UPDATE occupations_au SET related_broad_field = '03 - Engineering and Related Technologies'
WHERE related_broad_field IS NULL AND anzsco_code IN (
  '243131',
  '243132',
  '243133',
  '243231',
  '243232',
  '243233',
  '243234',
  '243235',
  '243236',
  '243331',
  '243332',
  '243431',
  '243531',
  '243532',
  '243631',
  '243632',
  '243931',
  '243932',
  '243934',
  '243935',
  '243936',
  '243937',
  '243999'
);

UPDATE occupations_au SET related_broad_field = '04 - Architecture and Building'
WHERE related_broad_field IS NULL AND anzsco_code IN (
  '131331',
  '241132',
  '241233',
  '241331',
  '241931',
  '241932',
  '243938',
  '264637'
);

UPDATE occupations_au SET related_broad_field = '05 - Agriculture, Environmental and Related Studies'
WHERE related_broad_field IS NULL AND anzsco_code IN (
  '149331',
  '151132',
  '151232',
  '151236',
  '152131',
  '244131',
  '244132',
  '244133',
  '244134',
  '244135',
  '244333',
  '244431',
  '244432',
  '244533',
  '264933'
);

UPDATE occupations_au SET related_broad_field = '06 - Health'
WHERE related_broad_field IS NULL AND anzsco_code IN (
  '141331',
  '141332',
  '141334',
  '141399',
  '243933',
  '262431',
  '262531',
  '262631',
  '262931',
  '262932',
  '262999',
  '263131',
  '263132',
  '263133',
  '263431',
  '263432',
  '263531',
  '263931',
  '263935',
  '263999',
  '264131',
  '264231',
  '264331',
  '264332',
  '264333',
  '264334',
  '264335',
  '264336',
  '264337',
  '264338',
  '264341',
  '264342',
  '264343',
  '264344',
  '264345',
  '264346',
  '264399',
  '264431',
  '264531',
  '264631',
  '264632',
  '264633',
  '264634',
  '264635',
  '264636',
  '264638',
  '264641',
  '264931',
  '264932',
  '264934',
  '264935',
  '264936',
  '264937',
  '264999',
  '265131',
  '265231',
  '265232',
  '265331',
  '265431',
  '265432',
  '265433',
  '265434',
  '265435',
  '265499',
  '269131',
  '269132',
  '269133',
  '269231',
  '269232',
  '269331',
  '269431',
  '269432',
  '269531',
  '269999'
);

UPDATE occupations_au SET related_broad_field = '07 - Education'
WHERE related_broad_field IS NULL AND anzsco_code IN (
  '141231',
  '251931',
  '252231',
  '259931',
  '259999'
);

UPDATE occupations_au SET related_broad_field = '08 - Management and Commerce'
WHERE related_broad_field IS NULL AND anzsco_code IN (
  '111531',
  '132233',
  '161131',
  '161231',
  '161232',
  '161631',
  '162131',
  '172132',
  '172531',
  '172533',
  '222131'
);

UPDATE occupations_au SET related_broad_field = '09 - Society and Culture'
WHERE related_broad_field IS NULL AND anzsco_code IN (
  '261135',
  '261331',
  '281331'
);

UPDATE occupations_au SET related_broad_field = '10 - Creative Arts'
WHERE related_broad_field IS NULL AND anzsco_code IN (
  '231434',
  '231435',
  '231531',
  '231532'
);


-- Verification:
-- select count(*) filter (where related_broad_field is not null) as set,
--        count(*) as total from occupations_au;

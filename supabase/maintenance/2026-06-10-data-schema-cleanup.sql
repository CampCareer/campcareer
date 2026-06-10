-- ============================================================================
-- CampCareer 데이터/스키마 정리 (지시서 Task 15 · 16)
-- 작성: 2026-06-10 — Supabase SQL Editor에서 실행할 것.
-- 아래 "검증 결과" 주석은 2026-06-10 anon REST API로 라이브 DB를 조회해 확인한 내용.
-- ============================================================================

-- ────────────────────────────────────────────────────────────────────────────
-- Task 15. 데이터 품질 — 대학명 공백 누락 탐지
-- ────────────────────────────────────────────────────────────────────────────
-- 검증 결과 (2026-06-10):
--   * 접속어가 대문자 단어에 붙은 패턴(예: "ofTechnology")은 colleges_us/au/ca/uk/ie
--     전 테이블에서 0건. colleges_us의 "Georgia Institute of Technology-Main Campus"는
--     정상 공백 보유 — 프로덕션 curl에서 보였던 "ofTechnology"는 DB가 아니라
--     JSX 줄바꿈으로 인한 HTML 공백 붕괴(렌더링 아티팩트)였을 가능성이 높음.
--   * 단순 '[a-z][A-Z]' 패턴은 정상 CamelCase(McGill, DigiPen, InterCoast 등)를
--     오탐하므로 그대로 UPDATE에 쓰면 안 됨.
--
-- 아래 탐지 쿼리는 접속어 + 대문자 결합만 잡도록 좁힌 버전. 주기적 점검용.

select 'colleges_us' as tbl, unit_id::text as ext_id, name
from colleges_us where name ~ ' (of|and|the|for|at|in|de)[A-Z]'
union all
select 'colleges_au', institution_id::text, name
from colleges_au where name ~ ' (of|and|the|for|at|in|de)[A-Z]'
union all
select 'colleges_ca', institution_id::text, name
from colleges_ca where name ~ ' (of|and|the|for|at|in|de)[A-Z]'
union all
select 'colleges_uk', institution_id::text, name
from colleges_uk where name ~ ' (of|and|the|for|at|in|de)[A-Z]'
union all
select 'colleges_ie', institution_id::text, name
from colleges_ie where name ~ ' (of|and|the|for|at|in|de)[A-Z]';

-- 적발 시 수정 예시 (접속어 뒤에 공백 삽입):
-- update colleges_us
-- set name = regexp_replace(name, ' (of|and|the|for|at|in|de)([A-Z])', ' \1 \2', 'g')
-- where name ~ ' (of|and|the|for|at|in|de)[A-Z]';
--
-- colleges_* 를 수정한 경우 관련 matview 갱신 필수:
-- refresh materialized view roi_explorer_us;
-- refresh materialized view roi_explorer_by_field_us;
-- (수정 국가에 따라 roi_explorer_au / _ca / _uk / _ie 도 동일)

-- ────────────────────────────────────────────────────────────────────────────
-- Task 16. 스키마 정리
-- ────────────────────────────────────────────────────────────────────────────

-- (a) 빈 테이블 제거 — 검증 결과: programs_ie, programs_au 모두 0행 (2026-06-10)
drop table if exists programs_ie;
drop table if exists programs_au;

-- (b) 복붙 잔재 컬럼 — courses_au.qualifax_url (아일랜드 Qualifax DB 전용 컬럼)
--     검증 결과: 전 행 NULL (2026-06-10) → 제거 안전
alter table courses_au drop column if exists qualifax_url;

-- (c) 복붙 잔재 컬럼 — roi_explorer_ca / roi_explorer_uk 의 aqf_level
--     (AQF는 호주 학위체계. 검증 결과: 두 matview 모두 전 행이 상수 8 — 정보가치 없음)
--     materialized view 는 컬럼만 drop 할 수 없으므로 정의에서 aqf_level 을 제외하고
--     재생성해야 함. 현재 정의 확인:
--
--   select pg_get_viewdef('roi_explorer_ca'::regclass, true);
--   select pg_get_viewdef('roi_explorer_uk'::regclass, true);
--
--     위 정의에서 aqf_level 컬럼(소스 테이블의 상수/컬럼 참조 포함)을 제거한 뒤:
--
--   drop materialized view roi_explorer_ca;
--   create materialized view roi_explorer_ca as <aqf_level 제외한 정의>;
--   grant select on roi_explorer_ca to anon, authenticated;
--   -- 기존 인덱스 재생성 필요 (\d roi_explorer_ca 로 사전 확인)
--
--     roi_explorer_uk 도 동일. 소스 테이블(courses_ca / courses_uk)에 aqf_level 이
--     있다면 그 컬럼도 함께 정리 검토:
--   alter table courses_ca drop column if exists aqf_level;
--   alter table courses_uk drop column if exists aqf_level;
--     (단, 위 alter 는 matview 재생성 후에만 실행 — 의존성 오류 방지)

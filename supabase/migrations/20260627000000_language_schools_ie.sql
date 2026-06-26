-- 아일랜드 어학원 + 과정 테이블
-- MEI(English Education Ireland) / ACELS 인증 학교 중심

CREATE TABLE IF NOT EXISTS language_schools_ie (
  id              BIGSERIAL PRIMARY KEY,
  slug            TEXT        UNIQUE NOT NULL,
  name_en         TEXT        NOT NULL,
  name_ko         TEXT,
  city            TEXT        NOT NULL,
  region          TEXT,                        -- Leinster / Munster / Connacht / Ulster
  lat             NUMERIC,
  lng             NUMERIC,
  website_url     TEXT,
  accreditation   TEXT[],                      -- e.g. {"ACELS","MEI","EAQUALS","IALC"}
  established_year SMALLINT,
  google_rating   NUMERIC(2,1),
  student_capacity INTEGER,
  average_nationalities INTEGER,
  min_age         SMALLINT DEFAULT 16,
  accommodation_types TEXT[],                  -- {"homestay","residence","apartment"}
  homestay_price_week NUMERIC,                 -- EUR
  residence_price_week NUMERIC,                -- EUR
  price_range_week TEXT,                       -- e.g. "€200–350"
  description_ko  TEXT,
  description_en  TEXT,
  logo_url        TEXT,
  synced_at       TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS ls_ie_city_idx ON language_schools_ie (city);

CREATE TABLE IF NOT EXISTS language_courses_ie (
  id              BIGSERIAL PRIMARY KEY,
  school_id       BIGINT      NOT NULL REFERENCES language_schools_ie(id) ON DELETE CASCADE,
  course_type     TEXT        NOT NULL,        -- general_english / ielts_prep / cambridge_prep / academic_english / business_english / junior / teacher_training
  name_en         TEXT        NOT NULL,
  name_ko         TEXT,
  lessons_per_week INTEGER,
  max_class_size  SMALLINT,
  duration_min    SMALLINT,                    -- minimum weeks
  duration_max    SMALLINT,                    -- maximum weeks
  price_per_week  NUMERIC,                     -- EUR
  registration_fee NUMERIC,                    -- EUR
  description_ko  TEXT,
  description_en  TEXT
);

CREATE INDEX IF NOT EXISTS lc_ie_school_idx ON language_courses_ie (school_id);
CREATE INDEX IF NOT EXISTS lc_ie_type_idx ON language_courses_ie (course_type);

-- RLS: 누구나 읽기 가능, 서비스 롤만 쓰기 가능
ALTER TABLE language_schools_ie ENABLE ROW LEVEL SECURITY;
ALTER TABLE language_courses_ie ENABLE ROW LEVEL SECURITY;

CREATE POLICY "language_schools_ie_select_anon" ON language_schools_ie
  FOR SELECT USING (true);
CREATE POLICY "language_courses_ie_select_anon" ON language_courses_ie
  FOR SELECT USING (true);

--------------------------------------------------------------
-- SEED DATA — 18 major language schools across Ireland
-- Prices in EUR, 2026 기준
--------------------------------------------------------------

INSERT INTO language_schools_ie (slug, name_en, name_ko, city, region, lat, lng, website_url, accreditation, established_year, google_rating, student_capacity, average_nationalities, min_age, accommodation_types, homestay_price_week, residence_price_week, price_range_week, description_ko) VALUES
('atlas-language-school-dublin', 'Atlas Language School', '아틀라스 랭귀지 스쿨', 'Dublin', 'Leinster', 53.3347, -6.2600, 'https://atlaslanguageschool.com', ARRAY['ACELS','EAQUALS','MEI'], 2003, 4.7, 500, 50, 16, ARRAY['homestay','residence'], 285, 480, '€216–300', '더블린 중심가 Portobello에 위치한 아일랜드 대표 어학원. ACELS 및 EAQUALS 이중 인증. 50개국 이상 학생들이 재학 중이며, 최대 15명 소규모 수업으로 진행됩니다. 자체 기숙사(Atlas Residence) 보유, 무료 elective 수업 제공.'),
('delfin-english-school-dublin', 'Delfin English School', '델핀 잉글리쉬 스쿨', 'Dublin', 'Leinster', 53.3480, -6.2600, 'https://delfinschool.com', ARRAY['ACELS','MEI'], 2005, 4.4, 400, 45, 16, ARRAY['homestay','residence'], 260, 350, '€130–200', '더블린 중심부 템플바 인근에 위치한 인기 어학원. 합리적인 학비로 장기 코스(25주+)에 강점이 있으며, 워크앤스터디 비자 준비생에게 인기가 많습니다. 15/20/30레슨 다양한 옵션 제공.'),
('ces-dublin', 'Centre of English Studies (CES)', 'CES 더블린', 'Dublin', 'Leinster', 53.3440, -6.2550, 'https://www.ces-schools.com', ARRAY['ACELS','MEI'], 1979, 4.5, 350, 40, 16, ARRAY['homestay','residence'], 255, 360, '€210–320', '1979년 설립된 아일랜드 대표 어학원 그룹. 더블린과 코크 두 캠퍼스 간 자유로운 이동 가능. IELTS/캠브리지/토익 공식 시험센터이며, CES Online 무료 제공. 유럽 학생 비중이 높고 다양한 소셜 액티비티 운영.'),
('emerald-cultural-institute', 'Emerald Cultural Institute', '에머랄드 컬처럴 인스티튜트', 'Dublin', 'Leinster', 53.3250, -6.2480, 'https://www.eci.ie', ARRAY['ACELS','MEI'], 1986, 4.6, 450, 45, 17, ARRAY['homestay','residence'], 275, 380, '€250–350', '더블린 남부 조용한 주택가 Palmerston Park에 위치한 대형 어학원. 1986년 설립. 드넓은 캠퍼스와 카페테리아 보유. 개인 튜터링과 학업 멘토링 프로그램이 특징. 아일랜드 유학/취업 무료 워크숍 제공.'),
('kaplan-dublin', 'Kaplan International Languages', '카플란 인터내셔널 랭귀지스', 'Dublin', 'Leinster', 53.3420, -6.2580, 'https://www.kaplaninternational.com', ARRAY['ACELS','MEI'], 2005, 4.4, 300, 50, 16, ARRAY['homestay','residence'], 270, 380, '€300–420', '글로벌 어학원 그룹 카플란의 더블린 캠퍼스. 도심 접근성 우수, 아카데믹 집중 학습 환경 제공. IELTS 전문 센터로 시험 준비에 강점. 엄선된 홈스테이와 현대적인 기숙사 옵션.'),
('ec-dublin', 'EC English Language Centres', 'EC 잉글리쉬', 'Dublin', 'Leinster', 53.3450, -6.2530, 'https://www.ecenglish.com', ARRAY['ACELS','MEI'], 1991, 4.5, 350, 50, 16, ARRAY['homestay','residence'], 260, 370, '€280–380', '전 세계 30개 센터를 운영하는 글로벌 어학원 그룹. 더블린 센터는 도심 대운하 근처에 위치. 정규 수업 후 무료 워크샵(회화/작문/문법) 제공. 주니어 및 성인 프로그램 모두 운영.'),
('ih-dublin', 'International House Dublin', '인터내셔널 하우스 더블린', 'Dublin', 'Leinster', 53.3400, -6.2500, 'https://www.ihdublin.com', ARRAY['ACELS','EAQUALS','MEI'], 2003, 4.5, 280, 45, 16, ARRAY['homestay','residence'], 250, 360, '€200–300', 'IH World Organisation 회원교. EAQUALS 인증으로 높은 교육 품질 보장. 워크앤스터디 비자 과정(15/16/20시간)이 인기. 합리적인 가격대와 체계적인 레벨 시스템.'),
('isi-dublin', 'ISI Dublin', 'ISI 더블린', 'Dublin', 'Leinster', 53.3470, -6.2560, 'https://www.isi-ireland.com', ARRAY['ACELS','MEI'], 2008, 4.5, 250, 40, 16, ARRAY['homestay','residence'], 250, 340, '€200–280', '더블린 중심 조지아스타일 건물에 위치한 현대적인 어학원. 합리적인 학비로 장기과정 수강생에게 인기. 프렌들리한 분위기와 체계적인 학생 관리가 장점. 무료 사회 활동 프로그램 제공.'),
('ise-dublin', 'International School of English (ISE)', 'ISE 더블린', 'Dublin', 'Leinster', 53.3370, -6.2620, 'https://www.iseireland.com', ARRAY['ACELS','MEI'], 1997, 4.3, 350, 35, 16, ARRAY['homestay','residence'], 240, 330, '€124–178', '1997년 설립, 더블린 남부 도심에 위치. Trinity College London 공식 시험센터. 6단계 레벨 시스템, 8주마다 레벨테스트. 일반영어+무급 인턴십 프로그램 운영. 대학 예비과정(파운데이션) 수료 시 아일랜드/영국 대학 입학 보장.'),
('english-path-dublin', 'English Path', '잉글리쉬 패스', 'Dublin', 'Leinster', 53.3460, -6.2610, 'https://www.englishpath.com', ARRAY['ACELS','MEI'], 2012, 4.3, 300, 40, 16, ARRAY['homestay','residence'], 250, 350, '€220–340', '글로벌 어학원 브랜드 English Path의 더블린 캠퍼스. 현대적인 시설과 러닝테크놀로지 활용 수업. 경력 중심 영어 과정(Professional English) 운영. 다양한 국적비로 글로벌 환경에서 학습 가능.'),
('cork-english-college', 'Cork English College (CEC)', '코크 잉글리쉬 칼리지', 'Cork', 'Munster', 51.8985, -8.4756, 'https://www.corkenglishcollege.ie', ARRAY['ACELS','MEI'], 1978, 4.6, 200, 35, 17, ARRAY['homestay','residence'], 230, 300, '€190–280', '1978년 설립된 코크 최대 어학원. 가족 경영으로 개인 맞춤 케어에 강점. 조용하고 안전한 코크 도심에 위치. 더블린 대비 생활비가 저렴하며, 여유로운 환경에서 집중 학습 가능.'),
('ces-cork', 'Centre of English Studies (CES) Cork', 'CES 코크', 'Cork', 'Munster', 51.8970, -8.4720, 'https://www.ces-schools.com', ARRAY['ACELS','MEI'], 1979, 4.5, 180, 35, 16, ARRAY['homestay','residence'], 225, 290, '€195–280', 'CES 그룹의 코크 캠퍼스. 더블린 캠퍼스와 자유로운 이동 가능. 코크 시내 중심가에 위치. 작은 규모의 아늑한 학교 분위기에서 집중적인 영어 학습 가능. IELTS/캠브리지 시험센터.'),
('cork-english-academy', 'Cork English Academy', '코크 잉글리쉬 아카데미', 'Cork', 'Munster', 51.8980, -8.4740, 'https://www.corkenglishacademy.ie', ARRAY['ACELS','MEI'], 2011, 4.4, 150, 30, 16, ARRAY['homestay','residence'], 220, 285, '€175–260', '코크 중심부에 위치한 현대적인 어학원. 합리적인 학비와 소규모 클래스(최대 12명)가 장점. 친근한 분위기에서 개인별 집중 케어 가능. 장기 코스 할인 혜택 우수.'),
('bridge-mills-galway', 'Bridge Mills Galway Language Centre', '브릿지 밀스 골웨이', 'Galway', 'Connacht', 53.2730, -9.0480, 'https://www.bridgemills.com', ARRAY['ACELS','MEI'], 1988, 4.5, 150, 30, 16, ARRAY['homestay','residence'], 230, 320, '€200–300', '골웨이 시내 중심 Bridge Mills에 위치한 어학원. International House 제휴. 아일랜드 서부의 아름다운 자연환경 속에서 학습. 소규모 클래스와 가족적인 분위기. 골웨이는 음악과 문화의 도시로 유명.'),
('galway-cultural-institute', 'Galway Cultural Institute', '골웨이 컬쳐럴 인스티튜트', 'Galway', 'Connacht', 53.2710, -9.0450, 'https://www.gci.ie', ARRAY['ACELS','MEI'], 1998, 4.4, 180, 35, 16, ARRAY['homestay','residence'], 240, 330, '€210–310', '골웨이 중심부에 위치한 중대형 어학원. 아일랜드 서부 최대 어학원 중 하나. 문화 체험 프로그램이 풍부. 다양한 국적 학생들과 함께하는 글로벌 환경. IELTS 및 캠브리지 시험 준비 과정 운영.'),
('limerick-language-centre', 'Limerick Language Centre', '리머릭 랭귀지 센터', 'Limerick', 'Munster', 52.6660, -8.6290, 'https://www.limericklanguage.ie', ARRAY['ACELS','MEI'], 1990, 4.5, 100, 25, 16, ARRAY['homestay','residence'], 210, 280, '€180–260', '1990년 설립, 리머릭 시내 중심에 위치한 소규모 가족 경영 어학원. 개인별 맞춤 케어와 친근한 분위기가 장점. 생활비가 더블린의 절반 수준으로 경제적인 유학 가능. 조용한 환경에서 집중적으로 영어 실력 향상 가능.'),
('mackdonald-language-academy', 'Mackdonald Language Academy', '맥도날드 랭귀지 아카데미', 'Kilkenny', 'Leinster', 52.6540, -7.2520, 'https://www.mackdonald.ie', ARRAY['ACELS','MEI'], 2007, 4.6, 80, 20, 16, ARRAY['homestay'], 200, NULL, '€170–250', '킬케니 시내 중심에 위치한 소규모 아늑한 어학원. ACELS/QQI 및 MEI 인증. 맥도날드 가족이 운영하는 진정한 가족 경영 어학원. 1:1 케어와 따뜻한 분위기로 장기 체류 학생들에게 인기. 생활비가 매우 저렴한 지역.'),
('killarney-school-of-english', 'Killarney School of English', '킬라니 스쿨 오브 잉글리쉬', 'Killarney', 'Munster', 52.0590, -9.5120, 'https://www.killarneyschoolofenglish.com', ARRAY['ACELS','MEI'], 2000, 4.5, 60, 20, 16, ARRAY['homestay'], 210, NULL, '€180–250', '킬라니 국립공원 인근에 위치한 소규모 어학원. 아일랜드 최고의 자연경관 속에서 학습. 조용하고 안전한 환경에서 집중적인 영어 학습 가능. 20개국 이내의 다양한 국적비. 생활비가 매우 저렴.')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO language_courses_ie (school_id, course_type, name_en, name_ko, lessons_per_week, max_class_size, duration_min, duration_max, price_per_week, registration_fee) VALUES
-- Atlas Language School
(1, 'general_english', 'General English Fluency (GE20)', '일반영어 플루언시 (GE20)', 20, 15, 1, 52, 270, 70),
(1, 'general_english', 'General English Fluency (GE26)', '일반영어 플루언시 (GE26)', 26, 15, 1, 52, 320, 70),
(1, 'ielts_prep', 'IELTS Preparation', 'IELTS 준반', 20, 15, 4, 24, 290, 70),
(1, 'cambridge_prep', 'Cambridge Exam Preparation (FCE/CAE)', '캠브리지 시험 준비 (FCE/CAE)', 20, 15, 8, 12, 290, 70),

-- Delfin English School
(2, 'general_english', 'General English 15 (Morning)', '일반영어 15 (오전)', 15, 15, 1, 52, 155, 70),
(2, 'general_english', 'General English 15 (Afternoon)', '일반영어 15 (오후)', 15, 15, 1, 52, 130, 70),
(2, 'general_english', 'General English Plus 20 (Morning)', '일반영어 플러스 20 (오전)', 20, 15, 1, 52, 180, 70),
(2, 'general_english', 'General English Intensive 30', '집중영어 30', 30, 15, 1, 24, 270, 70),
(2, 'business_english', 'Business English 20', '비즈니스 영어 20', 20, 15, 1, 24, 200, 70),
(2, 'ielts_prep', 'IELTS Preparation', 'IELTS 준비반', 15, 15, 4, 24, 155, 70),

-- CES Dublin
(3, 'general_english', 'General English 20', '일반영어 20', 20, 15, 1, 52, 260, 60),
(3, 'general_english', 'General English 26', '일반영어 26', 26, 15, 1, 52, 310, 60),
(3, 'ielts_prep', 'IELTS Preparation', 'IELTS 준비반', 20, 15, 4, 24, 275, 60),
(3, 'cambridge_prep', 'Cambridge Exam Preparation', '캠브리지 시험 준비', 20, 15, 8, 12, 275, 60),
(3, 'business_english', 'Business English', '비즈니스 영어', 20, 15, 4, 24, 275, 60),

-- Emerald Cultural Institute
(4, 'general_english', 'General English 20', '일반영어 20', 20, 15, 1, 52, 310, 70),
(4, 'general_english', 'Intensive English 26', '집중영어 26', 26, 15, 1, 52, 360, 70),
(4, 'ielts_prep', 'IELTS Preparation', 'IELTS 준비반', 20, 15, 4, 24, 330, 70),
(4, 'cambridge_prep', 'Cambridge Exam Preparation', '캠브리지 시험 준비', 20, 15, 8, 12, 330, 70),
(4, 'academic_english', 'Academic English', '아카데믹 영어', 26, 15, 4, 24, 360, 70),

-- Kaplan Dublin
(5, 'general_english', 'General English 20', '일반영어 20', 20, 15, 1, 52, 360, 65),
(5, 'general_english', 'Intensive English 26', '집중영어 26', 26, 15, 1, 52, 410, 65),
(5, 'ielts_prep', 'IELTS Preparation', 'IELTS 준비반', 20, 15, 4, 24, 375, 65),
(5, 'cambridge_prep', 'Cambridge Exam Preparation', '캠브리지 시험 준비', 20, 15, 8, 12, 375, 65),
(5, 'business_english', 'Business English', '비즈니스 영어', 20, 15, 4, 24, 375, 65),

-- EC Dublin
(6, 'general_english', 'General English 20', '일반영어 20', 20, 15, 1, 52, 340, 65),
(6, 'general_english', 'General English 24', '일반영어 24', 24, 15, 1, 52, 370, 65),
(6, 'general_english', 'General English 30', '일반영어 30', 30, 15, 1, 52, 420, 65),
(6, 'ielts_prep', 'IELTS Preparation', 'IELTS 준비반', 20, 15, 4, 24, 355, 65),
(6, 'cambridge_prep', 'Cambridge Exam Preparation', '캠브리지 시험 준비', 20, 15, 8, 12, 355, 65),

-- International House Dublin
(7, 'general_english', 'General English 15', '일반영어 15', 15, 14, 1, 52, 230, 60),
(7, 'general_english', 'General English 20', '일반영어 20', 20, 14, 1, 52, 270, 60),
(7, 'ielts_prep', 'IELTS Preparation', 'IELTS 준비반', 15, 14, 4, 24, 245, 60),
(7, 'general_english', 'Work & Study 15', '워크앤스터디 15', 15, 14, 25, 25, 215, 60),
(7, 'general_english', 'Work & Study 20', '워크앤스터디 20', 20, 14, 25, 25, 260, 60),

-- ISI Dublin
(8, 'general_english', 'General English 15', '일반영어 15', 15, 15, 1, 52, 220, 60),
(8, 'general_english', 'General English 20', '일반영어 20', 20, 15, 1, 52, 260, 60),
(8, 'ielts_prep', 'IELTS Preparation', 'IELTS 준비반', 15, 15, 4, 24, 235, 60),
(8, 'general_english', 'Academic Year 15 (Morning)', '학년제 영어 15 (오전)', 15, 15, 25, 52, 200, 60),
(8, 'general_english', 'Academic Year 15 (Afternoon)', '학년제 영어 15 (오후)', 15, 15, 25, 52, 175, 60),

-- ISE Dublin
(9, 'general_english', 'General English 15 (Morning)', '일반영어 15 (오전)', 15, 15, 1, 52, 150, 60),
(9, 'general_english', 'General English 15 (Afternoon)', '일반영어 15 (오후)', 15, 15, 1, 52, 125, 60),
(9, 'general_english', 'General English 20 (Morning)', '일반영어 20 (오전)', 20, 15, 1, 52, 185, 60),
(9, 'general_english', 'General English 20 (Afternoon)', '일반영어 20 (오후)', 20, 15, 1, 52, 155, 60),
(9, 'ielts_prep', 'IELTS Preparation', 'IELTS 준비반', 15, 15, 4, 24, 160, 60),
(9, 'academic_english', 'Academic Year 15 (Morning)', '학년제 영어 15 (오전)', 15, 15, 25, 32, 140, 60),
(9, 'academic_english', 'Academic Year 15 (Afternoon)', '학년제 영어 15 (오후)', 15, 15, 25, 32, 120, 60),

-- English Path Dublin
(10, 'general_english', 'General English 20', '일반영어 20', 20, 15, 1, 52, 290, 65),
(10, 'general_english', 'General English 25', '일반영어 25', 25, 15, 1, 52, 330, 65),
(10, 'ielts_prep', 'IELTS Preparation', 'IELTS 준비반', 20, 15, 4, 24, 305, 65),
(10, 'cambridge_prep', 'Cambridge Exam Preparation', '캠브리지 시험 준비', 20, 15, 8, 12, 305, 65),

-- Cork English College
(11, 'general_english', 'General English 15', '일반영어 15', 15, 14, 1, 52, 230, 55),
(11, 'general_english', 'General English 20', '일반영어 20', 20, 14, 1, 52, 270, 55),
(11, 'general_english', 'General English 26', '일반영어 26', 26, 14, 1, 52, 320, 55),
(11, 'ielts_prep', 'IELTS Preparation', 'IELTS 준비반', 20, 14, 4, 24, 285, 55),

-- CES Cork
(12, 'general_english', 'General English 20', '일반영어 20', 20, 15, 1, 52, 240, 60),
(12, 'general_english', 'General English 26', '일반영어 26', 26, 15, 1, 52, 290, 60),
(12, 'ielts_prep', 'IELTS Preparation', 'IELTS 준비반', 20, 15, 4, 24, 255, 60),
(12, 'cambridge_prep', 'Cambridge Exam Preparation', '캠브리지 시험 준비', 20, 15, 8, 12, 255, 60),

-- Cork English Academy
(13, 'general_english', 'General English 15', '일반영어 15', 15, 12, 1, 52, 195, 50),
(13, 'general_english', 'General English 20', '일반영어 20', 20, 12, 1, 52, 230, 50),
(13, 'ielts_prep', 'IELTS Preparation', 'IELTS 준비반', 15, 12, 4, 24, 210, 50),

-- Bridge Mills Galway
(14, 'general_english', 'General English 15', '일반영어 15', 15, 12, 1, 52, 230, 60),
(14, 'general_english', 'General English 20', '일반영어 20', 20, 12, 1, 52, 270, 60),
(14, 'general_english', 'General English 25', '일반영어 25', 25, 12, 1, 52, 310, 60),
(14, 'ielts_prep', 'IELTS Preparation', 'IELTS 준비반', 15, 12, 4, 24, 245, 60),

-- Galway Cultural Institute
(15, 'general_english', 'General English 15', '일반영어 15', 15, 14, 1, 52, 240, 60),
(15, 'general_english', 'General English 20', '일반영어 20', 20, 14, 1, 52, 280, 60),
(15, 'general_english', 'Intensive English 26', '집중영어 26', 26, 14, 1, 52, 330, 60),
(15, 'ielts_prep', 'IELTS Preparation', 'IELTS 준비반', 20, 14, 4, 24, 295, 60),

-- Limerick Language Centre
(16, 'general_english', 'General English 15', '일반영어 15', 15, 12, 1, 52, 210, 50),
(16, 'general_english', 'General English 20', '일반영어 20', 20, 12, 1, 52, 250, 50),
(16, 'ielts_prep', 'IELTS Preparation', 'IELTS 준비반', 15, 12, 4, 24, 225, 50),

-- Mackdonald Language Academy
(17, 'general_english', 'General English 15', '일반영어 15', 15, 10, 1, 52, 200, 50),
(17, 'general_english', 'General English 20', '일반영어 20', 20, 10, 1, 52, 240, 50),

-- Killarney School of English
(18, 'general_english', 'General English 15', '일반영어 15', 15, 10, 1, 52, 210, 50),
(18, 'general_english', 'General English 20', '일반영어 20', 20, 10, 1, 52, 245, 50);

# scripts/import_cricos.py
# CRICOS 2026-04 Excel → courses_au upsert

import os, json, pandas as pd
from pathlib import Path
from supabase import create_client

# .env.local 로드
env_path = Path(__file__).parent.parent / ".env.local"
if env_path.exists():
    for line in env_path.read_text().splitlines():
        line = line.strip()
        if line and not line.startswith("#") and "=" in line:
            k, _, v = line.partition("=")
            os.environ.setdefault(k.strip(), v.strip())

SUPABASE_URL = os.environ["NEXT_PUBLIC_SUPABASE_URL"]
SUPABASE_KEY = os.environ["SUPABASE_SERVICE_ROLE_KEY"]
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

# colleges_au CRICOS 코드 → institution_id 매핑
PROVIDER_MAP = {
    "00026E": "the-university-of-sydney",
    "00098G": "university-of-new-south-wales",
    "00116K": "the-university-of-melbourne",
    "00008C": "monash-university",
    "00025B": "the-university-of-queensland",
    "00120C": "the-australian-national-university",
    "00124J": "the-university-of-western-australia",
    "00123M": "the-university-of-adelaide",
    "00099F": "university-of-technology-sydney",
    "00122A": "rmit-university",
    "00213J": "queensland-university-of-technology",
    "00002J": "macquarie-university",
    "00102E": "university-of-wollongong",
    "00301J": "curtin-university",
    "00113B": "deakin-university",
    "00233E": "griffith-university",
    "00115M": "la-trobe-university",
    "00114A": "flinders-university",
    "00109J": "university-of-newcastle",
    "00111D": "swinburne-university-of-technology",
    "00117J": "james-cook-university",
    "00300K": "charles-darwin-university",
    "00212K": "university-of-canberra",
    "00917K": "western-sydney-university",
    "00279B": "edith-cowan-university",
    "00125J": "murdoch-university",
    "00586B": "university-of-tasmania",
    "00017B": "bond-university",
    "00244B": "university-of-southern-queensland",
    "00219C": "central-queensland-university",
    "00005F": "charles-sturt-university",
    "01241G": "southern-cross-university",
    "00003G": "university-of-new-england",
    "00103D": "federation-university-australia",
    "03389E": "torrens-university",
    "00004G": "australian-catholic-university",
    "01595D": "university-of-the-sunshine-coast",
    "00007D": "victoria-university",
    "00017B": "bond-university",
    "00109J": "university-of-newcastle",
}

# AQF 레벨 매핑
AQF_MAP = {
    "bachelor degree": 7,
    "bachelor honours degree": 8,
    "graduate certificate": 8,
    "graduate diploma": 8,
    "masters degree (coursework)": 9,
    "masters degree (research)": 9,
    "doctoral degree": 10,
    "associate degree": 6,
    "advanced diploma": 6,
    "diploma": 5,
}

def map_field_name(broad: str, narrow: str, title: str) -> str:
    t = str(title).lower()
    b = str(broad).lower() if broad else ""
    n = str(narrow).lower() if narrow else ""

    if any(x in t for x in ['computer science', 'computing', 'software engineering']):
        return 'Computer Science.'
    if any(x in t for x in ['data science', 'artificial intelligence', 'machine learning', 'data analytics']):
        return 'Computer and Information Sciences, General.'
    if any(x in t for x in ['network', 'cybersecurity', 'cyber security', 'information system']):
        return 'Computer Systems Networking and Telecommunications.'
    if 'software' in t:
        return 'Computer Software and Media Applications.'
    if '02' in b or 'information technology' in b or 'information technology' in n:
        return 'Computer Science.'
    if 'civil engineering' in t:
        return 'Civil Engineering.'
    if 'mechanical engineering' in t:
        return 'Mechanical Engineering.'
    if any(x in t for x in ['electrical engineering', 'electronic engineering']):
        return 'Electrical, Electronics, and Communications Engineering.'
    if 'chemical engineering' in t:
        return 'Chemical Engineering.'
    if 'biomedical engineering' in t:
        return 'Biomedical/Medical Engineering.'
    if 'engineering' in t:
        return 'Engineering, General.'
    if '03' in b or 'engineering' in b:
        return 'Engineering, General.'
    if 'nursing' in t:
        return 'Registered Nursing, Nursing Administration, Nursing Research and Clinical Nursing.'
    if 'medicine' in t or 'medical' in t:
        return 'Medicine.'
    if 'pharmacy' in t:
        return 'Pharmacy, Pharmaceutical Sciences, and Administration.'
    if any(x in t for x in ['physiotherapy', 'occupational therapy', 'speech pathology']):
        return 'Rehabilitation and Therapeutic Professions.'
    if 'psychology' in t:
        return 'Psychology, General.'
    if 'social work' in t:
        return 'Social Work.'
    if 'health' in t or '06' in b:
        return 'Health Services/Allied Health/Health Sciences, General.'
    if 'accounting' in t:
        return 'Accounting and Related Services.'
    if 'finance' in t:
        return 'Finance and Financial Management Services.'
    if 'marketing' in t:
        return 'Marketing.'
    if 'economics' in t:
        return 'Economics.'
    if 'international business' in t:
        return 'International Business.'
    if 'human resource' in t:
        return 'Human Resources Management and Services.'
    if any(x in t for x in ['business', 'commerce', 'management', 'mba']):
        return 'Business Administration, Management and Operations.'
    if '08' in b or 'management' in b:
        return 'Business Administration, Management and Operations.'
    if 'law' in t or 'legal' in t:
        return 'Law.'
    if 'architecture' in t:
        return 'Architecture.'
    if any(x in t for x in ['education', 'teaching', 'pedagogy']):
        return 'Education, General.'
    if '07' in b or 'education' in b:
        return 'Education, General.'
    if any(x in t for x in ['design', 'animation', 'visual art']):
        return 'Design and Applied Arts.'
    if any(x in t for x in ['film', 'media', 'journalism', 'communication']):
        return 'Communication and Media Studies.'
    if 'biology' in t or 'biotechnology' in t:
        return 'Biology, General.'
    if 'chemistry' in t:
        return 'Chemistry.'
    if 'physics' in t:
        return 'Physics.'
    if any(x in t for x in ['mathematics', 'statistics', 'actuarial']):
        return 'Mathematics.'
    if 'environmental' in t:
        return 'Environmental/Natural Resources Management and Policy.'
    if 'agriculture' in t or 'agribusiness' in t:
        return 'Agriculture, General.'
    if any(x in t for x in ['sport', 'exercise science', 'kinesiology']):
        return 'Sports, Kinesiology, and Physical Education/Fitness.'
    if 'english' in t and 'literature' in t:
        return 'English Language and Literature, General.'
    if 'music' in t:
        return 'Music.'
    if any(x in t for x in ['hospitality', 'tourism', 'hotel']):
        return 'Hospitality Administration/Management.'
    if 'social science' in t or 'sociology' in t:
        return 'Sociology.'
    if 'political' in t:
        return 'Political Science and Government.'
    return 'Liberal Arts and Sciences, General Studies and Humanities.'

def get_aqf_level(course_level: str) -> int | None:
    if not course_level:
        return None
    cl = str(course_level).lower().strip()
    for k, v in AQF_MAP.items():
        if k in cl:
            return v
    return None

def run():
    print("📥 CRICOS Excel 로드 중...")
    df = pd.read_excel('cricos_2026_04.xlsx', sheet_name='Courses', header=0, skiprows=1)
    
    # 컬럼명 재설정
    df.columns = [
        'provider_code', 'institution_name', 'course_code', 'course_name',
        'vet_code', 'dual_qual', 'broad_field1', 'narrow_field1', 'detailed_field1',
        'broad_field2', 'narrow_field2', 'detailed_field2', 'course_level',
        'foundation', 'work_component', 'work_hours_week', 'work_weeks',
        'work_hours_total', 'language', 'duration_weeks', 'tuition_fee',
        'non_tuition_fee', 'total_cost', 'expired'
    ]
    
    print(f"  총 {len(df):,}개 행 로드")
    
    # 필터: 만료 안된 것만, 우리 대학만, Bachelor/Masters/Graduate만
    df = df[df['expired'].str.upper() == 'NO']
    df = df[df['provider_code'].isin(PROVIDER_MAP.keys())]
    df = df[df['course_level'].notna()]
    
    # AQF 7-9만 (Bachelor, Masters)
    df['aqf_level'] = df['course_level'].apply(get_aqf_level)
    df = df[df['aqf_level'].isin([7, 8, 9])]
    
    print(f"  필터 후: {len(df):,}개")
    
    # 데이터 변환
    courses = []
    for _, row in df.iterrows():
        institution_id = PROVIDER_MAP.get(str(row['provider_code']).strip())
        if not institution_id:
            continue
        
        # 학비 (연간으로 변환)
        tuition = None
        duration_weeks = row.get('duration_weeks')
        total_cost = row.get('total_cost')
        if pd.notna(total_cost) and pd.notna(duration_weeks) and duration_weeks > 0:
            years = float(duration_weeks) / 52
            if years > 0:
                tuition = int(float(total_cost) / years)
        
        # duration
        duration_years = None
        if pd.notna(duration_weeks) and duration_weeks > 0:
            duration_years = round(float(duration_weeks) / 52, 1)
        
        field_name = map_field_name(
            row.get('broad_field1', ''),
            row.get('narrow_field1', ''),
            row.get('course_name', '')
        )
        
        courses.append({
            "institution_id":  institution_id,
            "course_code":     str(row['course_code']).strip(),
            "cricos_code":     str(row['provider_code']).strip(),
            "title":           str(row['course_name']).strip(),
            "broad_field":     str(row['broad_field1']).strip() if pd.notna(row['broad_field1']) else None,
            "narrow_field":    str(row['narrow_field1']).strip() if pd.notna(row['narrow_field1']) else None,
            "field_name":      field_name,
            "aqf_level":       int(row['aqf_level']),
            "course_type":     str(row['course_level']).strip(),
            "duration_years":  duration_years,
            "tuition_fee_aud": tuition,
            "cricos_url":      f"https://cricos.education.gov.au/Course/CourseDetails.aspx?CourseCode={row['course_code']}",
        })
    
    print(f"\n✅ 변환 완료: {len(courses):,}개 코스")
    
    # AQF별 통계
    from collections import Counter
    aqf_counts = Counter(c['aqf_level'] for c in courses)
    for level, count in sorted(aqf_counts.items()):
        print(f"  AQF {level}: {count:,}개")
    
    # JSON 백업
    with open("cricos_processed.json", "w") as f:
        json.dump(courses, f, ensure_ascii=False, indent=2)
    print("\n💾 cricos_processed.json 저장 완료")
    
    # Supabase upsert (100개씩)
    print("\n📤 Supabase 업로드 중...")
    for i in range(0, len(courses), 100):
        chunk = courses[i:i+100]
        supabase.table("courses_au").upsert(
            chunk, on_conflict="cricos_url"
        ).execute()
        if (i // 100 + 1) % 10 == 0:
            print(f"  {min(i+100, len(courses)):,}/{len(courses):,} 완료")
    
    print("✅ Supabase 업로드 완료!")

if __name__ == "__main__":
    run()

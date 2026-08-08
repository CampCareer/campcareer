# scripts/import_cricos.py
# CRICOS Excel → courses_au upsert. The registry remains the authority;
# provider-page claims are stored separately in program_page_facts_au.

import argparse, hashlib, json, os
from datetime import datetime, timezone
import pandas as pd
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

# Official CRICOS provider code → stable colleges_au institution_id.
# Keep this aligned with catalog.institution_identifiers(AU_CRICOS_PROVIDER_CODE).
PROVIDER_MAP = {
    "00004G": "australian-catholic-university",
    "02731D": "avondale-university",
    "00017B": "bond-university",
    "00219C": "central-queensland-university",
    "00300K": "charles-darwin-university",
    "00005F": "charles-sturt-university",
    "00301J": "curtin-university",
    "00113B": "deakin-university",
    "00279B": "edith-cowan-university",
    "00103D": "federation-university-australia",
    "00114A": "flinders-university",
    "00233E": "griffith-university",
    "00117J": "james-cook-university",
    "00115M": "la-trobe-university",
    "00002J": "macquarie-university",
    "00008C": "monash-university",
    "00125J": "murdoch-university",
    "00213J": "queensland-university-of-technology",
    "00122A": "rmit-university",
    "01241G": "southern-cross-university",
    "00111D": "swinburne-university-of-technology",
    "00591E": "tafe-nsw",
    "00092B": "tafe-sa",
    "00120C": "the-australian-national-university",
    "00123M": "the-university-of-adelaide",
    "00116K": "the-university-of-melbourne",
    "01032F": "the-university-of-notre-dame-australia",
    "00025B": "the-university-of-queensland",
    "00121B": "the-university-of-south-australia",
    "00026A": "the-university-of-sydney",
    "00126G": "the-university-of-western-australia",
    "03389E": "torrens-university",
    "00212K": "university-of-canberra",
    "01037A": "university-of-divinity",
    "00003G": "university-of-new-england",
    "00098G": "university-of-new-south-wales",
    "00109J": "university-of-newcastle",
    "00244B": "university-of-southern-queensland",
    "00586B": "university-of-tasmania",
    "00099F": "university-of-technology-sydney",
    "01595D": "university-of-the-sunshine-coast",
    "00102E": "university-of-wollongong",
    "00124K": "victoria-university",
    "02475D": "victoria-university",
    "00917K": "western-sydney-university",
}

# AQF 레벨 매핑
AQF_MAP = {
    "certificate i": 1,
    "certificate ii": 2,
    "certificate iii": 3,
    "certificate iv": 4,
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
    # Longest labels first: "certificate iii" must not match "certificate i".
    for k, v in sorted(AQF_MAP.items(), key=lambda item: len(item[0]), reverse=True):
        if k in cl:
            return v
    return None

def run(input_file: Path):
    print("📥 CRICOS Excel 로드 중...")
    df = pd.read_excel(input_file, sheet_name='Courses', header=0, skiprows=1)
    
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
    
    # Retain expired rows with an explicit lifecycle state. Dropping them
    # makes an old course look current when a provider retires it.
    df = df[df['provider_code'].isin(PROVIDER_MAP.keys())]
    df = df[df['course_level'].notna()]
    
    # Include VET and higher education pathways (Certificate I to AQF 10).
    df['aqf_level'] = df['course_level'].apply(get_aqf_level)
    df = df[df['aqf_level'].notna()]
    
    print(f"  필터 후: {len(df):,}개")
    
    # 데이터 변환
    courses = []
    seen_at = datetime.now(timezone.utc).isoformat()
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
        
        expired = str(row.get('expired', '')).strip().upper()
        fingerprint = json.dumps({
            'provider': str(row['provider_code']).strip(),
            'course': str(row['course_code']).strip(),
            'name': str(row['course_name']).strip(),
            'level': str(row['course_level']).strip(),
            'duration_weeks': None if pd.isna(duration_weeks) else float(duration_weeks),
            'total_cost': None if pd.isna(total_cost) else float(total_cost),
            'expired': expired,
        }, sort_keys=True)
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
            "cricos_status": "expired" if expired == "YES" else "active",
            "cricos_last_seen_at": seen_at,
            "cricos_content_hash": hashlib.sha256(fingerprint.encode()).hexdigest(),
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
    parser = argparse.ArgumentParser(description="Import an official CRICOS Courses workbook into courses_au")
    parser.add_argument("--input", type=Path, default=Path("cricos_2026_04.xlsx"), help="CRICOS workbook path")
    args = parser.parse_args()
    run(args.input)

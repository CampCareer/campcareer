# scraper_qualifax.py — Qualifax.ie 코스 스크래퍼 (2025 rebuilt site)
#
# 전략:
#   1. /courses?items_per_page=100&page=N 페이지를 순회해 코스 URL 수집
#   2. NFQ Level 6, 7, 8, 9 코스만 필터
#   3. 각 상세 페이지에서 Provider·Location·Duration·CAO Points 파싱
#   4. qualifax_raw_all_levels.json 저장 (Supabase 업서트는 별도 스텝)
#
# pip install requests beautifulsoup4 supabase python-dotenv

import os
import requests
from bs4 import BeautifulSoup
import time
import json
import re
from pathlib import Path
from supabase import create_client

# Load credentials from .env.local (same directory pattern as TS scripts)
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

HEADERS = {
    "User-Agent": "Mozilla/5.0 (compatible; CampCareer/1.0; +https://campcareer.com)"
}
BASE = "https://www.qualifax.ie"

# ── 1. 코스 목록 수집 (listing pages) ────────────────────────────────────────

def get_listing_page(page: int) -> list[dict]:
    """한 페이지의 코스 카드를 파싱해 {title, nfq_level, course_type, course_code, url} 반환."""
    resp = requests.get(
        f"{BASE}/courses",
        params={"items_per_page": 100, "page": page},
        headers=HEADERS,
        timeout=15,
    )
    soup = BeautifulSoup(resp.text, "html.parser")

    # 코스 카드: <a href="/course/..."> ... </a>
    course_links = soup.find_all("a", href=re.compile(r"^/course/\d+$"))

    results = []
    for card in course_links:
        href = card["href"]

        # NFQ 레벨: 카드 내 "Level N NFQ" 텍스트
        nfq_span = card.find(string=re.compile(r"Level \d+ NFQ"))
        nfq_level = None
        if nfq_span:
            m = re.search(r"Level (\d+) NFQ", nfq_span)
            nfq_level = int(m.group(1)) if m else None

        # 코스 타입
        type_field = card.select_one(".field--name-field-course-type .field__item")
        course_type = type_field.get_text(strip=True) if type_field else ""

        # 코스 코드
        code_field = card.select_one(".field--name-field-course-code .field__item")
        course_code = code_field.get_text(strip=True) if code_field else ""

        # 제목
        title_el = card.select_one("h2.h3 span, h2 span")
        title = title_el.get_text(strip=True) if title_el else card.get_text(strip=True)[:100]

        results.append({
            "title": title,
            "nfq_level": nfq_level,
            "course_type": course_type,
            "course_code": course_code,
            "url": BASE + href,
        })

    return results


def get_all_listings(max_pages: int = 50) -> list[dict]:
    """전체 코스 목록을 페이지 순회해 수집."""
    all_courses = []
    for page in range(max_pages):
        print(f"  목록 페이지 {page + 1} 수집 중...")
        courses = get_listing_page(page)
        if not courses:
            print(f"  → 빈 페이지, 종료.")
            break
        all_courses.extend(courses)
        print(f"  → {len(courses)}개 (누적 {len(all_courses)}개)")
        time.sleep(0.3)
    return all_courses


# ── 2. 상세 페이지 파싱 ───────────────────────────────────────────────────────

def get_course_detail(url: str) -> dict:
    """상세 페이지에서 Provider·Location·Duration·CAO Points 추출."""
    try:
        resp = requests.get(url, headers=HEADERS, timeout=15)
        soup = BeautifulSoup(resp.text, "html.parser")
        text_lines = [l.strip() for l in soup.get_text(separator="\n").split("\n") if l.strip()]

        detail: dict = {}

        # Provider / College
        for i, line in enumerate(text_lines):
            if line == "Course Provider:":
                detail["college"] = text_lines[i + 1] if i + 1 < len(text_lines) else ""
                break
            if line.startswith("Course Provider:"):
                detail["college"] = line[len("Course Provider:"):].strip()
                break

        # Location
        for i, line in enumerate(text_lines):
            if line == "Location:":
                detail["location"] = text_lines[i + 1] if i + 1 < len(text_lines) else ""
                break
            if line.startswith("Location:"):
                detail["location"] = line[len("Location:"):].strip()
                break

        # Duration → float years
        for i, line in enumerate(text_lines):
            if line == "Duration":
                dur_text = text_lines[i + 1] if i + 1 < len(text_lines) else ""
                m = re.search(r"(\d+(?:\.\d+)?)\s*year", dur_text, re.I)
                if m:
                    detail["duration_years"] = float(m.group(1))
                break

        # CAO Points — 테이블에서 "Year / Points / 2025 / 605" 패턴
        # text_lines 순회로 "Year" 다음 "Points" 다음 연도 다음 숫자
        for i, line in enumerate(text_lines):
            if line == "Year" and i + 3 < len(text_lines) and text_lines[i + 1] == "Points":
                # i+2 = 연도(예: 2025), i+3 = 포인트
                pts_text = text_lines[i + 3]
                m = re.search(r"(\d{3,4})", pts_text)
                if m:
                    detail["cao_points_2025"] = int(m.group(1))
                break

        return detail

    except Exception as e:
        print(f"    ⚠️  상세 파싱 실패 {url}: {e}")
        return {}


# ── 3. colleges_ie 매핑 로드 ─────────────────────────────────────────────────

def load_college_map() -> dict[str, str]:
    """colleges_ie.name(소문자) → institution_id 매핑."""
    res = supabase.table("colleges_ie").select("institution_id, name").execute()
    mapping = {}
    for row in res.data:
        mapping[row["name"].lower()] = row["institution_id"]
    print(f"  colleges_ie 매핑 로드: {len(mapping)}개")
    return mapping


def match_college(name: str, college_map: dict[str, str]) -> str | None:
    """제공자명 → institution_id 최선 매칭."""
    key = name.lower().strip()
    if key in college_map:
        return college_map[key]
    # 부분 매칭
    for k, v in college_map.items():
        if k in key or key in k:
            return v
    return None


# ── 4. 메인 ─────────────────────────────────────────────────────────────────

def scrape_all():
    print("🇮🇪 Qualifax 스크래핑 시작 (2025 사이트)...\n")

    # colleges_ie 매핑
    college_map = load_college_map()

    # 전체 목록 수집
    print("\n[STEP 1] 코스 목록 수집")
    all_courses = get_all_listings(max_pages=50)
    print(f"\n전체 {len(all_courses)}개 코스 수집")

    # Level 6, 7, 8, 9 필터
    level_filtered = [c for c in all_courses if c.get("nfq_level") in {6, 7, 8, 9}]
    print(f"NFQ Level 6-9 필터 후: {len(level_filtered)}개")
    for lvl in [6, 7, 8, 9]:
        cnt = sum(1 for c in level_filtered if c.get("nfq_level") == lvl)
        print(f"  Level {lvl}: {cnt}개")

    # 상세 파싱
    print("\n[STEP 2] 상세 페이지 파싱")
    results = []
    for i, course in enumerate(level_filtered, 1):
        print(f"  [{i}/{len(level_filtered)}] (Level {course.get('nfq_level')}) {course['title'][:55]}")
        detail = get_course_detail(course["url"])
        record = {**course, **detail}

        # colleges_ie 매칭
        college_name = detail.get("college", "")
        record["institution_id"] = match_college(college_name, college_map)

        results.append(record)
        time.sleep(0.4)

    print(f"\n✅ 총 {len(results)}개 Level 6-9 코스 수집 완료")
    return results


if __name__ == "__main__":
    data = scrape_all()

    # 통계 출력
    matched = sum(1 for d in data if d.get("institution_id"))
    with_points = sum(1 for d in data if d.get("cao_points_2025"))
    print(f"\n📊 통계:")
    print(f"  colleges_ie 매칭: {matched}/{len(data)}")
    print(f"  CAO Points 있음: {with_points}/{len(data)}")

    with open("qualifax_raw_all_levels.json", "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print("💾 qualifax_raw_all_levels.json 저장 완료")

# merge_to_supabase.py — qualifax_raw.json → courses_ie upsert
#
# 수정 사항 (원본 대비):
#   - programs_ie → courses_ie  (이전 단계에서 생성한 테이블)
#   - program_name → title       (실제 JSON 필드명)
#   - qualifax_id  → qualifax_url (URL이 고유 식별자, course_code는 null 있음)
#   - tuition_fee_eur 제거        (Qualifax에 없는 필드)
#   - college/location/cao_points 추가
#   - 자격증명 → .env.local 로드

import os
import json
from pathlib import Path
from supabase import create_client

# ── .env.local 로드 ───────────────────────────────────────────────────────────
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

# ── upsert ────────────────────────────────────────────────────────────────────

def upsert_programs():
    raw_path = Path(__file__).parent.parent / "qualifax_raw.json"
    if not raw_path.exists():
        print("❌ qualifax_raw.json 없음 — scraper_qualifax.py 먼저 실행하세요")
        return

    with open(raw_path, encoding="utf-8") as f:
        programs = json.load(f)
    print(f"📂 qualifax_raw.json 로드: {len(programs)}개\n")

    # colleges_ie 매핑 (institution_id 보완용)
    res = supabase.table("colleges_ie").select("institution_id, name").execute()
    name_to_id = {r["name"].lower(): r["institution_id"] for r in res.data}

    def resolve_id(college_name: str, existing_id) -> str | None:
        if existing_id:
            return existing_id
        key = college_name.lower().strip()
        if key in name_to_id:
            return name_to_id[key]
        for k, v in name_to_id.items():
            if k in key or key in k:
                return v
        return None

    # 레코드 빌드
    batch = []
    for p in programs:
        if not p.get("title"):
            continue
        batch.append({
            "course_code":     p.get("course_code") or None,
            "title":           p["title"],
            "nfq_level":       p.get("nfq_level", 8),
            "course_type":     p.get("course_type") or None,
            "college_name":    p.get("college") or "",
            "institution_id":  resolve_id(p.get("college", ""), p.get("institution_id")),
            "city":            p.get("location") or None,
            "duration_years":  p.get("duration_years") or None,
            "cao_points_2025": p.get("cao_points_2025") or None,
            "qualifax_url":    p["url"],
        })

    print(f"삽입 대상: {len(batch)}개")
    matched = sum(1 for r in batch if r["institution_id"])
    print(f"colleges_ie 매칭: {matched}/{len(batch)} ({matched*100//len(batch)}%)\n")

    # 100개씩 배치 upsert (conflict key: qualifax_url)
    for i in range(0, len(batch), 100):
        chunk = batch[i:i + 100]
        supabase.table("courses_ie").upsert(
            chunk, on_conflict="qualifax_url"
        ).execute()
        print(f"  {min(i + 100, len(batch))}/{len(batch)} upsert 완료", end="\r")

    print(f"\n✅ courses_ie upsert 완료: {len(batch)}개")

if __name__ == "__main__":
    upsert_programs()

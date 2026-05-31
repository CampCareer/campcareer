import os, time, requests
from pathlib import Path
from supabase import create_client

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
API_KEY = os.environ.get("COLLEGE_SCORECARD_API_KEY")
API_URL = "https://api.data.gov/ed/collegescorecard/v1/schools"

FIELDS = [
    "id",
    "latest.earnings.1_yr_after_completion.median",
    "latest.earnings.4_yrs_after_completion.median",
    "latest.earnings.10_yrs_after_entry.median",
]

def fetch_batch(unit_ids):
    params = {
        "id": ",".join(unit_ids),
        "fields": ",".join(FIELDS),
        "api_key": API_KEY,
        "per_page": 100,
    }
    resp = requests.get(API_URL, params=params, timeout=15)
    resp.raise_for_status()
    return resp.json().get("results", [])

def run():
    # 테스트 먼저
    print("🔍 Stanford 테스트...")
    test = fetch_batch(["243744"])
    if test:
        r = test[0]
        print("  keys:", list(r.keys()))
        print("  1yr:", r.get("latest.earnings.1_yr_after_completion.median"))
        print("  4yr:", r.get("latest.earnings.4_yrs_after_completion.median"))
        print("  10yr:", r.get("latest.earnings.10_yrs_after_entry.median"))
    
    colleges = supabase.table("colleges_us")\
        .select("id, unit_id, name")\
        .not_.is_("unit_id", "null")\
        .execute().data

    print(f"\n총 {len(colleges)}개 대학 처리 예정")
    updated = 0

    for i in range(0, len(colleges), 100):
        batch = colleges[i:i+100]
        unit_ids = [str(c["unit_id"]) for c in batch if c.get("unit_id")]
        if not unit_ids:
            continue
        try:
            results = fetch_batch(unit_ids)
            for r in results:
                unit_id = str(r.get("id"))
                # ✅ flat 키로 직접 접근
                v_1yr  = r.get("latest.earnings.1_yr_after_completion.median")
                v_4yr  = r.get("latest.earnings.4_yrs_after_completion.median")
                v_10yr = r.get("latest.earnings.10_yrs_after_entry.median")

                if not any([v_1yr, v_4yr, v_10yr]):
                    continue

                update_data = {}
                if v_1yr:  update_data["earnings_2yr"]  = int(v_1yr)
                if v_4yr:  update_data["earnings_5yr"]  = int(v_4yr)
                if v_10yr: update_data["earnings_10yr"] = int(v_10yr)

                supabase.table("colleges_us")\
                    .update(update_data)\
                    .eq("unit_id", unit_id)\
                    .execute()
                updated += 1

        except Exception as e:
            print(f"  배치 에러: {e}")

        if (i // 100 + 1) % 5 == 0:
            print(f"  [{min(i+100, len(colleges))}/{len(colleges)}] 업데이트: {updated}")
        time.sleep(0.3)

    print(f"\n✅ 완료 — 업데이트: {updated}")

    sample = supabase.table("colleges_us")\
        .select("name, earnings_2yr, earnings_5yr, earnings_10yr")\
        .not_.is_("earnings_2yr", "null")\
        .limit(5).execute()
    print("\n샘플:")
    for c in sample.data:
        print(f"  {c['name'][:35]:35} | 1yr: ${c['earnings_2yr']:,} | 4yr: ${c['earnings_5yr']:,} | 10yr: ${c['earnings_10yr']:,}")

if __name__ == "__main__":
    run()

#!/usr/bin/env python3
"""
Process HEO06.20260626T200627.csv → src/data/ie-graduate-outcomes.json

HEO06: HEA Graduate Outcomes Survey — first destination of graduates,
1 year post-graduation, by ISCED broad field, gender, degree class, and outcome type.

Output: JSON with graduate count and employment rate by ISCED broad field + degree class.
"""

import csv
import json
from collections import defaultdict

INPUT = "temp-ie-geojson/Ireland/HEO06.20260626T200627.csv"
OUTPUT = "src/data/ie-graduate-outcomes.json"

ISCED_DESCRIPTION = {
    "01": "Education",
    "02": "Arts and Humanities",
    "03": "Social Sciences, Journalism and Information",
    "04": "Business, Administration and Law",
    "05": "Natural Sciences, Mathematics and Statistics",
    "06": "Information and Communication Technologies",
    "07": "Engineering, Manufacturing and Construction",
    "08": "Agriculture, Forestry, Fisheries and Veterinary",
    "09": "Health and Welfare",
    "10": "Services",
}

HEO06_TO_ISCED = {v: k for k, v in ISCED_DESCRIPTION.items()}

rows = []

with open(INPUT, newline="", encoding="utf-8-sig") as f:
    reader = csv.DictReader(f)
    for row in reader:
        field = row.get("Field of Study", "").strip()
        gender = row.get("Gender", "").strip()
        degree = row.get("Degree Class", "").strip()
        outcome = row.get("Type of Graduate Outcome", "").strip()
        years_since = row.get("Years Since Graduation", "").strip()
        val_str = row.get("VALUE", "").strip()
        val = int(val_str) if val_str.isdigit() else 0
        if not field or not val:
            continue
        isced_code = HEO06_TO_ISCED.get(field, "")
        rows.append({
            "graduation_year": int(row.get("Graduation Year", "2022")),
            "isced_code": isced_code,
            "field_name": field,
            "gender": gender,
            "degree_class": degree,
            "outcome_type": outcome,
            "years_since_graduation": int(years_since) if years_since.isdigit() else 0,
            "graduates": val,
        })

def make_key(r, include_degree=False):
    """Build aggregation key from a record."""
    parts = [r["isced_code"] or r["field_name"]]
    if include_degree:
        parts.append(r["degree_class"])
    return "|".join(parts)

def build_summary(rows, label_filter=None, include_degree=False):
    """Build field-level summary with optional filter function."""
    by_field = defaultdict(lambda: defaultdict(int))
    for r in rows:
        if label_filter and not label_filter(r):
            continue
        key = make_key(r, include_degree=include_degree)
        by_field[key][r["outcome_type"]] += r["graduates"]

    summaries = []
    for key, counts in by_field.items():
        total = counts.get("All Graduate Outcomes", 0)
        employed = counts.get("Employment only", 0)
        education = counts.get("Education only", 0)
        emp_edu = counts.get("Employment and Education", 0)
        neither = counts.get("Neither Employment nor Education", 0)
        not_captured = counts.get("Not Captured", 0)
        working = employed + emp_edu

        parts = key.split("|")
        isced = parts[0] if len(parts[0]) == 2 else ""
        field_name = ISCED_DESCRIPTION.get(parts[0], parts[0])
        entry = {
            "isced_code": isced,
            "field_name": field_name,
            "total_graduates": total,
            "employment_only": employed,
            "education_only": education,
            "employment_and_education": emp_edu,
            "neither_employment_nor_education": neither,
            "not_captured": not_captured,
            "employment_rate_pct": round(working / total * 100, 1) if total else 0.0,
            "education_rate_pct": round(education / total * 100, 1) if total else 0.0,
            "unemployment_rate_pct": round(neither / total * 100, 1) if total else 0.0,
        }
        if include_degree and len(parts) > 1:
            entry["degree_class"] = parts[1]
        summaries.append(entry)
    summaries.sort(key=lambda x: (x["isced_code"], x.get("degree_class", "")))
    return summaries

# Aggregate summaries
field_summaries = build_summary(rows, lambda r: r["gender"] == "All genders" and r["degree_class"] == "All degree classes")

# Degree class breakdown
degree_class_summaries = build_summary(rows, lambda r: r["gender"] == "All genders" and r["degree_class"] != "All degree classes", include_degree=True)

result = {
    "source": "CSO HEO06 – HEA Graduate Outcomes Survey 2022",
    "source_url": "https://data.cso.ie/table/HEO06",
    "notes": "First destination of graduates 9 months after graduation (class of 2022). National-level aggregates by ISCED broad field.",
    "last_updated": "2026-06-26",
    "total_graduates_all_fields": sum(f["total_graduates"] for f in field_summaries if f["isced_code"]),
    "field_summaries": field_summaries,
    "degree_class_summaries": degree_class_summaries,
    "raw_records": rows,
}

with open(OUTPUT, "w", encoding="utf-8") as f:
    json.dump(result, f, ensure_ascii=False, indent=2)

print(f"Written {OUTPUT}")
print(f"  {len(field_summaries)} field summaries ({sum(f['total_graduates'] for f in field_summaries if f['isced_code'])} total graduates)")
print(f"  {len(degree_class_summaries)} degree-class summaries")
print(f"  {len(rows)} raw records")

print()
print("=== Field Employment Rates ===")
print(f"{'Field':<50} {'Total':>8} {'Emp%':>6} {'Edu%':>6} {'Unemp%':>7}")
print("-" * 77)
for f in field_summaries:
    if f["isced_code"]:
        print(f"{f['field_name']:<50} {f['total_graduates']:>8} {f['employment_rate_pct']:>6} {f['education_rate_pct']:>6} {f['unemployment_rate_pct']:>7}")

#!/usr/bin/env python3
"""
Build public/region-occupations.json — region (SA4) level occupation-group data:

  demand: top ANZSCO 2-digit occupation groups by internet job vacancies
          (JSA Internet Vacancy Index, latest month). Metro SA4s (no SA4-level
          IVI) fall back to their state's "Greater Capital" GCCSA.
  pay:    top ANZSCO 2-digit groups by number of high-income earners
          ($104k+/yr) (ABS 2021 Census, INCP by SA4 by OCCP).

Inputs (not committed — large source files kept in ~/Downloads):
  internet_vacancies_anzsco2_occupations_gccsa_and_sa4_regions_-_april_2026.xlsx
  1.csv 2.csv 3.csv 4.csv  (ABS TableBuilder: INCP high-income bands x SA4 x OCCP)

Output: public/region-occupations.json keyed by SA4 code (matches SA4_BY_STATE).
"""
import csv
import json
import os
import re

import openpyxl

DL = os.path.expanduser("~/Downloads")
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
IVI = os.path.join(DL, "internet_vacancies_anzsco2_occupations_gccsa_and_sa4_regions_-_april_2026.xlsx")
CENSUS = [os.path.join(DL, f"{i}.csv") for i in (1, 2, 3, 4)]
OUT = os.path.join(ROOT, "public", "region-occupations.json")
TOP_N = 12

# ABS Census high-income bands present in the export ($104k+/yr).
HIGH_BANDS = {
    "$2,000-$2,999 ($104,000-$155,999)",
    "$3,000-$3,499 ($156,000-$181,999)",
    "$3,500 or more ($182,000 or more)",
}
SKIP_OCC = re.compile(r"nfd$|^Total$|^Not applicable$|Inadequately|Not stated", re.I)


def our_sa4():
    """code -> (name, state) from src/data/sa4-regions.ts"""
    ts = open(os.path.join(ROOT, "src/data/sa4-regions.ts")).read()
    code_name, code_state, cur = {}, {}, None
    for line in ts.split("\n"):
        m = re.match(r'\s*"([A-Z]{2,3})":\s*\[', line)
        if m:
            cur = m.group(1)
            continue
        c = re.search(r'code:\s*"(\d+)"', line)
        n = re.search(r'name:\s*"([^"]+)"', line)
        if c and n and cur:
            code_name[c.group(1)] = n.group(1)
            code_state[c.group(1)] = cur
    return code_name, code_state


def build_demand(code_state):
    wb = openpyxl.load_workbook(IVI, read_only=True, data_only=True)
    ws = wb["Averaged"]
    rows = ws.iter_rows(values_only=True)
    header = next(rows)
    last = len(header) - 1  # latest month column (e.g. 2026-04-01)
    month = str(header[last])[:7]

    # state -> Greater Capital GCCSA code (one per state)
    state_gccsa = {}
    sa4_vac, gccsa_vac, title = {}, {}, {}
    # second pass needs full data; collect first
    data = [header] + list(rows)
    for r in data[1:]:
        lvl, st, code, anz, t, val = r[4], r[1], str(r[3]), str(r[5]), r[6], r[last]
        if lvl == "GCCSA" and "Greater" in str(r[2]) or (lvl == "GCCSA" and st == "ACT"):
            state_gccsa[st] = code
        if anz.isdigit() and len(anz) == 2:  # ANZSCO 2-digit sub-major only
            title[anz] = t
            v = int(val or 0)
            if lvl == "SA4":
                sa4_vac.setdefault(code, {})[anz] = v
            elif lvl == "GCCSA":
                gccsa_vac.setdefault(code, {})[anz] = v

    def top(vmap):
        items = [(c, title.get(c, c), v) for c, v in vmap.items() if v > 0]
        items.sort(key=lambda x: x[2], reverse=True)
        return [{"code": c, "title": t, "value": v} for c, t, v in items[:TOP_N]]

    out = {}
    for code, state in code_state.items():
        if code in sa4_vac:
            out[code] = {"list": top(sa4_vac[code]), "area": None}
        else:  # metro SA4 -> state's Greater Capital GCCSA
            g = state_gccsa.get(state)
            if g and g in gccsa_vac:
                out[code] = {"list": top(gccsa_vac[g]), "area": "metro"}
    return out, month


def build_pay(name_to_code):
    cell = {}  # (region, occ, band) -> count (files overlap -> dedup)
    for fn in CENSUS:
        with open(fn, newline="", encoding="utf-8-sig") as f:
            rd = list(csv.reader(f))
            hi = next(i for i, r in enumerate(rd) if r and r[0] == "Counting")
            for r in rd[hi + 1:]:
                if len(r) >= 5 and r[0]:
                    cell[(r[2], r[3], r[1])] = int(r[4] or 0)
    agg = {}  # region -> occ -> high earners
    for (reg, occ, band), c in cell.items():
        if band not in HIGH_BANDS or SKIP_OCC.search(occ):
            continue
        agg.setdefault(reg, {})[occ] = agg.get(reg, {}).get(occ, 0) + c
    out = {}
    for reg, occs in agg.items():
        code = name_to_code.get(reg)
        if not code:
            continue
        items = sorted(occs.items(), key=lambda x: x[1], reverse=True)
        out[code] = [{"title": t, "value": v} for t, v in items[:TOP_N] if v > 0]
    return out


def main():
    code_name, code_state = our_sa4()
    name_to_code = {v: k for k, v in code_name.items()}
    demand, month = build_demand(code_state)
    pay = build_pay(name_to_code)

    result = {}
    for code in code_name:
        d = demand.get(code)
        result[code] = {
            "demand": d["list"] if d else [],
            "demandMetro": bool(d and d["area"] == "metro"),
            "pay": pay.get(code, []),
        }
    with open(OUT, "w") as f:
        json.dump(result, f, separators=(",", ":"))
    size = os.path.getsize(OUT)
    have_d = sum(1 for c in result if result[c]["demand"])
    have_p = sum(1 for c in result if result[c]["pay"])
    print(f"wrote {OUT} ({size/1024:.0f} KB) for {len(result)} regions")
    print(f"IVI latest month: {month} | regions with demand: {have_d} | with pay: {have_p}")
    print("sample 101 demand:", [x["title"] for x in result["101"]["demand"][:4]])
    print("sample 101 pay:   ", [x["title"] for x in result["101"]["pay"][:4]])
    print("sample 117 (Sydney City) metro?", result["117"]["demandMetro"],
          "| pay:", [x["title"] for x in result["117"]["pay"][:3]])


if __name__ == "__main__":
    main()

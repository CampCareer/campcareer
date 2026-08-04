"""Discovery / coverage report for the five-country official geography packages.

Writes coverage_report.json (machine-readable) and coverage_report.md (human
readable) into the pipeline output directory. The report aggregates per-country
entity counts, selection distribution and source lineage so a reviewer can
verify the top-100 selection without opening each package.
"""

import json
import os
from datetime import datetime, timezone

SCHEMA = "campcareer.geography.coverage_report.v1"


def now_utc_iso():
    return datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")


def build_report(country_results, package_date):
    countries = {}
    totals = {
        "countries": len(country_results),
        "packages": 0,
        "candidates": 0,
        "cities_selected": 0,
        "cities_total": 0,
        "regions": 0,
        "sources": 0,
    }
    for res in country_results:
        cc = res["country_code"]
        e = res["entity_counts"]
        countries[cc] = {
            "package_dir": res["package_dir"],
            "package_date": package_date,
            "overall_status": res["overall_status"],
            "record_counts": res["record_counts"],
            "candidate_count": res["candidate_count"],
            "source_count": res["source_count"],
            "sources": res["sources"],
            "entity_counts": e,
            "selection": res["selection"],
            "join_metrics": res["join_metrics"],
            "notes": res["notes"],
        }
        totals["packages"] += 1
        totals["candidates"] += res["candidate_count"]
        totals["cities_selected"] += e["cities_selected"]
        totals["cities_total"] += e["cities_total"]
        totals["regions"] += e["regions"]
        totals["sources"] += res["source_count"]
    return {
        "schema": SCHEMA,
        "generated_at": now_utc_iso(),
        "package_date": package_date,
        "selection_policy": {"limit": 100, "per_region_cap": None},
        "totals": totals,
        "countries": countries,
    }


def render_markdown(report):
    lines = [
        "# Five-country official geography - coverage report",
        "",
        "Package date: %s  " % report["package_date"],
        "Generated: %s  " % report["generated_at"],
        "",
        "Selection policy: top-%d cities per country (population descending, no per-region cap)."
        % report["selection_policy"]["limit"],
        "",
        "| Country | status | regions | cities (total) | cities (selected) | "
        "candidates | sources |",
        "|---|---|---|---|---|---|---|",
    ]
    t = report["totals"]
    for cc in ["US", "CA", "IE", "GB", "AU"]:
        c = report["countries"].get(cc)
        if not c:
            continue
        e = c["entity_counts"]
        lines.append("| %s | %s | %d | %d | %d | %d | %d |" % (
            cc, c["overall_status"], e["regions"], e["cities_total"],
            e["cities_selected"], c["candidate_count"], c["source_count"]))
    lines.append("| **Total** | | **%d** | **%d** | **%d** | **%d** | **%d** |"
                 % (t["regions"], t["cities_total"], t["cities_selected"],
                    t["candidates"], t["sources"]))
    lines += ["", "## Per-country detail", ""]
    for cc in ["US", "CA", "IE", "GB", "AU"]:
        c = report["countries"].get(cc)
        if not c:
            continue
        e = c["entity_counts"]
        lines.append("### %s  " % cc)
        lines.append("Package: `%s`  " % c["package_dir"])
        lines.append("Status: %s  " % c["overall_status"])
        lines.append("Records: %s  " % json.dumps(c["record_counts"]))
        lines.append("")
        lines.append("Sources (%d):" % c["source_count"])
        for sid in c["sources"]:
            lines.append("- `%s`" % sid)
        lines.append("")
        dist = c["selection"].get("region_distribution", {})
        cap = report["selection_policy"].get("per_region_cap")
        if cap:
            lines.append("City selection by region (cap %d):" % cap)
        else:
            lines.append("City selection by population (top-%d):"
                         % report["selection_policy"]["limit"])
        for region, d in sorted(dist.items()):
            lines.append("- %s: %d/%d selected" % (region, d["selected"],
                                                   d["available"]))
        if c["join_metrics"]:
            lines.append("")
            lines.append("Join metrics:")
            for m in c["join_metrics"]:
                lines.append("- %s: %s (%s)" % (m["name"], m["matched"],
                                                m["method"]))
        if c["notes"]:
            lines.append("")
            lines.append("Notes:")
            for n in c["notes"]:
                lines.append("- %s" % n)
        lines.append("")
    return "\n".join(lines)


def write_report(country_results, package_date, out_dir):
    os.makedirs(out_dir, exist_ok=True)
    report = build_report(country_results, package_date)
    with open(os.path.join(out_dir, "coverage_report.json"), "w") as fh:
        json.dump(report, fh, indent=2)
        fh.write("\n")
    with open(os.path.join(out_dir, "coverage_report.md"), "w") as fh:
        fh.write(render_markdown(report))
    return report

#!/usr/bin/env python3
"""Five-country official geography pipeline CLI.

Subcommands:
  retrieve   Ensure raw artifacts for all sources (verify or download).
  build      Run the full pipeline: retrieve -> parse -> select -> package.
  coverage   Generate the discovery/coverage report from built packages.
  validate   Run framework validation commands against built packages.

Example:
  python runner.py build --raw .raw --date 2026-08-04 --seed <existing-raw>
  python runner.py coverage --raw .raw --date 2026-08-04
"""

import argparse
import json
import os
import sys

_HERE = os.path.dirname(os.path.abspath(__file__))
if _HERE not in sys.path:
    sys.path.insert(0, _HERE)

from builder import (build_country_manifest, ensure_raw,  # noqa: E402
                     now_utc_iso, run_country)
from sources import SOURCES, sources_for_country  # noqa: E402

import coverage_report  # noqa: E402

COUNTRIES = ["US", "CA", "IE", "GB", "AU"]

DEFAULT_RAW = os.path.join(_HERE, ".raw")


def _print(obj):
    print(json.dumps(obj, ensure_ascii=False, indent=2))


def _parse_countries(value):
    if not value:
        return list(COUNTRIES)
    out = []
    for part in value.split(","):
        cc = part.strip().upper()
        if cc not in COUNTRIES:
            raise ValueError("unknown country code %r (expected %s)"
                             % (part, ",".join(COUNTRIES)))
        out.append(cc)
    return out


def cmd_retrieve(args):
    info = ensure_raw(args.raw, seed_dir=args.seed, force=args.force)
    ok = sum(1 for i in info.values() if i["ok"])
    _print({"command": "retrieve",
            "raw_dir": args.raw,
            "sources_total": len(info),
            "sources_ok": ok,
            "sources": info})
    return 0 if ok == len(info) else 1


def cmd_build(args):
    date = args.date or now_utc_iso()[:10]
    countries = _parse_countries(args.countries)
    results = []
    for cc in countries:
        summary = run_country(cc, args.raw, "%sT00:00:00Z" % date,
                              seed_dir=args.seed, force=args.force)
        results.append(summary)
        _print({"command": "build",
                "country": cc,
                "package_dir": summary["package_dir"],
                "overall_status": summary["overall_status"],
                "record_counts": summary["record_counts"]})
    report_dir = os.path.join("data", "candidates", "geography",
                              "five-country-official-v1")
    report = coverage_report.write_report(results, date, report_dir)
    _print({"command": "coverage",
            "report_dir": report_dir,
            "totals": report["totals"]})
    return 0


def cmd_coverage(args):
    date = args.date or now_utc_iso()[:10]
    root = os.path.join("data", "candidates", "geography")
    results = []
    for cc in COUNTRIES:
        package_dir = os.path.join(root, cc, date)
        manifest_path = os.path.join(package_dir, "source_manifest.json")
        if not os.path.exists(manifest_path):
            print("WARNING: no package at %s; skipping" % package_dir,
                  file=sys.stderr)
            continue
        with open(manifest_path) as fh:
            sources = json.load(fh).get("sources", [])
        with open(os.path.join(package_dir, "package_manifest.json")) as fh:
            pkg = json.load(fh)
        summary_path = os.path.join(args.raw, ".run", cc, "summary.json")
        if os.path.exists(summary_path):
            with open(summary_path) as fh:
                results.append(json.load(fh))
            continue
        entity_counts = {"country": 0, "regions": 0, "cities_total": 0,
                         "cities_selected": 0}
        dist = {}
        city_limit = 100
        with open(os.path.join(package_dir, "candidate_records.jsonl")) as fh:
            n = 0
            for line in fh:
                if not line.strip():
                    continue
                n += 1
                rec = json.loads(line)
                pt = rec["payload"]["place_type"]
                if pt == "country":
                    entity_counts["country"] += 1
                elif pt == "region":
                    entity_counts["regions"] += 1
                elif pt == "city":
                    entity_counts["cities_total"] += 1
                    if rec["payload"]["selection_rank"] is not None:
                        entity_counts["cities_selected"] += 1
                    code = rec["payload"]["parent_region_code"]
                    d = dist.setdefault(code or "none", {"selected": 0,
                                                         "available": 0})
                    d["available"] += 1
                    if rec["payload"]["selection_rank"] is not None:
                        d["selected"] += 1
        results.append({
            "country_code": cc,
            "package_dir": package_dir,
            "package_date": date,
            "overall_status": pkg.get("record_status_counts", {}),
            "record_counts": pkg.get("record_status_counts", {}),
            "candidate_count": n,
            "source_count": len(sources),
            "sources": [s.get("source_id") for s in sources],
            "entity_counts": entity_counts,
            "selection": {"limit": city_limit, "per_region_cap": 20,
                          "selected_cities": entity_counts["cities_selected"],
                          "region_distribution": dist},
            "join_metrics": [],
            "notes": [],
        })
    report = coverage_report.write_report(results, date, args.out)
    _print({"command": "coverage", "report_dir": args.out,
            "totals": report["totals"]})
    return 0


def cmd_validate(args):
    framework = os.path.join(_HERE, "..", "common-ingestion")
    sys.path.insert(0, framework)
    from runner import (cmd_manifest_validate, cmd_checksum_verify,
                        cmd_candidate_validate)
    import argparse as _argparse

    date = args.date or now_utc_iso()[:10]
    root = os.path.join("data", "candidates", "geography")
    exit_code = 0
    for cc in _parse_countries(args.countries):
        package_dir = os.path.join(root, cc, date)
        if not os.path.exists(os.path.join(package_dir, "source_manifest.json")):
            print("WARNING: no package at %s" % package_dir, file=sys.stderr)
            continue
        m = _argparse.Namespace(manifest=os.path.join(package_dir,
                                                      "source_manifest.json"))
        code = cmd_manifest_validate(m)
        exit_code = max(exit_code, code)
        v = _argparse.Namespace(directory=package_dir,
                                checksum_name="SHA256SUMS.txt")
        code = cmd_checksum_verify(v)
        exit_code = max(exit_code, code)
        c = _argparse.Namespace(
            records=os.path.join(package_dir, "candidate_records.jsonl"),
            manifest=os.path.join(package_dir, "source_manifest.json"))
        code = cmd_candidate_validate(c)
        exit_code = max(exit_code, code)
    return exit_code


def main(argv=None):
    parser = argparse.ArgumentParser(
        prog="five-country runner",
        description="Five-country official geography data pipeline")
    sub = parser.add_subparsers(dest="command", required=True)

    p1 = sub.add_parser("retrieve")
    p1.add_argument("--raw", default=DEFAULT_RAW)
    p1.add_argument("--seed")
    p1.add_argument("--force", action="store_true")
    p1.set_defaults(func=cmd_retrieve)

    p2 = sub.add_parser("build")
    p2.add_argument("--raw", default=DEFAULT_RAW)
    p2.add_argument("--seed")
    p2.add_argument("--date")
    p2.add_argument("--countries", default=",".join(COUNTRIES))
    p2.add_argument("--force", action="store_true")
    p2.set_defaults(func=cmd_build)

    p3 = sub.add_parser("coverage")
    p3.add_argument("--raw", default=DEFAULT_RAW)
    p3.add_argument("--date")
    p3.add_argument("--out",
                    default=os.path.join("data", "candidates", "geography",
                                         "five-country-official-v1"))
    p3.set_defaults(func=cmd_coverage)

    p4 = sub.add_parser("validate")
    p4.add_argument("--raw", default=DEFAULT_RAW)
    p4.add_argument("--date")
    p4.add_argument("--countries", default=",".join(COUNTRIES))
    p4.set_defaults(func=cmd_validate)

    args = parser.parse_args(argv)
    try:
        return args.func(args)
    except (ValueError, RuntimeError, FileExistsError, OSError) as exc:
        print("ERROR: %s" % exc, file=sys.stderr)
        return 1


if __name__ == "__main__":
    sys.exit(main())

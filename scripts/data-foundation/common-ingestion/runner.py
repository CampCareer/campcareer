#!/usr/bin/env python3
"""10.7B Common Source Ingestion Framework v1 - runner CLI.

Subcommands:
  manifest-validate <manifest.json>
      Validate a source manifest (single object or {sources:[...]} wrapper).
  checksum-generate <dir> [--output SHA256SUMS.txt]
      Generate a sorted SHA256SUMS.txt for a directory.
  checksum-verify <dir>
      Verify a SHA256SUMS.txt for a directory.
  candidate-validate <records.jsonl> [--manifest manifest.json]
      Validate candidate records (raw parser output) without normalizing.
  package-build --manifest m.json --records r.jsonl
                 --domain <d> --country <cc> --date <YYYY-MM-DD>
                 [--out <dir>] [--force]
      Build a candidate package at data/candidates/<domain>/<country>/<date>/.
  report-generate <package-dir>
      Regenerate validation_report.json inside an existing package.
  duplicate-queue <records.jsonl> [--manifest m.json] [--out queue.csv]
      Emit the duplicate review queue for candidate records.

The framework never writes to a production database. import_status is always
candidate_only. UK input normalizes to GB with the raw value preserved.
"""

import argparse
import json
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from checksum import verify_checksums, write_checksums  # noqa: E402
from identity import detect_duplicate_source_keys, \
    render_duplicate_review_queue  # noqa: E402
from manifest import load_manifest, validate_source_manifest  # noqa: E402
from package import (build_package, build_validation_report,  # noqa: E402
                     load_jsonl, load_sources)
from validation import normalize_record, validate_record  # noqa: E402


def _print(obj):
    print(json.dumps(obj, ensure_ascii=False, indent=2))


def cmd_manifest_validate(args):
    kind, data = load_manifest(args.manifest)
    if kind == "single":
        results = [validate_source_manifest(data)]
    else:
        results = [validate_source_manifest(m) for m in data.get("sources", [])]
    ok = all(r["valid"] for r in results)
    _print({"command": "manifest-validate",
            "manifest": args.manifest,
            "valid": ok,
            "source_count": len(results),
            "sources": results})
    return 0 if ok else 1


def cmd_checksum_generate(args):
    count = write_checksums(args.directory, args.output)
    _print({"command": "checksum-generate",
            "directory": args.directory,
            "output": args.output,
            "files_hashed": count})
    return 0


def cmd_checksum_verify(args):
    result = verify_checksums(args.directory, args.checksum_name)
    _print({"command": "checksum-verify",
            "directory": args.directory,
            "checksum_name": args.checksum_name,
            **result})
    return 0 if result["ok"] else 1


def cmd_candidate_validate(args):
    raw = load_jsonl(args.records)
    manifest_sources = None
    if args.manifest:
        manifest_sources = {m.get("source_id"): m
                            for m in load_sources(args.manifest)}
    duplicate_groups, duplicate_keys = detect_duplicate_source_keys(
        [r for (_ln, r) in raw])
    results = []
    for _lineno, rec in raw:
        _, res = validate_record(rec, manifest_sources, duplicate_keys, len(results))
        results.append({"candidate_id": rec.get("candidate_id"),
                        "status": res["status"],
                        "failures": res["failures"],
                        "warnings": res["warnings"]})
    from validation import aggregate_status
    overall = aggregate_status([r for r in results]) if results else "invalid"
    _print({"command": "candidate-validate",
            "records": args.records,
            "overall_status": overall,
            "record_count": len(results),
            "records": results})
    return 0 if overall in ("valid", "valid_with_warnings") else 1


def cmd_package_build(args):
    if not args.out:
        country = args.country.upper()
        args.out = os.path.join("data", "candidates", args.domain, country,
                                args.date)
    result = build_package(args.manifest, args.records, args.domain, args.country,
                           args.date, args.out, force=args.force)
    _print({"command": "package-build",
            "output_dir": result["output_dir"],
            "overall_status": result["overall_status"],
            "record_counts": result["record_counts"],
            "candidate_count": result["candidate_count"],
            "source_count": result["source_count"]})
    return 0


def cmd_report_generate(args):
    package_dir = args.package_dir
    with open(os.path.join(package_dir, "source_manifest.json")) as fh:
        manifest_data = json.load(fh)
    sources = manifest_data.get("sources", [manifest_data])
    with open(os.path.join(package_dir, "candidate_records.jsonl")) as fh:
        records = [json.loads(line) for line in fh if line.strip()]
    with open(os.path.join(package_dir, "package_manifest.json")) as fh:
        package_manifest = json.load(fh)
    manifest_sources = {m.get("source_id"): m for m in sources}
    manifest_results = [validate_source_manifest(m) for m in sources]
    from checksum import parse_checksum
    checksum_results = [{"source_id": m.get("source_id"),
                         "well_formed": parse_checksum(m.get("checksum"))["well_formed"]}
                        for m in sources]
    record_results = [{"status": r.get("validation_status") or "unknown",
                       "failures": {}, "warnings": {}}
                      for r in records]
    report = build_validation_report(package_dir, package_manifest, records,
                                     record_results, manifest_results,
                                     checksum_results, manifest_sources)
    with open(os.path.join(package_dir, "validation_report.json"), "w") as fh:
        json.dump(report, fh, indent=2)
        fh.write("\n")
    _print({"command": "report-generate",
            "package_dir": package_dir,
            "overall_status": report["overall_status"]})
    return 0


def cmd_duplicate_queue(args):
    raw = load_jsonl(args.records)
    manifest_sources = None
    if args.manifest:
        manifest_sources = {m.get("source_id"): m
                            for m in load_sources(args.manifest)}
    records = [normalize_record(r, manifest_sources) for (_ln, r) in raw]
    groups, keys = detect_duplicate_source_keys(records)
    csv_text = render_duplicate_review_queue(records, groups)
    if args.out:
        with open(args.out, "w") as fh:
            fh.write(csv_text)
        _print({"command": "duplicate-queue",
                "output": args.out,
                "duplicate_groups": len(groups)})
    else:
        print(csv_text, end="")
    return 0


def main(argv=None):
    parser = argparse.ArgumentParser(
        prog="runner.py",
        description="10.7B Common Source Ingestion Framework v1 runner")
    sub = parser.add_subparsers(dest="command", required=True)

    p1 = sub.add_parser("manifest-validate")
    p1.add_argument("manifest")
    p1.set_defaults(func=cmd_manifest_validate)

    p2 = sub.add_parser("checksum-generate")
    p2.add_argument("directory")
    p2.add_argument("--output", default="SHA256SUMS.txt")
    p2.set_defaults(func=cmd_checksum_generate)

    p2b = sub.add_parser("checksum-verify")
    p2b.add_argument("directory")
    p2b.add_argument("--checksum-name", default="SHA256SUMS.txt")
    p2b.set_defaults(func=cmd_checksum_verify)

    p3 = sub.add_parser("candidate-validate")
    p3.add_argument("records")
    p3.add_argument("--manifest")
    p3.set_defaults(func=cmd_candidate_validate)

    p4 = sub.add_parser("package-build")
    p4.add_argument("--manifest", required=True)
    p4.add_argument("--records", required=True)
    p4.add_argument("--domain", required=True)
    p4.add_argument("--country", required=True)
    p4.add_argument("--date", required=True)
    p4.add_argument("--out")
    p4.add_argument("--force", action="store_true")
    p4.set_defaults(func=cmd_package_build)

    p5 = sub.add_parser("report-generate")
    p5.add_argument("package_dir")
    p5.set_defaults(func=cmd_report_generate)

    p6 = sub.add_parser("duplicate-queue")
    p6.add_argument("records")
    p6.add_argument("--manifest")
    p6.add_argument("--out")
    p6.set_defaults(func=cmd_duplicate_queue)

    args = parser.parse_args(argv)
    try:
        return args.func(args)
    except FileExistsError as exc:
        print("ERROR: %s" % exc, file=sys.stderr)
        return 1
    except (ValueError, KeyError, json.JSONDecodeError, OSError) as exc:
        print("ERROR: %s" % exc, file=sys.stderr)
        return 1


if __name__ == "__main__":
    sys.exit(main())

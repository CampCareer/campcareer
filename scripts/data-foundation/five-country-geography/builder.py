"""Pipeline driver: retrieve sources, parse, select, build candidate packages.

For each country this module:
  1. ensures every raw artifact exists in the raw dir (verify or download),
  2. assembles the 10.7B source manifest list for the package,
  3. runs the country parser,
  4. maps country + regions + top-100 cities to candidate records,
  5. delegates the package build to the common-ingestion framework.

Pipeline-only source keys (download_url, kind, stage, zip_member, api) are
stripped from the manifests written into packages.
"""

import json
import os
import sys

_HERE = os.path.dirname(os.path.abspath(__file__))
_FRAMEWORK = os.path.join(_HERE, "..", "common-ingestion")

if _FRAMEWORK not in sys.path:
    sys.path.insert(0, _FRAMEWORK)
if _HERE not in sys.path:
    sys.path.insert(0, _HERE)

from sources import SOURCES, BY_ID, sources_for_country  # noqa: E402

from parsers import PARSERS  # noqa: E402

import mapper  # noqa: E402

from retrieve import ensure_source, manifest_from_source  # noqa: E402

from package import build_package  # noqa: E402

PIPELINE_KEYS = {"download_url", "kind", "stage", "zip_member", "api",
                 "manifest_skip"}

PARSER_VERSION = "1.0.0"
CANDIDATE_SCHEMA_VERSION = "1.0.0"


def now_utc_iso():
    from datetime import datetime, timezone
    return datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")


def ensure_raw(raw_dir, seed_dir=None, force=False):
    """Retrieve/verify every source artifact; returns per-source retrieval info.

    info[source_id] = {"checksum": "sha256:...", "file_size": int,
                       "reused": bool, "ok": bool, "error": str|None}
    """
    info = {}
    for source in SOURCES:
        try:
            cs, size, reused = ensure_source(raw_dir, source,
                                             seed_dir=seed_dir, force=force)
            info[source["source_id"]] = {
                "checksum": cs, "file_size": size, "reused": reused, "ok": True,
                "error": None,
            }
        except Exception as exc:
            info[source["source_id"]] = {
                "checksum": None, "file_size": None, "reused": False,
                "ok": False, "error": str(exc),
            }
    return info


def build_country_manifest(cc, retrieval, retrieved_at):
    """Source manifest list for one country package (pipeline keys stripped)."""
    manifests = []
    for source in sources_for_country(cc):
        sid = source["source_id"]
        entry = {k: v for k, v in source.items() if k not in PIPELINE_KEYS}
        entry["retrieved_at"] = retrieved_at
        entry["reviewed_at"] = retrieved_at
        entry["parser_version"] = PARSER_VERSION
        entry["candidate_schema_version"] = CANDIDATE_SCHEMA_VERSION
        info = retrieval.get(sid, {})
        if info.get("checksum"):
            entry["checksum"] = info["checksum"]
        if info.get("file_size") is not None:
            entry["file_size"] = info["file_size"]
        if entry.get("download_url") is None:
            entry.pop("download_url", None)
        manifests.append(entry)
    return manifests


def run_country(cc, raw_dir, retrieved_at, seed_dir=None, out_dir=None,
                 force=False, limit=100):
    """Run the full pipeline for one country; returns a build summary dict."""
    retrieval = ensure_raw(raw_dir, seed_dir=seed_dir, force=force)
    missing = [sid for sid, info in retrieval.items() if not info["ok"]]
    if missing:
        raise RuntimeError(
            "retrieval failed for sources: %s" % ", ".join(missing))

    parsed = PARSERS[cc](raw_dir)

    records, selection = mapper.build_country_records(parsed, cc,
                                                         retrieved_at)

    manifest_dir = os.path.join(raw_dir, ".run", cc)
    os.makedirs(manifest_dir, exist_ok=True)
    manifest_path = os.path.join(manifest_dir, "source_manifest.json")
    records_path = os.path.join(manifest_dir, "candidate_records.jsonl")

    manifests = build_country_manifest(cc, retrieval, retrieved_at)
    with open(manifest_path, "w") as fh:
        json.dump({"sources": manifests}, fh, indent=2)
    with open(records_path, "w") as fh:
        for rec in records:
            fh.write(json.dumps(rec, ensure_ascii=False) + "\n")

    result = build_package(
        manifest_path, records_path, "geography", cc, retrieved_at[:10],
        out_dir or os.path.join("data", "candidates", "geography", cc,
                                retrieved_at[:10]),
        force=force)

    summary = {
        "country_code": cc,
        "package_dir": result["output_dir"],
        "overall_status": result["overall_status"],
        "record_counts": result["record_counts"],
        "candidate_count": result["candidate_count"],
        "source_count": result["source_count"],
        "entity_counts": {
            "country": 1 if parsed.get("country") else 0,
            "regions": len(parsed.get("regions", [])),
            "cities_total": len(parsed.get("cities", [])),
            "cities_selected": selection["selected_cities"],
        },
        "selection": selection,
        "join_metrics": parsed.get("join_metrics", []),
        "notes": parsed.get("notes", []),
        "sources": [m["source_id"] for m in manifests],
    }
    with open(os.path.join(manifest_dir, "summary.json"), "w") as fh:
        json.dump(summary, fh, indent=2, ensure_ascii=False)

    return summary

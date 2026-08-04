"""10.9A AU Geography Controlled Import Tool v1 — candidate validation.

Validates the AU candidate package structure and content.
Reuses the common-ingestion framework for schema/checksum/manifest validation.
"""

import json
import sys
from pathlib import Path
from typing import Any

# Add common-ingestion framework to path
_FRAMEWORK_DIR = Path(__file__).resolve().parents[4] / "common-ingestion"
sys.path.insert(0, str(_FRAMEWORK_DIR))

from schemas import REQUIRED_PACKAGE_FILES  # noqa: E402
from manifest import validate_source_manifest  # noqa: E402
from checksum import parse_checksum  # noqa: E402


def parse_candidate_records(path: Path) -> list[dict[str, Any]]:
    records = []
    with open(path) as fh:
        for lineno, line in enumerate(fh, 1):
            line = line.strip()
            if not line:
                continue
            try:
                records.append(json.loads(line))
            except json.JSONDecodeError as e:
                raise ValueError(
                    f"candidate_records.jsonl line {lineno}: JSON parse error: {e}"
                ) from e
    return records


def sha256_file(path: Path) -> str:
    import hashlib

    h = hashlib.sha256()
    with open(path, "rb") as fh:
        for chunk in iter(lambda: fh.read(8192), b""):
            h.update(chunk)
    return h.hexdigest()


def validate_candidate_package(package_path: Path) -> dict[str, Any]:
    """Validate the candidate package structure and content."""
    results: dict[str, Any] = {
        "package_exists": True,
        "errors": [],
        "warnings": [],
        "candidate_count": 0,
        "country_count": 0,
        "region_count": 0,
        "city_count": 0,
        "all_country_au": True,
        "no_uk_reference": True,
        "checksum_valid": False,
        "manifest_valid": False,
        "duplicate_source_keys": [],
        "records": [],
        "source_manifest": None,
        "place_types": [],
    }

    # Check package files exist
    for required_file in REQUIRED_PACKAGE_FILES:
        fpath = package_path / required_file
        if not fpath.exists():
            results["package_exists"] = False
            results["errors"].append(f"missing required file: {required_file}")

    if not results["package_exists"]:
        return results

    # Validate source_manifest.json
    source_manifest_path = package_path / "source_manifest.json"
    if source_manifest_path.exists():
        with open(source_manifest_path) as fh:
            source_manifest = json.load(fh)
        results["source_manifest"] = source_manifest
        # Handle both single manifest and wrapper with "sources" list
        if isinstance(source_manifest, dict) and "sources" in source_manifest:
            manifests = source_manifest["sources"]
        else:
            manifests = [source_manifest]
        manifest_results = [validate_source_manifest(m) for m in manifests]
        results["manifest_valid"] = all(r["valid"] for r in manifest_results)
        if not results["manifest_valid"]:
            results["errors"].append("source manifest validation failed")

    # Validate SHA256SUMS
    checksums_path = package_path / "SHA256SUMS.txt"
    if checksums_path.exists():
        checksums_valid = True
        with open(checksums_path) as fh:
            for line in fh:
                line = line.strip()
                if not line:
                    continue
                parts = line.split(None, 1)
                if len(parts) != 2:
                    results["warnings"].append(f"malformed checksum line: {line}")
                    continue
                expected_hash, fname = parts
                fpath = package_path / fname
                if not fpath.exists():
                    results["warnings"].append(
                        f"checksum file listed but not found: {fname}"
                    )
                    continue
                actual_hash = sha256_file(fpath)
                if actual_hash != expected_hash:
                    results["errors"].append(f"checksum mismatch for {fname}")
                    checksums_valid = False
        results["checksum_valid"] = checksums_valid

    # Parse candidate records
    records = parse_candidate_records(package_path / "candidate_records.jsonl")
    results["candidate_count"] = len(records)
    results["records"] = records

    # Validate country code and check for UK/GB references
    country_seen = set()
    place_types = set()
    source_keys = set()
    duplicate_keys = set()

    type_counts = {"country": 0, "region": 0, "city": 0}

    for rec in records:
        cc = rec.get("country_code", "")
        if cc != "AU":
            results["all_country_au"] = False
            results["errors"].append(
                f"non-AU country in candidate: {cc} ({rec.get('candidate_id')})"
            )
        if cc in ("UK", "GB"):
            results["no_uk_reference"] = False
            results["errors"].append(f"forbidden country code in candidate: {cc}")

        country_seen.add(cc)

        payload = rec.get("payload", {})
        place_type = payload.get("place_type", "unknown")
        place_types.add(place_type)
        if place_type in type_counts:
            type_counts[place_type] += 1

        # Detect duplicate source keys
        source_id = rec.get("source_id")
        source_record_key = rec.get("source_record_key")
        if source_id and source_record_key:
            key = (source_id, source_record_key)
            if key in source_keys:
                duplicate_keys.add(key)
            source_keys.add(key)

    results["country_count"] = len(country_seen)
    results["region_count"] = type_counts["region"]
    results["city_count"] = type_counts["city"]
    results["duplicate_source_keys"] = [list(k) for k in duplicate_keys]
    results["place_types"] = list(place_types)

    if duplicate_keys:
        results["errors"].append(
            f"duplicate source keys detected: {len(duplicate_keys)}"
        )

    return results

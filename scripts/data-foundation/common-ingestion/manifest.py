"""10.7B Common Source Ingestion Framework v1 - source manifest.

Each official source is described by a source manifest (10.7B §4). A package
source_manifest.json wraps one or more source manifests:

  {
    "schema": "...source_manifest.v1",
    "package_source_count": 2,
    "sources": [ { ...source manifest fields... } ]
  }

Validation accepts either a single manifest object or the wrapper form.
"""

import json
import os
import re

from country import normalize_country_code
from schemas import (CANDIDATE_SCHEMA_VERSION, COUNTRY_CODE_DB_COMPATIBILITY,
                     DATA_DOMAINS, PARSER_VERSION, RAW_STORAGE_TIERS,
                     RETRIEVAL_METHODS, SOURCE_MANIFEST_REQUIRED_FIELDS,
                     SOURCE_MANIFEST_OPTIONAL_FIELDS)

_SOURCE_ID_RE = re.compile(r"^[a-z0-9][a-z0-9\-]{2,63}$")


def _parse_iso_datetime(value):
    """Very small ISO 8601 UTC parser: YYYY-MM-DD or YYYY-MM-DDTHH:MM[:SS]Z.

    Returns True when the value is a well-formed UTC timestamp/date.
    """
    if not isinstance(value, str):
        return False
    s = value.strip()
    if re.match(r"^\d{4}-\d{2}-\d{2}$", s):
        return True
    if re.match(r"^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2})?Z$", s):
        return True
    if re.match(r"^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2})?\+00:00$", s):
        return True
    return False


def _is_timestamp_field(field):
    return field in ("retrieved_at", "reviewed_at")


def validate_source_manifest(manifest):
    """Validate a single source manifest object.

    Returns dict { "source_id": str, "valid": bool, "blocked": bool,
                   "warnings": [...], "failures": [...] }.
    """
    source_id = manifest.get("source_id") if isinstance(manifest, dict) else None
    warnings = []
    failures = []

    if not isinstance(manifest, dict):
        return {"source_id": source_id, "valid": False, "blocked": True,
                "warnings": [], "failures": ["manifest must be a JSON object"]}

    for field in SOURCE_MANIFEST_REQUIRED_FIELDS:
        value = manifest.get(field)
        if value is None or value == "":
            failures.append("missing required field '%s'" % field)

    if manifest.get("source_id"):
        if not _SOURCE_ID_RE.match(manifest["source_id"]):
            failures.append("source_id must match ^[a-z0-9][a-z0-9\\-]{2,63}$")
        if ":" in manifest["source_id"]:
            failures.append("source_id must not contain ':' (candidate_id separator)")

    cc = normalize_country_code(manifest.get("country_code"))
    if not cc["normalized"]:
        failures.append("country_code is not a valid ISO alpha-2 code")
    elif not cc["canonical"] and cc["alias_applied"]:
        failures.append("country_code uses alias '%s'; must be canonical '%s'"
                        % (cc["alias_applied"], cc["normalized"]))
    elif cc["normalized"] != "GB" and cc["alias_applied"] is None and not cc["canonical"]:
        warnings.append("country_code '%s' is valid ISO alpha-2 but outside the "
                        "five-country canonical set" % cc["normalized"])

    if manifest.get("data_domain") and manifest["data_domain"] not in DATA_DOMAINS:
        failures.append("data_domain '%s' not in allowed domains"
                        % manifest["data_domain"])

    if manifest.get("raw_storage_tier"):
        tier = str(manifest["raw_storage_tier"]).strip().lower()
        if tier not in RAW_STORAGE_TIERS:
            failures.append("raw_storage_tier must be one of %s"
                            % ", ".join(RAW_STORAGE_TIERS))
        elif tier == "t3":
            warnings.append("raw_storage_tier t3: licence/ToS restricted - raw data "
                            "must not be stored; Git keeps manifest + checksum + "
                            "retrieval instruction only")

    if manifest.get("retrieval_method") and \
            manifest["retrieval_method"] not in RETRIEVAL_METHODS:
        failures.append("retrieval_method '%s' not allowed"
                        % manifest["retrieval_method"])

    for field in ("retrieved_at", "reviewed_at"):
        value = manifest.get(field)
        if value not in (None, ""):
            if not _parse_iso_datetime(value):
                failures.append("%s must be an ISO 8601 UTC timestamp" % field)

    if manifest.get("parser_version") and manifest["parser_version"] != PARSER_VERSION:
        warnings.append("parser_version '%s' differs from framework '%s'"
                        % (manifest["parser_version"], PARSER_VERSION))

    if manifest.get("candidate_schema_version") and \
            manifest["candidate_schema_version"] != CANDIDATE_SCHEMA_VERSION:
        failures.append("candidate_schema_version must be %s"
                        % CANDIDATE_SCHEMA_VERSION)

    # Checksum validation (format only; no raw file present in this framework).
    from checksum import parse_checksum
    cs = parse_checksum(manifest.get("checksum"))
    if not cs["well_formed"]:
        failures.append("checksum must be 'sha256:<64 hex>'")

    if isinstance(manifest.get("file_size"), bool) or (
            manifest.get("file_size") is not None and
            not isinstance(manifest.get("file_size"), int)):
        failures.append("file_size must be an integer byte count")

    if manifest.get("licence") is None or manifest["licence"] == "":
        failures.append("licence/usage restriction must be recorded")

    blocked = bool(failures)
    return {"source_id": source_id,
            "valid": not blocked,
            "blocked": blocked,
            "warnings": warnings,
            "failures": failures}


def load_manifest(path):
    """Load a source manifest file (single object or {sources:[...]} wrapper).

    Returns (source_id, manifest_obj) for a single manifest, or
    (sources_list, wrapper) for the wrapper form.
    """
    with open(path) as fh:
        data = json.load(fh)
    if isinstance(data, dict) and "sources" in data and \
            isinstance(data["sources"], list):
        return "sources", data
    return "single", data


def build_package_source_manifest(sources):
    """Wrap a list of source manifests into the package source_manifest.json."""
    return {
        "schema": "campcareer.common-source-ingestion.source_manifest.v1",
        "package_source_count": len(sources),
        "country_code_database_compatibility": COUNTRY_CODE_DB_COMPATIBILITY,
        "sources": sources,
    }

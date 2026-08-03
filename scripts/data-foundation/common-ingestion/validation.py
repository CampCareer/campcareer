"""10.7B Common Source Ingestion Framework v1 - validation rules.

Implements the 11 validation layers (10.7B §8). Per-record rules attach
failures/warnings to a record; package-level rules aggregate across the whole
candidate set. Results are statuses: valid / valid_with_warnings / invalid /
blocked.

Unknown values are preserved as null; they are never coerced to 0 or "".
"""

import re
import uuid as _uuid_mod

from country import normalize_country_code
from schemas import (BUILDER_COMPUTED_FIELDS, CANDIDATE_ENVELOPE_FIELDS,
                     CANDIDATE_SCHEMA_VERSION, IMPORT_STATUSES,
                     UNKNOWN_SENTINELS, VALIDATION_RULES,
                     VALIDATION_STATUSES)

_UUID_RE = re.compile(
    r"^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-"
    r"[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$")


def _strip_unknown(value):
    if value is None:
        return value
    if isinstance(value, str):
        s = value.strip()
        if s.lower() in UNKNOWN_SENTINELS or s == "":
            return None
    return value


def _is_iso_timestamp(value):
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


def validate_record(record, manifest_sources, duplicate_keys, index):
    """Validate a single candidate record.

    manifest_sources: dict source_id -> manifest dict (or None when the source
                      manifest is unavailable for lineage validation).
    duplicate_keys:   set of (source_id, source_record_key) that appear more
                      than once in the input.
    index:            insertion index, used for ordered reporting. Duplicate
                      members keep their shared deterministic candidate_id; they
                      are never assigned fabricated unique identifiers.

    Returns (record, results) where results = { "status": str,
    "failures": {rule_id: [msg]}, "warnings": {rule_id: [msg]} }.
    """
    failures = {}
    warnings = {}
    source_id = record.get("source_id")
    source_key = record.get("source_record_key")

    def fail(rule, msg):
        failures.setdefault(rule, []).append(msg)

    def warn(rule, msg):
        warnings.setdefault(rule, []).append(msg)

    # --- rule 3: schema_valid ---
    if not isinstance(record, dict):
        fail("schema_valid", "record must be a JSON object")
    else:
        for field in CANDIDATE_ENVELOPE_FIELDS:
            if field in BUILDER_COMPUTED_FIELDS:
                continue  # computed by the package builder, never trusted from input
            if field not in record:
                fail("schema_valid", "missing envelope field '%s'" % field)
        if "payload" in record and not isinstance(record.get("payload"), dict):
            fail("schema_valid", "payload must be a JSON object")
        if "evidence" in record and record.get("evidence") is not None and \
                not isinstance(record.get("evidence"), dict):
            fail("schema_valid", "evidence must be a JSON object")

    # --- rule 4: required_fields ---
    for field in ["candidate_schema_version", "data_domain",
                  "source_id", "source_record_key", "country_code"]:
        value = record.get(field)
        if value is None or value == "":
            fail("required_fields", "required field '%s' is empty" % field)
    if record.get("candidate_id") is not None and record.get("candidate_id") == "":
        fail("required_fields", "candidate_id must not be an empty string")

    if record.get("candidate_schema_version") not in (None, CANDIDATE_SCHEMA_VERSION):
        fail("required_fields", "candidate_schema_version must be %s"
             % CANDIDATE_SCHEMA_VERSION)

    # --- rule 5: country_code_normalization ---
    cc_raw = record.get("country_code")
    cc = normalize_country_code(cc_raw)
    if not cc["normalized"]:
        fail("country_code_normalization", "country_code '%s' is not a valid "
             "ISO alpha-2 code" % cc_raw)
    elif cc["alias_applied"]:
        fail("country_code_normalization", "input country_code '%s' must be "
             "normalized to canonical '%s' (alias only); use the package "
             "builder to normalize and preserve the raw value in evidence"
             % (cc["alias_applied"], cc["normalized"]))
    elif not cc["canonical"]:
        warn("country_code_normalization", "country_code '%s' is valid ISO "
             "alpha-2 but outside the five-country canonical set"
             % cc["normalized"])

    # --- rule 6: date_valid ---
    for field in ["observed_at", "retrieved_at", "reviewed_at"]:
        value = record.get(field)
        if value not in (None, ""):
            if not _is_iso_timestamp(value):
                fail("date_valid", "%s must be ISO 8601 UTC, got '%s'"
                     % (field, value))
        elif field in ("observed_at", "retrieved_at") and value in (None, ""):
            fail("date_valid", "required timestamp '%s' is empty" % field)

    # --- rule 7: source_lineage ---
    if not source_id or not source_key:
        fail("source_lineage", "source_id and source_record_key are required "
             "for lineage")
    else:
        if manifest_sources is not None and source_id not in manifest_sources:
            fail("source_lineage", "source_id '%s' is not declared in the "
                 "source manifest" % source_id)
        if isinstance(source_key, str) and source_key.strip() == "":
            fail("source_lineage", "source_record_key must not be empty")

    # --- rule 8: duplicate_source_key ---
    if source_id and source_key and (source_id, source_key) in duplicate_keys:
        fail("duplicate_source_key", "duplicate (source_id, source_record_key) "
             "= ('%s', '%s'); sent to duplicate review queue"
             % (source_id, source_key))

    # --- rule 9: candidate_identity ---
    cid = record.get("candidate_id")
    if cid and _UUID_RE.match(str(cid)):
        fail("candidate_identity", "candidate_id '%s' looks like a random UUID; "
             "arbitrary UUID generation is forbidden - use the deterministic "
             "source_id:source_record_key identity" % cid)
    expected_cid = "%s:%s" % (source_id or "", source_key or "")
    if cid and expected_cid and str(cid) != expected_cid:
        fail("candidate_identity", "candidate_id '%s' does not match the "
             "deterministic source_id:source_record_key identity '%s'"
             % (cid, expected_cid))

    id_status = record.get("identity_status")
    if id_status and id_status not in ("new_candidate", "exact_match",
                                       "duplicate_review", "unresolved"):
        fail("candidate_identity", "unknown identity_status '%s'" % id_status)

    # --- rule 10: null_unknown ---
    payload = record.get("payload")
    if isinstance(payload, dict):
        for key, value in payload.items():
            if isinstance(value, str):
                s = value.strip()
                if s.lower() in UNKNOWN_SENTINELS or s == "":
                    fail("null_unknown", "payload field '%s' contains unknown "
                         "sentinel '%s'; unknown must be null" % (key, value))
                continue
            if isinstance(value, dict):
                for k2, v2 in value.items():
                    if isinstance(v2, str) and v2.strip() != "" and \
                            v2.strip().lower() in UNKNOWN_SENTINELS:
                        fail("null_unknown", "payload.%s.%s contains unknown "
                             "sentinel '%s'" % (key, k2, v2))

    # --- rule 11: import_safety ---
    import_status = record.get("import_status")
    # Absent means the builder has not computed it yet (input parser output);
    # the builder always sets candidate_only. Any explicit non-candidate_only
    # value is an import-safety violation.
    if import_status not in (None, "candidate_only"):
        fail("import_safety", "import_status must be 'candidate_only'; "
             "production import is a separate controlled step")
    if payload and isinstance(payload, dict):
        if payload.get("production_imported") is True:
            fail("import_safety", "payload must not declare production_imported")
        if payload.get("canonical_uuid") is not None:
            fail("import_safety", "payload must not carry a canonical uuid")
        if payload.get("auto_merged") is True:
            fail("import_safety", "payload must not declare auto_merged")

    # --- status derivation ---
    if failures:
        status = "invalid"
    elif warnings:
        status = "valid_with_warnings"
    else:
        status = "valid"

    if any(msg for msg in failures.get("import_safety", []) or
           failures.get("manifest_valid", []) or failures.get("file_checksum", [])):
        status = "blocked"

    return record, {"status": status, "failures": failures,
                    "warnings": warnings}


def aggregate_status(record_results):
    """Package-level status from per-record results: worst status wins.

    blocked > invalid > valid_with_warnings > valid.
    """
    order = {"valid": 0, "valid_with_warnings": 1, "invalid": 2, "blocked": 3}
    worst = "valid"
    for res in record_results:
        st = res.get("status", "valid")
        if order.get(st, 0) > order[worst]:
            worst = st
    return worst


def normalize_record(record, manifest_sources):
    """Normalize a candidate record produced by a parser.

    - country_code UK -> GB (raw value preserved in evidence);
    - unknown sentinels -> null (recorded in evidence);
    - candidate_id set to the deterministic source_id:source_record_key;
    - envelope status fields left for the builder to fill.

    Never creates UUIDs, never merges, never writes to any database.
    """
    out = dict(record)
    evidence = dict(out.get("evidence") or {})

    raw_cc = out.get("country_code")
    cc = normalize_country_code(raw_cc)
    if cc["normalized"]:
        out["country_code"] = cc["normalized"]
    if cc["input"] is not None and not cc["canonical"]:
        evidence["raw_country_code"] = cc["input"]
    if cc["alias_applied"]:
        evidence["country_code_alias_normalized"] = True
        evidence["country_code_alias_applied"] = cc["alias_applied"]

    payload = dict(out.get("payload") or {})
    normalized_unknown = []
    for key, value in payload.items():
        stripped = _strip_unknown(value)
        if stripped is None and value is not None:
            normalized_unknown.append(key)
            payload[key] = None
    out["payload"] = payload
    if normalized_unknown:
        evidence["normalized_unknown_to_null"] = normalized_unknown

    if evidence:
        out["evidence"] = evidence

    out["candidate_id"] = "%s:%s" % (out.get("source_id") or "",
                                     out.get("source_record_key") or "")
    return out


def is_arbitrary_uuid(value):
    """True when value looks like a random v4 UUID (forbidden by policy)."""
    if not isinstance(value, str):
        return False
    return bool(_UUID_RE.match(value)) and _uuid_mod.UUID(value).version == 4

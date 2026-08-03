"""10.7B Common Source Ingestion Framework v1 - identity & duplicate policy.

Permitted: exact official identifier match, exact source record key match,
explicit alias tables, manually approved mappings.
Forbidden: fuzzy title/similarity matching, auto-merging, auto-deleting
duplicate candidates, arbitrary canonical row edits.

Duplicate candidates are never deleted; they are emitted to a review queue.
Candidates whose identity cannot be resolved are emitted to an unresolved
queue. The known legacy programme-title duplicate set (732) is not treated as
automatically duplicate; it is only a future quality bar / test case.
"""

import csv
import io


def detect_duplicate_source_keys(records):
    """Group candidate records by (source_id, source_record_key).

    Returns (duplicate_groups, duplicate_keys) where duplicate_keys is the set
    of keys appearing more than once, and duplicate_groups maps each such key
    to the list of affected candidate ids.
    """
    counts = {}
    by_key = {}
    for rec in records:
        key = (rec.get("source_id"), rec.get("source_record_key"))
        counts[key] = counts.get(key, 0) + 1
        by_key.setdefault(key, []).append(rec.get("candidate_id"))
    duplicate_keys = {k for k, c in counts.items() if c > 1}
    duplicate_groups = {k: by_key[k] for k in duplicate_keys}
    return duplicate_groups, duplicate_keys


def render_duplicate_review_queue(records, duplicate_groups):
    """Render the duplicate review queue CSV.

    Columns: candidate_id, source_id, source_record_key, country_code,
    data_domain, duplicate_group_id, duplicate_member_count, reason,
    payload_summary, reviewed_at, resolution_status.
    """
    buf = io.StringIO()
    writer = csv.writer(buf, lineterminator="\n")
    writer.writerow([
        "candidate_id", "source_id", "source_record_key", "country_code",
        "data_domain", "duplicate_group_id", "duplicate_member_count", "reason",
        "payload_summary", "reviewed_at", "resolution_status",
    ])
    for rec in records:
        key = (rec.get("source_id"), rec.get("source_record_key"))
        if key not in duplicate_groups:
            continue
        writer.writerow([
            rec.get("candidate_id") or "",
            rec.get("source_id") or "",
            rec.get("source_record_key") or "",
            rec.get("country_code") or "",
            rec.get("data_domain") or "",
            "dup:%s:%s" % (rec.get("source_id") or "", rec.get("source_record_key") or ""),
            len(duplicate_groups[key]),
            "duplicate (source_id, source_record_key) detected; automatic "
            "deduplication is forbidden - review manually",
            _payload_summary(rec),
            "",
            "pending_review",
        ])
    return buf.getvalue()


def render_unresolved_identity_queue(records, manifest_sources):
    """Render the unresolved identity queue CSV.

    Records that cannot be traced to a declared source are unresolved.
    Columns: candidate_id, source_id, source_record_key, country_code,
    data_domain, reason, payload_summary, reviewed_at, resolution_status.
    """
    buf = io.StringIO()
    writer = csv.writer(buf, lineterminator="\n")
    writer.writerow([
        "candidate_id", "source_id", "source_record_key", "country_code",
        "data_domain", "reason", "payload_summary", "reviewed_at",
        "resolution_status",
    ])
    for rec in records:
        source_id = rec.get("source_id")
        reason = None
        if not source_id:
            reason = "source_id missing - no lineage"
        elif manifest_sources is not None and source_id not in manifest_sources:
            reason = "source_id '%s' not declared in source manifest" % source_id
        if not reason:
            continue
        writer.writerow([
            rec.get("candidate_id") or "",
            source_id or "",
            rec.get("source_record_key") or "",
            rec.get("country_code") or "",
            rec.get("data_domain") or "",
            reason,
            _payload_summary(rec),
            "",
            "pending_resolution",
        ])
    return buf.getvalue()


def _payload_summary(rec):
    payload = rec.get("payload")
    if not isinstance(payload, dict):
        return ""
    try:
        return json_dumps_compact(payload)
    except Exception:
        return str(payload)


def json_dumps_compact(obj):
    import json
    return json.dumps(obj, ensure_ascii=False, sort_keys=True,
                      separators=(",", ":"))

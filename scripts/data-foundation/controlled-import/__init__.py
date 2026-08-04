"""10.9A AU Geography Controlled Import Tool v1

Read-only controlled import dry-run tool for the CampCareer geography dataset.
This tool performs:
  - Candidate package validation (reusing common-ingestion framework)
  - Production DB read-only inspection
  - Dry-run classification (INSERT / NOOP / CONFLICT / UNRESOLVED_PARENT)
  - Import plan generation (approval-pending)
  - Audit artifact generation

Production DB write is strictly forbidden. The tool enforces read-only
operation at the psycopg2 connection level and validates SQL safety at the
SQL statement construction layer.

Candidate package structure
---------------------------
  data/candidates/geography/AU/2026-08-04/
    package_manifest.json
    source_manifest.json
    candidate_records.jsonl
    validation_report.json
    duplicate_review_queue.csv
    unresolved_identity_queue.csv
    SHA256SUMS.txt
    README.md

The tool accepts AU as the only country for 10.9A. All other country codes
cause immediate failure.

Usage
-----
python3 -m scripts.data_foundation.controlled-import.geography \
  dry-run \
  --country AU \
  --candidate-package data/candidates/geography/AU/2026-08-04 \
  --output data/audits/au-geography-import-dry-run/2026-08-04
"""

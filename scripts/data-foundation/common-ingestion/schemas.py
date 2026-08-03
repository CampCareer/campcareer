"""10.7B Common Source Ingestion Framework v1 - schema constants.

Single source of truth for candidate envelope fields, source manifest fields,
allowed values, validation rule identifiers and version pins. No production
database is ever referenced or written from this framework.
"""

FRAMEWORK_VERSION = "1.0.0"
CANDIDATE_SCHEMA_VERSION = "1.0.0"
PARSER_VERSION = "1.0.0"
RUNNER_VERSION = "1.0.0"

# Canonical country codes (ISO alpha-2). UK is an input/product alias only.
CANONICAL_COUNTRIES = ["AU", "CA", "IE", "GB", "US"]

# Input aliases -> canonical country code. Original source value is preserved
# in candidate evidence (evidence.raw_country_code).
COUNTRY_ALIASES = {"UK": "GB"}

# Data domains supported by the framework envelope.
DATA_DOMAINS = [
    "country_profile",
    "geography",
    "visa",
    "institution",
    "campus",
    "programme",
    "occupation",
    "labour_market",
]

# Raw storage tiers (see raw 3-tier policy).
RAW_STORAGE_TIERS = ["t1", "t2", "t3"]

# Retrieval methods accepted in source manifests.
RETRIEVAL_METHODS = [
    "http_download",
    "http_webpage",
    "api_json",
    "api_rest",
    "ftp_download",
    "manual_collection",
]

# Validation statuses.
VALIDATION_STATUSES = ["valid", "valid_with_warnings", "invalid", "blocked"]

# Identity statuses. No fuzzy matching is ever performed.
IDENTITY_STATUSES = [
    "new_candidate",      # no known canonical identity yet (default)
    "exact_match",        # matched via explicit alias table / manual approved mapping
    "duplicate_review",   # duplicate source key detected; sent to review queue
    "unresolved",         # identity cannot be resolved; sent to unresolved queue
]

# Import statuses. candidate_only is the only allowed value in this framework.
IMPORT_STATUSES = ["candidate_only"]

# Candidate common envelope fields (all candidate records carry these).
CANDIDATE_ENVELOPE_FIELDS = [
    "candidate_id",
    "candidate_schema_version",
    "data_domain",
    "source_id",
    "source_record_key",
    "country_code",
    "observed_at",
    "retrieved_at",
    "reviewed_at",
    "parser_version",
    "payload",
    "evidence",
    "validation_status",
    "identity_status",
    "import_status",
]

# Fields the package builder computes (must never be trusted from input).
BUILDER_COMPUTED_FIELDS = [
    "candidate_id",
    "validation_status",
    "identity_status",
    "import_status",
]

# Source manifest required fields (10.7B §4).
SOURCE_MANIFEST_REQUIRED_FIELDS = [
    "source_id",
    "country_code",
    "data_domain",
    "authority",
    "official_url",
    "retrieval_method",
    "licence",
    "usage_restriction",
    "refresh_cadence",
    "retrieved_at",
    "reviewed_at",
    "content_type",
    "checksum",
    "file_size",
    "parser_version",
    "candidate_schema_version",
    "raw_storage_tier",
]

SOURCE_MANIFEST_OPTIONAL_FIELDS = [
    "notes",
    "usage_restriction_url",
]

# Unknown-value sentinels that parsers must never emit (must be null instead).
# The null/unknown rule flags these so unknown is preserved as null, never as
# 0 or an empty string.
UNKNOWN_SENTINELS = ["", "unknown", "n/a", "na", "not available", "not_available"]

# Date/time fields validated against ISO 8601 UTC.
ISO_DATETIME_FIELDS = ["observed_at", "retrieved_at", "reviewed_at"]

# Country code database compatibility for the running production database.
COUNTRY_CODE_DB_COMPATIBILITY = "blocked_pending_uk_to_gb_resolution"

# package_manifest.json schema name.
PACKAGE_MANIFEST_SCHEMA = "campcareer.common-source-ingestion.package_manifest.v1"
VALIDATION_REPORT_SCHEMA = "campcareer.common-source-ingestion.validation_report.v1"
SOURCE_MANIFEST_SCHEMA = "campcareer.common-source-ingestion.source_manifest.v1"

# Validation rules (order defines report order).
VALIDATION_RULES = [
    ("manifest_valid", "Manifest validation"),
    ("file_checksum", "File checksum validation"),
    ("schema_valid", "Schema validation"),
    ("required_fields", "Required field validation"),
    ("country_code_normalization", "Country code normalization"),
    ("date_valid", "Date validation"),
    ("source_lineage", "Source lineage validation"),
    ("duplicate_source_key", "Duplicate source key validation"),
    ("candidate_identity", "Candidate identity validation"),
    ("null_unknown", "Null/unknown handling"),
    ("import_safety", "Import safety validation"),
]

# Files every candidate package must contain (10.7B §11).
REQUIRED_PACKAGE_FILES = [
    "source_manifest.json",
    "candidate_records.jsonl",
    "validation_report.json",
    "duplicate_review_queue.csv",
    "unresolved_identity_queue.csv",
    "package_manifest.json",
    "SHA256SUMS.txt",
    "README.md",
]

# Raw files larger than this (bytes) must never be committed to Git.
MAX_RAW_FILE_BYTES = 1_000_000

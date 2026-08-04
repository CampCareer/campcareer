"""10.9A AU Geography Controlled Import Tool v1 — candidate classification.

Classifies each candidate record as INSERT / NOOP / CONFLICT /
UNRESOLVED_PARENT / UNSUPPORTED / INVALID against DB pre-state.

Uses ONLY exact match on official source identifier or exact composite
key. No fuzzy matching.

DELETE is not planned in this version.
UPDATE is not planned in this version.
"""

from dataclasses import dataclass
from typing import Any


@dataclass
class ClassificationResult:
    candidate_id: str
    place_type: str
    country_code: str
    classification: str
    reason: str
    db_identity: str | None
    parent_candidate_id: str | None
    parent_db_identity: str | None
    parent_resolution_method: str | None
    planned_values: dict[str, Any] | None
    evidence_reference: dict[str, Any] | None
    matching_method: str | None
    precondition: str | None


# Parent candidate ID prefix for AU regions: au-abs-31010do002-v1:AU:ste:<code>
AU_REGION_CANDIDATE_PREFIX = "au-abs-31010do002-v1:AU:ste:"

# Canonical representative-name normalization for multi-place SUAs.
# Original ABS official_name is preserved in metadata.
AU_REPRESENTATIVE_NAME_MAP: dict[str, str] = {
    "Gold Coast - Tweed Heads": "Gold Coast",
    "Newcastle - Maitland": "Newcastle",
    "Canberra - Queanbeyan": "Canberra",
    "Albury - Wodonga": "Albury",
    "Shepparton - Mooroopna": "Shepparton",
    "Mildura - Buronga": "Mildura",
}


def classify_candidate(
    rec: dict,
    db_pre_state: dict,
    country_by_code: dict,
    country_records_in_db: list[dict],
    region_records_in_db: list[dict],
    city_records_in_db: list[dict],
    planned_region_ids: set[str] | None = None,
) -> ClassificationResult:
    """Classify a single candidate record against DB pre-state.

    planned_region_ids: set of candidate_ids for regions expected to be INSERTed
    in this same dry-run batch. Used to resolve city parents without DB access.
    """
    payload = rec.get("payload", {})
    place_type = payload.get("place_type", "unknown")
    country_code = rec.get("country_code", "")
    official_name = payload.get("official_name", "")
    short_name = payload.get("short_name", "")
    statistical_code = payload.get("statistical_code")
    coordinates = payload.get("coordinates")
    parent_region_code = payload.get("parent_region_code")
    parent_region_name = payload.get("parent_region_name")
    source_id = rec.get("source_id", "")
    source_record_key = rec.get("source_record_key", "")
    candidate_id = rec.get("candidate_id", "")
    evidence = rec.get("evidence", {})

    # Normalize representative name for multi-place SUAs (e.g., "Albury - Wodonga" → "Albury")
    representative_name = AU_REPRESENTATIVE_NAME_MAP.get(official_name, official_name)

    planned_values = {
        "country_code": country_code,
        "geography_type": place_type,
        "code": statistical_code,
        "name": representative_name,
        "short_name": representative_name,
        "region_code": parent_region_code if place_type == "city" else None,
        "latitude": coordinates.get("latitude") if coordinates else None,
        "longitude": coordinates.get("longitude") if coordinates else None,
        "metadata": {
            "source_id": source_id,
            "source_record_key": source_record_key,
            "original_official_name": official_name,
            "original_short_name": short_name,
        },
    }

    # ── Validate coordinates and population ─────────────────────────────────
    lat = payload.get("coordinates", {}).get("latitude") if payload.get("coordinates") else None
    lng = payload.get("coordinates", {}).get("longitude") if payload.get("coordinates") else None

    if lat is not None and not (-90 <= lat <= 90):
        return ClassificationResult(
            candidate_id=candidate_id, place_type=place_type, country_code=country_code,
            classification="INVALID",
            reason=f"latitude {lat} out of range [-90, 90]",
            db_identity=None, parent_candidate_id=None, parent_db_identity=None,
            parent_resolution_method=None, planned_values=None, evidence_reference=evidence,
            matching_method="none", precondition="latitude in valid range",
        )

    if lng is not None and not (-180 <= lng <= 180):
        return ClassificationResult(
            candidate_id=candidate_id, place_type=place_type, country_code=country_code,
            classification="INVALID",
            reason=f"longitude {lng} out of range [-180, 180]",
            db_identity=None, parent_candidate_id=None, parent_db_identity=None,
            parent_resolution_method=None, planned_values=None, evidence_reference=evidence,
            matching_method="none", precondition="longitude in valid range",
        )

    population = payload.get("population")
    if population is not None and population < 0:
        return ClassificationResult(
            candidate_id=candidate_id, place_type=place_type, country_code=country_code,
            classification="INVALID",
            reason=f"population {population} is negative",
            db_identity=None, parent_candidate_id=None, parent_db_identity=None,
            parent_resolution_method=None, planned_values=None, evidence_reference=evidence,
            matching_method="none", precondition="population >= 0",
        )

    # ── Classify by place_type ───────────────────────────────────────────────
    if place_type == "country":
        if "AU" in country_by_code:
            db_country = country_by_code["AU"]
            if db_country.get("default_currency") == "AUD":
                return ClassificationResult(
                    candidate_id=candidate_id, place_type=place_type, country_code=country_code,
                    classification="NOOP",
                    reason="Country row already exists with matching currency",
                    db_identity="AU", parent_candidate_id=None, parent_db_identity=None,
                    parent_resolution_method=None, planned_values=planned_values, evidence_reference=evidence,
                    matching_method="exact_country_code_match",
                    precondition="core.countries.code = 'AU' exists with default_currency='AUD'",
                )
            else:
                return ClassificationResult(
                    candidate_id=candidate_id, place_type=place_type, country_code=country_code,
                    classification="CONFLICT",
                    reason="Country code 'AU' exists but values differ (currency mismatch)",
                    db_identity="AU", parent_candidate_id=None, parent_db_identity=None,
                    parent_resolution_method=None, planned_values=None, evidence_reference=evidence,
                    matching_method="none",
                    precondition="core.countries.code = 'AU' exists with conflicting values",
                )
        else:
            return ClassificationResult(
                candidate_id=candidate_id, place_type=place_type, country_code=country_code,
                classification="INSERT",
                reason="Country row does not exist in DB; INSERT planned",
                db_identity=None, parent_candidate_id=None, parent_db_identity=None,
                parent_resolution_method=None, planned_values=planned_values, evidence_reference=evidence,
                matching_method="exact_country_code_match",
                precondition="core.countries.code = 'AU' does not exist",
            )

    elif place_type == "region":
        existing_regions = [r for r in region_records_in_db if r.get("country_code") == "AU"]

        if "AU" not in country_by_code:
            return ClassificationResult(
                candidate_id=candidate_id, place_type=place_type, country_code=country_code,
                classification="UNRESOLVED_PARENT",
                reason="Parent country 'AU' not found in DB",
                db_identity=None, parent_candidate_id=None, parent_db_identity=None,
                parent_resolution_method="unresolved", planned_values=None, evidence_reference=evidence,
                matching_method="none", precondition="parent country exists",
            )

        # Check if region already exists (exact match on code + name)
        stat_code = statistical_code or ""
        matching_db_region = None
        for reg in existing_regions:
            if (reg.get("code") == stat_code and
                reg.get("name", "").lower() == (official_name or "").lower()):
                matching_db_region = reg
                break

        if matching_db_region is not None:
            return ClassificationResult(
                candidate_id=candidate_id, place_type=place_type, country_code=country_code,
                classification="NOOP",
                reason="Region row already exists with matching code+name",
                db_identity=matching_db_region.get("id"),
                parent_candidate_id="au-abs-31010do002-v1:AU:country",
                parent_db_identity="AU",
                parent_resolution_method="exact_country_code",
                planned_values=planned_values, evidence_reference=evidence,
                matching_method="exact_composite_key",
                precondition="no conflicting values for matching region",
            )
        else:
            return ClassificationResult(
                candidate_id=candidate_id, place_type=place_type, country_code=country_code,
                classification="INSERT",
                reason="New region in DB; INSERT planned",
                db_identity=None,
                parent_candidate_id="au-abs-31010do002-v1:AU:country",
                parent_db_identity=None,
                parent_resolution_method="exact_country_code",
                planned_values=planned_values, evidence_reference=evidence,
                matching_method="none",
                precondition="parent country 'AU' exists in DB",
            )

    elif place_type == "city":
        parent_code = payload.get("parent_region_code")
        parent_name_str = payload.get("parent_region_name")

        parent_candidate_id = None
        parent_db_identity = None
        parent_resolution_method = None

        if parent_code and "AU" in country_by_code:
            existing_regions = [r for r in region_records_in_db if r.get("country_code") == "AU"]
            parent_region_found = None
            for reg in existing_regions:
                if (reg.get("code") == parent_code or
                    reg.get("name", "").lower() == (parent_name_str or "").lower()):
                    parent_region_found = reg
                    break

            if parent_region_found:
                parent_db_identity = parent_region_found.get("id")
                parent_resolution_method = "exact_region_match"
            else:
                # Check if parent region is a planned INSERT in the same batch
                expected_parent_candidate_id = f"{AU_REGION_CANDIDATE_PREFIX}{parent_code}"
                if planned_region_ids is not None and expected_parent_candidate_id in planned_region_ids:
                    parent_candidate_id = expected_parent_candidate_id
                    parent_db_identity = None
                    parent_resolution_method = "planned_region_insert"
                else:
                    # Parent not in DB and not planned — unresolved
                    parent_candidate_id = expected_parent_candidate_id
                    parent_resolution_method = "unresolved"

            planned_values["parent_id"] = None
            planned_values["region_code"] = parent_code
        elif parent_code:
            parent_candidate_id = "au-abs-31010do002-v1:AU:country"
            parent_db_identity = "AU" if "AU" in country_by_code else None
            if "AU" in country_by_code:
                parent_resolution_method = "country_fallback"
            else:
                parent_resolution_method = "unresolved"

        if parent_resolution_method == "unresolved":
            return ClassificationResult(
                candidate_id=candidate_id, place_type=place_type, country_code=country_code,
                classification="UNRESOLVED_PARENT",
                reason=f"Parent region '{parent_name_str}' (code: {parent_code}) not found",
                db_identity=None, parent_candidate_id=parent_candidate_id,
                parent_db_identity=parent_db_identity,
                parent_resolution_method=parent_resolution_method, planned_values=None,
                evidence_reference=evidence,
                matching_method="none", precondition="parent region exists or is planned",
            )

        # Check if city already exists in DB
        # Unique index: (country_code, geography_type, COALESCE(code,''), lower(name), COALESCE(region_code,''))
        existing_cities = [c for c in city_records_in_db if c.get("country_code") == "AU"]
        matching_db_city = None
        short_code = statistical_code or ""
        for city in existing_cities:
            if (city.get("code") == short_code and
                city.get("name", "").lower() == (official_name or "").lower() and
                (city.get("region_code") or "") == (parent_code or "")):
                matching_db_city = city
                break

        if matching_db_city is not None:
            return ClassificationResult(
                candidate_id=candidate_id, place_type=place_type, country_code=country_code,
                classification="NOOP",
                reason="City row already exists with matching identity",
                db_identity=matching_db_city.get("id"),
                parent_candidate_id=parent_candidate_id,
                parent_db_identity=parent_db_identity,
                parent_resolution_method=parent_resolution_method,
                planned_values=planned_values, evidence_reference=evidence,
                matching_method="exact_composite_key",
                precondition="no conflicting values for matching city",
            )
        else:
            return ClassificationResult(
                candidate_id=candidate_id, place_type=place_type, country_code=country_code,
                classification="INSERT",
                reason=f"New city in DB; parent {parent_resolution_method}",
                db_identity=None,
                parent_candidate_id=parent_candidate_id,
                parent_db_identity=parent_db_identity,
                parent_resolution_method=parent_resolution_method,
                planned_values=planned_values, evidence_reference=evidence,
                matching_method="none",
                precondition="parent region/country exists or is planned",
            )

    else:
        return ClassificationResult(
            candidate_id=candidate_id, place_type=place_type, country_code=country_code,
            classification="UNSUPPORTED",
            reason=f"Unsupported place_type: {place_type}",
            db_identity=None, parent_candidate_id=None, parent_db_identity=None,
            parent_resolution_method=None, planned_values=None, evidence_reference=evidence,
            matching_method="none", precondition="place_type is country/region/city",
        )


def build_planned_region_ids(records: list[dict]) -> set[str]:
    """Pre-scan records for region candidates to build planned ID set.

    Returns the set of candidate_ids for all region-type records.
    Used so city classification can resolve parent regions in offline mode.
    """
    planned = set()
    for rec in records:
        payload = rec.get("payload", {})
        if payload.get("place_type") == "region":
            cid = rec.get("candidate_id", "")
            if cid:
                planned.add(cid)
    return planned

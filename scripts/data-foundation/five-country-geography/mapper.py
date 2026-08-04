"""Top-100 city selection and candidate envelope assembly.

Selection rule (deterministic, documented):
  cities are ordered by population descending (ties broken by source key);
  the top `limit` cities are selected with no per-region cap.

The mapper also converts parsed entities (see parsers._common.entity) into
10.7B candidate envelope records. Payload fields are the geography candidate
schema v1 keys; status fields (candidate_id, validation_status,
identity_status, import_status) are computed by the framework package builder.
"""

import os
from collections import OrderedDict

CANDIDATE_SCHEMA_VERSION = "1.0.0"
PARSER_VERSION = "1.0.0"
DATA_DOMAIN = "geography"

ENTITY_PAYLOAD_FIELDS = [
    "official_name", "short_name", "local_name", "population",
    "population_reference_date", "coordinates", "coordinate_derivation",
    "area_km2", "statistical_code", "source_geographic_level",
    "parent_region_code", "parent_region_name", "parent_join_method",
]


def select_top_cities(cities, limit=100):
    """Select the top `limit` cities by population descending.

    Returns (selected, summary) where summary describes the selection
    profile and region distribution for the coverage report.
    """
    eligible = [c for c in cities if c.get("population") is not None]
    eligible.sort(key=lambda c: (-(c["population"] or 0),
                                 c.get("source_record_key") or ""))

    selected = OrderedDict()
    for c in eligible[:limit]:
        selected[c["source_record_key"]] = c

    ordered = [c for c in eligible if c["source_record_key"] in selected]

    by_region = OrderedDict()
    for c in eligible:
        by_region.setdefault(c.get("parent_region_code"), []).append(c)

    summary = {
        "selection_profile": "population_descending_top_100",
        "limit": limit,
        "per_region_cap": None,
        "eligible_cities": len(eligible),
        "selected_cities": len(ordered),
        "region_distribution": {
            (region if region is not None else "<unassigned>"): {
                "available": len(group),
                "selected": sum(
                    1 for c in group if c["source_record_key"] in selected),
            }
            for region, group in by_region.items()
        },
    }
    return ordered, summary


def _resolve_parent(city, region_codes, country_code):
    """If a city's parent_region_code is not an emitted region, reassign
    to the country code so the parent reference is always resolvable."""
    parent = city.get("parent_region_code")
    if parent is not None and parent not in region_codes:
        city = dict(city)
        city["parent_region_code"] = country_code
        city["parent_region_name"] = None
        city["parent_join_method"] = "country_fallback"
    return city


def entity_to_payload(entity_dict, place_type, selection_rank=None):
    """Build the geography payload dict from a parsed entity dict."""
    payload = {"place_type": place_type}
    for key in ENTITY_PAYLOAD_FIELDS:
        payload[key] = entity_dict.get(key)
    if selection_rank is not None:
        payload["selection_rank"] = selection_rank
    return payload


def _build_evidence(entity_dict, place_type, parent_region_codes):
    """Build evidence dict preserving source-side identifiers and
    transformation information."""
    evidence = {
        "source_id": entity_dict.get("source_id"),
        "source_record_key": entity_dict.get("source_record_key"),
        "coordinate_derivation": entity_dict.get("coordinate_derivation"),
    }
    if place_type == "city":
        evidence["parent_region_code_original"] = entity_dict.get("parent_region_code")
        evidence["parent_join_method_original"] = entity_dict.get("parent_join_method")
        evidence["parent_resolved"] = entity_dict.get("parent_region_code") not in parent_region_codes
    if place_type == "region":
        evidence["centroid_derivation"] = entity_dict.get("coordinate_derivation")
    if place_type == "country":
        evidence["population_source"] = entity_dict.get("source_id")
    return evidence


def make_record(entity_dict, place_type, country_code, retrieved_at,
                region_codes=None, selection_rank=None):
    """Create a raw candidate envelope record for the framework builder.

    reviewed_at is null (not set) until human review occurs.
    """
    observed = entity_dict.get("population_reference_date")
    if region_codes is None:
        region_codes = set()
    evidence = _build_evidence(entity_dict, place_type, region_codes)
    return {
        "source_id": entity_dict["source_id"],
        "source_record_key": entity_dict["source_record_key"],
        "country_code": country_code,
        "data_domain": DATA_DOMAIN,
        "observed_at": ("%sT00:00:00Z" % observed) if observed else retrieved_at,
        "retrieved_at": retrieved_at,
        "reviewed_at": None,
        "parser_version": PARSER_VERSION,
        "candidate_schema_version": CANDIDATE_SCHEMA_VERSION,
        "payload": entity_to_payload(entity_dict, place_type, selection_rank),
        "evidence": evidence,
    }


def build_country_records(parsed, country_code, retrieved_at):
    """Assemble records for one country: country + regions + top-100 cities.

    Returns (records, selection_summary).
    """
    records = []
    country = parsed.get("country")
    if country is not None:
        records.append(make_record(country, "country", country_code,
                                     retrieved_at))
    regions = parsed.get("regions", [])
    region_codes = {r["statistical_code"] for r in regions if r.get("statistical_code")}
    for region in regions:
        records.append(make_record(region, "region", country_code,
                                     retrieved_at,
                                     region_codes=region_codes))

    selected, summary = select_top_cities(parsed.get("cities", []))
    for rank, city in enumerate(selected, 1):
        city = _resolve_parent(city, region_codes, country_code)
        records.append(make_record(city, "city", country_code,
                                     retrieved_at,
                                     region_codes=region_codes,
                                     selection_rank=rank))
    return records, summary
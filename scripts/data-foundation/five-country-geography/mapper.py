"""Top-100 city selection and candidate envelope assembly.

Selection rule (deterministic, documented):
  cities are ordered by population descending (ties broken by source key);
  each parent region receives up to `per_region_cap` guaranteed seats so
  smaller regions are represented, then the remaining seats are filled by
  population. The result is capped at `limit` cities total.

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


def select_top_cities(cities, limit=100, per_region_cap=20):
    """Select up to `limit` cities with per-region guarantees.

    Returns (selected, summary) where summary describes the region
    distribution for the coverage report.
    """
    eligible = [c for c in cities if c.get("population") is not None]
    eligible.sort(key=lambda c: (-(c["population"] or 0),
                                 c.get("source_record_key") or ""))

    by_region = OrderedDict()
    for c in eligible:
        by_region.setdefault(c.get("parent_region_code"), []).append(c)

    selected = OrderedDict()
    for region, group in by_region.items():
        for c in group[:per_region_cap]:
            selected[c["source_record_key"]] = c
    remaining = limit - len(selected)
    if remaining > 0:
        for c in eligible:
            if len(selected) >= limit:
                break
            if c["source_record_key"] not in selected:
                selected[c["source_record_key"]] = c

    ordered = [c for c in eligible if c["source_record_key"] in selected][:limit]

    summary = {
        "limit": limit,
        "per_region_cap": per_region_cap,
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


def entity_to_payload(entity_dict, place_type, selection_rank=None):
    """Build the geography payload dict from a parsed entity dict."""
    payload = {"place_type": place_type}
    for key in ENTITY_PAYLOAD_FIELDS:
        payload[key] = entity_dict.get(key)
    if selection_rank is not None:
        payload["selection_rank"] = selection_rank
    return payload


def make_record(entity_dict, place_type, country_code, retrieved_at,
                selection_rank=None, evidence=None):
    """Create a raw candidate envelope record for the framework builder."""
    observed = entity_dict.get("population_reference_date")
    return {
        "source_id": entity_dict["source_id"],
        "source_record_key": entity_dict["source_record_key"],
        "country_code": country_code,
        "data_domain": DATA_DOMAIN,
        "observed_at": ("%sT00:00:00Z" % observed) if observed else retrieved_at,
        "retrieved_at": retrieved_at,
        "reviewed_at": retrieved_at,
        "parser_version": PARSER_VERSION,
        "candidate_schema_version": CANDIDATE_SCHEMA_VERSION,
        "payload": entity_to_payload(entity_dict, place_type, selection_rank),
        "evidence": evidence or {},
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
    for region in parsed.get("regions", []):
        records.append(make_record(region, "region", country_code,
                                   retrieved_at))

    selected, summary = select_top_cities(parsed.get("cities", []))
    for rank, city in enumerate(selected, 1):
        records.append(make_record(city, "city", country_code, retrieved_at,
                                   selection_rank=rank))
    return records, summary

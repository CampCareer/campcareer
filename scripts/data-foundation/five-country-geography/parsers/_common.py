"""Shared helpers for country parsers: entity factories and raw file readers."""

import csv
import io
import os
import zipfile


def stage_path(raw_dir, filename):
    return os.path.join(raw_dir, filename)


def read_csv(raw_dir, filename, encoding="utf-8-sig", delimiter=","):
    path = stage_path(raw_dir, filename)
    if filename.endswith(".zip"):
        raise ValueError("read_csv expects an extracted file, got zip %s" % filename)
    with open(path, encoding=encoding, newline="") as fh:
        text = fh.read()
    return list(csv.DictReader(io.StringIO(text), delimiter=delimiter))


def read_zip_member_csv(raw_dir, zip_name, member, encoding="utf-8-sig",
                        delimiter=","):
    path = stage_path(raw_dir, zip_name)
    with zipfile.ZipFile(path) as zf:
        raw = zf.read(member)
    return list(csv.DictReader(io.StringIO(raw.decode(encoding)), delimiter=delimiter))


def to_int(value):
    if value is None:
        return None
    s = str(value).strip()
    if s == "":
        return None
    try:
        return int(float(s))
    except ValueError:
        return None


def to_float(value):
    if value is None:
        return None
    s = str(value).strip()
    if s in ("", "."):
        return None
    try:
        return float(s)
    except ValueError:
        return None


def clean_name(value):
    if value is None:
        return None
    return " ".join(str(value).split())


def entity(type_, source_id, source_record_key, official_name, short_name,
           population, population_reference_date, statistical_code,
           source_geographic_level, coordinates=None, coordinate_derivation=None,
           area_km2=None, local_name=None, parent_region_code=None,
           parent_region_name=None, parent_join_method=None):
    return {
        "type": type_,
        "source_id": source_id,
        "source_record_key": source_record_key,
        "official_name": official_name,
        "short_name": short_name,
        "local_name": local_name,
        "population": population,
        "population_reference_date": population_reference_date,
        "coordinates": coordinates,
        "coordinate_derivation": coordinate_derivation,
        "statistical_code": statistical_code,
        "source_geographic_level": source_geographic_level,
        "area_km2": area_km2,
        "parent_region_code": parent_region_code,
        "parent_region_name": parent_region_name,
        "parent_join_method": parent_join_method,
    }


def join_metric(name, total, matched, method):
    return {"name": name, "total": total, "matched": matched, "method": method}

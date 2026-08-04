"""Retrieve and verify raw source artifacts for the five-country pipeline.

Rules:
- File sources are stored in the raw scratch dir. A stage file is reused when
  its sha256 matches the pinned checksum; otherwise it is downloaded from
  `download_url` (or `official_url` when that is the direct file) and verified.
- API (mapserver) sources are assembled deterministically by this module:
  every run of the same code must produce the same bytes. The sha256 of the
  assembled artifact is computed here and recorded in the source manifest; a
  small cache file records the last computed checksum so repeat runs reuse the
  assembled file without re-querying the service.
- Raw files larger than 1 MB are never committed to Git (3-tier policy); the
  raw scratch dir is gitignored.

Deterministic assembly contract:
  mapserver: features sorted by properties.objectid (ASC), payload is
  {"features": [...]} serialized with sort_keys=True.
"""

import hashlib
import json
import os
import socket
import warnings
import zipfile

import requests

warnings.filterwarnings("ignore")

_HEADERS = {"User-Agent": "campcareer-data-foundation/1.0 (research)"}

# Force IPv4 (some ArcGIS/StatsCan endpoints are IPv6-unreachable on macOS).
_orig_getaddrinfo = socket.getaddrinfo


def _ipv4_getaddrinfo(*args, **kwargs):
    return _orig_getaddrinfo(args[0], args[1], socket.AF_INET)


socket.getaddrinfo = _ipv4_getaddrinfo


def sha256_bytes(data):
    return hashlib.sha256(data).hexdigest()


def sha256_file(path):
    h = hashlib.sha256()
    with open(path, "rb") as fh:
        for chunk in iter(lambda: fh.read(1024 * 1024), b""):
            h.update(chunk)
    return h.hexdigest()


def _expected_sha(source):
    cs = source.get("checksum")
    if isinstance(cs, str) and cs.startswith("sha256:"):
        return cs[len("sha256:"):]
    return None


def _download(url, timeout=900):
    resp = requests.get(url, timeout=timeout, verify=False, headers=_HEADERS)
    resp.raise_for_status()
    return resp.content


def _assemble_mapserver(source):
    base = source["api"]["url"]
    features = []
    offset = 0
    page_size = 2000
    while True:
        url = ("%s/query?where=1%%3D1&outFields=*&returnGeometry=true&f=geojson"
               "&outSR=4326&resultOffset=%d&resultRecordCount=%d"
               % (base, offset, page_size))
        data = _download(url, timeout=1200).decode("utf-8")
        payload = json.loads(data)
        page = payload.get("features", [])
        features.extend(page)
        if not page or not payload.get("exceededTransferLimit", False):
            break
        offset += page_size
    features.sort(key=lambda f: f["properties"].get("objectid"))
    return json.dumps({"features": features}, sort_keys=True).encode("utf-8")


def _stage_path(raw_dir, source):
    return os.path.join(raw_dir, source["stage"])


def _read_cache(raw_dir):
    path = os.path.join(raw_dir, ".retrieval_cache.json")
    if os.path.exists(path):
        with open(path) as fh:
            return json.load(fh)
    return {}


def _write_cache(raw_dir, cache):
    with open(os.path.join(raw_dir, ".retrieval_cache.json"), "w") as fh:
        json.dump(cache, fh, indent=2, sort_keys=True)


def ensure_source(raw_dir, source, seed_dir=None, force=False):
    """Make sure a raw artifact for `source` exists in `raw_dir`.

    Returns (manifest_checksum, file_size, reused) where manifest_checksum is a
    "sha256:<hex>" string, or None when the artifact could not be produced.
    """
    stage = _stage_path(raw_dir, source)
    kind = source.get("kind", "file")

    # Fast path: file already present and checksum matches.
    if os.path.exists(stage) and not force:
        cur = sha256_file(stage)
        if kind == "api":
            cache = _read_cache(raw_dir)
            if cache.get(source["source_id"]) == cur:
                return "sha256:%s" % cur, os.path.getsize(stage), True
        else:
            exp = _expected_sha(source)
            if exp and exp == cur:
                return source["checksum"], os.path.getsize(stage), True
            if exp is None:
                return "sha256:%s" % cur, os.path.getsize(stage), True

    # API source: deterministic assembly.
    if kind == "api" and source.get("api", {}).get("type") == "mapserver":
        raw = _assemble_mapserver(source)
        with open(stage, "wb") as fh:
            fh.write(raw)
        cs = sha256_bytes(raw)
        cache = _read_cache(raw_dir)
        cache[source["source_id"]] = cs
        _write_cache(raw_dir, cache)
        exp = _expected_sha(source)
        if exp is not None and exp != cs:
            print("  ! assembly checksum changed for %s: %s (expected %s)"
                  % (source["source_id"], cs, exp))
        return "sha256:%s" % cs, len(raw), False

    # File source: download (direct file URL), else seed dir, else skip.
    content = None
    src = None
    dl = source.get("download_url")
    if dl:
        try:
            content = _download(dl)
            src = "download"
        except Exception as exc:
            print("  ! download failed for %s: %s" % (source["source_id"], exc))
    if content is None and seed_dir:
        seed_path = os.path.join(seed_dir, source["stage"])
        if os.path.exists(seed_path):
            content = open(seed_path, "rb").read()
            src = "seed"
    if content is None:
        print("  ! no artifact for %s (%s); skipping" % (source["source_id"], source["stage"]))
        return None, None, False

    with open(stage, "wb") as fh:
        fh.write(content)
    cs = sha256_bytes(content)
    exp = _expected_sha(source)
    if exp is not None and exp != cs:
        raise RuntimeError(
            "checksum mismatch for %s: got %s expected %s (source may have "
            "changed upstream)" % (source["source_id"], cs, exp))
    print("  %s: retrieved from %s, %d bytes" % (source["source_id"], src, len(content)))
    return ("sha256:%s" % cs), len(content), False


def is_zip(path):
    try:
        return zipfile.is_zipfile(path)
    except Exception:
        return False


def manifest_from_source(source, checksum, file_size, retrieved_at):
    """Return a manifest dict (10.7B fields only)."""
    out = {k: source.get(k) for k in ("source_id", "country_code", "data_domain",
                                      "authority", "official_url",
                                      "retrieval_method", "licence",
                                      "usage_restriction", "refresh_cadence",
                                      "content_type", "raw_storage_tier",
                                      "notes")}
    out["checksum"] = checksum or source.get("checksum")
    out["file_size"] = file_size if file_size is not None else source.get("file_size")
    out["retrieved_at"] = retrieved_at
    out["reviewed_at"] = retrieved_at
    out["parser_version"] = source.get("parser_version", "1.0.0")
    out["candidate_schema_version"] = source.get("candidate_schema_version", "1.0.0")
    return out

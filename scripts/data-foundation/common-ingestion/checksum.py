"""10.7B Common Source Ingestion Framework v1 - checksum helpers.

SHA-256 based integrity helpers for source manifests, candidate packages and
raw files. The framework never downloads or stores raw data itself; checksum
validation is format + (when the file is present) content verification.
"""

import hashlib
import os
import re

SHA256_PREFIX = "sha256:"
_SHA256_RE = re.compile(r"^[0-9a-f]{64}$")


def sha256_file(path, block_size=1024 * 1024):
    """Return the hex sha256 digest of a file without loading it whole."""
    h = hashlib.sha256()
    with open(path, "rb") as fh:
        for chunk in iter(lambda: fh.read(block_size), b""):
            h.update(chunk)
    return h.hexdigest()


def sha256_bytes(data):
    """Return the hex sha256 digest of a byte string."""
    return hashlib.sha256(data).hexdigest()


def checksum_string(hex_digest):
    """Render a plain hex digest as the canonical 'sha256:<hex>' string."""
    if hex_digest.startswith(SHA256_PREFIX):
        return hex_digest
    if _SHA256_RE.match(hex_digest or ""):
        return SHA256_PREFIX + hex_digest
    return None


def parse_checksum(checksum):
    """Parse a manifest checksum value.

    Returns dict { "well_formed": bool, "algorithm": str, "hex": str|None }.
    """
    if not checksum or not isinstance(checksum, str):
        return {"well_formed": False, "algorithm": None, "hex": None}
    s = checksum.strip().lower()
    if s.startswith(SHA256_PREFIX):
        hex_part = s[len(SHA256_PREFIX):]
        if _SHA256_RE.match(hex_part):
            return {"well_formed": True, "algorithm": "sha256", "hex": hex_part}
        return {"well_formed": False, "algorithm": "sha256", "hex": None}
    if _SHA256_RE.match(s):
        return {"well_formed": True, "algorithm": "sha256", "hex": s}
    return {"well_formed": False, "algorithm": None, "hex": None}


def write_checksums(directory, output_name="SHA256SUMS.txt"):
    """Write a sorted SHA256SUMS.txt covering every file under directory.

    Returns the number of files hashed.
    """
    entries = []
    for root, _dirs, files in os.walk(directory):
        for name in files:
            if name == output_name:
                continue
            path = os.path.join(root, name)
            rel = os.path.relpath(path, directory)
            entries.append((rel, sha256_file(path)))
    entries.sort(key=lambda item: item[0])
    with open(os.path.join(directory, output_name), "w") as fh:
        for rel, digest in entries:
            fh.write("%s  %s\n" % (digest, rel))
    return len(entries)


def verify_checksums(directory, checksum_name="SHA256SUMS.txt"):
    """Verify a SHA256SUMS.txt against files in directory.

    Returns dict { "ok": bool, "checked": int, "missing": [...],
                   "mismatch": [...] }.
    """
    result = {"ok": True, "checked": 0, "missing": [], "mismatch": []}
    path = os.path.join(directory, checksum_name)
    if not os.path.exists(path):
        result["ok"] = False
        result["missing"].append(checksum_name)
        return result
    with open(path) as fh:
        for line in fh:
            line = line.rstrip("\n")
            if not line:
                continue
            parts = line.split(None, 1)
            if len(parts) != 2:
                result["ok"] = False
                result["mismatch"].append(line)
                continue
            digest, rel = parts[0], parts[1]
            full = os.path.join(directory, rel)
            if not os.path.exists(full):
                result["ok"] = False
                result["missing"].append(rel)
                continue
            actual = sha256_file(full)
            result["checked"] += 1
            if actual != digest:
                result["ok"] = False
                result["mismatch"].append(rel)
    return result

"""10.7B Common Source Ingestion Framework v1 - country code policy.

Canonical country codes are ISO alpha-2 from the CampCareer five-country set:
AU, CA, IE, GB, US. UK is treated only as an input alias / product-display
alias and is normalized to GB while the original source value is preserved in
candidate evidence.

The running production database currently contains a legacy `UK` row; this
framework never writes to it and never creates a new `UK` canonical code.
"""

import re

from schemas import CANONICAL_COUNTRIES, COUNTRY_ALIASES

_ALPHA2_RE = re.compile(r"^[A-Z]{2}$")


def normalize_country_code(value, raw=None):
    """Normalize an input country code to a canonical ISO alpha-2 code.

    Returns a dict:
      { "normalized": <code or None>, "canonical": bool,
        "input": <original or None>, "alias_applied": <alias or None> }

    - uppercase trims and upper-cases the input;
    - UK -> GB via COUNTRY_ALIASES;
    - unknown/unparseable input stays None (never coerced to a fake code).
    """
    if value is None:
        return {"normalized": None, "canonical": False,
                "input": None, "alias_applied": None}
    s = str(value).strip().upper()
    if not _ALPHA2_RE.match(s):
        return {"normalized": None, "canonical": False,
                "input": value, "alias_applied": None}
    if s in COUNTRY_ALIASES:
        return {"normalized": COUNTRY_ALIASES[s], "canonical": False,
                "input": raw if raw is not None else value,
                "alias_applied": s}
    if s in CANONICAL_COUNTRIES:
        return {"normalized": s, "canonical": True,
                "input": raw if raw is not None else value,
                "alias_applied": None}
    # A well-formed alpha-2 code outside the five-country set: keep it in the
    # candidate (it is valid ISO), but it is not canonical for this product.
    return {"normalized": s, "canonical": False,
            "input": raw if raw is not None else value,
            "alias_applied": None}


def is_canonical_country(code):
    """True when code is exactly one of AU/CA/IE/GB/US."""
    return code in CANONICAL_COUNTRIES

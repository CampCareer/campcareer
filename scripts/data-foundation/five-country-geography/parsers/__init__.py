"""Country parsers for the five-country official geography pipeline.

Each module exposes `parse(raw_dir) -> dict` returning
{"country": entity|None, "regions": [...], "cities": [...],
 "join_metrics": [...], "notes": [...]}.

Entity contract (see _common.py ENTITY_KEYS) carries everything the mapper
needs to assemble 10.7B candidate envelopes: names, population, reference
date, coordinates and parent-region linkage.
"""

from . import us, ca, ie, gb, au  # noqa: F401

PARSERS = {
    "US": us.parse,
    "CA": ca.parse,
    "IE": ie.parse,
    "GB": gb.parse,
    "AU": au.parse,
}

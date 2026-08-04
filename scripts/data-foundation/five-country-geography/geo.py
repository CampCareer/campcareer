"""Geometry helpers: shapefile reads, centroids, point-in-polygon joins.

All polygon centroids are geometric (unweighted) centroids computed from the
official boundary polygon via shapely. Coordinates are WGS84 decimal degrees
unless explicitly transformed (Irish Transverse Mercator -> WGS84).
"""

import os
import tempfile
import zipfile

import shapefile as _pyshp
from shapely.geometry import shape as _shapely_shape, Point as _Point


def extract_zip_member(zip_path, member, dest_dir):
    """Extract `member` from `zip_path` into `dest_dir`; returns file path."""
    out = os.path.join(dest_dir, os.path.basename(member))
    if os.path.exists(out):
        return out
    with zipfile.ZipFile(zip_path) as zf:
        with zf.open(member) as src, open(out, "wb") as dst:
            dst.write(src.read())
    return out


def extract_shapefile_zip(zip_path, dest_dir):
    """Extract an ESRI shapefile set from a zip into dest_dir.

    Returns the .shp path and the directory (for sibling .dbf/.shx reads).
    """
    os.makedirs(dest_dir, exist_ok=True)
    shp_path = None
    with zipfile.ZipFile(zip_path) as zf:
        for name in zf.namelist():
            if name.endswith("/"):
                continue
            out = os.path.join(dest_dir, os.path.basename(name))
            with zf.open(name) as src, open(out, "wb") as dst:
                dst.write(src.read())
            if name.lower().endswith(".shp"):
                shp_path = out
    return shp_path, dest_dir


def read_shapefile(shp_path):
    """Return (geometries, records) from an ESRI shapefile.

    geometries are shapely geometry objects; records are dicts of attributes.
    The .dbf text encoding is detected from a sibling .cpg file when present
    and falls back to cp1252 when the default utf-8 decode fails (Statistics
    Canada .dbf files carry French accented names in legacy encodings).
    """
    cpg = None
    cpg_path = shp_path[:-4] + ".cpg"
    if os.path.exists(cpg_path):
        cpg = open(cpg_path).read().strip().lower()
    enc = {"utf-8": "utf-8", "iso 8859-1": "cp1252", "latin1": "cp1252",
           "cp1252": "cp1252"}.get(cpg, "utf-8")

    def _read(encoding):
        sf = _pyshp.Reader(shp_path, encoding=encoding)
        fields = [f[0] for f in sf.fields[1:]]
        geoms = [_shapely_shape(s.__geo_interface__) for s in sf.shapes()]
        recs = [dict(zip(fields, rec)) for rec in sf.records()]
        sf.close()
        return geoms, recs

    try:
        return _read(enc)
    except _pyshp.dbfFileException:
        if enc != "cp1252":
            return _read("cp1252")
        raise


def centroid_of(geom):
    """WGS84 centroid (lon, lat) of a shapely geometry."""
    if geom is None or geom.is_empty:
        return None
    c = geom.centroid
    return (c.x, c.y)


def polygon_centroid_from_rings(rings):
    """Centroid (lon, lat) of an ArcGIS-style polygon (list of ring point lists)."""
    outer = [tuple(p) for p in rings[0]]
    geom = _Point(0, 0)  # placeholder; replaced below
    import shapely.geometry as _g
    shell = _g.Polygon(outer)
    return (shell.centroid.x, shell.centroid.y)


def point_in_polygon(lon, lat, geom):
    if geom is None or geom.is_empty:
        return False
    return geom.covers(_Point(lon, lat))


def nearest_polygon(lon, lat, candidates):
    """Return index of the polygon whose centroid is nearest to (lon, lat).

    candidates: iterable of shapely geometries. Uses great-circle-ish distance
    on projected-free Euclidean lon/lat, adequate for nearest-council fallback.
    """
    best_idx = None
    best_d = None
    for i, geom in enumerate(candidates):
        c = centroid_of(geom)
        if c is None:
            continue
        d = (c[0] - lon) ** 2 + (c[1] - lat) ** 2
        if best_d is None or d < best_d:
            best_d = d
            best_idx = i
    return best_idx


# ---------------------------------------------------------------------------
# Coordinate transforms
# ---------------------------------------------------------------------------
_ITM_TO_WGS84 = None
_BNG_TO_WGS84 = None
_PRJ_TRANSFORMERS = {}


def wkt_to_wgs84(wkt, x, y):
    """Project (x, y) from a .prj WKT coordinate system to WGS84 (EPSG:4326)."""
    from pyproj import CRS, Transformer
    if wkt not in _PRJ_TRANSFORMERS:
        _PRJ_TRANSFORMERS[wkt] = Transformer.from_crs(
            CRS.from_wkt(wkt), CRS.from_epsg(4326), always_xy=True)
    lon, lat = _PRJ_TRANSFORMERS[wkt].transform(x, y)
    return lon, lat


def itm_to_wgs84(x, y):
    """Convert Irish Transverse Mercator (EPSG:2157) to WGS84 (EPSG:4326)."""
    global _ITM_TO_WGS84
    if _ITM_TO_WGS84 is None:
        from pyproj import Transformer
        _ITM_TO_WGS84 = Transformer.from_crs(2157, 4326, always_xy=True)
    lon, lat = _ITM_TO_WGS84.transform(x, y)
    return lon, lat


def bng_to_wgs84(x, y):
    """Convert British National Grid (EPSG:27700) to WGS84 (EPSG:4326)."""
    global _BNG_TO_WGS84
    if _BNG_TO_WGS84 is None:
        from pyproj import Transformer
        _BNG_TO_WGS84 = Transformer.from_crs(27700, 4326, always_xy=True)
    lon, lat = _BNG_TO_WGS84.transform(x, y)
    return lon, lat

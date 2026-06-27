ALTER TABLE colleges_ie ADD COLUMN IF NOT EXISTS lat DOUBLE PRECISION;
ALTER TABLE colleges_ie ADD COLUMN IF NOT EXISTS lng DOUBLE PRECISION;

COMMENT ON COLUMN colleges_ie.lat IS 'Latitude (WGS84) for map pin';
COMMENT ON COLUMN colleges_ie.lng IS 'Longitude (WGS84) for map pin';

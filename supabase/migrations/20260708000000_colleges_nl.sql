BEGIN;

-- Netherlands WO universities (13 research universities)
CREATE TABLE IF NOT EXISTS public.colleges_nl (
  id                UUID         NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  institution_id    TEXT         NOT NULL UNIQUE,
  name              TEXT         NOT NULL,
  city              TEXT,
  province          TEXT,
  lat               NUMERIC,
  lng               NUMERIC,
  qs_rank           SMALLINT,
  website           TEXT,
  tuition           NUMERIC      DEFAULT 15000,
  median_earnings   NUMERIC,
  graduation_rate   NUMERIC      DEFAULT 0.82,
  rent_median       NUMERIC,
  cost_of_living_index NUMERIC,
  synced_at         TIMESTAMPTZ  DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_colleges_nl_province ON public.colleges_nl(province);

COMMENT ON TABLE  public.colleges_nl IS 'Netherlands WO universities (13 research universities)';
COMMENT ON COLUMN public.colleges_nl.province IS '2-letter province code (DR/FL/FR/GE/GR/LI/NB/NH/OV/UT/ZE/ZH)';

-- Seed data
INSERT INTO colleges_nl (institution_id, name, city, province, lat, lng, qs_rank, website, tuition, median_earnings, graduation_rate, rent_median, cost_of_living_index) VALUES
('nl-01', 'Delft University of Technology',         'Delft',      'ZH', 51.9994572, 4.3627245,  47, 'https://www.tudelft.nl/',   15000, 70000, 0.82, 1300, 67),
('nl-02', 'University of Amsterdam',                'Amsterdam',  'NH', 52.3730796, 4.8924534,  53, 'https://www.uva.nl/',       15000, 65000, 0.82, 2000, 82),
('nl-03', 'Utrecht University',                     'Utrecht',    'UT', 52.0907006, 5.1215634, 103, 'https://www.uu.nl/',        15000, 58000, 0.82, 1700, 74),
('nl-04', 'Leiden University',                      'Leiden',     'ZH', 52.1594747, 4.4908843, 119, 'https://www.universiteitleiden.nl/', 15000, 58000, 0.82, 1200, 66),
('nl-05', 'Eindhoven University of Technology',     'Eindhoven',  'NB', 51.4392648, 5.4786330, 140, 'https://www.tue.nl/',       15000, 58000, 0.82, 1200, 65),
('nl-06', 'Erasmus University Rotterdam',           'Rotterdam',  'ZH', 51.9244424, 4.4777500, 140, 'https://www.eur.nl/',       15000, 58000, 0.82, 1400, 70),
('nl-07', 'University of Groningen',                'Groningen',  'GR', 53.2190652, 6.5680077, 147, 'https://www.rug.nl/',       15000, 58000, 0.82, 1100, 62),
('nl-08', 'Wageningen University & Research',       'Wageningen', 'GE', 51.9663016, 5.6662814, 153, 'https://www.wur.nl/',       15000, 53000, 0.82,  750, 54),
('nl-09', 'Vrije Universiteit Amsterdam',           'Amsterdam',  'NH', 52.3730796, 4.8924534, 194, 'https://www.vu.nl/',        15000, 53000, 0.82, 2000, 82),
('nl-10', 'University of Twente',                   'Enschede',   'OV', 52.2209855, 6.8940537, 203, 'https://www.utwente.nl/',   15000, 48000, 0.82,  850, 56),
('nl-11', 'Maastricht University',                  'Maastricht', 'LI', 50.8579855, 5.6969882, 239, 'https://www.maastrichtuniversity.nl/', 15000, 48000, 0.82, 1100, 63),
('nl-12', 'Radboud University',                     'Nijmegen',   'GE', 51.8425749, 5.8389606, 279, 'https://www.ru.nl/',        15000, 48000, 0.82, 1050, 61),
('nl-13', 'Tilburg University',                     'Tilburg',    'NB', 51.5856185, 5.0660616, 347, 'https://www.tilburguniversity.edu/', 15000, 43000, 0.82, 1000, 60)
ON CONFLICT (institution_id) DO UPDATE SET
  name = EXCLUDED.name,
  city = EXCLUDED.city,
  province = EXCLUDED.province,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  qs_rank = EXCLUDED.qs_rank,
  website = EXCLUDED.website,
  tuition = EXCLUDED.tuition,
  median_earnings = EXCLUDED.median_earnings,
  graduation_rate = EXCLUDED.graduation_rate,
  rent_median = EXCLUDED.rent_median,
  cost_of_living_index = EXCLUDED.cost_of_living_index;

GRANT SELECT ON colleges_nl TO anon, authenticated;

COMMIT;

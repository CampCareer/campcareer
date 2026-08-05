# Country dashboard data standard

This contract is the rollout baseline for the 20 launch-country dashboards.

## Static TypeScript profile

Keep low-frequency descriptive content in TypeScript:

- country name, ISO code and currency code
- short introduction
- academic-year and intake description
- major institution names, locations and institution type
- strong-major labels and concise selection reasons
- regions, cities, display order and UI copy
- official reference links for descriptive claims

Common institution types:

- `university`
- `college_polytechnic`
- `vocational_provider`
- `public_technical_institute`
- `specialist_institution`

## Canonical numeric evidence

Store changing or ranking-related values in the canonical Supabase evidence schema:

- `evidence.sources`
- `evidence.source_snapshots`
- `evidence.metric_observations`

Country metrics use `scope_type = 'country'` and the uppercase ISO country code as `scope_id`.
Subdivision and city metrics will later use their own scope types and stable IDs.

### Range contract

Range metrics store the visible range and ranking value together:

```json
{
  "low": 74048,
  "high": 133120,
  "ranking_value": 98124,
  "currency": "AUD",
  "basis": "middle_50_percent_full_time_persons",
  "scenario": null,
  "measure_type": "interquartile_range"
}
```

Required fields:

- `low`: lower displayed value
- `high`: upper displayed value
- `ranking_value`: representative value used for country rankings
- `currency`: ISO 4217 currency code
- `basis` or `scenario`: the population and calculation basis

The observation also preserves unit, effective date, source snapshot, confidence, methodology, assumptions, review status and verification time.

## Standard metrics

Initial country-card keys:

- `full_time_annual_earnings_range`
- `student_living_cost_monthly_range`
- `national_minimum_hourly_wage`

The salary range should use a comparable individual full-time gross earnings measure. The ranking value should normally be the median.

The living-cost scenario may differ by country. It must represent a typical international-student arrangement for that country and clearly record included and excluded costs. Australia uses one student in shared housing across five major cities.

## Links and deeper routes

- Visa card: `/visas?country=AU`
- Future occupation link: `/occupations?country=AU`
- Future institution link: `/programs?country=AU&institution=...`
- Future city route: `/countries/au/sydney`

Do not add dead links before the destination page and data are ready.

## SEO publication rule

A country page becomes indexable and enters the sitemap only after:

- the salary and living-cost ranges are verified
- the ranking values are stored
- the displayed scenario is clear
- official sources are listed on the page
- the canonical URL is set
- CI and production rendering pass

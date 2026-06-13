# Phase C — Source priority summary

Read-only analysis of `docs/phase-c-gap.csv` (250 rows = 50 country×field × 5 metrics).
Goal: decide which official sources to chase first so the most rows flip from
`estimate` → `verified` per unit of effort. **No values were invented** — current
values/sources are read straight from the `public.majors` table.

## Table / schema reference (for the seed/UPDATE author)

- **Table:** `public.majors`
- **Primary key:** `id` (uuid) → this is `row_pk` in the CSV.
  `(slug, country)` is also unique, so UPDATEs can target either
  `WHERE id = '<row_pk>'` or `WHERE slug='<field>' AND country='<country>'`.
- **Metric → column mapping:**
  | metric | column(s) |
  |---|---|
  | employment | `employment_rate` (also `employment_score`) |
  | visa | `occupation_list_match` (bool), `post_study_work_years` (int), `visa_pathway_score` |
  | demand | `market_demand_score` (0–100) |
  | ai_exposure | `ai_exposure_band` (low/medium/high), `ai_note` |
  | roi | `avg_annual_tuition_intl`, `median_starting_salary`, `payback_years` |
- **Confidence:** `data_confidence` (currently `estimate` on all 50 rows), `last_verified` (currently null on all 50).
- **Sources:** `sources` JSONB array of `{ name, url }`; the UI picks one per layer by keyword (`LAYER_SOURCE_KEYWORDS`).

## High-efficiency sources (verify these first — most rows per source)

Sorted by how many CSV rows one source can move to `verified`.

1. **Per-country graduate-outcome survey → covers employment + ROI salary (≈20 rows each, verifiable=yes)**
   - **QILT Graduate Outcomes Survey** (AU): 10 employment + the salary side of 10 ROI rows.
   - **HEA Graduate Outcomes Survey** (IE): 10 employment + 10 ROI salary.
   - **HESA Graduate Outcomes + LEO earnings** (UK): 10 employment + 10 ROI salary.
   - **College Scorecard** (US): 10 employment + 10 ROI (tuition *and* median earnings in one source).
   → 4 sources unlock ~80 rows.

2. **Per-country visa instrument → covers all 10 visa rows of that country (verifiable=yes)**
   - AU: Core Skills Occupation List (CSOL) + subclass 485 duration.
   - IE: Critical Skills Occupations List + Stamp 1G duration.
   - UK: Skilled Worker / Immigration Salary List + Graduate Route (2yr, →18mo from 2027).
   - US: USCIS STEM-OPT designated-degree list + OPT/H-1B durations.
   - CA: IRCC Express Entry category-based draws + PGWP duration.
   → The post-study-work *duration* is a single official figure per country (covers all 10 at once); `occupation_list_match` still needs a per-occupation check against the current list.

3. **Tuition registries → ROI tuition half (verifiable=yes)**
   - AU **CRICOS** (10), UK **Discover Uni** (10), US **College Scorecard** (already in #1), IE HEA/Qualifax (10). Pair with the salary source from #1 to fully verify ROI.

4. **OECD AI-exposure analysis + Felten occupational AI-exposure index → all 50 ai_exposure rows from one body of research** — but `verifiable=hard` (see below).

## verifiable = hard (do NOT mark verified without extra work)

120 rows are `hard`. Grouped by reason:

- **demand — all 50 rows.** `market_demand_score` is a 0–100 **composite index we synthesize**; no government publishes a single 0–100 demand figure. To "verify" we must document the component inputs (vacancy trends, shortage-list membership, projected openings) and cite each — not point to one URL.
- **ai_exposure — all 50 rows.** The low/medium/high **band is an interpretive mapping** of occupation-level OECD/Felten exposure research onto a specific major. The research is published, but the major→band verdict needs a documented crosswalk; it is not a quotable single statistic.
- **CA employment — 10 rows.** No field-level graduate-employment survey equivalent to QILT/HEA exists; Statistics Canada NGS is periodic and coarse-grained.
- **CA ROI salary — 10 rows.** Field-level graduate *starting* salary is not cleanly published; StatCan earnings are program/level-aggregated and lagged. (CA tuition is fine; the salary half is the blocker.)

## Suggested order of work

1. College Scorecard (US: 20 rows, one source). 2. QILT (AU), HEA (IE), HESA+LEO (UK) employment+salary (~60 rows). 3. Visa instruments × 5 countries (50 rows; durations quick, list-membership per-occupation). 4. CRICOS/Discover Uni tuition. 5. Decide a documented methodology for demand + ai_exposure (these stay `estimate` with a transparent "composite/interpretive" note rather than a false `verified`).

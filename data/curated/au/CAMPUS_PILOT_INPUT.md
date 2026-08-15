# Australia Campus pilot curated input

This directory is the reviewed input boundary for the first Campus implementation cohort:

`Australia × Nursing × AQF 7 × International`

The canonical importer is `scripts/import-au-campus-pilot.ts`.

## Workflow

1. Collect facts only from the approved source matrix in `docs/AUSTRALIA_CAMPUS_CAREER_PILOT_RESEARCH.md`.
2. Create `data/curated/au/campus-pilot-nursing.json` using the payload contract in `scripts/lib/campus-pilot.ts`.
3. Record a source entry and immutable snapshot hash for every outcome, requirement, or accreditation claim.
4. Identify institutions only through an existing exact `catalog.institution_identifiers` value.
5. Identify programmes only by exact `CRICOS_COURSE_CODE`.
6. Run `npm run import:au-campus-pilot`. Dry-run is the default and must resolve every provider, programme, offering and AQF level.
7. Review the payload and diff. Only then run `npm run import:au-campus-pilot -- --apply` in a controlled environment.
8. A Campus score remains unavailable until the cohort has at least five complete programmes across at least three providers.

## Required source roles for Nursing

- CRICOS: programme/provider identity, international registration, delivery and course facts.
- QILT/ComparED: provider × Nursing × qualification-level graduate earnings and employment outcomes.
- Provider course pages: current international tuition, admissions and English requirements.
- Ahpra/NMBA: approved-programme and registration-pathway evidence.

QILT provider/study-area outcomes are not exact individual-programme outcomes. They should normally be imported with `confidence: medium` and disclosed as estimated evidence at programme level.

## Safety rules

- No fuzzy provider or programme matching.
- No `null → 0` substitution.
- No score inferred from missing outcomes.
- No provider-specific outcome copied from a national/field-only statistic.
- Admission English and professional registration English remain separate facts.
- QS or another proprietary ranking is not part of the Campus ROI score and is not imported without appropriate display rights.
- Historical `roi_explorer_au.roi_score` and `payback_years` are not accepted as canonical inputs.

## Example payload shape

```json
{
  "schemaVersion": "1.0.0",
  "countryCode": "AU",
  "fieldKey": "nursing",
  "qualificationLevelCode": "7",
  "studentMarket": "international",
  "sources": [],
  "outcomes": [],
  "programmes": []
}
```

Empty arrays document the shape only. They are not a score-ready cohort.

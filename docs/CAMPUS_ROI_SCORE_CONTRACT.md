# CampCareer Campus ROI Score Contract v1

Status: Canonical Campus scoring and readiness contract  
Effective date: 2026-08-15

This document defines the education-value score shown in Campus.

It intentionally reuses useful mechanics from the historical school/value score while fixing the key product flaw: scores must be attached to a comparable programme/qualification context, not to an institution in the abstract.

---

## 1. The question the score answers

> **How strong is the value of this education option compared with similar options in the same country and field?**

Campus ROI Score is a relative education-value score.

It is **not**:

- an accounting Internal Rate of Return (IRR)
- Net Present Value (NPV)
- a guaranteed personal financial return
- a prediction of an individual graduate's salary
- a university prestige score

The word ROI is used in the product sense of return on education cost and time. Every score must remain explainable through observable education cost and graduate outcome evidence.

---

## 2. Canonical score unit

A score belongs to a comparable education option defined by:

`Country × Field of study × Qualification cohort × Student market × Programme / Provider`

For Australia v1, the primary student market is:

`international student`

because the first Campus product uses CRICOS-registered options and international tuition/entry evidence.

Do not mix domestic subsidised prices with international tuition in the same affordability cohort.

Do not assign the score to a university/provider without programme/qualification context.

---

## 3. Comparable cohort contract

Scores are calculated only inside a cohort whose rows are reasonably comparable.

At minimum the cohort key must control for:

- country
- field of study
- qualification level or approved qualification family
- student market

Examples:

- `Australia × Nursing × Bachelor × International`
- `Australia × Computing and IT × Bachelor × International`
- `Australia × Electrotechnology Electrician × Certificate III / apprenticeship pathway × International`, only if public comparable evidence exists

A Bachelor must not compete directly against a Certificate III, diploma or postgraduate qualification merely because they share a broad field label.

Fields must be normalised through a controlled taxonomy. Free-text title matching alone is not sufficient for publication ranking.

---

## 4. Public score formula

Campus ROI Score v1 is a percentile-relative score from `0` to `100`.

Three components are used:

1. **Graduate earnings — 45%**
2. **Graduate employment — 30%**
3. **Affordability — 25%**

Formula:

```text
Campus ROI Score =
  Earnings percentile × 0.45
+ Employment percentile × 0.30
+ Affordability percentile × 0.25
```

where:

- higher graduate earnings are better
- higher graduate employment is better
- lower comparable total tuition is better

The score is rounded to one decimal place in the data layer. UI may display an integer where visual simplicity is preferred, but the underlying value must remain traceable.

This weighting intentionally preserves the strongest reusable part of `src/lib/school-score.ts` while narrowing its application to a valid product cohort.

---

## 5. Total tuition

Affordability uses comparable **total tuition**, not one-year sticker price.

Preferred hierarchy:

1. official total course cost / total tuition for the relevant student market
2. official annual tuition × verified standard duration
3. official fee schedule converted to a documented comparable course total

Do not invent total tuition from a generic institution average.

Mandatory non-tuition fees may be displayed separately. They are not part of v1 affordability unless the data can be collected consistently across the full cohort.

Living costs are **not part of Campus ROI Score v1**.

Reason: living cost is primarily location-dependent, varies by personal circumstances, and is not yet available at comparable programme granularity. Living cost belongs in Campus Map / location context until a future score version explicitly changes this rule.

---

## 6. Graduate earnings evidence

Preferred hierarchy:

1. programme-specific official graduate earnings outcome
2. institution × field/study-area × qualification-level official graduate earnings outcome
3. broader provider/field official outcome only when its relationship to the programme is defensible and disclosed

For Australia higher education, QILT/ComparED institution × study-area × level outcomes are a valid v1 evidence source where the target programme maps cleanly to that study area.

When an institution × study-area outcome is applied to an individual programme, evidence confidence is normally `estimated`, because the outcome is not unique to that exact programme.

A national field average that is identical for every provider does not provide enough differentiation to rank providers by earnings.

---

## 7. Graduate employment evidence

Preferred hierarchy:

1. programme-specific official graduate employment outcome
2. institution × field/study-area × qualification-level official employment outcome
3. broader provider/field official outcome with explicit proxy disclosure

For Australia higher education, the preferred public measure in v1 is a QILT/ComparED graduate employment measure with a consistent definition across the cohort.

Do not mix full-time employment for some rows with overall employment for others inside one score cohort.

The selected measure and collection window must be consistent across the cohort or explicitly normalised before publication.

---

## 8. VET and apprenticeship outcome rule

VET and apprenticeship pathways must not be forced into the higher-education outcome model.

Australia VET may use NCVER qualification/training-package/apprenticeship outcomes where comparable evidence exists.

However:

- national or training-package outcomes cannot be used to manufacture provider-specific score differences
- provider-level scores require provider-level comparable outcome evidence or another defensible differentiator approved by this contract
- if tuition/provider facts exist but comparable provider outcomes do not, Campus should still show the options but display `ROI score not ready yet`

This rule is expected to apply to the first Electrician pilot until provider-level public evidence is proven sufficient.

---

## 9. Minimum score-readiness gate

A Campus result receives a numeric score only when all three scored components are available and the cohort itself is credible.

Required per row:

- comparable total tuition
- comparable graduate earnings
- comparable graduate employment
- verified programme/provider identity
- field and qualification cohort mapping
- student-market identity
- evidence source and freshness

Required per cohort:

- at least **5 complete comparable programme/provider rows**
- representing at least **3 distinct institutions/providers**

If these conditions are not met:

> **ROI score not ready yet**

Show the verified programme facts that do exist. Do not fill missing outcomes with a cohort average simply to create a score.

---

## 10. Evidence confidence

Campus score and evidence confidence are separate concepts.

V1 confidence vocabulary:

- `direct`
- `estimated`
- `limited`

### Direct

The scored metric is directly tied to the programme/qualification or exact scored unit.

### Estimated

At least one scored outcome comes from a defensible official proxy such as institution × study area × qualification level.

### Limited

The evidence is useful for decision context but not sufficiently direct/comparable to justify a numeric Campus ROI Score.

A lower confidence state does not receive an arbitrary score penalty.

---

## 11. Cohort-relative disclosure

Campus ROI Score is relative to the current comparable cohort.

Therefore the detail UI must disclose context such as:

> Compared with 18 similar Nursing bachelor options in Australia.

Scores may move when:

- new programmes enter the cohort
- fees change
- graduate outcome data are refreshed
- a programme changes qualification/status

This is expected behaviour, not score instability. The cohort and evidence date must remain visible.

---

## 12. Supporting evidence not scored in v1

The following may be shown but do not affect Campus ROI Score v1:

- external university rankings such as QS
- English requirement
- completion rate
- student satisfaction
- living costs
- visa / post-study work rights
- accreditation prestige
- institution brand/reputation
- application difficulty
- scholarship availability
- work placement hours

A future score version may add a component only after comparable coverage and a new public contract are approved.

---

## 13. External rankings

External rankings are an independent sort/filter dimension.

Required fields should conceptually support:

- ranking source
- ranking type
- subject / overall scope
- ranking year
- ranking value / band
- licence / display permission state
- source URL / provenance

QS data must not be scraped or publicly redistributed by default. CampCareer may enable QS sorting only when the applicable licence or written permission permits the intended commercial/public display.

No QS value contributes to Campus ROI Score v1.

---

## 14. English requirements

English requirements are an eligibility filter, not a value score.

Store structured evidence where possible, including:

- test type
- overall score
- component minimums
- alternative pathways / waivers
- source and effective date

For regulated careers, distinguish:

1. programme admission English requirements; and
2. professional registration English requirements.

They are not necessarily the same.

---

## 15. Regulated-career programme gate

For programmes presented as direct pathways into a regulated career, CampCareer must verify the applicable accreditation/approval relationship.

Example: Australian Registered Nurse pathways should be checked against Ahpra/NMBA approved-program evidence rather than inferred from the word `Nursing` in a course title.

A non-approved or ambiguous programme may still be listed as education, but must not be represented as a direct qualifying route.

---

## 16. Payback metrics

Historical `payback_years` and `roi_score` fields are non-canonical for Campus v1 until they are regenerated under this contract.

Do not display an old payback estimate as if it were a precise personal break-even period.

A future payback proxy may be introduced if its formula is explicit, consistent and clearly labelled as a proxy rather than a personal forecast.

---

## 17. Sorting behaviour

Default Campus sort is:

`Campus ROI Score descending`

Rows without a ready score remain discoverable but appear after score-ready rows in the default value sort.

Other user-selected sorts may move score-not-ready rows normally when the sorted field itself is verified, for example lowest tuition.

No sort may silently treat null as zero.

---

## 18. Historical score migration

`src/lib/school-score.ts` contains useful reusable percentile logic and current 45/30/25 weights.

It must **not** be relabelled as Campus ROI Score without changes to its calling contract because the historical implementation can score arbitrary school rows and its peer cohort is not guaranteed to be field/qualification/student-market comparable.

Implementation work should either:

- refactor the function to require an explicit validated cohort contract; or
- introduce a new Campus scoring module and retain the old function for compatibility until retired.

Similarly, historical `public.roi_explorer_au.roi_score` values are not automatically Campus ROI Score v1.

---

## 19. Change control

The following require a new Campus score-contract version:

- changing 45 / 30 / 25 weights
- adding a fourth scored component
- adding rankings to the score
- adding English requirements to the score
- adding living costs to the score
- mixing qualification levels without an approved cohort rule
- mixing domestic and international tuition markets
- reducing the minimum cohort gate
- publishing provider-specific scores from outcomes that cannot differentiate providers
- representing Campus ROI Score as IRR, NPV or guaranteed personal financial return

# CampCareer Pay Evidence Policy

Status: Canonical evidence policy for the public CampCareer Score v1 Pay dimension.

Effective date: 2026-08-15

This policy supplements `docs/CAMPCAREER_SCORE_CONTRACT.md`.

## 1. What Pay measures

Pay answers:

> Does this career pay well relative to other careers in this country?

Pay is country-relative. It is not a direct comparison of currencies or absolute salaries across countries.

The preferred calculation is:

`relative earnings = occupation earnings / same-country all-occupations earnings`

The occupation earnings measure and the national benchmark should come from the same source family and a comparable reference period wherever possible.

## 2. Evidence hierarchy

Use the best available official earnings evidence in this order:

1. An official earnings measure that directly matches the canonical Career scope.
2. If that is unavailable, the closest defensible official occupation-group earnings measure.
3. If no defensible official occupation or occupation-group earnings measure exists, Pay is unavailable.

A broader official occupation group is a valid Pay input when it is a reasonable labour-market proxy for the canonical Career. It does not make the public Score incomplete solely because the scope is broader.

## 3. Confidence is separate from the score

- Exact or effectively exact official scope: normally `Verified`.
- Broader but defensible official occupation-group scope: normally `Estimated`.
- No defensible official earnings evidence: Pay unavailable and the CampCareer Score is `Score not ready yet`.

Do not reduce the numeric Pay score merely because confidence is `Estimated`.

Always disclose a broader-group proxy in the evidence layer.

## 4. Missing is not zero

A missing earnings measure must never become Pay 0.

A numeric Pay score represents an observed relative earnings position. Missing evidence is represented as unavailable.

## 5. Australia v1

Current Australia benchmark:

- All occupations median full-time weekly earnings: AUD 1,852.
- Source family: Jobs and Skills Australia occupation profiles using the ABS Survey of Employee Earnings and Hours, May 2025 customised report.

Australia relative earnings premium:

`premium = occupation or defensible official group median / 1,852 - 1`

Current Australia Pay bands:

| Relative earnings vs all occupations | Pay |
|---|---:|
| below -20% | 1 |
| -20% to below -15% | 2 |
| -15% to below -10% | 3 |
| -10% to below -5% | 4 |
| -5% to below +5% | 5 |
| +5% to below +10% | 6 |
| +10% to below +15% | 7 |
| +15% to below +20% | 8 |
| +20% to below +25% | 9 |
| +25% or more | 10 |

These bands preserve the relative-salary scoring behavior already used by reviewed Australian Career profiles.

## 6. Examples

### Electrician

Median weekly earnings: AUD 2,191.

Relative to AUD 1,852: about +18.3%.

Pay: 8.

### Pharmacist

The closest defensible official earnings measure is the JSA Pharmacists group at AUD 1,956 per week.

Relative to AUD 1,852: about +5.6%.

Pay: 6.

Because the official group is broader than the exact CampCareer canonical roll-up, Pay evidence confidence is `Estimated`.

### Radiographer

The closest defensible official earnings measure is the JSA Medical Imaging Professionals group at AUD 2,360 per week.

Relative to AUD 1,852: about +27.4%.

Pay: 10.

Evidence confidence is `Estimated` because the official earnings group is broader than Radiographer alone.

### Medical Laboratory Technician

The closest defensible official earnings measure is the JSA Medical Technicians group at AUD 1,539 per week.

Relative to AUD 1,852: about -16.9%.

Pay: 2.

Evidence confidence is `Estimated` because the official earnings group is broader than Medical Laboratory Technician alone.

## 7. What does not qualify by default

Do not use these merely to fill a missing Pay value when a national official earnings measure is absent:

- a single employer salary band;
- a single job advertisement;
- commercial salary websites;
- recruitment-agency salary guides;
- minimum award rates when the dimension is intended to measure typical earnings.

These may appear as supporting context, but they do not automatically complete the public Pay dimension.

## 8. Change control

The country-relative meaning of Pay is part of CampCareer Score v1.

Changing Pay into an absolute-salary score, penalising proxy confidence inside the numeric Pay value, or treating missing evidence as zero requires an explicit scoring-policy change rather than an incidental data migration.

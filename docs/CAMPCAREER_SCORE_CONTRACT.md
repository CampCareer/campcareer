# CampCareer Score Contract v1

Status: **Canonical public scoring contract**

Owner: CampCareer  
Effective date: 2026-08-14

This document defines the score that CampCareer shows to users, uses in Career Pages, and reuses in social content.

When older documents, database columns, UI copy, or code refer to a nine-factor `Opportunity Score`, `Job market score`, or visa-weighted career score as the public CampCareer score, this contract supersedes that interpretation.

The historical nine-factor model remains an internal evidence engine and compatibility layer until it can be retired safely. It is not the public brand score.

---

## 1. The question the score answers

> **How attractive is this career in this country for someone considering entering the career from scratch?**

The reference user is a person considering a new career or a career change.

The score is not designed primarily for someone who already holds every local licence, registration, qualification, work right, and years of relevant experience.

The public score answers a career-decision question, not a personal eligibility question.

---

## 2. The three public dimensions

CampCareer has exactly three public score dimensions:

1. **Demand** — Can I realistically find work in this career?
2. **Pay** — Does this career pay well in this country?
3. **Entry** — How easy is it for a newcomer to become job-ready?

The public brand shorthand is:

> **Demand · Pay · Entry**

Do not introduce additional public score dimensions without changing this contract.

Visa, work rights, citizenship, personal English level, personal education history, and individual eligibility are not fourth or fifth score dimensions.

---

## 3. Overall formula

Each public dimension is an integer from `0` to `10`.

The total score is an integer from `0` to `100`:

```text
CampCareer Score = Demand × 4 + Pay × 3 + Entry × 3
```

Equivalent weights:

- **Demand: 40%**
- **Pay: 30%**
- **Entry: 30%**

The displayed component scores must reconstruct the displayed total exactly.

Example:

```text
Demand 9/10
Pay    8/10
Entry  6/10

9×4 + 8×3 + 6×3 = 78

CampCareer Score: 78/100
```

This arithmetic simplicity is intentional. A user should be able to understand why a score exists without learning an internal scoring model.

---

## 4. Demand — 40%

### User question

> **Can I realistically find work in this career?**

### Public meaning

Demand combines current labour-market pressure and forward employment strength.

The internal evidence engine may use:

- official shortage evidence;
- vacancy intensity;
- employer or industry diversity;
- recent vacancy / employment momentum;
- projected or medium-term employment growth.

These are evidence inputs, not separate public scores.

### Current v1 calculation

The current evidence-engine maxima are:

```text
Shortage signal       20
Vacancy intensity     15
Employer diversity     5
Demand trend          10
Growth                10
                     ---
                      60
```

The public Demand score is:

```text
round((earned demand evidence / 60) × 10)
```

and is clamped to `0–10`.

### Interpretation

- `9–10` — exceptional demand signals
- `7–8` — strong demand
- `5–6` — moderate / mixed demand
- `3–4` — weak demand
- `0–2` — very weak positive demand evidence

The exact evidence and freshness remain visible below the score.

---

## 5. Pay — 30%

### User question

> **Does this career pay well in this country?**

Pay is country-relative, not a direct cross-currency comparison.

An Australian career is judged against the Australian labour market; a US career is judged against the US labour market.

This makes a `7/10` Pay score mean roughly the same kind of relative earning strength across countries even when currencies and absolute salary levels differ.

### Current v1 calculation

The existing relative-salary evidence component is normalized to `0–10` and rounded to the nearest integer.

Pay uses the best available official occupation earnings evidence compared with an all-occupations benchmark from the same country and a comparable source period.

Evidence hierarchy:

1. Prefer an official earnings measure that directly matches the canonical Career scope.
2. If that is unavailable, the closest defensible official occupation-group earnings measure may be used.
3. A broader official group lowers evidence confidence to `Estimated`; it does not by itself make Pay unavailable and does not receive a numeric score penalty.
4. If no defensible official occupation or occupation-group earnings measure exists, Pay is unavailable and the total is `Score not ready yet`.
5. Missing earnings evidence must never be interpreted as Pay `0`.

The detailed operational hierarchy, Australia relative-pay bands, proxy disclosure rules and examples are defined in `docs/PAY_EVIDENCE_POLICY.md`.

### Interpretation

- `9–10` — exceptionally strong relative earnings
- `7–8` — clearly above-average earnings
- `5–6` — around average to moderately above average
- `3–4` — below-average earnings
- `0–2` — materially weak relative earnings

Absolute salary is still shown as evidence; the public score uses relative earning strength.

---

## 6. Entry — 30%

### User question

> **How easy is it for a newcomer to become job-ready?**

Higher is easier.

Entry must reflect both sides of starting a career:

1. whether a realistic newcomer pathway exists; and
2. how burdensome the qualification, training, licensing, registration, or other mandatory entry requirements are.

### Current v1 calculation

The existing evidence engine provides:

- `entry_accessibility` with a maximum of `15`;
- `entry_burden` with a maximum of `5`, where higher means lower burden / easier entry.

Each is normalized to `0–10`. Entry is the equally weighted average:

```text
Entry = round(
  (normalized entry accessibility + normalized entry burden) / 2
)
```

This balance is intentional. A career with a well-defined paid apprenticeship may have a good newcomer route, but a multi-year qualification and mandatory licence must still reduce Entry ease.

### Interpretation

- `9–10` — unusually easy to become job-ready
- `7–8` — accessible entry route with manageable requirements
- `5–6` — meaningful training / qualification commitment
- `3–4` — substantial education, apprenticeship, licensing or registration burden
- `0–2` — very high entry barrier for a newcomer

The Career Page must explain the concrete pathway below this number. The number never replaces the pathway.

---

## 7. Verdict bands

The public total maps to one of five stable verdicts:

| Score | Verdict |
|---|---|
| `80–100` | **Excellent** |
| `65–79` | **Strong** |
| `50–64` | **Mixed** |
| `35–49` | **Challenging** |
| `0–34` | **Tough** |

These verdicts evaluate the career's **newcomer risk/reward in the selected country**.

`Tough` does not mean the work is unimportant, unskilled, or personally unsuitable. It means the combination of demand, relative pay, and entry difficulty is less attractive for a person considering entering from scratch.

---

## 8. Visa is not part of the score

Visa and immigration accessibility are explicitly excluded from CampCareer Score v1.

Reason:

- visa feasibility depends heavily on citizenship and personal circumstances;
- it is not an intrinsic characteristic of the career;
- the same career should not receive a different public brand score because two visitors hold different passports.

Visa evidence remains valuable, but it belongs in:

> **Your Path / work-rights / legal pathway context**

not in the public CampCareer Score.

Any historical `visa_accessibility` component may remain stored as internal evidence for legacy or pathway use, but it must not contribute to the public v1 total.

---

## 9. Personalisation does not change the public score

The public score is stable for a given career + country + evidence snapshot.

Example:

> **Registered Nurse · Australia — 82/100**

remains the same whether the visitor is a citizen, an international student, already qualified overseas, or starting with no degree.

Personalisation changes **Your Path**, not the career score.

Examples:

- already holds a recognised qualification → pathway may be shorter;
- needs a full degree → pathway may be longer;
- lacks work rights → legal pathway may be difficult;
- already licensed locally → entry steps may be fewer.

Do not silently recalculate CampCareer Score from personal profile data.

---

## 10. Evidence confidence is separate

Career attractiveness and evidence confidence are different concepts.

A score may be:

```text
78/100 · Strong
Evidence confidence: Verified
```

or:

```text
68/100 · Strong
Evidence confidence: Estimated
```

The score must never receive an arbitrary penalty merely because evidence confidence is lower.

Current confidence states remain:

- `verified`
- `estimated`
- `limited_evidence`

Confidence describes how strongly the evidence supports the calculation, not whether the career is good.

---

## 11. Score-not-ready rule

CampCareer must not manufacture a total when one of the three public dimensions cannot be calculated from completed evidence.

Required public evidence groups are:

- Demand;
- Pay;
- Entry.

If any required public dimension is unavailable:

> **Score not ready yet**

Show the verified evidence and pathway that do exist, together with the reason the score is incomplete.

Do not silently substitute an arbitrary average value for missing evidence. A documented official occupation-group proxy allowed by an evidence policy is not an arbitrary substitution; its lower directness belongs in evidence confidence.

---

## 12. Internal evidence-engine mapping

The historical nine-factor model is retained only as an evidence and compatibility layer during the transition.

Mapping to the public v1 model:

```text
shortage signal        ┐
vacancy intensity      │
employer diversity     ├──> Demand
vacancy / job trend    │
growth                  ┘

relative salary        ───> Pay

entry accessibility    ┐
entry burden            ┴──> Entry

visa accessibility     ───> Your Path only; excluded from public score
```

The internal evidence inputs may become more sophisticated over time without increasing the number of public dimensions.

This is a core design principle:

> **Complex evidence underneath; simple decision language on top.**

---

## 13. Public presentation contract

The standard public presentation is:

```text
78 / 100
STRONG CAREER

Demand  9/10
Pay     8/10
Entry   6/10

Evidence: Verified / Estimated / Limited
```

A one-sentence verdict follows:

> Strong demand and good pay make this attractive, but becoming job-ready requires meaningful training and licensing.

The exact visual identity is defined in the brand phase, but these four numbers are the scoring information hierarchy.

Do not lead with the old nine-factor breakdown.

Detailed evidence may be progressively disclosed below.

---

## 14. Social-content contract

The score must work without the website UI around it.

Example short-form script:

```text
Electrician in Australia
78/100 — Strong

Demand: 9
Pay: 8
Entry: 6

Great demand and pay.
The catch: qualifying takes real time and licensing.
```

If a score cannot be explained this simply, the scoring implementation has failed the product requirement.

---

## 15. Australia Electrician migration example

The legacy evidence snapshot contains:

```text
Shortage             20/20
Vacancy intensity    15/15
Employer diversity    5/5
Vacancy trend         8/10
Growth                7/10
Salary                8/10
Entry accessibility  13/15
Entry burden           2/5
Visa                  10/10   ← excluded from public v1
```

CampCareer Score v1 becomes:

```text
Demand = 9/10
Pay    = 8/10
Entry  = 6/10

Total = 9×4 + 8×3 + 6×3
      = 78/100

Verdict: Strong
```

This is easier to explain than the legacy 88/100 and correctly surfaces the real tradeoff: strong market economics, but meaningful entry friction.

---

## 16. Migration policy

### Public product

Use **CampCareer Score v1** everywhere a user is being asked to judge a career.

### Database

Do not destructively rewrite historical score snapshots solely for this launch migration.

Existing `opportunity_score`, detailed components, methodology versions, raw observations, and provenance remain useful as internal evidence and audit history.

The application read layer derives CampCareer Score v1 from those stored components.

### Compatibility

Older code may temporarily receive the public CampCareer total through an `opportunityScore` compatibility field. New code should prefer the structured `campCareerScore` object.

### Future migrations

A future database migration may materialize the three public dimensions for analytics or performance, but it must preserve the v1 formula and historical provenance.

---

## 17. Change control

The following are product-contract changes and must not happen casually:

- adding a fourth public dimension;
- changing `40 / 30 / 30` weights;
- changing verdict bands;
- putting visa back into the total;
- personalising the public score;
- changing Entry so higher means harder;
- publishing a total when a required dimension is not ready;
- changing Pay from country-relative earnings strength to an absolute cross-country salary measure;
- treating missing Pay evidence as zero.

Any such change requires a new score-contract version.

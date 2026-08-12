# Finland Cities — Phase 4 five core metrics v1

Status: `PHASE_4_COMPLETE`
Checkpoint: `METRICS_COMPLETE`
Country: `FI` — Finland
Checked: 2026-08-11
Branch: `agent/fi-cities-v1`

## Completion result

All eight Tier A municipalities have exactly the same five verified metric families:

1. `city_population`
2. `student_living_cost_monthly_range`
3. `student_transport_reference`
4. `student_work_hours_week`
5. `employment_focus_sectors`

Production result: **40/40 verified rows**, exactly five per city.

## Population

Population uses the same boundary locked in Phase 2: Statistics Finland municipality, year-end 2025.

| City | Population |
|---|---:|
| Helsinki | 694,392 |
| Espoo | 325,716 |
| Tampere | 263,337 |
| Oulu | 217,469 |
| Turku | 209,633 |
| Jyväskylä | 149,895 |
| Joensuu | 79,129 |
| Lappeenranta | 73,241 |

No metro-area or urban-area population is substituted for a municipal city profile.

## Student living cost

Study in Finland recommends planning approximately **EUR 900–1,200 per month**, depending on location. The Finnish Immigration Service minimum funds requirement remains separately recorded as EUR 800/month.

The Cities model stores EUR 900–1,200 as:

- a national student-budget planning range
- `city_specific=false`
- indicative rather than a measured local price index

Therefore it is not used to declare one Tier A city cheaper than another.

## Student work rights

The Finnish Immigration Service residence-permit rule is stored identically for all eight cities:

- paid work in any field: average **30 hours/week**
- equivalent context: average 120 hours/month / 1,560 hours/year
- individual weeks can exceed 30 hours if the permitted average is respected
- qualifying degree-related practical training or diploma work can fall outside the normal limit under Migri conditions

This is a national immigration rule, not a city labour-market differentiator.

## Student transport references

Transport preserves the operator's own product period and eligibility semantics. It is not forced into a synthetic common monthly fare.

| City | Stored reference | Interpretation |
|---|---:|---|
| Helsinki | EUR 44.34 / 30 days | HSL AB student season reference, calculated from the published adult one-off 30-day fare and 40% student discount |
| Espoo | EUR 44.34 / 30 days | same HSL AB student reference |
| Tampere | EUR 48 / 30 days | Nysse student AB mobile season ticket |
| Turku | EUR 1.90 / 2 hours | Föli student value-card journey; deliberately not monthly-normalized |
| Oulu | EUR 52 / 30 days | OSL student season ticket |
| Jyväskylä | EUR 42 / 30 days | Linkki one-zone student/youth/senior season |
| Lappeenranta | EUR 47 / 30 days | Jouko one-zone student season |
| Joensuu | EUR 49 / 30 days | JOJO one-zone youth/student season |

HSL is stored with `evidence_kind='calculated'`; the other operator references are observed source-native fares.

## Employment focus sectors

The fifth metric stores official/local economic-development context, not shortage scores or job guarantees.

- Helsinki: health and wellbeing; maritime; circular-economy construction; creative industries; food
- Espoo: deep tech; microelectronics; 5G/6G; quantum; health/MedTech + AI; clean energy/materials
- Tampere: manufacturing/intelligent machines; ICT/AI; health technology/life sciences; cybersecurity
- Turku: blue economy/maritime; health/life sciences; security/dual use; food/nutrition; clean transition
- Oulu: ICT/wireless; health/life sciences; cleantech/industry; logistics; creative industries
- Jyväskylä: exercise/health/wellbeing; industry renewal; ICT/cybersecurity; education expertise/export
- Lappeenranta: energy/environment technology; green transition; metal industry; knowledge-intensive business
- Joensuu: forest bioeconomy/circular economy; photonics; digital border security; mining/minerals; green transition/energy; metal/plastics manufacturing

Every record is marked `not_shortage_ranking=true`.

## Production migration

Applied and recorded as:

`20260811023616_publish_fi_tier_a_city_metrics_v1`

Post-migration verification found:

- Tier A municipalities with five verified metrics: 8/8
- verified core metric rows: 40
- missing metric families: 0

## Phase 4 conclusion

Checkpoint: `METRICS_COMPLETE`.

Phase 5 may consume these verified rows, but it must preserve the source-native methodology notes and the national-versus-city distinction.

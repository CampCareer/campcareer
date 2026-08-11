# Switzerland Cities — Phase 3 institution and programme linkage v1

Status: `PHASE_3_COMPLETE`
Checkpoint: `MUNICIPALITY_DELIVERY_EVIDENCE_LOCKED`
Country: `CH` — Switzerland
Checked: 2026-08-11
Branch: `agent/ch-cities-v1`

## Verified study-location representatives

Phase 3 verifies seven current university-core study-location representatives across the six Tier A municipalities:

- Zurich: ETH Zürich, Universität Zürich
- Lausanne: Université de Lausanne
- Basel: Universität Basel
- Lugano: Università della Svizzera italiana
- Fribourg: Université de Fribourg
- Geneva: Université de Genève

Every representative keeps `campus_inventory_complete=false`. The record proves a usable municipality study-location anchor for this City rollout, not a complete physical-campus inventory.

## EPFL Lausanne safeguard

EPFL is deliberately not assigned to Lausanne municipality in this phase. Official EPFL material describes its main campus as being in Ecublens near Lausanne. Therefore the 29 current EPFL programme rows whose discovery/source City label is `Lausanne` remain outside the municipality programme read model.

This is a geography-precision decision, not a judgement on EPFL or on the relevance of EPFL to the wider Lausanne student destination.

A future rollout may model the Lausanne academic cluster or Ecublens as a separate verified geography. Phase 3 does not silently broaden Lausanne municipality to achieve a larger programme count.

## Programme linkage contract

A programme enters `city_programme_directory_ch_v1` only when all of the following are true:

1. canonical offering source system is exactly `CH_SWISSUNIVERSITIES`
2. offering source record matches the current CH staging record
3. canonical programme and institution are active
4. the offering campus is an active Phase 3 verified study-location representative
5. programme source City exactly matches the selected City label
6. offering verification is `verified`
7. staging verification tier is `A` or `B`
8. current programme evidence exists

Institution presence by itself never implies programme delivery.

## Verified-partial cardinality

The resulting municipality linkage contract is:

| City | Verified institutions | Verified municipality programmes |
|---|---:|---:|
| Zurich | 2 | 74 |
| Lausanne | 1 | 10 |
| Basel | 1 | 24 |
| Lugano | 1 | 22 |
| Fribourg | 1 | 20 |
| Geneva | 1 | 20 |
| Total | 7 | 170 |

The Phase 1 scope-selection total was 199 candidate programmes. The difference of 29 is exactly the EPFL Lausanne-labelled cohort withheld by the municipality evidence gate.

## Coverage disclosure

Programme coverage is `verified_partial` rather than complete because:

- the current provider foundation covers the 12 swissuniversities university-category institutions, not all accredited Swiss higher-education providers
- campus inventories remain incomplete
- international evidence is mostly `verified_general`, not programme-specific current admission verification
- the municipality rule intentionally excludes source labels that do not have sufficiently precise physical-location evidence

## Security

All three Switzerland City read models use `security_invoker=true`, revoke access from `public`, `anon` and `authenticated`, and grant SELECT only to `service_role`.

## Phase 3 conclusion

The six Tier A municipalities now have evidence-gated institution and programme read models. The verified municipality programme footprint is 170 programmes across seven university-core institutions.
# Seed Restore Guide

## Policy

Raw seed files are stored in the gitignored `seed/` directory and are **NOT** tracked in Git. This document and the `SEED_MANIFEST.json` in this directory are the Git-tracked metadata artifacts that reference them.

## Restore Steps

1. Copy each archived file from the seed directory backup to `scripts/data-foundation/five-country-geography/seed/`.
2. Verify checksums using the commands in `SEED_MANIFEST.json`.
3. Run the pipeline with `--seed-dir scripts/data-foundation/five-country-geography/seed/`.

## Seed Files

| source_id | filename | sha256 | size | licence |
|-----------|----------|--------|------|---------|
| ca-statcan-lcsd-2021-v1 | ca_lcsd000a21a_e.zip | `sha256:79a6b5022e33f2c89ead0356bf9b51c645b47684f643e916700e97842a69dbb2` | 40,389,252 | Statistics Canada Open Licence |
| gb-ons-countries-2022-geometry-v1 | gb_countries_2022_geometry.geojson | `sha256:1c30185695c779af079dc76c4ad34fcfe6b29f7048ed3ff93c5f03772c31` | 12,426,701 | OGL v3.0 |
| gb-ons-understanding-towns-v1 | gb_towns_datadownloadv2.xlsx | `sha256:ab675fac4f7f6e7ff37ade021a48728af362e0b23905e8458a57edd78cb84c9a` | 1,035,058 | OGL v3.0 |
| ie-osi-local-authorities-geometry-2026-v1 | ie_la_geometry.json | `sha256:98a2c1bad8570b1b9860e3616d8f372928b4db8e1da76537c588d1c959b42266` | 80,392,784 | CC BY 4.0 |
| ie-cso-sap2022-t1t2cty-v1 | ie_sap2022t1t2cty.json | `sha256:e71625803dbe1b253c99f76a261c8290dde9c0e9de9a6b886b1b11b9c211c5fb` | 10,215 | CC BY 4.0 |
| ie-cso-sap2022-t2t4town22-v1 | ie_sap2022t2t4town22.json | `sha256:b15a39ee98e1c1a9bdda708630e0805779efc028cc0751a63f03fc7b3c6aadb` | 115,788 | CC BY 4.0 |

## Verification

```bash
sha256sum -c scripts/data-foundation/five-country-geography/SEED_MANIFEST.json
```

## Restore Commands

Each entry in `SEED_MANIFEST.json` includes a `restore_command` and `verify_command` field for automated restoration.
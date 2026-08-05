# 10.9B AU Geography Controlled Apply — Verification Report

**Generated:** 2026-08-04T16:52:56Z
**Branch:** feat/au-geography-controlled-apply-v1
**Source 10.9A SHA:** 7a29c51bc49ba91fc6cc4efed3a5dc0ff3c56d3c
**Status:** COMMITTED

## 1. Plan Fingerprint Verification

| Check | Result |
|-------|--------|
| import_plan.json SHA-256 | `39c2bbb1202cc636e6f1bc93f9f13cef597f4820041e26ddb34a5e4a0c10da14` |
| Match | PASS |
| plan_checksum | `a457dfa9de27dc32db40210f0006835f794d541bebac7146d0da0878d398ef56` |
| Match | PASS |

## 2. Preflight Classification

| Classification | Count |
|----------------|-------|
| INSERT | 41 |
| NOOP | 1 |
| CONFLICT | 0 |
| UNRESOLVED_PARENT | 0 |
| UNSUPPORTED | 0 |
| INVALID | 0 |

## 3. Applied Insert Counts

| Entity Type | Expected | Actual |
|-------------|----------|--------|
| Country (NOOP) | 1 | 1 |
| Regions (INSERT) | 9 | 9 |
| Cities (INSERT) | 32 | 32 (total: 51 including 19 pre-existing) |
| Total INSERT | 41 | 41 |

## 4. Safety Checks

| Check | Result |
|-------|--------|
| Production DB writes | 41 (only INSERT, no UPDATE/DELETE/UPSERT) |
| Schema impact | 0 (no migrations) |
| Other-country impact | 0 (UK/GB counts unchanged) |
| Fuzzy matching | 0 (exact match only) |
| Orphan cities | 0 |
| Duplicate identities | 0 |
| UK/GB country count before/after | 1/1 |
| UK/GB geography count before/after | 37/37 |

## 5. Approved City Verification

- Approved city count: 32
- All approved cities found in DB: PASS

## 6. Representative Name Normalization

- 6 cities normalized (multi-place SUAs)
- Original ABS names preserved in metadata.original_official_name
- Normalized count: 6

## 7. Parent Resolution

- Total city parent dependencies: 32
- Resolved via planned_region_insert: 32
- Unresolved: 0
- Orphan: 0
- All parents are regions: True

## 8. Conclusion

VERDICT: A Pass

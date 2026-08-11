# Finland Cities — Phase 7 publication and SEO v1

Status: `PHASE_7_COMPLETE`
Country: `FI` — Finland
Checked: 2026-08-11
Branch: `agent/fi-cities-v1`

## Indexed allowlist

Exactly eight city profiles are approved for indexing:

- Helsinki
- Espoo
- Tampere
- Turku
- Oulu
- Jyväskylä
- Lappeenranta
- Joensuu

Code authority: `PUBLISHED_FI_CITY_SLUGS`.

Each route uses canonical metadata of the form:

`Study in <City>, Finland`

and:

`robots: { index: true, follow: true }`

Unsupported FI city slugs remain not found and `noindex, nofollow`.

## Sitemap

`src/app/sitemap.ts` derives FI city entries directly from `PUBLISHED_FI_CITY_SLUGS`.

No Tier B candidate is hard-coded into the sitemap.

Explicit non-indexed expansion candidates include Kuopio, Vaasa, Rovaniemi, Vantaa and Lahti until later provider/location evidence is completed.

## Compare SEO boundary

The shared parameterized `/compare` page remains globally `noindex, nofollow`. Phase 7 does not create indexable pairwise comparison pages.

## Coverage language

SEO metadata does not claim complete Finnish HEI/UAS or programme coverage. Profiles continue to disclose:

- selected ten-university core
- verified-partial programme catalogue
- Studyinfo organisation OID reconciliation pending
- source-native transport semantics
- national student budget/work-right context not being city rankings

## Phase 7 conclusion

The exact eight Finland city profiles are publication-approved and sitemap-listed with no Tier B leakage.

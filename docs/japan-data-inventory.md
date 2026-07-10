# Japan Data Inventory

The Japan importer collects broad official source layers. The MHLW wage
classification and the MHLW employment-service shortage classification are
stored separately because no official crosswalk has been validated in this
repository.

| Layer | Current result | Publication status |
| --- | --- | --- |
| Occupation wages | 132 MHLW occupation-code rows with hourly baseline pay | Review-required for occupation SEO |
| Labour demand | 3,319 MHLW prefecture occupation-group openings, applicants, and ratios | Approved for regional Maps cards |
| Rent | 2023 Statistics Bureau private-rental distribution for 47 prefectures and 21 major cities | Approved for regional Maps cards |
| Tuition, graduate outcomes, job quality | Official source catalog and refresh ownership | Not yet extracted |
| Visa and foreign-worker pathways | ISA official source catalog | Human review required |
| Language requirements | JLPT framework source only | No occupation-level claim |

The Maps sitemap publishes 47 prefecture and 21 major-city pages because each
has a specific geography, official rent data, official labour-demand data at
the available geographic level, citations, and an interactive-map action.

No Japan occupation URL becomes indexable until it has an approved English and
Korean title, an official demand crosswalk, reviewed foreign-worker pathway and
language evidence, and passes the hidden high-ROI gate. Maps therefore shows
high-pay occupations nationally and shortage groups by prefecture without
claiming that these two classifications are a verified occupation-level match.

## Occupation cards

The card contract stores the Japanese source name separately from English and
Korean translations. A browser locale can choose which reviewed name to show,
but it never substitutes for stored SEO data. Skills, qualifications, and
course recommendations remain empty until the Job Tag explanatory dataset has
been imported with its required attribution and human review.

The first Job Tag import includes 556 official profiles, skills, knowledge
areas, qualifications, and 135 wage-classification mappings. Each public card
must credit the JILPT Occupational Information Database, identify the
description/numeric dataset versions, and link to the Job Tag download page.
The import does not publish a machine-translated occupation name or make a
school-specific course recommendation.

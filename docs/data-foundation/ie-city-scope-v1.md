# Ireland city scope v1

Status: `PHASE_1_COMPLETE`

Branch: `agent/ie-cities-scope-v1`

Parent branch: `agent/ie-cities-readiness-v1`

## Purpose

Fix the first public Ireland `/cities` perimeter before any geography normalization or publication work. This phase uses current official higher-education evidence as the primary signal and treats the existing CampCareer campus/programme graph only as discovery evidence because Ireland campus locations and all 2,876 current programme offerings are still legacy/unverified.

The selected set should be small enough to verify rigorously but geographically broad enough to represent the main Irish higher-education study markets.

## Selection method

Tier A selection uses four signals, in this order:

1. current HEA / QQI recognised higher-education provider presence;
2. current international-student demand or a clearly material public higher-education campus;
3. a defensible user-facing study destination with explicit campus geography;
4. existing CampCareer institution/programme density as a discovery signal only.

The HEA 2024/25 Key Facts & Figures report records 278,880 enrolments across publicly funded higher education and 44,535 non-Ireland-domiciled enrolments. International enrolment was highest at UCD and Trinity College Dublin, followed by UCC and University of Galway. This makes Dublin, Cork and Galway mandatory first-batch destinations.

Official references:

- https://hea.ie/statistics/data-for-download-and-visualisations/key-facts-figures-report/
- https://hea.ie/higher-education-institutions/
- https://www.qqi.ie/trusted-ireland-reports
- https://www.educationinireland.com/en/where-can-i-study-in-ireland

## Tier A — approved first public Ireland city set

Publish and compare these ten destinations first:

| Public city | Public slug | Geographic role | Primary official higher-education evidence | Current legacy discovery signal | Phase 2 scope direction |
| --- | --- | --- | --- | ---: | --- |
| Dublin | `dublin` | national / east-coast hub | UCD, Trinity, DCU, TU Dublin, RCSI, NCAD, NCI and multiple TrustEd private providers | 52 campus rows / 42 institutions / 1,111 programmes after rough Dublin-market bucketing | use an explicit Dublin study-market boundary covering the four Dublin local-authority areas; do not treat the legacy `Dublin` string as sufficient evidence |
| Cork | `cork` | south / major university city | UCC plus MTU Cork campuses | 11 / 10 / 260 | explicit Cork-city campus evidence; do not absorb county campuses such as Ringaskiddy or other MTU sites without address evidence |
| Galway | `galway` | west / major university city | University of Galway plus ATU Galway campuses | 7 / 7 / 236 | Galway City study scope; merge `Galway` / `Galway City` only after official campus verification |
| Limerick | `limerick` | mid-west / major university city | University of Limerick, Mary Immaculate College and TUS Limerick campuses | 12 / 12 / 305 | Limerick urban study scope based on explicit Limerick/Castletroy campus evidence; no county-wide inference |
| Maynooth | `maynooth` | dedicated university town / Dublin commuter belt | Maynooth University | legacy graph currently misassigns Maynooth University to Dublin | named Maynooth town scope; explicitly repair the legacy Dublin linkage |
| Waterford | `waterford` | south-east regional hub | SETU has five Waterford sites clustered around Waterford city | 3 / 3 / 125 | Waterford city study scope based on verified SETU campus addresses; correct the current legacy province/region error before publication |
| Athlone | `athlone` | Midlands regional hub | TUS Athlone Campus, approximately 6,000 students and 200+ courses on the current official campus page | 2 / 2 / 73 | named Athlone campus/town scope; explicit Westmeath address evidence |
| Sligo | `sligo` | north-west regional hub | ATU Sligo campus, with current official ATU material describing a large multi-programme campus | 3 / 3 / 143 | named Sligo urban scope; verify ATU Sligo and St Angela's location records independently |
| Dundalk | `dundalk` | north-east / Dublin–Belfast corridor | Dundalk Institute of Technology's main campus is explicitly in Dundalk | 3 / 3 / 85 | named Dundalk scope; no wider Louth or corridor inference |
| Letterkenny | `letterkenny` | Donegal / north-west Ulster coverage | ATU Donegal Letterkenny campus, Port Road, Letterkenny | 2 / 2 / 94 | named Letterkenny scope; do not absorb Killybegs or other Donegal campuses |

The discovery counts above are not publication counts. They are derived from current legacy campus text with rough normalization and include unverified programme records. Phase 3 must replace them with official campus and programme-offering evidence.

## Why these ten

### Dublin

Dublin is the clear first destination. HEA 2024/25 reports UCD as Ireland's largest institution overall and identifies UCD and Trinity College Dublin as the two largest destinations for international enrolment. Dublin also contains the broadest mix of public universities, specialist institutions and TrustEd-authorised private providers.

Dublin must not use a narrow `Dublin City Council only` interpretation. TU Dublin explicitly operates campuses at Grangegorman, Aungier Street, Bolton Street, Blanchardstown and Tallaght, while UCD also has Belfield and Blackrock locations. Government local-government structure distinguishes Dublin City plus Fingal, Dún Laoghaire-Rathdown and South Dublin. The product therefore needs an explicit Dublin study-market contract rather than silently equating one municipality with the public label `Dublin`.

Official references:

- https://hea.ie/statistics/data-for-download-and-visualisations/key-facts-figures-report/
- https://www.tudublin.ie/explore/our-campuses/
- https://www.ucd.ie/residences/contactus/
- https://www.gov.ie/en/department-of-housing-local-government-and-heritage/organisation-information/local-government-structure-and-functions/

### Cork

UCC is one of Ireland's four largest institutions by enrolment and one of the four institutions with the highest international enrolment in HEA 2024/25 data. Its main campus is on College Road, Cork, close to Cork City Centre. MTU adds a second major higher-education system in the Cork market.

Official references:

- https://hea.ie/statistics/data-for-download-and-visualisations/key-facts-figures-report/
- https://www.ucc.ie/en/sustainability-institute/contactus/maincampusucc/
- https://hea.ie/higher-education-institutions/

### Galway

University of Galway is one of the top four Irish institutions for international enrolment in HEA 2024/25. Its official location page states that the university is in the centre of Galway City. ATU also has Galway campuses, giving the destination broader programme coverage than a single-institution market.

Official references:

- https://hea.ie/statistics/data-for-download-and-visualisations/key-facts-figures-report/
- https://www.universityofgalway.ie/about-us/contact-us/where-to-find-us.html
- https://studenthub.atu.ie/helpdesk

### Limerick

Limerick has multiple current HEA institutions: University of Limerick, Mary Immaculate College and TUS. The current CampCareer discovery graph is also the second-largest non-Dublin cluster after rough locality normalization. Phase 2 must use explicit urban-campus evidence because a blanket county-wide scope would be too broad.

Official references:

- https://hea.ie/higher-education-institutions/
- https://www.mic.ul.ie/path1-national-symposium/plan-your-visit
- https://tus.ie/estates/athlone/campus-maps/

### Maynooth

Maynooth is retained as its own Tier A destination even though it is close to Dublin. Maynooth University's official location page describes the institution as being in Maynooth, Co. Kildare, 25 km from central Dublin, and calls Maynooth Ireland's only university town. The current CampCareer campus row incorrectly places Maynooth University under `Dublin`, making this a high-value correction rather than a reason to collapse Maynooth into Dublin.

Official reference:

- https://www.maynoothuniversity.ie/location

### Waterford

SETU's official Waterford campus page lists five sites clustered within roughly three kilometres of Waterford city. This is strong explicit city-campus evidence and makes Waterford the preferred first SETU destination. Carlow remains a strong Tier B expansion candidate.

Official references:

- https://www.setu.ie/about/setu-campuses/waterford-campuses
- https://www.setu.ie/about/setu-campuses/waterford-campuses/visiting-the-waterford-campuses

### Athlone

TUS states that its Athlone campus is home to about 6,000 students and offers 200+ industry-focused courses, with an address on University Road, Athlone, Co. Westmeath. This gives the Midlands a distinct, material study destination rather than forcing all inland demand into Dublin.

Official reference:

- https://tus.ie/campuses/athlone/

### Sligo

ATU's current Sligo material identifies the Sligo campus on Ash Lane and describes a large student/course footprint. Sligo therefore provides a material north-west study destination with a strong existing programme discovery cluster.

Official references:

- https://noneuapply.atu.ie/institutions/institution/3-atlantic-technological-university-sligo
- https://pure.atu.ie/en/organisations/clinical-health-and-nutrition-centre/

### Dundalk

DkIT's official site describes its campus as being in Dundalk and positions it as the leading higher-education institute in Ireland's north-east on the Dublin–Belfast economic corridor. Dundalk therefore adds a distinct north-east destination rather than duplicating Dublin.

Official references:

- https://www.dkit.ie/about/campus
- https://www.dkit.ie/

### Letterkenny

ATU has an explicit Letterkenny campus at Port Road, Letterkenny. It gives the first publication set a Donegal / Ulster Republic-of-Ireland destination and avoids making the first release overly concentrated in Leinster and Munster.

Official references:

- https://pure.atu.ie/en/organisations/department-of-business-studies/persons/
- https://noneuapply.atu.ie/institutions/institution/1-atlantic-technological-university-donegal

## Tier B — hold for later expansion

The following remain good expansion candidates but are not in the first public set:

- `carlow` — strong SETU campus and current legacy programme signal, but the first release already has Waterford as the primary SETU south-east destination. Revisit after official SETU campus/programme assignment is normalized.
- `wexford` — verified SETU presence exists, but the current programme and institution density is materially smaller than Waterford/Carlow.
- `tralee` — MTU Kerry presence is meaningful, but first-batch evidence is weaker than Cork and the regional hubs above.
- `thurles` — TUS presence, but smaller first-release study-market signal.
- `dun-laoghaire` — do not publish as a separate route in v1. Verified Dún Laoghaire-Rathdown campuses should be represented under the explicit Dublin study-market scope unless a later product decision creates sub-Dublin destination pages.
- `castlebar` — ATU Mayo presence, but smaller current higher-education signal than Galway/Sligo.
- `drogheda` — meaningful FET/private activity, but not strong enough for the first higher-education-focused city batch.
- `kilkenny` — meaningful education activity but weaker first-batch canonical HE campus coverage.
- `wexford`, `tralee`, `thurles`, `castlebar`, `drogheda`, `kilkenny` and other legacy city geographies must remain non-public until separately approved.

## Province / regional balance

The Tier A set deliberately provides national geographic coverage without treating provinces as regulatory units:

- Leinster: Dublin, Maynooth, Athlone, Dundalk
- Munster: Cork, Limerick, Waterford
- Connacht: Galway, Sligo
- Ulster (Republic of Ireland): Letterkenny

This geographic balance is a selection aid only. Higher-education recognition and international-student eligibility remain national/provider/programme evidence questions.

## Phase 2 geography rules

Phase 2 must normalize exactly the ten Tier A destinations and must not infer campus membership from marketing labels or legacy city text.

Required scope decisions:

1. `dublin`
   - public label remains `Dublin`;
   - use an explicit Dublin study-market boundary covering Dublin City, Fingal, Dún Laoghaire-Rathdown and South Dublin;
   - retain legacy `Dun Laoghaire` as an alias/source geography only where appropriate, not a separate Tier A public route;
   - every campus still needs explicit address/location evidence.
2. `cork`
   - use Cork city study scope;
   - do not infer that every MTU Cork-labelled campus is inside the public Cork boundary.
3. `galway`
   - consolidate `Galway` and `Galway City` only when official campus evidence supports the same public scope.
4. `limerick`
   - use an urban study scope covering verified Limerick/Castletroy higher-education campuses;
   - do not use all of County Limerick.
5. `maynooth`
   - named Maynooth scope;
   - explicitly detach Maynooth University from its incorrect legacy `Dublin` geography link.
6. `waterford`
   - use verified Waterford urban campuses;
   - correct the current `region_code='Leinster'` legacy error before publication.
7. `athlone`, `sligo`, `dundalk`, `letterkenny`
   - named-city/town scopes with explicit campus address evidence;
   - no county or regional aggregation.

## Publication allowlist

Phase 2 and every later publication surface must be bounded to exactly these slugs:

```text
dublin
cork
galway
limerick
maynooth
waterford
athlone
sligo
dundalk
letterkenny
```

No Tier B geography may enter City profile, Compare, selector, sitemap or SEO surfaces until separately approved.

## Programme coverage rule

The Tier A selection does not validate any of the existing 2,876 Ireland programme offerings.

All current offerings remain `legacy_backfill + unverified`. Phase 3 programme linkage must require explicit programme/offering-to-campus evidence. Institution presence in a Tier A destination is never sufficient to infer programme delivery.

## Phase 1 decision

`PHASE_1_COMPLETE`

Approved Tier A count: `10`

Approved first-public destinations:

`Dublin, Cork, Galway, Limerick, Maynooth, Waterford, Athlone, Sligo, Dundalk, Letterkenny`

Next branch:

`agent/ie-cities-foundation-v1`

Phase 2 should normalize these ten geographies, preserve stable UUIDs where possible, add canonical slugs/aliases/scope metadata, repair known geography errors such as Maynooth University under Dublin and Waterford under Leinster, and leave campus/programme verification for Phase 3.
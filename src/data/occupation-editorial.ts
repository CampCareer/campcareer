export type CountryOccupationEditorial = {
  headline: string
  entryPathway: string
  registration: string
  jobMarketNote: string
  scoreCaveat: string
}

export type OccupationEditorial = {
  id: string
  overview: string
  tasks: readonly string[]
  countries: Partial<Record<string, CountryOccupationEditorial>>
}

export const OCCUPATION_EDITORIAL: readonly OccupationEditorial[] = [
  {
    id: "registered-nurse",
    overview:
      "Registered Nurses assess patients, plan and deliver care, administer treatment, coordinate with health teams and support patients and families across hospitals, aged care, community and other health settings.",
    tasks: [
      "Assess, plan, implement and evaluate nursing care against accepted practice standards",
      "Coordinate patient care with doctors, allied health professionals and nursing teams",
      "Administer medications, treatments and therapies and monitor the response",
      "Educate patients and families about treatment, recovery and prevention",
      "Maintain clinical records and communicate changes in a patient's condition",
      "Supervise and support enrolled nurses and other care workers",
    ],
    countries: {
      AU: {
        headline: "A large, regulated occupation with strong national demand",
        entryPathway:
          "The standard direct route is an NMBA-approved Bachelor of Nursing followed by an application for general registration. Graduate-entry nursing degrees can shorten the study route for eligible applicants with a prior degree.",
        registration:
          "Registration with the Nursing and Midwifery Board of Australia is mandatory. Applicants must meet the current registration, identity, criminal-history, recency and English-language requirements before practising.",
        jobMarketNote:
          "Public health systems, private hospitals, aged-care providers and community services recruit RNs. Graduate transition programs make this occupation more accessible to new graduates than many regulated professions.",
        scoreCaveat:
          "The opportunity score is provisional until posting-level employer counts and the share of jobs explicitly open to new graduates are ingested on a recurring basis.",
      },
    },
  },
  {
    id: "midwife",
    overview:
      "Midwives provide clinical care, advice and support during pregnancy, labour, birth and the postnatal period. They monitor maternal and fetal wellbeing, recognise complications, support informed decision-making and coordinate referral or collaborative care when required.",
    tasks: [
      "Provide antenatal care, physical assessment and advice on pregnancy, nutrition and wellbeing",
      "Monitor women and babies during labour and support safe childbirth and pain-management needs",
      "Provide postnatal care, newborn assessment, breastfeeding and early-parenting support",
      "Recognise abnormal or potentially abnormal pregnancy and birth findings and arrange referral or escalation",
      "Educate women and families about pregnancy, childbirth, reproductive health and newborn care",
      "Document care and collaborate with obstetric, neonatal, nursing and allied health teams when required",
    ],
    countries: {
      AU: {
        headline: "A regulated maternity-care profession in national shortage across every state and territory",
        entryPathway:
          "There are two main Australian pathways. New entrants can complete an NMBA-approved Bachelor of Midwifery that leads toward registration. Registered nurses can instead complete an approved postgraduate midwifery program; NSW Health MidStart is one current example that combines postgraduate study with paid employment in a dedicated midwifery student position. Newly registered midwives can also enter supported graduate programs such as NSW Health GradStart.",
        registration:
          "Registration with the Nursing and Midwifery Board of Australia is mandatory and the title 'midwife' is protected. Graduates must complete an NMBA-approved program of study and then meet the Board's current registration standards, including applicable identity, criminal-history, recency and English-language requirements, before practising.",
        jobMarketNote:
          "Public maternity services are major employers across hospitals, birth centres, community services and continuity-of-care models. NSW, Queensland and Western Australian public health systems all recruit nurses and midwives, while graduate and transition programs provide structured entry for newly registered midwives and registered nurses moving into midwifery.",
        scoreCaveat:
          "The opportunity score is provisional until posting-level unique-employer counts and a standardised national measure of vacancies open to new graduates are ingested. The employment, earnings, vacancy, shortage and projection inputs themselves are directly sourced from the current JSA series, with the legacy ANZSCO 2541 labour-market scope labelled separately from the exact OSCA 265131 Midwife mapping.",
      },
    },
  },
  {
    id: "carpenter",
    overview:
      "Carpenters set out, construct, install, renovate and repair timber and lightweight structural systems, fixtures and finishes across residential, commercial and infrastructure projects.",
    tasks: [
      "Interpret plans, specifications and building details and set out the work area",
      "Select, measure, cut, shape and assemble timber and other construction materials",
      "Erect wall, floor and roof framing and verify that structures are level, plumb and square",
      "Install doors, windows, cladding, partitions, linings, mouldings and other fixtures",
      "Construct formwork, temporary structures and specialised timber components where required",
      "Repair, renovate and replace damaged structural and finishing components",
    ],
    countries: {
      AU: {
        headline: "A large apprenticeship trade in national shortage across every state and territory",
        entryPathway:
          "The standard route is a paid carpentry apprenticeship combined with the CPC30220 Certificate III in Carpentry. A training contract links employment and registered training, while approved recognition pathways may be available to experienced workers.",
        registration:
          "There is no single national carpenter licence. A White Card is required for construction-site work, and state or territory builder, contractor or trade-licensing rules may apply depending on the work and whether the carpenter contracts directly.",
        jobMarketNote:
          "Residential builders, commercial contractors, infrastructure projects and specialist carpentry firms use carpenters. Large builders often engage trade subcontractors, while apprenticeship and group-training networks connect apprentices with host employers.",
        scoreCaveat:
          "The opportunity score is provisional until posting-level unique-employer counts and the share of advertisements open to apprentices or newly qualified carpenters are ingested regularly.",
      },
    },
  },
  {
    id: "electrician",
    overview:
      "Electricians install, test, commission, maintain and repair electrical wiring, equipment and control systems across homes, commercial buildings, infrastructure, utilities, manufacturing and industrial sites.",
    tasks: [
      "Interpret technical drawings, wiring diagrams, equipment schedules and electrical standards",
      "Install wiring, switchboards, protection devices, lighting, controls and electrical equipment",
      "Connect systems to power supplies and test continuity, resistance and safe operation",
      "Diagnose faults with electrical and electronic test instruments",
      "Repair, replace and maintain wiring, components, machinery and control systems",
      "Document completed work and confirm compliance with the relevant electrical safety rules",
    ],
    countries: {
      AU: {
        headline: "A licensed trade with national shortage and broad infrastructure demand",
        entryPathway:
          "The standard domestic route is a paid electrical apprenticeship combined with the UEE30820 Certificate III in Electrotechnology Electrician. The training contract, workplace experience and final licensing requirements are administered through the relevant state or territory system.",
        registration:
          "Electrical work is licensed. After completing the required trade training and assessments, workers must obtain the correct electrical licence from the state or territory regulator for the jurisdiction and type of work.",
        jobMarketNote:
          "Construction contractors, utilities, mining, manufacturing and maintenance employers recruit electricians. Apprenticeship intakes create a structured entry route, while licensed vacancies span metropolitan, regional and remote locations.",
        scoreCaveat:
          "The opportunity score is provisional until posting-level unique-employer counts and the share of advertisements open to apprentices or newly licensed electricians are ingested regularly.",
      },
    },
  },
  {
    id: "plumber",
    overview:
      "Plumbers install, maintain and repair pipework, fixtures, drainage, gas, roofing and mechanical-service systems used for water supply, sewerage, heating, cooling and fire protection.",
    tasks: [
      "Read plans and specifications to determine plumbing layouts, materials and connection points",
      "Set out, cut, join and install pipes, fittings, fixtures and water-supply systems",
      "Install and repair sanitary plumbing, drainage, sewerage and stormwater systems",
      "Test pipework and equipment for pressure, leaks, blockages and safe operation",
      "Install or maintain gas, roof, fire-protection and mechanical-service systems within the authorised licence class",
      "Diagnose faults, clear obstructions and repair plumbing systems in buildings and infrastructure",
    ],
    countries: {
      AU: {
        headline: "A licensed apprenticeship trade with broad building, maintenance and utility demand",
        entryPathway:
          "The standard route is a paid plumbing apprenticeship combined with the CPC32420 Certificate III in Plumbing. A training contract links supervised employment with an approved registered training organisation, followed by the licence or registration steps required in the relevant jurisdiction.",
        registration:
          "Plumbing work is regulated by states and territories. Workers must hold the licence or registration class required for their jurisdiction and work type, including specialist gas, drainage, roofing, fire-protection or mechanical-services work. A White Card is also required for construction-site work.",
        jobMarketNote:
          "Residential and commercial contractors, facilities-service providers, water utilities and infrastructure organisations recruit plumbers. Apprenticeships provide a structured entry route, while licensed workers are used for installation, maintenance and emergency response.",
        scoreCaveat:
          "The score is provisional and not yet directly comparable with fully populated occupations because the national and all-state IVI vacancy series is awaiting verified workbook ingestion; the vacancy-intensity and vacancy-trend components currently contribute zero.",
      },
    },
  },
  {
    id: "wall-floor-tiler",
    overview:
      "Wall and Floor Tilers prepare surfaces and install ceramic, porcelain, stone, glass and other tiles on walls and floors across residential, commercial, renovation and wet-area projects.",
    tasks: [
      "Interpret plans, measure and mark surfaces, and set out tile layouts before installation",
      "Remove old materials and fill, clean and level wall and floor surfaces ready for tiling",
      "Apply waterproofing systems where the work is within the worker's competency and authorised scope",
      "Measure, cut and shape tiles to fit edges, corners, fittings, pipes and other penetrations",
      "Spread adhesive and set tiles while checking alignment, spacing, level and the required finish",
      "Grout, clean and polish tiled surfaces and inspect, repair or replace damaged tiles",
    ],
    countries: {
      AU: {
        headline: "A nationally short finishing trade with a paid apprenticeship route and jurisdiction-specific licensing",
        entryPathway:
          "The standard route is a paid wall and floor tiling apprenticeship combined with the CPC31320 Certificate III in Wall and Floor Tiling. A training contract combines employment with registered training, and a White Card is required for construction work. The current TAFE NSW shortlist record should be treated as a qualification reference rather than a guaranteed live intake because its listed study and location options can change.",
        registration:
          "There is no single national Wall and Floor Tiler licence. State and territory building, contractor and trade-licensing rules apply differently by jurisdiction. For example, NSW requires the relevant licence or certificate for residential wall and floor tiling work above the regulated value threshold. Waterproofing or contracting work can trigger additional requirements, and a White Card is required for construction-site work.",
        jobMarketNote:
          "Residential and commercial builders, renovation and bathroom specialists, tiling contractors, pool and wet-area businesses and tile-sector employers use tiling skills. Apprenticeship networks can connect new entrants with host employers, while licensing and contracting rules need to be checked for the state or territory where the work is performed.",
        scoreCaveat:
          "The score is provisional because Jobs and Skills Australia publishes median earnings for this occupation as N/A due to a high standard error. Current vacancy and projection figures are tied to the official JSA series but were captured through an indexed representation until the source workbooks can be directly machine-ingested.",
      },
    },
  },
  {
    id: "welder",
    overview:
      "Welders and fabrication trades workers cut, shape, assemble, join and repair metal components and structures using welding, thermal cutting, fabrication and finishing techniques across manufacturing, construction, mining, defence and shipbuilding.",
    tasks: [
      "Read engineering drawings, specifications and welding symbols to determine fabrication and joining requirements",
      "Measure, mark, cut, shape and prepare metal stock, plate, pipe and structural sections",
      "Set up welding equipment and select suitable processes, consumables and parameters for the material and job",
      "Align and join components using welding, bolting, riveting and related fabrication techniques",
      "Inspect welded joints for penetration, profile, defects and compliance with the required specification",
      "Grind, clean, finish and repair fabricated or welded components while following workplace safety controls",
    ],
    countries: {
      AU: {
        headline: "A nationally short fabrication trade with strong manufacturing, resources and shipbuilding demand",
        entryPathway:
          "The standard route is a paid fabrication engineering apprenticeship combined with the MEM31925 Certificate III in Engineering – Fabrication Trade. The national training register says the qualification was specifically developed for apprentices and must be completed through a Training Contract or a formal trade-recognition assessment process.",
        registration:
          "There is no single national occupational licence for general welding or metal fabrication. Work must meet employer, project, safety and welding-standard requirements, and a White Card is required when the role involves construction-site work. Trades Recognition Australia skills assessment requirements can also apply to migration pathways, but a skills assessment is separate from a domestic occupational licence.",
        jobMarketNote:
          "Manufacturing, construction and mining are major industries for the occupation group. Shipbuilders, defence contractors, resources and maintenance companies, heavy engineering firms and rail manufacturers recruit welders, boilermakers and fabricators, while apprenticeship pathways provide a structured route for new entrants.",
        scoreCaveat:
          "The opportunity score is provisional until the official IVI and employment-projection workbook rows are directly machine-ingested and posting-level employer counts and apprentice-entry shares can replace the current curated evidence.",
      },
    },
  },
  {
    id: "bricklayer",
    overview:
      "Bricklayers and masonry trades workers set out, cut, shape, lay and repair bricks, blocks and stone to construct walls, partitions, arches, paving and other structural or finishing masonry across residential, commercial and restoration projects.",
    tasks: [
      "Read plans and specifications to determine dimensions, materials, bonds and installation procedures",
      "Set out masonry work and prepare foundations, damp-proofing, mortar and supporting materials",
      "Cut and shape bricks, blocks and stone using hand tools and powered cutting equipment",
      "Lay masonry in mortar while checking line, level, plumb, alignment and joint thickness",
      "Install lintels, flashings, reinforcement and related components required by the design",
      "Repair, repoint and maintain brick, block and stone structures and complete the required finish",
    ],
    countries: {
      AU: {
        headline: "A nationally short masonry trade with a paid apprenticeship route and strong earnings at the occupation-group level",
        entryPathway:
          "The standard Bricklayer route is a paid apprenticeship combined with the CPC33020 Certificate III in Bricklaying and Blocklaying. Training combines workplace experience with registered training, while Brick & Block Careers and other apprenticeship networks help connect entrants with employers. The current TAFE NSW shortlist record is a qualification reference and its live study locations should be checked before relying on it.",
        registration:
          "There is no single national Bricklayer licence. State and territory building, contractor and trade-licensing rules vary. NSW, for example, requires the relevant contractor licence or qualified supervisor certificate for regulated residential bricklaying work above the published value threshold. A White Card is required for construction-site work.",
        jobMarketNote:
          "Bricklayers and stonemasons work mainly in construction, with masonry-material businesses, residential and commercial builders, specialist subcontractors and apprenticeship networks supporting employment and training. The 2025 Occupation Shortage List records Bricklayer in shortage nationally and in every state and territory.",
        scoreCaveat:
          "The score is provisional and not yet directly comparable with profiles whose IVI occupation row is complete. JSA earnings and projection values are stored at the ANZSCO 3311 Bricklayers and Stonemasons group level; current national and regional IVI values remain unavailable until the official workbook row is directly ingested.",
      },
    },
  },
  {
    id: "hvac-technician",
    overview:
      "Air Conditioning and Refrigeration Technicians install, commission, maintain, diagnose and repair refrigeration and air-conditioning systems, refrigerant circuits, controls and associated mechanical and electrical components across homes, commercial buildings, cold storage and industrial facilities.",
    tasks: [
      "Interpret drawings and specifications and set out installation reference points for refrigeration and air-conditioning equipment",
      "Install pipework, supports and components such as compressors, motors, condensers, evaporators, pumps, switches and gauges",
      "Pressure-test systems, check for leaks and evacuate refrigerant circuits before commissioning",
      "Recover, handle and charge refrigerants within the worker's licensed scope and the equipment requirements",
      "Commission and test system operation, controls, temperatures, pressures and overall performance",
      "Diagnose faults, repair or replace defective components and record servicing and corrective work",
    ],
    countries: {
      AU: {
        headline: "A nationally short licensed refrigeration trade with a structured apprenticeship route",
        entryPathway:
          "The standard route is a paid air-conditioning and refrigeration apprenticeship combined with the current UEE32225 Certificate III in Air Conditioning and Refrigeration. The qualification covers installation, commissioning, service, fault finding and refrigerant handling, and a training contract or relevant employment may be required for workplace competency development.",
        registration:
          "A Refrigerant Handling Licence is required for work with regulated refrigerants that could cause a release, including installation, commissioning, servicing, maintenance and decommissioning. The Australian Refrigeration Council administers the national licensing scheme. State or territory electrical, refrigeration, contractor and other permissions can also apply depending on the work scope, and a White Card is required when the work is performed on a construction site.",
        jobMarketNote:
          "Construction, commercial facilities, cold-chain and food-storage operations, supermarkets, healthcare, data centres and industrial maintenance all use refrigeration and air-conditioning technicians. JSA shortage evidence identifies the occupation as a persistent long-training-gap trade shortage, while specialist contractors and major HVAC manufacturers continue to recruit technicians and apprentices.",
        scoreCaveat:
          "The opportunity score is provisional because the current JSA IVI 3421 workbook row has not yet been directly machine-ingested, so national and regional vacancy values and vacancy-related score components remain unavailable. Five-year and ten-year growth values retain indexed extraction provenance until the official projection workbook row is directly ingested.",
      },
    },
  },
  {
    id: "construction-manager",
    overview:
      "Construction Project Managers plan, coordinate and control building and civil construction delivery, including budgets, schedules, procurement, labour, subcontractors, quality, safety, contracts and stakeholder requirements from planning through completion.",
    tasks: [
      "Interpret drawings, specifications, contracts and project objectives and establish the delivery plan",
      "Prepare and control budgets, construction programs, procurement packages and resource plans",
      "Coordinate labour, materials, plant, consultants and subcontractors across the construction program",
      "Manage tenders, contracts, variations, negotiations and communication with clients and authorities",
      "Monitor cost, schedule, risk, safety, quality and compliance and take corrective action when required",
      "Lead project and site teams, report progress and manage changes through commissioning and handover",
    ],
    countries: {
      AU: {
        headline: "A nationally short, high-earning management occupation with a substantial education and experience barrier",
        entryPathway:
          "A common professional route is a Bachelor degree in construction management, building, civil engineering or another highly relevant built-environment field followed by progressive project, site or contract-management experience. For a Construction Project Manager migration skills assessment, VETASSESS Group A requires an AQF Bachelor-equivalent highly relevant qualification plus qualifying post-qualification employment. CPC50320 Diploma of Building and Construction (Management) can support industry-management progression, but it does not replace the VETASSESS Bachelor-level requirement.",
        registration:
          "There is no single national Construction Project Manager licence. State and territory builder, contractor or project-management registration can apply depending on the jurisdiction, project and work scope. A White Card is required when the role involves carrying out construction work on site. A VETASSESS migration skills assessment is separate from domestic building or occupational licensing.",
        jobMarketNote:
          "Major commercial builders, civil and infrastructure contractors and property-delivery organisations employ construction managers across metropolitan and regional projects. The 2025 Occupation Shortage List records Construction Project Manager in shortage nationally and in every state and territory, but this is generally an experienced professional role rather than a direct graduate appointment.",
        scoreCaveat:
          "The score is provisional because the current IVI occupation row and a directly verified ten-year occupation projection are unavailable. JSA currently publishes employment and earnings on the broader legacy ANZSCO 1331 Construction Managers series, which also includes Project Builder, while CampCareer maps the canonical career itself only to OSCA 131131 Construction Project Manager.",
      },
    },
  },
] as const

const BY_ID = new Map(OCCUPATION_EDITORIAL.map((item) => [item.id, item]))

export function getOccupationEditorial(id: string) {
  return BY_ID.get(id)
}
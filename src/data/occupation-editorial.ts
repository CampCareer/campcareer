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
] as const

const BY_ID = new Map(OCCUPATION_EDITORIAL.map((item) => [item.id, item]))

export function getOccupationEditorial(id: string) {
  return BY_ID.get(id)
}

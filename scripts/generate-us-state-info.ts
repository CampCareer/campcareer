// Generates src/data/us-state-info.json from Census ACS 5-year data.
// Fetches B25064 (median gross rent), B19013 (median household income),
// and B25031 (median rent by bedrooms) for all 50 states + DC.
//
// Usage: npx tsx scripts/generate-us-state-info.ts
// Requires CENSUS_API_KEY env var.

import { writeFileSync } from "fs"
import path from "path"

const CENSUS_API_KEY = process.env.CENSUS_API_KEY
const YEAR = "2023"
const DATASET = "acs/acs5"

const STATE_FIPS: Record<string, string> = {
  AL: "01", AK: "02", AZ: "04", AR: "05", CA: "06",
  CO: "08", CT: "09", DE: "10", DC: "11", FL: "12",
  GA: "13", HI: "15", ID: "16", IL: "17", IN: "18",
  IA: "19", KS: "20", KY: "21", LA: "22", ME: "23",
  MD: "24", MA: "25", MI: "26", MN: "27", MS: "28",
  MO: "29", MT: "30", NE: "31", NV: "32", NH: "33",
  NJ: "34", NM: "35", NY: "36", NC: "37", ND: "38",
  OH: "39", OK: "40", OR: "41", PA: "42", RI: "44",
  SC: "45", SD: "46", TN: "47", TX: "48", UT: "49",
  VT: "50", VA: "51", WA: "53", WV: "54", WI: "55", WY: "56",
}

const FIPS_TO_STATE = Object.fromEntries(
  Object.entries(STATE_FIPS).map(([s, f]) => [f, s]),
)

interface CensusResponse {
  rentByState: Record<string, number | null>
  incomeByState: Record<string, number | null>
  rentByBedroomsByState: Record<string, { studio: number | null; "1br": number | null; "2br": number | null; "3br": number | null; "4br": number | null }>
}

interface StateInfo {
  medianRent: number | null
  medianIncome: number | null
  rentIncomeRatio: number | null
  rentByBedrooms: {
    studio: number | null
    "1br": number | null
    "2br": number | null
    "3br": number | null
    "4br": number | null
  } | null
}

async function fetchCensusJson(variables: string, forClause: string): Promise<any[]> {
  const url = `https://api.census.gov/data/${YEAR}/${DATASET}?get=${variables}&for=${forClause}&key=${CENSUS_API_KEY}`
  console.log(`Fetching: ${url.replace(CENSUS_API_KEY!, "***")}`)
  const res = await fetch(url)
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Census API error ${res.status}: ${text.slice(0, 200)}`)
  }
  return res.json()
}

async function fetchRentIncome(): Promise<CensusResponse> {
  // B25064_001E = median gross rent, B19013_001E = median household income
  const rows: any[] = await fetchCensusJson("B25064_001E,B19013_001E", "state:*")

  const rentByState: Record<string, number | null> = {}
  const incomeByState: Record<string, number | null> = {}

  // First row is headers
  for (let i = 1; i < rows.length; i++) {
    const [rentStr, incomeStr, fips] = rows[i]
    const state = FIPS_TO_STATE[fips]
    if (!state) continue
    rentByState[state] = rentStr ? Number(rentStr) : null
    incomeByState[state] = incomeStr ? Number(incomeStr) : null
  }

  return { rentByState, incomeByState, rentByBedroomsByState: {} }
}

async function fetchRentByBedrooms(): Promise<Record<string, { studio: number | null; "1br": number | null; "2br": number | null; "3br": number | null; "4br": number | null }>> {
  // B25031: median rent by bedrooms
  // Columns: B25031_001E (total), B25031_002E (0BR studio), B25031_003E (1BR),
  // B25031_004E (2BR), B25031_005E (3BR), B25031_006E (4BR)
  const rows: any[] = await fetchCensusJson(
    "B25031_002E,B25031_003E,B25031_004E,B25031_005E,B25031_006E",
    "state:*",
  )

  const result: Record<string, any> = {}
  for (let i = 1; i < rows.length; i++) {
    const [studio, br1, br2, br3, br4, fips] = rows[i]
    const state = FIPS_TO_STATE[fips]
    if (!state) continue
    result[state] = {
      studio: studio ? Number(studio) : null,
      "1br": br1 ? Number(br1) : null,
      "2br": br2 ? Number(br2) : null,
      "3br": br3 ? Number(br3) : null,
      "4br": br4 ? Number(br4) : null,
    }
  }
  return result
}

async function main() {
  if (!CENSUS_API_KEY) {
    console.error("CENSUS_API_KEY env var required")
    process.exit(1)
  }

  console.log("Fetching rent and income data...")
  const { rentByState, incomeByState } = await fetchRentIncome()

  console.log("Fetching rent by bedrooms...")
  const rentByBedrooms = await fetchRentByBedrooms()

  const stateInfo: Record<string, StateInfo> = {}

  const allStates = Object.keys(STATE_FIPS)
  for (const state of allStates) {
    const rent = rentByState[state] ?? null
    const income = incomeByState[state] ?? null
    // Convert monthly rent to annual for ratio
    const rentRatio = rent != null && income != null && income > 0
      ? Math.round(((rent * 12) / income) * 100) / 100
      : null

    stateInfo[state] = {
      medianRent: rent,
      medianIncome: income,
      rentIncomeRatio: rentRatio,
      rentByBedrooms: rentByBedrooms[state] ?? null,
    }
  }

  const outPath = path.join(process.cwd(), "src/data/us-state-info.json")
  writeFileSync(outPath, JSON.stringify(stateInfo, null, 2))
  console.log(`Written to ${outPath}`)
  console.log(`States: ${Object.keys(stateInfo).length}`)
  console.log(`Sample: CA rent=${stateInfo.CA.medianRent} income=${stateInfo.CA.medianIncome} ratio=${stateInfo.CA.rentIncomeRatio}`)
}

main().catch(console.error)

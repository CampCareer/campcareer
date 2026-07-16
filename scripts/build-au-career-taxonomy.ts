/**
 * Maps published Australian OSCA occupations into CampCareer's stable
 * cross-country career taxonomy. The public categories are broad enough for
 * discovery, while `subcategoryId` preserves a more useful comparison key.
 *
 * Usage: npx tsx --env-file=.env.local scripts/build-au-career-taxonomy.ts
 */
import { writeFile } from "node:fs/promises"
import path from "node:path"
import { createClient } from "@supabase/supabase-js"

const OUTPUT = path.resolve("src/data/au-career-taxonomy-au.json")
const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const key = process.env.SUPABASE_SERVICE_ROLE_KEY

type CategoryId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10
type TaxonomyRow = { oscaCode: string; categoryId: CategoryId; subcategoryId: string; confidence: "rule-mapped" }
type Occupation = { anzsco_code: string; occupation_en: string }

const prefixRules: Record<string, readonly [CategoryId, string]> = {
  "111": [5, "business_management"], "112": [5, "marketing_sales"], "113": [3, "technology_management"], "121": [5, "executive_management"],
  "131": [1, "construction_management"], "132": [4, "manufacturing_resources_management"], "133": [10, "supply_chain_logistics"],
  "151": [7, "farming_aquaculture"], "152": [7, "livestock_farming"], "161": [9, "hospitality_management"], "162": [9, "retail_management"],
  "171": [5, "office_administration"], "211": [5, "accounting"], "212": [5, "financial_advice"], "221": [5, "marketing_communications"],
  "172": [9, "customer_personal_services"], "222": [5, "human_resources"], "223": [3, "data_analytics"], "231": [8, "media_writing_performing_arts"], "241": [8, "architecture_design"],
  "242": [8, "digital_design"], "243": [4, "engineering"], "244": [7, "agriculture_environmental_science"], "251": [6, "school_education"],
  "252": [6, "tertiary_vocational_education"], "259": [6, "education_support"], "261": [2, "mental_health"], "262": [2, "allied_health"], "263": [2, "health_diagnostics"],
  "264": [2, "medical_practice"], "265": [2, "nursing_midwifery"], "269": [2, "dental_oral_health"], "271": [3, "cybersecurity"],
  "272": [3, "ict_infrastructure"], "273": [3, "software_digital"], "281": [5, "legal_public_administration"], "299": [10, "aviation"],
  "312": [1, "building_construction"], "313": [4, "engineering_technicians"], "314": [3, "telecommunications_ict"], "321": [9, "food_preparation"],
  "322": [9, "food_preparation"], "331": [1, "metal_trades"], "332": [1, "aircraft_maintenance"], "342": [7, "horticulture_landcare"],
  "343": [7, "livestock_aquaculture"], "351": [1, "automotive_trades"], "361": [1, "building_finishing"], "362": [1, "building_finishing"],
  "363": [1, "plumbing"], "369": [1, "wood_trades"], "371": [1, "masonry"], "372": [1, "carpentry"], "381": [1, "electrical_trades"],
  "382": [1, "electrical_electronic_trades"], "391": [8, "media_production"], "392": [9, "personal_care"], "399": [1, "skilled_trades"], "411": [6, "community_social_services"],
  "421": [2, "aged_care"], "422": [2, "disability_care"], "431": [6, "early_childhood_education"], "441": [2, "health_support"],
  "442": [2, "health_support"], "451": [9, "emergency_services"], "452": [9, "protective_services"], "461": [9, "personal_travel_services"],
  "462": [9, "sport_recreation"], "471": [9, "hospitality"], "511": [5, "project_contract_administration"], "521": [5, "legal_administration"],
  "531": [5, "financial_services"], "599": [5, "business_public_services"], "619": [9, "retail"], "621": [5, "insurance"],
  "622": [5, "property_services"], "631": [1, "automotive_trades"], "711": [10, "rail_bus_transport"], "713": [10, "road_freight"],
  "731": [4, "manufacturing_operations"], "732": [4, "resources_plant_operations"], "741": [1, "construction_plant_operations"],
  "821": [1, "construction_trades"], "831": [7, "food_agriculture_processing"], "899": [1, "skilled_trades"],
}

const overrides: Record<string, readonly [CategoryId, string]> = {
  "141131": [6, "school_education"], "141132": [6, "school_education"], "141231": [6, "early_childhood_education"],
  "141331": [2, "aged_care"], "141332": [2, "nursing_midwifery"], "141333": [2, "health_administration"], "141334": [2, "emergency_health"],
  "141399": [2, "health_welfare_management"], "141431": [6, "tertiary_vocational_education"], "141499": [6, "education_management"],
  "149131": [8, "arts_culture_management"], "149331": [7, "environmental_management"], "149333": [3, "laboratory_science"],
  "172531": [10, "fleet_transport_management"], "172533": [10, "transport_management"], "172931": [7, "animal_care"], "172932": [1, "equipment_hire"],
  "223531": [5, "property_finance"], "223532": [5, "property_finance"], "223931": [5, "corporate_governance"], "223932": [5, "cost_management"], "223934": [5, "intellectual_property"],
  "241232": [4, "engineering"], "241233": [3, "geospatial_data"], "241234": [4, "surveying"], "241235": [4, "surveying"], "241299": [4, "surveying"],
  "241931": [1, "building_construction"], "241932": [1, "construction_management"],
  "261331": [6, "social_work"],
  "311131": [7, "agriculture_technology"], "311136": [7, "irrigation"], "311137": [7, "food_agriculture_processing"], "311138": [7, "food_agriculture_processing"], "311199": [7, "agriculture_technology"],
  "311231": [2, "health_diagnostics"], "311232": [2, "health_diagnostics"], "311235": [2, "health_diagnostics"], "311299": [2, "health_diagnostics"], "311331": [2, "pharmacy"], "311332": [2, "pharmacy"],
  "311531": [3, "laboratory_science"], "311532": [7, "earth_science"], "311533": [3, "geospatial_data"], "311599": [3, "laboratory_science"],
  "341131": [7, "animal_care"], "341132": [7, "animal_care"], "341231": [2, "veterinary_care"],
  "399231": [4, "resources_operations"], "399931": [1, "marine_trades"], "399932": [10, "maritime"], "399933": [1, "safety_equipment_trades"], "399934": [4, "energy_utilities"], "399937": [10, "rail_transport"], "399938": [1, "marine_trades"],
  "461731": [10, "aviation"], "461831": [10, "travel_transport"], "599931": [2, "health_information"], "599937": [5, "property_services"],
  "599941": [5, "workplace_relations"], "899231": [10, "maritime"], "899431": [1, "automotive_trades"], "899432": [1, "automotive_trades"],
}

function classify(occupation: Occupation): TaxonomyRow {
  const rule = overrides[occupation.anzsco_code] ?? prefixRules[occupation.anzsco_code.slice(0, 3)]
  if (!rule) throw new Error(`No taxonomy rule for ${occupation.anzsco_code} ${occupation.occupation_en}`)
  return { oscaCode: occupation.anzsco_code, categoryId: rule[0], subcategoryId: rule[1], confidence: "rule-mapped" }
}

async function main() {
  if (!url || !key) throw new Error("NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required")
  const supabase = createClient(url, key, { auth: { persistSession: false } })
  const occupations: Occupation[] = []
  for (let from = 0; ; from += 1000) {
    const { data, error } = await supabase.from("occupations_au").select("anzsco_code, occupation_en").order("anzsco_code").range(from, from + 999)
    if (error) throw error
    occupations.push(...(data ?? []) as Occupation[])
    if ((data ?? []).length < 1000) break
  }
  const rows = occupations.map(classify).sort((a, b) => a.oscaCode.localeCompare(b.oscaCode))
  const payload = {
    source: { name: "CampCareer OSCA-to-global-career taxonomy rule mapping", version: 1, generatedAt: new Date().toISOString() },
    occupations: rows,
  }
  await writeFile(OUTPUT, `${JSON.stringify(payload, null, 2)}\n`)
  const counts = rows.reduce<Record<number, number>>((acc, row) => ({ ...acc, [row.categoryId]: (acc[row.categoryId] ?? 0) + 1 }), {})
  console.log(`[au-taxonomy] wrote ${rows.length} occupation mappings; category counts ${JSON.stringify(counts)}`)
}

void main().catch((error) => { console.error("[au-taxonomy] failed:", error); process.exitCode = 1 })

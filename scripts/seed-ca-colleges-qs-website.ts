import { createClient } from "@supabase/supabase-js"
import dotenv from "dotenv"
import path from "path"

dotenv.config({ path: path.resolve(__dirname, "../.env.local") })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase env vars")
  process.exit(1)
}
const supabase = createClient(supabaseUrl, supabaseKey)

interface CollegeUpdate {
  institution_id: string
  qs_rank: number | null
  website: string | null
}

/** Best effort QS World University Rankings 2026 + official website URLs */
const COLLEGE_DATA: CollegeUpdate[] = [
  // ON
  { institution_id: "university-of-toronto", qs_rank: 29, website: "https://www.utoronto.ca" },
  { institution_id: "university-of-waterloo", qs_rank: 119, website: "https://uwaterloo.ca" },
  { institution_id: "mcmaster-university", qs_rank: 173, website: "https://www.mcmaster.ca" },
  { institution_id: "queen-s-university", qs_rank: 191, website: "https://www.queensu.ca" },
  { institution_id: "western-university", qs_rank: 151, website: "https://www.uwo.ca" },
  { institution_id: "university-of-ottawa", qs_rank: 219, website: "https://www.uottawa.ca" },
  { institution_id: "york-university", qs_rank: 333, website: "https://www.yorku.ca" },
  { institution_id: "toronto-metropolitan-university", qs_rank: 715, website: "https://www.torontomu.ca" },
  { institution_id: "carleton-university", qs_rank: 785, website: "https://carleton.ca" },
  { institution_id: "university-of-guelph", qs_rank: 504, website: "https://www.uoguelph.ca" },
  { institution_id: "ontario-tech-university", qs_rank: null, website: "https://ontariotechu.ca" },
  { institution_id: "wilfrid-laurier-university", qs_rank: null, website: "https://www.wlu.ca" },
  { institution_id: "brock-university", qs_rank: 1300, website: "https://brocku.ca" },
  // BC
  { institution_id: "university-of-british-columbia", qs_rank: 40, website: "https://www.ubc.ca" },
  { institution_id: "simon-fraser-university", qs_rank: 308, website: "https://www.sfu.ca" },
  { institution_id: "university-of-victoria", qs_rank: 358, website: "https://www.uvic.ca" },
  { institution_id: "university-of-northern-british-columbia", qs_rank: null, website: "https://www.unbc.ca" },
  // QC
  { institution_id: "mcgill-university", qs_rank: 27, website: "https://www.mcgill.ca" },
  { institution_id: "concordia-university", qs_rank: 465, website: "https://www.concordia.ca" },
  { institution_id: "universit-de-montr-al", qs_rank: 168, website: "https://www.umontreal.ca" },
  { institution_id: "universit-laval", qs_rank: 469, website: "https://www.ulaval.ca" },
  { institution_id: "universit-du-qu-bec-montr-al", qs_rank: 875, website: "https://uqam.ca" },
  // AB
  { institution_id: "university-of-alberta", qs_rank: 94, website: "https://www.ualberta.ca" },
  { institution_id: "university-of-calgary", qs_rank: 211, website: "https://www.ucalgary.ca" },
  { institution_id: "macewan-university", qs_rank: null, website: "https://www.macewan.ca" },
  // Other
  { institution_id: "dalhousie-university", qs_rank: 283, website: "https://www.dal.ca" },
  { institution_id: "university-of-manitoba", qs_rank: 643, website: "https://www.umanitoba.ca" },
  { institution_id: "university-of-saskatchewan", qs_rank: 378, website: "https://www.usask.ca" },
  { institution_id: "university-of-new-brunswick", qs_rank: 622, website: "https://www.unb.ca" },
  { institution_id: "memorial-university-of-newfoundland", qs_rank: 660, website: "https://www.mun.ca" },
]

async function main() {
  console.log(`Updating ${COLLEGE_DATA.length} colleges with QS rank & website...`)

  for (const c of COLLEGE_DATA) {
    const { error } = await supabase
      .from("colleges_ca")
      .update({ qs_rank: c.qs_rank, website: c.website })
      .eq("institution_id", c.institution_id)

    if (error) {
      console.error(`  ${c.institution_id}: ${error.message}`)
    } else {
      console.log(`  ✓ ${c.institution_id} → QS ${c.qs_rank ?? "—"} | ${c.website}`)
    }
  }

  // Verify
  const { data, error } = await supabase
    .from("colleges_ca")
    .select("institution_id, name, qs_rank, website")
    .order("qs_rank", { ascending: true, nullsFirst: false })

  if (error) {
    console.error("Verify error:", error.message)
    return
  }

  console.log("\n=== Verification ===")
  for (const r of data) {
    console.log(`  ${r.qs_rank ? `#${r.qs_rank}` : "  —  "} | ${r.name}`)
  }

  console.log("\nDone!")
}

main().catch(console.error)

import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"

const locations = readFileSync("supabase/migrations/20260811153600_verify_ch_tier_a_study_locations_v1.sql", "utf8")
const views = readFileSync("supabase/migrations/20260811153700_publish_ch_tier_a_city_read_models_v1.sql", "utf8")

test("Switzerland Phase 3 verifies seven municipality study-location representatives", () => {
  assert.match(locations, /expected 7/)
  assert.match(locations, /programme_assignment_verified',true/)
  assert.match(locations, /campus_inventory_complete',false/)
  assert.match(locations, /EPFL main campus is in Ecublens near Lausanne/)
  assert.match(locations, /EPFL must not be assigned to Lausanne municipality/)
})

test("Switzerland City read models preserve exact source and municipality evidence", () => {
  assert.match(views, /CH_SWISSUNIVERSITIES/)
  assert.match(views, /source_record_key=s\.source_name\|\|'\:'\|\|s\.source_program_key/)
  assert.match(views, /lower\(trim\(s\.city\)\)=lower\(trim\(g\.name\)\)/)
  assert.match(views, /programme linkage expected 170 rows/)
  assert.match(views, /city directory expected 6 rows/)
  assert.match(views, /EPFL programme leaked into Lausanne municipality read model/)
})

test("Switzerland City read models remain service-role only", () => {
  for (const view of ["city_institution_directory_ch_v1", "city_programme_directory_ch_v1", "city_directory_ch_v1"]) {
    assert.match(views, new RegExp(`view public\\.${view} with \\(security_invoker=true\\)`))
    assert.match(views, new RegExp(`revoke all on public\\.${view} from public,anon,authenticated`))
    assert.match(views, new RegExp(`grant select on public\\.${view} to service_role`))
  }
})

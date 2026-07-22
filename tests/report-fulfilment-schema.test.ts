import assert from "node:assert/strict"
import test from "node:test"
import { readFileSync } from "node:fs"
import { resolve } from "node:path"

const migration = readFileSync(resolve(process.cwd(), "supabase/migrations/20260722075059_report_personalisation_and_fulfilment.sql"), "utf8")

test("personalised report storage is owner-scoped and browser order writes stay closed", () => {
  assert.match(migration, /alter table public\.report_intakes enable row level security/i)
  assert.match(migration, /alter table public\.report_decision_options enable row level security/i)
  assert.match(migration, /alter table public\.report_orders enable row level security/i)
  assert.match(migration, /grant select on public\.report_orders to authenticated/i)
  assert.doesNotMatch(migration, /grant\s+select\s*,\s*insert[^;]*public\.report_orders\s+to\s+authenticated/i)
  assert.match(migration, /foreign key \(report_intake_id, user_id\) references public\.report_intakes\(id, user_id\)/i)
  assert.match(migration, /foreign key \(source_order_id, user_id\) references public\.report_orders\(id, user_id\)/i)
})

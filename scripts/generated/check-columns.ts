import * as dotenv from 'dotenv'
import * as path from 'path'
import { createClient } from '@supabase/supabase-js'

dotenv.config({ path: path.resolve('/Users/yehunlee/campcareer/.env.local') })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function main() {
  // Try to select new columns
  const { data, error } = await supabase
    .from('majors')
    .select('slug, earnings_p25, earnings_p75, median_debt')
    .eq('country', 'US')
    .limit(1)

  if (error) {
    console.log('Columns do NOT exist yet.')
    console.log('Error:', error.message)
  } else {
    console.log('Columns exist! Data:', JSON.stringify(data))
  }
}

main().catch(console.error)

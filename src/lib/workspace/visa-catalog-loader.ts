import "server-only"

import { createClient } from "@/lib/supabase-server"
import { VISA_CATALOG, type VisaEntry } from "./visa-catalog"
import { applyBatch1VisaCatalog } from "./visa-catalog-batch-1"
import { applyNewZealandVisaCatalog } from "./visa-catalog-new-zealand"

const VISA_KINDS = new Set<VisaEntry["kind"]>([
  "Study",
  "Work",
  "Working holiday",
  "Skilled",
  "Family",
  "Temporary",
])

type VisaPathwayRow = {
  country_code: string
  country_name: string
  visa_name: string
  kind: string
  note: string
  authority: string
  source_url: string
  display_order: number
}

function isVisaKind(value: string): value is VisaEntry["kind"] {
  return VISA_KINDS.has(value as VisaEntry["kind"])
}

function rowToVisaEntry(row: VisaPathwayRow): VisaEntry | null {
  const countryCode = row.country_code.trim().toUpperCase()
  if (!/^[A-Z]{2}$/.test(countryCode) || !isVisaKind(row.kind)) return null

  return {
    country: row.country_name,
    countryCode,
    name: row.visa_name,
    kind: row.kind,
    note: row.note,
    authority: row.authority,
    url: row.source_url,
  }
}

function applyCompletedVisaCatalog(
  base: readonly VisaEntry[],
): readonly VisaEntry[] {
  return applyNewZealandVisaCatalog(applyBatch1VisaCatalog(base))
}

export async function loadVisaCatalog(): Promise<readonly VisaEntry[]> {
  const staticCatalog = applyCompletedVisaCatalog(VISA_CATALOG)

  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("visa_pathways")
      .select(
        "country_code,country_name,visa_name,kind,note,authority,source_url,display_order",
      )
      .order("country_name", { ascending: true })
      .order("display_order", { ascending: true })

    if (error || !data?.length) return staticCatalog

    const merged = new Map(
      staticCatalog.map((visa) => [`${visa.countryCode}:${visa.name}`, visa] as const),
    )

    for (const row of data as VisaPathwayRow[]) {
      const visa = rowToVisaEntry(row)
      if (visa) merged.set(`${visa.countryCode}:${visa.name}`, visa)
    }

    return applyCompletedVisaCatalog([...merged.values()])
  } catch {
    return staticCatalog
  }
}

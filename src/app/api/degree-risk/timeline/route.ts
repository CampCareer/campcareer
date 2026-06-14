import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase-server"
import {
  type CountryCode,
  type LayerMeta,
  type TimelineCountry,
  ALL_COUNTRIES,
  fieldToMajorSlug,
} from "@/lib/degree-risk"

// Per-country immigration-timeline data for the /compare page.
// GET /api/degree-risk/timeline?field=<free text>
//
// If the field maps to a scored major slug, we return that slug's exact
// post_study_work_years per country (so US STEM vs non-STEM is reflected).
// Otherwise we fall back to a representative row per country (visa metadata is
// country-uniform) and flag the US row's STEM branch so the UI can caption it
// instead of collapsing to a single number.

const FALLBACK_SLUG = "nursing" // exists in all 5 countries; US value = 1 (non-STEM base)

const ESTIMATE_VISA: LayerMeta = {
  confidence: "estimate",
  last_verified: null,
  source_name: null,
  source_url: null,
  note: null,
}

type Row = {
  country: CountryCode
  post_study_work_years: number
  layer_meta: { visa?: LayerMeta } | null
}

export async function GET(request: Request) {
  const field = new URL(request.url).searchParams.get("field") ?? ""
  const slug = fieldToMajorSlug(field)
  const lookupSlug = slug ?? FALLBACK_SLUG

  const supabase = createClient()
  const { data, error } = await supabase
    .from("majors")
    .select("country, post_study_work_years, layer_meta")
    .eq("slug", lookupSlug)

  if (error) {
    console.error("[timeline-api] query failed:", error.message)
    return NextResponse.json({ field, slug, countries: [] }, { status: 200 })
  }

  const rows = (data ?? []) as unknown as Row[]
  const byCountry = new Map(rows.map((r) => [r.country, r]))

  const countries: TimelineCountry[] = ALL_COUNTRIES.flatMap((c) => {
    const row = byCountry.get(c)
    if (!row) return []
    const isUsFallback = !slug && c === "US"
    return [
      {
        country: c,
        postStudyYears: row.post_study_work_years,
        stemBranch: isUsFallback,
        visa: row.layer_meta?.visa ?? ESTIMATE_VISA,
      },
    ]
  })

  return NextResponse.json({ field, slug, countries })
}

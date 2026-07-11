import { NextResponse } from "next/server"
import { COUNTRY_ROI_INSIGHTS } from "@/data/country-roi-mvp"
import { getStudyConcept } from "@/data/study-concepts"

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const concept = getStudyConcept((await params).id)
  if (!concept) return NextResponse.json({ error: "Unknown study concept" }, { status: 404 })

  const pathways = Object.entries(concept.coverageByCountry).map(([countryCode, coverage]) => {
    const country = COUNTRY_ROI_INSIGHTS.find((item) => item.code === countryCode)
    return {
      countryCode,
      countryName: country?.name ?? countryCode,
      coverage,
      comparable: coverage === "DECISION_READY" && Boolean(concept.legacyField),
      officialCodes: (concept.officialCodes ?? []).filter((code) => code.country === countryCode),
      profileUrl: country ? `/countries/${country.slug}/fields/${concept.slug}` : `/fields/${concept.slug}`,
      courseOfferingsUrl: `/api/v1/course-offerings?conceptId=${encodeURIComponent(concept.id)}&country=${countryCode}`,
    }
  })

  return NextResponse.json(
    { conceptId: concept.id, pathways },
    { headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" } },
  )
}

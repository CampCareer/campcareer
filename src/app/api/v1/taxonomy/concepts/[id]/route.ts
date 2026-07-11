import { NextResponse } from "next/server"
import { getStudyConcept } from "@/data/study-concepts"

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const concept = getStudyConcept((await params).id)
  if (!concept) return NextResponse.json({ error: "Unknown study concept" }, { status: 404 })

  return NextResponse.json(
    {
      conceptId: concept.id,
      slug: concept.slug,
      kind: concept.kind,
      labels: { en: concept.label, "ko-KR": concept.labelKo },
      aliases: { en: concept.aliases, "ko-KR": concept.aliasesKo },
      description: concept.description,
      officialCodes: concept.officialCodes ?? [],
      coverageByCountry: concept.coverageByCountry,
      recommendable: Boolean(concept.legacyField),
    },
    { headers: { "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800" } },
  )
}

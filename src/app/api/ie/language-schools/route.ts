import { NextResponse } from "next/server"
import { getAllSchools } from "@/lib/language-schools-ie"

export async function GET() {
  try {
    const schools = await getAllSchools()
    return NextResponse.json({
      schools: schools.map((s) => ({
        id: s.id,
        slug: s.slug,
        name_en: s.name_en,
        name_ko: s.name_ko,
        city: s.city,
        lat: s.lat,
        lng: s.lng,
        price_range_week: s.price_range_week,
        accreditation: s.accreditation,
        description_ko: s.description_ko ? s.description_ko.slice(0, 120) : null,
      })),
    })
  } catch {
    return NextResponse.json({ schools: [] })
  }
}

import { notFound } from "next/navigation"
import {
  getSitemapSegment,
  getCountrySitemap,
  isSitemapSegment,
  urlSetXml,
} from "@/lib/sitemap-segments"

export const revalidate = 86400

export async function GET(_request: Request, { params }: { params: Promise<{ segment: string }> }) {
  const rawSegment = (await params).segment
  if (!rawSegment.endsWith(".xml")) notFound()
  const segment = rawSegment.slice(0, -4)
  if (segment.startsWith("country-")) {
    const entries = await getCountrySitemap(segment.slice("country-".length))
    if (!entries) notFound()
    return new Response(urlSetXml(entries), {
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
        "X-Sitemap-URL-Count": String(entries.length),
        "X-Content-Type-Options": "nosniff",
      },
    })
  }
  if (!isSitemapSegment(segment)) notFound()

  const entries = await getSitemapSegment(segment)
  return new Response(urlSetXml(entries), {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
      "X-Sitemap-URL-Count": String(entries.length),
      "X-Content-Type-Options": "nosniff",
    },
  })
}

export const revalidate = 86400

/** The previous segmented sitemap index has no replacement in v1. */
export function GET() {
  return new Response(null, {
    status: 410,
    headers: { "X-Robots-Tag": "noindex", "Cache-Control": "public, max-age=86400" },
  })
}

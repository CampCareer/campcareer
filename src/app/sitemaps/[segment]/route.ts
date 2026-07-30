export const revalidate = 86400

/** Legacy segmented sitemaps intentionally have no public replacement. */
export function GET() {
  return new Response(null, {
    status: 410,
    headers: { "X-Robots-Tag": "noindex", "Cache-Control": "public, max-age=86400" },
  })
}

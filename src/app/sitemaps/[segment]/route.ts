import { notFound } from "next/navigation"

export const revalidate = 86400

/** Legacy segmented sitemaps intentionally have no public replacement. */
export function GET() {
  notFound()
}

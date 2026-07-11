import type { Metadata } from "next"

// Per-page metadata helper. Root layout sets metadataBase only — every page
// must declare its own canonical + og:url via this helper, otherwise Next.js
// metadata merging would leave them pointing at the page that defined them last.
export function pageMetadata({
  title,
  description,
  path,
}: {
  title: string
  description: string
  path: string
}): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: path,
      siteName: "CampCareer",
      type: "website",
      images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: `${title} — CampCareer` }],
    },
    twitter: { card: "summary_large_image", title, description, images: ["/opengraph-image"] },
  }
}

import type { Metadata } from "next"

// Per-page metadata helper. Keep path-aware metadata at the page level so the
// root layout can stay static and public pages remain eligible for ISR/CDN
// caching.
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
      siteName: "CampCareer",
      type: "website",
      url: path,
      images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: `${title} — CampCareer` }],
    },
    twitter: { card: "summary_large_image", title, description, images: ["/opengraph-image"] },
  }
}

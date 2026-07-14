import type { Metadata } from "next"

// Per-page metadata helper. The root layout owns canonical, hreflang and
// Open Graph URL because it has the original URL-locale request context. A
// page supplies its copy here; this keeps `/ko/compare` from inheriting the
// English `/compare` canonical merely because both render the same route.
export function pageMetadata({
  title,
  description,
  path,
}: {
  title: string
  description: string
  // Kept at call sites while individual page modules are migrated. Canonical
  // resolution now happens once in the root layout from the request path.
  path: string
}): Metadata {
  void path
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      siteName: "CampCareer",
      type: "website",
      images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: `${title} — CampCareer` }],
    },
    twitter: { card: "summary_large_image", title, description, images: ["/opengraph-image"] },
  }
}

import { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Private/functional routes — keep out of the index.
        disallow: ["/api/", "/auth/", "/dashboard", "/saved", "/documents"],
      },
    ],
    sitemap: "https://www.campcareer.com/sitemap.xml",
  }
}

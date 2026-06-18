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
      {
        // 매출에 기여하지 않는 SEO·백링크 크롤러는 전면 차단. (이 목록은
        // middleware.ts의 BLOCKED_BOTS_RE와 동일하게 유지 — 미들웨어는 무시하는
        // 봇까지 강제 차단하고, robots는 규칙을 지키는 봇에게 미리 알린다.)
        userAgent: [
          "AhrefsBot",
          "SemrushBot",
          "MJ12bot",
          "DotBot",
          "BLEXBot",
          "DataForSeoBot",
          "Barkrowler",
          "SeekportBot",
        ],
        disallow: "/",
      },
    ],
    sitemap: "https://www.campcareer.com/sitemap.xml",
  }
}

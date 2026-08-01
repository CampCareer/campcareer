/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ["127.0.0.1", "localhost"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "plus.unsplash.com" },
      { protocol: "https", hostname: "images.pexels.com" },
    ],
  },
  async redirects() {
    return [
      // The Workspace Home is the single canonical product home.
      { source: "/", destination: "/home", permanent: true },

      // CampCareer is a route-search product. Retire every former workspace,
      // comparison, onboarding, and broad-study funnel rather than presenting
      // visitors with competing product promises. `/home`, `/compare` and
      // `/countries` now render inside the workspace shell.
      { source: "/planner/:path*", destination: "/", permanent: false },
      { source: "/myplan/:path*", destination: "/", permanent: false },
      { source: "/dashboard/:path*", destination: "/", permanent: false },
      { source: "/profile/:path*", destination: "/", permanent: false },
      { source: "/settings/:path*", destination: "/", permanent: false },
      { source: "/plans/:path*", destination: "/", permanent: false },
      { source: "/applications/:path*", destination: "/", permanent: false },
      { source: "/budget/:path*", destination: "/", permanent: false },
      { source: "/english/:path*", destination: "/", permanent: false },
      { source: "/research/:path*", destination: "/", permanent: false },
      { source: "/report/:path*", destination: "/", permanent: false },
      { source: "/reports/:path*", destination: "/", permanent: false },
      { source: "/onboarding/:path*", destination: "/", permanent: false },
      { source: "/degree-risk/:path*", destination: "/", permanent: false },
      { source: "/decision-brief/:path*", destination: "/", permanent: false },
      { source: "/explore/:path*", destination: "/", permanent: false },
      { source: "/career-path/:path*", destination: "/", permanent: false },
      { source: "/games/:path*", destination: "/", permanent: false },
      { source: "/timeline/:path*", destination: "/", permanent: false },
      { source: "/checklist/:path*", destination: "/", permanent: false },
      { source: "/documents/:path*", destination: "/", permanent: false },
      { source: "/saved/:path*", destination: "/", permanent: false },
      { source: "/rankings/:path*", destination: "/", permanent: false },

      // Raw country, university, and major research is not a public product
      // until it is assembled into a source-backed citizenship-to-work route.
      { source: "/au/:path*", destination: "/", permanent: false },
      { source: "/fields/:path*", destination: "/", permanent: false },
      { source: "/study/:path*", destination: "/", permanent: false },
      { source: "/study-options/:path*", destination: "/", permanent: false },
      { source: "/majors/:path*", destination: "/", permanent: false },
      { source: "/universities/:path*", destination: "/", permanent: false },
      { source: "/roi-explorer/:path*", destination: "/", permanent: false },
      { source: "/blog/:path*", destination: "/", permanent: false },
      { source: "/:country(au|ca|us|uk|de|nl|ie|be|sg|kr|jp|fr|es|nz|no|se|dk|fi|ch|ae)/:path*", destination: "/", permanent: false },
    ]
  },
}

export default nextConfig

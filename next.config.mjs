/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ['127.0.0.1', 'localhost'],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "plus.unsplash.com" },
      { protocol: "https", hostname: "images.pexels.com" },
    ],
  },
  async redirects() {
    return [
      // Soft-hide: redirect hidden routes to landing page
      { source: '/dashboard/:path*', destination: '/', permanent: false },
      { source: '/career-path/:path*', destination: '/', permanent: false },
      { source: '/games/:path*', destination: '/', permanent: false },
      // Retired planning tools now enter the public Compare journey instead of
      // silently dropping visitors on the landing page.
      { source: '/timeline/:path*', destination: '/compare', permanent: false },
      { source: '/checklist/:path*', destination: '/compare', permanent: false },
      { source: '/documents/:path*', destination: '/', permanent: false },
      { source: '/saved/:path*', destination: '/', permanent: false },
      { source: '/rankings/:path*', destination: '/', permanent: false },
      { source: '/explore/:path*', destination: '/', permanent: false },
      // 퍼널 단일화: 구 온보딩 → Degree Risk (영구 이전)
      { source: '/onboarding', destination: '/degree-risk', permanent: true },

      // SEO migration: code-based occupation URLs now resolve through
      // search-term based CampCareer Maps URLs, then canonicalize to slug.
      {
        source: '/roi-explorer/:country(au|ca|us|uk|de|nl)/occupation/:code',
        destination: '/maps/:country/:code',
        permanent: true,
      },

      // 레거시 대학 디테일 URL: /roi-explorer/:id?country=xx → /roi-explorer/:country/:id
      {
        source: '/roi-explorer/:college_id((?!us$|au$|ca$|uk$|ie$)[^/]+)',
        has: [{ type: 'query', key: 'country', value: '(?<country>us|au|ca|uk|ie)' }],
        destination: '/roi-explorer/:country/:college_id',
        permanent: true,
      },
      {
        source: '/roi-explorer/:college_id((?!us$|au$|ca$|uk$|ie$)[^/]+)',
        destination: '/roi-explorer/us/:college_id',
        permanent: true,
      },
      {
        source: '/blog/adelaide-university-international-student-guide-2026',
        destination: '/blog/study-in-australia-2026',
        permanent: true,
      },
      {
        source: '/blog/monash-university-international-student-guide-2026',
        destination: '/blog/study-in-australia-2026',
        permanent: true,
      },
      {
        source: '/blog/australia-cost-of-living-real-breakdown-2026',
        destination: '/blog/study-in-australia-2026',
        permanent: true,
      },
      {
        source: '/blog/radiographer-australia-asmirt-ahpra-visa-guide-2026',
        destination: '/blog/study-in-australia-2026',
        permanent: true,
      },
    ]
  },
};

export default nextConfig;

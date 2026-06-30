/** @type {import('next').NextConfig} */
const nextConfig = {
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
      { source: '/timeline/:path*', destination: '/', permanent: false },
      { source: '/checklist/:path*', destination: '/', permanent: false },
      { source: '/documents/:path*', destination: '/', permanent: false },
      { source: '/saved/:path*', destination: '/', permanent: false },
      { source: '/fields/:path*', destination: '/', permanent: false },
      { source: '/rankings/:path*', destination: '/', permanent: false },
      { source: '/explore/:path*', destination: '/', permanent: false },
      // 퍼널 단일화: 구 온보딩 → Degree Risk (영구 이전)
      { source: '/onboarding', destination: '/degree-risk', permanent: true },

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

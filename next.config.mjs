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

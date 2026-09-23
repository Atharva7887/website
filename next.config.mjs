/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["three"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.sanity.io" },
    ],
  },
  async redirects() {
    return [
      // "Antibody Libraries" was renamed to "AI-Assisted Antibody Libraries";
      // the old URL is already published, so keep it resolving.
      {
        source: "/services/antibody-libraries",
        destination: "/services/ai-assisted-antibody-libraries",
        permanent: true,
      },
      // "Exclusive Libraries" was retired as an offering.
      {
        source: "/services/exclusive-libraries",
        destination: "/services",
        permanent: true,
      },
      // "Biomarker Discovery" was renamed "Biomarker Identification".
      {
        source: "/services/biomarker-discovery",
        destination: "/services/biomarker-identification",
        permanent: true,
      },
      // "Reagents" was removed from the service lineup.
      {
        source: "/services/reagents",
        destination: "/services",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;

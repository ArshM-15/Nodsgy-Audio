/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "oaidalleapiprodscus.blob.core.windows.net",
        pathname: "**",
      },
    ],
    domains: [
      "lh3.googleusercontent.com",
      "oaidalleapiprodscus.blob.core.windows.net",
    ],
  },
};

export default nextConfig;

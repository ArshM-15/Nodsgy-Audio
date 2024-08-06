/** @type {import('next').NextConfig} */
const nextConfig = {
  rules: {
    "max-len": ["error", { code: 120 }],
    "no-html-link-for-pages": "off",
    // other rules...
  },
};

export default nextConfig;

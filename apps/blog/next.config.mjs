/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["lib", "ui"],
  experimental: {
    swcPlugins: [],
  },
};

export default nextConfig;

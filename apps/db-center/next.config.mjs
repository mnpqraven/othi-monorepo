/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["lib", "ui"],
  experimental: {
    swcPlugins: [
      ["@swc-jotai/debug-label", {}],
      ["@swc-jotai/react-refresh", {}],
    ],
  },
};

export default nextConfig;

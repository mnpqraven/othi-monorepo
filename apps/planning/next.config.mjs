/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["lib", "ui"],
  experimental: {
    swcPlugins: [
      ["@swc-jotai/react-refresh", {}],
      ["@swc-jotai/debug-label", {}],
    ],
  },
};

export default nextConfig;

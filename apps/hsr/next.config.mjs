/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "raw.githubusercontent.com",
      },
    ],
  },
  experimental: {
    swcPlugins: [
      ["@swc-jotai/react-refresh", {}],
      ["@swc-jotai/debug-label", {}],
    ],
    serverComponentsExternalPackages: ["@libsql/client"],
    ppr: true,
  },
  transpilePackages: ["lib", "ui", "database", "protocol"],
};

export default nextConfig;

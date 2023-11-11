/** @type {import('next').NextConfig} */
const nextConfig = {
  // async rewrites() {
  //   return {
  //     fallback: [
  //       {
  //         source: "/:path*",
  //         destination: `${process.env.NEXT_PUBLIC_WORKER_API}/:path*`,
  //       },
  //     ],
  //   };
  // },
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
  },
  transpilePackages: ["libsql", "lib", "ui", "database", "protocol"],
};

export default nextConfig;

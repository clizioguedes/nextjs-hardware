import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  outputFileTracingIncludes: {
    "/*": ["node_modules/@swc/helpers/**/*", "node_modules/sharp/**/*"],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.pcbuildwizard.com",
        pathname: "/images/products/**",
      },
    ],
  },
};

export default nextConfig;

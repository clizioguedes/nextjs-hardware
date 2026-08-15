import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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

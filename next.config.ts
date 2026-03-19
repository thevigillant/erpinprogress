import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn-cosmos.bluesoft.com.br",
        pathname: "/products/**",
      },
      {
        protocol: "https",
        hostname: "**.bluesoft.com.br",
      },
    ],
  },
};

export default nextConfig;

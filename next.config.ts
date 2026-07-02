import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: '.', // Silence the "inferred workspace root" warning
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Ignore react-joyride during the build process
      config.resolve.alias["react-joyride"] = false;
    }
    return config;
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  reactStrictMode: true,
  /* config options here */
};

export default nextConfig;

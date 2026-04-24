import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // @ts-ignore: Next.js 16 new property for dev network access
  allowedDevOrigins: ['192.168.1.110', '192.168.1.100', 'localhost'],
};

export default nextConfig;

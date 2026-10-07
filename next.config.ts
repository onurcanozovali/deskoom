import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  async redirects() {
    return [
      { source: "/checkout", destination: "/odeme", permanent: true },
      { source: "/order-confirmation/:orderId", destination: "/siparis-onayi/:orderId", permanent: true },
    ];
  },
};

export default nextConfig;

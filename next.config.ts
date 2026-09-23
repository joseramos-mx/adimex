import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Phase 2: Shopify CDN for product images
      {
        protocol: 'https',
        hostname: '**.myshopify.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.shopify.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'omo-oss-image.thefastimg.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
      },
    ],
  },
  async redirects() {
    return [
      // T10 — slug viejo del F110C. Meta y Google todavía indexan la URL vieja.
      {
        source: "/productos/productos-hmi-f110",
        destination: "/productos/hmi-f110c",
        permanent: true,
      },
    ]
  },
};

export default nextConfig;
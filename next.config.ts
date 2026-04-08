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
<<<<<<< HEAD
        hostname: 'omo-oss-image.thefastimg.com',
=======
        hostname: 'cdn.sanity.io',
>>>>>>> 494de28323332d4b5ec48df9dec4894c78eabcc8
      },
    ],
  },
};

export default nextConfig;

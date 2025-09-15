import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
    // Only unoptimize images for static export in production
    unoptimized: process.env.NODE_ENV === 'production',
  },
  
  // Only use static export for production builds (Netlify deployment)
  // In development, we need server-side functionality for NextAuth.js
  ...(process.env.NODE_ENV === 'production' && {
    output: 'export',
    trailingSlash: true,
  }),
  
  serverExternalPackages: ['resend'],
};

export default nextConfig;

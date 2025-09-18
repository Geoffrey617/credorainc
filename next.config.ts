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
  
  // Enable server-side functionality for API routes and Resend emails
  // Netlify supports Next.js server-side functionality
  
  // TypeScript and ESLint configuration
  typescript: {
    ignoreBuildErrors: false,
  },
  
  eslint: {
    ignoreDuringBuilds: false,
  },
  
  serverExternalPackages: ['resend'],
};

export default nextConfig;

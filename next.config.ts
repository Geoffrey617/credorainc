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
    // Enable image optimization for server-side functionality
    unoptimized: false,
    domains: ['images.unsplash.com'],
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

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
    unoptimized: true, // Required for static export
  },
  
  // Configure for Netlify deployment
  output: 'export',
  trailingSlash: true,
  serverExternalPackages: ['resend'],
};

export default nextConfig;

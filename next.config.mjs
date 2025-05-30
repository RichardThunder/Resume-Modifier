/** @type {import('next').NextConfig} */
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isProd = process.env.NODE_ENV === 'production';

const nextConfig = {
  reactStrictMode: true, // Recommended for development
  
  // Improve image handling
  images: {
    unoptimized: process.env.NODE_ENV === 'production', // Use unoptimized images in production to avoid issues
    // If you need image optimization, use domains or remotePatterns instead
    // domains: ['example.com'],
  },

  // Make environment variables available on the client-side
  // Prefix with NEXT_PUBLIC_
  env: {
    NEXT_PUBLIC_API_URL: process.env.API_URL, // Get value from .env file
    // Add other public environment variables here
  },

  // Set base path for deployment to /modifier subdirectory for both dev and prod
  basePath: '/modifier',
  assetPrefix: '/modifier', // No trailing slash needed for Next.js

  // Configure output for specific deployment targets
  // output: 'standalone', // For Docker deployment using standalone output
  // Configure output for static file generation
  // Required for static export with basePath
  ...(isProd && {
    output: 'export',
    distDir: 'dist',
  }),
  
  // Disable server features in static export
  experimental: {
    // Keep any existing experimental features that might be needed
  },

  // Ensure webpack resolves the path aliases correctly
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, 'src')
    };
    return config;
  },
  
  // Make sure trailing slashes are consistent
  trailingSlash: true,
};

export default nextConfig;
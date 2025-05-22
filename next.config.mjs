/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true, // Recommended for development
  // Optional: Configure image domains if using external images with next/image
  // images: {
  //   domains: ['example.com'],
  // },

  // Make environment variables available on the client-side
  // Prefix with NEXT_PUBLIC_
  env: {
    NEXT_PUBLIC_API_URL: process.env.API_URL, // Get value from .env file
    // Add other public environment variables here
  },

  // Optional: Base path if deploying to a subdirectory (matches Vite config)
  // basePath: process.env.NODE_ENV === 'production' ? '/modifier' : '',
  // assetPrefix: process.env.NODE_ENV === 'production' ? '/modifier/' : '', // Ensure trailing slash for asset prefix


  // Optional: Configure output for specific deployment targets
  output: 'standalone', // For Docker deployment using standalone output

  // Optional: Experimental features
  // experimental: {
  //   appDir: true, // Already default in recent Next.js versions
  // },

};

export default nextConfig;
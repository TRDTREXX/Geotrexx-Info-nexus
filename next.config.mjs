/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
      // Add your original logo domain back here! (Example below)
      {
        protocol: 'https',
        hostname: 'media.graphassets.com', 
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com', 
      }
    ],
  },
};

export default nextConfig;
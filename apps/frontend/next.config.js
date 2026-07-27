/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@merge/ui', '@merge/types'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
};

module.exports = nextConfig;

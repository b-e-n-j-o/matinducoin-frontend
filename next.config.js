/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'css'],
  images: {
    domains: [
      'images.unsplash.com',
      'matinducoin-backend-b2f47bd8118b.herokuapp.com'  // Ajoutez cette ligne
    ],
    unoptimized: true  // Ajoutez cette option pour Vercel
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.node$/,
      use: 'ignore-loader',
    });

    return config;
  },
};

module.exports = nextConfig;
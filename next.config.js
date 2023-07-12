/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["lh3.googleusercontent.com", "res.cloudinary.com"],
  },
  experimental: {
    serverComponentsExternalPackages: ["cloudinary", "graphql-request"],
  },
  // eslint: {
  //   ignoreDuringBuilds: true,
  // },
  typescript: {
    //next-auth won't let to build
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;

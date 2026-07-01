/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns:  [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "commons.wikimedia.org",
      },
    ],
  },
  reactCompiler: true,
};

export default nextConfig;

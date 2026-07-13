/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ["192.168.88.13"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos"
      }
    ]
  }
};

export default nextConfig;

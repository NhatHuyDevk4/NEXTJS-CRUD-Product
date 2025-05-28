import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ['cdn.dummyjson.com', 'www.facebook.com', 'via.placeholder.com', 'utfs.io'], // ✅ Thêm dòng này
  },
};

export default nextConfig;

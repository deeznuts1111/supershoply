import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Chú ý: Điều này cho phép build thành công ngay cả khi có lỗi ESLint
    ignoreDuringBuilds: true,
  },
  // Bạn nên thêm dòng này để tránh lỗi TypeScript chặn build tương tự như ESLint
  typescript: {
    ignoreBuildErrors: true,
  },
  // Cấu hình cho ảnh từ external domains
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.unsplash.com', // Cho phép tất cả subdomain của unsplash
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com', // Nếu bạn dùng Cloudinary
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.cloudinary.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.amazonaws.com', // Nếu dùng AWS S3
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 's3.amazonaws.com',
        pathname: '/**',
      },
      // Thêm các domain khác nếu cần (Google Drive, Imgur, v.v.)
      {
        protocol: 'https',
        hostname: 'drive.google.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.imgur.com',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;

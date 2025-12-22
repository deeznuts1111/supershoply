import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Chú ý: Điều này cho phép build thành công ngay cả khi có lỗi ESLint
    ignoreDuringBuilds: true,
};

export default nextConfig;

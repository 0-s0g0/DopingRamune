import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    return [
      {
        // フロント側で /api/:path* にアクセスしたら、
        // バックエンド (http://localhost:8080) に転送する設定
        source: '/:path*',
        destination: 'http://localhost:8080/:path*',
      },
    ]
  },
};

export default nextConfig;

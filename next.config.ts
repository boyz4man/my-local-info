import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",          // 정적 HTML 파일로 내보내기 (Cloudflare Pages 배포용)
  trailingSlash: true,       // URL 끝에 / 붙이기 (예: /about/)
  images: {
    unoptimized: true,       // 이미지 최적화 비활성화 (정적 배포 시 필수)
  },
};

export default nextConfig;

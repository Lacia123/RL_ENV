/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // 将Node.js特定模块标记为外部依赖
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // 客户端构建时，将node特定模块设置为空对象
      config.resolve.fallback = {
        ...config.resolve.fallback,
        net: false,
        tls: false,
        fs: false,
        child_process: false,
        http: false,
        https: false,
        stream: false,
        crypto: false,
        os: false,
        path: false,
        zlib: false
      };
    }
    return config;
  },
  // 排除Playwright和jsdom在客户端打包
  experimental: {
    serverComponentsExternalPackages: ['playwright-chromium', 'jsdom']
  }
};

export default nextConfig; 
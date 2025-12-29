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
  },
  // 新选项
  serverExternalPackages: ['playwright-chromium', 'jsdom'],
  
  // 配置日志级别，帮助调试
  logging: {
    level: 'info',
  },

  // 配置 CORS 头，允许跨域请求
  // async headers() {
  //   return [
  //     {
  //       source: "/api/:path*",
  //       headers: [
  //         { key: "Access-Control-Allow-Origin", value: "*" },
  //         { key: "Access-Control-Allow-Methods", value: "GET, POST, PUT, DELETE, PATCH, OPTIONS" },
  //         { key: "Access-Control-Allow-Headers", value: "X-Requested-With, Content-Type, Authorization" },
  //       ]
  //     }
  //   ]
  // }
};


export default nextConfig; 
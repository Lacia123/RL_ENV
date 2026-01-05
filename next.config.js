/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // ✅ Next.js 16: 显式启用 Turbopack（默认启用）
  // 注意：Turbopack 通过 serverExternalPackages 自动处理服务端模块
  // 不需要手动配置 resolveAlias
  turbopack: {},
  
  // 将Node.js特定模块标记为外部依赖
  // 注意：webpack 配置在 Turbopack 模式下会被忽略
  // 但保留作为 fallback（如果显式使用 --webpack 标志）
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
    serverActions: {
      bodySizeLimit: '20mb'
    }
  },
  
  // 新选项 - 指定服务端专用的包
  serverExternalPackages: [
    'playwright-chromium', 
    'jsdom',
    'canvas',
    'vm',
    'tough-cookie',
    'whatwg-url',
    'html-encoding-sniffer',
    'agent-base',
    'http-proxy-agent',
    'https-proxy-agent'
  ],

  // 配置日志级别，帮助调试
  logging: {
    level: 'info',
  },

  // 配置 CORS 头，允许跨域请求
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET, POST, PUT, DELETE, PATCH, OPTIONS" },
          { key: "Access-Control-Allow-Headers", value: "X-Requested-With, Content-Type, Authorization" },
        ]
      }
    ]
  }
};


export default nextConfig; 
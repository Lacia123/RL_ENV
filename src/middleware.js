import { NextResponse } from 'next/server';

export function middleware(request) {
  // 请求开始时间
  const start = Date.now();
  
  // 继续处理请求
  const response = NextResponse.next();
  
  // 添加响应头，记录处理时间
  response.headers.set('x-response-time', `${Date.now() - start}ms`);
  
  // 记录请求日志
  console.log(`${request.method} ${request.url} - ${Date.now() - start}ms`);

  // 处理 OPTIONS 请求 (CORS 预检)，直接返回 200
  // 实际的 CORS 头由 next.config.js 配置添加
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, { status: 200 });
  }
  
  return response;
}

// 指定需要应用中间件的路径
export const config = {
  matcher: [
    // 应用到所有API请求
    '/api/:path*',
  ],
}; 
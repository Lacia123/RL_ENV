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
  
  return response;
}

// 指定需要应用中间件的路径
export const config = {
  matcher: [
    // 应用到所有API请求
    '/api/:path*',
  ],
}; 
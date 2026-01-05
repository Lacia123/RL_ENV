import { NextResponse } from 'next/server';

// 健康检查函数
function getHealthStatus() {
  const usage = process.memoryUsage();
  const timestamp = new Date().toISOString();
  
  return {
    status: "ok",
    timestamp: timestamp,
    uptime: Math.round(process.uptime()),
    memory: {
      heapUsed: Math.round(usage.heapUsed / 1024 / 1024),
      heapTotal: Math.round(usage.heapTotal / 1024 / 1024),
      rss: Math.round(usage.rss / 1024 / 1024)
    }
  };
}

export async function GET() {
  const healthData = getHealthStatus();
  console.log('✓ 健康检查 (GET):', JSON.stringify(healthData));
  
  return NextResponse.json(healthData, { status: 200 });
}

// ✅ 添加 POST 支持（用于健康监控脚本）
export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const healthData = getHealthStatus();
    
    console.log('✓ 健康检查 (POST):', JSON.stringify(healthData));
    
    return NextResponse.json(healthData, { status: 200 });
  } catch (error) {
    console.error('❌ 健康检查失败:', error.message);
    return NextResponse.json({
      status: "error",
      message: error.message
    }, { status: 500 });
  }
} 
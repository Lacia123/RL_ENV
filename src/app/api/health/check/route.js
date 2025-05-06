import { NextResponse } from 'next/server';

export async function GET() {
  const timestamp = new Date().toISOString();
  console.log(JSON.stringify({
    status: "ok",
    timestamp: timestamp
  }));
  
  return NextResponse.json({
    status: "ok",
    timestamp: timestamp
  }, { status: 200 });
} 
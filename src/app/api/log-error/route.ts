// src/app/api/log-error/route.ts

import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const error = await req.json();

  // Simple server-side logging
  console.error('📦 Error captured:', error);

  return NextResponse.json({ status: 'logged' });
}

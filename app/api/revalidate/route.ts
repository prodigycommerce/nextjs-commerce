import { revalidateAll } from 'lib/prodigy';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest): Promise<NextResponse> {
  return revalidateAll(req);
}

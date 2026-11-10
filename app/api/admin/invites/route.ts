import { NextResponse } from 'next/server';
import { listInvites } from '@/lib/invites';

export async function GET() {
  try {
    const invites = await listInvites();
    return NextResponse.json(invites);
  } catch (error) {
    return NextResponse.json({ error: 'db_unavailable' }, { status: 503 });
  }
}
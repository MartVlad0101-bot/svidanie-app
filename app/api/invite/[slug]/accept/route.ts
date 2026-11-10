import { NextResponse } from 'next/server';
import { acceptInvite, exists } from '@/lib/invites';
import { SLUG_RE } from '@/lib/validate';

export async function POST(_req: Request, ctx: { params: Promise<{ slug: string }> }) {
  const { slug } = await ctx.params;
  if (!SLUG_RE.test(slug)) return NextResponse.json({ error: 'bad_request' }, { status: 400 });

  try {
    const recorded = await acceptInvite(slug);
    if (recorded) return NextResponse.json({ ok: true, accepted: true });
    if (await exists(slug)) return NextResponse.json({ ok: true, accepted: true, duplicate: true });
    return NextResponse.json({ error: 'not_found' }, { status: 404 });
  } catch (error) {
    console.error('[POST accept]', error);
    return NextResponse.json({ error: 'db_unavailable' }, { status: 503 });
  }
}
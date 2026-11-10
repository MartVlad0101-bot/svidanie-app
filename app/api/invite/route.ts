import { NextResponse } from 'next/server';
import { createInvite, getInvite } from '@/lib/invites';
import { parseCreateInvite, SLUG_RE } from '@/lib/validate';

export async function POST(req: Request) {
  let body: unknown;
  try { body = await req.json(); } catch { return NextResponse.json({ error: 'invalid_json' }, { status: 400 }); }
  const parsed = parseCreateInvite(body);
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: 400 });

  try {
    const invite = await createInvite(parsed.value);
    return NextResponse.json({ slug: invite.slug }, { status: 201 });
  } catch (error) {
    console.error('[POST /api/invite]', error);
    return NextResponse.json({ error: 'db_unavailable' }, { status: 503 });
  }
}

export async function GET(req: Request) {
  const slug = new URL(req.url).searchParams.get('slug');
  if (!slug || !SLUG_RE.test(slug)) return NextResponse.json({ error: 'bad_request' }, { status: 400 });

  try {
    const invite = await getInvite(slug);
    if (!invite) return NextResponse.json({ error: 'not_found' }, { status: 404 });
    return NextResponse.json(invite);
  } catch (error) {
    console.error('[GET /api/invite]', error);
    return NextResponse.json({ error: 'db_unavailable' }, { status: 503 });
  }
}
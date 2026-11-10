import { NextResponse, type NextRequest } from 'next/server';

export function proxy(req: NextRequest) {
  const user = process.env.ADMIN_USER;
  const password = process.env.ADMIN_PASSWORD;

  if (!user || !password) {
    return new NextResponse('Admin credentials are not configured', { status: 503 });
  }

  const expected = 'Basic ' + btoa(`${user}:${password}`);
  if (req.headers.get('authorization') !== expected) {
    return new NextResponse('Auth required', {
      status: 401,
      headers: { 'WWW-Authenticate': 'Basic realm="admin", charset="UTF-8"' },
    });
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin', '/admin/:path*', '/api/admin', '/api/admin/:path*'],
};
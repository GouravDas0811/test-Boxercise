import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
  const token = await getToken({ req });

  // Not authenticated → redirect to login
  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // Accessing /admin but not an admin → redirect to homepage
  if (req.nextUrl.pathname.startsWith('/admin') && token.role !== 'admin') {
    return NextResponse.redirect(new URL('/', req.url));
  }

  return NextResponse.next();
}

// 👇 Apply to /admin route only
export const config = {
  matcher: ['/admin/:path*'],
};

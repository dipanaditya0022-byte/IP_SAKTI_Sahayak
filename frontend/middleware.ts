import { NextRequest, NextResponse } from 'next/server';

const USER_COOKIE = 'ipsakti_session';
const ADMIN_COOKIE = 'ipsakti_admin';

export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  const hasAdmin = req.cookies.has(ADMIN_COOKIE);
  const hasUser = req.cookies.has(USER_COOKIE);

  const redirect = (path: string, withNext = false) => {
    const url = req.nextUrl.clone();
    url.pathname = path;
    url.search = withNext ? `?next=${encodeURIComponent(pathname + search)}` : '';
    return NextResponse.redirect(url);
  };

  if (pathname === '/admin/login') {
    if (hasAdmin) return redirect('/admin/dashboard');
    if (hasUser) return redirect('/app');
    return NextResponse.next();
  }
  if (pathname.startsWith('/admin')) {
    return hasAdmin ? NextResponse.next() : redirect('/admin/login', true);
  }
  return hasUser ? NextResponse.next() : redirect('/login', true);
}

export const config = { matcher: ['/admin/:path*', '/app/:path*'] };

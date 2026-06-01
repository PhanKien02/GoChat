import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  // TODO: Replace 'auth-token' with your actual authentication cookie/token name
  // This could be from next-auth, firebase, or a custom backend token
  const hasAuthToken = request.cookies.has('auth-token');
  const isAuthPage = request.nextUrl.pathname.startsWith('/login') || request.nextUrl.pathname.startsWith('/signup');

  // If the user is NOT authenticated and trying to access a protected route
  if (!hasAuthToken && !isAuthPage) {
    // Redirect them to the login page
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If the user IS authenticated and trying to access the login page
  if (hasAuthToken && isAuthPage) {
    // Redirect them to the dashboard/home
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Allow the request to proceed
  return NextResponse.next();
}

// Configure which routes the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     * - public files (like images, fonts)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.png|.*\\.svg|.*\\.ico).*)',
  ],
};

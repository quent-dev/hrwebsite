import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Add paths that should be protected
const protectedPaths = ['/profile', '/time-off'];

// Add paths that should redirect to dashboard if user is authenticated
const authPaths = ['/login', '/register'];

export async function middleware(request: NextRequest) {
  const authToken = request.cookies.get('firebase-token');
  const path = request.nextUrl.pathname;

  // Check if the path is protected and user is not authenticated
  if (protectedPaths.includes(path) && !authToken) {
    const url = new URL('/login', request.url);
    url.searchParams.set('redirect', path);
    return NextResponse.redirect(url);
  }

  // Check if the path is an auth path and user is authenticated
  if (authPaths.includes(path) && authToken) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [...protectedPaths, ...authPaths],
};

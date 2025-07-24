import { NextRequest, NextResponse } from 'next/server';
import { securityMiddleware } from '@/lib/security-middleware';

export function middleware(request: NextRequest) {
  // Apply security middleware first
  const securityResponse = securityMiddleware(request);
  
  // Only apply admin middleware to admin routes (except the main login page)
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Allow access to the main admin login page (/admin)
    if (request.nextUrl.pathname === '/admin') {
      return securityResponse;
    }

    // For admin subpages, check if admin-token cookie exists
    const token = request.cookies.get('admin-token')?.value;

    if (!token) {
      // No token, redirect to admin login page
      const loginUrl = new URL('/admin', request.url);
      const response = NextResponse.redirect(loginUrl);
      
      // Apply security headers to redirect response
      securityResponse.headers.forEach((value, key) => {
        response.headers.set(key, value);
      });
      
      return response;
    }

    // Token exists, let the AdminGuard component handle detailed validation
    // This avoids JWT verification issues in middleware edge runtime
    return securityResponse;
  }

  return securityResponse;
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)',
  ],
};

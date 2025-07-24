import { NextRequest, NextResponse } from 'next/server';

// Security middleware to add additional protections
export function securityMiddleware(request: NextRequest) {
  const response = NextResponse.next();

  // Add security headers that aren't covered by next.config.js
  response.headers.set('X-DNS-Prefetch-Control', 'off');
  response.headers.set('X-Download-Options', 'noopen');
  response.headers.set('X-Permitted-Cross-Domain-Policies', 'none');
  
  // Only set HSTS in production with HTTPS
  if (process.env.NODE_ENV === 'production' && request.url.startsWith('https://')) {
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  }

  // Add cache control for sensitive endpoints
  if (request.nextUrl.pathname.startsWith('/admin') || request.nextUrl.pathname.startsWith('/api/auth')) {
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    response.headers.set('Surrogate-Control', 'no-store');
  }

  return response;
}

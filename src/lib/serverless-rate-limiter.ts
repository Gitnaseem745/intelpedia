import { NextRequest } from 'next/server';

// Simple serverless-compatible rate limiter using timestamps
interface RateLimitEntry {
  attempts: number[];
  lastAttempt: number;
}

class ServerlessRateLimiter {
  private attempts: Map<string, RateLimitEntry> = new Map();
  private readonly maxAttempts: number;
  private readonly windowMs: number;

  constructor(maxAttempts: number = 5, windowMs: number = 15 * 60 * 1000) {
    this.maxAttempts = maxAttempts;
    this.windowMs = windowMs;
  }

  isRateLimited(ip: string): boolean {
    const now = Date.now();
    const entry = this.attempts.get(ip) || { attempts: [], lastAttempt: 0 };

    // Clean up old attempts outside the window
    entry.attempts = entry.attempts.filter(timestamp => now - timestamp < this.windowMs);

    // Check if rate limited
    if (entry.attempts.length >= this.maxAttempts) {
      return true;
    }

    // Add current attempt
    entry.attempts.push(now);
    entry.lastAttempt = now;
    this.attempts.set(ip, entry);

    return false;
  }

  getRemainingAttempts(ip: string): number {
    const now = Date.now();
    const entry = this.attempts.get(ip);
    
    if (!entry) {
      return this.maxAttempts;
    }

    // Clean up old attempts
    const validAttempts = entry.attempts.filter(timestamp => now - timestamp < this.windowMs);
    return Math.max(0, this.maxAttempts - validAttempts.length);
  }

  getResetTime(ip: string): number {
    const entry = this.attempts.get(ip);
    if (!entry || entry.attempts.length === 0) {
      return 0;
    }

    // Return when the oldest attempt will expire
    const oldestAttempt = Math.min(...entry.attempts);
    return oldestAttempt + this.windowMs;
  }

  // Clean up old entries periodically
  cleanup(): void {
    const now = Date.now();
    for (const [ip, entry] of this.attempts.entries()) {
      if (now - entry.lastAttempt > this.windowMs) {
        this.attempts.delete(ip);
      }
    }
  }
}

// Export a single instance
export const authRateLimiter = new ServerlessRateLimiter(5, 15 * 60 * 1000);

// Cleanup every 10 minutes
setInterval(() => {
  authRateLimiter.cleanup();
}, 10 * 60 * 1000);

export function getClientIP(request: NextRequest): string {
  // Try to get real IP from various headers
  const forwardedFor = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const remoteAddr = request.headers.get('x-vercel-forwarded-for');
  
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }
  
  if (realIP) {
    return realIP.trim();
  }
  
  if (remoteAddr) {
    return remoteAddr.trim();
  }
  
  // Fallback to a default value
  return 'unknown';
}

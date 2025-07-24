// Simple in-memory rate limiter for authentication endpoints
interface RateLimitEntry {
  count: number;
  resetTime: number;
}

class RateLimiter {
  private attempts: Map<string, RateLimitEntry> = new Map();
  private readonly maxAttempts: number;
  private readonly windowMs: number;

  constructor(maxAttempts: number = 5, windowMs: number = 15 * 60 * 1000) { // 5 attempts per 15 minutes
    this.maxAttempts = maxAttempts;
    this.windowMs = windowMs;
  }

  isRateLimited(ip: string): boolean {
    const now = Date.now();
    const entry = this.attempts.get(ip);

    if (!entry || now > entry.resetTime) {
      // Reset or create new entry
      this.attempts.set(ip, {
        count: 1,
        resetTime: now + this.windowMs
      });
      return false;
    }

    if (entry.count >= this.maxAttempts) {
      return true;
    }

    // Increment count
    entry.count++;
    return false;
  }

  getRemainingAttempts(ip: string): number {
    const entry = this.attempts.get(ip);
    if (!entry || Date.now() > entry.resetTime) {
      return this.maxAttempts;
    }
    return Math.max(0, this.maxAttempts - entry.count);
  }

  getResetTime(ip: string): number {
    const entry = this.attempts.get(ip);
    if (!entry || Date.now() > entry.resetTime) {
      return 0;
    }
    return entry.resetTime;
  }

  // Clean up expired entries periodically
  cleanup(): void {
    const now = Date.now();
    for (const [ip, entry] of this.attempts.entries()) {
      if (now > entry.resetTime) {
        this.attempts.delete(ip);
      }
    }
  }
}

// Create singleton instance
export const authRateLimiter = new RateLimiter();

// Clean up expired entries every hour
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    authRateLimiter.cleanup();
  }, 60 * 60 * 1000); // 1 hour
}

export function getClientIP(request: Request): string {
  // Get IP from various headers in order of preference
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const remoteAddr = request.headers.get('remote-addr');

  if (forwarded) {
    // x-forwarded-for can contain multiple IPs, get the first one
    return forwarded.split(',')[0].trim();
  }

  if (realIP) {
    return realIP;
  }

  if (remoteAddr) {
    return remoteAddr;
  }

  // Fallback
  return 'unknown';
}

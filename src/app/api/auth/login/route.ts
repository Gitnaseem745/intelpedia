import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { authRateLimiter, getClientIP } from '@/lib/serverless-rate-limiter';
import { loginSchema, sanitizeInput } from '@/lib/validation';

export async function POST(request: NextRequest) {
  try {
    // Rate limiting check
    const clientIP = getClientIP(request);
    
    if (authRateLimiter.isRateLimited(clientIP)) {
      const resetTime = authRateLimiter.getResetTime(clientIP);
      const remainingTime = Math.ceil((resetTime - Date.now()) / 1000 / 60); // minutes
      
      return NextResponse.json(
        { 
          error: 'Too many login attempts. Please try again later.',
          retryAfter: remainingTime
        },
        { 
          status: 429,
          headers: {
            'Retry-After': remainingTime.toString()
          }
        }
      );
    }
    
    const body = await request.json();
    
    // Validate and sanitize input
    const validationResult = loginSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validationResult.error.issues },
        { status: 400 }
      );
    }

    const { password } = validationResult.data;
    const sanitizedPassword = sanitizeInput(password);

    const adminPasswordHash = process.env.ADMIN_PASSWORD;
    const jwtSecret = process.env.JWT_SECRET;

    if (!adminPasswordHash || !jwtSecret) {
      console.error('Missing environment variables:', {
        hasAdminPassword: !!adminPasswordHash,
        hasJWTSecret: !!jwtSecret,
        adminPasswordLength: adminPasswordHash?.length || 0
      });
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    // Debug: Log password hash format (only first and last few chars for security)
    console.log('Password hash format check:', {
      starts_with_dollar: adminPasswordHash.startsWith('$'),
      starts_with_backslash: adminPasswordHash.startsWith('\\'),
      length: adminPasswordHash.length,
      first_chars: adminPasswordHash.substring(0, 4),
      last_chars: adminPasswordHash.substring(adminPasswordHash.length - 4)
    });

    // Use bcrypt to compare the provided password with the hashed password
    const isPasswordValid = await bcrypt.compare(sanitizedPassword, adminPasswordHash);

    if (isPasswordValid) {
      // Generate JWT token
      const token = jwt.sign(
        { 
          isAdmin: true,
          exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
        },
        jwtSecret
      );

      // Create response with HTTP-only cookie
      const response = NextResponse.json(
        { success: true, message: 'Authentication successful' },
        { status: 200 }
      );

      // Set HTTP-only cookie
      response.cookies.set({
        name: 'admin-token',
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'lax' : 'strict', // 'lax' for production
        maxAge: 24 * 60 * 60, // 24 hours in seconds (not milliseconds)
        path: '/'
      });

      // Debug: Log cookie setting
      console.log('Cookie set debug:', {
        tokenLength: token.length,
        nodeEnv: process.env.NODE_ENV,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'lax' : 'strict'
      });

      return response;
    } else {
      // Invalid password - provide remaining attempts info
      const remainingAttempts = authRateLimiter.getRemainingAttempts(clientIP);
      
      return NextResponse.json(
        { 
          error: 'Invalid password',
          remainingAttempts: remainingAttempts - 1 // Subtract 1 because this attempt failed
        },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

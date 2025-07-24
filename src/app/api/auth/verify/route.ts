import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('admin-token')?.value;

    if (!token) {
      return NextResponse.json(
        { authenticated: false, error: 'No token found' },
        { status: 401 }
      );
    }

    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
      return NextResponse.json(
        { authenticated: false, error: 'Server configuration error' },
        { status: 500 }
      );
    }

    try {
      const decoded = jwt.verify(token, jwtSecret) as any;
      
      if (decoded.isAdmin) {
        return NextResponse.json(
          { authenticated: true, isAdmin: true },
          { status: 200 }
        );
      } else {
        return NextResponse.json(
          { authenticated: false, error: 'Invalid token' },
          { status: 401 }
        );
      }
    } catch (jwtError) {
      // Token is invalid or expired
      return NextResponse.json(
        { authenticated: false, error: 'Invalid or expired token' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Verify token error:', error);
    return NextResponse.json(
      { authenticated: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { NextRequest } from 'next/server';

export interface AdminJWTPayload {
  isAdmin: boolean;
  exp: number;
}

export function verifyAdminToken(token: string): AdminJWTPayload | null {
  try {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error('JWT_SECRET not configured');
    }

    const decoded = jwt.verify(token, jwtSecret) as AdminJWTPayload;
    return decoded;
  } catch (error) {
    return null;
  }
}

export function getTokenFromRequest(request: NextRequest): string | null {
  return request.cookies.get('admin-token')?.value || null;
}

export function isAdminAuthenticated(request: NextRequest): boolean {
  const token = getTokenFromRequest(request);
  if (!token) return false;

  const decoded = verifyAdminToken(token);
  return decoded?.isAdmin === true;
}

export function requireAdminAuth(request: NextRequest): AdminJWTPayload {
  const token = getTokenFromRequest(request);
  if (!token) {
    throw new Error('No authentication token provided');
  }

  const decoded = verifyAdminToken(token);
  if (!decoded || !decoded.isAdmin) {
    throw new Error('Invalid or expired authentication token');
  }

  return decoded;
}

/**
 * Verify admin password using bcrypt
 * @param password - Plain text password
 * @param hash - Bcrypt hash from environment variable
 * @returns Promise<boolean> - True if password is valid
 */
export async function verifyAdminPassword(password: string, hash: string): Promise<boolean> {
  try {
    return await bcrypt.compare(password, hash);
  } catch (error) {
    console.error('Password verification error:', error);
    return false;
  }
}

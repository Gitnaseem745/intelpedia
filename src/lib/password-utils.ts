import bcrypt from 'bcryptjs';

/**
 * Hash a password using bcrypt with 12 rounds of salt
 * @param password - Plain text password to hash
 * @returns Promise<string> - Hashed password
 */
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
}

/**
 * Verify a password against a bcrypt hash
 * @param password - Plain text password
 * @param hash - Bcrypt hash to compare against
 * @returns Promise<boolean> - True if password matches hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}

/**
 * Generate a secure random JWT secret
 * @param length - Length of the secret (default: 64 characters)
 * @returns string - Random hex string
 */
export function generateJWTSecret(length: number = 64): string {
  const crypto = require('crypto');
  return crypto.randomBytes(length).toString('hex');
}

// Utility script to generate new hashed passwords
// Run this with: node -e "require('./src/lib/password-utils.js').generateHashedPassword('your_new_password')"
export async function generateHashedPassword(password: string): Promise<void> {
  try {
    const hash = await hashPassword(password);
    console.log('Password:', password);
    console.log('Hashed:', hash);
    console.log('\nAdd this to your .env file:');
    console.log(`ADMIN_PASSWORD=${hash}`);
  } catch (error) {
    console.error('Error generating hash:', error);
  }
}

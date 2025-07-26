# Vercel Production Authentication Fix

## Issues Identified and Fixed

### 1. Environment Variable Escaping
**Problem**: The `ADMIN_PASSWORD` environment variable had escaped dollar signs (`\$`) which don't work in production.

**Fix**: Updated `.env.local` to use unescaped format:
```bash
# Before (broken in production)
ADMIN_PASSWORD="\$2a\$12\$6bwEKyPoYeR3/jxtsBqtfu30IGNwWaOLGac3.o/GZL8dBWDuu7DyW"

# After (works in production)
ADMIN_PASSWORD=$2a$12$6bwEKyPoYeR3/jxtsBqtfu30IGNwWaOLGac3.o/GZL8dBWDuu7DyW
```

### 2. Cookie Configuration Issues
**Problem**: Cookie settings were not compatible with Vercel's serverless environment.

**Fixes Applied**:
- Changed `maxAge` from milliseconds to seconds (Next.js requirement)
- Changed `sameSite` from 'strict' to 'lax' in production for better compatibility
- Added proper debugging

### 3. Rate Limiter Not Serverless-Compatible
**Problem**: In-memory rate limiter doesn't work across serverless function invocations.

**Fix**: Created `serverless-rate-limiter.ts` with timestamp-based approach.

## Deployment Steps for Vercel

### Step 1: Update Environment Variables in Vercel Dashboard

1. Go to your Vercel project dashboard
2. Navigate to Settings → Environment Variables
3. Update `ADMIN_PASSWORD` to:
   ```
   $2a$12$6bwEKyPoYeR3/jxtsBqtfu30IGNwWaOLGac3.o/GZL8dBWDuu7DyW
   ```
   **Important**: No quotes, no escaping, just the plain hash

4. Ensure `JWT_SECRET` is set (keep existing value):
   ```
   3369d28c381537f42566be1032c998e5
   ```

### Step 2: Deploy Changes
```bash
git add .
git commit -m "Fix authentication for Vercel production"
git push
```

### Step 3: Test in Production

After deployment, test using the debug endpoint:

1. **Test Environment Variables**:
   ```
   https://yourdomain.com/api/test/env?secret=YOUR_REVALIDATION_SECRET&password=naseem@!1234
   ```

2. **Test Cookie Functionality**:
   ```
   https://yourdomain.com/api/test/env?secret=YOUR_REVALIDATION_SECRET&cookie=true
   ```

3. **Test Admin Login**:
   - Go to `https://yourdomain.com/admin`
   - Use password: `naseem@!1234`

### Step 4: Monitor Logs

Check Vercel Function logs to see the debug output:
- Look for "Password hash format check" logs
- Look for "Cookie set debug" logs
- Look for "Verify route debug" logs

## Expected Debug Output

### Successful Login Log:
```
Password hash format check: {
  starts_with_dollar: true,
  starts_with_backslash: false,
  length: 60,
  first_chars: "$2a$",
  validBcryptFormat: true
}

Cookie set debug: {
  tokenLength: 123,
  nodeEnv: "production",
  secure: true,
  sameSite: "lax"
}
```

### Successful Verification Log:
```
Verify route debug: {
  hasToken: true,
  tokenLength: 123,
  cookieNames: ["admin-token"]
}
```

## Common Issues and Solutions

### Issue: Still getting "No token found"
**Cause**: Cookie not being sent by browser
**Solutions**:
1. Check if your domain has HTTPS (required for secure cookies)
2. Verify no browser extensions are blocking cookies
3. Test in incognito mode
4. Check if domain/subdomain mismatch

### Issue: "Invalid or expired token"
**Cause**: JWT_SECRET mismatch or token corruption
**Solutions**:
1. Verify JWT_SECRET is identical in production
2. Clear all cookies and login again
3. Check token expiration (24 hours)

### Issue: "Server configuration error" 
**Cause**: Environment variables not set properly
**Solutions**:
1. Verify all environment variables are set in Vercel dashboard
2. Redeploy after setting environment variables
3. Check for typos in variable names

## Rollback Plan

If issues persist, you can temporarily use a simpler authentication:

1. Create a new hash without special characters:
   ```bash
   node -e "console.log(require('bcryptjs').hashSync('naseem@!1234', 12))"
   ```

2. Update the environment variable with the new hash

3. Or temporarily disable authentication by modifying `AdminGuard.tsx` to always return `true` for `isAuthenticated`

## Security Notes

- The debug endpoints are protected by `REVALIDATION_SECRET` in production
- Remove debug logs after confirming everything works
- Consider implementing proper session management for production use
- Monitor login attempts and implement proper rate limiting

## Files Modified

1. `.env.local` - Fixed password hash escaping
2. `src/app/api/auth/login/route.ts` - Fixed cookie settings and added debugging
3. `src/app/api/auth/logout/route.ts` - Fixed cookie settings
4. `src/app/api/auth/verify/route.ts` - Added debugging
5. `src/lib/serverless-rate-limiter.ts` - New serverless-compatible rate limiter
6. `src/app/api/test/env/route.ts` - Debug endpoint for testing

const bcrypt = require('bcryptjs');

async function debugAuth() {
    console.log('=== Debug Authentication ===\n');

    // Test data
    const password = 'naseem@!1234';
    const hashFromEnv = '$2a$12$6bwEKyPoYeR3/jxtsBqtfu30IGNwWaOLGac3.o/GZL8dBWDuu7DyW';
    const hashFromEnvEscaped = '\\$2a\\$12\\$6bwEKyPoYeR3/jxtsBqtfu30IGNwWaOLGac3.o/GZL8dBWDuu7DyW';

    console.log('Password:', password);
    console.log('Hash from .env:', hashFromEnv);
    console.log('Hash from .env (escaped):', hashFromEnvEscaped);
    console.log();

    // Test direct comparison
    console.log('=== Direct Comparison ===');
    const directResult = await bcrypt.compare(password, hashFromEnv);
    console.log('Direct compare result:', directResult);
    console.log();

    // Test with escaped hash
    console.log('=== Escaped Hash Comparison ===');
    const escapedResult = await bcrypt.compare(password, hashFromEnvEscaped);
    console.log('Escaped compare result:', escapedResult);
    console.log();

    // Test sanitization (same as in validation.ts)
    console.log('=== Sanitized Password ===');
    function sanitizeInput(input) {
        return input
            .trim()
            .replace(/[<>]/g, '') // Remove potential HTML tags
            .replace(/javascript:/gi, '') // Remove javascript: URLs
            .replace(/data:/gi, '') // Remove data: URLs
            .replace(/vbscript:/gi, ''); // Remove vbscript: URLs
    }

    const sanitizedPassword = sanitizeInput(password);
    console.log('Original password:', password);
    console.log('Sanitized password:', sanitizedPassword);
    console.log('Passwords match:', password === sanitizedPassword);
    console.log();

    const sanitizedResult = await bcrypt.compare(sanitizedPassword, hashFromEnv);
    console.log('Sanitized compare result:', sanitizedResult);
    console.log();

    // Generate clean hash without escaping
    console.log('=== Generate Clean Hash ===');
    const cleanHash = await bcrypt.hash(password, 12);
    console.log('Clean hash (no escaping needed):');
    console.log(cleanHash);
    console.log();

    const cleanResult = await bcrypt.compare(password, cleanHash);
    console.log('Clean hash works:', cleanResult);
}

debugAuth().catch(console.error);

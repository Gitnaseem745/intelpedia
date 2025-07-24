#!/usr/bin/env node

/**
 * Build script to test static generation of tools pages
 * This script helps verify that your ISR setup is working correctly
 */

const { exec } = require('child_process');
const path = require('path');

console.log('🚀 Building Next.js application with ISR for tools...\n');

// Set environment variables for build
process.env.NODE_ENV = 'production';

// Run the build command
const buildCommand = 'next build';

exec(buildCommand, { cwd: process.cwd() }, (error, stdout, stderr) => {
    if (error) {
        console.error('❌ Build failed:', error);
        process.exit(1);
    }

    console.log('📦 Build output:');
    console.log(stdout);

    if (stderr) {
        console.log('⚠️  Build warnings:');
        console.log(stderr);
    }

    console.log('\n✅ Build completed successfully!');
    console.log('\n📊 ISR Configuration Summary:');
    console.log('- Tool pages will be statically generated at build time');
    console.log('- Pages will revalidate every 1 hour (3600 seconds)');
    console.log('- New tools not generated at build time will use fallback rendering');
    console.log('- Manual revalidation available via /api/tools/revalidate endpoint');

    console.log('\n🔧 To trigger manual revalidation:');
    console.log('POST /api/tools/revalidate');
    console.log('Body: { "secret": "your-revalidation-secret", "toolId": "optional" }');

    console.log('\n🚀 Start the production server with: npm start');
});

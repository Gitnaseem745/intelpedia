#!/usr/bin/env node

/**
 * Test script to verify ISR implementation
 * This script tests the ISR setup and checks static generation files
 */

async function testISRSetup() {
    console.log('🧪 Testing ISR Setup for Tools Pages\n');

    // Test environment variables
    console.log('1. Checking environment variables...');
    const revalidationSecret = process.env.REVALIDATION_SECRET;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

    if (!revalidationSecret) {
        console.log('⚠️  REVALIDATION_SECRET not set. Manual revalidation will not work.');
        console.log('   Add REVALIDATION_SECRET=your-secret-token to your .env.local file');
    } else {
        console.log('✅ REVALIDATION_SECRET is configured');
    }

    console.log(`📍 Base URL: ${baseUrl}\n`);

    // Check if ISR files exist
    console.log('2. Checking ISR implementation files...');
    const fs = require('fs');
    const path = require('path');

    const files = [
        'src/app/(pages)/tools/[toolId]/page.tsx',
        'src/app/api/tools/revalidate/route.ts',
        'src/app/(sitemaps)/tools/sitemap.ts'
    ];

    let allFilesExist = true;

    files.forEach(file => {
        const fullPath = path.join(process.cwd(), file);
        if (fs.existsSync(fullPath)) {
            console.log(`✅ ${file}`);
        } else {
            console.log(`❌ ${file} - NOT FOUND`);
            allFilesExist = false;
        }
    });

    if (allFilesExist) {
        console.log('\n✅ All ISR implementation files are in place');
    } else {
        console.log('\n❌ Some ISR files are missing');
    }

    // Check ISR configuration in the tool page
    console.log('\n3. Checking ISR configuration...');
    try {
        const toolPagePath = path.join(process.cwd(), 'src/app/(pages)/tools/[toolId]/page.tsx');
        const toolPageContent = fs.readFileSync(toolPagePath, 'utf8');

        if (toolPageContent.includes('generateStaticParams')) {
            console.log('✅ generateStaticParams function found');
        } else {
            console.log('❌ generateStaticParams function not found');
        }

        if (toolPageContent.includes('export const revalidate')) {
            console.log('✅ ISR revalidate configuration found');
        } else {
            console.log('❌ ISR revalidate configuration not found');
        }

        if (toolPageContent.includes('export const dynamicParams')) {
            console.log('✅ Dynamic params configuration found');
        } else {
            console.log('❌ Dynamic params configuration not found');
        }
    } catch (error) {
        console.log('❌ Could not read tool page file:', error.message);
    }

    console.log('\n📋 ISR Configuration Summary:');
    console.log('─'.repeat(50));
    console.log('🔄 Revalidation: 1 hour (3600 seconds)');
    console.log('🎯 Dynamic Params: Enabled (fallback rendering)');
    console.log('📄 Static Generation: All approved tools at build time');
    console.log('🔧 Manual Revalidation: /api/tools/revalidate');
    console.log('─'.repeat(50));

    console.log('\n🚀 Next Steps:');
    console.log('1. Set REVALIDATION_SECRET in your .env.local file');
    console.log('2. Run "npm run build" to test static generation');
    console.log('3. Run "npm start" to test ISR in production mode');
    console.log('4. Add new tools and test revalidation');
    console.log('5. Monitor build output for static generation details');
}

// Run the test
testISRSetup().catch(console.error);

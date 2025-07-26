#!/usr/bin/env node

/**
 * DRY RUN script to preview tools that would be deleted (tools without imgUrl)
 * Run with: node scripts/preview-delete-tools-without-image.js
 * 
 * This script will:
 * 1. Connect to the MongoDB database
 * 2. Find all tools without imgUrl or with empty/null imgUrl
 * 3. Show a detailed preview of what would be deleted
 * 4. Export results to a JSON file for review
 * 5. Provide statistics and recommendations
 * 
 * This is a SAFE script - it doesn't delete anything!
 */

const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Import the database connection
const connectDB = require('./lib/db');

// Tool model schema
const featuresSchema = new mongoose.Schema({
    name: { type: String, required: true },
    details: { type: String, required: true }
}, {
    _id: false
});

const toolSchema = new mongoose.Schema({
    title: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    tags: { type: [String], required: true },
    siteUrl: { type: String, required: true },
    imgUrl: { type: String, required: false },
    features: { type: [featuresSchema] },
    featured: { type: Boolean, default: false },
    isFree: { type: Boolean, default: undefined },
    pricing: { type: Number, default: undefined, min: 0 }
}, {
    timestamps: true
});

// PendingTool model schema
const pendingToolSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    tags: { type: [String], required: true },
    siteUrl: { type: String, required: true },
    imgUrl: { type: String, required: false },
    features: { type: [featuresSchema] },
    featured: { type: Boolean, default: false },
    isFree: { type: Boolean, default: undefined },
    pricing: { type: Number, default: undefined, min: 0 },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    submittedAt: { type: Date, default: Date.now }
}, {
    timestamps: true,
    collection: 'pending-tools'
});

// Function to analyze tools without imgUrl
async function analyzeToolsWithoutImage(Model, modelName) {
    console.log(`\n🔍 Analyzing ${modelName} without imgUrl...`);

    // Find tools where imgUrl is null, undefined, or empty string
    const toolsWithoutImage = await Model.find({
        $or: [
            { imgUrl: { $exists: false } },
            { imgUrl: null },
            { imgUrl: '' },
            { imgUrl: { $in: [null, ''] } }
        ]
    });

    // Get total count for percentage calculation
    const totalTools = await Model.countDocuments();

    console.log(`📊 Results for ${modelName}:`);
    console.log(`   Total ${modelName}: ${totalTools}`);
    console.log(`   Without imgUrl: ${toolsWithoutImage.length}`);
    console.log(`   Percentage: ${totalTools > 0 ? ((toolsWithoutImage.length / totalTools) * 100).toFixed(1) : 0}%`);

    if (toolsWithoutImage.length > 0) {
        console.log(`\n📋 Detailed list of ${modelName} without imgUrl:`);
        console.log('='.repeat(80));

        toolsWithoutImage.forEach((tool, index) => {
            console.log(`${index + 1}. ${tool.title}`);
            console.log(`   ID: ${tool._id}`);
            console.log(`   URL: ${tool.siteUrl}`);
            console.log(`   Tags: ${tool.tags ? tool.tags.join(', ') : 'None'}`);
            console.log(`   Featured: ${tool.featured || false}`);
            console.log(`   Free: ${tool.isFree !== undefined ? tool.isFree : 'Not specified'}`);
            console.log(`   Created: ${tool.createdAt}`);
            console.log(`   imgUrl: ${tool.imgUrl || 'Not set'}`);
            if (tool.status) {
                console.log(`   Status: ${tool.status}`);
            }
            console.log('   ' + '-'.repeat(40));
        });
    }

    return {
        tools: toolsWithoutImage,
        total: totalTools,
        withoutImage: toolsWithoutImage.length,
        percentage: totalTools > 0 ? ((toolsWithoutImage.length / totalTools) * 100) : 0
    };
}

// Function to export results to JSON
function exportToJson(data, filename) {
    const outputPath = path.join(__dirname, filename);

    try {
        fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));
        console.log(`📄 Results exported to: ${outputPath}`);
    } catch (error) {
        console.error(`❌ Failed to export to JSON: ${error.message}`);
    }
}

// Function to provide recommendations
function provideRecommendations(approvedData, pendingData) {
    console.log('\n💡 RECOMMENDATIONS:');
    console.log('='.repeat(50));

    const totalWithoutImage = approvedData.withoutImage + pendingData.withoutImage;

    if (totalWithoutImage === 0) {
        console.log('✅ All tools have images! No action needed.');
        return;
    }

    console.log(`📊 ${totalWithoutImage} tools would be deleted:`);
    console.log(`   - ${approvedData.withoutImage} approved tools`);
    console.log(`   - ${pendingData.withoutImage} pending tools`);

    console.log('\n🎯 Before deleting, consider:');
    console.log('   1. Add placeholder images to valuable tools');
    console.log('   2. Check if tools are still active/relevant');
    console.log('   3. Backup the database before deletion');
    console.log('   4. Review featured or popular tools first');

    console.log('\n🔧 To add images to tools:');
    console.log('   - Use the admin dashboard to edit tools');
    console.log('   - Upload images via the image upload API');
    console.log('   - Use default placeholder images for categories');

    console.log('\n⚠️  To proceed with deletion:');
    console.log('   Run: node scripts/delete-tools-without-image.js');
}

// Main function
async function main() {
    try {
        console.log('🔍 PREVIEW: Tools without imgUrl that would be deleted\n');
        console.log('This is a DRY RUN - no data will be deleted!\n');

        // Load environment variables
        try {
            require('dotenv').config({ path: '.env.local' });
        } catch (error) {
            // dotenv not installed, try loading manually
            console.log('Note: dotenv not found, loading .env.local manually...');
            try {
                const fs = require('fs');
                const path = require('path');
                const envPath = path.join(process.cwd(), '.env.local');
                if (fs.existsSync(envPath)) {
                    const envContent = fs.readFileSync(envPath, 'utf8');
                    envContent.split('\n').forEach(line => {
                        const [key, value] = line.split('=');
                        if (key && value) {
                            process.env[key.trim()] = value.trim();
                        }
                    });
                }
            } catch (envError) {
                console.log('Could not load .env.local file');
            }
        }

        if (!process.env.MONGODB_URI) {
            console.error('❌ Error: MONGODB_URI environment variable is not set');
            console.log('Please create a .env.local file with MONGODB_URI');
            process.exit(1);
        }

        // Connect to database
        console.log('🔌 Connecting to MongoDB...');
        await connectDB();
        console.log('✅ Connected to MongoDB successfully');

        // Get or create models
        const Tool = mongoose.models.Tool || mongoose.model('Tool', toolSchema);
        const PendingTool = mongoose.models.PendingTool || mongoose.model('PendingTool', pendingToolSchema);

        // Analyze both collections
        const approvedData = await analyzeToolsWithoutImage(Tool, 'approved tools');
        const pendingData = await analyzeToolsWithoutImage(PendingTool, 'pending tools');

        // Export data to JSON for review
        const exportData = {
            timestamp: new Date().toISOString(),
            summary: {
                approvedTools: {
                    total: approvedData.total,
                    withoutImage: approvedData.withoutImage,
                    percentage: approvedData.percentage
                },
                pendingTools: {
                    total: pendingData.total,
                    withoutImage: pendingData.withoutImage,
                    percentage: pendingData.percentage
                },
                totalToDelete: approvedData.withoutImage + pendingData.withoutImage
            },
            toolsToDelete: {
                approved: approvedData.tools.map(tool => ({
                    _id: tool._id.toString(),
                    title: tool.title,
                    siteUrl: tool.siteUrl,
                    tags: tool.tags,
                    featured: tool.featured,
                    isFree: tool.isFree,
                    createdAt: tool.createdAt,
                    imgUrl: tool.imgUrl
                })),
                pending: pendingData.tools.map(tool => ({
                    _id: tool._id.toString(),
                    title: tool.title,
                    siteUrl: tool.siteUrl,
                    tags: tool.tags,
                    status: tool.status,
                    featured: tool.featured,
                    isFree: tool.isFree,
                    createdAt: tool.createdAt,
                    submittedAt: tool.submittedAt,
                    imgUrl: tool.imgUrl
                }))
            }
        };

        exportToJson(exportData, 'tools-to-delete-preview.json');

        // Provide recommendations
        provideRecommendations(approvedData, pendingData);

        console.log('\n✅ Preview completed successfully!');

    } catch (error) {
        console.error('❌ Error during preview:', error);
        process.exit(1);
    } finally {
        // Close database connection
        if (mongoose.connection.readyState === 1) {
            await mongoose.connection.close();
            console.log('\n🔌 Database connection closed.');
        }
    }
}

// Run the script
if (require.main === module) {
    main();
}

module.exports = { main };

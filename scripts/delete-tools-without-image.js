#!/usr/bin/env node

/**
 * Script to delete all tools that don't have an imgUrl property
 * Run with: node scripts/delete-tools-without-image.js
 * 
 * This script will:
 * 1. Connect to the MongoDB database
 * 2. Find all tools without imgUrl or with empty/null imgUrl
 * 3. Show a summary of tools to be deleted
 * 4. Ask for confirmation before deletion
 * 5. Perform bulk deletion
 * 6. Show results
 */

const mongoose = require('mongoose');
const readline = require('readline');

// Import the database connection
const connectDB = require('./lib/db');

// Tool model schema (replicated here to avoid TypeScript issues)
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

// Function to get confirmation from user
function askForConfirmation(message) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    return new Promise((resolve) => {
        rl.question(message, (answer) => {
            rl.close();
            resolve(answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes');
        });
    });
}

// Function to find tools without imgUrl
async function findToolsWithoutImage(Model, modelName) {
    console.log(`\n🔍 Searching for ${modelName} without imgUrl...`);

    // Find tools where imgUrl is null, undefined, or empty string
    const toolsWithoutImage = await Model.find({
        $or: [
            { imgUrl: { $exists: false } },
            { imgUrl: null },
            { imgUrl: '' },
            { imgUrl: { $in: [null, ''] } }
        ]
    }).select('_id title siteUrl imgUrl createdAt');

    console.log(`📊 Found ${toolsWithoutImage.length} ${modelName} without imgUrl`);

    if (toolsWithoutImage.length > 0) {
        console.log(`\n📋 ${modelName} to be deleted:`);
        console.log('----------------------------------------');
        toolsWithoutImage.forEach((tool, index) => {
            console.log(`${index + 1}. Title: "${tool.title}"`);
            console.log(`   URL: ${tool.siteUrl}`);
            console.log(`   imgUrl: ${tool.imgUrl || 'undefined/null'}`);
            console.log(`   Created: ${tool.createdAt}`);
            console.log('');
        });
    }

    return toolsWithoutImage;
}

// Function to delete tools
async function deleteTools(Model, modelName, toolsToDelete) {
    if (toolsToDelete.length === 0) {
        console.log(`✅ No ${modelName} to delete.`);
        return { deletedCount: 0 };
    }

    const toolIds = toolsToDelete.map(tool => tool._id);

    console.log(`\n🗑️  Deleting ${toolsToDelete.length} ${modelName}...`);

    const result = await Model.deleteMany({
        _id: { $in: toolIds }
    });

    console.log(`✅ Successfully deleted ${result.deletedCount} ${modelName}`);

    return result;
}

// Main function
async function main() {
    try {
        console.log('🚀 Starting bulk deletion of tools without imgUrl...\n');

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

        // Find tools without imgUrl in both collections
        const toolsWithoutImage = await findToolsWithoutImage(Tool, 'approved tools');
        const pendingToolsWithoutImage = await findToolsWithoutImage(PendingTool, 'pending tools');

        const totalToDelete = toolsWithoutImage.length + pendingToolsWithoutImage.length;

        if (totalToDelete === 0) {
            console.log('\n🎉 No tools found without imgUrl. All tools have images!');
            process.exit(0);
        }

        console.log(`\n📊 SUMMARY:`);
        console.log(`   Approved tools to delete: ${toolsWithoutImage.length}`);
        console.log(`   Pending tools to delete: ${pendingToolsWithoutImage.length}`);
        console.log(`   Total tools to delete: ${totalToDelete}`);

        // Ask for confirmation
        console.log('\n⚠️  WARNING: This action cannot be undone!');
        const confirmed = await askForConfirmation('Do you want to proceed with deletion? (y/N): ');

        if (!confirmed) {
            console.log('❌ Deletion cancelled by user.');
            process.exit(0);
        }

        console.log('\n🗑️  Starting deletion process...');

        // Delete tools from both collections
        const toolResult = await deleteTools(Tool, 'approved tools', toolsWithoutImage);
        const pendingResult = await deleteTools(PendingTool, 'pending tools', pendingToolsWithoutImage);

        // Summary
        console.log('\n📊 DELETION SUMMARY:');
        console.log('========================================');
        console.log(`✅ Approved tools deleted: ${toolResult.deletedCount}`);
        console.log(`✅ Pending tools deleted: ${pendingResult.deletedCount}`);
        console.log(`✅ Total tools deleted: ${toolResult.deletedCount + pendingResult.deletedCount}`);

        console.log('\n🎉 Bulk deletion completed successfully!');

    } catch (error) {
        console.error('❌ Error during execution:', error);
        if (error.code === 11000) {
            console.error('This appears to be a duplicate key error.');
        }
        process.exit(1);
    } finally {
        // Close database connection
        if (mongoose.connection.readyState === 1) {
            await mongoose.connection.close();
            console.log('🔌 Database connection closed.');
        }
    }
}

// Handle script termination
process.on('SIGINT', async () => {
    console.log('\n⚠️  Script interrupted by user');
    if (mongoose.connection.readyState === 1) {
        await mongoose.connection.close();
    }
    process.exit(0);
});

// Run the script
if (require.main === module) {
    main();
}

module.exports = { main };

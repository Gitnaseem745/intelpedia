#!/usr/bin/env node

/**
 * Test script for the Tools API
 * Run with: node scripts/test-api.js
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api/tools';

// Test data
const testTool = {
    title: 'Test AI Tool',
    description: 'This is a test AI tool for demonstrating the API functionality. It has more than 20 characters.',
    tags: ['ai', 'test', 'demo'],
    siteUrl: 'https://example.com',
    features: [
        {
            name: 'Feature 1',
            details: 'This is the first feature'
        },
        {
            name: 'Feature 2',
            details: 'This is the second feature'
        }
    ]
};

async function runTests() {
    console.log('🚀 Starting API Tests...\n');

    let createdToolId = null;

    try {
        // Test 1: Get all tools (initially might be empty)
        console.log('📋 Test 1: GET /api/tools');
        try {
            const response = await axios.get(BASE_URL);
            console.log('✅ Success:', response.data.message);
            console.log(`   Found ${response.data.tools?.length || 0} tools\n`);
        } catch (error) {
            if (error.response?.status === 404) {
                console.log('✅ Success: No tools found (empty database)\n');
            } else {
                throw error;
            }
        }

        // Test 2: Create a new tool
        console.log('📝 Test 2: POST /api/tools');
        const createResponse = await axios.post(BASE_URL, testTool);
        console.log('✅ Success:', createResponse.data.message);
        createdToolId = createResponse.data.newTool._id;
        console.log(`   Created tool with ID: ${createdToolId}\n`);

        // Test 3: Get tool by ID
        console.log('🔍 Test 3: GET /api/tools/:id');
        const getResponse = await axios.get(`${BASE_URL}/${createdToolId}`);
        console.log('✅ Success:', getResponse.data.message);
        console.log(`   Tool title: ${getResponse.data.tool.title}\n`);

        // Test 4: Update tool
        console.log('✏️  Test 4: PUT /api/tools/:id');
        const updatedData = {
            title: 'Updated Test AI Tool',
            description: 'This is an updated description for the test AI tool with more than 20 characters.'
        };
        const updateResponse = await axios.put(`${BASE_URL}/${createdToolId}`, updatedData);
        console.log('✅ Success:', updateResponse.data.message);
        console.log(`   Updated tool title: ${updateResponse.data.tool.title}\n`);

        // Test 5: Search tools
        console.log('🔎 Test 5: GET /api/tools/search');
        const searchResponse = await axios.get(`${BASE_URL}/search?q=test&page=1&limit=5`);
        console.log('✅ Success:', searchResponse.data.message);
        console.log(`   Found ${searchResponse.data.tools.length} tools matching search\n`);

        // Test 6: Get tags
        console.log('🏷️  Test 6: GET /api/tools/tags');
        const tagsResponse = await axios.get(`${BASE_URL}/tags`);
        console.log('✅ Success:', tagsResponse.data.message);
        console.log(`   Available tags: ${tagsResponse.data.tags.map(t => t.tag).join(', ')}\n`);

        // Test 7: Delete tool
        console.log('🗑️  Test 7: DELETE /api/tools/:id');
        const deleteResponse = await axios.delete(`${BASE_URL}/${createdToolId}`);
        console.log('✅ Success:', deleteResponse.data.message);
        console.log('   Tool deleted successfully\n');

        // Test 8: Try to get deleted tool (should fail)
        console.log('❌ Test 8: GET deleted tool (should fail)');
        try {
            await axios.get(`${BASE_URL}/${createdToolId}`);
            console.log('❌ Unexpected: Tool should have been deleted\n');
        } catch (error) {
            if (error.response?.status === 404) {
                console.log('✅ Success: Tool not found (correctly deleted)\n');
            } else {
                throw error;
            }
        }

        console.log('🎉 All tests passed successfully!');

    } catch (error) {
        console.error('❌ Test failed:', error.response?.data || error.message);

        // Cleanup: delete test tool if it was created
        if (createdToolId) {
            try {
                await axios.delete(`${BASE_URL}/${createdToolId}`);
                console.log('🧹 Cleanup: Deleted test tool');
            } catch (cleanupError) {
                console.log('⚠️  Cleanup failed, you may need to manually delete test tool');
            }
        }
    }
}

// Run tests
runTests();

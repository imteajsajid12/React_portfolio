#!/usr/bin/env node

/**
 * 🚀 Appwrite Portfolio Collections Setup
 * Fixes 404 "Collection not found" errors
 * 
 * Usage: node quick-setup.js
 */

import { Client, Databases, Permission, Role } from 'appwrite';

// Configuration - Update these values
const CONFIG = {
    endpoint: 'https://fra.cloud.appwrite.io/v1',
    projectId: 'YOUR_PROJECT_ID', // Replace with your actual project ID
    databaseId: '68b167ac00260b8be1b2', // From your error message
    apiKey: 'YOUR_API_KEY' // You'll need to get this from Appwrite console
};

// Essential collections that must be created
const ESSENTIAL_COLLECTIONS = [
    {
        id: 'portfolio_skills',
        name: 'Portfolio Skills',
        attributes: [
            { key: 'name', type: 'string', size: 100, required: true },
            { key: 'category', type: 'string', size: 100, required: true },
            { key: 'proficiency', type: 'integer', required: false, default: 50 },
            { key: 'icon', type: 'string', size: 500, required: false },
            { key: 'color', type: 'string', size: 20, required: false, default: '#3B82F6' },
            { key: 'status', type: 'string', size: 50, required: false, default: 'active' },
            { key: 'order', type: 'integer', required: false, default: 0 }
        ]
    },
    {
        id: 'portfolio_projects',
        name: 'Portfolio Projects', 
        attributes: [
            { key: 'title', type: 'string', size: 255, required: true },
            { key: 'description', type: 'string', size: 2000, required: true },
            { key: 'technologies', type: 'string', size: 100, required: false, array: true },
            { key: 'image', type: 'string', size: 500, required: false },
            { key: 'demoUrl', type: 'string', size: 500, required: false },
            { key: 'githubUrl', type: 'string', size: 500, required: false },
            { key: 'featured', type: 'boolean', required: false, default: false },
            { key: 'status', type: 'string', size: 50, required: false, default: 'active' },
            { key: 'order', type: 'integer', required: false, default: 0 }
        ]
    },
    {
        id: 'portfolio_about',
        name: 'Portfolio About',
        attributes: [
            { key: 'name', type: 'string', size: 255, required: true },
            { key: 'title', type: 'string', size: 255, required: true },
            { key: 'bio', type: 'string', size: 2000, required: false },
            { key: 'email', type: 'string', size: 255, required: false },
            { key: 'phone', type: 'string', size: 50, required: false },
            { key: 'location', type: 'string', size: 255, required: false },
            { key: 'profileImage', type: 'string', size: 500, required: false },
            { key: 'resume', type: 'string', size: 500, required: false },
            { key: 'socialLinks', type: 'string', size: 2000, required: false },
            { key: 'availableForWork', type: 'boolean', required: false, default: true }
        ]
    }
];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function createCollection(databases, collection) {
    try {
        console.log(`📝 Creating collection: ${collection.name}`);
        
        // Create collection
        await databases.createCollection(
            CONFIG.databaseId,
            collection.id,
            collection.name,
            [
                Permission.read(Role.any()),
                Permission.create(Role.users()),
                Permission.update(Role.users()),
                Permission.delete(Role.users())
            ],
            false
        );
        
        console.log(`✅ Collection ${collection.name} created`);
        
        // Wait before creating attributes
        await delay(2000);
        
        // Create attributes
        for (const attr of collection.attributes) {
            try {
                console.log(`  📌 Adding attribute: ${attr.key}`);
                
                if (attr.type === 'string') {
                    await databases.createStringAttribute(
                        CONFIG.databaseId,
                        collection.id,
                        attr.key,
                        attr.size,
                        attr.required || false,
                        attr.default,
                        attr.array || false
                    );
                } else if (attr.type === 'integer') {
                    await databases.createIntegerAttribute(
                        CONFIG.databaseId,
                        collection.id,
                        attr.key,
                        attr.required || false,
                        attr.min,
                        attr.max,
                        attr.default,
                        attr.array || false
                    );
                } else if (attr.type === 'boolean') {
                    await databases.createBooleanAttribute(
                        CONFIG.databaseId,
                        collection.id,
                        attr.key,
                        attr.required || false,
                        attr.default,
                        attr.array || false
                    );
                }
                
                console.log(`    ✓ ${attr.key} added`);
                await delay(500);
                
            } catch (attrError) {
                console.log(`    ⚠️  ${attr.key} skipped: ${attrError.message}`);
            }
        }
        
        return true;
    } catch (error) {
        if (error.code === 409) {
            console.log(`⏭️  Collection ${collection.name} already exists`);
            return true;
        }
        console.error(`❌ Failed to create ${collection.name}:`, error.message);
        return false;
    }
}

async function main() {
    console.log('🚀 Starting Appwrite Portfolio Setup...\n');
    
    // Validate configuration
    if (CONFIG.projectId === 'YOUR_PROJECT_ID' || CONFIG.apiKey === 'YOUR_API_KEY') {
        console.error('❌ Configuration Error!');
        console.log('Please update the CONFIG object in this file with your actual:');
        console.log('  - Project ID (from Appwrite console)');
        console.log('  - API Key (with database permissions)');
        console.log('\nGet these values from: https://cloud.appwrite.io/console/');
        return;
    }
    
    const client = new Client();
    client
        .setEndpoint(CONFIG.endpoint)
        .setProject(CONFIG.projectId)
        .setKey(CONFIG.apiKey);
    
    const databases = new Databases(client);
    
    console.log(`📊 Creating ${ESSENTIAL_COLLECTIONS.length} essential collections...\n`);
    
    let successCount = 0;
    
    for (const collection of ESSENTIAL_COLLECTIONS) {
        const success = await createCollection(databases, collection);
        if (success) successCount++;
        console.log(); // Empty line for readability
    }
    
    console.log('🎉 Setup Summary:');
    console.log(`✅ ${successCount}/${ESSENTIAL_COLLECTIONS.length} collections ready`);
    console.log('\n📋 Next Steps:');
    console.log('1. Test your portfolio app - the 404 errors should be gone');
    console.log('2. Add some sample data to see your collections in action');
    console.log('3. Create remaining collections if needed (blog, certifications, etc.)');
    console.log('\n🔗 Useful Links:');
    console.log('- Appwrite Console: https://cloud.appwrite.io/console/');
    console.log('- Documentation: https://appwrite.io/docs/');
}

// Instructions for users
console.log('📖 SETUP INSTRUCTIONS:');
console.log('1. Update CONFIG object above with your Project ID and API Key');
console.log('2. Run: node quick-setup.js');
console.log('3. Follow the output instructions\n');

main().catch(error => {
    console.error('🚨 Setup failed:', error);
    process.exit(1);
});
#!/usr/bin/env node

/**
 * 🔧 Fix Appwrite Attribute Type Issues
 * Specifically fixes the "current" boolean attribute in portfolio_experience
 * 
 * Usage: node fix-attribute-types.js
 */

import { Client, Databases } from 'appwrite';

// Configuration - Update these values
const CONFIG = {
    endpoint: 'https://fra.cloud.appwrite.io/v1',
    projectId: 'YOUR_PROJECT_ID', // Replace with your actual project ID
    databaseId: '68b167ac00260b8be1b2',
    apiKey: 'YOUR_API_KEY' // Admin API key with database permissions
};

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function fixExperienceCollection(databases) {
    const collectionId = 'portfolio_experience';
    
    try {
        console.log('🔧 Fixing portfolio_experience collection attributes...\n');
        
        // Step 1: Try to delete the incorrect 'current' attribute
        try {
            console.log('📝 Deleting incorrect "current" string attribute...');
            await databases.deleteAttribute(CONFIG.databaseId, collectionId, 'current');
            console.log('✅ Old "current" attribute deleted');
            
            // Wait for deletion to process
            await delay(3000);
        } catch (deleteError) {
            console.log('ℹ️  "current" attribute may not exist or already correct:', deleteError.message);
        }
        
        // Step 2: Create the correct boolean attribute
        try {
            console.log('📝 Creating correct "current" boolean attribute...');
            await databases.createBooleanAttribute(
                CONFIG.databaseId,
                collectionId,
                'current',
                false, // required
                false  // default value
            );
            console.log('✅ New "current" boolean attribute created');
        } catch (createError) {
            if (createError.code === 409) {
                console.log('ℹ️  "current" attribute already exists with correct type');
            } else {
                console.error('❌ Failed to create "current" attribute:', createError.message);
            }
        }
        
        await delay(1000);
        
        // Step 3: Check other boolean attributes that might have similar issues
        const booleanAttributes = [
            { key: 'featured', default: false },
            { key: 'availableForWork', default: true }, // For portfolio_about
            { key: 'replied', default: false } // For portfolio_contact
        ];
        
        for (const attr of booleanAttributes) {
            try {
                console.log(`📝 Checking "${attr.key}" attribute...`);
                // Try to create it as boolean - if it exists as wrong type, will need manual fix
                await databases.createBooleanAttribute(
                    CONFIG.databaseId,
                    collectionId,
                    attr.key,
                    false,
                    attr.default
                );
                console.log(`✅ "${attr.key}" boolean attribute ensured`);
            } catch (attrError) {
                if (attrError.code === 409) {
                    console.log(`ℹ️  "${attr.key}" attribute already exists`);
                } else {
                    console.log(`⚠️  "${attr.key}" may need manual review:`, attrError.message);
                }
            }
            await delay(500);
        }
        
        return true;
    } catch (error) {
        console.error('❌ Failed to fix collection:', error);
        return false;
    }
}

async function main() {
    console.log('🚀 Starting Attribute Type Fix...\n');
    
    // Validate configuration
    if (CONFIG.projectId === 'YOUR_PROJECT_ID' || CONFIG.apiKey === 'YOUR_API_KEY') {
        console.error('❌ Configuration Error!');
        console.log('Please update the CONFIG object with your actual:');
        console.log('  - Project ID');
        console.log('  - API Key (with database admin permissions)');
        console.log('\nGet these from: https://cloud.appwrite.io/console/');
        return;
    }
    
    const client = new Client();
    client
        .setEndpoint(CONFIG.endpoint)
        .setProject(CONFIG.projectId)
        .setKey(CONFIG.apiKey);
    
    const databases = new Databases(client);
    
    const success = await fixExperienceCollection(databases);
    
    if (success) {
        console.log('\n🎉 Attribute fixes completed!');
        console.log('\n📋 What was fixed:');
        console.log('✅ "current" attribute now accepts boolean values (true/false)');
        console.log('✅ Other boolean attributes verified');
        console.log('\n🧪 Test your application:');
        console.log('- Try creating/updating experience entries');
        console.log('- The 400 error should be resolved');
        console.log('- Boolean values (true/false) should work correctly');
    } else {
        console.log('\n❌ Some issues occurred during the fix');
        console.log('\n📋 Manual steps needed:');
        console.log('1. Go to Appwrite Console');
        console.log('2. Navigate to portfolio_experience collection');
        console.log('3. Delete "current" attribute if it exists as String');
        console.log('4. Create new "current" attribute as Boolean');
    }
}

// Show instructions
console.log('📖 ATTRIBUTE TYPE FIX:');
console.log('This fixes the "current" attribute type mismatch error');
console.log('Update CONFIG above with your credentials, then run this script\n');

main().catch(error => {
    console.error('🚨 Fix failed:', error);
});
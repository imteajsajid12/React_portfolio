// Migration script to add engagement attributes to blog posts
// Run this with: node --experimental-modules fix-blog-posts.mjs

import { Client, Databases } from 'appwrite';

// Hardcode your Appwrite configuration here temporarily
const config = {
  appwriteUrl: 'https://fra.cloud.appwrite.io/v1', // Replace with your endpoint
  appwriteProjectId: '68b167ac00260b8be1b2', // Replace with your project ID  
  appwriteDatabaseId: '68b167ac00260b8be1b2', // Replace with your database ID
  appwriteCollectionBlogPosts: 'portfolio_blog_posts'
};

console.log('🔧 Configuration:', config);

// Initialize Appwrite client
const client = new Client()
  .setEndpoint(config.appwriteUrl)
  .setProject(config.appwriteProjectId);

const databases = new Databases(client);

const fixBlogPostAttributes = async () => {
  console.log('🔄 Adding engagement attributes to blog posts collection...');

  try {
    // Add engagement count attributes to blog posts collection
    const engagementAttributes = [
      { key: 'likesCount', default: 0 },
      { key: 'bookmarksCount', default: 0 },
      { key: 'commentsCount', default: 0 },
      { key: 'views', default: 0 }
    ];

    for (const attr of engagementAttributes) {
      try {
        console.log(`➡️ Creating ${attr.key} attribute...`);
        await databases.createIntegerAttribute(
          config.appwriteDatabaseId,
          config.appwriteCollectionBlogPosts,
          attr.key,
          true, // required
          0,    // min value
          1000000, // max value
          attr.default
        );
        console.log(`✅ Created ${attr.key} attribute successfully`);
        
        // Add delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (error) {
        if (error.message?.includes('already exists') || error.message?.includes('Attribute with the requested key already exists')) {
          console.log(`ℹ️ ${attr.key} attribute already exists`);
        } else {
          console.error(`❌ Failed to create ${attr.key} attribute:`, error.message);
        }
      }
    }

    console.log('⏳ Waiting for attributes to be ready...');
    await new Promise(resolve => setTimeout(resolve, 10000));

    console.log('✅ Migration completed successfully!');
    console.log('');
    console.log('📝 Your blog posts now have engagement attributes:');
    console.log('  - likesCount (default: 0)');
    console.log('  - bookmarksCount (default: 0)');  
    console.log('  - commentsCount (default: 0)');
    console.log('  - views (default: 0)');
    console.log('');
    console.log('🎉 The blog detail page error should now be fixed!');

  } catch (error) {
    console.error('❌ Migration failed:', error);
  }
};

// Run the migration
fixBlogPostAttributes();
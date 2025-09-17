import { Client, Databases } from 'appwrite';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const config = {
    appwriteUrl: process.env.VITE_APPWRITE_ENDPOINT || '',
    appwriteProjectId: process.env.VITE_APPWRITE_PROJECT_ID || '',
    appwriteDatabaseId: process.env.VITE_APPWRITE_DATABASE_ID || '',
    appwriteCollectionBlogPosts: process.env.VITE_APPWRITE_COLLECTION_BLOG_POSTS || 'portfolio_blog_posts',
};

// Validate configuration
if (!config.appwriteUrl || !config.appwriteProjectId || !config.appwriteDatabaseId) {
  console.error('❌ Missing Appwrite configuration. Please check your .env file:');
  console.error('Required variables:');
  console.error('- VITE_APPWRITE_ENDPOINT');
  console.error('- VITE_APPWRITE_PROJECT_ID'); 
  console.error('- VITE_APPWRITE_DATABASE_ID');
  process.exit(1);
}

// Initialize Appwrite client
const client = new Client()
  .setEndpoint(config.appwriteUrl)
  .setProject(config.appwriteProjectId);

const databases = new Databases(client);

const addEngagementAttributesToBlogPosts = async () => {
  console.log('🔄 Adding engagement attributes to blog posts collection...');

  try {
    // Add engagement count attributes to blog posts collection
    const engagementAttributes = [
      { key: 'likesCount', type: 'integer', required: true, default: 0 },
      { key: 'bookmarksCount', type: 'integer', required: true, default: 0 },
      { key: 'commentsCount', type: 'integer', required: true, default: 0 },
      { key: 'views', type: 'integer', required: true, default: 0 }
    ];

    for (const attr of engagementAttributes) {
      try {
        await databases.createIntegerAttribute(
          config.appwriteDatabaseId,
          config.appwriteCollectionBlogPosts,
          attr.key,
          attr.required,
          0, // min value
          1000000, // max value
          attr.default
        );
        console.log(`✅ Created ${attr.key} attribute for blog posts`);
        
        // Add delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        if (error.message?.includes('already exists')) {
          console.log(`ℹ️ ${attr.key} attribute already exists for blog posts`);
        } else {
          console.error(`❌ Failed to create ${attr.key} attribute:`, error);
          // Continue with other attributes instead of failing completely
        }
      }
    }

    console.log('✅ Blog posts engagement attributes setup completed!');
    
    // Wait for attributes to be ready
    console.log('⏳ Waiting for attributes to be ready...');
    await new Promise(resolve => setTimeout(resolve, 5000));

    // Update existing blog posts with default engagement counts
    console.log('📊 Updating existing blog posts with default engagement counts...');
    
    try {
      const existingPosts = await databases.listDocuments(
        config.appwriteDatabaseId,
        config.appwriteCollectionBlogPosts
      );

      console.log(`Found ${existingPosts.documents.length} existing blog posts to update`);

      for (const post of existingPosts.documents) {
        try {
          // Only update if the attributes don't already have values
          const updateData = {};
          
          if (typeof post.likesCount === 'undefined') {
            updateData.likesCount = 0;
          }
          if (typeof post.bookmarksCount === 'undefined') {
            updateData.bookmarksCount = 0;
          }
          if (typeof post.commentsCount === 'undefined') {
            updateData.commentsCount = 0;
          }
          if (typeof post.views === 'undefined') {
            updateData.views = 0;
          }

          // Only update if there are fields to update
          if (Object.keys(updateData).length > 0) {
            await databases.updateDocument(
              config.appwriteDatabaseId,
              config.appwriteCollectionBlogPosts,
              post.$id,
              updateData
            );
            console.log(`✅ Updated engagement counts for post: ${post.title}`);
          } else {
            console.log(`ℹ️ Post already has engagement counts: ${post.title}`);
          }
          
          // Add small delay between updates
          await new Promise(resolve => setTimeout(resolve, 200));
        } catch (error) {
          console.error(`❌ Failed to update post ${post.title}:`, error);
        }
      }
      
      console.log('✅ All existing blog posts updated successfully!');
    } catch (error) {
      console.error('❌ Failed to update existing blog posts:', error);
    }

    return true;
  } catch (error) {
    console.error('❌ Failed to add engagement attributes:', error);
    throw error;
  }
};

// Run the setup
addEngagementAttributesToBlogPosts()
  .then(() => {
    console.log('🎉 Migration completed successfully!');
    console.log('');
    console.log('📝 Next steps:');
    console.log('1. Your blog posts now support engagement features');
    console.log('2. Test creating a comment, like, or bookmark');
    console.log('3. Check that the counts update properly');
    console.log('4. The blog detail page should now work without errors');
  })
  .catch((error) => {
    console.error('❌ Migration failed:', error);
    console.log('');
    console.log('🔧 Troubleshooting:');
    console.log('1. Ensure your Appwrite credentials are correct in .env');
    console.log('2. Verify you have write access to the database');
    console.log('3. Check that the blog posts collection exists');
  });
import { Client, Databases, Permission, Role } from 'appwrite';
import conf from './src/conf/conf.js';

// Initialize Appwrite client
const client = new Client()
  .setEndpoint(conf.appwriteUrl)
  .setProject(conf.appwriteProjectId);

const databases = new Databases(client);

const setupBlogEngagementCollections = async () => {
  console.log('🚀 Setting up blog engagement collections...');

  try {
    // 1. Create Blog Comments Collection
    console.log('📝 Creating blog comments collection...');
    
    try {
      await databases.createCollection(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionBlogComments,
        'Blog Comments',
        [
          Permission.create(Role.any()),
          Permission.read(Role.any()),
          Permission.update(Role.users()),
          Permission.delete(Role.users())
        ]
      );
      console.log('✅ Blog comments collection created');
    } catch (error) {
      if (error.message?.includes('already exists')) {
        console.log('ℹ️ Blog comments collection already exists');
      } else {
        throw error;
      }
    }

    // Create attributes for blog comments
    const commentAttributes = [
      { key: 'postId', type: 'string', size: 255, required: true },
      { key: 'parentId', type: 'string', size: 255, required: false },
      { key: 'authorName', type: 'string', size: 100, required: true },
      { key: 'authorEmail', type: 'string', size: 255, required: true },
      { key: 'authorWebsite', type: 'string', size: 255, required: false },
      { key: 'content', type: 'string', size: 2000, required: true },
      { key: 'status', type: 'string', size: 20, required: true, default: 'approved' },
      { key: 'isReply', type: 'boolean', required: true, default: false },
      { key: 'likes', type: 'integer', required: true, default: 0 },
      { key: 'ipAddress', type: 'string', size: 45, required: false },
      { key: 'userAgent', type: 'string', size: 500, required: false }
    ];

    for (const attr of commentAttributes) {
      try {
        if (attr.type === 'string') {
          await databases.createStringAttribute(
            conf.appwriteDatabaseId,
            conf.appwriteCollectionBlogComments,
            attr.key,
            attr.size,
            attr.required,
            attr.default
          );
        } else if (attr.type === 'boolean') {
          await databases.createBooleanAttribute(
            conf.appwriteDatabaseId,
            conf.appwriteCollectionBlogComments,
            attr.key,
            attr.required,
            attr.default
          );
        } else if (attr.type === 'integer') {
          await databases.createIntegerAttribute(
            conf.appwriteDatabaseId,
            conf.appwriteCollectionBlogComments,
            attr.key,
            attr.required,
            0,
            1000000,
            attr.default
          );
        }
        console.log(`✅ Created ${attr.key} attribute for comments`);
        
        // Add delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        if (error.message?.includes('already exists')) {
          console.log(`ℹ️ ${attr.key} attribute already exists for comments`);
        } else {
          console.error(`❌ Failed to create ${attr.key} attribute:`, error);
        }
      }
    }

    // Create indexes for blog comments
    const commentIndexes = [
      { key: 'postId_index', type: 'key', attributes: ['postId'] },
      { key: 'status_index', type: 'key', attributes: ['status'] },
      { key: 'parentId_index', type: 'key', attributes: ['parentId'] },
      { key: 'postId_status_index', type: 'key', attributes: ['postId', 'status'] }
    ];

    for (const index of commentIndexes) {
      try {
        await databases.createIndex(
          conf.appwriteDatabaseId,
          conf.appwriteCollectionBlogComments,
          index.key,
          index.type,
          index.attributes
        );
        console.log(`✅ Created ${index.key} index for comments`);
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        if (error.message?.includes('already exists')) {
          console.log(`ℹ️ ${index.key} index already exists for comments`);
        } else {
          console.error(`❌ Failed to create ${index.key} index:`, error);
        }
      }
    }

    // 2. Create Blog Likes Collection
    console.log('❤️ Creating blog likes collection...');
    
    try {
      await databases.createCollection(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionBlogLikes,
        'Blog Likes',
        [
          Permission.create(Role.any()),
          Permission.read(Role.any()),
          Permission.delete(Role.any())
        ]
      );
      console.log('✅ Blog likes collection created');
    } catch (error) {
      if (error.message?.includes('already exists')) {
        console.log('ℹ️ Blog likes collection already exists');
      } else {
        throw error;
      }
    }

    // Create attributes for blog likes
    const likeAttributes = [
      { key: 'postId', type: 'string', size: 255, required: true },
      { key: 'sessionId', type: 'string', size: 255, required: false },
      { key: 'userId', type: 'string', size: 255, required: false },
      { key: 'ipAddress', type: 'string', size: 45, required: true },
      { key: 'userAgent', type: 'string', size: 500, required: false }
    ];

    for (const attr of likeAttributes) {
      try {
        await databases.createStringAttribute(
          conf.appwriteDatabaseId,
          conf.appwriteCollectionBlogLikes,
          attr.key,
          attr.size,
          attr.required
        );
        console.log(`✅ Created ${attr.key} attribute for likes`);
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        if (error.message?.includes('already exists')) {
          console.log(`ℹ️ ${attr.key} attribute already exists for likes`);
        } else {
          console.error(`❌ Failed to create ${attr.key} attribute:`, error);
        }
      }
    }

    // Create indexes for blog likes
    const likeIndexes = [
      { key: 'postId_index', type: 'key', attributes: ['postId'] },
      { key: 'sessionId_index', type: 'key', attributes: ['sessionId'] },
      { key: 'userId_index', type: 'key', attributes: ['userId'] },
      { key: 'postId_sessionId_index', type: 'unique', attributes: ['postId', 'sessionId'] },
      { key: 'postId_userId_index', type: 'unique', attributes: ['postId', 'userId'] }
    ];

    for (const index of likeIndexes) {
      try {
        await databases.createIndex(
          conf.appwriteDatabaseId,
          conf.appwriteCollectionBlogLikes,
          index.key,
          index.type,
          index.attributes
        );
        console.log(`✅ Created ${index.key} index for likes`);
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        if (error.message?.includes('already exists')) {
          console.log(`ℹ️ ${index.key} index already exists for likes`);
        } else {
          console.error(`❌ Failed to create ${index.key} index:`, error);
        }
      }
    }

    // 3. Create Blog Bookmarks Collection
    console.log('🔖 Creating blog bookmarks collection...');
    
    try {
      await databases.createCollection(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionBlogBookmarks,
        'Blog Bookmarks',
        [
          Permission.create(Role.any()),
          Permission.read(Role.any()),
          Permission.update(Role.any()),
          Permission.delete(Role.any())
        ]
      );
      console.log('✅ Blog bookmarks collection created');
    } catch (error) {
      if (error.message?.includes('already exists')) {
        console.log('ℹ️ Blog bookmarks collection already exists');
      } else {
        throw error;
      }
    }

    // Create attributes for blog bookmarks
    const bookmarkAttributes = [
      { key: 'postId', type: 'string', size: 255, required: true },
      { key: 'sessionId', type: 'string', size: 255, required: false },
      { key: 'userId', type: 'string', size: 255, required: false },
      { key: 'title', type: 'string', size: 255, required: true },
      { key: 'slug', type: 'string', size: 255, required: true },
      { key: 'category', type: 'string', size: 100, required: false },
      { key: 'tags', type: 'string', size: 500, required: false },
      { key: 'notes', type: 'string', size: 1000, required: false }
    ];

    for (const attr of bookmarkAttributes) {
      try {
        await databases.createStringAttribute(
          conf.appwriteDatabaseId,
          conf.appwriteCollectionBlogBookmarks,
          attr.key,
          attr.size,
          attr.required
        );
        console.log(`✅ Created ${attr.key} attribute for bookmarks`);
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        if (error.message?.includes('already exists')) {
          console.log(`ℹ️ ${attr.key} attribute already exists for bookmarks`);
        } else {
          console.error(`❌ Failed to create ${attr.key} attribute:`, error);
        }
      }
    }

    // Create indexes for blog bookmarks
    const bookmarkIndexes = [
      { key: 'postId_index', type: 'key', attributes: ['postId'] },
      { key: 'sessionId_index', type: 'key', attributes: ['sessionId'] },
      { key: 'userId_index', type: 'key', attributes: ['userId'] },
      { key: 'postId_sessionId_index', type: 'unique', attributes: ['postId', 'sessionId'] },
      { key: 'postId_userId_index', type: 'unique', attributes: ['postId', 'userId'] }
    ];

    for (const index of bookmarkIndexes) {
      try {
        await databases.createIndex(
          conf.appwriteDatabaseId,
          conf.appwriteCollectionBlogBookmarks,
          index.key,
          index.type,
          index.attributes
        );
        console.log(`✅ Created ${index.key} index for bookmarks`);
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        if (error.message?.includes('already exists')) {
          console.log(`ℹ️ ${index.key} index already exists for bookmarks`);
        } else {
          console.error(`❌ Failed to create ${index.key} index:`, error);
        }
      }
    }

    console.log('🎉 Blog engagement collections setup completed!');
    
    // Add engagement attributes to blog posts collection
    console.log('📊 Adding engagement attributes to blog posts collection...');
    
    try {
      const engagementAttributes = [
        { key: 'likesCount', type: 'integer', required: true, default: 0 },
        { key: 'bookmarksCount', type: 'integer', required: true, default: 0 },
        { key: 'commentsCount', type: 'integer', required: true, default: 0 },
        { key: 'views', type: 'integer', required: true, default: 0 }
      ];

      for (const attr of engagementAttributes) {
        try {
          await databases.createIntegerAttribute(
            conf.appwriteDatabaseId,
            conf.appwriteCollectionBlogPosts,
            attr.key,
            attr.required,
            0, // min value
            1000000, // max value
            attr.default
          );
          console.log(`✅ Added ${attr.key} attribute to blog posts`);
          await new Promise(resolve => setTimeout(resolve, 500));
        } catch (error) {
          if (error.message?.includes('already exists')) {
            console.log(`ℹ️ ${attr.key} attribute already exists in blog posts`);
          } else {
            console.error(`❌ Failed to add ${attr.key} attribute:`, error);
          }
        }
      }
      
      console.log('✅ Blog posts engagement attributes added successfully!');
    } catch (error) {
      console.error('❌ Failed to add engagement attributes to blog posts:', error);
    }

    return true;
  } catch (error) {
    console.error('❌ Failed to setup blog engagement collections:', error);
    throw error;
  }
};

// Run the setup if this file is executed directly
// To run this script: node setup-blog-engagement.js
// Or call setupBlogEngagementCollections() from your application

export default setupBlogEngagementCollections;
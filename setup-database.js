import dotenv from 'dotenv';
import { Client, Databases, Storage, Permission, Role } from 'appwrite';

// Load environment variables
dotenv.config();

console.log('🚀 Starting database setup...');

// Configuration
const config = {
    appwriteUrl: process.env.VITE_APPWRITE_ENDPOINT,
    appwriteProjectId: process.env.VITE_APPWRITE_PROJECT_ID,
    appwriteDatabaseId: process.env.VITE_APPWRITE_DATABASE_ID,
    appwriteCollectionProjects: process.env.VITE_APPWRITE_COLLECTION_PROJECTS || 'portfolio_projects',
    appwriteCollectionSkills: process.env.VITE_APPWRITE_COLLECTION_SKILLS || 'portfolio_skills',
    appwriteCollectionExperience: process.env.VITE_APPWRITE_COLLECTION_EXPERIENCE || 'portfolio_experience',
    appwriteCollectionAbout: process.env.VITE_APPWRITE_COLLECTION_ABOUT || 'portfolio_about',
    appwriteCollectionContact: process.env.VITE_APPWRITE_COLLECTION_CONTACT || 'portfolio_contact',
    appwriteCollectionCertifications: process.env.VITE_APPWRITE_COLLECTION_CERTIFICATIONS || 'portfolio_certifications',
    appwriteCollectionBlogCategories: process.env.VITE_APPWRITE_COLLECTION_BLOG_CATEGORIES || 'portfolio_blog_categories',
    appwriteCollectionBlogPosts: process.env.VITE_APPWRITE_COLLECTION_BLOG_POSTS || 'portfolio_blog_posts',
    appwriteCollectionBlogComments: process.env.VITE_APPWRITE_COLLECTION_BLOG_COMMENTS || 'portfolio_blog_comments',
    appwriteCollectionBlogLikes: process.env.VITE_APPWRITE_COLLECTION_BLOG_LIKES || 'portfolio_blog_likes',
    appwriteCollectionBlogBookmarks: process.env.VITE_APPWRITE_COLLECTION_BLOG_BOOKMARKS || 'portfolio_blog_bookmarks',
    appwriteBucketId: process.env.VITE_APPWRITE_STORAGE_BUCKET,
};

// Database setup function
const setupDatabase = async () => {
  try {
    const client = new Client();
    client
      .setEndpoint(config.appwriteUrl)
      .setProject(config.appwriteProjectId);

    const databases = new Databases(client);
    const storage = new Storage(client);

    console.log('📊 Database ID:', config.appwriteDatabaseId);
    console.log('🏢 Project ID:', config.appwriteProjectId);
    console.log('🌐 Endpoint:', config.appwriteUrl);

    // Collection schemas
    const collections = [
      {
        id: config.appwriteCollectionProjects,
        name: 'Projects',
        attributes: [
          { key: 'title', type: 'string', size: 255, required: true },
          { key: 'description', type: 'string', size: 1000, required: true },
          { key: 'technologies', type: 'string', size: 1000, required: false, array: true },
          { key: 'image', type: 'string', size: 255, required: false },
          { key: 'demoUrl', type: 'string', size: 500, required: false },
          { key: 'githubUrl', type: 'string', size: 500, required: false },
          { key: 'featured', type: 'boolean', required: false, default: false },
          { key: 'status', type: 'string', size: 50, required: false, default: 'active' },
          { key: 'order', type: 'integer', required: false, default: 0 }
        ]
      },
      {
        id: config.appwriteCollectionSkills,
        name: 'Skills',
        attributes: [
          { key: 'name', type: 'string', size: 100, required: true },
          { key: 'category', type: 'string', size: 50, required: true },
          { key: 'proficiency', type: 'integer', required: false, default: 50 },
          { key: 'icon', type: 'string', size: 1000, required: false },
          { key: 'color', type: 'string', size: 20, required: false, default: '#3B82F6' },
          { key: 'order', type: 'integer', required: false, default: 0 },
          { key: 'status', type: 'string', size: 50, required: false, default: 'active' }
        ]
      },
      {
        id: config.appwriteCollectionExperience,
        name: 'Experience',
        attributes: [
          { key: 'company', type: 'string', size: 255, required: true },
          { key: 'position', type: 'string', size: 255, required: true },
          { key: 'startDate', type: 'string', size: 20, required: true },
          { key: 'endDate', type: 'string', size: 20, required: false },
          { key: 'current', type: 'boolean', required: false, default: false },
          { key: 'description', type: 'string', size: 1000, required: false, array: true },
          { key: 'technologies', type: 'string', size: 1000, required: false, array: true },
          { key: 'location', type: 'string', size: 255, required: false },
          { key: 'companyLogo', type: 'string', size: 255, required: false },
          { key: 'order', type: 'integer', required: false, default: 0 },
          { key: 'status', type: 'string', size: 50, required: false, default: 'active' }
        ]
      },
      {
        id: config.appwriteCollectionBlogCategories,
        name: 'Blog Categories',
        attributes: [
          { key: 'name', type: 'string', size: 255, required: true },
          { key: 'slug', type: 'string', size: 255, required: true },
          { key: 'description', type: 'string', size: 1000, required: false },
          { key: 'color', type: 'string', size: 20, required: false, default: '#3B82F6' },
          { key: 'icon', type: 'string', size: 100, required: false },
          { key: 'status', type: 'string', size: 50, required: false, default: 'active' },
          { key: 'order', type: 'integer', required: false, default: 0 }
        ]
      },
      {
        id: config.appwriteCollectionBlogPosts,
        name: 'Blog Posts',
        attributes: [
          { key: 'title', type: 'string', size: 255, required: true },
          { key: 'slug', type: 'string', size: 255, required: true },
          { key: 'excerpt', type: 'string', size: 500, required: false },
          { key: 'content', type: 'string', size: 50000, required: true },
          { key: 'featuredImage', type: 'string', size: 255, required: false },
          { key: 'categoryId', type: 'string', size: 255, required: true },
          { key: 'tags', type: 'string', size: 1000, required: false, array: true },
          { key: 'status', type: 'string', size: 50, required: false, default: 'draft' },
          { key: 'featured', type: 'boolean', required: false, default: false },
          { key: 'readTime', type: 'integer', required: false, default: 5 },
          { key: 'views', type: 'integer', required: false, default: 0 },
          { key: 'likes', type: 'integer', required: false, default: 0 },
          { key: 'commentsCount', type: 'integer', required: false, default: 0 },
          { key: 'bookmarksCount', type: 'integer', required: false, default: 0 },
          { key: 'publishedAt', type: 'string', size: 50, required: false },
          { key: 'updatedAt', type: 'string', size: 50, required: false },
          { key: 'author', type: 'string', size: 255, required: false },
          { key: 'authorImage', type: 'string', size: 255, required: false },
          { key: 'seoTitle', type: 'string', size: 255, required: false },
          { key: 'seoDescription', type: 'string', size: 500, required: false },
          { key: 'order', type: 'integer', required: false, default: 0 }
        ]
      },
      {
        id: config.appwriteCollectionBlogComments,
        name: 'Blog Comments',
        attributes: [
          { key: 'postId', type: 'string', size: 255, required: true },
          { key: 'parentId', type: 'string', size: 255, required: false },
          { key: 'authorName', type: 'string', size: 255, required: true },
          { key: 'authorEmail', type: 'string', size: 255, required: true },
          { key: 'authorWebsite', type: 'string', size: 500, required: false },
          { key: 'content', type: 'string', size: 2000, required: true },
          { key: 'status', type: 'string', size: 50, required: false, default: 'pending' },
          { key: 'likes', type: 'integer', required: false, default: 0 },
          { key: 'isReply', type: 'boolean', required: false, default: false },
          { key: 'ipAddress', type: 'string', size: 50, required: false },
          { key: 'userAgent', type: 'string', size: 500, required: false }
        ]
      },
      {
        id: config.appwriteCollectionBlogLikes,
        name: 'Blog Likes',
        attributes: [
          { key: 'postId', type: 'string', size: 255, required: true },
          { key: 'userId', type: 'string', size: 255, required: false },
          { key: 'sessionId', type: 'string', size: 255, required: true },
          { key: 'ipAddress', type: 'string', size: 50, required: false },
          { key: 'type', type: 'string', size: 20, required: false, default: 'like' }
        ]
      },
      {
        id: config.appwriteCollectionBlogBookmarks,
        name: 'Blog Bookmarks',
        attributes: [
          { key: 'postId', type: 'string', size: 255, required: true },
          { key: 'userId', type: 'string', size: 255, required: false },
          { key: 'sessionId', type: 'string', size: 255, required: true },
          { key: 'ipAddress', type: 'string', size: 50, required: false }
        ]
      }
    ];

    // Create collections
    for (const collection of collections) {
      try {
        console.log(`📝 Creating collection: ${collection.name} (ID: ${collection.id})`);

        await databases.createCollection(
          config.appwriteDatabaseId,
          collection.id,
          collection.name,
          [
            Permission.read(Role.any()),
            Permission.create(Role.users()),
            Permission.update(Role.users()),
            Permission.delete(Role.users())
          ],
          false // documentSecurity
        );

        console.log(`✅ Collection ${collection.name} created successfully`);

        // Wait a bit before creating attributes
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Create attributes
        for (const attr of collection.attributes) {
          try {
            if (attr.type === 'string') {
              await databases.createStringAttribute(
                config.appwriteDatabaseId,
                collection.id,
                attr.key,
                attr.size,
                attr.required || false,
                attr.default,
                attr.array || false
              );
            } else if (attr.type === 'integer') {
              await databases.createIntegerAttribute(
                config.appwriteDatabaseId,
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
                config.appwriteDatabaseId,
                collection.id,
                attr.key,
                attr.required || false,
                attr.default,
                attr.array || false
              );
            }

            console.log(`  - Attribute ${attr.key} created`);
            // Small delay between attributes
            await new Promise(resolve => setTimeout(resolve, 200));
          } catch (attrError) {
            console.log(`  - Attribute ${attr.key} already exists or error:`, attrError.message);
          }
        }

      } catch (collectionError) {
        console.log(`Collection ${collection.name} already exists or error:`, collectionError.message);
      }
    }

    console.log('✅ Database setup completed!');
    return { success: true, message: 'Database setup completed successfully' };

  } catch (error) {
    console.error('❌ Database setup failed:', error);
    return { success: false, message: error.message };
  }
};

// Run the setup
setupDatabase().then(result => {
  if (result.success) {
    console.log('🎉 All done! Your collections should now be available.');
  } else {
    console.log('💥 Setup failed:', result.message);
    process.exit(1);
  }
});

import dotenv from 'dotenv';
import { Client, Databases, Storage, Permission, Role } from 'appwrite';

// Load environment variables
dotenv.config();

console.log('🚀 Starting comprehensive database setup...');
console.log('📅 Setup Date:', new Date().toISOString());

// Configuration with validation
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

// Validate required environment variables
const validateConfig = () => {
    const required = ['appwriteUrl', 'appwriteProjectId', 'appwriteDatabaseId'];
    const missing = required.filter(key => !config[key]);
    
    if (missing.length > 0) {
        console.error('❌ Missing required environment variables:', missing);
        console.log('📋 Please check your .env file and ensure these variables are set:');
        missing.forEach(key => console.log(`  - ${key.toUpperCase()}`));
        process.exit(1);
    }
    
    console.log('✅ Configuration validated successfully');
    console.log('📊 Database ID:', config.appwriteDatabaseId);
    console.log('🏢 Project ID:', config.appwriteProjectId);
    console.log('🌐 Endpoint:', config.appwriteUrl);
};

// Delay function for rate limiting
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Enhanced database setup function
const setupDatabase = async () => {
  try {
    validateConfig();
    
    const client = new Client();
    client
      .setEndpoint(config.appwriteUrl)
      .setProject(config.appwriteProjectId);

    const databases = new Databases(client);
    const storage = new Storage(client);

    // Complete collection schemas with all missing collections
    const collections = [
      {
        id: config.appwriteCollectionProjects,
        name: 'Portfolio Projects',
        attributes: [
          { key: 'title', type: 'string', size: 255, required: true },
          { key: 'description', type: 'string', size: 2000, required: true },
          { key: 'shortDescription', type: 'string', size: 500, required: false },
          { key: 'technologies', type: 'string', size: 100, required: false, array: true },
          { key: 'image', type: 'string', size: 500, required: false },
          { key: 'images', type: 'string', size: 500, required: false, array: true },
          { key: 'demoUrl', type: 'string', size: 500, required: false },
          { key: 'githubUrl', type: 'string', size: 500, required: false },
          { key: 'featured', type: 'boolean', required: false, default: false },
          { key: 'status', type: 'string', size: 50, required: false, default: 'active' },
          { key: 'category', type: 'string', size: 100, required: false, default: 'web' },
          { key: 'startDate', type: 'string', size: 50, required: false },
          { key: 'endDate', type: 'string', size: 50, required: false },
          { key: 'client', type: 'string', size: 255, required: false },
          { key: 'order', type: 'integer', required: false, default: 0 },
          { key: 'views', type: 'integer', required: false, default: 0 },
          { key: 'likes', type: 'integer', required: false, default: 0 }
        ]
      },
      {
        id: config.appwriteCollectionSkills,
        name: 'Portfolio Skills',
        attributes: [
          { key: 'name', type: 'string', size: 100, required: true },
          { key: 'category', type: 'string', size: 100, required: true },
          { key: 'proficiency', type: 'integer', required: false, default: 50, min: 0, max: 100 },
          { key: 'icon', type: 'string', size: 2000, required: false },
          { key: 'iconType', type: 'string', size: 50, required: false, default: 'lucide' },
          { key: 'color', type: 'string', size: 20, required: false, default: '#3B82F6' },
          { key: 'description', type: 'string', size: 500, required: false },
          { key: 'yearsOfExperience', type: 'integer', required: false, default: 0 },
          { key: 'order', type: 'integer', required: false, default: 0 },
          { key: 'status', type: 'string', size: 50, required: false, default: 'active' },
          { key: 'featured', type: 'boolean', required: false, default: false }
        ]
      },
      {
        id: config.appwriteCollectionExperience,
        name: 'Portfolio Experience',
        attributes: [
          { key: 'company', type: 'string', size: 255, required: true },
          { key: 'position', type: 'string', size: 255, required: true },
          { key: 'startDate', type: 'string', size: 20, required: true },
          { key: 'endDate', type: 'string', size: 20, required: false },
          { key: 'current', type: 'boolean', required: false, default: false },
          { key: 'description', type: 'string', size: 1000, required: false, array: true },
          { key: 'responsibilities', type: 'string', size: 1000, required: false, array: true },
          { key: 'achievements', type: 'string', size: 1000, required: false, array: true },
          { key: 'technologies', type: 'string', size: 100, required: false, array: true },
          { key: 'location', type: 'string', size: 255, required: false },
          { key: 'locationType', type: 'string', size: 50, required: false, default: 'onsite' },
          { key: 'companyLogo', type: 'string', size: 500, required: false },
          { key: 'companyWebsite', type: 'string', size: 500, required: false },
          { key: 'employmentType', type: 'string', size: 50, required: false, default: 'full-time' },
          { key: 'order', type: 'integer', required: false, default: 0 },
          { key: 'status', type: 'string', size: 50, required: false, default: 'active' },
          { key: 'featured', type: 'boolean', required: false, default: false }
        ]
      },
      {
        id: config.appwriteCollectionAbout,
        name: 'Portfolio About',
        attributes: [
          { key: 'name', type: 'string', size: 255, required: true },
          { key: 'title', type: 'string', size: 255, required: true },
          { key: 'subtitle', type: 'string', size: 500, required: false },
          { key: 'bio', type: 'string', size: 5000, required: false },
          { key: 'shortBio', type: 'string', size: 1000, required: false },
          { key: 'profileImage', type: 'string', size: 500, required: false },
          { key: 'backgroundImage', type: 'string', size: 500, required: false },
          { key: 'resume', type: 'string', size: 500, required: false },
          { key: 'email', type: 'string', size: 255, required: false },
          { key: 'phone', type: 'string', size: 50, required: false },
          { key: 'location', type: 'string', size: 255, required: false },
          { key: 'timezone', type: 'string', size: 100, required: false },
          { key: 'availableForWork', type: 'boolean', required: false, default: true },
          { key: 'socialLinks', type: 'string', size: 2000, required: false },
          { key: 'languages', type: 'string', size: 100, required: false, array: true },
          { key: 'hobbies', type: 'string', size: 100, required: false, array: true },
          { key: 'quote', type: 'string', size: 500, required: false },
          { key: 'status', type: 'string', size: 50, required: false, default: 'active' }
        ]
      },
      {
        id: config.appwriteCollectionContact,
        name: 'Portfolio Contact',
        attributes: [
          { key: 'name', type: 'string', size: 255, required: true },
          { key: 'email', type: 'string', size: 255, required: true },
          { key: 'subject', type: 'string', size: 500, required: false },
          { key: 'message', type: 'string', size: 5000, required: true },
          { key: 'phone', type: 'string', size: 50, required: false },
          { key: 'company', type: 'string', size: 255, required: false },
          { key: 'budget', type: 'string', size: 100, required: false },
          { key: 'timeline', type: 'string', size: 100, required: false },
          { key: 'projectType', type: 'string', size: 100, required: false },
          { key: 'status', type: 'string', size: 50, required: false, default: 'new' },
          { key: 'priority', type: 'string', size: 50, required: false, default: 'medium' },
          { key: 'replied', type: 'boolean', required: false, default: false },
          { key: 'ipAddress', type: 'string', size: 50, required: false },
          { key: 'userAgent', type: 'string', size: 500, required: false },
          { key: 'referrer', type: 'string', size: 500, required: false },
          { key: 'repliedAt', type: 'string', size: 50, required: false },
          { key: 'notes', type: 'string', size: 2000, required: false }
        ]
      },
      {
        id: config.appwriteCollectionCertifications,
        name: 'Portfolio Certifications',
        attributes: [
          { key: 'name', type: 'string', size: 255, required: true },
          { key: 'issuer', type: 'string', size: 255, required: true },
          { key: 'issueDate', type: 'string', size: 20, required: true },
          { key: 'expiryDate', type: 'string', size: 20, required: false },
          { key: 'credentialId', type: 'string', size: 255, required: false },
          { key: 'credentialUrl', type: 'string', size: 500, required: false },
          { key: 'verificationUrl', type: 'string', size: 500, required: false },
          { key: 'image', type: 'string', size: 500, required: false },
          { key: 'badge', type: 'string', size: 500, required: false },
          { key: 'description', type: 'string', size: 1000, required: false },
          { key: 'skills', type: 'string', size: 100, required: false, array: true },
          { key: 'category', type: 'string', size: 100, required: false, default: 'certification' },
          { key: 'level', type: 'string', size: 50, required: false, default: 'intermediate' },
          { key: 'status', type: 'string', size: 50, required: false, default: 'active' },
          { key: 'featured', type: 'boolean', required: false, default: false },
          { key: 'order', type: 'integer', required: false, default: 0 },
          { key: 'score', type: 'string', size: 50, required: false }
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
          { key: 'image', type: 'string', size: 500, required: false },
          { key: 'postCount', type: 'integer', required: false, default: 0 },
          { key: 'status', type: 'string', size: 50, required: false, default: 'active' },
          { key: 'featured', type: 'boolean', required: false, default: false },
          { key: 'order', type: 'integer', required: false, default: 0 }
        ]
      },
      {
        id: config.appwriteCollectionBlogPosts,
        name: 'Blog Posts',
        attributes: [
          { key: 'title', type: 'string', size: 255, required: true },
          { key: 'slug', type: 'string', size: 255, required: true },
          { key: 'excerpt', type: 'string', size: 1000, required: false },
          { key: 'content', type: 'string', size: 50000, required: true },
          { key: 'featuredImage', type: 'string', size: 500, required: false },
          { key: 'categoryId', type: 'string', size: 255, required: true },
          { key: 'tags', type: 'string', size: 100, required: false, array: true },
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
          { key: 'authorImage', type: 'string', size: 500, required: false },
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
          { key: 'authorImage', type: 'string', size: 500, required: false },
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

    console.log(`\n🏗️  Creating ${collections.length} collections...\n`);

    // Create collections with enhanced error handling
    let successCount = 0;
    let skipCount = 0;
    
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
        successCount++;

        // Rate limiting delay
        await delay(2000);

        // Create attributes with better error handling
        console.log(`  🔧 Creating ${collection.attributes.length} attributes...`);
        let attrSuccessCount = 0;
        
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

            console.log(`    ✓ ${attr.key} (${attr.type})`);
            attrSuccessCount++;
            
            // Small delay between attributes
            await delay(300);
            
          } catch (attrError) {
            console.log(`    ⚠️  Attribute ${attr.key} skipped:`, attrError.message);
          }
        }
        
        console.log(`  📊 Created ${attrSuccessCount}/${collection.attributes.length} attributes\n`);

      } catch (collectionError) {
        if (collectionError.code === 409) {
          console.log(`⏭️  Collection ${collection.name} already exists, skipping...\n`);
          skipCount++;
        } else {
          console.log(`❌ Error creating collection ${collection.name}:`, collectionError.message, '\n');
        }
      }
    }

    // Final summary
    console.log('🎉 Database setup completed!');
    console.log(`📈 Summary: ${successCount} created, ${skipCount} skipped, ${collections.length} total`);
    console.log('\n📋 Next steps:');
    console.log('1. Check your Appwrite console to verify collections');
    console.log('2. Test API endpoints from your application');
    console.log('3. Add sample data to test functionality\n');
    
    return { 
      success: true, 
      message: 'Database setup completed successfully',
      stats: { successCount, skipCount, total: collections.length }
    };

  } catch (error) {
    console.error('❌ Database setup failed:', error);
    console.log('\n🔍 Troubleshooting tips:');
    console.log('1. Verify your .env variables are correct');
    console.log('2. Check your Appwrite project permissions');
    console.log('3. Ensure your API key has proper database permissions');
    
    return { success: false, message: error.message };
  }
};

// Run the setup with enhanced logging
console.log('🔧 Environment Check:');
console.log('- Node.js Version:', process.version);
console.log('- Working Directory:', process.cwd());
console.log('- Environment:', process.env.NODE_ENV || 'development');
console.log();

setupDatabase().then(result => {
  if (result.success) {
    console.log('🚀 Setup completed successfully!');
    if (result.stats) {
      console.log(`📊 Collections created: ${result.stats.successCount}`);
      console.log(`⏭️  Collections skipped: ${result.stats.skipCount}`);
    }
  } else {
    console.log('💥 Setup failed:', result.message);
    process.exit(1);
  }
}).catch(err => {
  console.error('🚨 Unexpected error:', err);
  process.exit(1);
});
import { Client, Databases, ID } from 'appwrite';
import conf from '../conf/conf.js';

const client = new Client()
  .setEndpoint(conf.appwriteUrl)
  .setProject(conf.appwriteProjectId);

const databases = new Databases(client);

export const repairBlogCollections = async () => {
  try {
    console.log('🔧 Starting blog collections repair...');

    // Blog Categories Collection Repair
    try {
      console.log('📝 Checking blog categories collection...');
      
      // Try to get the collection first
      try {
        await databases.getCollection(conf.appwriteDatabaseId, 'portfolio_blog_categories');
        console.log('✅ Blog categories collection exists');
      } catch (error) {
        if (error.code === 404) {
          console.log('🆕 Creating blog categories collection...');
          await databases.createCollection(
            conf.appwriteDatabaseId,
            'portfolio_blog_categories',
            'Blog Categories'
          );
        }
      }

      // Add missing attributes
      const categoryAttributes = [
        { key: 'name', type: 'string', size: 255, required: true },
        { key: 'slug', type: 'string', size: 255, required: true },
        { key: 'description', type: 'string', size: 1000, required: false },
        { key: 'color', type: 'string', size: 20, required: false, default: '#3B82F6' },
        { key: 'icon', type: 'string', size: 100, required: false },
        { key: 'status', type: 'string', size: 50, required: false, default: 'active' },
        { key: 'order', type: 'integer', required: false, default: 0 }
      ];

      for (const attr of categoryAttributes) {
        try {
          if (attr.type === 'string') {
            await databases.createStringAttribute(
              conf.appwriteDatabaseId,
              'portfolio_blog_categories',
              attr.key,
              attr.size,
              attr.required,
              attr.default,
              false // array
            );
          } else if (attr.type === 'integer') {
            await databases.createIntegerAttribute(
              conf.appwriteDatabaseId,
              'portfolio_blog_categories',
              attr.key,
              attr.required,
              null, // min
              null, // max
              attr.default
            );
          } else if (attr.type === 'boolean') {
            await databases.createBooleanAttribute(
              conf.appwriteDatabaseId,
              'portfolio_blog_categories',
              attr.key,
              attr.required,
              attr.default
            );
          }
          console.log(`✅ Added attribute: ${attr.key}`);
          // Wait a bit between attribute creations
          await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (error) {
          if (error.code === 409) {
            console.log(`⚠️ Attribute ${attr.key} already exists`);
          } else {
            console.error(`❌ Failed to create attribute ${attr.key}:`, error.message);
          }
        }
      }

    } catch (error) {
      console.error('❌ Error with blog categories collection:', error.message);
    }

    // Blog Posts Collection Repair
    try {
      console.log('📝 Checking blog posts collection...');
      
      // Try to get the collection first
      try {
        await databases.getCollection(conf.appwriteDatabaseId, 'portfolio_blog_posts');
        console.log('✅ Blog posts collection exists');
      } catch (error) {
        if (error.code === 404) {
          console.log('🆕 Creating blog posts collection...');
          await databases.createCollection(
            conf.appwriteDatabaseId,
            'portfolio_blog_posts',
            'Blog Posts'
          );
        }
      }

      // Add missing attributes
      const postAttributes = [
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
        { key: 'publishedAt', type: 'string', size: 50, required: false },
        { key: 'order', type: 'integer', required: false, default: 0 }
      ];

      for (const attr of postAttributes) {
        try {
          if (attr.type === 'string') {
            await databases.createStringAttribute(
              conf.appwriteDatabaseId,
              'portfolio_blog_posts',
              attr.key,
              attr.size,
              attr.required,
              attr.default || null,
              attr.array || false
            );
          } else if (attr.type === 'integer') {
            await databases.createIntegerAttribute(
              conf.appwriteDatabaseId,
              'portfolio_blog_posts',
              attr.key,
              attr.required,
              null, // min
              null, // max
              attr.default
            );
          } else if (attr.type === 'boolean') {
            await databases.createBooleanAttribute(
              conf.appwriteDatabaseId,
              'portfolio_blog_posts',
              attr.key,
              attr.required,
              attr.default
            );
          }
          console.log(`✅ Added attribute: ${attr.key}`);
          // Wait a bit between attribute creations
          await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (error) {
          if (error.code === 409) {
            console.log(`⚠️ Attribute ${attr.key} already exists`);
          } else {
            console.error(`❌ Failed to create attribute ${attr.key}:`, error.message);
          }
        }
      }

    } catch (error) {
      console.error('❌ Error with blog posts collection:', error.message);
    }

    console.log('🎉 Blog collections repair completed!');
    return { success: true, message: 'Blog collections repaired successfully' };

  } catch (error) {
    console.error('❌ Database repair failed:', error);
    return { success: false, message: error.message };
  }
};

export default repairBlogCollections;

import { Client, Databases, Storage, Permission, Role } from 'appwrite';
import conf from '../conf/conf.js';

// Database setup utility
export const setupDatabase = async () => {
  try {
    const client = new Client();
    client
      .setEndpoint(conf.appwriteUrl)
      .setProject(conf.appwriteProjectId);

    const databases = new Databases(client);
    const storage = new Storage(client);

    console.log('Setting up database collections...');

    // Collection schemas
    const collections = [
      {
        id: conf.appwriteCollectionProjects,
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
        id: conf.appwriteCollectionSkills,
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
        id: conf.appwriteCollectionExperience,
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
        id: conf.appwriteCollectionAbout,
        name: 'About',
        attributes: [
          { key: 'name', type: 'string', size: 255, required: true },
          { key: 'title', type: 'string', size: 255, required: true },
          { key: 'bio', type: 'string', size: 2000, required: true },
          { key: 'profileImage', type: 'string', size: 255, required: false },
          { key: 'resume', type: 'string', size: 255, required: false },
          { key: 'location', type: 'string', size: 255, required: false },
          { key: 'email', type: 'string', size: 255, required: false },
          { key: 'phone', type: 'string', size: 50, required: false },
          { key: 'website', type: 'string', size: 255, required: false },
          { key: 'socialLinks', type: 'string', size: 2000, required: false },
          { key: 'status', type: 'string', size: 50, required: false, default: 'active' }
        ]
      },
      {
        id: conf.appwriteCollectionContact,
        name: 'Contact',
        attributes: [
          { key: 'name', type: 'string', size: 255, required: true },
          { key: 'email', type: 'string', size: 255, required: true },
          { key: 'subject', type: 'string', size: 255, required: true },
          { key: 'message', type: 'string', size: 2000, required: true },
          { key: 'status', type: 'string', size: 50, required: false, default: 'unread' },
          { key: 'createdAt', type: 'string', size: 50, required: false }
        ]
      }
    ];

    // Create collections
    for (const collection of collections) {
      try {
        console.log(`Creating collection: ${collection.name}`);
        
        const createdCollection = await databases.createCollection(
          conf.appwriteDatabaseId,
          collection.id,
          collection.name,
          [
            Permission.read(Role.any()),
            Permission.create(Role.users()),
            Permission.update(Role.users()),
            Permission.delete(Role.users())
          ]
        );

        console.log(`Collection ${collection.name} created successfully`);

        // Create attributes
        for (const attr of collection.attributes) {
          try {
            if (attr.type === 'string') {
              await databases.createStringAttribute(
                conf.appwriteDatabaseId,
                collection.id,
                attr.key,
                attr.size,
                attr.required || false,
                attr.default,
                attr.array || false
              );
            } else if (attr.type === 'integer') {
              await databases.createIntegerAttribute(
                conf.appwriteDatabaseId,
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
                conf.appwriteDatabaseId,
                collection.id,
                attr.key,
                attr.required || false,
                attr.default,
                attr.array || false
              );
            }
            
            console.log(`  - Attribute ${attr.key} created`);
          } catch (attrError) {
            console.log(`  - Attribute ${attr.key} already exists or error:`, attrError.message);
          }
        }

      } catch (collectionError) {
        console.log(`Collection ${collection.name} already exists or error:`, collectionError.message);
      }
    }

    // Create storage bucket
    try {
      console.log('Creating storage bucket...');
      const bucket = await storage.createBucket(
        conf.appwriteBucketId,
        'Portfolio Files',
        [
          Permission.read(Role.any()),
          Permission.create(Role.users()),
          Permission.update(Role.users()),
          Permission.delete(Role.users())
        ],
        false, // fileSecurity
        true,  // enabled
        10485760, // maximumFileSize (10MB)
        ['jpg', 'jpeg', 'png', 'gif', 'webp', 'pdf', 'doc', 'docx'], // allowedFileExtensions
        'gzip', // compression
        false,  // encryption
        false   // antivirus
      );
      console.log('Storage bucket created successfully');
    } catch (bucketError) {
      console.log('Storage bucket already exists or error:', bucketError.message);
    }

    console.log('Database setup completed!');
    return { success: true, message: 'Database setup completed successfully' };

  } catch (error) {
    console.error('Database setup failed:', error);
    return { success: false, message: error.message };
  }
};

// Helper function to check database status
export const checkDatabaseStatus = async () => {
  try {
    const client = new Client();
    client
      .setEndpoint(conf.appwriteUrl)
      .setProject(conf.appwriteProjectId);

    const databases = new Databases(client);
    
    const collections = await databases.listCollections(conf.appwriteDatabaseId);
    
    return {
      success: true,
      collections: collections.documents,
      message: `Found ${collections.documents.length} collections`
    };
  } catch (error) {
    return {
      success: false,
      message: error.message
    };
  }
};

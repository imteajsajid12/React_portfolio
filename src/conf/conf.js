const config = {
    // Appwrite Configuration
    appwriteUrl: String(import.meta.env.VITE_APPWRITE_ENDPOINT || ''),
    appwriteProjectId: String(import.meta.env.VITE_APPWRITE_PROJECT_ID || ''),
    appwriteProjectName: String(import.meta.env.VITE_APPWRITE_PROJECT_NAME || ''),
    appwriteDatabaseId: String(import.meta.env.VITE_APPWRITE_DATABASE_ID || ''),

    // Portfolio Collections
    appwriteCollectionProjects: String(import.meta.env.VITE_APPWRITE_COLLECTION_PROJECTS || 'portfolio_projects'),
    appwriteCollectionSkills: String(import.meta.env.VITE_APPWRITE_COLLECTION_SKILLS || 'portfolio_skills'),
    appwriteCollectionExperience: String(import.meta.env.VITE_APPWRITE_COLLECTION_EXPERIENCE || 'portfolio_experience'),
    appwriteCollectionAbout: String(import.meta.env.VITE_APPWRITE_COLLECTION_ABOUT || 'portfolio_about'),
    appwriteCollectionContact: String(import.meta.env.VITE_APPWRITE_COLLECTION_CONTACT || 'portfolio_contact'),

    // Storage
    appwriteBucketId: String(import.meta.env.VITE_APPWRITE_STORAGE_BUCKET || ''),
};

// Debug logging in development
if (import.meta.env.DEV) {
    console.log('🔧 Configuration loaded:', {
        appwriteUrl: config.appwriteUrl,
        appwriteProjectId: config.appwriteProjectId,
        appwriteDatabaseId: config.appwriteDatabaseId,
        appwriteBucketId: config.appwriteBucketId,
        envVars: {
            VITE_APPWRITE_ENDPOINT: import.meta.env.VITE_APPWRITE_ENDPOINT,
            VITE_APPWRITE_PROJECT_ID: import.meta.env.VITE_APPWRITE_PROJECT_ID,
            VITE_APPWRITE_DATABASE_ID: import.meta.env.VITE_APPWRITE_DATABASE_ID,
        }
    });
}

export default config;

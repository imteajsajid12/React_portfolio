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
    appwriteCollectionCertifications: String(import.meta.env.VITE_APPWRITE_COLLECTION_CERTIFICATIONS || 'portfolio_certifications'),
    appwriteCollectionBlogCategories: String(import.meta.env.VITE_APPWRITE_COLLECTION_BLOG_CATEGORIES || 'portfolio_blog_categories'),
    appwriteCollectionBlogPosts: String(import.meta.env.VITE_APPWRITE_COLLECTION_BLOG_POSTS || 'portfolio_blog_posts'),
    appwriteCollectionBlogComments: String(import.meta.env.VITE_APPWRITE_COLLECTION_BLOG_COMMENTS || 'portfolio_blog_comments'),
    appwriteCollectionBlogLikes: String(import.meta.env.VITE_APPWRITE_COLLECTION_BLOG_LIKES || 'portfolio_blog_likes'),
    appwriteCollectionBlogBookmarks: String(import.meta.env.VITE_APPWRITE_COLLECTION_BLOG_BOOKMARKS || 'portfolio_blog_bookmarks'),

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

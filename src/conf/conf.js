const config = {
    appWriteUrl: String(import.meta.env.REACT_APP_APPWRITE_URL),
    appWriteProjectId: String(import.meta.env.REACT_APP_APPWRITE_PROJECT_ID),
    appWriteDatabaseId: String(import.meta.env.REACT_APP_APPWRITE_DATABASE_ID),
    appWriteCollectionId: String(
        import.meta.env.REACT_APP_APPWRITE_COLLECTION_ID
    ),
    appWriteStorageBucket: String(
        import.meta.env.REACT_APP_APPWRITE_STORAGE_BUCKET
    ),
};

export default config;

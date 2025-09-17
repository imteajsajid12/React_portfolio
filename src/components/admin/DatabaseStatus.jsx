import React, { useState, useEffect } from 'react';
import { Client, Databases } from 'appwrite';
import conf from '../../conf/conf';

const DatabaseStatus = () => {
  const [status, setStatus] = useState({ loading: true, collections: [], error: null });

  useEffect(() => {
    checkDatabaseStatus();
  }, []);

  const checkDatabaseStatus = async () => {
    try {
      const client = new Client();
      client
        .setEndpoint(conf.appwriteUrl)
        .setProject(conf.appwriteProjectId);

      const databases = new Databases(client);
      
      const collections = await databases.listCollections(conf.appwriteDatabaseId);
      
      setStatus({
        loading: false,
        collections: collections.documents,
        error: null
      });
    } catch (error) {
      setStatus({
        loading: false,
        collections: [],
        error: error.message
      });
    }
  };

  const requiredCollections = [
    { id: conf.appwriteCollectionProjects, name: 'Projects' },
    { id: conf.appwriteCollectionSkills, name: 'Skills' },
    { id: conf.appwriteCollectionExperience, name: 'Experience' },
    { id: conf.appwriteCollectionBlogCategories, name: 'Blog Categories' },
    { id: conf.appwriteCollectionBlogPosts, name: 'Blog Posts' },
  ];

  const getCollectionStatus = (collectionId) => {
    return status.collections.find(col => col.$id === collectionId);
  };

  if (status.loading) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Database Status</h2>
        <p>Checking database status...</p>
      </div>
    );
  }

  if (status.error) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4 text-red-600">Database Connection Error</h2>
        <p className="text-red-500 mb-4">{status.error}</p>
        <div className="bg-yellow-50 border border-yellow-200 rounded p-4">
          <h3 className="font-semibold text-yellow-800 mb-2">Please check:</h3>
          <ul className="list-disc list-inside text-yellow-700 space-y-1">
            <li>Your Appwrite endpoint URL</li>
            <li>Your project ID</li>
            <li>Your database ID</li>
            <li>Network connectivity</li>
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Database Status</h2>
      
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Configuration:</h3>
        <div className="bg-gray-50 p-3 rounded text-sm">
          <p><strong>Endpoint:</strong> {conf.appwriteUrl}</p>
          <p><strong>Project ID:</strong> {conf.appwriteProjectId}</p>
          <p><strong>Database ID:</strong> {conf.appwriteDatabaseId}</p>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="font-semibold mb-2">Collections Status:</h3>
        <div className="space-y-2">
          {requiredCollections.map((required) => {
            const exists = getCollectionStatus(required.id);
            return (
              <div key={required.id} className="flex items-center justify-between p-3 border rounded">
                <div>
                  <span className="font-medium">{required.name}</span>
                  <span className="text-gray-500 text-sm ml-2">({required.id})</span>
                </div>
                <div className={`px-2 py-1 rounded text-sm ${
                  exists ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {exists ? '✅ Exists' : '❌ Missing'}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mb-4">
        <h3 className="font-semibold mb-2">All Collections ({status.collections.length}):</h3>
        <div className="bg-gray-50 p-3 rounded max-h-40 overflow-y-auto">
          {status.collections.length === 0 ? (
            <p className="text-gray-500">No collections found</p>
          ) : (
            <ul className="space-y-1">
              {status.collections.map((col) => (
                <li key={col.$id} className="text-sm">
                  <span className="font-medium">{col.name}</span>
                  <span className="text-gray-500 ml-2">({col.$id})</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <button
        onClick={checkDatabaseStatus}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Refresh Status
      </button>

      {status.collections.length < requiredCollections.length && (
        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded p-4">
          <h3 className="font-semibold text-yellow-800 mb-2">Missing Collections Detected</h3>
          <p className="text-yellow-700 mb-3">
            Some required collections are missing. You can create them manually in the Appwrite console.
          </p>
          <a
            href={`${conf.appwriteUrl.replace('/v1', '')}/console/project-${conf.appwriteProjectId}/databases/database-${conf.appwriteDatabaseId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700"
          >
            Open Appwrite Console
          </a>
        </div>
      )}
    </div>
  );
};

export default DatabaseStatus;

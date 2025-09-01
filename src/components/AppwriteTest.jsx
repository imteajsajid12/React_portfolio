import React, { useState, useEffect } from 'react';
import { Client, Account, Databases } from 'appwrite';
import conf from '../conf/conf.js';
import { setupDatabase, checkDatabaseStatus } from '../utils/setupDatabase.js';
import { repairBlogCollections } from '../utils/repairDatabase.js';

const AppwriteTest = () => {
  const [connectionStatus, setConnectionStatus] = useState('Testing...');
  const [projectInfo, setProjectInfo] = useState(null);
  const [error, setError] = useState(null);
  const [repairStatus, setRepairStatus] = useState('');
  const [isRepairing, setIsRepairing] = useState(false);

  useEffect(() => {
    testAppwriteConnection();
  }, []);

  const testAppwriteConnection = async () => {
    try {
      // Initialize Appwrite client
      const client = new Client();
      client
        .setEndpoint(conf.appwriteUrl)
        .setProject(conf.appwriteProjectId);

      const account = new Account(client);
      const databases = new Databases(client);

      // Test 1: Check if we can connect to Appwrite
      console.log('Testing Appwrite connection...');
      console.log('Endpoint:', conf.appwriteUrl);
      console.log('Project ID:', conf.appwriteProjectId);
      console.log('Database ID:', conf.appwriteDatabaseId);

      // Test 2: Try to get account (this will fail if not logged in, but connection works)
      try {
        const user = await account.get();
        console.log('Current user:', user);
        setProjectInfo(prev => ({ ...prev, user }));
      } catch (userError) {
        console.log('No user logged in (expected):', userError.message);
      }

      // Test 3: Try to list collections (this tests database connection)
      try {
        const collections = await databases.listCollections(conf.appwriteDatabaseId);
        console.log('Available collections:', collections);
        setProjectInfo(prev => ({ ...prev, collections: collections.documents }));
      } catch (dbError) {
        console.log('Database error:', dbError.message);
        setError(`Database connection failed: ${dbError.message}`);
      }

      setConnectionStatus('Connected successfully!');
    } catch (err) {
      console.error('Appwrite connection failed:', err);
      setError(err.message);
      setConnectionStatus('Connection failed');
    }
  };

  const createTestAdmin = async () => {
    try {
      const client = new Client();
      client
        .setEndpoint(conf.appwriteUrl)
        .setProject(conf.appwriteProjectId);

      const account = new Account(client);

      // Create admin account
      const response = await account.create(
        'unique()', // Auto-generated ID
        'admin@imteaj.dev',
        'admin123',
        'Admin User'
      );

      console.log('Admin account created:', response);
      alert('Admin account created successfully! Email: admin@imteaj.dev, Password: admin123');
    } catch (err) {
      console.error('Failed to create admin:', err);
      alert(`Failed to create admin: ${err.message}`);
    }
  };

  const testLogin = async () => {
    try {
      const client = new Client();
      client
        .setEndpoint(conf.appwriteUrl)
        .setProject(conf.appwriteProjectId);

      const account = new Account(client);

      // Check if already logged in first
      try {
        const currentUser = await account.get();
        console.log('Already logged in:', currentUser);
        alert('Already logged in! User: ' + currentUser.name);
        return;
      } catch (notLoggedInError) {
        console.log('Not logged in, proceeding with login test...');
      }

      // Test login with correct method name
      console.log('Testing login...');
      const session = await account.createEmailPasswordSession('admin@imteaj.dev', 'admin123');
      console.log('Login successful:', session);
      alert('Login test successful!');

      // Get current user
      const user = await account.get();
      console.log('Current user:', user);

    } catch (err) {
      console.error('Login test failed:', err);

      if (err.code === 429) {
        alert('Rate limit exceeded. Please wait 1-2 minutes before trying again.');
      } else if (err.code === 401) {
        alert('Invalid credentials. Please check email/password.');
      } else {
        alert(`Login test failed: ${err.message}`);
      }
    }
  };

  const testLogout = async () => {
    try {
      const client = new Client();
      client
        .setEndpoint(conf.appwriteUrl)
        .setProject(conf.appwriteProjectId);

      const account = new Account(client);

      // Logout current session
      await account.deleteSession('current');
      console.log('Logout successful');
      alert('Logout successful! You can now test login again.');

    } catch (err) {
      console.error('Logout failed:', err);
      alert(`Logout failed: ${err.message}`);
    }
  };

  const setupDatabaseCollections = async () => {
    try {
      setConnectionStatus('Setting up database...');
      const result = await setupDatabase();

      if (result.success) {
        setConnectionStatus('Database setup completed!');
        alert('Database collections created successfully!');
        // Refresh connection test
        await testAppwriteConnection();
      } else {
        setError(result.message);
        setConnectionStatus('Database setup failed');
      }
    } catch (err) {
      console.error('Database setup failed:', err);
      setError(err.message);
      setConnectionStatus('Database setup failed');
    }
  };

  const repairBlogDatabase = async () => {
    try {
      setIsRepairing(true);
      setRepairStatus('Repairing blog collections...');

      const result = await repairBlogCollections();

      if (result.success) {
        setRepairStatus('Blog collections repaired successfully!');
        alert('Blog collections repaired successfully! You can now create blog categories and posts.');
      } else {
        setRepairStatus('Blog repair failed!');
        alert(`Blog repair failed: ${result.message}`);
      }
    } catch (err) {
      console.error('Blog repair failed:', err);
      setRepairStatus('Blog repair failed!');
      alert(`Blog repair failed: ${err.message}`);
    } finally {
      setIsRepairing(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Appwrite Connection Test</h1>
      
      {/* Connection Status */}
      <div className="mb-6 p-4 rounded-lg border">
        <h2 className="text-lg font-semibold mb-2">Connection Status</h2>
        <p className={`font-medium ${connectionStatus.includes('success') ? 'text-green-600' : connectionStatus.includes('failed') ? 'text-red-600' : 'text-yellow-600'}`}>
          {connectionStatus}
        </p>
        {error && (
          <p className="text-red-600 mt-2">Error: {error}</p>
        )}
        {repairStatus && (
          <p className={`mt-2 font-medium ${repairStatus.includes('success') ? 'text-green-600' : repairStatus.includes('failed') ? 'text-red-600' : 'text-blue-600'}`}>
            {repairStatus}
          </p>
        )}
      </div>

      {/* Configuration */}
      <div className="mb-6 p-4 rounded-lg border bg-gray-50">
        <h2 className="text-lg font-semibold mb-2">Configuration</h2>
        <div className="space-y-1 text-sm">
          <p><strong>Endpoint:</strong> {conf.appwriteUrl}</p>
          <p><strong>Project ID:</strong> {conf.appwriteProjectId}</p>
          <p><strong>Database ID:</strong> {conf.appwriteDatabaseId}</p>
          <p><strong>Storage Bucket:</strong> {conf.appwriteBucketId}</p>
        </div>
      </div>

      {/* Collections Info */}
      {projectInfo?.collections && (
        <div className="mb-6 p-4 rounded-lg border bg-blue-50">
          <h2 className="text-lg font-semibold mb-2">Available Collections</h2>
          <div className="space-y-2">
            {projectInfo.collections.map((collection) => (
              <div key={collection.$id} className="text-sm">
                <strong>{collection.name}</strong> (ID: {collection.$id})
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Current User */}
      {projectInfo?.user && (
        <div className="mb-6 p-4 rounded-lg border bg-green-50">
          <h2 className="text-lg font-semibold mb-2">Current User</h2>
          <div className="space-y-1 text-sm">
            <p><strong>Name:</strong> {projectInfo.user.name}</p>
            <p><strong>Email:</strong> {projectInfo.user.email}</p>
            <p><strong>ID:</strong> {projectInfo.user.$id}</p>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="space-y-4">
        <div className="flex flex-wrap gap-4">
          <button
            onClick={testAppwriteConnection}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Test Connection Again
          </button>

          <button
            onClick={setupDatabaseCollections}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Setup Database Collections
          </button>

          <button
            onClick={repairBlogDatabase}
            disabled={isRepairing}
            className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:bg-orange-400 disabled:cursor-not-allowed"
          >
            {isRepairing ? 'Repairing...' : 'Repair Blog Collections'}
          </button>

          <button
            onClick={createTestAdmin}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Create Test Admin Account
          </button>

          <button
            onClick={testLogin}
            className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
          >
            Test Login
          </button>

          <button
            onClick={testLogout}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Test Logout
          </button>
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-8 p-4 rounded-lg border bg-yellow-50">
        <h2 className="text-lg font-semibold mb-2">Setup Instructions</h2>
        <ol className="list-decimal list-inside space-y-2 text-sm">
          <li><strong>Test Connection:</strong> Verify Appwrite connection is working</li>
          <li><strong>Setup Database:</strong> Create all required collections automatically</li>
          <li><strong>Create Admin:</strong> Create an admin user account for login</li>
          <li><strong>Test Login API:</strong> Test login functionality directly with Appwrite</li>
          <li><strong>Test Login Page:</strong> Navigate to <code className="bg-gray-200 px-1 rounded">/React_portfolio/admin/login</code></li>
          <li><strong>Login Credentials:</strong> admin@imteaj.dev / admin123</li>
        </ol>

        <div className="mt-4 p-3 bg-blue-50 rounded border-l-4 border-blue-400">
          <p className="text-sm"><strong>Note:</strong> Make sure your Appwrite project has the correct permissions and your .env file is properly configured.</p>
        </div>
      </div>
    </div>
  );
};

export default AppwriteTest;

import React from 'react';
import DatabaseStatus from '../components/admin/DatabaseStatus';

const AdminPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>
        
        <div className="space-y-6">
          <DatabaseStatus />
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Manual Collection Creation Guide</h2>
            
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded p-4">
                <h3 className="font-semibold text-blue-800 mb-2">Step 1: Access Appwrite Console</h3>
                <p className="text-blue-700 mb-2">
                  Go to your Appwrite console and navigate to your database.
                </p>
              </div>

              <div className="bg-green-50 border border-green-200 rounded p-4">
                <h3 className="font-semibold text-green-800 mb-2">Step 2: Create Missing Collections</h3>
                <p className="text-green-700 mb-3">
                  Create the following collections with these exact IDs:
                </p>
                <ul className="list-disc list-inside text-green-700 space-y-1 text-sm">
                  <li><strong>portfolio_skills</strong> - Skills collection</li>
                  <li><strong>portfolio_experience</strong> - Experience collection</li>
                  <li><strong>portfolio_blog_categories</strong> - Blog Categories collection</li>
                  <li><strong>portfolio_blog_posts</strong> - Blog Posts collection</li>
                </ul>
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded p-4">
                <h3 className="font-semibold text-purple-800 mb-2">Step 3: Add Required Attributes</h3>
                <p className="text-purple-700 mb-2">
                  For each collection, add these attributes:
                </p>
                
                <div className="space-y-3 text-sm">
                  <div className="bg-white p-3 rounded border">
                    <h4 className="font-medium mb-2">Skills Collection:</h4>
                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                      <li>name (string, 100, required)</li>
                      <li>category (string, 50, required)</li>
                      <li>proficiency (integer, optional, default: 50)</li>
                      <li>icon (string, 1000, optional)</li>
                      <li>color (string, 20, optional, default: '#3B82F6')</li>
                      <li>order (integer, optional, default: 0)</li>
                      <li>status (string, 50, optional, default: 'active')</li>
                    </ul>
                  </div>

                  <div className="bg-white p-3 rounded border">
                    <h4 className="font-medium mb-2">Experience Collection:</h4>
                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                      <li>company (string, 255, required)</li>
                      <li>position (string, 255, required)</li>
                      <li>startDate (string, 20, required)</li>
                      <li>endDate (string, 20, optional)</li>
                      <li>current (boolean, optional, default: false)</li>
                      <li>description (string array, 1000, optional)</li>
                      <li>technologies (string array, 1000, optional)</li>
                      <li>location (string, 255, optional)</li>
                      <li>companyLogo (string, 255, optional)</li>
                      <li>order (integer, optional, default: 0)</li>
                      <li>status (string, 50, optional, default: 'active')</li>
                    </ul>
                  </div>

                  <div className="bg-white p-3 rounded border">
                    <h4 className="font-medium mb-2">Blog Categories Collection:</h4>
                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                      <li>name (string, 255, required)</li>
                      <li>slug (string, 255, required)</li>
                      <li>description (string, 1000, optional)</li>
                      <li>color (string, 20, optional, default: '#3B82F6')</li>
                      <li>icon (string, 100, optional)</li>
                      <li>status (string, 50, optional, default: 'active')</li>
                      <li>order (integer, optional, default: 0)</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-orange-50 border border-orange-200 rounded p-4">
                <h3 className="font-semibold text-orange-800 mb-2">Step 4: Set Permissions</h3>
                <p className="text-orange-700">
                  Set permissions to allow read access for "Any" and create/update/delete for "Users".
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;

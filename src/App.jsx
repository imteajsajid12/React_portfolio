import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth.jsx';
import { AdminRoute } from './components/auth/ProtectedRoute';

// Portfolio Components
import Portfolio from './portfolio/Portfolio';
import BlogPage from './components/blog/BlogPage';

// Admin Components
import Login from './components/auth/Login';
import Dashboard from './components/admin/Dashboard';
import DashboardOverview from './components/admin/DashboardOverview';
import ProjectsManager from './components/admin/ProjectsManager';
import SkillsManager from './components/admin/SkillsManager';
import ExperienceManager from './components/admin/ExperienceManager';
import CertificationsManager from './components/admin/CertificationsManager';
import BlogCategoriesManager from './components/admin/BlogCategoriesManager';
import BlogPostsManager from './components/admin/BlogPostsManager';
import AboutManager from './components/admin/AboutManager';
import ContactManager from './components/admin/ContactManager';

// Test Component
import AppwriteTest from './components/AppwriteTest';

// Placeholder components for admin routes (to be implemented)
const SettingsManager = () => <div className="p-6"><h1 className="text-2xl font-bold">Settings Manager</h1><p>Coming soon...</p></div>;

function App() {
  return (
    <Router basename="/React_portfolio">
      <AuthProvider>
        <div className="App">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Portfolio />} />
            <Route path="/blog" element={<BlogPage />} />

            {/* Test Route */}
            <Route path="/test" element={<AppwriteTest />} />

            {/* Admin Routes */}
            <Route path="/admin/login" element={<Login />} />

            {/* Protected Admin Routes */}
            <Route path="/admin" element={
              <AdminRoute>
                <Dashboard />
              </AdminRoute>
            }>
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<DashboardOverview />} />
              <Route path="projects" element={<ProjectsManager />} />
              <Route path="skills" element={<SkillsManager />} />
              <Route path="experience" element={<ExperienceManager />} />
              <Route path="certifications" element={<CertificationsManager />} />
              <Route path="blog-categories" element={<BlogCategoriesManager />} />
              <Route path="blog-posts" element={<BlogPostsManager />} />
              <Route path="about" element={<AboutManager />} />
              <Route path="messages" element={<ContactManager />} />
              <Route path="settings" element={<SettingsManager />} />
            </Route>

            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  FolderOpen,
  Code2,
  Briefcase,
  User,
  Mail,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  Search,
  Eye,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth.jsx';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import PortfolioPreview from './PortfolioPreview';

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true); // Default to true for desktop
  const [isMobile, setIsMobile] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Check if mobile on mount and window resize
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024; // lg breakpoint
      setIsMobile(mobile);
      // On mobile, sidebar should be closed by default
      if (mobile) {
        setSidebarOpen(false);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/admin/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const menuItems = [
    {
      name: 'Dashboard',
      icon: LayoutDashboard,
      path: '/admin/dashboard',
      description: 'Overview and analytics'
    },
    {
      name: 'Projects',
      icon: FolderOpen,
      path: '/admin/projects',
      description: 'Manage portfolio projects'
    },
    {
      name: 'Skills',
      icon: Code2,
      path: '/admin/skills',
      description: 'Manage skills and technologies'
    },
    {
      name: 'Experience',
      icon: Briefcase,
      path: '/admin/experience',
      description: 'Manage work experience'
    },
    {
      name: 'About',
      icon: User,
      path: '/admin/about',
      description: 'Manage personal information'
    },
    {
      name: 'Messages',
      icon: Mail,
      path: '/admin/messages',
      description: 'View contact messages'
    },
    {
      name: 'Settings',
      icon: Settings,
      path: '/admin/settings',
      description: 'System settings'
    }
  ];

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  const sidebarVariants = {
    open: {
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    },
    closed: {
      x: "-100%",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && isMobile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        variants={sidebarVariants}
        animate={sidebarOpen ? "open" : "closed"}
        className={`${
          isMobile
            ? `fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out ${
                sidebarOpen ? 'translate-x-0' : '-translate-x-full'
              }`
            : `${sidebarOpen ? 'w-64' : 'w-16'} bg-white dark:bg-gray-800 shadow-lg transition-all duration-300 ease-in-out flex-shrink-0`
        }`}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700">
          {sidebarOpen && (
            <h1 className="text-lg font-bold text-gray-900 dark:text-white">
              Admin Panel
            </h1>
          )}
          <button
            onClick={isMobile ? () => setSidebarOpen(false) : toggleSidebar}
            className="p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            {isMobile ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* User info */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className={`flex items-center ${!sidebarOpen ? 'justify-center' : ''}`}>
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-white" />
            </div>
            {sidebarOpen && (
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {user?.name || 'Admin User'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {isAdmin ? 'Administrator' : 'User'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4">
          <div className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActiveRoute(item.path);

              return (
                <motion.button
                  key={item.name}
                  onClick={() => {
                    navigate(item.path);
                    if (isMobile) {
                      setSidebarOpen(false);
                    }
                  }}
                  whileHover={{ x: 2 }}
                  className={`w-full flex items-center ${sidebarOpen ? 'px-3' : 'px-2 justify-center'} py-2.5 text-sm font-medium rounded-lg transition-colors ${
                    active
                      ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                  title={!sidebarOpen ? item.name : ''}
                >
                  <Icon className={`h-5 w-5 ${sidebarOpen ? 'mr-3' : ''} ${active ? 'text-blue-600 dark:text-blue-400' : ''}`} />
                  {sidebarOpen && (
                    <div className="text-left">
                      <div className="font-medium">{item.name}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        {item.description}
                      </div>
                    </div>
                  )}
                </motion.button>
              );
            })}
          </div>
        </nav>

        {/* Logout button */}
        <div className="p-3 border-t border-gray-200 dark:border-gray-700">
          <motion.button
            onClick={handleLogout}
            whileHover={{ x: 2 }}
            className={`w-full flex items-center ${sidebarOpen ? 'px-3' : 'px-2 justify-center'} py-2 text-sm font-medium text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors`}
            title={!sidebarOpen ? 'Sign Out' : ''}
          >
            <LogOut className={`h-5 w-5 ${sidebarOpen ? 'mr-3' : ''}`} />
            {sidebarOpen && 'Sign Out'}
          </motion.button>
        </div>
      </motion.aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top header */}
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <div className="flex items-center justify-between h-16 px-6">
            <div className="flex items-center">
              {/* Mobile menu button */}
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Menu className="h-5 w-5" />
              </button>

              {/* Desktop sidebar toggle */}
              <button
                onClick={toggleSidebar}
                className="hidden lg:block p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 mr-4"
              >
                <Menu className="h-5 w-5" />
              </button>

              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Portfolio Management
                </h2>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {/* Search */}
              <div className="hidden md:block">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search..."
                    className="w-64 pl-10 pr-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Notifications */}
              <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                <Bell className="h-5 w-5" />
              </button>

              {/* Preview Portfolio */}
              <button
                onClick={() => setPreviewOpen(true)}
                className="hidden sm:flex items-center px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors"
              >
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </button>

              {/* View Portfolio */}
              <button
                onClick={() => window.open('/', '_blank')}
                className="flex items-center px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Live Site</span>
              </button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>

      {/* Portfolio Preview Modal */}
      <PortfolioPreview
        isOpen={previewOpen}
        onClose={() => setPreviewOpen(false)}
      />
    </div>
  );
};

export default Dashboard;

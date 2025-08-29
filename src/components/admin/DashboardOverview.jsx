import React from 'react';
import { motion } from 'framer-motion';
import {
  FolderOpen,
  Code2,
  Briefcase,
  Mail,
  Eye,
  TrendingUp,
  Users,
  Calendar,
  Activity,
  Plus,
  Settings,
  BarChart3
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useProjects, useSkills, useExperience, useContacts } from '../../hooks/usePortfolio';

const DashboardOverview = () => {
  const navigate = useNavigate();
  const { projects, loading: projectsLoading } = useProjects();
  const { skills, loading: skillsLoading } = useSkills();
  const { experiences, loading: experiencesLoading } = useExperience();
  const { contacts, loading: contactsLoading } = useContacts();

  const stats = [
    {
      name: 'Total Projects',
      value: projectsLoading ? '...' : projects.length,
      icon: FolderOpen,
      color: 'bg-blue-500',
      change: '+2 this month',
      changeType: 'positive'
    },
    {
      name: 'Skills',
      value: skillsLoading ? '...' : skills.length,
      icon: Code2,
      color: 'bg-green-500',
      change: '+5 this month',
      changeType: 'positive'
    },
    {
      name: 'Experience',
      value: experiencesLoading ? '...' : experiences.length,
      icon: Briefcase,
      color: 'bg-purple-500',
      change: 'Updated recently',
      changeType: 'neutral'
    },
    {
      name: 'Messages',
      value: contactsLoading ? '...' : contacts.length,
      icon: Mail,
      color: 'bg-orange-500',
      change: contacts.filter(c => c.status === 'unread').length + ' unread',
      changeType: contacts.filter(c => c.status === 'unread').length > 0 ? 'attention' : 'neutral'
    }
  ];

  const quickActions = [
    {
      title: 'Add New Project',
      description: 'Create a new portfolio project',
      icon: Plus,
      color: 'bg-blue-500',
      action: () => navigate('/admin/projects')
    },
    {
      title: 'Manage Skills',
      description: 'Update your skills and technologies',
      icon: Code2,
      color: 'bg-green-500',
      action: () => navigate('/admin/skills')
    },
    {
      title: 'View Messages',
      description: 'Check new contact messages',
      icon: Mail,
      color: 'bg-purple-500',
      action: () => navigate('/admin/messages')
    },
    {
      title: 'Portfolio Analytics',
      description: 'View portfolio performance',
      icon: BarChart3,
      color: 'bg-orange-500',
      action: () => window.open('/', '_blank')
    }
  ];

  const recentActivity = [
    {
      id: 1,
      type: 'project',
      title: 'New project added',
      description: 'E-commerce Platform project was created',
      time: '2 hours ago',
      icon: FolderOpen,
      color: 'text-blue-600'
    },
    {
      id: 2,
      type: 'message',
      title: 'New contact message',
      description: 'Someone inquired about your services',
      time: '4 hours ago',
      icon: Mail,
      color: 'text-orange-600'
    },
    {
      id: 3,
      type: 'skill',
      title: 'Skills updated',
      description: 'Added React and Node.js skills',
      time: '1 day ago',
      icon: Code2,
      color: 'text-green-600'
    },
    {
      id: 4,
      type: 'experience',
      title: 'Experience updated',
      description: 'Updated current position details',
      time: '2 days ago',
      icon: Briefcase,
      color: 'text-purple-600'
    }
  ];



  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Welcome Header */}
      <motion.div variants={itemVariants}>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Welcome back! 👋
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Here's what's happening with your portfolio today.
        </p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.name}
              whileHover={{ y: -2 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {stat.name}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                    {stat.value}
                  </p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="mt-4">
                <span className={`text-sm ${
                  stat.changeType === 'positive' ? 'text-green-600 dark:text-green-400' :
                  stat.changeType === 'attention' ? 'text-orange-600 dark:text-orange-400' :
                  'text-gray-600 dark:text-gray-400'
                }`}>
                  {stat.change}
                </span>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <motion.div variants={itemVariants} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <motion.button
                  key={action.title}
                  onClick={action.action}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-colors text-left"
                >
                  <div className={`${action.color} w-10 h-10 rounded-lg flex items-center justify-center mb-3`}>
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="font-medium text-gray-900 dark:text-white mb-1">
                    {action.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {action.description}
                  </p>
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div variants={itemVariants} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Recent Activity
          </h2>
          <div className="space-y-4">
            {recentActivity.map((activity) => {
              const Icon = activity.icon;
              return (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className={`${activity.color} p-2 rounded-lg`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {activity.title}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {activity.description}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      {activity.time}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Portfolio Performance */}
      <motion.div variants={itemVariants} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Portfolio Performance
          </h2>
          <button className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
            View Details
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg mx-auto mb-2">
              <Eye className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">1,234</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Page Views</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg mx-auto mb-2">
              <Users className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">567</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Unique Visitors</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg mx-auto mb-2">
              <Activity className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">89%</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Engagement Rate</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default DashboardOverview;

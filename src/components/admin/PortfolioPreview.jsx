import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Eye, 
  X, 
  ExternalLink, 
  RefreshCw,
  Monitor,
  Tablet,
  Smartphone,
  Maximize2
} from 'lucide-react';
import { useProjects, useSkills, useExperience, useAbout } from '../../hooks/usePortfolio';
import portfolioService from '../../services/portfolioService';

const PortfolioPreview = ({ isOpen, onClose }) => {
  const [viewMode, setViewMode] = useState('desktop'); // desktop, tablet, mobile
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [previewData, setPreviewData] = useState({
    projects: [],
    skills: [],
    experiences: [],
    about: null
  });

  const { projects, refetch: refetchProjects } = useProjects();
  const { skills, refetch: refetchSkills } = useSkills();
  const { experiences, refetch: refetchExperiences } = useExperience();
  const { about, refetch: refetchAbout } = useAbout();

  // Update preview data when hooks data changes
  useEffect(() => {
    setPreviewData({
      projects: projects || [],
      skills: skills || [],
      experiences: experiences || [],
      about: about
    });
  }, [projects, skills, experiences, about]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([
        refetchProjects(),
        refetchSkills(),
        refetchExperiences(),
        refetchAbout()
      ]);
    } catch (error) {
      console.error('Failed to refresh preview:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const getViewportClass = () => {
    switch (viewMode) {
      case 'mobile':
        return 'w-80 h-[600px]';
      case 'tablet':
        return 'w-[768px] h-[600px]';
      case 'desktop':
      default:
        return 'w-full h-full';
    }
  };

  const getViewportScale = () => {
    switch (viewMode) {
      case 'mobile':
        return 'scale-75';
      case 'tablet':
        return 'scale-90';
      case 'desktop':
      default:
        return 'scale-100';
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black bg-opacity-75 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full h-full max-w-7xl max-h-[90vh] flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Portfolio Preview
              </h2>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                </button>
                <div className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('desktop')}
                    className={`p-2 rounded-md transition-colors ${
                      viewMode === 'desktop'
                        ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                        : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                    }`}
                  >
                    <Monitor className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('tablet')}
                    className={`p-2 rounded-md transition-colors ${
                      viewMode === 'tablet'
                        ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                        : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                    }`}
                  >
                    <Tablet className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('mobile')}
                    className={`p-2 rounded-md transition-colors ${
                      viewMode === 'mobile'
                        ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                        : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                    }`}
                  >
                    <Smartphone className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => window.open('/', '_blank')}
                className="flex items-center px-3 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Open Live Site
              </button>
              <button
                onClick={onClose}
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Preview Content */}
          <div className="flex-1 overflow-hidden bg-gray-100 dark:bg-gray-800 p-4">
            <div className="h-full flex items-center justify-center">
              <div className={`${getViewportClass()} ${getViewportScale()} transition-all duration-300 bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden`}>
                <div className="h-full overflow-y-auto">
                  <PortfolioPreviewContent data={previewData} />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// Simplified portfolio preview content component
const PortfolioPreviewContent = ({ data }) => {
  const { projects, skills, experiences, about } = data;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text mb-4">
              {about?.name || 'Your Name'}
            </h1>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6">
              {about?.title || 'Your Title'}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              {about?.bio || 'Your bio will appear here...'}
            </p>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">Skills</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {skills.slice(0, 8).map((skill, index) => (
              <div key={skill.$id || index} className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-sm text-center">
                <div className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                  {skill.name}
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                  <div 
                    className="h-2 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${skill.proficiency || 50}%`,
                      backgroundColor: skill.color || '#3B82F6'
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
          {skills.length === 0 && (
            <div className="text-center text-gray-500 dark:text-gray-400">
              No skills added yet
            </div>
          )}
        </div>
      </section>

      {/* Projects Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">Featured Projects</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.slice(0, 6).map((project, index) => (
              <div key={project.$id || index} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
                <div className="h-48 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  {project.image ? (
                    <img 
                      src={portfolioService.getFileView(project.image)} 
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-gray-400">No Image</div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {project.title || 'Project Title'}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">
                    {project.description || 'Project description...'}
                  </p>
                  {project.technologies && project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {project.technologies.slice(0, 3).map((tech, techIndex) => (
                        <span key={techIndex} className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs rounded-full">
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          {projects.length === 0 && (
            <div className="text-center text-gray-500 dark:text-gray-400">
              No projects added yet
            </div>
          )}
        </div>
      </section>

      {/* Experience Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">Experience</h2>
          <div className="space-y-6">
            {experiences.slice(0, 3).map((exp, index) => (
              <div key={exp.$id || index} className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-sm">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {exp.position || 'Position'}
                    </h3>
                    <p className="text-blue-600 dark:text-blue-400 font-medium">
                      {exp.company || 'Company'}
                    </p>
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {exp.startDate ? new Date(exp.startDate).getFullYear() : 'Year'} - {exp.current ? 'Present' : (exp.endDate ? new Date(exp.endDate).getFullYear() : 'Year')}
                  </span>
                </div>
                {exp.description && exp.description.length > 0 && (
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 text-sm">
                    {exp.description.slice(0, 2).map((desc, descIndex) => (
                      <li key={descIndex}>{desc}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
          {experiences.length === 0 && (
            <div className="text-center text-gray-500 dark:text-gray-400">
              No experience added yet
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default PortfolioPreview;

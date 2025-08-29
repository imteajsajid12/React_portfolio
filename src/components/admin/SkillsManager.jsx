import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X,
  Code2,
  Server,
  Database,
  Cloud,
  Palette,
  Github
} from 'lucide-react';
import { useSkills } from '../../hooks/usePortfolio';

const SkillsManager = () => {
  const { skills, loading, createSkill, updateSkill, deleteSkill } = useSkills();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'frontend',
    proficiency: 50,
    icon: '',
    color: '#3B82F6',
    order: 0,
    status: 'active'
  });
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState('');

  const categories = [
    { value: 'frontend', label: 'Frontend', icon: Code2, color: 'text-blue-600' },
    { value: 'backend', label: 'Backend', icon: Server, color: 'text-green-600' },
    { value: 'database', label: 'Database', icon: Database, color: 'text-orange-600' },
    { value: 'devops', label: 'DevOps', icon: Cloud, color: 'text-blue-500' },
    { value: 'design', label: 'Design', icon: Palette, color: 'text-purple-600' },
    { value: 'version-control', label: 'Version Control', icon: Github, color: 'text-gray-600' }
  ];

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) : value
    }));
  };

  const openModal = (skill = null) => {
    if (skill) {
      setEditingSkill(skill);
      setFormData({
        name: skill.name || '',
        category: skill.category || 'frontend',
        proficiency: skill.proficiency || 50,
        icon: skill.icon || '',
        color: skill.color || '#3B82F6',
        order: skill.order || 0,
        status: skill.status || 'active'
      });
    } else {
      setEditingSkill(null);
      setFormData({
        name: '',
        category: 'frontend',
        proficiency: 50,
        icon: '',
        color: '#3B82F6',
        order: 0,
        status: 'active'
      });
    }
    setError('');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingSkill(null);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setError('');

    try {
      if (editingSkill) {
        await updateSkill(editingSkill.$id, formData);
      } else {
        await createSkill(formData);
      }
      closeModal();
    } catch (err) {
      setError(err.message || 'Failed to save skill');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (skillId) => {
    if (window.confirm('Are you sure you want to delete this skill?')) {
      try {
        await deleteSkill(skillId);
      } catch (err) {
        setError(err.message || 'Failed to delete skill');
      }
    }
  };

  const getCategoryIcon = (category) => {
    const cat = categories.find(c => c.value === category);
    return cat ? cat.icon : Code2;
  };

  const getCategoryColor = (category) => {
    const cat = categories.find(c => c.value === category);
    return cat ? cat.color : 'text-blue-600';
  };

  const groupedSkills = skills.reduce((acc, skill) => {
    const category = skill.category || 'frontend';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(skill);
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Skills</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your technical skills and proficiency levels</p>
        </div>
        <motion.button
          onClick={() => openModal()}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Skill
        </motion.button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-700 dark:text-red-300">{error}</p>
        </div>
      )}

      {/* Skills by Category */}
      <div className="space-y-8">
        {categories.map((category) => {
          const categorySkills = groupedSkills[category.value] || [];
          const Icon = category.icon;
          
          return (
            <div key={category.value} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center mb-4">
                <Icon className={`h-6 w-6 ${category.color} mr-3`} />
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {category.label}
                </h2>
                <span className="ml-2 px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-sm rounded-full">
                  {categorySkills.length}
                </span>
              </div>
              
              {categorySkills.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categorySkills.map((skill) => (
                    <motion.div
                      key={skill.$id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:border-gray-300 dark:hover:border-gray-500 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          {skill.name}
                        </h3>
                        <div className="flex space-x-1">
                          <button
                            onClick={() => openModal(skill)}
                            className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(skill.$id)}
                            className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      
                      {/* Proficiency Bar */}
                      <div className="mb-2">
                        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                          <span>Proficiency</span>
                          <span>{skill.proficiency}%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div 
                            className="h-2 rounded-full transition-all duration-300"
                            style={{ 
                              width: `${skill.proficiency}%`,
                              backgroundColor: skill.color || '#3B82F6'
                            }}
                          ></div>
                        </div>
                      </div>
                      
                      {/* Icon Preview */}
                      {skill.icon && (
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                          <span>Icon: </span>
                          <div 
                            className="ml-2 w-5 h-5"
                            style={{ color: skill.color }}
                            dangerouslySetInnerHTML={{ __html: skill.icon }}
                          />
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <Icon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No skills in this category yet</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {skills.length === 0 && (
        <div className="text-center py-12">
          <Code2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No skills yet</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">Start building your skills portfolio</p>
          <button
            onClick={() => openModal()}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Add Your First Skill
          </button>
        </div>
      )}

      {/* Skill Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                {/* Modal Header */}
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    {editingSkill ? 'Edit Skill' : 'Add New Skill'}
                  </h2>
                  <button
                    onClick={closeModal}
                    className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Skill Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Skill Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="e.g., React, Node.js, Python"
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Category *
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      {categories.map((category) => (
                        <option key={category.value} value={category.value}>
                          {category.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Proficiency */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Proficiency Level: {formData.proficiency}%
                    </label>
                    <input
                      type="range"
                      name="proficiency"
                      value={formData.proficiency}
                      onChange={handleInputChange}
                      min="0"
                      max="100"
                      step="5"
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                    />
                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                      <span>Beginner</span>
                      <span>Intermediate</span>
                      <span>Advanced</span>
                      <span>Expert</span>
                    </div>
                  </div>

                  {/* Color */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Color
                    </label>
                    <div className="flex items-center space-x-3">
                      <input
                        type="color"
                        name="color"
                        value={formData.color}
                        onChange={handleInputChange}
                        className="w-12 h-10 border border-gray-300 dark:border-gray-600 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        name="color"
                        value={formData.color}
                        onChange={handleInputChange}
                        className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="#3B82F6"
                      />
                    </div>
                  </div>

                  {/* Icon */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Icon (SVG or HTML)
                    </label>
                    <textarea
                      name="icon"
                      value={formData.icon}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="<svg>...</svg> or icon class name"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      You can use SVG code, Font Awesome classes, or other icon formats
                    </p>
                  </div>

                  {/* Settings */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Order
                      </label>
                      <input
                        type="number"
                        name="order"
                        value={formData.order}
                        onChange={handleInputChange}
                        min="0"
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Status
                      </label>
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                      <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
                    </div>
                  )}

                  {/* Modal Footer */}
                  <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                    <motion.button
                      type="submit"
                      disabled={formLoading}
                      whileHover={{ scale: formLoading ? 1 : 1.02 }}
                      whileTap={{ scale: formLoading ? 1 : 0.98 }}
                      className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors"
                    >
                      {formLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          {editingSkill ? 'Update Skill' : 'Create Skill'}
                        </>
                      )}
                    </motion.button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SkillsManager;

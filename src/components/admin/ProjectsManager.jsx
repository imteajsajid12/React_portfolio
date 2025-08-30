import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Edit, 
  Trash2, 
  ExternalLink, 
  Github, 
  Image, 
  Save, 
  X,
  Eye,
  Upload
} from 'lucide-react';
import { useProjects } from '../../hooks/usePortfolio';
import { useImageUpload } from '../../hooks/useFileUpload';
import portfolioService from '../../services/portfolioService';
import DeleteConfirmationModal from '../common/DeleteConfirmationModal';

const ProjectsManager = () => {
  const { projects, loading, createProject, updateProject, deleteProject } = useProjects();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    technologies: [],
    demoUrl: '',
    githubUrl: '',
    featured: false,
    status: 'active',
    order: 0
  });
  const [techInput, setTechInput] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState('');
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, project: null });
  const [deleteLoading, setDeleteLoading] = useState(false);

  const { 
    preview, 
    imageFile, 
    selectImage, 
    uploadImage, 
    clearImage, 
    uploading, 
    uploadProgress 
  } = useImageUpload();

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAddTechnology = (e) => {
    e.preventDefault();
    if (techInput.trim() && !formData.technologies.includes(techInput.trim())) {
      setFormData(prev => ({
        ...prev,
        technologies: [...prev.technologies, techInput.trim()]
      }));
      setTechInput('');
    }
  };

  const handleRemoveTechnology = (tech) => {
    setFormData(prev => ({
      ...prev,
      technologies: prev.technologies.filter(t => t !== tech)
    }));
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        selectImage(file);
      } catch (error) {
        setError(error.message);
      }
    }
  };

  // Effect to handle image loading when editing
  useEffect(() => {
    if (editingProject && editingProject.image) {
      try {
        const imageUrl = portfolioService.getFileView(editingProject.image);
        selectImage(null, imageUrl);
      } catch (error) {
        console.error('Failed to load project image:', error);
      }
    }
  }, [editingProject, selectImage]);

  const openModal = (project = null) => {
    if (project) {
      setEditingProject(project);
      setFormData({
        title: project.title || '',
        description: project.description || '',
        technologies: project.technologies || [],
        demoUrl: project.demoUrl || '',
        githubUrl: project.githubUrl || '',
        featured: project.featured || false,
        status: project.status || 'active',
        order: project.order || 0
      });
    } else {
      setEditingProject(null);
      setFormData({
        title: '',
        description: '',
        technologies: [],
        demoUrl: '',
        githubUrl: '',
        featured: false,
        status: 'active',
        order: 0
      });
      clearImage();
    }
    clearImage();
    setError('');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProject(null);
    setTechInput('');
    clearImage();
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setError('');

    try {
      let imageId = editingProject?.image;

      // Upload new image if selected
      if (imageFile) {
        const uploadResult = await uploadImage();
        imageId = uploadResult.$id;
      }

      const projectData = {
        ...formData,
        image: imageId
      };

      console.log('Saving project data:', projectData);

      if (editingProject) {
        await portfolioService.updateProject(editingProject.$id, projectData);
        console.log('Project updated successfully');
      } else {
        await portfolioService.createProject(projectData);
        console.log('Project created successfully');
      }

      closeModal();
    } catch (err) {
      setError(err.message || 'Failed to save project');
    } finally {
      setFormLoading(false);
    }
  };

  const openDeleteModal = (project) => {
    setDeleteModal({ isOpen: true, project });
  };

  const closeDeleteModal = () => {
    setDeleteModal({ isOpen: false, project: null });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModal.project) return;

    setDeleteLoading(true);
    try {
      await deleteProject(deleteModal.project.$id);
      closeDeleteModal();
    } catch (err) {
      setError(err.message || 'Failed to delete project');
    } finally {
      setDeleteLoading(false);
    }
  };

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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Projects</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your portfolio projects</p>
        </div>
        <motion.button
          onClick={() => openModal()}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Project
        </motion.button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-700 dark:text-red-300">{error}</p>
        </div>
      )}

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <motion.div
            key={project.$id}
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
          >
            {/* Project Image */}
            <div className="h-48 bg-gray-100 dark:bg-gray-700 relative">
              {project.image ? (
                <img 
                  src={`${project.image}`} 
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Image className="h-12 w-12 text-gray-400" />
                </div>
              )}
              {project.featured && (
                <div className="absolute top-2 right-2 px-2 py-1 bg-blue-600 text-white text-xs rounded-full">
                  Featured
                </div>
              )}
            </div>

            {/* Project Content */}
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {project.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
                {project.description}
              </p>
              
              {/* Technologies */}
              {project.technologies && project.technologies.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {project.technologies.slice(0, 3).map((tech, index) => (
                    <span key={index} className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs rounded-full">
                      {tech}
                    </span>
                  ))}
                  {project.technologies.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-full">
                      +{project.technologies.length - 3}
                    </span>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-between">
                <div className="flex space-x-2">
                  {project.demoUrl && (
                    <a 
                      href={project.demoUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                  {project.githubUrl && (
                    <a 
                      href={project.githubUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <Github className="h-4 w-4" />
                    </a>
                  )}
                </div>
                
                <div className="flex space-x-1">
                  <button
                    onClick={() => openModal(project)}
                    className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => openDeleteModal(project)}
                    className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {projects.length === 0 && (
        <div className="text-center py-12">
          <Image className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No projects yet</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">Get started by adding your first project</p>
          <button
            onClick={() => openModal()}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Add Project
          </button>
        </div>
      )}

      {/* Project Modal */}
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
              className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                {/* Modal Header */}
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    {editingProject ? 'Edit Project' : 'Add New Project'}
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
                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Project Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="Enter project title"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Description *
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      required
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="Describe your project"
                    />
                  </div>

                  {/* Image Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Project Image
                    </label>
                    <div className="space-y-4">
                      {preview && (
                        <div className="relative">
                          <img src={preview} alt="Preview" className="w-full h-48 object-cover rounded-lg" />
                          <button
                            type="button"
                            onClick={clearImage}
                            className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                      <div className="flex items-center justify-center w-full">
                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500">
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <Upload className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" />
                            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                              <span className="font-semibold">Click to upload</span> or drag and drop
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG or GIF (MAX. 5MB)</p>
                          </div>
                          <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={handleImageSelect}
                          />
                        </label>
                      </div>
                      {uploading && (
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${uploadProgress}%` }}
                          ></div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Technologies */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Technologies
                    </label>
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={techInput}
                          onChange={(e) => setTechInput(e.target.value)}
                          className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          placeholder="Add technology (e.g., React, Node.js)"
                        />
                        <button
                          type="button"
                          onClick={handleAddTechnology}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                        >
                          Add
                        </button>
                      </div>
                      {formData.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {formData.technologies.map((tech, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-sm rounded-full"
                            >
                              {tech}
                              <button
                                type="button"
                                onClick={() => handleRemoveTechnology(tech)}
                                className="ml-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* URLs */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Demo URL
                      </label>
                      <input
                        type="url"
                        name="demoUrl"
                        value={formData.demoUrl}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="https://example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        GitHub URL
                      </label>
                      <input
                        type="url"
                        name="githubUrl"
                        value={formData.githubUrl}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="https://github.com/username/repo"
                      />
                    </div>
                  </div>

                  {/* Settings */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                        <option value="draft">Draft</option>
                      </select>
                    </div>
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
                    <div className="flex items-center">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          name="featured"
                          checked={formData.featured}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                        />
                        <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                          Featured Project
                        </span>
                      </label>
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
                      disabled={formLoading || uploading}
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
                          {editingProject ? 'Update Project' : 'Create Project'}
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

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
        onConfirm={handleDeleteConfirm}
        title="Delete Project"
        message="Are you sure you want to delete this project? This will permanently remove it from your portfolio."
        itemName={deleteModal.project?.title}
        isLoading={deleteLoading}
      />
    </div>
  );
};

export default ProjectsManager;

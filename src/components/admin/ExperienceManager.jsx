import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X,
  Briefcase,
  MapPin,
  Calendar,
  Building,
  Upload
} from 'lucide-react';
import { useExperience } from '../../hooks/usePortfolio';
import { useImageUpload } from '../../hooks/useFileUpload';

const ExperienceManager = () => {
  const { experiences, loading, createExperience, updateExperience, deleteExperience } = useExperience();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExperience, setEditingExperience] = useState(null);
  const [formData, setFormData] = useState({
    company: '',
    position: '',
    startDate: '',
    endDate: '',
    current: false,
    description: [],
    technologies: [],
    location: '',
    order: 0,
    status: 'active'
  });
  const [descriptionInput, setDescriptionInput] = useState('');
  const [techInput, setTechInput] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState('');

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

  const handleAddDescription = (e) => {
    e.preventDefault();
    if (descriptionInput.trim()) {
      setFormData(prev => ({
        ...prev,
        description: [...prev.description, descriptionInput.trim()]
      }));
      setDescriptionInput('');
    }
  };

  const handleRemoveDescription = (index) => {
    setFormData(prev => ({
      ...prev,
      description: prev.description.filter((_, i) => i !== index)
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

  const openModal = (experience = null) => {
    if (experience) {
      setEditingExperience(experience);
      setFormData({
        company: experience.company || '',
        position: experience.position || '',
        startDate: experience.startDate || '',
        endDate: experience.endDate || '',
        current: experience.current || false,
        description: experience.description || [],
        technologies: experience.technologies || [],
        location: experience.location || '',
        order: experience.order || 0,
        status: experience.status || 'active'
      });
    } else {
      setEditingExperience(null);
      setFormData({
        company: '',
        position: '',
        startDate: '',
        endDate: '',
        current: false,
        description: [],
        technologies: [],
        location: '',
        order: 0,
        status: 'active'
      });
    }
    clearImage();
    setError('');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingExperience(null);
    clearImage();
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setError('');

    try {
      let companyLogoId = editingExperience?.companyLogo;

      // Upload new logo if selected
      if (imageFile) {
        const uploadResult = await uploadImage();
        companyLogoId = uploadResult.$id;
      }

      const experienceData = {
        ...formData,
        companyLogo: companyLogoId
      };

      if (editingExperience) {
        await updateExperience(editingExperience.$id, experienceData);
      } else {
        await createExperience(experienceData);
      }

      closeModal();
    } catch (err) {
      setError(err.message || 'Failed to save experience');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (experienceId) => {
    if (window.confirm('Are you sure you want to delete this experience?')) {
      try {
        await deleteExperience(experienceId);
      } catch (err) {
        setError(err.message || 'Failed to delete experience');
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short' 
    });
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Work Experience</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your professional work experience</p>
        </div>
        <motion.button
          onClick={() => openModal()}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Experience
        </motion.button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-700 dark:text-red-300">{error}</p>
        </div>
      )}

      {/* Experience Timeline */}
      <div className="space-y-6">
        {experiences.map((experience, index) => (
          <motion.div
            key={experience.$id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4 flex-1">
                {/* Company Logo */}
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0">
                  {experience.companyLogo ? (
                    <img 
                      src={`${experience.companyLogo}`} 
                      alt={experience.company}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <Building className="h-8 w-8 text-gray-400" />
                  )}
                </div>

                {/* Experience Details */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {experience.position}
                      </h3>
                      <p className="text-lg text-blue-600 dark:text-blue-400 font-medium">
                        {experience.company}
                      </p>
                    </div>
                    {experience.current && (
                      <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-sm rounded-full">
                        Current
                      </span>
                    )}
                  </div>

                  <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm mb-3 space-x-4">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>
                        {formatDate(experience.startDate)} - {experience.current ? 'Present' : formatDate(experience.endDate)}
                      </span>
                    </div>
                    {experience.location && (
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span>{experience.location}</span>
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  {experience.description && experience.description.length > 0 && (
                    <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-1 mb-4">
                      {experience.description.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  )}

                  {/* Technologies */}
                  {experience.technologies && experience.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {experience.technologies.map((tech, index) => (
                        <span key={index} className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs rounded-full">
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-2 ml-4">
                <button
                  onClick={() => openModal(experience)}
                  className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(experience.$id)}
                  className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {experiences.length === 0 && (
        <div className="text-center py-12">
          <Briefcase className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No experience yet</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">Start building your professional timeline</p>
          <button
            onClick={() => openModal()}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Add Your First Experience
          </button>
        </div>
      )}

      {/* Experience Modal */}
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
                    {editingExperience ? 'Edit Experience' : 'Add New Experience'}
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
                  {/* Basic Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Position *
                      </label>
                      <input
                        type="text"
                        name="position"
                        value={formData.position}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="e.g., Senior Software Engineer"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Company *
                      </label>
                      <input
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="e.g., Tech Company Inc."
                      />
                    </div>
                  </div>

                  {/* Dates and Location */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Start Date *
                      </label>
                      <input
                        type="date"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        End Date
                      </label>
                      <input
                        type="date"
                        name="endDate"
                        value={formData.endDate}
                        onChange={handleInputChange}
                        disabled={formData.current}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Location
                      </label>
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="e.g., New York, NY"
                      />
                    </div>
                  </div>

                  {/* Current Position Checkbox */}
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="current"
                      checked={formData.current}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <label className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                      This is my current position
                    </label>
                  </div>

                  {/* Company Logo Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Company Logo
                    </label>
                    <div className="space-y-4">
                      {preview && (
                        <div className="relative">
                          <img src={preview} alt="Preview" className="w-20 h-20 object-cover rounded-lg" />
                          <button
                            type="button"
                            onClick={clearImage}
                            className="absolute -top-2 -right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      )}
                      <div className="flex items-center justify-center w-full">
                        <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500">
                          <div className="flex flex-col items-center justify-center pt-2 pb-3">
                            <Upload className="w-6 h-6 mb-2 text-gray-500 dark:text-gray-400" />
                            <p className="text-xs text-gray-500 dark:text-gray-400">Upload company logo</p>
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

                  {/* Job Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Job Description
                    </label>
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={descriptionInput}
                          onChange={(e) => setDescriptionInput(e.target.value)}
                          className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          placeholder="Add a responsibility or achievement"
                        />
                        <button
                          type="button"
                          onClick={handleAddDescription}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                        >
                          Add
                        </button>
                      </div>
                      {formData.description.length > 0 && (
                        <div className="space-y-2">
                          {formData.description.map((desc, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                              <span className="text-sm text-gray-900 dark:text-white">{desc}</span>
                              <button
                                type="button"
                                onClick={() => handleRemoveDescription(index)}
                                className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Technologies */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Technologies Used
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
                          {editingExperience ? 'Update Experience' : 'Create Experience'}
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

export default ExperienceManager;

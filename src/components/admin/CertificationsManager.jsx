import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Edit, 
  Trash2, 
  ExternalLink, 
  Award, 
  Calendar,
  Building,
  Save, 
  X,
  Eye,
  Upload,
  CheckCircle,
  Clock
} from 'lucide-react';
import { useCertifications } from '../../hooks/usePortfolio';
import { useImageUpload } from '../../hooks/useFileUpload';
import portfolioService from '../../services/portfolioService';
import DeleteConfirmationModal from '../common/DeleteConfirmationModal';

const CertificationsManager = () => {
  const { certifications, loading, createCertification, updateCertification, deleteCertification } = useCertifications();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCertification, setEditingCertification] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    issuer: '',
    description: '',
    issueDate: '',
    expiryDate: '',
    credentialId: '',
    verificationUrl: '',
    skills: [],
    featured: false,
    status: 'active',
    order: 0
  });
  const [skillInput, setSkillInput] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState('');
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, certification: null });
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

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, skillInput.trim()]
      }));
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skill) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill)
    }));
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        selectImage(file);
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const openModal = (certification = null) => {
    if (certification) {
      setEditingCertification(certification);
      setFormData({
        title: certification.title || '',
        issuer: certification.issuer || '',
        description: certification.description || '',
        issueDate: certification.issueDate || '',
        expiryDate: certification.expiryDate || '',
        credentialId: certification.credentialId || '',
        verificationUrl: certification.verificationUrl || '',
        skills: certification.skills || [],
        featured: certification.featured || false,
        status: certification.status || 'active',
        order: certification.order || 0
      });
      
      // Set existing image preview if certification has an image
      if (certification.certificateImage) {
        const imageUrl = portfolioService.getFileView(certification.certificateImage);
        selectImage(null, imageUrl);
      }
    } else {
      setEditingCertification(null);
      setFormData({
        title: '',
        issuer: '',
        description: '',
        issueDate: '',
        expiryDate: '',
        credentialId: '',
        verificationUrl: '',
        skills: [],
        featured: false,
        status: 'active',
        order: 0
      });
      clearImage();
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCertification(null);
    setSkillInput('');
    clearImage();
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setError('');

    try {
      let imageId = editingCertification?.certificateImage;

      // Upload new image if selected
      if (imageFile) {
        const uploadResult = await uploadImage();
        imageId = uploadResult.$id;
      }

      const certificationData = {
        ...formData,
        certificateImage: imageId
      };

      console.log('Saving certification data:', certificationData);

      if (editingCertification) {
        await updateCertification(editingCertification.$id, certificationData);
        console.log('Certification updated successfully');
      } else {
        await createCertification(certificationData);
        console.log('Certification created successfully');
      }

      closeModal();
    } catch (err) {
      setError(err.message || 'Failed to save certification');
    } finally {
      setFormLoading(false);
    }
  };

  const openDeleteModal = (certification) => {
    setDeleteModal({ isOpen: true, certification });
  };

  const closeDeleteModal = () => {
    setDeleteModal({ isOpen: false, certification: null });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModal.certification) return;

    setDeleteLoading(true);
    try {
      await deleteCertification(deleteModal.certification.$id);
      closeDeleteModal();
    } catch (err) {
      setError(err.message || 'Failed to delete certification');
    } finally {
      setDeleteLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short'
    });
  };

  const isExpired = (expiryDate) => {
    if (!expiryDate) return false;
    return new Date(expiryDate) < new Date();
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Certifications</h1>
        </div>
        <div className="grid gap-6">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md animate-pulse">
              <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded mb-4"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded mb-2"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Certifications</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your course certificates and achievements</p>
        </div>
        <motion.button
          onClick={() => openModal()}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Certification
        </motion.button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Certifications Grid */}
      <div className="grid gap-6">
        {certifications.length > 0 ? (
          certifications.map((certification) => (
            <motion.div
              key={certification.$id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Award className="h-5 w-5 text-blue-600" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {certification.title}
                    </h3>
                    {certification.featured && (
                      <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 text-xs rounded-full">
                        Featured
                      </span>
                    )}
                    {isExpired(certification.expiryDate) ? (
                      <span className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 text-xs rounded-full flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        Expired
                      </span>
                    ) : (
                      <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-xs rounded-full flex items-center">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Valid
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-2">
                    <Building className="h-4 w-4" />
                    <span>{certification.issuer}</span>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-3">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>Issued: {formatDate(certification.issueDate)}</span>
                    </div>
                    {certification.expiryDate && (
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>Expires: {formatDate(certification.expiryDate)}</span>
                      </div>
                    )}
                  </div>

                  {certification.description && (
                    <p className="text-gray-600 dark:text-gray-300 mb-3">
                      {certification.description}
                    </p>
                  )}

                  {certification.skills && certification.skills.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {certification.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center gap-4">
                    {certification.verificationUrl && (
                      <a
                        href={certification.verificationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 dark:text-blue-400 hover:underline flex items-center text-sm"
                      >
                        <ExternalLink className="h-4 w-4 mr-1" />
                        Verify Certificate
                      </a>
                    )}
                    {certification.credentialId && (
                      <span className="text-gray-500 dark:text-gray-400 text-sm">
                        ID: {certification.credentialId}
                      </span>
                    )}
                  </div>
                </div>

                {/* Certificate Image */}
                {certification.certificateImage && (
                  <div className="ml-4">
                    <img
                      src={portfolioService.getFileView(certification.certificateImage)}
                      alt={certification.title}
                      className="w-24 h-16 object-cover rounded border"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                )}

                {/* Actions */}
                <div className="ml-4 flex items-center gap-2">
                  <motion.button
                    onClick={() => openModal(certification)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                  >
                    <Edit className="h-4 w-4" />
                  </motion.button>
                  <motion.button
                    onClick={() => openDeleteModal(certification)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-12">
            <Award className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No certifications yet</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">Add your first certification to get started.</p>
            <motion.button
              onClick={() => openModal()}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Certification
            </motion.button>
          </div>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                {/* Modal Header */}
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    {editingCertification ? 'Edit Certification' : 'Add New Certification'}
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
                  {/* Title and Issuer */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Certification Title *
                      </label>
                      <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="e.g., AWS Certified Solutions Architect"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Issuing Organization *
                      </label>
                      <input
                        type="text"
                        name="issuer"
                        value={formData.issuer}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="e.g., Amazon Web Services"
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="Brief description of the certification"
                    />
                  </div>

                  {/* Dates */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Issue Date *
                      </label>
                      <input
                        type="date"
                        name="issueDate"
                        value={formData.issueDate}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Expiry Date (Optional)
                      </label>
                      <input
                        type="date"
                        name="expiryDate"
                        value={formData.expiryDate}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>

                  {/* Credential ID and Verification URL */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Credential ID
                      </label>
                      <input
                        type="text"
                        name="credentialId"
                        value={formData.credentialId}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="Certificate ID or number"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Verification URL
                      </label>
                      <input
                        type="url"
                        name="verificationUrl"
                        value={formData.verificationUrl}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="https://verify.example.com"
                      />
                    </div>
                  </div>

                  {/* Certificate Image Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Certificate Image
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
                              <span className="font-semibold">Click to upload</span> certificate image
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG or PDF (MAX. 5MB)</p>
                          </div>
                          <input
                            type="file"
                            className="hidden"
                            accept="image/*,.pdf"
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

                  {/* Submit Button */}
                  <div className="flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      Cancel
                    </button>
                    <motion.button
                      type="submit"
                      disabled={formLoading || uploading}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors"
                    >
                      {formLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          {editingCertification ? 'Update Certification' : 'Create Certification'}
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
        title="Delete Certification"
        message="Are you sure you want to delete this certification? This will permanently remove it from your portfolio."
        itemName={deleteModal.certification?.title}
        isLoading={deleteLoading}
      />
    </div>
  );
};

export default CertificationsManager;

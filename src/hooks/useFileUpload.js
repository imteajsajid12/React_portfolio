import { useState, useCallback } from 'react';
import portfolioService from '../services/portfolioService';

// Hook for file upload operations
export const useFileUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);

  const uploadFile = useCallback(async (file, onProgress = null) => {
    try {
      setUploading(true);
      setError(null);
      setUploadProgress(0);

      // Validate file
      if (!file) {
        throw new Error('No file selected');
      }

      // Check file size (max 10MB)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        throw new Error('File size must be less than 10MB');
      }

      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          const newProgress = prev + 10;
          if (onProgress) onProgress(newProgress);
          return newProgress > 90 ? 90 : newProgress;
        });
      }, 100);

      const result = await portfolioService.uploadFile(file);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      if (onProgress) onProgress(100);

      return result;
    } catch (err) {
      setError(err.message);
      console.error('File upload failed:', err);
      throw err;
    } finally {
      setUploading(false);
      setTimeout(() => setUploadProgress(0), 1000);
    }
  }, []);

  const deleteFile = useCallback(async (fileId) => {
    try {
      setError(null);
      const result = await portfolioService.deleteFile(fileId);
      return result;
    } catch (err) {
      setError(err.message);
      console.error('File deletion failed:', err);
      throw err;
    }
  }, []);

  const getFilePreview = useCallback((fileId, width = 400, height = 400) => {
    try {
      return portfolioService.getFilePreview(fileId, width, height);
    } catch (err) {
      console.error('Failed to get file preview:', err);
      return null;
    }
  }, []);

  const getFileView = useCallback((fileId) => {
    try {
      return portfolioService.getFileView(fileId);
    } catch (err) {
      console.error('Failed to get file view:', err);
      return null;
    }
  }, []);

  const getFileDownload = useCallback((fileId) => {
    try {
      return portfolioService.getFileDownload(fileId);
    } catch (err) {
      console.error('Failed to get file download:', err);
      return null;
    }
  }, []);

  return {
    uploading,
    uploadProgress,
    error,
    uploadFile,
    deleteFile,
    getFilePreview,
    getFileView,
    getFileDownload
  };
};

// Hook for image upload with preview
export const useImageUpload = () => {
  const [preview, setPreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const fileUpload = useFileUpload();

  const selectImage = useCallback((file, previewUrl = null) => {
    if (!file && !previewUrl) {
      setPreview(null);
      setImageFile(null);
      return;
    }

    // If only preview URL is provided (for existing images)
    if (!file && previewUrl) {
      setPreview(previewUrl);
      setImageFile(null);
      return;
    }

    // Validate image file
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      throw new Error('Please select a valid image file (JPEG, PNG, GIF, or WebP)');
    }

    // Check file size (max 5MB for images)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      throw new Error('Image size must be less than 5MB');
    }

    setImageFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target.result);
    };
    reader.readAsDataURL(file);
  }, []);

  const uploadImage = useCallback(async (onProgress = null) => {
    if (!imageFile) {
      throw new Error('No image selected');
    }

    try {
      const result = await fileUpload.uploadFile(imageFile, onProgress);
      return result;
    } catch (err) {
      throw err;
    }
  }, [imageFile, fileUpload]);

  const clearImage = useCallback(() => {
    setPreview(null);
    setImageFile(null);
  }, []);

  return {
    preview,
    imageFile,
    selectImage,
    uploadImage,
    clearImage,
    uploading: fileUpload.uploading,
    uploadProgress: fileUpload.uploadProgress,
    error: fileUpload.error,
    deleteFile: fileUpload.deleteFile,
    getFilePreview: fileUpload.getFilePreview,
    getFileView: fileUpload.getFileView
  };
};

// Hook for multiple file uploads
export const useMultipleFileUpload = () => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [errors, setErrors] = useState({});
  const fileUpload = useFileUpload();

  const addFiles = useCallback((newFiles) => {
    const fileArray = Array.from(newFiles);
    const validFiles = fileArray.filter(file => {
      // Basic validation
      const maxSize = 10 * 1024 * 1024; // 10MB
      return file.size <= maxSize;
    });

    setFiles(prev => [...prev, ...validFiles.map(file => ({
      id: Date.now() + Math.random(),
      file,
      uploaded: false,
      fileId: null,
      error: null
    }))]);
  }, []);

  const removeFile = useCallback((fileId) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
    setUploadProgress(prev => {
      const newProgress = { ...prev };
      delete newProgress[fileId];
      return newProgress;
    });
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[fileId];
      return newErrors;
    });
  }, []);

  const uploadFiles = useCallback(async () => {
    setUploading(true);
    const uploadPromises = files.map(async (fileItem) => {
      if (fileItem.uploaded) return fileItem;

      try {
        setUploadProgress(prev => ({ ...prev, [fileItem.id]: 0 }));
        
        const result = await fileUpload.uploadFile(fileItem.file, (progress) => {
          setUploadProgress(prev => ({ ...prev, [fileItem.id]: progress }));
        });

        return {
          ...fileItem,
          uploaded: true,
          fileId: result.$id,
          error: null
        };
      } catch (err) {
        setErrors(prev => ({ ...prev, [fileItem.id]: err.message }));
        return {
          ...fileItem,
          error: err.message
        };
      }
    });

    try {
      const results = await Promise.all(uploadPromises);
      setFiles(results);
      return results;
    } catch (err) {
      console.error('Batch upload failed:', err);
      throw err;
    } finally {
      setUploading(false);
    }
  }, [files, fileUpload]);

  const clearFiles = useCallback(() => {
    setFiles([]);
    setUploadProgress({});
    setErrors({});
  }, []);

  return {
    files,
    uploading,
    uploadProgress,
    errors,
    addFiles,
    removeFile,
    uploadFiles,
    clearFiles,
    deleteFile: fileUpload.deleteFile
  };
};

// Hook for document upload (PDF, DOC, etc.)
export const useDocumentUpload = () => {
  const [document, setDocument] = useState(null);
  const fileUpload = useFileUpload();

  const selectDocument = useCallback((file) => {
    if (!file) {
      setDocument(null);
      return;
    }

    // Validate document file
    const validTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ];
    
    if (!validTypes.includes(file.type)) {
      throw new Error('Please select a valid document file (PDF, DOC, DOCX, or TXT)');
    }

    // Check file size (max 10MB for documents)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      throw new Error('Document size must be less than 10MB');
    }

    setDocument({
      file,
      name: file.name,
      size: file.size,
      type: file.type
    });
  }, []);

  const uploadDocument = useCallback(async (onProgress = null) => {
    if (!document) {
      throw new Error('No document selected');
    }

    try {
      const result = await fileUpload.uploadFile(document.file, onProgress);
      return result;
    } catch (err) {
      throw err;
    }
  }, [document, fileUpload]);

  const clearDocument = useCallback(() => {
    setDocument(null);
  }, []);

  return {
    document,
    selectDocument,
    uploadDocument,
    clearDocument,
    uploading: fileUpload.uploading,
    uploadProgress: fileUpload.uploadProgress,
    error: fileUpload.error,
    deleteFile: fileUpload.deleteFile,
    getFileView: fileUpload.getFileView,
    getFileDownload: fileUpload.getFileDownload
  };
};

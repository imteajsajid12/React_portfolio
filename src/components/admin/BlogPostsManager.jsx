import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X,
  FileText,
  Calendar,
  Eye,
  Clock,
  Tag,
  Image,
  Upload,
  Star,
  BookOpen
} from 'lucide-react';
import { useBlogPosts, useBlogCategories } from '../../hooks/usePortfolio';
import { useImageUpload } from '../../hooks/useFileUpload';
import portfolioService from '../../services/portfolioService';
import DeleteConfirmationModal from '../common/DeleteConfirmationModal';

const BlogPostsManager = () => {
  const { posts, loading, createPost, updatePost, deletePost } = useBlogPosts(null, null); // Get all posts
  const { categories } = useBlogCategories();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    categoryId: '',
    tags: [],
    status: 'draft',
    featured: false,
    readTime: 5,
    order: 0
  });
  const [tagInput, setTagInput] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState('');
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, post: null });
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

  // Effect to handle image loading when editing
  useEffect(() => {
    if (editingPost && editingPost.featuredImage) {
      try {
        const imageUrl = portfolioService.getFileView(editingPost.featuredImage);
        selectImage(null, imageUrl);
      } catch (error) {
        console.error('Failed to load post image:', error);
      }
    }
  }, [editingPost, selectImage]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Auto-generate slug from title
    if (name === 'title') {
      setFormData(prev => ({
        ...prev,
        slug: value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
      }));
    }

    // Auto-calculate read time based on content length
    if (name === 'content') {
      const wordCount = value.split(/\s+/).length;
      const readTime = Math.max(1, Math.ceil(wordCount / 200)); // 200 words per minute
      setFormData(prev => ({
        ...prev,
        readTime
      }));
    }
  };

  const handleAddTag = (e) => {
    e.preventDefault();
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
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

  const openModal = (post = null) => {
    if (post) {
      setEditingPost(post);
      setFormData({
        title: post.title || '',
        slug: post.slug || '',
        excerpt: post.excerpt || '',
        content: post.content || '',
        categoryId: post.categoryId || '',
        tags: post.tags || [],
        status: post.status || 'draft',
        featured: post.featured || false,
        readTime: post.readTime || 5,
        order: post.order || 0
      });
    } else {
      setEditingPost(null);
      setFormData({
        title: '',
        slug: '',
        excerpt: '',
        content: '',
        categoryId: '',
        tags: [],
        status: 'draft',
        featured: false,
        readTime: 5,
        order: 0
      });
      clearImage();
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingPost(null);
    setTagInput('');
    clearImage();
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setError('');

    try {
      let imageId = editingPost?.featuredImage;

      // Upload new image if selected
      if (imageFile) {
        const uploadResult = await uploadImage();
        imageId = uploadResult.$id;
      }

      const postData = {
        ...formData,
        featuredImage: imageId
      };

      console.log('Saving blog post data:', postData);

      if (editingPost) {
        await updatePost(editingPost.$id, postData);
        console.log('Post updated successfully');
      } else {
        await createPost(postData);
        console.log('Post created successfully');
      }

      closeModal();
    } catch (err) {
      setError(err.message || 'Failed to save post');
    } finally {
      setFormLoading(false);
    }
  };

  const openDeleteModal = (post) => {
    setDeleteModal({ isOpen: true, post });
  };

  const closeDeleteModal = () => {
    setDeleteModal({ isOpen: false, post: null });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModal.post) return;
    
    setDeleteLoading(true);
    try {
      await deletePost(deleteModal.post.$id);
      closeDeleteModal();
    } catch (err) {
      setError(err.message || 'Failed to delete post');
    } finally {
      setDeleteLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat.$id === categoryId);
    return category?.name || 'Uncategorized';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300';
      case 'draft':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300';
      case 'archived':
        return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300';
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Blog Posts</h1>
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Blog Posts</h1>
          <p className="text-gray-600 dark:text-gray-400">Create and manage your blog content</p>
        </div>
        <motion.button
          onClick={() => openModal()}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Post
        </motion.button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Posts Grid */}
      <div className="grid gap-6">
        {posts.length > 0 ? (
          posts.map((post) => (
            <motion.div
              key={post.$id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <FileText className="h-5 w-5 text-blue-600" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {post.title}
                    </h3>
                    {post.featured && (
                      <Star className="h-4 w-4 text-yellow-500" />
                    )}
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(post.status)}`}>
                      {post.status}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-3">
                    <div className="flex items-center gap-1">
                      <Tag className="h-4 w-4" />
                      <span>{getCategoryName(post.categoryId)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(post.publishedAt || post.$createdAt)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{post.readTime} min read</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      <span>{post.views || 0} views</span>
                    </div>
                  </div>

                  {post.excerpt && (
                    <p className="text-gray-600 dark:text-gray-300 mb-3">
                      {post.excerpt}
                    </p>
                  )}

                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {post.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs rounded-full"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Featured Image */}
                {post.featuredImage && (
                  <div className="ml-4">
                    <img
                      src={portfolioService.getFileView(post.featuredImage)}
                      alt={post.title}
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
                    onClick={() => openModal(post)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                  >
                    <Edit className="h-4 w-4" />
                  </motion.button>
                  <motion.button
                    onClick={() => openDeleteModal(post)}
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
            <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No blog posts yet</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">Create your first blog post to get started.</p>
            <motion.button
              onClick={() => openModal()}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Post
            </motion.button>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
        onConfirm={handleDeleteConfirm}
        title="Delete Blog Post"
        message="Are you sure you want to delete this blog post? This action cannot be undone."
        itemName={deleteModal.post?.title}
        isLoading={deleteLoading}
      />
    </div>
  );
};

export default BlogPostsManager;

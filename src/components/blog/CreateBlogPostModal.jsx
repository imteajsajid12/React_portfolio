import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Save, 
  Eye, 
  Code, 
  Image, 
  Hash, 
  Calendar,
  User,
  Tag,
  FileText,
  Bold,
  Italic,
  Link,
  List,
  ListOrdered,
  Quote,
  Heading1,
  Heading2,
  Heading3,
  Upload,
  Plus,
  Trash2,
  Settings
} from 'lucide-react';
import toast from 'react-hot-toast';
import portfolioService from '../../services/portfolioService';
import { useBlogCategories } from '../../hooks/usePortfolio';
import EnhancedCodeBlock from './EnhancedCodeBlock';

const CreateBlogPostModal = ({ isOpen, onClose, onSave, editPost = null }) => {
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    categoryId: '',
    tags: [],
    status: 'draft',
    featured: false,
    featuredImage: null,
    readTime: 5,
    author: 'Admin',
    seoTitle: '',
    seoDescription: ''
  });

  const [currentTag, setCurrentTag] = useState('');
  const [previewMode, setPreviewMode] = useState(false);
  const [activeTab, setActiveTab] = useState('content'); // content, settings, preview
  const [isUploading, setIsUploading] = useState(false);
  const [codeBlocks, setCodeBlocks] = useState([]);
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [currentCodeBlock, setCurrentCodeBlock] = useState({
    code: '',
    language: 'javascript',
    filename: ''
  });

  const { categories } = useBlogCategories();

  useEffect(() => {
    if (editPost) {
      setFormData({
        title: editPost.title || '',
        slug: editPost.slug || '',
        excerpt: editPost.excerpt || '',
        content: editPost.content || '',
        categoryId: editPost.categoryId || '',
        tags: editPost.tags || [],
        status: editPost.status || 'draft',
        featured: editPost.featured || false,
        featuredImage: editPost.featuredImage || null,
        readTime: editPost.readTime || 5,
        author: editPost.author || 'Admin',
        seoTitle: editPost.seoTitle || '',
        seoDescription: editPost.seoDescription || ''
      });
    }
  }, [editPost]);

  // Auto-generate slug from title
  useEffect(() => {
    if (formData.title && !editPost) {
      const slug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      setFormData(prev => ({ ...prev, slug }));
    }
  }, [formData.title, editPost]);

  // Auto-generate SEO title
  useEffect(() => {
    if (formData.title && !formData.seoTitle) {
      setFormData(prev => ({ ...prev, seoTitle: formData.title }));
    }
  }, [formData.title, formData.seoTitle]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddTag = () => {
    if (currentTag.trim() && !formData.tags.includes(currentTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim()]
      }));
      setCurrentTag('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const uploadedFile = await portfolioService.uploadFile(file);
      setFormData(prev => ({ 
        ...prev, 
        featuredImage: uploadedFile.$id 
      }));
      toast.success('Image uploaded successfully!');
    } catch (error) {
      toast.error('Failed to upload image');
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const insertTextAtCursor = (text) => {
    const textarea = document.getElementById('content-textarea');
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentContent = formData.content;
    
    const newContent = 
      currentContent.substring(0, start) + 
      text + 
      currentContent.substring(end);
    
    handleInputChange('content', newContent);
    
    // Set cursor position after inserted text
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + text.length, start + text.length);
    }, 0);
  };

  const insertCodeBlock = () => {
    const codeText = `\`\`\`${currentCodeBlock.language}\n${currentCodeBlock.code}\n\`\`\``;
    insertTextAtCursor(`\n\n${codeText}\n\n`);
    setShowCodeModal(false);
    setCurrentCodeBlock({ code: '', language: 'javascript', filename: '' });
  };

  const formatText = (format) => {
    const formats = {
      bold: '**text**',
      italic: '*text*',
      heading1: '# Heading 1',
      heading2: '## Heading 2',
      heading3: '### Heading 3',
      link: '[Link Text](URL)',
      quote: '> Quote text',
      list: '- List item',
      orderedList: '1. List item'
    };
    
    insertTextAtCursor(formats[format] || '');
  };

  const handleSave = async () => {
    if (!formData.title || !formData.content || !formData.categoryId) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const postData = {
        ...formData,
        publishedAt: formData.status === 'published' ? new Date().toISOString() : null
      };

      let result;
      if (editPost) {
        result = await portfolioService.updateBlogPost(editPost.$id, postData);
      } else {
        result = await portfolioService.createBlogPost(postData);
      }

      toast.success(`Blog post ${editPost ? 'updated' : 'created'} successfully!`);
      onSave(result);
      onClose();
    } catch (error) {
      toast.error(`Failed to ${editPost ? 'update' : 'create'} blog post`);
      console.error('Save error:', error);
    }
  };

  const renderPreview = () => {
    let processedContent = formData.content;

    // Process code blocks
    processedContent = processedContent.replace(
      /```(\w+)?\n([\s\S]*?)```/g,
      (match, language = 'text', code) => {
        return `<div class="code-preview">${code}</div>`;
      }
    );

    return (
      <div className="prose prose-lg max-w-none dark:prose-invert">
        <h1>{formData.title}</h1>
        {formData.excerpt && <p className="text-xl text-gray-600">{formData.excerpt}</p>}
        <div dangerouslySetInnerHTML={{ __html: processedContent.replace(/\n/g, '<br>') }} />
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-800">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {editPost ? 'Edit Blog Post' : 'Create New Blog Post'}
            </h2>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </motion.button>
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            {[
              { id: 'content', label: 'Content', icon: FileText },
              { id: 'settings', label: 'Settings', icon: Settings },
              { id: 'preview', label: 'Preview', icon: Eye }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${
                  activeTab === id
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                {label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[60vh]">
            {activeTab === 'content' && (
              <div className="space-y-6">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Enter blog post title..."
                  />
                </div>

                {/* Excerpt */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Excerpt
                  </label>
                  <textarea
                    value={formData.excerpt}
                    onChange={(e) => handleInputChange('excerpt', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                    placeholder="Brief description of the post..."
                  />
                </div>

                {/* Formatting Toolbar */}
                <div className="flex flex-wrap items-center gap-2 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => formatText('bold')}
                      className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                      title="Bold"
                    >
                      <Bold className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => formatText('italic')}
                      className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                      title="Italic"
                    >
                      <Italic className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="w-px h-6 bg-gray-300 dark:bg-gray-500" />
                  
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => formatText('heading1')}
                      className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                      title="Heading 1"
                    >
                      <Heading1 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => formatText('heading2')}
                      className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                      title="Heading 2"
                    >
                      <Heading2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => formatText('heading3')}
                      className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                      title="Heading 3"
                    >
                      <Heading3 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="w-px h-6 bg-gray-300 dark:bg-gray-500" />

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => formatText('link')}
                      className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                      title="Link"
                    >
                      <Link className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => formatText('quote')}
                      className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                      title="Quote"
                    >
                      <Quote className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="w-px h-6 bg-gray-300 dark:bg-gray-500" />

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => formatText('list')}
                      className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                      title="Bullet List"
                    >
                      <List className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => formatText('orderedList')}
                      className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                      title="Numbered List"
                    >
                      <ListOrdered className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="w-px h-6 bg-gray-300 dark:bg-gray-500" />

                  <button
                    onClick={() => setShowCodeModal(true)}
                    className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Code className="w-4 h-4" />
                    Insert Code
                  </button>
                </div>

                {/* Content Editor */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Content *
                  </label>
                  <textarea
                    id="content-textarea"
                    value={formData.content}
                    onChange={(e) => handleInputChange('content', e.target.value)}
                    rows={20}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-sm resize-none"
                    placeholder="Write your blog content here... Use markdown formatting."
                  />
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Settings */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Basic Settings</h3>
                  
                  {/* Category */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Category *
                    </label>
                    <select
                      value={formData.categoryId}
                      onChange={(e) => handleInputChange('categoryId', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="">Select Category</option>
                      {categories.map(category => (
                        <option key={category.$id} value={category.$id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Status */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => handleInputChange('status', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>

                  {/* Featured */}
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="featured"
                      checked={formData.featured}
                      onChange={(e) => handleInputChange('featured', e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="featured" className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                      Featured Post
                    </label>
                  </div>

                  {/* Read Time */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Read Time (minutes)
                    </label>
                    <input
                      type="number"
                      value={formData.readTime}
                      onChange={(e) => handleInputChange('readTime', parseInt(e.target.value) || 0)}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      min="1"
                      max="60"
                    />
                  </div>
                </div>

                {/* Advanced Settings */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Advanced Settings</h3>
                  
                  {/* Slug */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      URL Slug
                    </label>
                    <input
                      type="text"
                      value={formData.slug}
                      onChange={(e) => handleInputChange('slug', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="url-friendly-slug"
                    />
                  </div>

                  {/* Tags */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Tags
                    </label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={currentTag}
                        onChange={(e) => setCurrentTag(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                        className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="Add tag..."
                      />
                      <button
                        onClick={handleAddTag}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm"
                        >
                          {tag}
                          <button
                            onClick={() => handleRemoveTag(tag)}
                            className="hover:text-red-500"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Featured Image */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Featured Image
                    </label>
                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-6 text-center">
                      {formData.featuredImage ? (
                        <div className="relative">
                          <img
                            src={portfolioService.getFileView(formData.featuredImage)}
                            alt="Featured"
                            className="max-h-32 mx-auto rounded-lg"
                          />
                          <button
                            onClick={() => handleInputChange('featuredImage', null)}
                            className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div>
                          <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                            {isUploading ? 'Uploading...' : 'Click to upload image'}
                          </p>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            disabled={isUploading}
                            className="hidden"
                            id="image-upload"
                          />
                          <label
                            htmlFor="image-upload"
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer inline-block"
                          >
                            Select Image
                          </label>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* SEO Settings */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900 dark:text-white">SEO Settings</h4>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        SEO Title
                      </label>
                      <input
                        type="text"
                        value={formData.seoTitle}
                        onChange={(e) => handleInputChange('seoTitle', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="SEO optimized title"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        SEO Description
                      </label>
                      <textarea
                        value={formData.seoDescription}
                        onChange={(e) => handleInputChange('seoDescription', e.target.value)}
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                        placeholder="SEO meta description"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'preview' && (
              <div className="bg-white dark:bg-gray-900 rounded-xl p-8 border border-gray-200 dark:border-gray-700">
                {renderPreview()}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {formData.content.length} characters • {formData.content.split(' ').length} words
            </div>
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="px-6 py-3 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleInputChange('status', 'draft')}
                className="px-6 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-colors"
              >
                Save Draft
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSave}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
              >
                <Save className="w-5 h-5" />
                {editPost ? 'Update Post' : 'Create Post'}
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Code Block Modal */}
        {showCodeModal && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-4 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Insert Code Block</h3>
              <button
                onClick={() => setShowCodeModal(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Language
                  </label>
                  <select
                    value={currentCodeBlock.language}
                    onChange={(e) => setCurrentCodeBlock(prev => ({ ...prev, language: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="javascript">JavaScript</option>
                    <option value="typescript">TypeScript</option>
                    <option value="python">Python</option>
                    <option value="java">Java</option>
                    <option value="cpp">C++</option>
                    <option value="css">CSS</option>
                    <option value="html">HTML</option>
                    <option value="jsx">React JSX</option>
                    <option value="php">PHP</option>
                    <option value="sql">SQL</option>
                    <option value="json">JSON</option>
                    <option value="bash">Bash</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Filename (optional)
                  </label>
                  <input
                    type="text"
                    value={currentCodeBlock.filename}
                    onChange={(e) => setCurrentCodeBlock(prev => ({ ...prev, filename: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="example.js"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Code
                </label>
                <textarea
                  value={currentCodeBlock.code}
                  onChange={(e) => setCurrentCodeBlock(prev => ({ ...prev, code: e.target.value }))}
                  rows={15}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-sm resize-none"
                  placeholder="Paste your code here..."
                />
              </div>

              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowCodeModal(false)}
                  className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={insertCodeBlock}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  disabled={!currentCodeBlock.code.trim()}
                >
                  Insert Code
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default CreateBlogPostModal;
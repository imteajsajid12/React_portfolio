import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageCircle, 
  Send, 
  Reply, 
  Heart, 
  MoreHorizontal,
  User,
  Calendar,
  Plus,
  Minus,
  Globe,
  Mail
} from 'lucide-react';
import toast from 'react-hot-toast';
import portfolioService from '../../services/portfolioService';

const EnhancedCommentSection = ({ postId, initialComments = [] }) => {
  const [comments, setComments] = useState(initialComments);
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  const [filterBy, setFilterBy] = useState('all');

  const [commentForm, setCommentForm] = useState({
    authorName: '',
    authorEmail: '',
    authorWebsite: '',
    content: '',
    parentId: null,
    isReply: false
  });

  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true);
        const response = await portfolioService.getBlogComments(postId);
        setComments(response.documents || []);
      } catch (error) {
        console.error('Error fetching comments:', error);
        toast.error('Failed to load comments');
      } finally {
        setLoading(false);
      }
    };
    
    fetchComments();
  }, [postId]);

  const handleFormChange = (field, value) => {
    setCommentForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    
    if (!commentForm.authorName.trim() || !commentForm.authorEmail.trim() || !commentForm.content.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      
      const commentData = {
        postId,
        parentId: replyingTo,
        authorName: commentForm.authorName.trim(),
        authorEmail: commentForm.authorEmail.trim(),
        authorWebsite: commentForm.authorWebsite.trim() || null,
        content: commentForm.content.trim(),
        status: 'approved', // Auto-approve for now
        isReply: !!replyingTo,
        likes: 0
      };

      const newComment = await portfolioService.createBlogComment(commentData);
      
      // Add to comments list
      setComments(prev => [newComment, ...prev]);
      
      // Reset form
      setCommentForm({
        authorName: '',
        authorEmail: '',
        authorWebsite: '',
        content: '',
        parentId: null,
        isReply: false
      });
      
      setShowCommentForm(false);
      setReplyingTo(null);
      
      toast.success('Comment posted successfully!');
    } catch (error) {
      console.error('Error posting comment:', error);
      toast.error('Failed to post comment');
    } finally {
      setLoading(false);
    }
  };

  const handleReply = (commentId) => {
    setReplyingTo(commentId);
    setShowCommentForm(true);
    setCommentForm(prev => ({ ...prev, parentId: commentId, isReply: true }));
  };

  const handleLikeComment = async () => {
    try {
      // Implement comment liking logic here
      toast.success('Comment liked!');
    } catch {
      toast.error('Failed to like comment');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const sortedComments = [...comments].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.$createdAt) - new Date(a.$createdAt);
      case 'oldest':
        return new Date(a.$createdAt) - new Date(b.$createdAt);
      case 'popular':
        return (b.likes || 0) - (a.likes || 0);
      default:
        return 0;
    }
  });

  const filteredComments = sortedComments.filter(comment => {
    if (filterBy === 'all') return true;
    if (filterBy === 'replies') return comment.isReply;
    if (filterBy === 'main') return !comment.isReply;
    return true;
  });

  const parentComments = filteredComments.filter(comment => !comment.parentId);
  const replyComments = filteredComments.filter(comment => comment.parentId);

  const getCommentReplies = (commentId) => {
    return replyComments.filter(reply => reply.parentId === commentId);
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="bg-white dark:bg-gray-800 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 lg:p-12 shadow-xl border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm mb-8 sm:mb-12 overflow-hidden"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div className="flex items-start sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
          <div className="flex items-start sm:items-center gap-2 sm:gap-3 flex-1 min-w-0">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="p-2 sm:p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl sm:rounded-2xl text-white shadow-lg flex-shrink-0"
            >
              <MessageCircle className="w-5 sm:w-6 h-5 sm:h-6" />
            </motion.div>
            <div className="flex-1 min-w-0">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white break-words">
                Discussion ({comments.length})
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 break-words">
                Join the conversation and share your thoughts
              </p>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto">
          {/* Sort Options */}
          {/* <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="flex-1 sm:flex-none px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="popular">Most Popular</option>
          </select> */}

          {/* Filter Options */}
          {/* <select
            value={filterBy}
            onChange={(e) => setFilterBy(e.target.value)}
            className="flex-1 sm:flex-none px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="all">All Comments</option>
            <option value="main">Main Comments</option>
            <option value="replies">Replies Only</option>
          </select> */}

          {/* Add Comment Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowCommentForm(!showCommentForm)}
            className={`flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl transition-all text-xs sm:text-sm font-medium flex-1 sm:flex-none ${
              showCommentForm
                ? 'bg-red-500 text-white hover:bg-red-600'
                : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700'
            }`}
          >
            {showCommentForm ? (
              <>
                <Minus className="w-3 sm:w-4 h-3 sm:h-4" />
                <span className="whitespace-nowrap">Cancel</span>
              </>
            ) : (
              <>
                <Plus className="w-3 sm:w-4 h-3 sm:h-4" />
                <span className="whitespace-nowrap">Add Comment</span>
              </>
            )}
          </motion.button>
        </div>
      </div>

      {/* Comment Form */}
      <AnimatePresence>
        {showCommentForm && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -20 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="mb-8 overflow-hidden"
          >
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-blue-200 dark:border-blue-700/50 overflow-hidden">
              {replyingTo && (
                <div className="mb-3 sm:mb-4 p-2 sm:p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg sm:rounded-xl">
                  <p className="text-xs sm:text-sm text-blue-700 dark:text-blue-300 break-words">
                    <Reply className="w-3 sm:w-4 h-3 sm:h-4 inline mr-1" />
                    Replying to a comment
                  </p>
                </div>
              )}

              <form onSubmit={handleSubmitComment} className="space-y-3 sm:space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2">
                      Name *
                    </label>
                    <div className="relative">
                      <User className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 w-4 sm:w-5 h-4 sm:h-5 text-gray-400" />
                      <input
                        type="text"
                        required
                        value={commentForm.authorName}
                        onChange={(e) => handleFormChange('authorName', e.target.value)}
                        className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="Your name"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2">
                      Email *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 w-4 sm:w-5 h-4 sm:h-5 text-gray-400" />
                      <input
                        type="email"
                        required
                        value={commentForm.authorEmail}
                        onChange={(e) => handleFormChange('authorEmail', e.target.value)}
                        className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2">
                    Website (optional)
                  </label>
                  <div className="relative">
                    <Globe className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 w-4 sm:w-5 h-4 sm:h-5 text-gray-400" />
                    <input
                      type="url"
                      value={commentForm.authorWebsite}
                      onChange={(e) => handleFormChange('authorWebsite', e.target.value)}
                      className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="https://yourwebsite.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2">
                    Comment *
                  </label>
                  <textarea
                    required
                    value={commentForm.content}
                    onChange={(e) => handleFormChange('content', e.target.value)}
                    rows={4}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                    placeholder="Share your thoughts..."
                  />
                  <div className="flex justify-between items-center mt-1.5 sm:mt-2">
                    <p className="text-xs text-gray-500 dark:text-gray-400 break-words">
                      Be respectful and constructive
                    </p>
                    <span className="text-xs text-gray-400 whitespace-nowrap ml-2">
                      {commentForm.content.length}/1000
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3 sm:pt-4">
                  <div className="flex items-center gap-4">
                    {replyingTo && (
                      <button
                        type="button"
                        onClick={() => {
                          setReplyingTo(null);
                          setCommentForm(prev => ({ ...prev, parentId: null, isReply: false }));
                        }}
                        className="text-xs sm:text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                      >
                        Cancel Reply
                      </button>
                    )}
                  </div>

                  <div className="flex gap-2 sm:gap-3">
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setShowCommentForm(false);
                        setReplyingTo(null);
                        setCommentForm({
                          authorName: '',
                          authorEmail: '',
                          authorWebsite: '',
                          content: '',
                          parentId: null,
                          isReply: false
                        });
                      }}
                      className="flex-1 sm:flex-none px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                    >
                      Cancel
                    </motion.button>

                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      disabled={loading}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-2 text-xs sm:text-sm bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg sm:rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all disabled:opacity-50"
                    >
                      {loading ? (
                        <div className="w-3 sm:w-4 h-3 sm:h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <Send className="w-3 sm:w-4 h-3 sm:h-4" />
                      )}
                      <span className="whitespace-nowrap">{replyingTo ? 'Post Reply' : 'Post Comment'}</span>
                    </motion.button>
                  </div>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Comments List */}
      <div className="space-y-4 sm:space-y-6">
        {loading && comments.length === 0 ? (
          <div className="flex items-center justify-center py-8 sm:py-12">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-5 sm:w-6 h-5 sm:h-6 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
              <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">Loading comments...</p>
            </div>
          </div>
        ) : parentComments.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-8 sm:py-12"
          >
            <div className="w-16 sm:w-20 h-16 sm:h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <MessageCircle className="w-7 sm:w-8 h-7 sm:h-8 text-gray-400" />
            </div>
            <h4 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No comments yet
            </h4>
            <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mb-4 sm:mb-6 px-4">
              Be the first to share your thoughts on this post!
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowCommentForm(true)}
              className="px-5 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg sm:rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all"
            >
              Start Discussion
            </motion.button>
          </motion.div>
        ) : (
          <div className="space-y-4 sm:space-y-6">
            {parentComments.map((comment, index) => (
              <motion.div
                key={comment.$id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                {/* Main Comment */}
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl sm:rounded-2xl p-4 sm:p-6 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors overflow-hidden">
                  <div className="flex items-start gap-2 sm:gap-4">
                    {/* Avatar */}
                    <div className="flex-shrink-0">
                      <div className="w-10 sm:w-12 h-10 sm:h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-base sm:text-lg shadow-lg">
                        {comment.authorName.charAt(0).toUpperCase()}
                      </div>
                    </div>

                    {/* Comment Content */}
                    <div className="flex-1 min-w-0 overflow-hidden">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 mb-2">
                        <h4 className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white truncate">
                          {comment.authorWebsite ? (
                            <a
                              href={comment.authorWebsite}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors break-words"
                            >
                              {comment.authorName}
                            </a>
                          ) : (
                            comment.authorName
                          )}
                        </h4>
                        <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                          <Calendar className="w-3 h-3 flex-shrink-0" />
                          <span className="truncate">{formatDate(comment.$createdAt)}</span>
                        </span>
                      </div>

                      <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed mb-3 sm:mb-4 break-words overflow-wrap-anywhere">
                        {comment.content}
                      </p>

                      {/* Comment Actions */}
                      <div className="flex items-center gap-2 sm:gap-4">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={handleLikeComment}
                          className="flex items-center gap-1 px-2 sm:px-3 py-1 text-xs sm:text-sm text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                        >
                          <Heart className="w-3 sm:w-4 h-3 sm:h-4 flex-shrink-0" />
                          <span className="whitespace-nowrap">{comment.likes || 0}</span>
                        </motion.button>

                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleReply(comment.$id)}
                          className="flex items-center gap-1 px-2 sm:px-3 py-1 text-xs sm:text-sm text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
                        >
                          <Reply className="w-3 sm:w-4 h-3 sm:h-4 flex-shrink-0" />
                          <span className="whitespace-nowrap">Reply</span>
                        </motion.button>

                        <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Replies */}
                {getCommentReplies(comment.$id).length > 0 && (
                  <div className="ml-8 mt-4 space-y-4">
                    {getCommentReplies(comment.$id).map((reply) => (
                      <motion.div
                        key={reply.$id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-white dark:bg-gray-800 rounded-xl p-4 border-l-4 border-blue-500 shadow-sm"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                            {reply.authorName.charAt(0).toUpperCase()}
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h5 className="font-medium text-gray-900 dark:text-white text-sm">
                                {reply.authorName}
                              </h5>
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {formatDate(reply.$createdAt)}
                              </span>
                            </div>
                            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                              {reply.content}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Load More Button */}
      {comments.length > 5 && (
        <div className="text-center pt-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Load More Comments
          </motion.button>
        </div>
      )}
    </motion.section>
  );
};

EnhancedCommentSection.propTypes = {
  postId: PropTypes.string.isRequired,
  initialComments: PropTypes.array
};

export default EnhancedCommentSection;
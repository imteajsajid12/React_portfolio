import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { 
  Heart, 
  Bookmark, 
  BookmarkCheck, 
  Share2, 
  MessageCircle,
  Eye,
  Clock,
  User,
  Calendar
} from 'lucide-react';
import toast from 'react-hot-toast';
import portfolioService from '../../services/portfolioService';

const BlogEngagementBar = ({ post, onCommentClick }) => {
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [likesCount, setLikesCount] = useState(post?.likesCount || 0);
  const [bookmarksCount, setBookmarksCount] = useState(post?.bookmarksCount || 0);
  const [loading, setLoading] = useState({ like: false, bookmark: false, share: false });

  useEffect(() => {
    const checkEngagementStatus = async () => {
      if (!post?.$id) return;
      
      try {
        const sessionId = portfolioService.getSessionId();
        
        // Check if user has liked this post
        const likeStatus = await portfolioService.checkBlogPostLike(post.$id, sessionId);
        setLiked(!!likeStatus);

        // Check if user has bookmarked this post  
        const bookmarkStatus = await portfolioService.checkBlogPostBookmark(post.$id, sessionId);
        setBookmarked(!!bookmarkStatus);
      } catch (error) {
        console.error('Failed to check engagement status:', error);
      }
    };
    
    checkEngagementStatus();
  }, [post?.$id]);

  const handleLike = async () => {
    if (loading.like) return;
    
    try {
      setLoading(prev => ({ ...prev, like: true }));
      
      const result = await portfolioService.toggleBlogPostLike(
        post.$id, 
        portfolioService.getSessionId()
      );

      setLiked(result.liked);
      setLikesCount(result.likes);
      
      if (result.liked) {
        toast.success('Post liked! ❤️');
      } else {
        toast.success('Like removed');
      }
    } catch (error) {
      console.error('Failed to toggle like:', error);
      toast.error('Failed to update like');
    } finally {
      setLoading(prev => ({ ...prev, like: false }));
    }
  };

  const handleBookmark = async () => {
    if (loading.bookmark) return;
    
    try {
      setLoading(prev => ({ ...prev, bookmark: true }));
      
      const result = await portfolioService.toggleBlogPostBookmark(
        post.$id, 
        portfolioService.getSessionId()
      );

      setBookmarked(result.bookmarked);
      setBookmarksCount(result.bookmarks);
      
      if (result.bookmarked) {
        toast.success('Post bookmarked! 🔖');
      } else {
        toast.success('Bookmark removed');
      }
    } catch (error) {
      console.error('Failed to toggle bookmark:', error);
      toast.error('Failed to update bookmark');
    } finally {
      setLoading(prev => ({ ...prev, bookmark: false }));
    }
  };

  const handleShare = async () => {
    if (loading.share) return;
    
    try {
      setLoading(prev => ({ ...prev, share: true }));
      
      const url = `${window.location.origin}/blog/${post.slug}`;
      const text = `Check out this blog post: ${post.title}`;

      if (navigator.share) {
        await navigator.share({
          title: post.title,
          text: text,
          url: url
        });
        toast.success('Shared successfully!');
      } else {
        // Fallback to clipboard
        await navigator.clipboard.writeText(url);
        toast.success('Link copied to clipboard!');
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Failed to share:', error);
        toast.error('Failed to share post');
      }
    } finally {
      setLoading(prev => ({ ...prev, share: false }));
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatReadTime = (content) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    return `${minutes} min read`;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm">
      {/* Post Metadata */}
      <div className="p-6 border-b border-gray-200/50 dark:border-gray-700/50">
        <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4" />
            <span>{post.author || 'Anonymous'}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(post.$createdAt)}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>{formatReadTime(post.content || '')}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4" />
            <span>{post.views || 0} views</span>
          </div>
        </div>
      </div>

      {/* Engagement Actions */}
      <div className="p-6">
        <div className="flex items-center justify-between">
          {/* Left Side - Primary Actions */}
          <div className="flex items-center gap-1">
            {/* Like Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLike}
              disabled={loading.like}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all ${
                liked
                  ? 'bg-red-500 text-white shadow-lg shadow-red-500/25 hover:bg-red-600'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400'
              }`}
            >
              {loading.like ? (
                <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : (
                <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
              )}
              <span className="font-semibold">{likesCount}</span>
              <span className="hidden sm:inline">
                {likesCount === 1 ? 'Like' : 'Likes'}
              </span>
            </motion.button>

            {/* Comment Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onCommentClick}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 transition-all"
            >
              <MessageCircle className="w-5 h-5" />
              <span className="font-semibold">{post.commentsCount || 0}</span>
              <span className="hidden sm:inline">
                {(post.commentsCount || 0) === 1 ? 'Comment' : 'Comments'}
              </span>
            </motion.button>
          </div>

          {/* Right Side - Secondary Actions */}
          <div className="flex items-center gap-1">
            {/* Bookmark Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleBookmark}
              disabled={loading.bookmark}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all ${
                bookmarked
                  ? 'bg-yellow-500 text-white shadow-lg shadow-yellow-500/25 hover:bg-yellow-600'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 hover:text-yellow-600 dark:hover:text-yellow-400'
              }`}
            >
              {loading.bookmark ? (
                <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : bookmarked ? (
                <BookmarkCheck className="w-5 h-5 fill-current" />
              ) : (
                <Bookmark className="w-5 h-5" />
              )}
              <span className="font-semibold hidden sm:inline">
                {bookmarksCount}
              </span>
            </motion.button>

            {/* Share Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleShare}
              disabled={loading.share}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-green-600 dark:hover:text-green-400 transition-all"
            >
              {loading.share ? (
                <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : (
                <Share2 className="w-5 h-5" />
              )}
              <span className="hidden sm:inline font-medium">Share</span>
            </motion.button>
          </div>
        </div>

        {/* Engagement Stats */}
        <div className="mt-4 pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-4">
              {likesCount > 0 && (
                <span>
                  {likesCount} {likesCount === 1 ? 'person' : 'people'} liked this
                </span>
              )}
              {bookmarksCount > 0 && (
                <span>
                  {bookmarksCount} bookmark{bookmarksCount !== 1 ? 's' : ''}
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-4">
              {post.views > 0 && (
                <span>{post.views} views</span>
              )}
              <span>Published {formatDate(post.$createdAt)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

BlogEngagementBar.propTypes = {
  post: PropTypes.object.isRequired,
  onCommentClick: PropTypes.func
};

BlogEngagementBar.defaultProps = {
  onCommentClick: () => {}
};

export default BlogEngagementBar;
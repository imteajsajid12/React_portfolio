import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, vs } from 'react-syntax-highlighter/dist/esm/styles/prism';
import toast, { Toaster } from 'react-hot-toast';
import {
  ArrowLeft,
  Calendar,
  Clock,
  Eye,
  Heart,
  Share2,
  Bookmark,
  Copy,
  Check,
  User,
  Tag,
  ChevronUp,
  MessageCircle,
  ThumbsUp,
  Github,
  Twitter,
  Linkedin,
  Facebook,
  Link,
  Edit3,
  Save,
  X,
  Code2,
  Lightbulb,
  Zap,
  Target,
  BookOpen,
  Coffee,
  Star,
  TrendingUp,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Send,
  Reply,
  MoreHorizontal,
  Database,
  Terminal
} from 'lucide-react';
import portfolioService from '../../services/portfolioService';
import { useBlogPosts, useBlogCategories } from '../../hooks/usePortfolio';
import CodeBlock from './CodeBlock';
import BlogEngagementBar from './BlogEngagementBar';
import EnhancedCommentSection from './EnhancedCommentSection';
import SharedHeader from '../common/SharedHeader';

// Enhanced Blog Content Component with Advanced Code Highlighting
const EnhancedBlogContent = ({ content, isDarkMode, onCopyCode, copiedCode }) => {
  const [processedContent, setProcessedContent] = useState('');

  useEffect(() => {
    const processContent = () => {
      if (!content) {
        setProcessedContent('');
        return;
      }

      let processed = content;

      // Process markdown-style code blocks with enhanced styling
      processed = processed.replace(
        /```(\w+)?\n([\s\S]*?)```/g,
        (match, language = 'text', code) => {
          const codeId = `code-${Math.random().toString(36).substr(2, 9)}`;
          const cleanCode = code.trim();
          const languageDisplay = language.toUpperCase();

          return `
            <div class="code-block-wrapper relative group my-8 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-lg">
              <div class="flex items-center justify-between bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-700 px-6 py-3 border-b border-gray-200 dark:border-gray-600">
                <div class="flex items-center gap-3">
                  <div class="flex gap-1.5">
                    <div class="w-3 h-3 rounded-full bg-red-500"></div>
                    <div class="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div class="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <div class="flex items-center gap-2">
                    <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                    </svg>
                    <span class="text-sm font-semibold text-gray-700 dark:text-gray-300">${languageDisplay}</span>
                  </div>
                </div>
                <button
                  class="copy-btn flex items-center gap-2 px-3 py-1.5 text-xs bg-white dark:bg-gray-600 text-gray-600 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-500 transition-all duration-200 opacity-0 group-hover:opacity-100 border border-gray-200 dark:border-gray-500 shadow-sm"
                  data-code-id="${codeId}"
                  data-code-text="${encodeURIComponent(cleanCode)}"
                >
                  <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z"></path>
                    <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z"></path>
                  </svg>
                  <span class="font-medium">Copy</span>
                </button>
              </div>
              <div class="syntax-highlighter-container bg-gray-950 dark:bg-gray-900 relative">
                <pre class="text-gray-100 p-6 overflow-x-auto text-sm leading-relaxed font-mono"><code class="language-${language}">${cleanCode}</code></pre>
                <div class="absolute top-4 right-4 opacity-20">
                  <svg class="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                  </svg>
                </div>
              </div>
            </div>
          `;
        }
      );

      // Process inline code with better styling
      processed = processed.replace(
        /`([^`]+)`/g,
        '<code class="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-md text-sm font-mono border border-gray-200 dark:border-gray-700">$1</code>'
      );

      // Process headings with anchor links and better styling
      processed = processed.replace(
        /^(#{1,6})\s+(.+)$/gm,
        (match, hashes, text) => {
          const level = hashes.length;
          const id = text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
          const sizeClasses = {
            1: 'text-4xl font-bold mt-12 mb-6',
            2: 'text-3xl font-bold mt-10 mb-5',
            3: 'text-2xl font-semibold mt-8 mb-4',
            4: 'text-xl font-semibold mt-6 mb-3',
            5: 'text-lg font-semibold mt-4 mb-2',
            6: 'text-base font-semibold mt-3 mb-2'
          };

          return `<h${level} id="${id}" class="group relative ${sizeClasses[level]} text-gray-900 dark:text-white">
            <a href="#${id}" class="absolute -left-8 top-0 opacity-0 group-hover:opacity-100 text-blue-500 hover:text-blue-600 transition-opacity duration-200">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clip-rule="evenodd"></path>
              </svg>
            </a>
            ${text}
          </h${level}>`;
        }
      );

      // Process blockquotes with better styling
      processed = processed.replace(
        /^>\s+(.+)$/gm,
        '<blockquote class="border-l-4 border-blue-500 pl-6 py-2 my-6 bg-blue-50 dark:bg-blue-900/20 text-gray-700 dark:text-gray-300 italic rounded-r-lg">$1</blockquote>'
      );

      // Process lists with better styling
      processed = processed.replace(
        /^\*\s+(.+)$/gm,
        '<li class="mb-2 text-gray-700 dark:text-gray-300">$1</li>'
      );

      // Process bold and italic text
      processed = processed.replace(
        /\*\*(.+?)\*\*/g,
        '<strong class="font-semibold text-gray-900 dark:text-white">$1</strong>'
      );

      processed = processed.replace(
        /\*(.+?)\*/g,
        '<em class="italic text-gray-700 dark:text-gray-300">$1</em>'
      );

      // Process links with better styling
      processed = processed.replace(
        /\[([^\]]+)\]\(([^)]+)\)/g,
        '<a href="$2" class="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline decoration-2 underline-offset-2 transition-colors" target="_blank" rel="noopener noreferrer">$1</a>'
      );

      setProcessedContent(processed);
    };

    processContent();
  }, [content]);

  useEffect(() => {
    // Add click handlers for copy buttons
    const handleCopyClick = (e) => {
      if (e.target.closest('.copy-btn')) {
        const btn = e.target.closest('.copy-btn');
        const codeId = btn.getAttribute('data-code-id');
        const codeText = decodeURIComponent(btn.getAttribute('data-code-text'));
        onCopyCode(codeText, codeId);
      }
    };

    document.addEventListener('click', handleCopyClick);
    return () => document.removeEventListener('click', handleCopyClick);
  }, [onCopyCode]);

  return (
    <div
      className="blog-content prose prose-lg max-w-none dark:prose-invert"
      dangerouslySetInnerHTML={{ __html: processedContent }}
    />
  );
};

const EnhancedBlogDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState('');
  const [readingProgress, setReadingProgress] = useState(0);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [copiedCode, setCopiedCode] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [nextPost, setNextPost] = useState(null);
  const [prevPost, setPrevPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState({
    authorName: '',
    authorEmail: '',
    authorWebsite: '',
    content: ''
  });
  const [replyingTo, setReplyingTo] = useState(null);
  const [sessionId, setSessionId] = useState('');
  
  const contentRef = useRef(null);
  const { categories } = useBlogCategories();
  const { posts } = useBlogPosts();

  // Initialize session
  useEffect(() => {
    const session = portfolioService.getSessionId();
    setSessionId(session);
  }, []);

  // Fetch blog post by slug
  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        setError(null);
        const fetchedPost = await portfolioService.getBlogPostBySlug(slug);
        if (fetchedPost) {
          setPost(fetchedPost);
          setEditContent(fetchedPost.content || '');
          setLikes(fetchedPost.likes || 0);
          
          // Check if user has liked/bookmarked this post
          const [liked, bookmarked] = await Promise.all([
            portfolioService.checkBlogPostLike(fetchedPost.$id, sessionId),
            portfolioService.checkBlogPostBookmark(fetchedPost.$id, sessionId)
          ]);
          
          setIsLiked(liked);
          setIsBookmarked(bookmarked);
          
          // Increment view count
          await portfolioService.incrementBlogPostViews(fetchedPost.$id);
          
          // Fetch comments
          const commentsResponse = await portfolioService.getBlogComments(fetchedPost.$id);
          setComments(commentsResponse.documents || []);
        } else {
          setError('Blog post not found');
        }
      } catch (err) {
        setError(err.message);
        console.error('Error fetching blog post:', err);
      } finally {
        setLoading(false);
      }
    };

    if (slug && sessionId) {
      fetchPost();
    }
  }, [slug, sessionId]);

  // Find related posts and navigation
  useEffect(() => {
    if (post && posts) {
      // Find related posts (same category, excluding current post)
      const related = posts
        .filter(p => p.$id !== post.$id && p.categoryId === post.categoryId)
        .slice(0, 3);
      setRelatedPosts(related);

      // Find next and previous posts
      const currentIndex = posts.findIndex(p => p.$id === post.$id);
      if (currentIndex > 0) {
        setNextPost(posts[currentIndex - 1]);
      }
      if (currentIndex < posts.length - 1) {
        setPrevPost(posts[currentIndex + 1]);
      }
    }
  }, [post, posts]);

  // Reading progress tracking
  useEffect(() => {
    const handleScroll = () => {
      if (contentRef.current) {
        const element = contentRef.current;
        const totalHeight = element.scrollHeight - element.clientHeight;
        const progress = (element.scrollTop / totalHeight) * 100;
        setReadingProgress(Math.min(100, Math.max(0, progress)));
        setShowScrollTop(element.scrollTop > 300);
      }
    };

    const contentElement = contentRef.current;
    if (contentElement) {
      contentElement.addEventListener('scroll', handleScroll);
      return () => contentElement.removeEventListener('scroll', handleScroll);
    }
  }, []);

  // Dark mode detection
  useEffect(() => {
    const checkDarkMode = () => {
      setIsDarkMode(document.documentElement.classList.contains('dark'));
    };
    
    checkDarkMode();
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    
    return () => observer.disconnect();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const calculateReadingTime = (content) => {
    if (!content) return 0;
    const words = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
    const wordsPerMinute = 200;
    return Math.ceil(words / wordsPerMinute);
  };

  const formatTimeAgo = (dateString) => {
    const now = new Date();
    const postDate = new Date(dateString);
    const diffInSeconds = Math.floor((now - postDate) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    if (diffInSeconds < 2629746) return `${Math.floor(diffInSeconds / 604800)}w ago`;
    if (diffInSeconds < 31556952) return `${Math.floor(diffInSeconds / 2629746)}mo ago`;
    return `${Math.floor(diffInSeconds / 31556952)}y ago`;
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat.$id === categoryId);
    return category?.name || 'Uncategorized';
  };

  const getCategoryColor = (categoryId) => {
    const category = categories.find(cat => cat.$id === categoryId);
    return category?.color || '#3B82F6';
  };

  const copyToClipboard = async (text, codeId) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedCode(codeId);
      toast.success('Code copied to clipboard!', {
        duration: 2000,
        position: 'bottom-right',
      });
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (err) {
      toast.error('Failed to copy code');
    }
  };

  const handleShare = async (platform) => {
    const url = window.location.href;
    const title = post?.title || '';
    const text = post?.excerpt || '';

    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      copy: url
    };

    if (platform === 'copy') {
      try {
        await navigator.clipboard.writeText(url);
        toast.success('Link copied to clipboard!');
      } catch (err) {
        toast.error('Failed to copy link');
      }
    } else {
      window.open(shareUrls[platform], '_blank', 'width=600,height=400');
    }
  };

  const toggleBookmark = async () => {
    try {
      const result = await portfolioService.toggleBlogPostBookmark(post.$id, sessionId);
      setIsBookmarked(result.bookmarked);
      toast.success(result.bookmarked ? 'Added to bookmarks' : 'Removed from bookmarks');
    } catch (err) {
      toast.error('Failed to update bookmark');
    }
  };

  const toggleLike = async () => {
    try {
      const result = await portfolioService.toggleBlogPostLike(post.$id, sessionId);
      setIsLiked(result.liked);
      setLikes(result.likes);
      toast.success(result.liked ? 'Post liked!' : 'Like removed');
    } catch (err) {
      toast.error('Failed to update like');
    }
  };

  const scrollToTop = () => {
    if (contentRef.current) {
      contentRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSaveEdit = async () => {
    try {
      await portfolioService.updateBlogPost(post.$id, { content: editContent });
      setPost(prev => ({ ...prev, content: editContent }));
      setIsEditing(false);
      toast.success('Post updated successfully!');
    } catch (err) {
      toast.error('Failed to update post');
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.authorName || !newComment.authorEmail || !newComment.content) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const commentData = {
        ...newComment,
        postId: post.$id,
        parentId: replyingTo,
        isReply: !!replyingTo
      };

      const comment = await portfolioService.createBlogComment(commentData);
      setComments(prev => [comment, ...prev]);
      setNewComment({ authorName: '', authorEmail: '', authorWebsite: '', content: '' });
      setReplyingTo(null);
      toast.success('Comment posted successfully!');
    } catch (err) {
      toast.error('Failed to post comment');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading article...</p>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📝</div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {error || 'Article not found'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The article you're looking for doesn't exist or has been moved.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/blog')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Blog
          </motion.button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/20 to-indigo-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-indigo-950/20">
      {/* Shared Header */}
      <SharedHeader
        showBackButton={true}
        backTo="/blog"
        backLabel="Back to Blog"
      />

      <Toaster />

      {/* Floating Tech Elements Background - matching BlogPage */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-20 h-20 bg-blue-500/10 rounded-full animate-pulse"></div>
        <div className="absolute top-20 right-20 w-16 h-16 bg-purple-500/10 rounded-full animate-pulse delay-300"></div>
        <div className="absolute bottom-20 left-20 w-12 h-12 bg-green-500/10 rounded-full animate-pulse delay-700"></div>
        <div className="absolute bottom-10 right-10 w-24 h-24 bg-orange-500/10 rounded-full animate-pulse delay-500"></div>
        <div className="absolute top-1/3 right-1/4 w-8 h-8 bg-pink-500/10 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/3 left-1/4 w-14 h-14 bg-indigo-500/10 rounded-full animate-pulse delay-200"></div>
      </div>

      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 dark:bg-gray-700 z-50">
        <motion.div
          className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
          style={{ width: `${readingProgress}%` }}
          initial={{ width: 0 }}
          animate={{ width: `${readingProgress}%` }}
          transition={{ duration: 0.1 }}
        />
      </div>

      {/* Floating Action Buttons */}
      <div className="fixed right-6 bottom-6 flex flex-col gap-3 z-40">
        <AnimatePresence>
          {showScrollTop && (
            <motion.button
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              onClick={scrollToTop}
              className="p-3 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:shadow-xl transition-all border border-gray-200 dark:border-gray-700"
            >
              <ChevronUp className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </motion.button>
          )}
        </AnimatePresence>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={toggleBookmark}
          className={`p-3 rounded-full shadow-lg hover:shadow-xl transition-all ${
            isBookmarked
              ? 'bg-blue-500 text-white'
              : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700'
          }`}
        >
          <Bookmark className="w-5 h-5" />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={toggleLike}
          className={`p-3 rounded-full shadow-lg hover:shadow-xl transition-all ${
            isLiked
              ? 'bg-red-500 text-white'
              : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700'
          }`}
        >
          <Heart className="w-5 h-5" />
        </motion.button>
      </div>

      {/* Main Content */}
      <div ref={contentRef} className="overflow-y-auto h-screen pt-16">

        {/* Modern Tech Hero Section */}
        <motion.section
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0, y: 60 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.6, ease: "easeOut" }
            }
          }}
          className="relative bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 text-white py-24 overflow-hidden"
        >
          <div className="absolute inset-0">
            <div className="absolute inset-0 opacity-40"></div>
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-600/20 to-purple-600/20"></div>
          </div>

          <div className="relative max-w-7xl mx-auto px-6 text-center">
            {/* Floating Tech Icons */}
            <div className="absolute inset-0 overflow-hidden">
              <motion.div
                animate={{ y: [-20, 20, -20] }}
                transition={{ duration: 6, repeat: Infinity }}
                className="absolute top-20 left-20 text-blue-400/30"
              >
                <Code2 size={32} />
              </motion.div>
              <motion.div
                animate={{ y: [20, -20, 20] }}
                transition={{ duration: 8, repeat: Infinity, delay: 1 }}
                className="absolute top-40 right-32 text-purple-400/30"
              >
                <Database size={28} />
              </motion.div>
              <motion.div
                animate={{ y: [-15, 15, -15] }}
                transition={{ duration: 7, repeat: Infinity, delay: 2 }}
                className="absolute bottom-32 left-32 text-green-400/30"
              >
                <Terminal size={30} />
              </motion.div>
            </div>

            {/* Blog Post Category Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-4"
            >
              <span className="inline-flex items-center px-4 py-2 bg-blue-500/20 rounded-full text-blue-300 text-sm font-medium border border-blue-400/30">
                <BookOpen className="w-4 h-4 mr-2" />
                {getCategoryName(post?.categoryId) || 'Article'}
              </span>
            </motion.div>

            {/* Blog Post Title */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-blue-100 to-indigo-200 bg-clip-text text-transparent leading-tight"
            >
              {post?.title || 'Loading...'}
            </motion.h1>

            {/* Blog Post Excerpt */}
            {post?.excerpt && (
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed"
              >
                {post.excerpt}
              </motion.p>
            )}

            {/* Blog Post Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
            >
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400 mb-2">{post?.views || 0}</div>
                <div className="text-gray-300 text-sm">Views</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400 mb-2">{likes || 0}</div>
                <div className="text-gray-300 text-sm">Likes</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400 mb-2">{post?.readTime || '5'}</div>
                <div className="text-gray-300 text-sm">Min Read</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-400 mb-2">
                  {post?.createdAt ? new Date(post.createdAt).getFullYear() : new Date().getFullYear()}
                </div>
                <div className="text-gray-300 text-sm">Published</div>
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* Article Content */}
        <main className="max-w-6xl mx-auto px-6 py-12">
          {/* Tech-inspired Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="relative bg-gradient-to-br from-white to-blue-50/30 dark:from-gray-800 dark:to-gray-900 rounded-3xl p-8 md:p-12 mb-12 border border-gray-200/50 dark:border-gray-700/50 shadow-xl backdrop-blur-sm overflow-hidden"
          >
            {/* Background Tech Pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-4 right-4 w-32 h-32 border-2 border-blue-500 rounded-full"></div>
              <div className="absolute bottom-4 left-4 w-24 h-24 border-2 border-purple-500 rounded-lg rotate-45"></div>
              <div className="absolute top-1/2 left-1/2 w-16 h-16 border-2 border-green-500 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
            </div>

            <motion.article
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="relative z-10"
            >
              {/* Category and Featured Tags */}
              <div className="flex flex-wrap items-center gap-3 mb-8">
                <motion.span
                  whileHover={{ scale: 1.05 }}
                  className="px-6 py-2 text-sm font-bold text-white rounded-full shadow-lg backdrop-blur-sm"
                  style={{ backgroundColor: getCategoryColor(post.categoryId) }}
                >
                  {getCategoryName(post.categoryId)}
                </motion.span>
                {post.featured && (
                  <motion.span 
                    whileHover={{ scale: 1.05 }}
                    className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-sm font-bold rounded-full flex items-center gap-2 shadow-lg"
                  >
                    <Star className="w-4 h-4" />
                    Featured Article
                  </motion.span>
                )}
              </div>

              {/* Title with Gradient Effect */}
              <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 dark:from-white dark:via-blue-300 dark:to-purple-300 mb-8 leading-tight">
                {post.title}
              </h1>

              {post.excerpt && (
                <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-10 leading-relaxed font-light">
                  {post.excerpt}
                </p>
              )}

              {/* Enhanced Stats Row */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-10">
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="bg-white/50 dark:bg-gray-700/30 backdrop-blur-sm rounded-xl p-4 text-center border border-gray-200/30 dark:border-gray-600/30"
                >
                  <Calendar className="w-5 h-5 mx-auto mb-2 text-blue-500" />
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Published</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {formatTimeAgo(post.publishedAt || post.$createdAt)}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    {formatDate(post.publishedAt || post.$createdAt)}
                  </p>
                </motion.div>
                
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="bg-white/50 dark:bg-gray-700/30 backdrop-blur-sm rounded-xl p-4 text-center border border-gray-200/30 dark:border-gray-600/30"
                >
                  <Clock className="w-5 h-5 mx-auto mb-2 text-green-500" />
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {post.readTime || calculateReadingTime(post.content)} min
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">read time</p>
                </motion.div>
                
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="bg-white/50 dark:bg-gray-700/30 backdrop-blur-sm rounded-xl p-4 text-center border border-gray-200/30 dark:border-gray-600/30"
                >
                  <Eye className="w-5 h-5 mx-auto mb-2 text-purple-500" />
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{post.views || 0}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">views</p>
                </motion.div>
                
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="bg-white/50 dark:bg-gray-700/30 backdrop-blur-sm rounded-xl p-4 text-center border border-gray-200/30 dark:border-gray-600/30"
                >
                  <Heart className="w-5 h-5 mx-auto mb-2 text-red-500" />
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{likes}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">likes</p>
                </motion.div>
                
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="bg-white/50 dark:bg-gray-700/30 backdrop-blur-sm rounded-xl p-4 text-center border border-gray-200/30 dark:border-gray-600/30"
                >
                  <MessageCircle className="w-5 h-5 mx-auto mb-2 text-orange-500" />
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{comments.length}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">comments</p>
                </motion.div>
              </div>

              {/* Featured Image with Advanced Styling */}
              {post.featuredImage && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                  className="relative rounded-3xl overflow-hidden shadow-2xl group"
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10"></div>
                  <img
                    src={portfolioService.getFileView(post.featuredImage)}
                    alt={post.title}
                    className="w-full h-64 md:h-96 object-cover group-hover:scale-105 transition-transform duration-700"
                    onError={(e) => e.target.style.display = 'none'}
                  />
                  <div className="absolute bottom-6 left-6 right-6 z-20">
                    <div className="bg-white/20 backdrop-blur-md rounded-2xl p-4 text-white">
                      <p className="text-sm opacity-90">Featured Image</p>
                      <p className="font-semibold">{post.title}</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.article>
          </motion.div>

          {/* Content Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white dark:bg-gray-800 rounded-3xl p-8 md:p-12 shadow-xl border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm mb-12"
          >
            <div className="prose prose-lg max-w-none dark:prose-invert">
              {isEditing ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Edit Content</h3>
                    <div className="flex gap-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleSaveEdit}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <Save className="w-4 h-4" />
                        Save
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsEditing(false)}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                      >
                        <X className="w-4 h-4" />
                        Cancel
                      </motion.button>
                    </div>
                  </div>
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="w-full h-96 p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Write your blog content here..."
                  />
                </div>
              ) : (
                <EnhancedBlogContent
                  content={post.content || post.excerpt || 'No content available.'}
                  isDarkMode={isDarkMode}
                  onCopyCode={copyToClipboard}
                  copiedCode={copiedCode}
                />
              )}
            </div>
          </motion.div>

          {/* Tags Section */}
          {post.tags && post.tags.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white dark:bg-gray-800 rounded-3xl p-8 md:p-12 shadow-xl border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm mb-12"
            >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Tag className="w-5 h-5" />
                  Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
            </motion.div>
          )}

          {/* Blog Engagement Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-12"
          >
            <BlogEngagementBar 
              post={post} 
              onCommentClick={() => {
                const commentSection = document.getElementById('comment-section');
                if (commentSection) {
                  commentSection.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            />
          </motion.div>

          {/* Enhanced Comment Section */}
          <div id="comment-section">
            <EnhancedCommentSection 
              postId={post.$id} 
              initialComments={comments}
            />
          </div>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-white dark:bg-gray-800 rounded-3xl p-8 md:p-12 shadow-xl border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm mb-12"
            >
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 flex items-center gap-2">
                  <BookOpen className="w-6 h-6" />
                  Related Articles
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {relatedPosts.map((relatedPost) => (
                    <motion.article
                      key={relatedPost.$id}
                      whileHover={{ y: -5 }}
                      onClick={() => navigate(`/blog/${relatedPost.slug || relatedPost.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')}`)}
                      className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 cursor-pointer"
                    >
                      {relatedPost.featuredImage && (
                        <div className="h-48 overflow-hidden">
                          <img
                            src={portfolioService.getFileView(relatedPost.featuredImage)}
                            alt={relatedPost.title}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                            onError={(e) => e.target.style.display = 'none'}
                          />
                        </div>
                      )}
                      <div className="p-6">
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                          {relatedPost.title}
                        </h4>
                        <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3 mb-4">
                          {relatedPost.excerpt}
                        </p>
                        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                          <span>{formatDate(relatedPost.publishedAt || relatedPost.$createdAt)}</span>
                          <span>{relatedPost.readTime} min read</span>
                        </div>
                      </div>
                    </motion.article>
                  ))}
                </div>
            </motion.section>
          )}

          {/* Navigation */}
          {(nextPost || prevPost) && (
            <motion.nav
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 rounded-3xl p-8 shadow-xl border border-gray-200/50 dark:border-gray-700/50"
            >
                <div className="flex justify-between items-center">
                  {prevPost ? (
                    <motion.button
                      whileHover={{ x: -5 }}
                      onClick={() => navigate(`/blog/${prevPost.slug || prevPost.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')}`)}
                      className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all max-w-sm"
                    >
                      <ChevronLeft className="w-5 h-5 text-gray-400" />
                      <div className="text-left">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Previous</p>
                        <p className="font-semibold text-gray-900 dark:text-white line-clamp-1">
                          {prevPost.title}
                        </p>
                      </div>
                    </motion.button>
                  ) : (
                    <div></div>
                  )}

                  {nextPost ? (
                    <motion.button
                      whileHover={{ x: 5 }}
                      onClick={() => navigate(`/blog/${nextPost.slug || nextPost.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')}`)}
                      className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all max-w-sm"
                    >
                      <div className="text-right">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Next</p>
                        <p className="font-semibold text-gray-900 dark:text-white line-clamp-1">
                          {nextPost.title}
                        </p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </motion.button>
                  ) : (
                    <div></div>
                  )}
                </div>
            </motion.nav>
          )}
        </main>
      </div>
    </div>
  );
};

export default EnhancedBlogDetailPage;

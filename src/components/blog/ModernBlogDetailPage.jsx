import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import toast, { Toaster } from 'react-hot-toast';
import './ModernBlogDetailPage.css';
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
  Link as LinkIcon,
  Menu,
  X,
  Maximize,
  Minimize,
  Sun,
  Moon,
  Star,
  TrendingUp,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Send,
  Search,
  Filter,
  MoreVertical,
  Download,
  Code2,
  FileCode,
  Terminal,
  Sparkles,
  Zap,
  Coffee,
  BookOpen,
  Award,
  Target,
  Lightbulb,
  ExternalLink
} from 'lucide-react';
import portfolioService from '../../services/portfolioService';
import { useBlogPosts, useBlogCategories, useAbout } from '../../hooks/usePortfolio';
import BlogEngagementBar from './BlogEngagementBar';
import EnhancedCommentSection from './EnhancedCommentSection';
import SharedHeader from '../common/SharedHeader';

// Modern Code Block Component with Enhanced Styling
const ModernCodeBlock = ({ code, language, isDarkMode, onCopy, isCopied }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const lines = code.split('\n');
  const shouldCollapse = lines.length > 15;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="my-6 sm:my-8 group relative w-full overflow-hidden"
    >
      {/* Code Header */}
      <div className="flex items-center justify-between bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 px-3 sm:px-6 py-3 rounded-t-xl sm:rounded-t-2xl border border-gray-700 dark:border-gray-600">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-shrink overflow-hidden">
          {/* Traffic Lights */}
          <div className="hidden sm:flex gap-2 flex-shrink-0">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          
          {/* Language Badge */}
          <div className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex-shrink-0">
            <FileCode className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-white flex-shrink-0" />
            <span className="text-xs font-bold text-white uppercase tracking-wider whitespace-nowrap">
              {language || 'code'}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0 ml-2">
          {shouldCollapse && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsExpanded(!isExpanded)}
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg transition-colors"
            >
              {isExpanded ? <Minimize className="w-3 h-3" /> : <Maximize className="w-3 h-3" />}
              <span className="hidden md:inline">{isExpanded ? 'Collapse' : 'Expand'}</span>
            </motion.button>
          )}
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onCopy}
            className={`flex items-center gap-1.5 px-2 sm:px-3 py-1.5 text-xs rounded-lg transition-all duration-200 flex-shrink-0 ${
              isCopied
                ? 'bg-green-600 text-white'
                : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
            }`}
          >
            {isCopied ? (
              <>
                <Check className="w-3 sm:w-3.5 h-3 sm:h-3.5" />
                <span className="hidden sm:inline">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3 sm:w-3.5 h-3 sm:h-3.5" />
                <span className="hidden sm:inline">Copy</span>
              </>
            )}
          </motion.button>
        </div>
      </div>

      {/* Code Content */}
      <div className={`relative overflow-x-auto rounded-b-xl sm:rounded-b-2xl border-x border-b border-gray-700 dark:border-gray-600 ${
        !isExpanded && shouldCollapse ? 'max-h-96' : ''
      }`}>
        <SyntaxHighlighter
          language={language || 'text'}
          style={isDarkMode ? oneDark : oneLight}
          showLineNumbers={true}
          wrapLines={false}
          wrapLongLines={false}
          customStyle={{
            margin: 0,
            borderRadius: 0,
            background: isDarkMode ? '#1a1b26' : '#fafafa',
            fontSize: '0.8125rem',
            padding: '1rem',
            lineHeight: '1.6',
            maxWidth: '100%',
            overflowX: 'auto',
          }}
          lineNumberStyle={{
            minWidth: '2.5em',
            paddingRight: '0.75em',
            color: isDarkMode ? '#565f89' : '#9ca3af',
            userSelect: 'none',
            fontSize: '0.75rem',
          }}
          codeTagProps={{
            style: {
              fontSize: '0.8125rem',
              fontFamily: "'Fira Code', 'Monaco', 'Courier New', monospace",
            }
          }}
        >
          {code}
        </SyntaxHighlighter>

        {/* Gradient Overlay for Collapsed State */}
        {!isExpanded && shouldCollapse && (
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-gray-900 to-transparent pointer-events-none"></div>
        )}
      </div>

      {/* Line Counter */}
      <div className="hidden lg:block absolute top-3 right-40 text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">
        {lines.length} {lines.length === 1 ? 'line' : 'lines'}
      </div>
    </motion.div>
  );
};

// Enhanced Blog Content Renderer
const ModernBlogContent = ({ content, isDarkMode }) => {
  const [processedElements, setProcessedElements] = useState([]);
  const [copiedCodeId, setCopiedCodeId] = useState(null);

  useEffect(() => {
    if (!content) {
      setProcessedElements([]);
      return;
    }

    const elements = [];
    let currentIndex = 0;

    // Process code blocks
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
    let match;
    let lastIndex = 0;

    while ((match = codeBlockRegex.exec(content)) !== null) {
      // Add text before code block
      if (match.index > lastIndex) {
        const textContent = content.substring(lastIndex, match.index);
        if (textContent.trim()) {
          elements.push({
            type: 'text',
            content: textContent,
            id: `text-${currentIndex++}`,
          });
        }
      }

      // Add code block
      elements.push({
        type: 'code',
        language: match[1] || 'text',
        content: match[2].trim(),
        id: `code-${currentIndex++}`,
      });

      lastIndex = match.index + match[0].length;
    }

    // Add remaining text
    if (lastIndex < content.length) {
      const textContent = content.substring(lastIndex);
      if (textContent.trim()) {
        elements.push({
          type: 'text',
          content: textContent,
          id: `text-${currentIndex++}`,
        });
      }
    }

    setProcessedElements(elements);
  }, [content]);

  const handleCopyCode = async (code, codeId) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCodeId(codeId);
      toast.success('Code copied to clipboard!', {
        duration: 2000,
        icon: '✨',
      });
      setTimeout(() => setCopiedCodeId(null), 2000);
    } catch (err) {
      toast.error('Failed to copy code');
    }
  };

  const processTextContent = (text) => {
    let processed = text;

    // Process headings
    processed = processed.replace(
      /^(#{1,6})\s+(.+)$/gm,
      (match, hashes, text) => {
        const level = hashes.length;
        const id = text
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-');
        const sizeClasses = {
          1: 'text-3xl sm:text-4xl md:text-5xl font-black mt-12 sm:mt-16 mb-6 sm:mb-8',
          2: 'text-2xl sm:text-3xl md:text-4xl font-bold mt-10 sm:mt-12 mb-5 sm:mb-6',
          3: 'text-xl sm:text-2xl md:text-3xl font-bold mt-8 sm:mt-10 mb-4 sm:mb-5',
          4: 'text-lg sm:text-xl md:text-2xl font-semibold mt-6 sm:mt-8 mb-3 sm:mb-4',
          5: 'text-base sm:text-lg md:text-xl font-semibold mt-5 sm:mt-6 mb-2 sm:mb-3',
          6: 'text-sm sm:text-base md:text-lg font-semibold mt-4 mb-2',
        };

        const gradients = {
          1: 'from-blue-600 via-purple-600 to-pink-600',
          2: 'from-cyan-600 via-blue-600 to-purple-600',
          3: 'from-green-600 via-teal-600 to-cyan-600',
          4: 'from-orange-600 via-red-600 to-pink-600',
          5: 'from-yellow-600 via-orange-600 to-red-600',
          6: 'from-indigo-600 via-purple-600 to-pink-600',
        };

        return `
          <h${level} id="${id}" class="group relative ${sizeClasses[level]} bg-gradient-to-r ${gradients[level]} bg-clip-text text-transparent break-words">
            <a href="#${id}" class="hidden lg:block absolute -left-10 top-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <span class="text-blue-500 text-2xl">#</span>
            </a>
            ${text}
          </h${level}>
        `;
      }
    );

    // Process inline code
    processed = processed.replace(
      /`([^`]+)`/g,
      '<code class="px-1.5 sm:px-2 py-0.5 sm:py-1 mx-0.5 sm:mx-1 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 text-blue-600 dark:text-blue-400 rounded text-xs sm:text-sm font-mono border border-blue-200 dark:border-gray-600 shadow-sm break-words">$1</code>'
    );

    // Process blockquotes
    processed = processed.replace(
      /^>\s+(.+)$/gm,
      `<blockquote class="relative border-l-4 border-blue-500 pl-4 sm:pl-6 pr-4 sm:pr-6 py-3 sm:py-4 my-6 sm:my-8 bg-gradient-to-r from-blue-50 to-transparent dark:from-blue-900/20 dark:to-transparent rounded-r-xl">
        <div class="absolute left-2 sm:left-3 top-3 sm:top-4 text-blue-500 opacity-30">
          <svg class="w-6 sm:w-8 h-6 sm:h-8" fill="currentColor" viewBox="0 0 24 24">
            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
          </svg>
        </div>
        <p class="text-gray-700 dark:text-gray-300 italic text-base sm:text-lg leading-relaxed break-words">$1</p>
      </blockquote>`
    );

    // Process unordered lists
    processed = processed.replace(
      /^\*\s+(.+)$/gm,
      '<li class="mb-2 sm:mb-3 text-gray-700 dark:text-gray-300 flex items-start gap-2 sm:gap-3 break-words"><span class="mt-2 w-1.5 sm:w-2 h-1.5 sm:h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex-shrink-0"></span><span class="flex-1 min-w-0">$1</span></li>'
    );

    // Process bold text
    processed = processed.replace(
      /\*\*(.+?)\*\*/g,
      '<strong class="font-bold text-gray-900 dark:text-white bg-gradient-to-r from-yellow-200 to-yellow-100 dark:from-yellow-900/30 dark:to-transparent px-0.5 sm:px-1 rounded break-words">$1</strong>'
    );

    // Process italic text
    processed = processed.replace(
      /\*(.+?)\*/g,
      '<em class="italic text-gray-700 dark:text-gray-300 break-words">$1</em>'
    );

    // Process links
    processed = processed.replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2" class="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline decoration-2 underline-offset-4 decoration-blue-400 hover:decoration-blue-600 transition-all duration-200 font-medium break-words" target="_blank" rel="noopener noreferrer">$1 <svg class="inline w-3 h-3 ml-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg></a>'
    );

    // Process paragraphs
    processed = processed.replace(
      /^(?!<[h|blockquote|li])(.*\S.*)$/gm,
      '<p class="mb-4 sm:mb-6 text-gray-800 dark:text-gray-200 text-base sm:text-lg leading-relaxed break-words">$1</p>'
    );

    return processed;
  };

  return (
    <div className="modern-blog-content">
      {processedElements.map((element) => {
        if (element.type === 'code') {
          return (
            <ModernCodeBlock
              key={element.id}
              code={element.content}
              language={element.language}
              isDarkMode={isDarkMode}
              onCopy={() => handleCopyCode(element.content, element.id)}
              isCopied={copiedCodeId === element.id}
            />
          );
        } else {
          return (
            <div
              key={element.id}
              dangerouslySetInnerHTML={{
                __html: processTextContent(element.content),
              }}
            />
          );
        }
      })}
    </div>
  );
};

// Floating Table of Contents
const TableOfContents = ({ content, isVisible }) => {
  const [headings, setHeadings] = useState([]);
  const [activeId, setActiveId] = useState('');

  useEffect(() => {
    if (!content) return;

    const headingRegex = /^(#{1,6})\s+(.+)$/gm;
    const found = [];
    let match;

    while ((match = headingRegex.exec(content)) !== null) {
      const level = match[1].length;
      const text = match[2];
      const id = text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-');

      found.push({ level, text, id });
    }

    setHeadings(found);
  }, [content]);

  useEffect(() => {
    const handleScroll = () => {
      const headingElements = headings
        .map((h) => document.getElementById(h.id))
        .filter(Boolean);

      for (const element of headingElements) {
        const rect = element.getBoundingClientRect();
        if (rect.top >= 0 && rect.top <= 200) {
          setActiveId(element.id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [headings]);

  if (!isVisible || headings.length === 0) return null;

  return (
    <motion.aside
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="hidden xl:block fixed right-8 top-32 w-64 max-h-[calc(100vh-200px)] overflow-y-auto"
    >
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h3 className="font-bold text-gray-900 dark:text-white">
            Table of Contents
          </h3>
        </div>
        
        <nav className="space-y-2">
          {headings.map((heading) => (
            <a
              key={heading.id}
              href={`#${heading.id}`}
              className={`block py-2 px-3 rounded-lg text-sm transition-all duration-200 ${
                activeId === heading.id
                  ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-semibold'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
              style={{ paddingLeft: `${heading.level * 0.75}rem` }}
            >
              {heading.text}
            </a>
          ))}
        </nav>
      </div>
    </motion.aside>
  );
};

// Main Component
const ModernBlogDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [readingProgress, setReadingProgress] = useState(0);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [nextPost, setNextPost] = useState(null);
  const [prevPost, setPrevPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [sessionId, setSessionId] = useState('');
  const [showToc, setShowToc] = useState(true);
  const [isFullWidth, setIsFullWidth] = useState(false);

  const contentRef = useRef(null);
  const { categories } = useBlogCategories();
  const { posts } = useBlogPosts();
  const { about } = useAbout();

  // Initialize session
  useEffect(() => {
    const session = portfolioService.getSessionId();
    setSessionId(session);
  }, []);

  // Fetch blog post
  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        setError(null);
        const fetchedPost = await portfolioService.getBlogPostBySlug(slug);
        
        if (fetchedPost) {
          setPost(fetchedPost);
          setLikes(fetchedPost.likes || 0);

          // Check engagement status
          const [liked, bookmarked] = await Promise.all([
            portfolioService.checkBlogPostLike(fetchedPost.$id, sessionId),
            portfolioService.checkBlogPostBookmark(fetchedPost.$id, sessionId),
          ]);

          setIsLiked(liked);
          setIsBookmarked(bookmarked);

          // Increment view count
          await portfolioService.incrementBlogPostViews(fetchedPost.$id);

          // Fetch comments
          const commentsResponse = await portfolioService.getBlogComments(
            fetchedPost.$id
          );
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

  // Find related posts
  useEffect(() => {
    if (post && posts) {
      const related = posts
        .filter((p) => p.$id !== post.$id && p.categoryId === post.categoryId)
        .slice(0, 3);
      setRelatedPosts(related);

      const currentIndex = posts.findIndex((p) => p.$id === post.$id);
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
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const progress = (scrollTop / (documentHeight - windowHeight)) * 100;
      
      setReadingProgress(Math.min(100, Math.max(0, progress)));
      setShowScrollTop(scrollTop > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Dark mode detection
  useEffect(() => {
    const checkDarkMode = () => {
      setIsDarkMode(document.documentElement.classList.contains('dark'));
    };

    checkDarkMode();
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const calculateReadingTime = (content) => {
    if (!content) return 0;
    const words = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
    const wordsPerMinute = 200;
    return Math.ceil(words / wordsPerMinute);
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find((cat) => cat.$id === categoryId);
    return category?.name || 'Uncategorized';
  };

  const getCategoryColor = (categoryId) => {
    const category = categories.find((cat) => cat.$id === categoryId);
    return category?.color || '#3B82F6';
  };

  const toggleBookmark = async () => {
    try {
      const result = await portfolioService.toggleBlogPostBookmark(
        post.$id,
        sessionId
      );
      setIsBookmarked(result.bookmarked);
      toast.success(
        result.bookmarked ? '📚 Added to bookmarks' : 'Removed from bookmarks',
        {
          duration: 2000,
        }
      );
    } catch (err) {
      toast.error('Failed to update bookmark');
    }
  };

  const toggleLike = async () => {
    try {
      const result = await portfolioService.toggleBlogPostLike(
        post.$id,
        sessionId
      );
      setIsLiked(result.liked);
      setLikes(result.likes);
      toast.success(result.liked ? '❤️ Post liked!' : 'Like removed', {
        duration: 2000,
      });
    } catch (err) {
      toast.error('Failed to update like');
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleShare = async (platform) => {
    const url = window.location.href;
    const title = post?.title || '';

    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        title
      )}&url=${encodeURIComponent(url)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
        url
      )}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        url
      )}`,
      copy: url,
    };

    if (platform === 'copy') {
      try {
        await navigator.clipboard.writeText(url);
        toast.success('🔗 Link copied to clipboard!');
      } catch (err) {
        toast.error('Failed to copy link');
      }
    } else {
      window.open(shareUrls[platform], '_blank', 'width=600,height=400');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full mx-auto mb-6"
          />
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-gray-600 dark:text-gray-400 text-lg font-medium"
          >
            Loading amazing content...
          </motion.p>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="text-8xl mb-6"
          >
            📝
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold text-gray-900 dark:text-white mb-4"
          >
            {error || 'Article not found'}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-600 dark:text-gray-400 mb-8"
          >
            The article you're looking for doesn't exist or has been moved.
          </motion.p>
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/blog')}
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl hover:shadow-xl transition-all duration-300 font-semibold"
          >
            Back to Blog
          </motion.button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 overflow-x-hidden w-full">
      <SharedHeader showBackButton={true} backTo="/blog" backLabel="Blog" />
      <Toaster position="bottom-right" />

      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            opacity: [0.05, 0.1, 0.05],
          }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-blue-500 to-purple-500 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, -90, 0],
            opacity: [0.05, 0.1, 0.05],
          }}
          transition={{ duration: 25, repeat: Infinity }}
          className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-to-tr from-pink-500 to-orange-500 rounded-full blur-3xl"
        />
      </div>

      {/* Reading Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 z-50 origin-left shadow-lg"
        style={{ scaleX: readingProgress / 100 }}
        initial={{ scaleX: 0 }}
      />

      {/* Floating Action Buttons */}
      <div className="fixed right-4 sm:right-6 bottom-6 flex flex-col gap-3 z-40">
        <AnimatePresence>
          {showScrollTop && (
            <motion.button
              initial={{ opacity: 0, scale: 0, rotate: -180 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0, rotate: 180 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={scrollToTop}
              className="p-3 sm:p-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-2xl hover:shadow-blue-500/50 transition-all"
            >
              <ChevronUp className="w-4 sm:w-5 h-4 sm:h-5" />
            </motion.button>
          )}
        </AnimatePresence>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={toggleBookmark}
          className={`p-3 sm:p-4 rounded-full shadow-2xl transition-all ${
            isBookmarked
              ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-blue-500/50'
              : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:shadow-xl'
          }`}
        >
          <Bookmark className={`w-4 sm:w-5 h-4 sm:h-5 ${isBookmarked ? 'fill-current' : ''}`} />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={toggleLike}
          className={`p-3 sm:p-4 rounded-full shadow-2xl transition-all ${
            isLiked
              ? 'bg-gradient-to-r from-red-600 to-pink-600 text-white shadow-red-500/50'
              : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:shadow-xl'
          }`}
        >
          <Heart className={`w-4 sm:w-5 h-4 sm:h-5 ${isLiked ? 'fill-current' : ''}`} />
        </motion.button>
      </div>

      {/* Table of Contents */}
      <TableOfContents content={post.content} isVisible={showToc && !isFullWidth} />

      {/* Main Content */}
      <main className="relative pt-20 pb-12 sm:pb-20 w-full overflow-x-hidden">
        <div className={`mx-auto px-4 sm:px-6 transition-all duration-300 w-full ${
          isFullWidth ? 'max-w-7xl' : 'max-w-4xl'
        }`}>
          {/* Hero Section */}
          <motion.article
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12 sm:mb-16 w-full overflow-hidden"
          >
            {/* Category Badge */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex flex-wrap items-center gap-2 sm:gap-3 mb-4 sm:mb-6"
            >
              <motion.button
                whileHover={{ x: -5 }}
                onClick={() => navigate('/blog')}
                className="flex items-center gap-1.5 sm:gap-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
              >
                <ArrowLeft className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
                <span className="text-xs sm:text-sm font-medium">Back</span>
              </motion.button>

              <span className="text-gray-300 dark:text-gray-600">•</span>

              <span
                className="px-3 sm:px-4 py-1 sm:py-1.5 text-xs sm:text-sm font-bold text-white rounded-full shadow-lg"
                style={{
                  backgroundColor: getCategoryColor(post?.categoryId) || '#3B82F6',
                }}
              >
                {getCategoryName(post?.categoryId)}
              </span>

              {post.featured && (
                <motion.span
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="px-3 sm:px-4 py-1 sm:py-1.5 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs sm:text-sm font-bold rounded-full flex items-center gap-1.5 sm:gap-2 shadow-lg"
                >
                  <Star className="w-3 sm:w-4 h-3 sm:h-4" />
                  Featured
                </motion.span>
              )}
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 dark:from-white dark:via-blue-300 dark:to-purple-300 mb-4 sm:mb-6 leading-tight break-words"
            >
              {post.title}
            </motion.h1>

            {/* Excerpt */}
            {post.excerpt && (
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-base sm:text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-6 sm:mb-10 leading-relaxed font-light break-words"
              >
                {post.excerpt}
              </motion.p>
            )}

            {/* Meta Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap items-center gap-3 sm:gap-6 text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-6 sm:mb-8"
            >
              <div className="flex items-center gap-1.5 sm:gap-2">
                <User className="w-3.5 sm:w-4 h-3.5 sm:h-4 flex-shrink-0" />
                <span className="font-medium truncate">{post.author || 'Imteaj Sajid'}</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Calendar className="w-3.5 sm:w-4 h-3.5 sm:h-4 flex-shrink-0" />
                <span className="truncate">{formatDate(post.publishedAt || post.$createdAt)}</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Clock className="w-3.5 sm:w-4 h-3.5 sm:h-4 flex-shrink-0" />
                <span className="whitespace-nowrap">
                  {post.readTime || calculateReadingTime(post.content)} min read
                </span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Eye className="w-3.5 sm:w-4 h-3.5 sm:h-4 flex-shrink-0" />
                <span className="whitespace-nowrap">{post.views || 0} views</span>
              </div>
            </motion.div>

            {/* Engagement Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap items-center gap-2 sm:gap-4 p-4 sm:p-6 bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-xl sm:rounded-2xl border border-gray-200 dark:border-gray-700 shadow-xl mb-6 sm:mb-8"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleLike}
                className={`flex items-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base transition-all ${
                  isLiked
                    ? 'bg-gradient-to-r from-red-600 to-pink-600 text-white shadow-lg shadow-red-500/50'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                <Heart className={`w-4 sm:w-5 h-4 sm:h-5 ${isLiked ? 'fill-current' : ''}`} />
                <span>{likes}</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleBookmark}
                className={`flex items-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base transition-all ${
                  isBookmarked
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-500/50'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                <Bookmark className={`w-4 sm:w-5 h-4 sm:h-5 ${isBookmarked ? 'fill-current' : ''}`} />
                <span className="hidden sm:inline">Save</span>
              </motion.button>

              <motion.div
                className="relative"
                whileHover={{ scale: 1.05 }}
              >
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
                  onClick={() => {
                    const shareMenu = document.getElementById('share-menu');
                    shareMenu.classList.toggle('hidden');
                  }}
                >
                  <Share2 className="w-4 sm:w-5 h-4 sm:h-5" />
                  <span className="hidden sm:inline">Share</span>
                </motion.button>

                <div
                  id="share-menu"
                  className="hidden absolute top-full mt-2 right-0 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 p-3 z-10 min-w-[200px]"
                >
                  <div className="flex flex-col sm:flex-row gap-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleShare('twitter')}
                      className="p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center justify-center"
                    >
                      <Twitter className="w-5 h-5" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleShare('linkedin')}
                      className="p-3 bg-blue-700 text-white rounded-lg hover:bg-blue-800 flex items-center justify-center"
                    >
                      <Linkedin className="w-5 h-5" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleShare('facebook')}
                      className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center"
                    >
                      <Facebook className="w-5 h-5" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleShare('copy')}
                      className="p-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 flex items-center justify-center"
                    >
                      <LinkIcon className="w-5 h-5" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>

              <div className="flex-1"></div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowToc(!showToc)}
                className="hidden xl:flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
              >
                <Menu className="w-4 sm:w-5 h-4 sm:h-5" />
                <span>{showToc ? 'Hide' : 'Show'} TOC</span>
              </motion.button>
            </motion.div>

            {/* Featured Image */}
            {post.featuredImage && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl mb-8 sm:mb-12 group w-full"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10"></div>
                <img
                  src={portfolioService.getFileView(post.featuredImage)}
                  alt={post.title}
                  className="w-full h-64 sm:h-96 md:h-[500px] object-cover group-hover:scale-105 transition-transform duration-700"
                  onError={(e) => (e.target.style.display = 'none')}
                />
              </motion.div>
            )}
          </motion.article>

          {/* Blog Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 lg:p-16 shadow-2xl border border-gray-200/50 dark:border-gray-700/50 mb-8 sm:mb-12 w-full overflow-x-hidden"
          >
            <ModernBlogContent content={post.content} isDarkMode={isDarkMode} />
          </motion.div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl border border-gray-200/50 dark:border-gray-700/50 mb-8 sm:mb-12 w-full"
            >
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 flex items-center gap-2">
                <Tag className="w-5 sm:w-6 h-5 sm:h-6 text-blue-600 dark:text-blue-400" />
                Tagged with
              </h3>
              <div className="flex flex-wrap gap-2 sm:gap-3">
                {post.tags.map((tag, index) => (
                  <motion.span
                    key={index}
                    whileHover={{ scale: 1.05, y: -2 }}
                    className="px-3 sm:px-5 py-1.5 sm:py-2.5 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-600 text-gray-700 dark:text-gray-300 rounded-full text-xs sm:text-sm font-semibold cursor-pointer border border-gray-200 dark:border-gray-600 hover:shadow-lg transition-all"
                  >
                    #{tag}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          )}

          {/* Comments */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mb-12"
            id="comment-section"
          >
            <EnhancedCommentSection
              postId={post.$id}
              initialComments={comments}
            />
          </motion.div>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl p-8 md:p-12 shadow-2xl border border-gray-200/50 dark:border-gray-700/50 mb-12"
            >
              <h3 className="text-3xl font-black text-gray-900 dark:text-white mb-8 flex items-center gap-3">
                <Sparkles className="w-8 h-8 text-yellow-500" />
                You might also like
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedPosts.map((relatedPost, index) => (
                  <motion.article
                    key={relatedPost.$id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                    whileHover={{ y: -8, scale: 1.02 }}
                    onClick={() =>
                      navigate(
                        `/blog/${
                          relatedPost.slug ||
                          relatedPost.title
                            .toLowerCase()
                            .replace(/\s+/g, '-')
                            .replace(/[^\w-]/g, '')
                        }`
                      )
                    }
                    className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-2xl transition-all duration-300 cursor-pointer group"
                  >
                    {relatedPost.featuredImage && (
                      <div className="h-48 overflow-hidden relative">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <img
                          src={portfolioService.getFileView(
                            relatedPost.featuredImage
                          )}
                          alt={relatedPost.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          onError={(e) => (e.target.style.display = 'none')}
                        />
                      </div>
                    )}
                    <div className="p-6">
                      <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {relatedPost.title}
                      </h4>
                      <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 mb-4">
                        {relatedPost.excerpt}
                      </p>
                      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                        <span>
                          {formatDate(
                            relatedPost.publishedAt || relatedPost.$createdAt
                          )}
                        </span>
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
              transition={{ delay: 1 }}
              className="bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 dark:from-gray-800 dark:via-gray-800 dark:to-gray-900 rounded-3xl p-8 shadow-2xl border border-gray-200/50 dark:border-gray-700/50"
            >
              <div className="flex justify-between items-center gap-6">
                {prevPost ? (
                  <motion.button
                    whileHover={{ x: -5, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() =>
                      navigate(
                        `/blog/${
                          prevPost.slug ||
                          prevPost.title
                            .toLowerCase()
                            .replace(/\s+/g, '-')
                            .replace(/[^\w-]/g, '')
                        }`
                      )
                    }
                    className="flex items-center gap-4 p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all max-w-sm group"
                  >
                    <ChevronLeft className="w-6 h-6 text-gray-400 group-hover:text-blue-600 transition-colors" />
                    <div className="text-left">
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                        Previous
                      </p>
                      <p className="font-bold text-gray-900 dark:text-white line-clamp-2">
                        {prevPost.title}
                      </p>
                    </div>
                  </motion.button>
                ) : (
                  <div></div>
                )}

                {nextPost ? (
                  <motion.button
                    whileHover={{ x: 5, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() =>
                      navigate(
                        `/blog/${
                          nextPost.slug ||
                          nextPost.title
                            .toLowerCase()
                            .replace(/\s+/g, '-')
                            .replace(/[^\w-]/g, '')
                        }`
                      )
                    }
                    className="flex items-center gap-4 p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all max-w-sm group"
                  >
                    <div className="text-right">
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                        Next
                      </p>
                      <p className="font-bold text-gray-900 dark:text-white line-clamp-2">
                        {nextPost.title}
                      </p>
                    </div>
                    <ChevronRight className="w-6 h-6 text-gray-400 group-hover:text-blue-600 transition-colors" />
                  </motion.button>
                ) : (
                  <div></div>
                )}
              </div>
            </motion.nav>
          )}
        </div>
      </main>

      {/* Footer - Clean & Modern */}
      <motion.footer
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative bg-gray-900 dark:bg-black text-white py-12"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Left Side - Logo & Copyright */}
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Code2 className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="font-semibold text-white">
                  {about?.name || 'Imteaj Hossain'}
                </p>
                <p className="text-sm text-gray-400">
                  &copy; 2026 All rights reserved.
                </p>
              </div>
            </div>

            {/* Center - Quick Links */}
            <div className="flex items-center gap-8 text-sm">
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => navigate('/')}
                className="text-gray-400 hover:text-white transition-colors"
              >
                Home
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => navigate('/blog')}
                className="text-gray-400 hover:text-white transition-colors"
              >
                Blog
              </motion.button>
              <motion.a
                whileHover={{ scale: 1.05 }}
                href="/#projects"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Projects
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.05 }}
                href="/#contact"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Contact
              </motion.a>
            </div>

            {/* Right Side - Social Links */}
            <div className="flex items-center space-x-3">
              {about?.socialLinks?.github && (
                <motion.a
                  href={about.socialLinks.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-3 bg-gray-800 hover:bg-gray-700 rounded-xl transition-colors duration-200"
                  aria-label="GitHub Profile"
                >
                  <Github className="h-5 w-5" />
                </motion.a>
              )}
              {about?.socialLinks?.linkedin && (
                <motion.a
                  href={about.socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-3 bg-gray-800 hover:bg-gray-700 rounded-xl transition-colors duration-200"
                  aria-label="LinkedIn Profile"
                >
                  <Linkedin className="h-5 w-5 text-blue-400" />
                </motion.a>
              )}
              {about?.socialLinks?.twitter && (
                <motion.a
                  href={about.socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-3 bg-gray-800 hover:bg-gray-700 rounded-xl transition-colors duration-200"
                  aria-label="Twitter Profile"
                >
                  <Twitter className="h-5 w-5 text-blue-400" />
                </motion.a>
              )}
              {about?.socialLinks?.website && (
                <motion.a
                  href={about.socialLinks.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-3 bg-gray-800 hover:bg-gray-700 rounded-xl transition-colors duration-200"
                  aria-label="Personal Website"
                >
                  <ExternalLink className="h-5 w-5" />
                </motion.a>
              )}
            </div>
          </div>

          {/* Bottom Text */}
          <div className="border-t border-gray-800 mt-8 pt-6 text-center">
            <p className="text-gray-400 text-sm">
              Built with ❤️ using React, Tailwind CSS, and Framer Motion
            </p>
          </div>
        </div>
      </motion.footer>
    </div>
  );
};

export default ModernBlogDetailPage;

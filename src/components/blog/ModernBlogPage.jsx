import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  Clock,
  Eye,
  Search,
  ArrowRight,
  BookOpen,
  Heart,
  Code2,
  Cpu,
  Database,
  Globe,
  Terminal,
  Zap,
  TrendingUp,
  Star,
  Grid3X3,
  List,
  Bookmark,
  ExternalLink,
  Sparkles,
  Filter,
  ChevronDown,
  ChevronUp,
  X,
  Menu,
  X as CloseIcon,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useBlogPosts, useBlogCategories } from '../../hooks/usePortfolio';
import portfolioService from '../../services/portfolioService';
import ModernNavbar from '../ui/ModernNavbar';

const ModernBlogPage = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('newest');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(9);

  const { posts, loading: postsLoading } = useBlogPosts(selectedCategory, 'published');
  const { categories, loading: categoriesLoading } = useBlogCategories();

  // Filter and sort posts
  useEffect(() => {
    if (!posts) return;

    let filtered = posts;

    if (searchTerm) {
      filtered = posts.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.publishedAt || b.$createdAt) - new Date(a.publishedAt || a.$createdAt);
        case 'oldest':
          return new Date(a.publishedAt || a.$createdAt) - new Date(b.publishedAt || b.$createdAt);
        case 'popular':
          return (b.views || 0) - (a.views || 0);
        case 'featured':
          return b.featured - a.featured;
        default:
          return 0;
      }
    });

    setFilteredPosts(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [posts, searchTerm, sortBy, selectedCategory]);

  // Pagination
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
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

  const handlePostClick = async (post) => {
    try {
      // Increment view count
      await portfolioService.incrementBlogPostViews(post.$id);
    } catch (error) {
      console.error('Failed to increment view count:', error);
    }

    // Navigate to blog detail page using the post slug
    navigate(`/blog/${post.slug || post.$id}`);
  };

  const getCategoryIcon = (categoryName) => {
    const iconMap = {
      'Frontend': Globe,
      'Backend': Database,
      'DevOps': Terminal,
      'Mobile': Terminal,
      'AI/ML': Cpu,
      'Web Development': Code2,
      'Programming': Code2,
      'Technology': Zap,
      'Tutorial': BookOpen,
      'News': TrendingUp,
      'Tools': Code2,
      'default': Code2
    };
    return iconMap[categoryName] || iconMap.default;
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemFadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  if (postsLoading || categoriesLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <ModernNavbar variant="blog" showScrollLinks={false} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-16">
            <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded w-64 mx-auto mb-4 animate-pulse"></div>
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-96 mx-auto animate-pulse"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-200 dark:bg-gray-700"></div>
                <div className="p-6">
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <ModernNavbar variant="blog" showScrollLinks={false} blogPostTitle="Blog" />

      {/* Hero Section */}
      <motion.section
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 text-white pt-32 pb-24 overflow-hidden"
        aria-label="Blog Hero Section"
      >
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/30 via-purple-600/30 to-indigo-700/30"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div variants={fadeInUp} className="mb-6">
            <span className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white/90 text-sm font-medium border border-white/30">
              <Sparkles className="w-4 h-4 mr-2" />
              Tech Insights & Tutorials
            </span>
          </motion.div>

          <motion.h1
            variants={fadeInUp}
            className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent"
            tabIndex={0}
          >
            Discover the Future of <br />
            <span className="text-transparent bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text">Technology</span>
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            className="text-lg md:text-xl text-white/80 mb-12 max-w-3xl mx-auto leading-relaxed"
            tabIndex={0}
          >
            Explore cutting-edge insights, tutorials, and industry trends from the world of technology and development.
          </motion.p>

          {/* Search Bar */}
          <motion.div
            variants={fadeInUp}
            className="max-w-2xl mx-auto relative"
            role="search"
            aria-label="Article search"
          >
            <div className="relative bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-1">
              <div className="flex items-center">
                <Search className="absolute left-6 text-white/60 h-5 w-5 z-10" />
                <input
                  type="search"
                  placeholder="Search articles, tutorials, insights..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-14 pr-4 py-4 bg-transparent text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30 text-lg"
                  aria-label="Search articles"
                />
              </div>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={fadeInUp}
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
            role="list"
            aria-label="Blog statistics"
          >
            <div className="text-center" role="listitem">
              <div className="text-3xl font-bold text-cyan-300 mb-2">{posts?.length || 0}</div>
              <div className="text-white/70 text-sm">Articles</div>
            </div>
            <div className="text-center" role="listitem">
              <div className="text-3xl font-bold text-purple-300 mb-2">{categories?.length || 0}</div>
              <div className="text-white/70 text-sm">Categories</div>
            </div>
            <div className="text-center" role="listitem">
              <div className="text-3xl font-bold text-green-300 mb-2">50K+</div>
              <div className="text-white/70 text-sm">Readers</div>
            </div>
            <div className="text-center" role="listitem">
              <div className="text-3xl font-bold text-orange-300 mb-2">24/7</div>
              <div className="text-white/70 text-sm">Updates</div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Filters Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
        className="py-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-b border-gray-200/50 dark:border-gray-700/50 sticky top-0 z-40"
        aria-label="Blog filters and sorting options"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Mobile Filters Button */}
            <button
              onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
              className="lg:hidden flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-700 dark:text-gray-300"
              aria-expanded={mobileFiltersOpen}
              aria-controls="filters-container"
            >
              <Filter className="w-4 h-4" />
              Filters
              {mobileFiltersOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            <div
              id="filters-container"
              className={`flex flex-col lg:flex-row lg:items-center gap-4 w-full ${mobileFiltersOpen ? 'block' : 'hidden lg:flex'}`}
              role="region"
              aria-labelledby="filters-heading"
            >
              <h2 id="filters-heading" className="sr-only">Filter and Sort Options</h2>

              {/* Categories */}
              <div className="flex flex-wrap gap-2" role="group" aria-label="Article categories">
                <motion.button
                  onClick={() => setSelectedCategory(null)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`px-4 py-2 rounded-full transition-all duration-200 ${selectedCategory === null
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                  aria-pressed={selectedCategory === null}
                >
                  All
                </motion.button>
                {categories.slice(0, 6).map((category) => {
                  const IconComponent = getCategoryIcon(category.name);
                  return (
                    <motion.button
                      key={category.$id}
                      onClick={() => setSelectedCategory(category.$id)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200 ${selectedCategory === category.$id
                        ? 'text-white shadow-lg'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                      style={{
                        backgroundColor: selectedCategory === category.$id ? category.color : undefined,
                        boxShadow: selectedCategory === category.$id ? `0 4px 12px ${category.color}40` : undefined
                      }}
                      aria-pressed={selectedCategory === category.$id}
                    >
                      <IconComponent className="w-4 h-4" />
                      {category.name}
                    </motion.button>
                  );
                })}
              </div>

              {/* Controls */}
              <div className="flex items-center gap-4 ml-auto">
                <div className="relative">
                  <label htmlFor="sort-select" className="sr-only">Sort articles by</label>
                  <select
                    id="sort-select"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label="Sort articles by"
                  >
                    <option value="newest">Newest</option>
                    <option value="oldest">Oldest</option>
                    <option value="popular">Popular</option>
                    <option value="featured">Featured</option>
                  </select>
                  <TrendingUp className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>

                <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1" role="radiogroup" aria-label="View mode">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white dark:bg-gray-600 shadow-sm' : 'text-gray-600 dark:text-gray-400'}`}
                    role="radio"
                    aria-checked={viewMode === 'grid'}
                  >
                    <Grid3X3 className="w-4 h-4" aria-label="Grid view" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded ${viewMode === 'list' ? 'bg-white dark:bg-gray-600 shadow-sm' : 'text-gray-600 dark:text-gray-400'}`}
                    role="radio"
                    aria-checked={viewMode === 'list'}
                  >
                    <List className="w-4 h-4" aria-label="List view" />
                  </button>
                </div>
              </div>
            </div>

            {/* Close button for mobile */}
            {mobileFiltersOpen && (
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="lg:hidden absolute top-4 right-4 p-2 bg-gray-100 dark:bg-gray-700 rounded-full"
                aria-label="Close filters"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </motion.section>

      {/* Blog Posts Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerContainer}
        className="py-16"
        aria-label="Blog posts content"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {currentPosts.length > 0 ? (
            <div className="space-y-12">
              {/* Featured Post */}
              {currentPosts.filter(post => post.featured).slice(0, 1).map((post, index) => (
                <motion.div
                  key={post.$id}
                  variants={itemFadeIn}
                  onClick={() => handlePostClick(post)}
                  className="group cursor-pointer"
                  role="article"
                  aria-labelledby={`featured-post-title-${post.$id}`}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handlePostClick(post);
                    }
                  }}
                >
                  <div className="relative bg-gradient-to-r from-blue-500 to-purple-500 rounded-3xl overflow-hidden">
                    <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 lg:p-12">
                      <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                        <div>
                          <div className="flex items-center gap-3 mb-4">
                            <span className="px-3 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs font-medium rounded-full" aria-label="Featured article">
                              Featured
                            </span>
                            <span
                              className="px-3 py-1 text-white text-xs rounded-full"
                              style={{ backgroundColor: getCategoryColor(post.categoryId) }}
                              aria-label={`Category: ${getCategoryName(post.categoryId)}`}
                            >
                              {getCategoryName(post.categoryId)}
                            </span>
                          </div>

                          <h3 id={`featured-post-title-${post.$id}`} className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {post.title}
                          </h3>

                          {post.excerpt && (
                            <p className="text-gray-600 dark:text-gray-300 mb-6 text-lg leading-relaxed">
                              {post.excerpt}
                            </p>
                          )}

                          <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400 mb-6">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              <span>{formatTimeAgo(post.publishedAt || post.$createdAt)}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              <span>{post.readTime || calculateReadingTime(post.content)} min read</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Eye className="h-4 w-4" />
                              <span>{post.views || 0} views</span>
                            </div>
                          </div>

                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium rounded-lg hover:shadow-lg transition-all duration-200"
                            aria-label={`Read article: ${post.title}`}
                          >
                            Read Full Article
                            <ArrowRight className="h-4 w-4 ml-2" />
                          </motion.button>
                        </div>

                        {post.featuredImage && (
                          <div className="relative">
                            <img
                              src={portfolioService.getFileView(post.featuredImage)}
                              alt={post.title}
                              className="w-full h-64 lg:h-80 object-cover rounded-2xl shadow-2xl"
                              onError={(e) => e.target.style.display = 'none'}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Posts Grid/List */}
              <motion.div
                variants={staggerContainer}
                className={viewMode === 'grid'
                  ? "grid md:grid-cols-2 lg:grid-cols-3 gap-8"
                  : "space-y-6"
                }
                role="feed"
                aria-label="Blog articles"
              >
                {currentPosts.filter(post => !post.featured).map((post) => (
                  <motion.article
                    key={post.$id}
                    variants={itemFadeIn}
                    whileHover={{ y: -4 }}
                    onClick={() => handlePostClick(post)}
                    className={`group cursor-pointer transition-all duration-300 ${viewMode === 'grid'
                      ? 'bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden'
                      : 'bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl border border-gray-200 dark:border-gray-700 p-6'
                    }`}
                    role="article"
                    aria-labelledby={`post-title-${post.$id}`}
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handlePostClick(post);
                      }
                    }}
                  >
                    {viewMode === 'grid' ? (
                      <div className="h-full flex flex-col">
                        {post.featuredImage && (
                          <div className="relative h-48 overflow-hidden">
                            <img
                              src={portfolioService.getFileView(post.featuredImage)}
                              alt={post.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              onError={(e) => e.target.style.display = 'none'}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>

                            <div className="absolute top-4 left-4">
                              <span
                                className="px-3 py-1 text-xs font-medium text-white rounded-full backdrop-blur-sm"
                                style={{ backgroundColor: getCategoryColor(post.categoryId) }}
                                aria-label={`Category: ${getCategoryName(post.categoryId)}`}
                              >
                                {getCategoryName(post.categoryId)}
                              </span>
                            </div>
                          </div>
                        )}

                        <div className="p-6 flex-1 flex flex-col">
                          <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-3">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              <span>{formatDate(post.publishedAt || post.$createdAt)}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              <span>{post.readTime || calculateReadingTime(post.content)} min</span>
                            </div>
                          </div>

                          <h3 id={`post-title-${post.$id}`} className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {post.title}
                          </h3>

                          {post.excerpt && (
                            <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3 leading-relaxed flex-1">
                              {post.excerpt}
                            </p>
                          )}

                          <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                            <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                              <div className="flex items-center gap-1">
                                <Eye className="h-4 w-4" />
                                <span>{post.views || 0}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Heart className="h-4 w-4" />
                                <span>12</span>
                              </div>
                            </div>

                            <motion.button
                              whileHover={{ x: 3 }}
                              className="flex items-center text-blue-600 dark:text-blue-400 font-medium text-sm"
                              aria-label={`Read article: ${post.title}`}
                            >
                              Read More
                              <ArrowRight className="h-4 w-4 ml-1" />
                            </motion.button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex gap-6">
                        {post.featuredImage && (
                          <div className="flex-shrink-0 relative w-32 h-32">
                            <img
                              src={portfolioService.getFileView(post.featuredImage)}
                              alt={post.title}
                              className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-500"
                              onError={(e) => e.target.style.display = 'none'}
                            />
                          </div>
                        )}

                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-3">
                            <span
                              className="px-3 py-1 text-xs font-medium text-white rounded-full"
                              style={{ backgroundColor: getCategoryColor(post.categoryId) }}
                              aria-label={`Category: ${getCategoryName(post.categoryId)}`}
                            >
                              {getCategoryName(post.categoryId)}
                            </span>
                          </div>

                          <h3 id={`post-title-${post.$id}`} className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {post.title}
                          </h3>

                          {post.excerpt && (
                            <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                              {post.excerpt}
                            </p>
                          )}

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                <span>{formatDate(post.publishedAt || post.$createdAt)}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                <span>{post.readTime || calculateReadingTime(post.content)} min</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Eye className="h-4 w-4" />
                                <span>{post.views || 0}</span>
                              </div>
                            </div>

                            <motion.button
                              whileHover={{ x: 3 }}
                              className="flex items-center text-blue-600 dark:text-blue-400 font-medium"
                              aria-label={`Read article: ${post.title}`}
                            >
                              Read Article
                              <ExternalLink className="h-4 w-4 ml-2" />
                            </motion.button>
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.article>
                ))}
              </motion.div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-12">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className={`p-2 rounded-lg ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                    aria-label="Previous page"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-10 h-10 rounded-lg ${currentPage === pageNum ? 'bg-blue-500 text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                        aria-label={`Go to page ${pageNum}`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className={`p-2 rounded-lg ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                    aria-label="Next page"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          ) : (
            <motion.div variants={fadeInUp} className="text-center py-20">
              <div className="relative inline-block mb-6">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-lg opacity-20"></div>
                <div className="relative bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 p-6 rounded-full">
                  <BookOpen className="h-16 w-16 text-blue-600 dark:text-blue-400" />
                </div>
              </div>

              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                {searchTerm ? 'No articles found' : 'No articles published yet'}
              </h3>

              <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
                {searchTerm
                  ? `We couldn't find any articles matching "${searchTerm}". Try adjusting your search.`
                  : 'Check back soon for our latest tech insights and tutorials.'
                }
              </p>

              {searchTerm && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSearchTerm('')}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium rounded-lg hover:shadow-lg transition-all"
                  aria-label="Clear search and show all articles"
                >
                  Clear Search
                </motion.button>
              )}
            </motion.div>
          )}
        </div>
      </motion.section>
    </div>
  );
};

export default ModernBlogPage;

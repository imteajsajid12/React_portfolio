import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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
  Github,
  Linkedin,
  Twitter,
  Sparkles,
  Layers,
  MonitorSpeaker
} from 'lucide-react';
import { useBlogPosts, useBlogCategories } from '../../hooks/usePortfolio';
import portfolioService from '../../services/portfolioService';

const BlogPage = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('newest');
  
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
  }, [posts, searchTerm, sortBy]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat.$id === categoryId);
    return category?.name || 'Uncategorized';
  };

  const getCategoryColor = (categoryId) => {
    const category = categories.find(cat => cat.$id === categoryId);
    return category?.color || '#3B82F6';
  };

  const getCategoryIcon = (categoryName) => {
    const iconMap = {
      'Frontend': Globe,
      'Backend': Database,
      'DevOps': Terminal,
      'Mobile': MonitorSpeaker,
      'AI/ML': Cpu,
      'Web Development': Code2,
      'Programming': Code2,
      'Technology': Zap,
      'Tutorial': BookOpen,
      'News': TrendingUp,
      'Tools': Layers,
      'default': Code2
    };
    return iconMap[categoryName] || iconMap.default;
  };

  const getTechGradient = (index) => {
    const gradients = [
      'from-blue-500 to-cyan-500',
      'from-purple-500 to-pink-500',
      'from-green-500 to-teal-500',
      'from-orange-500 to-red-500',
      'from-indigo-500 to-blue-500',
      'from-yellow-500 to-orange-500',
    ];
    return gradients[index % gradients.length];
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
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="h-12 bg-gray-300 dark:bg-gray-700 rounded w-64 mx-auto mb-4 animate-pulse"></div>
            <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-96 mx-auto animate-pulse"></div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-300 dark:bg-gray-700"></div>
                <div className="p-6">
                  <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded mb-4"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded mb-2"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/20 to-indigo-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-indigo-950/20">
      {/* Floating Tech Elements Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-20 h-20 bg-blue-500/10 rounded-full animate-pulse"></div>
        <div className="absolute top-1/3 right-20 w-16 h-16 bg-purple-500/10 rounded-full animate-pulse delay-75"></div>
        <div className="absolute bottom-1/4 left-1/4 w-12 h-12 bg-green-500/10 rounded-full animate-pulse delay-150"></div>
        <div className="absolute top-2/3 right-1/3 w-24 h-24 bg-orange-500/10 rounded-full animate-pulse delay-300"></div>
      </div>

      {/* Modern Tech Hero Section */}
      <motion.section
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
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

          <motion.div variants={fadeInUp} className="mb-4">
            <span className="inline-flex items-center px-4 py-2 bg-blue-500/20 rounded-full text-blue-300 text-sm font-medium border border-blue-400/30">
              <Sparkles className="w-4 h-4 mr-2" />
              Tech Blog & Insights
            </span>
          </motion.div>

          <motion.h1 
            variants={fadeInUp}
            className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-blue-100 to-indigo-200 bg-clip-text text-transparent"
          >
            Code. Create. <span className="text-transparent bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text">Innovate.</span>
          </motion.h1>
          
          <motion.p 
            variants={fadeInUp}
            className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed"
          >
            Exploring the latest in technology, sharing development insights, and building the future one line of code at a time
          </motion.p>
          
          {/* Enhanced Search Bar */}
          <motion.div 
            variants={fadeInUp}
            className="max-w-2xl mx-auto relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur-lg group-focus-within:blur-xl transition-all duration-300"></div>
            <div className="relative bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-1">
              <div className="flex items-center">
                <Search className="absolute left-6 text-gray-300 h-5 w-5 z-10" />
                <input
                  type="text"
                  placeholder="Search articles, tutorials, insights..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-14 pr-32 py-4 bg-transparent text-white placeholder-gray-300 focus:outline-none text-lg"
                />
                <div className="flex items-center gap-2 pr-4">
                  <span className="text-gray-400 text-sm hidden sm:inline">Press</span>
                  <kbd className="px-2 py-1 bg-white/20 rounded text-xs text-gray-300 hidden sm:inline-block">⌘K</kbd>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Tech Stats */}
          <motion.div 
            variants={fadeInUp}
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
          >
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400 mb-2">{posts?.length || 0}</div>
              <div className="text-gray-300 text-sm">Articles</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400 mb-2">{categories?.length || 0}</div>
              <div className="text-gray-300 text-sm">Categories</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">50K+</div>
              <div className="text-gray-300 text-sm">Readers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-400 mb-2">24/7</div>
              <div className="text-gray-300 text-sm">Learning</div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Enhanced Control Panel */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
        className="py-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-b border-gray-200/50 dark:border-gray-700/50 sticky top-0 z-40"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            {/* Categories */}
            <div className="flex flex-wrap gap-3">
              <motion.button
                onClick={() => setSelectedCategory(null)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center px-4 py-2 rounded-xl transition-all duration-200 ${
                  selectedCategory === null
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-blue-500/25'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                <Grid3X3 className="w-4 h-4 mr-2" />
                All
              </motion.button>
              {categories.map((category) => {
                const IconComponent = getCategoryIcon(category.name);
                return (
                  <motion.button
                    key={category.$id}
                    onClick={() => setSelectedCategory(category.$id)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`flex items-center px-4 py-2 rounded-xl transition-all duration-200 ${
                      selectedCategory === category.$id
                        ? 'text-white shadow-lg'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                    style={{
                      backgroundColor: selectedCategory === category.$id ? category.color : undefined,
                      boxShadow: selectedCategory === category.$id ? `0 8px 20px ${category.color}40` : undefined
                    }}
                  >
                    <IconComponent className="w-4 h-4 mr-2" />
                    {category.name}
                  </motion.button>
                );
              })}
            </div>

            {/* Controls */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="newest">Latest</option>
                  <option value="oldest">Oldest</option>
                  <option value="popular">Popular</option>
                  <option value="featured">Featured</option>
                </select>
                <TrendingUp className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>

              <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white dark:bg-gray-600 shadow-sm' : 'text-gray-600 dark:text-gray-400'}`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-white dark:bg-gray-600 shadow-sm' : 'text-gray-600 dark:text-gray-400'}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Blog Posts Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerContainer}
        className="py-20 relative"
      >
        <div className="max-w-7xl mx-auto px-6">
          {filteredPosts.length > 0 ? (
            <>
              {/* Featured Post */}
              {filteredPosts.some(post => post.featured) && (
                <motion.div variants={fadeInUp} className="mb-16">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 flex items-center">
                    <Star className="w-6 h-6 mr-2 text-yellow-500" />
                    Featured Article
                  </h2>
                  {filteredPosts.filter(post => post.featured).slice(0, 1).map((post, index) => (
                    <motion.div
                      key={post.$id}
                      variants={itemFadeIn}
                      className={`relative bg-gradient-to-r ${getTechGradient(index)} p-1 rounded-2xl group`}
                    >
                      <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 h-full">
                        <div className="grid lg:grid-cols-2 gap-8 items-center">
                          <div>
                            <div className="flex items-center gap-4 mb-6">
                              <span className="px-3 py-1 bg-yellow-500 text-white text-sm font-medium rounded-full">
                                Featured
                              </span>
                              <span 
                                className="px-3 py-1 text-white text-sm rounded-full"
                                style={{ backgroundColor: getCategoryColor(post.categoryId) }}
                              >
                                {getCategoryName(post.categoryId)}
                              </span>
                            </div>
                            
                            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
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
                            
                            <motion.button
                              whileHover={{ x: 5 }}
                              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium rounded-lg hover:shadow-lg transition-all duration-200"
                            >
                              Read Article
                              <ArrowRight className="h-4 w-4 ml-2" />
                            </motion.button>
                          </div>
                          
                          {post.featuredImage && (
                            <div className="relative">
                              <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-purple-500/20 rounded-xl"></div>
                              <img
                                src={portfolioService.getFileView(post.featuredImage)}
                                alt={post.title}
                                className="w-full h-64 lg:h-80 object-cover rounded-xl"
                                onError={(e) => e.target.style.display = 'none'}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}

              {/* Regular Posts Grid/List */}
              <motion.div
                variants={staggerContainer}
                className={viewMode === 'grid' 
                  ? "grid md:grid-cols-2 lg:grid-cols-3 gap-8"
                  : "space-y-6"
                }
              >
                {filteredPosts.filter(post => !post.featured).map((post) => (
                  <motion.article
                    key={post.$id}
                    variants={itemFadeIn}
                    whileHover={{ y: -8 }}
                    className={`group cursor-pointer transition-all duration-300 ${
                      viewMode === 'grid' 
                        ? 'bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden'
                        : 'bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg border border-gray-200 dark:border-gray-700 p-6'
                    }`}
                  >
                    {viewMode === 'grid' ? (
                      <div className="h-full">
                        {post.featuredImage && (
                          <div className="relative h-48 overflow-hidden rounded-t-2xl">
                            <img
                              src={portfolioService.getFileView(post.featuredImage)}
                              alt={post.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                              onError={(e) => e.target.style.display = 'none'}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                            
                            <div className="absolute top-4 left-4">
                              <span 
                                className="px-3 py-1 text-xs font-medium text-white rounded-full backdrop-blur-sm"
                                style={{ backgroundColor: getCategoryColor(post.categoryId) }}
                              >
                                {getCategoryName(post.categoryId)}
                              </span>
                            </div>
                            
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-all"
                            >
                              <Bookmark className="w-4 h-4" />
                            </motion.button>
                          </div>
                        )}

                        <div className="p-6">
                          <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-3">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              <span>{formatDate(post.publishedAt || post.$createdAt)}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span>{post.readTime}min</span>
                            </div>
                          </div>

                          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {post.title}
                          </h3>

                          {post.excerpt && (
                            <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3 leading-relaxed">
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
                            >
                              Read
                              <ArrowRight className="h-4 w-4 ml-1" />
                            </motion.button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex gap-6">
                        {post.featuredImage && (
                          <div className="flex-shrink-0 relative">
                            <img
                              src={portfolioService.getFileView(post.featuredImage)}
                              alt={post.title}
                              className="w-32 h-32 object-cover rounded-lg"
                              onError={(e) => e.target.style.display = 'none'}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg"></div>
                          </div>
                        )}
                        
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-3">
                            <span 
                              className="px-3 py-1 text-xs font-medium text-white rounded-full"
                              style={{ backgroundColor: getCategoryColor(post.categoryId) }}
                            >
                              {getCategoryName(post.categoryId)}
                            </span>
                            <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                              <Bookmark className="w-4 h-4" />
                            </button>
                          </div>
                          
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
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
                                <span>{post.readTime} min</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Eye className="h-4 w-4" />
                                <span>{post.views || 0}</span>
                              </div>
                            </div>
                            
                            <motion.button
                              whileHover={{ x: 3 }}
                              className="flex items-center text-blue-600 dark:text-blue-400 font-medium"
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
            </>
          ) : (
            <motion.div variants={fadeInUp} className="text-center py-20">
              <div className="relative inline-block mb-6">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-lg opacity-20"></div>
                <div className="relative bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 p-6 rounded-full">
                  <Code2 className="h-16 w-16 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                {searchTerm ? 'No matching articles found' : 'No articles published yet'}
              </h3>
              
              <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
                {searchTerm 
                  ? `We couldn't find any articles matching "${searchTerm}". Try adjusting your search or browse categories.`
                  : 'Stay tuned! Amazing tech content is coming soon. Follow us for updates.'
                }
              </p>
              
              {searchTerm ? (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSearchTerm('')}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium rounded-lg hover:shadow-lg transition-all"
                >
                  Clear Search
                </motion.button>
              ) : (
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium rounded-lg hover:shadow-lg transition-all"
                  >
                    Subscribe for Updates
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
                  >
                    Explore Categories
                  </motion.button>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </motion.section>

      {/* Tech Newsletter Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
        className="py-20 bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 text-white relative overflow-hidden"
      >
        <div className="absolute inset-0 opacity-30"></div>
        
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <motion.div variants={fadeInUp} className="mb-6">
            <div className="inline-flex items-center px-4 py-2 bg-blue-500/20 rounded-full text-blue-300 text-sm font-medium border border-blue-400/30 mb-6">
              <Zap className="w-4 h-4 mr-2" />
              Stay Updated
            </div>
          </motion.div>

          <motion.h2
            variants={fadeInUp}
            className="text-3xl md:text-4xl font-bold mb-6"
          >
            Get the Latest Tech Insights
          </motion.h2>
          
          <motion.p
            variants={fadeInUp}
            className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto"
          >
            Join thousands of developers and tech enthusiasts. Get weekly updates on the latest trends, tutorials, and industry insights.
          </motion.p>
          
          <motion.form
            variants={fadeInUp}
            className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto"
          >
            <div className="flex-1 relative">
              <input
                type="email"
                placeholder="Enter your email address"
                className="w-full px-6 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400/50"
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-200"
            >
              Subscribe
            </motion.button>
          </motion.form>
          
          <motion.div
            variants={fadeInUp}
            className="flex justify-center gap-6 mt-12"
          >
            <motion.a
              whileHover={{ scale: 1.1, y: -2 }}
              href="#"
              className="p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-all"
            >
              <Github className="w-6 h-6" />
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.1, y: -2 }}
              href="#"
              className="p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-all"
            >
              <Twitter className="w-6 h-6" />
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.1, y: -2 }}
              href="#"
              className="p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-all"
            >
              <Linkedin className="w-6 h-6" />
            </motion.a>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
};

export default BlogPage;

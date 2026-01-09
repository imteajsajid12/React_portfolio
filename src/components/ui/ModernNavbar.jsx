import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Code2, Sun, Moon, Github, Menu, X, BookOpen, Home, Briefcase, Mail, ChevronRight, ArrowLeft } from 'lucide-react';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import { useAbout } from '../../hooks/usePortfolio';

const ModernNavbar = ({
    blogPostTitle = null,
    className = ""
}) => {
    const [isDark, setIsDark] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [activeSection, setActiveSection] = useState('about');
    const { about } = useAbout();
    const location = useLocation();
    const navigate = useNavigate();

    const toggleTheme = () => {
        setIsDark(!isDark);
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    // Calculate scroll progress
    const calculateScrollProgress = useCallback(() => {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        const scrollTop = window.scrollY;
        const trackLength = documentHeight - windowHeight;
        const progress = (scrollTop / trackLength) * 100;
        setScrollProgress(Math.min(progress, 100));
    }, []);

    // Detect active section on scroll
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
            calculateScrollProgress();

            // Update active section based on scroll position
            const sections = ['about', 'projects', 'contact'];
            const current = sections.find(section => {
                const element = document.getElementById(section);
                if (element) {
                    const rect = element.getBoundingClientRect();
                    return rect.top <= 100 && rect.bottom >= 100;
                }
                return false;
            });
            if (current) setActiveSection(current);
        };

        window.addEventListener('scroll', handleScroll);
        calculateScrollProgress();
        return () => window.removeEventListener('scroll', handleScroll);
    }, [calculateScrollProgress]);

    // Apply dark mode to document
    useEffect(() => {
        if (isDark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [isDark]);

    // Unified navigation structure - ALWAYS the same across all pages
    const mainNavLinks = [
        { to: "/", label: "Home", icon: Home, scrollTo: "about" },
        { to: "/", label: "Work", icon: Briefcase, scrollTo: "projects" },
        { to: "/blog", label: "Blog", icon: BookOpen },
        { to: "/", label: "Contact", icon: Mail, scrollTo: "contact" }
    ];

    // Check if we're on a blog post page
    const isBlogPost = location.pathname.startsWith('/blog/') && location.pathname !== '/blog' && location.pathname !== '/blog/';

    // Determine if link is active
    const isLinkActive = (link) => {
        if (link.to === '/blog') {
            return location.pathname.startsWith('/blog');
        }
        if (location.pathname === '/' && link.scrollTo) {
            return activeSection === link.scrollTo;
        }
        return false;
    };

    // Handle navigation click
    const handleNavClick = (link, e) => {
        if (link.scrollTo) {
            e.preventDefault();
            if (location.pathname === '/') {
                // Already on home, just scroll
                const element = document.getElementById(link.scrollTo);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    setActiveSection(link.scrollTo);
                }
            } else {
                // Navigate to home then scroll
                navigate('/');
                setTimeout(() => {
                    const element = document.getElementById(link.scrollTo);
                    if (element) {
                        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        setActiveSection(link.scrollTo);
                    }
                }, 100);
            }
        }
    };

    return (
        <>
            <motion.nav
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className={`fixed top-0 left-0 right-0 z-50 ${className}`}
            >
                {/* Floating Island Container */}
                <div className={`mx-auto transition-all duration-500 ease-out ${isScrolled
                        ? 'max-w-6xl mt-3 px-4'
                        : 'max-w-full px-4 sm:px-6 mt-0'
                    }`}>
                    <div className={`relative transition-all duration-500 ease-out ${isScrolled
                            ? 'glass-ultra dark:glass-ultra-dark shadow-xl shadow-blue-500/5 dark:shadow-purple-500/10 rounded-2xl border border-white/20 dark:border-white/10'
                            : 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50'
                        }`}>
                        {/* Subtle Glow Effect */}
                        {isScrolled && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 blur-lg -z-10"
                            />
                        )}

                        <div className={`px-4 sm:px-6 transition-all duration-300 ${isScrolled ? 'py-2.5' : 'py-3.5'}`}>
                            {/* Main Navigation Row */}
                            <div className="flex items-center justify-between gap-4">
                                {/* Logo */}
                                <RouterLink to="/" onClick={() => setActiveSection('about')}>
                                    <motion.div
                                        className="flex items-center gap-2.5 cursor-pointer"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <div className="relative">
                                            <motion.div
                                                animate={{ opacity: [0.3, 0.6, 0.3] }}
                                                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                                className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 rounded-lg blur-md"
                                            />
                                            <div className="relative w-9 h-9 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-md">
                                                <Code2 className="h-5 w-5 text-white" strokeWidth={2.5} />
                                            </div>
                                        </div>
                                        <span className="text-lg font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent hidden sm:block">
                                            {about?.name?.split(' ')[0] || 'Imteaj'}
                                        </span>
                                    </motion.div>
                                </RouterLink>

                                {/* Desktop Navigation */}
                                <nav className="hidden md:flex items-center gap-1">
                                    {mainNavLinks.map((link) => {
                                        const IconComponent = link.icon;
                                        const isActive = isLinkActive(link);

                                        return (
                                            <RouterLink
                                                key={link.label}
                                                to={link.to}
                                                onClick={(e) => handleNavClick(link, e)}
                                            >
                                                <motion.div
                                                    whileHover={{ y: -1 }}
                                                    className="relative flex items-center gap-2 px-3.5 py-2 rounded-lg transition-all duration-200 group cursor-pointer"
                                                >
                                                    <IconComponent className={`h-4 w-4 transition-colors duration-200 ${isActive
                                                            ? 'text-blue-600 dark:text-blue-400'
                                                            : 'text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-100'
                                                        }`} strokeWidth={2} />
                                                    <span className={`font-medium text-sm transition-colors duration-200 ${isActive
                                                            ? 'text-gray-900 dark:text-white'
                                                            : 'text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-100'
                                                        }`}>
                                                        {link.label}
                                                    </span>

                                                    {/* Active Indicator */}
                                                    {isActive && (
                                                        <motion.div
                                                            layoutId="navIndicator"
                                                            className="absolute -bottom-1 left-2 right-2 h-0.5 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-full"
                                                            transition={{ type: "spring", stiffness: 350, damping: 30 }}
                                                        />
                                                    )}
                                                </motion.div>
                                            </RouterLink>
                                        );
                                    })}
                                </nav>

                                {/* Action Buttons */}
                                <div className="flex items-center gap-2">
                                    {/* Theme Toggle */}
                                    <motion.button
                                        onClick={toggleTheme}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                                        aria-label="Toggle theme"
                                    >
                                        <AnimatePresence mode="wait" initial={false}>
                                            {isDark ? (
                                                <motion.div
                                                    key="sun"
                                                    initial={{ rotate: -90, scale: 0 }}
                                                    animate={{ rotate: 0, scale: 1 }}
                                                    exit={{ rotate: 90, scale: 0 }}
                                                    transition={{ duration: 0.2 }}
                                                >
                                                    <Sun className="h-4.5 w-4.5 text-yellow-500" />
                                                </motion.div>
                                            ) : (
                                                <motion.div
                                                    key="moon"
                                                    initial={{ rotate: 90, scale: 0 }}
                                                    animate={{ rotate: 0, scale: 1 }}
                                                    exit={{ rotate: -90, scale: 0 }}
                                                    transition={{ duration: 0.2 }}
                                                >
                                                    <Moon className="h-4.5 w-4.5 text-indigo-600" />
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </motion.button>

                                    {/* GitHub Link - Desktop Only */}
                                    {about?.socialLinks?.github && (
                                        <motion.a
                                            href={about.socialLinks.github}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="hidden sm:flex p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                                            aria-label="GitHub Profile"
                                        >
                                            <Github className="h-4.5 w-4.5 text-gray-700 dark:text-gray-300" />
                                        </motion.a>
                                    )}

                                    {/* Mobile Menu Button */}
                                    <motion.button
                                        onClick={toggleMenu}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="md:hidden p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                                        aria-label="Menu"
                                    >
                                        <AnimatePresence mode="wait" initial={false}>
                                            {isMenuOpen ? (
                                                <motion.div
                                                    key="x"
                                                    initial={{ rotate: -90, opacity: 0 }}
                                                    animate={{ rotate: 0, opacity: 1 }}
                                                    exit={{ rotate: 90, opacity: 0 }}
                                                    transition={{ duration: 0.15 }}
                                                >
                                                    <X className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                                                </motion.div>
                                            ) : (
                                                <motion.div
                                                    key="menu"
                                                    initial={{ rotate: 90, opacity: 0 }}
                                                    animate={{ rotate: 0, opacity: 1 }}
                                                    exit={{ rotate: -90, opacity: 0 }}
                                                    transition={{ duration: 0.15 }}
                                                >
                                                    <Menu className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </motion.button>
                                </div>
                            </div>

                            {/* Breadcrumb for Blog Posts */}
                            {isBlogPost && blogPostTitle && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className="mt-3 pt-3 border-t border-gray-200/50 dark:border-gray-700/50"
                                >
                                    <div className="flex items-center gap-2 text-sm">
                                        <RouterLink
                                            to="/blog"
                                            className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors group"
                                        >
                                            <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-0.5 transition-transform" />
                                            <span className="font-medium">Blog</span>
                                        </RouterLink>
                                        <ChevronRight className="h-3.5 w-3.5 text-gray-400" />
                                        <span className="text-gray-700 dark:text-gray-300 font-medium truncate">
                                            {blogPostTitle}
                                        </span>
                                    </div>
                                </motion.div>
                            )}
                        </div>

                        {/* Scroll Progress Bar */}
                        <AnimatePresence>
                            {isScrolled && scrollProgress > 0 && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-200/30 dark:bg-gray-700/30 overflow-hidden rounded-b-2xl"
                                >
                                    <motion.div
                                        className="h-full bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600"
                                        style={{ width: `${scrollProgress}%` }}
                                        transition={{ duration: 0.1 }}
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </motion.nav>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMenuOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={toggleMenu}
                            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
                        />

                        {/* Menu Panel */}
                        <motion.div
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed top-0 left-0 bottom-0 w-80 max-w-[85vw] glass-ultra dark:glass-ultra-dark shadow-2xl z-50 md:hidden border-r border-white/20 dark:border-white/10"
                        >
                            {/* Accent Bar */}
                            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600" />

                            <div className="flex flex-col h-full p-6 gap-6">
                                {/* Header */}
                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 rounded-lg blur-md opacity-40" />
                                        <div className="relative w-10 h-10 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 rounded-lg flex items-center justify-center">
                                            <Code2 className="h-5 w-5 text-white" strokeWidth={2.5} />
                                        </div>
                                    </div>
                                    <span className="text-xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                                        Menu
                                    </span>
                                </div>

                                {/* Navigation Links */}
                                <nav className="flex-1 space-y-1">
                                    {mainNavLinks.map((link, index) => {
                                        const IconComponent = link.icon;
                                        const isActive = isLinkActive(link);

                                        const handleClick = () => {
                                            toggleMenu();
                                            if (link.scrollTo) {
                                                if (location.pathname === '/') {
                                                    setTimeout(() => {
                                                        const element = document.getElementById(link.scrollTo);
                                                        if (element) {
                                                            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                                            setActiveSection(link.scrollTo);
                                                        }
                                                    }, 100);
                                                } else {
                                                    navigate('/');
                                                    setTimeout(() => {
                                                        const element = document.getElementById(link.scrollTo);
                                                        if (element) {
                                                            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                                            setActiveSection(link.scrollTo);
                                                        }
                                                    }, 300);
                                                }
                                            }
                                        };

                                        return (
                                            <motion.div
                                                key={link.label}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.05 }}
                                            >
                                                <RouterLink
                                                    to={link.to}
                                                    onClick={handleClick}
                                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive
                                                            ? 'bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white shadow-lg'
                                                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100/80 dark:hover:bg-gray-800/80'
                                                        }`}
                                                >
                                                    <IconComponent className="h-5 w-5" strokeWidth={2} />
                                                    <span className="font-medium text-base">{link.label}</span>
                                                </RouterLink>
                                            </motion.div>
                                        );
                                    })}
                                </nav>

                                {/* Divider */}
                                <div className="border-t border-gray-200/30 dark:border-gray-700/30" />

                                {/* Bottom Actions */}
                                <div className="space-y-2">
                                    {/* GitHub Link - Mobile */}
                                    {about?.socialLinks?.github && (
                                        <motion.a
                                            href={about.socialLinks.github}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            onClick={toggleMenu}
                                            whileTap={{ scale: 0.98 }}
                                            className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-100/60 dark:bg-gray-800/60 hover:bg-gray-200/60 dark:hover:bg-gray-700/60 transition-colors"
                                        >
                                            <Github className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                                            <span className="font-medium text-gray-700 dark:text-gray-300">GitHub Profile</span>
                                        </motion.a>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};

export default ModernNavbar;

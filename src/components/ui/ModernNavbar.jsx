import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Code2,
  Sun,
  Moon,
  Github,
  Menu,
  X,
  BookOpen,
  Home,
  Briefcase,
  Mail,
  ChevronRight,
  ArrowLeft,
  User,
  FileText,
  GraduationCap,
  Award,
  ChevronDown
} from 'lucide-react';
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
    const [hoveredLink, setHoveredLink] = useState(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const { about } = useAbout();
    const location = useLocation();
    const navigate = useNavigate();

    const toggleTheme = () => {
        setIsDark(!isDark);
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
        setIsDropdownOpen(false); // Close dropdown when menu opens
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
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
            setIsScrolled(window.scrollY > 5); // Reduced threshold for better responsiveness
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
        {
            to: "/",
            label: "Portfolio",
            icon: Briefcase,
            scrollTo: "projects",
            submenu: [
                { label: "Projects", scrollTo: "projects", icon: Briefcase },
                { label: "Skills", scrollTo: "skills", icon: Code2 },
                { label: "Experience", scrollTo: "experience", icon: User },
                { label: "Education", scrollTo: "education", icon: GraduationCap },
                { label: "Certifications", scrollTo: "certifications", icon: Award }
            ]
        },
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

    // Handle submenu click
    const handleSubmenuClick = (submenuItem, e) => {
        e.preventDefault();
        e.stopPropagation();

        if (location.pathname === '/') {
            // Already on home, just scroll
            const element = document.getElementById(submenuItem.scrollTo);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                setActiveSection(submenuItem.scrollTo);
            }
        } else {
            // Navigate to home then scroll
            navigate('/');
            setTimeout(() => {
                const element = document.getElementById(submenuItem.scrollTo);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    setActiveSection(submenuItem.scrollTo);
                }
            }, 100);
        }
        setIsDropdownOpen(false);
    };

    return (
        <>
            <motion.nav
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`fixed top-0 left-0 right-0 z-50 ${className}`}
            >
                <div className="w-full">
                    <div className={`relative w-full transition-all duration-300 ${isScrolled
                            ? 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl shadow-xl border border-gray-200/50 dark:border-gray-700/50'
                            : 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50'
                        }`}>
                        <div className={`px-4 sm:px-6 transition-all duration-300 ${isScrolled ? 'py-3' : 'py-4'}`}>
                            {/* Main Navigation Row */}
                            <div className="flex items-center justify-between gap-6">
                                {/* Logo */}
                                <RouterLink
                                    to="/"
                                    onClick={() => {
                                        setActiveSection('about');
                                        setIsDropdownOpen(false);
                                    }}
                                    className="flex items-center gap-3 group"
                                >
                                    <motion.div
                                        className="relative w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg"
                                        whileHover={{ scale: 1.05, rotate: 5 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <Code2 className="h-5 w-5 text-white" strokeWidth={2.5} />
                                    </motion.div>
                                    <div className="hidden sm:block">
                                        <span className="text-xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                                            {about?.name?.split(' ')[0] || 'Imteaj'}
                                        </span>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 -mt-1 font-normal">
                                            Full Stack Developer
                                        </p>
                                    </div>
                                </RouterLink>

                                {/* Desktop Navigation */}
                                <nav className="hidden lg:flex items-center gap-1" role="navigation" aria-label="Main navigation">
                                    {mainNavLinks.map((link) => {
                                        const IconComponent = link.icon;
                                        const isActive = isLinkActive(link);
                                        const hasSubmenu = link.submenu && link.submenu.length > 0;

                                        return (
                                            <div key={link.label} className="relative">
                                                <RouterLink
                                                    to={link.to}
                                                    onClick={(e) => {
                                                        if (hasSubmenu) {
                                                            // If has submenu, still allow navigation to home but also toggle dropdown
                                                            if (link.scrollTo) {
                                                                handleNavClick(link, e);
                                                            } else {
                                                                e.preventDefault();
                                                            }
                                                            toggleDropdown();
                                                        } else {
                                                            handleNavClick(link, e);
                                                        }
                                                    }}
                                                    onMouseEnter={() => {
                                                        setHoveredLink(link.label);
                                                        if (hasSubmenu) {
                                                            setIsDropdownOpen(true);
                                                        }
                                                    }}
                                                    onMouseLeave={() => setHoveredLink(null)}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter' || e.key === ' ') {
                                                            e.preventDefault();
                                                            if (hasSubmenu) {
                                                                if (link.scrollTo) {
                                                                    handleNavClick(link, e);
                                                                }
                                                                toggleDropdown();
                                                            } else {
                                                                handleNavClick(link, e);
                                                            }
                                                        }
                                                    }}
                                                    className="flex items-center gap-2 px-4 py-3 rounded-xl transition-all duration-200 group cursor-pointer relative"
                                                    aria-haspopup={hasSubmenu}
                                                    aria-expanded={hasSubmenu && isDropdownOpen}
                                                >
                                                    <IconComponent className={`h-4.5 w-4.5 transition-colors duration-200 ${isActive
                                                            ? 'text-blue-600 dark:text-blue-400'
                                                            : 'text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400'
                                                        }`} strokeWidth={2} />
                                                    <span className={`font-medium text-sm transition-colors duration-200 ${isActive
                                                            ? 'text-gray-900 dark:text-white'
                                                            : 'text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white'
                                                        }`}>
                                                        {link.label}
                                                    </span>
                                                    {hasSubmenu && (
                                                        <ChevronDown className={`h-3.5 w-3.5 ml-1 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                                                    )}

                                                    {/* Active Indicator */}
                                                    {isActive && !hasSubmenu && (
                                                        <motion.div
                                                            layoutId="navIndicator"
                                                            className="absolute bottom-0 left-3 right-3 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"
                                                            transition={{ type: "spring", stiffness: 350, damping: 30 }}
                                                        />
                                                    )}
                                                </RouterLink>

                                                {/* Dropdown Menu */}
                                                <AnimatePresence>
                                                    {hasSubmenu && isDropdownOpen && (
                                                        <motion.div
                                                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                                            transition={{ duration: 0.2, ease: "easeOut" }}
                                                            className="absolute top-full left-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 py-2 z-50"
                                                            role="menu"
                                                            aria-orientation="vertical"
                                                            onMouseLeave={() => setIsDropdownOpen(false)}
                                                        >
                                                            {link.submenu.map((item, index) => {
                                                                const ItemIcon = item.icon;
                                                                return (
                                                                    <motion.div
                                                                        key={item.label}
                                                                        initial={{ opacity: 0, x: -10 }}
                                                                        animate={{ opacity: 1, x: 0 }}
                                                                        transition={{ delay: index * 0.05 }}
                                                                        onClick={(e) => handleSubmenuClick(item, e)}
                                                                        onKeyDown={(e) => {
                                                                            if (e.key === 'Enter' || e.key === ' ') {
                                                                                e.preventDefault();
                                                                                handleSubmenuClick(item, e);
                                                                            }
                                                                        }}
                                                                        className="px-4 py-3 flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:rounded-xl"
                                                                        role="menuitem"
                                                                        tabIndex={0}
                                                                        aria-label={item.label}
                                                                    >
                                                                        <ItemIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                                                                        <span>{item.label}</span>
                                                                    </motion.div>
                                                                );
                                                            })}
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        );
                                    })}
                                </nav>

                                {/* Action Buttons */}
                                <div className="flex items-center gap-3">
                                    {/* Theme Toggle */}
                                    <motion.button
                                        onClick={toggleTheme}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors group"
                                        aria-label="Toggle theme"
                                    >
                                        {isDark ? (
                                            <Sun className="h-5 w-5 text-yellow-500 group-hover:text-yellow-400 transition-colors" />
                                        ) : (
                                            <Moon className="h-5 w-5 text-indigo-600 group-hover:text-indigo-500 transition-colors" />
                                        )}
                                    </motion.button>

                                    {/* GitHub Link */}
                                    {about?.socialLinks?.github && (
                                        <motion.a
                                            href={about.socialLinks.github}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="hidden sm:flex p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors group"
                                            aria-label="GitHub Profile"
                                        >
                                            <Github className="h-5 w-5 text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors" />
                                        </motion.a>
                                    )}

                                    {/* Mobile Menu Button */}
                                    <motion.button
                                        onClick={toggleMenu}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="lg:hidden p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                                        aria-label="Menu"
                                    >
                                        {isMenuOpen ? (
                                            <X className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                                        ) : (
                                            <Menu className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                                        )}
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
                                        <span className="text-gray-700 dark:text-gray-300 font-medium truncate max-w-xs">
                                            {blogPostTitle}
                                        </span>
                                    </div>
                                </motion.div>
                            )}
                        </div>

                        {/* Progress Bar */}
                        <AnimatePresence>
                            {isScrolled && scrollProgress > 0 && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-200/30 dark:bg-gray-700/30 overflow-hidden"
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
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
                        />

                        {/* Menu Panel */}
                        <motion.div
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed top-0 left-0 bottom-0 w-full max-w-xs bg-white dark:bg-gray-900 shadow-2xl z-50 lg:hidden border-r border-gray-200 dark:border-gray-700"
                        >
                            <div className="flex flex-col h-full p-6 gap-6">
                                {/* Header */}
                                <div className="flex items-center gap-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                                    <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                                        <Code2 className="h-5 w-5 text-white" strokeWidth={2.5} />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                                            {about?.name?.split(' ')[0] || 'Imteaj'}
                                        </h2>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            Full Stack Developer
                                        </p>
                                    </div>
                                </div>

                                {/* Navigation Links */}
                                <nav className="flex-1 space-y-1" role="navigation" aria-label="Mobile navigation">
                                    {mainNavLinks.map((link) => {
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
                                            <div key={link.label}>
                                                <RouterLink
                                                    to={link.to}
                                                    onClick={handleClick}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter' || e.key === ' ') {
                                                            e.preventDefault();
                                                            handleClick();
                                                        }
                                                    }}
                                                    className={`flex items-center justify-between gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive
                                                            ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                                                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                                                        }`}
                                                    tabIndex={0}
                                                    aria-expanded={link.submenu && link.submenu.length > 0 ? isDropdownOpen : undefined}
                                                    aria-haspopup={link.submenu && link.submenu.length > 0}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <IconComponent className="h-5 w-5" strokeWidth={2} />
                                                        <span className="font-medium">{link.label}</span>
                                                    </div>
                                                    {link.submenu && link.submenu.length > 0 && (
                                                        <ChevronDown className="h-4 w-4" />
                                                    )}
                                                </RouterLink>

                                                {/* Mobile Submenu */}
                                                {link.submenu && link.submenu.length > 0 && (
                                                    <div className="ml-8 mt-1 space-y-1" role="group" aria-label={`${link.label} submenu`}>
                                                        {link.submenu.map((item) => {
                                                            const ItemIcon = item.icon;
                                                            return (
                                                                <div
                                                                    key={item.label}
                                                                    onClick={(e) => handleSubmenuClick(item, e)}
                                                                    onKeyDown={(e) => {
                                                                        if (e.key === 'Enter' || e.key === ' ') {
                                                                            e.preventDefault();
                                                                            handleSubmenuClick(item, e);
                                                                        }
                                                                    }}
                                                                    className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:rounded-xl"
                                                                    tabIndex={0}
                                                                    role="menuitem"
                                                                    aria-label={item.label}
                                                                >
                                                                    <ItemIcon className="h-4 w-4" />
                                                                    <span>{item.label}</span>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </nav>

                                {/* Divider */}
                                <div className="border-t border-gray-200 dark:border-gray-700" />

                                {/* Bottom Actions */}
                                <div className="space-y-3">
                                    {/* Theme Toggle */}
                                    <button
                                        onClick={toggleTheme}
                                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                    >
                                        {isDark ? (
                                            <>
                                                <Sun className="h-5 w-5 text-yellow-500" />
                                                <span className="font-medium">Light Mode</span>
                                            </>
                                        ) : (
                                            <>
                                                <Moon className="h-5 w-5 text-indigo-600" />
                                                <span className="font-medium">Dark Mode</span>
                                            </>
                                        )}
                                    </button>

                                    {/* GitHub Link */}
                                    {about?.socialLinks?.github && (
                                        <a
                                            href={about.socialLinks.github}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                        >
                                            <Github className="h-5 w-5" />
                                            <span className="font-medium">GitHub Profile</span>
                                        </a>
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

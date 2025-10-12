import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Code2, Sun, Moon, Github, Menu, X, BookOpen, ArrowLeft } from 'lucide-react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { useAbout } from '../../hooks/usePortfolio';

const SharedHeader = ({ 
    showBackButton = false, 
    backTo = "/", 
    backLabel = "Back to Portfolio",
    className = "" 
}) => {
    const [isDark, setIsDark] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { about } = useAbout();
    const location = useLocation();

    const toggleTheme = () => {
        setIsDark(!isDark);
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Apply dark mode to document
    useEffect(() => {
        if (isDark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [isDark]);

    return (
        <>
            <motion.nav
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
                    isScrolled 
                        ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-lg border-b border-gray-200/20 dark:border-gray-700/20' 
                        : 'bg-transparent'
                } ${className}`}
            >
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex items-center justify-between h-16">
                        {/* Left Side - Logo or Back Button */}
                        <div className="flex items-center space-x-4">
                            {showBackButton ? (
                                <RouterLink 
                                    to={backTo}
                                    className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
                                >
                                    <ArrowLeft className="h-5 w-5" />
                                    <span className="font-medium">{backLabel}</span>
                                </RouterLink>
                            ) : (
                                <motion.div 
                                    className="flex items-center space-x-3"
                                    whileHover={{ scale: 1.02 }}
                                >
                                    <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                                        <Code2 className="h-6 w-6 text-white" />
                                    </div>
                                    <span className="text-xl font-bold text-gray-900 dark:text-white">
                                        {about?.name?.split(' ')[0] || 'Imteaj'}
                                    </span>
                                </motion.div>
                            )}
                        </div>

                        {/* Center Navigation - Desktop */}
                        <div className="hidden md:flex items-center space-x-6">
                            <RouterLink 
                                to="/"
                                className={`relative px-4 py-2 font-medium transition-colors duration-200 ${
                                    location.pathname === '/' 
                                        ? 'text-blue-600 dark:text-blue-400' 
                                        : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                                }`}
                            >
                                Portfolio
                                {location.pathname === '/' && (
                                    <motion.div
                                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"
                                        layoutId="activeNavItem"
                                    />
                                )}
                            </RouterLink>
                            
                            <RouterLink 
                                to="/blog"
                                className={`relative px-4 py-2 font-medium transition-colors duration-200 flex items-center space-x-2 ${
                                    location.pathname.startsWith('/blog') 
                                        ? 'text-blue-600 dark:text-blue-400' 
                                        : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                                }`}
                            >
                                <BookOpen className="h-4 w-4" />
                                <span>Blog</span>
                                {location.pathname.startsWith('/blog') && (
                                    <motion.div
                                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"
                                        layoutId="activeNavItem"
                                    />
                                )}
                            </RouterLink>
                        </div>

                        {/* Right Side Actions */}
                        <div className="flex items-center space-x-3">
                            {/* Theme Toggle */}
                            <button
                                onClick={toggleTheme}
                                className="p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
                                aria-label="Toggle theme"
                            >
                                <AnimatePresence mode="wait" initial={false}>
                                    {isDark ? (
                                        <motion.div
                                            key="sun"
                                            initial={{ rotate: -90, opacity: 0 }}
                                            animate={{ rotate: 0, opacity: 1 }}
                                            exit={{ rotate: 90, opacity: 0 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <Sun className="h-5 w-5 text-yellow-500" />
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="moon"
                                            initial={{ rotate: 90, opacity: 0 }}
                                            animate={{ rotate: 0, opacity: 1 }}
                                            exit={{ rotate: -90, opacity: 0 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <Moon className="h-5 w-5 text-gray-600" />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </button>

                            {/* GitHub Link */}
                            {about?.socialLinks?.github && (
                                <motion.a 
                                    href={about.socialLinks.github} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="hidden sm:flex p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Github className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                                </motion.a>
                            )}

                            {/* Mobile Menu Toggle */}
                            <button
                                onClick={toggleMenu}
                                className="md:hidden p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
                                aria-label="Toggle menu"
                            >
                                <AnimatePresence mode="wait" initial={false}>
                                    {isMenuOpen ? (
                                        <motion.div
                                            key="x"
                                            initial={{ rotate: -90, opacity: 0 }}
                                            animate={{ rotate: 0, opacity: 1 }}
                                            exit={{ rotate: 90, opacity: 0 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <X className="h-6 w-6 text-gray-600 dark:text-gray-300" />
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="menu"
                                            initial={{ rotate: 90, opacity: 0 }}
                                            animate={{ rotate: 0, opacity: 1 }}
                                            exit={{ rotate: -90, opacity: 0 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <Menu className="h-6 w-6 text-gray-600 dark:text-gray-300" />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </button>
                        </div>
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
                            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
                        />
                        
                        {/* Menu Panel */}
                        <motion.div
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: "spring", damping: 25, stiffness: 120 }}
                            className="fixed top-0 left-0 bottom-0 w-80 bg-white dark:bg-gray-900 shadow-2xl z-50 md:hidden"
                        >
                            <div className="p-6 space-y-8">
                                {/* Header */}
                                <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                                        <Code2 className="h-5 w-5 text-white" />
                                    </div>
                                    <span className="text-lg font-bold text-gray-900 dark:text-white">
                                        Menu
                                    </span>
                                </div>

                                {/* Navigation Links */}
                                <nav className="space-y-2">
                                    <RouterLink
                                        to="/"
                                        onClick={toggleMenu}
                                        className="flex items-center space-x-3 p-3 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer transition-colors duration-200"
                                    >
                                        <span className="text-xl">🏠</span>
                                        <span className="font-medium">Portfolio</span>
                                    </RouterLink>
                                    
                                    <RouterLink
                                        to="/blog"
                                        onClick={toggleMenu}
                                        className="flex items-center space-x-3 p-3 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer transition-colors duration-200"
                                    >
                                        <BookOpen className="h-5 w-5" />
                                        <span className="font-medium">Blog</span>
                                    </RouterLink>
                                </nav>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};

export default SharedHeader;

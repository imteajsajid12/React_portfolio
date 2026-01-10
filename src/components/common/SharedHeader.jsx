import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Code2, Sun, Moon, Github, Menu, X, BookOpen, ArrowLeft, Home, Briefcase, Mail } from 'lucide-react';
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
            setIsScrolled(window.scrollY > 20);
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

    // Unified navigation structure - ALWAYS the same across all pages
    const mainNavLinks = [
        { to: "/", label: "Home", icon: Home, glowColor: "from-blue-500 to-cyan-500" },
        { to: "/blog", label: "Blog", icon: BookOpen, glowColor: "from-green-500 to-teal-500" },
    ];

    // Determine if link is active
    const isLinkActive = (link) => {
        if (link.to === '/blog') {
            return location.pathname.startsWith('/blog');
        }
        if (link.to === '/') {
            return location.pathname === '/';
        }
        return false;
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
                            ? 'glass-ultra dark:glass-ultra-dark shadow-2xl shadow-blue-500/10 dark:shadow-purple-500/10 rounded-3xl border border-white/20 dark:border-white/10'
                            : 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50'
                        }`}>
                        {/* Subtle Glow Effect */}
                        {isScrolled && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="absolute -inset-[1px] rounded-3xl bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 blur-xl -z-10"
                            />
                        )}

                        <div className={`px-4 sm:px-6 transition-all duration-300 ${isScrolled ? 'py-3' : 'py-4'}`}>
                            {/* Main Navigation Row */}
                            <div className="flex items-center justify-between gap-4">
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
                                        <RouterLink to="/" className="flex items-center gap-3 cursor-pointer">
                                            <motion.div
                                                className="relative"
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                {/* Animated Glow Ring */}
                                                <motion.div
                                                    animate={{
                                                        scale: [1, 1.2, 1],
                                                        opacity: [0.3, 0.6, 0.3]
                                                    }}
                                                    transition={{
                                                        duration: 3,
                                                        repeat: Infinity,
                                                        ease: "easeInOut"
                                                    }}
                                                    className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 rounded-full blur-md"
                                                />
                                                <div className="relative w-10 h-10 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                                                    <motion.div
                                                        animate={{ rotate: [0, 360] }}
                                                        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                                                    >
                                                        <Code2 className="h-5 w-5 text-white" strokeWidth={2.5} />
                                                    </motion.div>
                                                </div>
                                            </motion.div>
                                            <div className="hidden sm:block">
                                                <div className="text-lg font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                                                    {about?.name?.split(' ')[0] || 'Imteaj'}
                                                </div>
                                                <div className="text-xs text-gray-500 dark:text-gray-400 -mt-1">
                                                    Full Stack Developer
                                                </div>
                                            </div>
                                        </RouterLink>
                                    )}
                                </div>

                                {/* Center Navigation - Desktop */}
                                <div className="hidden md:flex items-center gap-1">
                                    {mainNavLinks.map((link) => {
                                        const IconComponent = link.icon;
                                        const isActive = isLinkActive(link);

                                        return (
                                            <RouterLink
                                                key={link.label}
                                                to={link.to}
                                            >
                                                <motion.div
                                                    whileHover={{ y: -2, scale: 1.02 }}
                                                    className="relative flex items-center gap-2.5 px-4 py-2.5 rounded-xl transition-all duration-200 group cursor-pointer"
                                                >
                                                    <IconComponent className={`h-4.5 w-4.5 transition-all duration-200 ${isActive
                                                            ? 'text-blue-600 dark:text-blue-400'
                                                            : 'text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-100'
                                                        }`} strokeWidth={2} />
                                                    <span className={`font-medium text-sm transition-all duration-200 ${isActive
                                                            ? 'text-gray-900 dark:text-white'
                                                            : 'text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-100'
                                                        }`}>
                                                        {link.label}
                                                    </span>

                                                    {/* Active Indicator with Enhanced Animation */}
                                                    {isActive && (
                                                        <motion.div
                                                            layoutId="navIndicator"
                                                            className={`absolute -bottom-1 left-2 right-2 h-0.5 bg-gradient-to-r ${link.glowColor} rounded-full`}
                                                            transition={{
                                                                type: "spring",
                                                                stiffness: 350,
                                                                damping: 30,
                                                                mass: 0.5
                                                            }}
                                                        />
                                                    )}
                                                </motion.div>
                                            </RouterLink>
                                        );
                                    })}
                                </div>

                                {/* Right Side Actions */}
                                <div className="flex items-center gap-2.5">
                                    {/* Theme Toggle with Enhanced Animation */}
                                    <motion.button
                                        onClick={toggleTheme}
                                        whileHover={{ scale: 1.1, rotate: 5 }}
                                        whileTap={{ scale: 0.9 }}
                                        className="p-2.5 rounded-xl bg-gray-100/80 dark:bg-gray-800/80 hover:bg-gray-200/80 dark:hover:bg-gray-700/80 transition-all duration-200 backdrop-blur-sm"
                                        aria-label="Toggle theme"
                                    >
                                        <AnimatePresence mode="wait" initial={false}>
                                            {isDark ? (
                                                <motion.div
                                                    key="sun"
                                                    initial={{ rotate: -90, scale: 0, opacity: 0 }}
                                                    animate={{ rotate: 0, scale: 1, opacity: 1 }}
                                                    exit={{ rotate: 90, scale: 0, opacity: 0 }}
                                                    transition={{ duration: 0.2 }}
                                                >
                                                    <Sun className="h-5 w-5 text-yellow-500" />
                                                </motion.div>
                                            ) : (
                                                <motion.div
                                                    key="moon"
                                                    initial={{ rotate: 90, scale: 0, opacity: 0 }}
                                                    animate={{ rotate: 0, scale: 1, opacity: 1 }}
                                                    exit={{ rotate: -90, scale: 0, opacity: 0 }}
                                                    transition={{ duration: 0.2 }}
                                                >
                                                    <Moon className="h-5 w-5 text-indigo-600" />
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
                                            whileHover={{ scale: 1.1, y: -2 }}
                                            whileTap={{ scale: 0.9 }}
                                            className="hidden sm:flex p-2.5 rounded-xl bg-gray-100/80 dark:bg-gray-800/80 hover:bg-gray-200/80 dark:hover:bg-gray-700/80 transition-all duration-200 backdrop-blur-sm"
                                            aria-label="GitHub Profile"
                                        >
                                            <Github className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                                        </motion.a>
                                    )}

                                    {/* Mobile Menu Button */}
                                    <motion.button
                                        onClick={toggleMenu}
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        className="md:hidden p-2.5 rounded-xl bg-gray-100/80 dark:bg-gray-800/80 hover:bg-gray-200/80 dark:hover:bg-gray-700/80 transition-all duration-200 backdrop-blur-sm"
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
                        </div>
                    </div>
                </div>
            </motion.nav>

            {/* Enhanced Mobile Menu */}
            <AnimatePresence>
                {isMenuOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={toggleMenu}
                            className="fixed inset-0 bg-black/50 backdrop-blur-md z-40 md:hidden"
                        />

                        {/* Menu Panel with Enhanced Design */}
                        <motion.div
                            initial={{ x: '-100%', opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: '-100%', opacity: 0 }}
                            transition={{ type: "spring", damping: 25, stiffness: 200, duration: 0.3 }}
                            className="fixed top-0 left-0 bottom-0 w-80 max-w-[85vw] bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 shadow-2xl z-50 md:hidden border-r border-gray-200/30 dark:border-gray-700/30"
                        >
                            {/* Gradient Top Bar */}
                            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600" />

                            <div className="flex flex-col h-full p-6 gap-6">
                                {/* Header with Enhanced Design */}
                                <div className="flex items-center gap-4 pb-4 border-b border-gray-200/30 dark:border-gray-700/30">
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 rounded-full blur-md opacity-40" />
                                        <div className="relative w-12 h-12 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 rounded-full flex items-center justify-center">
                                            <motion.div
                                                animate={{ rotate: [0, 360] }}
                                                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                                            >
                                                <Code2 className="h-6 w-6 text-white" strokeWidth={2.5} />
                                            </motion.div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                                            {about?.name?.split(' ')[0] || 'Imteaj'}
                                        </div>
                                        <div className="text-sm text-gray-500 dark:text-gray-400">
                                            Full Stack Developer
                                        </div>
                                    </div>
                                </div>

                                {/* Navigation Links with Enhanced Animations */}
                                <nav className="flex-1 space-y-1">
                                    {mainNavLinks.map((link, index) => {
                                        const IconComponent = link.icon;
                                        const isActive = isLinkActive(link);

                                        const handleClick = () => {
                                            toggleMenu();
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
                                                    className={`flex items-center gap-4 px-5 py-4 rounded-xl transition-all duration-200 relative overflow-hidden ${isActive
                                                            ? 'bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white shadow-lg'
                                                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100/60 dark:hover:bg-gray-800/60'
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
                                <div className="space-y-3">
                                    {/* Theme Toggle - Mobile */}
                                    <motion.button
                                        onClick={toggleTheme}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="w-full flex items-center gap-4 px-5 py-4 rounded-xl bg-gray-100/60 dark:bg-gray-800/60 hover:bg-gray-200/60 dark:hover:bg-gray-700/60 transition-all duration-200"
                                    >
                                        {isDark ? (
                                            <>
                                                <Sun className="h-5 w-5 text-yellow-500" />
                                                <span className="font-medium text-gray-700 dark:text-gray-300">Light Mode</span>
                                            </>
                                        ) : (
                                            <>
                                                <Moon className="h-5 w-5 text-indigo-600" />
                                                <span className="font-medium text-gray-700 dark:text-gray-300">Dark Mode</span>
                                            </>
                                        )}
                                    </motion.button>

                                    {/* GitHub Link - Mobile */}
                                    {about?.socialLinks?.github && (
                                        <motion.a
                                            href={about.socialLinks.github}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            whileTap={{ scale: 0.98 }}
                                            className="w-full flex items-center gap-4 px-5 py-4 rounded-xl bg-gray-100/60 dark:bg-gray-800/60 hover:bg-gray-200/60 dark:hover:bg-gray-700/60 transition-all duration-200"
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

export default SharedHeader;

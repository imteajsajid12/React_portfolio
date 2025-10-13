import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import PropTypes from 'prop-types';
import { ScrollAnimatedSection, StaggerContainer, StaggerItem } from '../ui/ScrollAnimations';
import portfolioService from '../../services/portfolioService';

// Helper function to render SVG icon from various sources
const renderIcon = (skill, fallbackIcon) => {
    // If skill has an icon field
    if (skill.icon) {
        // Check if it's an SVG string (starts with <svg)
        if (typeof skill.icon === 'string' && skill.icon.trim().startsWith('<svg')) {
            return (
                <div 
                    className="w-full h-full flex items-center justify-center"
                    dangerouslySetInnerHTML={{ __html: skill.icon }}
                    style={{ color: 'currentColor' }}
                />
            );
        }
        // Check if it's a file ID (doesn't contain < or html tags)
        else if (typeof skill.icon === 'string' && !skill.icon.includes('<')) {
            return (
                <img 
                    src={portfolioService.getFileView(skill.icon)} 
                    alt={skill.name}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                        console.error('Failed to load skill icon:', skill.icon);
                        e.target.style.display = 'none';
                    }}
                />
            );
        }
    }
    // Return fallback icon
    return fallbackIcon;
};

// SVG Icons for skill categories (Fallback)
const CategoryIcons = {
    frontend: (
        <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 3L4 7L8 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M16 3L20 7L16 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M14 20L10 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    ),
    backend: (
        <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="2"/>
            <path d="M12 8V16M8 12H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
    ),
    database: (
        <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="12" cy="5" rx="9" ry="3" stroke="currentColor" strokeWidth="2"/>
            <path d="M3 5V19C3 20.6569 7.02944 22 12 22C16.9706 22 21 20.6569 21 19V5" stroke="currentColor" strokeWidth="2"/>
            <path d="M3 12C3 13.6569 7.02944 15 12 15C16.9706 15 21 13.6569 21 12" stroke="currentColor" strokeWidth="2"/>
        </svg>
    ),
    devops: (
        <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
            <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
            <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
        </svg>
    ),
    design: (
        <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
            <path d="M12 1V5M12 19V23M23 12H19M5 12H1M20.49 20.49L17.66 17.66M6.34 6.34L3.51 3.51M20.49 3.51L17.66 6.34M6.34 17.66L3.51 20.49" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
    ),
    mobile: (
        <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="5" y="2" width="14" height="20" rx="2" stroke="currentColor" strokeWidth="2"/>
            <path d="M12 18H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
    ),
    tools: (
        <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" stroke="currentColor" strokeWidth="2"/>
        </svg>
    ),
    networking: (
        <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="2" stroke="currentColor" strokeWidth="2"/>
            <circle cx="6" cy="6" r="2" stroke="currentColor" strokeWidth="2"/>
            <circle cx="18" cy="6" r="2" stroke="currentColor" strokeWidth="2"/>
            <circle cx="6" cy="18" r="2" stroke="currentColor" strokeWidth="2"/>
            <circle cx="18" cy="18" r="2" stroke="currentColor" strokeWidth="2"/>
            <path d="M8 6L10 12M16 6L14 12M8 18L10 12M16 18L14 12" stroke="currentColor" strokeWidth="2"/>
        </svg>
    ),
    'version-control': (
        <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="18" cy="18" r="3" stroke="currentColor" strokeWidth="2"/>
            <circle cx="6" cy="6" r="3" stroke="currentColor" strokeWidth="2"/>
            <circle cx="18" cy="6" r="3" stroke="currentColor" strokeWidth="2"/>
            <path d="M18 9V15M6 9L15 15" stroke="currentColor" strokeWidth="2"/>
        </svg>
    ),
    other: (
        <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
            <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
    )
};

// Circular Progress Component with Enhanced UI/UX
const CircularProgress = ({ value = 0, size = 120, strokeWidth = 8, delay = 0, color = null }) => {
    const [isHovered, setIsHovered] = useState(false);
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (value / 100) * circumference;
    
    // Determine proficiency level
    const getProficiencyLevel = () => {
        if (value >= 90) return 'Expert';
        if (value >= 75) return 'Advanced';
        if (value >= 60) return 'Intermediate';
        if (value >= 40) return 'Proficient';
        return 'Beginner';
    };
    
    // Get color based on proficiency or use custom color
    const getGradientColors = () => {
        if (color) return { start: color, end: color };
        if (value >= 90) return { start: '#10B981', end: '#059669' }; // Green
        if (value >= 75) return { start: '#3B82F6', end: '#8B5CF6' }; // Blue to Purple
        if (value >= 60) return { start: '#F59E0B', end: '#F97316' }; // Orange
        return { start: '#6B7280', end: '#9CA3AF' }; // Gray
    };
    
    const gradientColors = getGradientColors();

    return (
        <div 
            className="relative inline-flex items-center justify-center"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Tooltip */}
            <AnimatePresence>
                {isHovered && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute -top-12 bg-gray-900 dark:bg-gray-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap z-20 shadow-lg"
                    >
                        {getProficiencyLevel()} Level
                        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full">
                            <div className="border-4 border-transparent border-t-gray-900 dark:border-t-gray-700"></div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
            <svg width={size} height={size} className="transform -rotate-90">
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                    fill="none"
                    className="text-gray-200 dark:text-gray-700"
                />
                <motion.circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke={`url(#gradient-${value})`}
                    strokeWidth={strokeWidth}
                    fill="none"
                    strokeLinecap="round"
                    initial={{ strokeDashoffset: circumference }}
                    whileInView={{ strokeDashoffset: offset }}
                    viewport={{ once: true }}
                    transition={{ 
                        delay: delay,
                        duration: 1.5,
                        ease: "easeOut"
                    }}
                    style={{
                        strokeDasharray: circumference,
                        filter: isHovered ? `drop-shadow(0 0 8px ${gradientColors.start}80)` : 'none'
                    }}
                />
                <defs>
                    <linearGradient id={`gradient-${value}`} x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor={gradientColors.start} />
                        <stop offset="100%" stopColor={gradientColors.end} />
                    </linearGradient>
                </defs>
            </svg>
            <motion.div 
                className="absolute inset-0 flex flex-col items-center justify-center"
                animate={{ scale: isHovered ? 1.1 : 1 }}
                transition={{ duration: 0.3 }}
            >
                <motion.span 
                    className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: delay + 1, duration: 0.5 }}
                >
                    {value}%
                </motion.span>
                <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    proficiency
                </span>
            </motion.div>
        </div>
    );
};

// Skill Card Component with API Icon Support
const SkillCard = ({ skill, delay = 0, categoryColor }) => {
    const [isHovered, setIsHovered] = useState(false);
    
    // Get the category icon as fallback
    const fallbackIcon = CategoryIcons[skill.category?.toLowerCase()] || CategoryIcons.other;

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay, duration: 0.6 }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            className="relative group"
        >
            <motion.div
                className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-lg overflow-hidden"
                whileHover={{ 
                    y: -8,
                    boxShadow: "0 20px 40px -12px rgba(0, 0, 0, 0.15)"
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
                <motion.div
                    className={`absolute inset-0 bg-gradient-to-br ${categoryColor} opacity-0`}
                    animate={{ opacity: isHovered ? 0.1 : 0 }}
                    transition={{ duration: 0.3 }}
                />
                <div className="relative z-10 flex flex-col items-center text-center space-y-4">
                    {/* Skill Icon */}
                    <motion.div
                        className="w-16 h-16 flex items-center justify-center rounded-xl bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 p-3"
                        animate={{ 
                            rotate: isHovered ? 360 : 0,
                            scale: isHovered ? 1.1 : 1
                        }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="w-full h-full text-blue-600 dark:text-blue-400">
                            {renderIcon(skill, fallbackIcon)}
                        </div>
                    </motion.div>
                    
                    {/* Skill Name */}
                    <motion.h4 
                        className="text-lg font-semibold text-gray-900 dark:text-white"
                        animate={{ scale: isHovered ? 1.05 : 1 }}
                    >
                        {skill.name}
                    </motion.h4>
                    
                    {/* Circular Progress */}
                    <CircularProgress 
                        value={skill.proficiency || 75} 
                        size={100}
                        strokeWidth={6}
                        delay={delay + 0.2}
                        color={skill.color}
                    />
                    
                    {/* Star Rating Dots */}
                    <motion.div
                        className="flex space-x-1"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: delay + 1.5 }}
                    >
                        {[...Array(5)].map((_, i) => (
                            <motion.div
                                key={i}
                                className={`w-2 h-2 rounded-full ${
                                    i < Math.ceil((skill.proficiency || 75) / 20) 
                                        ? 'bg-gradient-to-r from-blue-500 to-purple-500' 
                                        : 'bg-gray-300 dark:bg-gray-600'
                                }`}
                                initial={{ scale: 0 }}
                                whileInView={{ scale: 1 }}
                                transition={{ delay: delay + 1.5 + i * 0.1 }}
                            />
                        ))}
                    </motion.div>
                </div>
                
                {/* Decorative Corner Element */}
                <motion.div
                    className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-bl-full"
                    animate={{ 
                        scale: isHovered ? 1.2 : 1,
                        opacity: isHovered ? 1 : 0.5
                    }}
                    transition={{ duration: 0.3 }}
                />
            </motion.div>
        </motion.div>
    );
};

// PropTypes for SkillCard
SkillCard.propTypes = {
    skill: PropTypes.shape({
        name: PropTypes.string.isRequired,
        category: PropTypes.string,
        proficiency: PropTypes.number,
        icon: PropTypes.string,
        color: PropTypes.string
    }).isRequired,
    delay: PropTypes.number,
    categoryColor: PropTypes.string
};

// Category Section Component
const SkillCategory = ({ category, skills, index }) => {
    const [isExpanded, setIsExpanded] = useState(true);
    
    const categoryConfig = {
        frontend: {
            title: 'Frontend Development',
            gradient: 'from-blue-500 via-cyan-500 to-teal-500',
            bgGradient: 'from-blue-500/10 to-cyan-500/10',
            iconColor: 'text-blue-600 dark:text-blue-400'
        },
        backend: {
            title: 'Backend Development',
            gradient: 'from-green-500 via-emerald-500 to-teal-500',
            bgGradient: 'from-green-500/10 to-emerald-500/10',
            iconColor: 'text-green-600 dark:text-green-400'
        },
        database: {
            title: 'Database Management',
            gradient: 'from-orange-500 via-red-500 to-pink-500',
            bgGradient: 'from-orange-500/10 to-red-500/10',
            iconColor: 'text-orange-600 dark:text-orange-400'
        },
        devops: {
            title: 'DevOps & Cloud',
            gradient: 'from-purple-500 via-violet-500 to-indigo-500',
            bgGradient: 'from-purple-500/10 to-violet-500/10',
            iconColor: 'text-purple-600 dark:text-purple-400'
        },
        design: {
            title: 'UI/UX Design',
            gradient: 'from-pink-500 via-rose-500 to-red-500',
            bgGradient: 'from-pink-500/10 to-rose-500/10',
            iconColor: 'text-pink-600 dark:text-pink-400'
        },
        mobile: {
            title: 'Mobile Development',
            gradient: 'from-indigo-500 via-blue-500 to-cyan-500',
            bgGradient: 'from-indigo-500/10 to-blue-500/10',
            iconColor: 'text-indigo-600 dark:text-indigo-400'
        },
        tools: {
            title: 'Tools & Technologies',
            gradient: 'from-gray-500 via-slate-500 to-zinc-500',
            bgGradient: 'from-gray-500/10 to-slate-500/10',
            iconColor: 'text-gray-600 dark:text-gray-400'
        },
        networking: {
            title: 'Networking',
            gradient: 'from-cyan-500 via-blue-500 to-indigo-500',
            bgGradient: 'from-cyan-500/10 to-blue-500/10',
            iconColor: 'text-cyan-600 dark:text-cyan-400'
        },
        'version-control': {
            title: 'Version Control',
            gradient: 'from-amber-500 via-orange-500 to-red-500',
            bgGradient: 'from-amber-500/10 to-orange-500/10',
            iconColor: 'text-amber-600 dark:text-amber-400'
        }
    };

    const config = categoryConfig[category.toLowerCase()] || {
        title: category,
        gradient: 'from-gray-500 to-slate-500',
        bgGradient: 'from-gray-500/10 to-slate-500/10',
        iconColor: 'text-gray-600 dark:text-gray-400'
    };

    return (
        <StaggerItem>
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="relative"
            >
                <motion.div
                    className="mb-8 cursor-pointer"
                    onClick={() => setIsExpanded(!isExpanded)}
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                >
                    <div className="flex items-center space-x-4 group">
                        <motion.div
                            className={`relative w-16 h-16 rounded-2xl bg-gradient-to-br ${config.gradient} p-0.5 shadow-lg`}
                            whileHover={{ rotate: 5, scale: 1.1 }}
                            transition={{ type: "spring", stiffness: 300 }}
                        >
                            <div className="w-full h-full bg-white dark:bg-gray-900 rounded-2xl p-3 flex items-center justify-center">
                                <div className={config.iconColor}>
                                    {CategoryIcons[category.toLowerCase()] || CategoryIcons.other}
                                </div>
                            </div>
                        </motion.div>
                        <div className="flex-1">
                            <motion.h3 
                                className="text-2xl font-bold text-gray-900 dark:text-white flex items-center"
                                whileHover={{ x: 5 }}
                            >
                                {config.title}
                                <motion.span
                                    className={`ml-3 px-3 py-1 text-sm font-semibold rounded-full bg-gradient-to-r ${config.gradient} text-white`}
                                    whileHover={{ scale: 1.1 }}
                                >
                                    {skills.length}
                                </motion.span>
                            </motion.h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                Expert proficiency across {skills.length} technologies
                            </p>
                        </div>
                        <motion.div
                            animate={{ rotate: isExpanded ? 0 : -90 }}
                            transition={{ duration: 0.3 }}
                            className="text-gray-400"
                        >
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </motion.div>
                    </div>
                    <motion.div
                        className={`h-1 rounded-full bg-gradient-to-r ${config.gradient} mt-4`}
                        initial={{ width: 0 }}
                        whileInView={{ width: '100%' }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 + 0.3, duration: 0.8 }}
                    />
                </motion.div>
                <AnimatePresence>
                    {isExpanded && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.5, ease: "easeInOut" }}
                        >
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {skills.map((skill, skillIndex) => (
                                    <SkillCard
                                        key={skill.$id || skill.name}
                                        skill={skill}
                                        delay={skillIndex * 0.1}
                                        categoryColor={config.bgGradient}
                                    />
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </StaggerItem>
    );
};

// Main Component
const EnhancedSkillsSection = ({ skills = [], loading = false }) => {
    const groupedSkills = skills.reduce((acc, skill) => {
        const category = skill.category || 'Other';
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push(skill);
        return acc;
    }, {});

    if (loading) {
        return (
            <div className="py-24 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-900">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[...Array(8)].map((_, index) => (
                            <div key={index} className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl p-6 rounded-2xl shadow-lg animate-pulse">
                                <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-4 mx-auto"></div>
                                <div className="w-24 h-24 bg-gray-300 dark:bg-gray-700 rounded-full mx-auto mb-4"></div>
                                <div className="flex justify-center space-x-1">
                                    {[...Array(5)].map((_, i) => (
                                        <div key={i} className="w-2 h-2 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <section className="relative py-24 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-900 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    animate={{ 
                        scale: [1, 1.2, 1],
                        rotate: [0, 90, 0],
                        opacity: [0.05, 0.1, 0.05]
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute top-1/4 left-10 w-96 h-96 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full blur-3xl"
                />
                <motion.div
                    animate={{ 
                        scale: [1.2, 1, 1.2],
                        rotate: [90, 0, 90],
                        opacity: [0.1, 0.05, 0.1]
                    }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                    className="absolute bottom-1/4 right-10 w-96 h-96 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full blur-3xl"
                />
            </div>
            <div className="relative max-w-7xl mx-auto px-6">
                <ScrollAnimatedSection animation="fadeInUp" className="text-center mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <motion.div
                            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/50 dark:to-purple-950/50 border border-blue-200/50 dark:border-blue-800/50 rounded-full text-sm font-medium text-blue-700 dark:text-blue-300 mb-6"
                            whileHover={{ scale: 1.05 }}
                        >
                            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></span>
                            Technical Expertise
                        </motion.div>
                        <h2 className="text-4xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
                            Skills & 
                            <span className="block lg:inline-block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent ml-0 lg:ml-3">
                                Expertise
                            </span>
                        </h2>
                        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
                            A comprehensive showcase of my technical skills and proficiency levels, 
                            continuously evolving with cutting-edge technologies and industry best practices.
                        </p>
                    </motion.div>
                </ScrollAnimatedSection>
                <StaggerContainer staggerDelay={0.1} className="space-y-16">
                    {Object.entries(groupedSkills).length > 0 ? (
                        Object.entries(groupedSkills).map(([category, categorySkills], index) => (
                            <SkillCategory
                                key={category}
                                category={category}
                                skills={categorySkills}
                                index={index}
                            />
                        ))
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-20"
                        >
                            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                                No Skills Yet
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                Start adding your technical skills to showcase your expertise.
                            </p>
                        </motion.div>
                    )}
                </StaggerContainer>
            </div>
        </section>
    );
};

// PropTypes for CircularProgress
CircularProgress.propTypes = {
    value: PropTypes.number,
    size: PropTypes.number,
    strokeWidth: PropTypes.number,
    delay: PropTypes.number,
    color: PropTypes.string
};

// PropTypes for SkillCategory
SkillCategory.propTypes = {
    category: PropTypes.string.isRequired,
    skills: PropTypes.arrayOf(PropTypes.shape({
        $id: PropTypes.string,
        name: PropTypes.string.isRequired,
        category: PropTypes.string,
        proficiency: PropTypes.number,
        icon: PropTypes.string,
        color: PropTypes.string
    })).isRequired,
    index: PropTypes.number.isRequired
};

// PropTypes for EnhancedSkillsSection
EnhancedSkillsSection.propTypes = {
    skills: PropTypes.arrayOf(PropTypes.shape({
        $id: PropTypes.string,
        name: PropTypes.string.isRequired,
        category: PropTypes.string,
        proficiency: PropTypes.number,
        icon: PropTypes.string,
        color: PropTypes.string
    })),
    loading: PropTypes.bool
};

export default EnhancedSkillsSection;

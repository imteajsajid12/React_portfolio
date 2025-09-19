import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { ScrollAnimatedSection, StaggerContainer, StaggerItem } from '../ui/ScrollAnimations';

// Icon mapping for different skill categories
const skillIcons = {
    // Frontend
    'React': '⚛️',
    'JavaScript': '🟨',
    'HTML': '🟠',
    'CSS': '🎨',
    'Vue': '💚',
    'Angular': '🔴',
    'TypeScript': '🔷',
    'Tailwind': '🎨',
    
    // Backend
    'Node.js': '💚',
    'Python': '🐍',
    'PHP': '🐘',
    'Java': '☕',
    'C#': '🔵',
    'Express': '⚡',
    'Laravel': '🔴',
    
    // Database
    'MongoDB': '🍃',
    'MySQL': '🐬',
    'PostgreSQL': '🐘',
    'Redis': '🔴',
    
    // Tools
    'Git': '📦',
    'Docker': '🐳',
    'AWS': '☁️',
    'Linux': '🐧',
    'Figma': '🎨'
};

const SkillProgressBar = ({ skill, delay = 0 }) => {
    const [isHovered, setIsHovered] = useState(false);
    
    return (
        <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay, duration: 0.6 }}
            className="group"
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
        >
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                    <span className="text-lg">{skillIcons[skill.name] || '💻'}</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                        {skill.name}
                    </span>
                </div>
                <motion.span 
                    className="text-sm font-semibold text-blue-600 dark:text-blue-400"
                    animate={{ scale: isHovered ? 1.1 : 1 }}
                >
                    {skill.proficiency || 75}%
                </motion.span>
            </div>
            
            {/* Progress Bar Container */}
            <div className="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                {/* Background Glow Effect */}
                <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full"
                    animate={{
                        opacity: isHovered ? 1 : 0,
                        scale: isHovered ? 1.05 : 1
                    }}
                    transition={{ duration: 0.3 }}
                />
                
                {/* Progress Fill */}
                <motion.div
                    className="h-full bg-gradient-to-r from-blue-600 to-purple-600 rounded-full relative"
                    initial={{ width: 0 }}
                    whileInView={{ width: `${skill.proficiency || 75}%` }}
                    viewport={{ once: true }}
                    transition={{ 
                        delay: delay + 0.2, 
                        duration: 1.2, 
                        ease: "easeOut" 
                    }}
                >
                    {/* Shimmer Effect */}
                    <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12"
                        animate={{ x: isHovered ? ['0%', '100%'] : '0%' }}
                        transition={{ duration: 0.8, ease: "easeInOut" }}
                    />
                </motion.div>
            </div>
        </motion.div>
    );
};

const SkillCategory = ({ category, skills, index }) => {
    const [isExpanded, setIsExpanded] = useState(true);
    
    const categoryColors = {
        'Frontend': 'from-blue-500 to-cyan-500',
        'Backend': 'from-green-500 to-teal-500', 
        'Database': 'from-orange-500 to-red-500',
        'Tools': 'from-purple-500 to-pink-500',
        'Languages': 'from-indigo-500 to-blue-500'
    };
    
    return (
        <StaggerItem>
            <motion.div
                layout
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm"
                whileHover={{ 
                    y: -4,
                    boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 10px 10px -5px rgb(0 0 0 / 0.04)"
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
                {/* Category Header */}
                <motion.div 
                    className="flex items-center justify-between mb-6 cursor-pointer"
                    onClick={() => setIsExpanded(!isExpanded)}
                    whileHover={{ scale: 1.02 }}
                >
                    <div className="flex items-center space-x-3">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${categoryColors[category] || 'from-gray-500 to-gray-600'} flex items-center justify-center`}>
                            <motion.span 
                                className="text-white font-bold text-lg"
                                animate={{ rotate: isExpanded ? 0 : 180 }}
                            >
                                {category === 'Frontend' ? '🎨' :
                                 category === 'Backend' ? '⚙️' :
                                 category === 'Database' ? '🗄️' :
                                 category === 'Tools' ? '🛠️' : '💻'}
                            </motion.span>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                {category}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                {skills.length} skills
                            </p>
                        </div>
                    </div>
                    
                    <motion.div
                        animate={{ rotate: isExpanded ? 0 : -90 }}
                        transition={{ duration: 0.2 }}
                    >
                        ↓
                    </motion.div>
                </motion.div>
                
                {/* Skills List */}
                <AnimatePresence>
                    {isExpanded && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-4"
                        >
                            {skills.map((skill, skillIndex) => (
                                <SkillProgressBar
                                    key={skill.name || skillIndex}
                                    skill={skill}
                                    delay={skillIndex * 0.1}
                                />
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </StaggerItem>
    );
};

const EnhancedSkillsSection = ({ skills = [], loading = false }) => {
    // Group skills by category
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(6)].map((_, index) => (
                    <div key={index} className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm animate-pulse">
                        <div className="flex items-center mb-6">
                            <div className="h-12 w-12 bg-gray-300 dark:bg-gray-700 rounded-xl mr-4"></div>
                            <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-32"></div>
                        </div>
                        <div className="space-y-4">
                            {[...Array(4)].map((_, i) => (
                                <div key={i}>
                                    <div className="flex justify-between mb-2">
                                        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-24"></div>
                                        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-12"></div>
                                    </div>
                                    <div className="h-2 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <ScrollAnimatedSection animation="fadeInUp" className="py-24 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-900">
            <div className="max-w-7xl mx-auto px-6">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <ScrollAnimatedSection animation="fadeInUp">
                        <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                            Skills & 
                            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent ml-3">
                                Expertise
                            </span>
                        </h2>
                        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
                            A comprehensive overview of my technical skills and proficiency levels, 
                            continuously evolving with the latest technologies and best practices.
                        </p>
                    </ScrollAnimatedSection>
                </div>

                {/* Skills Grid */}
                <StaggerContainer staggerDelay={0.1} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {Object.entries(groupedSkills).map(([category, categorySkills], index) => (
                        <SkillCategory
                            key={category}
                            category={category}
                            skills={categorySkills}
                            index={index}
                        />
                    ))}
                </StaggerContainer>
            </div>
        </ScrollAnimatedSection>
    );
};

export default EnhancedSkillsSection;
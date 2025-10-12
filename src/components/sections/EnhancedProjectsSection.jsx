import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { ExternalLink, Github, Eye, Calendar, Star, Code } from 'lucide-react';
import { ScrollAnimatedSection, StaggerContainer, StaggerItem } from '../ui/ScrollAnimations';
import { AnimatedButton } from '../ui/AnimatedButton';
import portfolioService from '../../services/portfolioService';

const ProjectCard = ({ project, index, onView }) => {
    const [isHovered, setIsHovered] = useState(false);
    
    return (
        <StaggerItem>
            <motion.div
                className="group relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm"
                onHoverStart={() => setIsHovered(true)}
                onHoverEnd={() => setIsHovered(false)}
                whileHover={{ 
                    y: -8,
                    boxShadow: "0 25px 50px -12px rgb(0 0 0 / 0.25)"
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                layout
            >
                {/* Project Image */}
                <div className="relative h-48 overflow-hidden bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
                    {project.image ? (
                        <motion.img
                            src={portfolioService.getFileView(project.image)}
                            alt={project.title}
                            className="w-full h-full object-cover"
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.4 }}
                            onError={(e) => {
                                console.error('Failed to load project image:', project.image);
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'flex';
                            }}
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <Code className="h-16 w-16 text-gray-400 dark:text-gray-600" />
                        </div>
                    )}

                    {/* Fallback image container */}
                    <div className="w-full h-full flex items-center justify-center" style={{ display: 'none' }}>
                        <Code className="h-16 w-16 text-gray-400 dark:text-gray-600" />
                    </div>
                    
                    {/* Overlay */}
                    <motion.div
                        className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: isHovered ? 1 : 0 }}
                        transition={{ duration: 0.3 }}
                    />
                    
                    {/* Action Buttons */}
                    <motion.div
                        className="absolute top-4 right-4 flex space-x-2"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ 
                            opacity: isHovered ? 1 : 0,
                            scale: isHovered ? 1 : 0.8
                        }}
                        transition={{ duration: 0.2, delay: 0.1 }}
                    >
                        {project.githubUrl && (
                            <motion.a
                                href={project.githubUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 bg-black/50 backdrop-blur-sm rounded-full text-white hover:bg-black/70"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <Github className="h-4 w-4" />
                            </motion.a>
                        )}
                        {project.demoUrl && (
                            <motion.a
                                href={project.demoUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 bg-black/50 backdrop-blur-sm rounded-full text-white hover:bg-black/70"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <ExternalLink className="h-4 w-4" />
                            </motion.a>
                        )}
                    </motion.div>
                    
                    {/* Featured Badge */}
                    {project.featured && (
                        <motion.div
                            className="absolute top-4 left-4 px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-semibold rounded-full"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <Star className="h-3 w-3 inline mr-1" />
                            Featured
                        </motion.div>
                    )}
                </div>
                
                {/* Project Content */}
                <div className="p-6">
                    {/* Project Title */}
                    <motion.h3 
                        className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors cursor-pointer"
                        onClick={() => onView && onView(project)}
                        whileHover={{ x: 2 }}
                    >
                        {project.title}
                    </motion.h3>
                    
                    {/* Project Description */}
                    <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3 leading-relaxed">
                        {project.description || project.shortDescription}
                    </p>
                    
                    {/* Technologies */}
                    <div className="flex flex-wrap gap-2 mb-4">
                        {project.technologies?.slice(0, 4).map((tech, techIndex) => (
                            <motion.span
                                key={tech}
                                className="px-3 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: techIndex * 0.05 + 0.2 }}
                                whileHover={{ scale: 1.05 }}
                            >
                                {tech}
                            </motion.span>
                        ))}
                        {project.technologies?.length > 4 && (
                            <span className="px-3 py-1 text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 rounded-full">
                                +{project.technologies.length - 4}
                            </span>
                        )}
                    </div>
                    
                    {/* Project Stats */}
                    <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                        <div className="flex items-center space-x-4">
                            {project.startDate && (
                                <div className="flex items-center space-x-1">
                                    <Calendar className="h-4 w-4" />
                                    <span>{project.startDate}</span>
                                </div>
                            )}
                            {project.views && (
                                <div className="flex items-center space-x-1">
                                    <Eye className="h-4 w-4" />
                                    <span>{project.views}</span>
                                </div>
                            )}
                        </div>
                        {project.category && (
                            <span className="capitalize px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs">
                                {project.category}
                            </span>
                        )}
                    </div>
                    
                    {/* View Details Button */}
                    <AnimatedButton
                        variant="ghost"
                        size="sm"
                        onClick={() => onView && onView(project)}
                        className="w-full mt-2"
                    >
                        View Details
                    </AnimatedButton>
                </div>
                
                {/* Hover Glow Effect */}
                <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10 rounded-2xl pointer-events-none"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isHovered ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                />
            </motion.div>
        </StaggerItem>
    );
};

const ProjectFilter = ({ categories, activeCategory, onCategoryChange }) => {
    return (
        <ScrollAnimatedSection animation="fadeInUp" className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((category) => (
                <motion.button
                    key={category}
                    onClick={() => onCategoryChange(category)}
                    className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                        activeCategory === category
                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    animate={{
                        scale: activeCategory === category ? 1.05 : 1,
                    }}
                >
                    {category}
                </motion.button>
            ))}
        </ScrollAnimatedSection>
    );
};

const EnhancedProjectsSection = ({ projects = [], loading = false, onProjectView }) => {
    const [activeCategory, setActiveCategory] = useState('All');
    const [visibleProjects, setVisibleProjects] = useState(6);
    
    // Get unique categories
    const categories = ['All', ...new Set(projects.map(p => p.category).filter(Boolean))];
    
    // Filter projects by category
    const filteredProjects = activeCategory === 'All' 
        ? projects 
        : projects.filter(p => p.category === activeCategory);
    
    const displayedProjects = filteredProjects.slice(0, visibleProjects);

    if (loading) {
        return (
            <div className="py-24">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[...Array(6)].map((_, index) => (
                            <div key={index} className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg animate-pulse">
                                <div className="h-48 bg-gray-300 dark:bg-gray-700"></div>
                                <div className="p-6 space-y-4">
                                    <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
                                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full"></div>
                                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-2/3"></div>
                                    <div className="flex gap-2">
                                        {[...Array(3)].map((_, i) => (
                                            <div key={i} className="h-6 bg-gray-300 dark:bg-gray-700 rounded-full w-16"></div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <ScrollAnimatedSection 
            animation="fadeInUp" 
            className="py-24 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800"
            id="projects"
        >
            <div className="max-w-7xl mx-auto px-6">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <ScrollAnimatedSection animation="fadeInUp">
                        <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                            Featured 
                            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent ml-3">
                                Projects
                            </span>
                        </h2>
                        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
                            Explore my portfolio of web applications, featuring modern technologies 
                            and innovative solutions that solve real-world problems.
                        </p>
                    </ScrollAnimatedSection>
                </div>

                {/* Project Filters */}
                <ProjectFilter 
                    categories={categories}
                    activeCategory={activeCategory}
                    onCategoryChange={setActiveCategory}
                />

                {/* Projects Grid */}
                <StaggerContainer staggerDelay={0.1} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <AnimatePresence mode="popLayout">
                        {displayedProjects.map((project, index) => (
                            <ProjectCard
                                key={project.$id || project.id || index}
                                project={project}
                                index={index}
                                onView={onProjectView}
                            />
                        ))}
                    </AnimatePresence>
                </StaggerContainer>

                {/* Load More Button */}
                {filteredProjects.length > visibleProjects && (
                    <ScrollAnimatedSection animation="fadeInUp" className="text-center mt-12">
                        <AnimatedButton
                            variant="outline"
                            size="lg"
                            onClick={() => setVisibleProjects(prev => prev + 6)}
                            className="px-8 py-4"
                        >
                            Load More Projects
                        </AnimatedButton>
                    </ScrollAnimatedSection>
                )}

                {/* No Projects Message */}
                {projects.length === 0 && !loading && (
                    <ScrollAnimatedSection animation="fadeInUp" className="text-center py-16">
                        <Code className="h-16 w-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                            No Projects Yet
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">
                            Projects will appear here once they&apos;re added to the portfolio.
                        </p>
                    </ScrollAnimatedSection>
                )}
            </div>
        </ScrollAnimatedSection>
    );
};

export default EnhancedProjectsSection;
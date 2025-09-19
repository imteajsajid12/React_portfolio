import { motion } from 'framer-motion';
import { useState } from 'react';
import { Github, ExternalLink } from 'lucide-react';
import PropTypes from 'prop-types';

export const AnimatedCard = ({ 
    children, 
    className = "",
    hoverEffect = "lift",
    ...props 
}) => {
    const [isHovered, setIsHovered] = useState(false);

    const hoverEffects = {
        lift: {
            y: -8,
            scale: 1.02,
            boxShadow: "0 25px 50px -12px rgb(0 0 0 / 0.25)"
        },
        glow: {
            boxShadow: `0 0 20px rgb(59 130 246 / 0.5)`,
        },
        tilt: {
            rotateX: 5,
            rotateY: 5,
            scale: 1.05
        }
    };

    return (
        <motion.div
            className={`
                relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50
                overflow-hidden backdrop-blur-sm ${className}
            `}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            whileHover={hoverEffects[hoverEffect]}
            transition={{ 
                type: "spring", 
                stiffness: 300, 
                damping: 20 
            }}
            {...props}
        >
            {/* Animated gradient border */}
            <motion.div
                className={`absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 rounded-2xl opacity-0`}
                animate={{ 
                    opacity: isHovered ? 1 : 0,
                    scale: isHovered ? 1.02 : 1
                }}
                transition={{ duration: 0.3 }}
            />
            
            {/* Shimmer effect */}
            <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12"
                initial={{ x: '-100%' }}
                animate={{ x: isHovered ? '100%' : '-100%' }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
            />
            
            {/* Content */}
            <div className="relative z-10">
                {children}
            </div>
        </motion.div>
    );
};

export const ProjectCard = ({ 
    project, 
    onClick, 
    className = "" 
}) => {
    return (
        <AnimatedCard 
            className={`cursor-pointer group ${className}`}
            onClick={() => onClick && onClick(project)}
            hoverEffect="lift"
        >
            <div className="relative h-48 overflow-hidden">
                <motion.img
                    src={project.image || "/api/placeholder/400/200"}
                    alt={project.title}
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.4 }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                
                {/* Overlay icons */}
                <div className="absolute top-4 right-4 flex space-x-2">
                    {project.githubUrl && (
                        <motion.a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 bg-black/50 rounded-full text-white hover:bg-black/70"
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
                            className="p-2 bg-black/50 rounded-full text-white hover:bg-black/70"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <ExternalLink className="h-4 w-4" />
                        </motion.a>
                    )}
                </div>
            </div>
            
            <div className="p-6">
                <motion.h3 
                    className="text-xl font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors"
                >
                    {project.title}
                </motion.h3>
                
                <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                    {project.description}
                </p>
                
                {/* Technologies */}
                <div className="flex flex-wrap gap-2">
                    {project.technologies?.slice(0, 4).map((tech, index) => (
                        <motion.span
                            key={tech}
                            className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full"
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            {tech}
                        </motion.span>
                    ))}
                    {project.technologies?.length > 4 && (
                        <span className="px-2 py-1 text-xs text-gray-500 dark:text-gray-400">
                            +{project.technologies.length - 4} more
                        </span>
                    )}
                </div>
            </div>
        </AnimatedCard>
    );
};

// PropTypes for AnimatedCard
AnimatedCard.propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
    hoverEffect: PropTypes.oneOf(['lift', 'glow', 'tilt'])
};

// PropTypes for ProjectCard
ProjectCard.propTypes = {
    project: PropTypes.shape({
        title: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        image: PropTypes.string,
        githubUrl: PropTypes.string,
        demoUrl: PropTypes.string,
        technologies: PropTypes.arrayOf(PropTypes.string)
    }).isRequired,
    onClick: PropTypes.func,
    className: PropTypes.string
};

export default AnimatedCard;
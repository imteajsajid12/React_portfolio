import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link as ScrollLink } from 'react-scroll';

const useActiveSection = (sections) => {
    const [activeSection, setActiveSection] = useState('about');

    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY + window.innerHeight / 3;
            
            for (const section of sections) {
                const element = document.getElementById(section.id);
                if (element) {
                    const { offsetTop, offsetHeight } = element;
                    if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
                        setActiveSection(section.id);
                        break;
                    }
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll(); // Call initially

        return () => window.removeEventListener('scroll', handleScroll);
    }, [sections]);

    return activeSection;
};

const EnhancedNavigation = ({ 
    sections = [
        { id: 'about', label: 'About' },
        { id: 'projects', label: 'Work' },
        { id: 'contact', label: 'Contact' }
    ],
    isDark = false,
    isScrolled = false,
    className = ""
}) => {
    const activeSection = useActiveSection(sections);

    return (
        <nav className={`flex items-center space-x-1 ${className}`}>
            {sections.map((section) => (
                <ScrollLink
                    key={section.id}
                    to={section.id}
                    smooth={true}
                    duration={500}
                    spy={true}
                    className="relative cursor-pointer"
                >
                    <motion.div
                        className={`px-4 py-2 rounded-xl font-medium transition-colors duration-300 ${
                            activeSection === section.id
                                ? 'text-blue-600 dark:text-blue-400'
                                : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                        }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        {section.label}
                        
                        {/* Active indicator */}
                        {activeSection === section.id && (
                            <motion.div
                                className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"
                                layoutId="activeSection"
                                initial={{ scaleX: 0 }}
                                animate={{ scaleX: 1 }}
                                transition={{
                                    type: "spring",
                                    stiffness: 300,
                                    damping: 30
                                }}
                            />
                        )}
                        
                        {/* Hover background */}
                        <motion.div
                            className="absolute inset-0 bg-gray-100 dark:bg-gray-800 rounded-xl -z-10"
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileHover={{ opacity: 0.8, scale: 1 }}
                            transition={{ duration: 0.2 }}
                        />
                    </motion.div>
                </ScrollLink>
            ))}
        </nav>
    );
};

export default EnhancedNavigation;
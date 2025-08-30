    'use client'

    import React, { useEffect, useState } from 'react'
    import { motion, AnimatePresence } from 'framer-motion'
    import { Briefcase, Cloud, Code2, Database, ExternalLink, FolderOpen, Github, Linkedin, Mail, MapPin, Moon, Palette, Search, Server, Sun, Twitter, Menu, X, Award, Calendar, CheckCircle } from 'lucide-react'
    import { animateScroll as scroll, Link as ScrollLink } from 'react-scroll'
    import {
        FaCss3Alt,
        FaDocker,
        FaGitAlt,
        FaHtml5,
        FaJs,
        FaLaravel,
        FaLinux,
        FaNodeJs,
        FaPhp,
        FaReact
    } from 'react-icons/fa'
    import { SiFigma, SiMongodb, SiMysql, SiPostgresql, SiTailwindcss } from 'react-icons/si'

    // Import custom hooks for dynamic data
    import { useProjects, useSkills, useExperience, useAbout, useContacts, useCertifications } from '../hooks/usePortfolio'
    import { useFileUpload } from '../hooks/useFileUpload'
    import portfolioService from '../services/portfolioService'

    const fadeInUp = {
        initial: { opacity: 0, y: 60 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6 }
    }

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    }

    const itemFadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5
            }
        }
    }

    const slideIn = {
        hidden: { x: '-100%' },
        visible: {
            x: 0,
            transition: {
                type: 'spring',
                stiffness: 300,
                damping: 30
            }
        },
        exit: { x: '-100%' }
    };

    export default function Component() {
        const [isDark, setIsDark] = useState(false)
        const [isScrolled, setIsScrolled] = useState(false)
        const [isMenuOpen, setIsMenuOpen] = useState(false)

        // Dynamic data hooks
        const { projects, loading: projectsLoading } = useProjects() // Get all projects
        const { skills, loading: skillsLoading } = useSkills()
        const { experiences, loading: experiencesLoading } = useExperience()
        const { certifications, loading: certificationsLoading } = useCertifications()
        const { about, loading: aboutLoading } = useAbout()
        const { createContact } = useContacts()

        // Contact form state
        const [contactForm, setContactForm] = useState({
            name: '',
            email: '',
            subject: '',
            message: ''
        })
        const [contactLoading, setContactLoading] = useState(false)
        const [contactSuccess, setContactSuccess] = useState(false)

        const toggleTheme = () => {
            setIsDark(!isDark)
        }

        const toggleMenu = () => {
            setIsMenuOpen(!isMenuOpen)
        }

        // Contact form handlers
        const handleContactChange = (e) => {
            const { name, value } = e.target
            setContactForm(prev => ({
                ...prev,
                [name]: value
            }))
        }

        const handleContactSubmit = async (e) => {
            e.preventDefault()
            setContactLoading(true)

            try {
                await createContact(contactForm)
                setContactSuccess(true)
                setContactForm({ name: '', email: '', subject: '', message: '' })
                setTimeout(() => setContactSuccess(false), 5000)
            } catch (error) {
                console.error('Failed to send message:', error)
            } finally {
                setContactLoading(false)
            }
        }

        useEffect(() => {
            const handleScroll = () => {
                setIsScrolled(window.scrollY > 50)
            }

            window.addEventListener('scroll', handleScroll)
            return () => window.removeEventListener('scroll', handleScroll)
        }, [])

        const scrollToTop = () => {
            scroll.scrollToTop()
        }

        return (
            <div className={isDark ? 'dark' : ''}>
                <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
                    {/* Navigation */}
                    <motion.nav
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className={`px-4 sm:px-6 py-4 flex items-center justify-between bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'shadow-md' : ''}`}
                    >
                        <div className="flex items-center">
                            <Code2 className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                            <span className="ml-2 font-semibold text-gray-800 dark:text-white">
                                {about?.website ? about.website.replace(/^https?:\/\//, '') : 'Imteaj.dev'}
                            </span>
                        </div>
                        <div className="hidden sm:flex items-center space-x-6">
                            <ScrollLink to="about" smooth={true} duration={500}
                                className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white cursor-pointer">About</ScrollLink>
                            <ScrollLink to="projects" smooth={true} duration={500}
                                className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white cursor-pointer">Projects</ScrollLink>
                            <ScrollLink to="contact" smooth={true} duration={500}
                                className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white cursor-pointer">Contact</ScrollLink>
                            <button
                                onClick={toggleTheme}
                                className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                                aria-label="Toggle theme"
                            >
                                {isDark ? (
                                    <Sun className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                                ) : (
                                    <Moon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                                )}
                            </button>
                            {about?.socialLinks?.github && (
                                <a href={about.socialLinks.github} target="_blank" rel="noopener noreferrer"
                                    className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white">
                                    <Github className="h-5 w-5" />
                                </a>
                            )}
                        </div>
                        <div className="sm:hidden">
                            <button
                                onClick={toggleMenu}
                                className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                                aria-label="Toggle menu"
                            >
                                {isMenuOpen ? (
                                    <X className="h-6 w-6 text-gray-600 dark:text-gray-300" />
                                ) : (
                                    <Menu className="h-6 w-6 text-gray-600 dark:text-gray-300" />
                                )}
                            </button>
                        </div>
                    </motion.nav>

                    {/* Mobile Menu */}
                    <AnimatePresence>
                        {isMenuOpen && (
                            <motion.div
                                variants={slideIn}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                className="fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-900 shadow-lg sm:hidden"
                            >
                                <div className="p-5 space-y-4">
                                    <button
                                        onClick={toggleMenu}
                                        className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                                        aria-label="Close menu"
                                    >
                                        <X className="h-6 w-6 text-gray-600 dark:text-gray-300" />
                                    </button>
                                    <ScrollLink to="about" smooth={true} duration={500} onClick={toggleMenu}
                                        className="block text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white cursor-pointer">About</ScrollLink>
                                    <ScrollLink to="projects" smooth={true} duration={500} onClick={toggleMenu}
                                        className="block text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white cursor-pointer">Projects</ScrollLink>
                                    <ScrollLink to="contact" smooth={true} duration={500} onClick={toggleMenu}
                                        className="block text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white cursor-pointer">Contact</ScrollLink>
                                    <button
                                        onClick={() => {
                                            toggleTheme();
                                            toggleMenu();
                                        }}
                                        className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
                                    >
                                        {isDark ? (
                                            <>
                                                <Sun className="h-5 w-5" />
                                                <span>Light Mode</span>
                                            </>
                                        ) : (
                                            <>
                                                <Moon className="h-5 w-5" />
                                                <span>Dark Mode</span>
                                            </>
                                        )}
                                    </button>
                                    {about?.socialLinks?.github && (
                                        <a href={about.socialLinks.github} target="_blank" rel="noopener noreferrer"
                                            className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white">
                                            <Github className="h-5 w-5" />
                                            <span>GitHub</span>
                                        </a>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Hero Section */}
                    <motion.div
                        initial="initial"
                        animate="animate"
                        variants={fadeInUp}
                        className="relative"
                        id="about"
                    >
                        <div className="max-w-7xl mx-auto px-6 py-20">
                            <div className="grid lg:grid-cols-2 gap-12">
                                <div className="pt-10">
                                    {aboutLoading ? (
                                        <div className="animate-pulse">
                                            <div className="h-12 bg-gray-300 dark:bg-gray-700 rounded mb-4"></div>
                                            <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded mb-6"></div>
                                            <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded mb-8"></div>
                                        </div>
                                    ) : (
                                        <>
                                            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 dark:from-blue-400 dark:to-purple-400 text-transparent bg-clip-text mb-4">
                                                {about?.name || 'IMTEAJ HOSSAIN'}
                                            </h1>
                                            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
                                                {about?.title || 'Full Stack Web Developer'}
                                            </h2>
                                            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                                                {about?.bio || 'Building robust and scalable web applications with modern technologies and best practices.'}
                                            </p>
                                        </>
                                    )}
                                    <div className="flex space-x-4">
                                        <ScrollLink
                                            to="contact"
                                            smooth={true}
                                            duration={500}
                                            className="px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors cursor-pointer"
                                        >
                                            Contact Me
                                        </ScrollLink>
                                        <ScrollLink
                                            to="projects"
                                            smooth={true}
                                            duration={500}
                                            className="px-6 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex items-center cursor-pointer"
                                        >
                                            <FolderOpen className="h-4 w-4 mr-2" />
                                            View Projects
                                        </ScrollLink>
                                    </div>
                                </div>
                                <div className="relative">
                                    <div
                                        className="absolute inset-0 bg-gradient-to-br from-blue-100 via-purple-100 to-teal-100 dark:from-blue-900/30 dark:via-purple-900/30 dark:to-teal-900/30 rounded-3xl opacity-70"></div>
                                    <div className="relative p-12 flex items-center justify-center">
                                        {aboutLoading ? (
                                            <div className="w-full max-w-md h-96 bg-gray-300 dark:bg-gray-700 rounded-full animate-pulse"></div>
                                        ) : (
                                            <img
                                                src={about?.profileImage ? portfolioService.getFileView(about.profileImage) : "/React_portfolio/images/imteaj.png"}
                                                alt={about?.name || "Profile"}
                                                className="w-full max-w-md rounded-full object-cover"
                                                onError={(e) => {
                                                    e.target.src = "/React_portfolio/images/imteaj.png";
                                                }}
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Skills Section */}
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.2 }}
                        variants={fadeInUp}
                        className="bg-gray-50 dark:bg-gray-800/50 py-20"
                    >
                        <div className="max-w-7xl mx-auto px-6">
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Skills & Technologies</h2>
                            {skillsLoading ? (
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                    {[...Array(6)].map((_, index) => (
                                        <div key={index} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md animate-pulse">
                                            <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded mb-4"></div>
                                            <div className="flex gap-2">
                                                <div className="h-8 w-8 bg-gray-300 dark:bg-gray-700 rounded"></div>
                                                <div className="h-8 w-8 bg-gray-300 dark:bg-gray-700 rounded"></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <motion.div
                                    variants={staggerContainer}
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true, amount: 0.2 }}
                                    className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
                                >
                                    {skills.reduce((acc, skill) => {
                                        const existingCategory = acc.find(cat => cat.category === skill.category);
                                        if (existingCategory) {
                                            existingCategory.skills.push(skill);
                                        } else {
                                            acc.push({
                                                category: skill.category,
                                                skills: [skill]
                                            });
                                        }
                                        return acc;
                                    }, []).map((categoryGroup, index) => (
                                        <motion.div key={index} variants={itemFadeIn} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                                            <div className="flex items-center mb-4">
                                                {categoryGroup.category === 'frontend' && <Code2 className="h-8 w-8 text-blue-500 mr-2" />}
                                                {categoryGroup.category === 'backend' && <Server className="h-8 w-8 text-green-500 mr-2" />}
                                                {categoryGroup.category === 'database' && <Database className="h-8 w-8 text-orange-500 mr-2" />}
                                                {categoryGroup.category === 'devops' && <Cloud className="h-8 w-8 text-blue-500 mr-2" />}
                                                {categoryGroup.category === 'design' && <Palette className="h-8 w-8 text-purple-500 mr-2" />}
                                                {categoryGroup.category === 'version-control' && <Github className="h-8 w-8 text-gray-500 mr-2" />}
                                                <h3 className="text-xl font-semibold dark:text-white capitalize">
                                                    {categoryGroup.category.replace('-', ' ')}
                                                </h3>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {categoryGroup.skills.map((skill) => (
                                                    <div key={skill.$id} className="flex items-center" title={`${skill.name} - ${skill.proficiency}%`}>
                                                        {skill.icon && (
                                                            <div
                                                                className="h-8 w-8"
                                                                style={{ color: skill.color }}
                                                                dangerouslySetInnerHTML={{ __html: skill.icon }}
                                                            />
                                                        )}
                                                        {!skill.icon && (
                                                            <span className="text-sm font-medium px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">
                                                                {skill.name}
                                                            </span>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </motion.div>
                                    ))}
                                </motion.div>
                            )}
                        </div>
                    </motion.div>

                    {/* Projects Section */}
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.2 }}
                        variants={fadeInUp}
                        id="projects"
                        className="py-20"
                    >
                        <div className="max-w-7xl mx-auto px-6">
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Featured Projects</h2>
                            {projectsLoading ? (
                                <div className="grid md:grid-cols-2 gap-8">
                                    {[...Array(4)].map((_, index) => (
                                        <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden animate-pulse">
                                            <div className="w-full h-48 bg-gray-300 dark:bg-gray-700"></div>
                                            <div className="p-6">
                                                <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded mb-2"></div>
                                                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded mb-4"></div>
                                                <div className="flex space-x-4">
                                                    <div className="h-4 w-16 bg-gray-300 dark:bg-gray-700 rounded"></div>
                                                    <div className="h-4 w-16 bg-gray-300 dark:bg-gray-700 rounded"></div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <motion.div
                                    variants={staggerContainer}
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true, amount: 0.2 }}
                                    className="grid md:grid-cols-2 gap-8"
                                >
                                    {projects.length > 0 ? projects.map((project) => (
                                        <motion.div key={project.$id} variants={itemFadeIn} className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
                                            {project.image && (
                                                <img
                                                    src={portfolioService.getFileView(project.image)}
                                                    alt={project.title}
                                                    className="w-full h-48 object-cover"
                                                    onError={(e) => {
                                                        e.target.src = "https://via.placeholder.com/400x200?text=Project+Image";
                                                    }}
                                                />
                                            )}
                                            {!project.image && (
                                                <div className="w-full h-48 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 flex items-center justify-center">
                                                    <FolderOpen className="h-16 w-16 text-gray-400" />
                                                </div>
                                            )}
                                            <div className="p-6">
                                                <h3 className="text-xl font-semibold mb-2 dark:text-white">{project.title}</h3>
                                                <p className="text-gray-600 dark:text-gray-300 mb-4">{project.description}</p>
                                                {project.technologies && project.technologies.length > 0 && (
                                                    <div className="flex flex-wrap gap-2 mb-4">
                                                        {project.technologies.map((tech, index) => (
                                                            <span key={index} className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs rounded-full">
                                                                {tech}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                                <div className="flex space-x-4">
                                                    {project.demoUrl && (
                                                        <a href={project.demoUrl} target="_blank" rel="noopener noreferrer"
                                                            className="text-blue-600 dark:text-blue-400 hover:underline flex items-center">
                                                            <ExternalLink className="h-4 w-4 mr-1" /> Demo
                                                        </a>
                                                    )}
                                                    {project.githubUrl && (
                                                        <a href={project.githubUrl} target="_blank" rel="noopener noreferrer"
                                                            className="text-blue-600 dark:text-blue-400 hover:underline flex items-center">
                                                            <Github className="h-4 w-4 mr-1" /> Code
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        </motion.div>
                                    )) : (
                                        <div className="col-span-2 text-center py-12">
                                            <FolderOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                                            <p className="text-gray-600 dark:text-gray-300">No projects available yet.</p>
                                        </div>
                                    )}
                                </motion.div>
                            )}

                        </div>
                    </motion.div>



                    {/* Work Experience Section */}
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.2 }}
                        variants={fadeInUp}
                        className="py-20"
                    >
                        <div className="max-w-7xl mx-auto px-6">
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Work Experience</h2>
                            {experiencesLoading ? (
                                <div className="space-y-6">
                                    {[...Array(2)].map((_, index) => (
                                        <div key={index} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md animate-pulse">
                                            <div className="flex items-center mb-4">
                                                <div className="h-8 w-8 bg-gray-300 dark:bg-gray-700 rounded mr-4"></div>
                                                <div>
                                                    <div className="h-6 w-48 bg-gray-300 dark:bg-gray-700 rounded mb-2"></div>
                                                    <div className="h-4 w-32 bg-gray-300 dark:bg-gray-700 rounded"></div>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded"></div>
                                                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded"></div>
                                                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <motion.div
                                    variants={staggerContainer}
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true, amount: 0.2 }}
                                    className="space-y-6"
                                >
                                    {experiences.length > 0 ? experiences.map((experience) => (
                                        <motion.div key={experience.$id} variants={itemFadeIn} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                                            <div className="flex items-center mb-4">
                                                {experience.companyLogo ? (
                                                    <img
                                                        src={portfolioService.getFileView(experience.companyLogo)}
                                                        alt={experience.company}
                                                        className="h-8 w-8 rounded mr-4 object-cover"
                                                        onError={(e) => {
                                                            e.target.style.display = 'none';
                                                            e.target.nextSibling.style.display = 'block';
                                                        }}
                                                    />
                                                ) : null}
                                                <Briefcase className="h-8 w-8 text-blue-500 mr-4" style={{display: experience.companyLogo ? 'none' : 'block'}} />
                                                <div>
                                                    <h3 className="text-xl font-semibold dark:text-white">{experience.position}</h3>
                                                    <p className="text-gray-600 dark:text-gray-300">
                                                        {experience.company}
                                                        {experience.location && `, ${experience.location}`}
                                                        {' • '}
                                                        {new Date(experience.startDate).getFullYear()}
                                                        {experience.current ? ' - Present' : ` - ${new Date(experience.endDate).getFullYear()}`}
                                                    </p>
                                                </div>
                                            </div>
                                            {experience.description && experience.description.length > 0 && (
                                                <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 mb-4">
                                                    {experience.description.map((item, index) => (
                                                        <li key={index}>{item}</li>
                                                    ))}
                                                </ul>
                                            )}
                                            {experience.technologies && experience.technologies.length > 0 && (
                                                <div className="flex flex-wrap gap-2">
                                                    {experience.technologies.map((tech, index) => (
                                                        <span key={index} className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-xs rounded-full">
                                                            {tech}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </motion.div>
                                    )) : (
                                        <div className="text-center py-12">
                                            <Briefcase className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                                            <p className="text-gray-600 dark:text-gray-300">No work experience available yet.</p>
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </div>
                    </motion.div>

                    {/* Certifications Section */}
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.2 }}
                        variants={fadeInUp}
                        className="py-20"
                    >
                        <div className="max-w-7xl mx-auto px-6">
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Certifications & Achievements</h2>
                            {certificationsLoading ? (
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {[...Array(6)].map((_, index) => (
                                        <div key={index} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md animate-pulse">
                                            <div className="flex items-center mb-4">
                                                <div className="h-8 w-8 bg-gray-300 dark:bg-gray-700 rounded mr-4"></div>
                                                <div>
                                                    <div className="h-6 w-32 bg-gray-300 dark:bg-gray-700 rounded mb-2"></div>
                                                    <div className="h-4 w-24 bg-gray-300 dark:bg-gray-700 rounded"></div>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded"></div>
                                                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <motion.div
                                    variants={staggerContainer}
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true, amount: 0.2 }}
                                    className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
                                >
                                    {certifications.length > 0 ? certifications.map((certification) => (
                                        <motion.div key={certification.$id} variants={itemFadeIn} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="flex items-center">
                                                    <Award className="h-8 w-8 text-blue-500 mr-3" />
                                                    <div>
                                                        <h3 className="text-lg font-semibold dark:text-white">{certification.title}</h3>
                                                        <p className="text-gray-600 dark:text-gray-300 text-sm">{certification.issuer}</p>
                                                    </div>
                                                </div>
                                                {certification.featured && (
                                                    <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 text-xs rounded-full">
                                                        Featured
                                                    </span>
                                                )}
                                            </div>

                                            {certification.certificateImage && (
                                                <div className="mb-4">
                                                    <img
                                                        src={portfolioService.getFileView(certification.certificateImage)}
                                                        alt={certification.title}
                                                        className="w-full h-32 object-cover rounded border"
                                                        onError={(e) => {
                                                            e.target.style.display = 'none';
                                                        }}
                                                    />
                                                </div>
                                            )}

                                            {certification.description && (
                                                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                                                    {certification.description}
                                                </p>
                                            )}

                                            <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="h-4 w-4" />
                                                    <span>Issued: {new Date(certification.issueDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}</span>
                                                </div>
                                                {certification.expiryDate && (
                                                    <div className="flex items-center gap-1">
                                                        {new Date(certification.expiryDate) > new Date() ? (
                                                            <CheckCircle className="h-4 w-4 text-green-500" />
                                                        ) : (
                                                            <X className="h-4 w-4 text-red-500" />
                                                        )}
                                                        <span>
                                                            {new Date(certification.expiryDate) > new Date() ? 'Valid' : 'Expired'}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>

                                            {certification.skills && certification.skills.length > 0 && (
                                                <div className="flex flex-wrap gap-2 mb-4">
                                                    {certification.skills.map((skill, index) => (
                                                        <span
                                                            key={index}
                                                            className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs rounded-full"
                                                        >
                                                            {skill}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}

                                            <div className="flex items-center justify-between">
                                                {certification.verificationUrl && (
                                                    <a
                                                        href={certification.verificationUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-blue-600 dark:text-blue-400 hover:underline flex items-center text-sm"
                                                    >
                                                        <ExternalLink className="h-4 w-4 mr-1" />
                                                        Verify
                                                    </a>
                                                )}
                                                {certification.credentialId && (
                                                    <span className="text-gray-500 dark:text-gray-400 text-xs">
                                                        ID: {certification.credentialId}
                                                    </span>
                                                )}
                                            </div>
                                        </motion.div>
                                    )) : (
                                        <div className="col-span-full text-center py-12">
                                            <Award className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                                            <p className="text-gray-600 dark:text-gray-300">No certifications available yet.</p>
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </div>
                    </motion.div>

                    {/* Contact Section */}
                    <motion.div
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true }}
                        variants={fadeInUp}
                        id="contact"
                        className="bg-gray-50 dark:bg-gray-800/50 py-20"
                    >
                        <div className="max-w-7xl mx-auto px-6">
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Contact & Locations</h2>
                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                                    <Mail className="h-8 w-8 text-blue-500 mb-4" />
                                    <h3 className="text-xl font-semibold mb-4 dark:text-white">Get in Touch</h3>
                                    {contactSuccess && (
                                        <div className="mb-4 p-4 bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700 rounded-md">
                                            <p className="text-green-800 dark:text-green-300">Thank you! Your message has been sent successfully.</p>
                                        </div>
                                    )}
                                    <form onSubmit={handleContactSubmit} className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={contactForm.name}
                                                onChange={handleContactChange}
                                                required
                                                className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={contactForm.email}
                                                onChange={handleContactChange}
                                                required
                                                className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Subject</label>
                                            <input
                                                type="text"
                                                name="subject"
                                                value={contactForm.subject}
                                                onChange={handleContactChange}
                                                required
                                                className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Message</label>
                                            <textarea
                                                rows={4}
                                                name="message"
                                                value={contactForm.message}
                                                onChange={handleContactChange}
                                                required
                                                className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            ></textarea>
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={contactLoading}
                                            className="w-full px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                                        >
                                            {contactLoading ? (
                                                <>
                                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                    Sending...
                                                </>
                                            ) : (
                                                'Send Message'
                                            )}
                                        </button>
                                    </form>
                                </div>
                                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                                    <MapPin className="h-8 w-8 text-green-500 mb-4" />
                                    <h3 className="text-xl font-semibold mb-4 dark:text-white">Contact Information</h3>
                                    {aboutLoading ? (
                                        <div className="space-y-4 animate-pulse">
                                            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded"></div>
                                            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
                                            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {about?.location && (
                                                <div>
                                                    <h4 className="font-medium text-gray-900 dark:text-white mb-1">{about.location}</h4>
                                                    <p className="text-gray-600 dark:text-gray-300">Available for remote work and relocation</p>
                                                </div>
                                            )}
                                            {about?.email && (
                                                <div>
                                                    <h4 className="font-medium text-gray-900 dark:text-white mb-1">Email</h4>
                                                    <a href={`mailto:${about.email}`} className="text-blue-600 dark:text-blue-400 hover:underline">
                                                        {about.email}
                                                    </a>
                                                </div>
                                            )}
                                            {about?.phone && (
                                                <div>
                                                    <h4 className="font-medium text-gray-900 dark:text-white mb-1">Phone</h4>
                                                    <a href={`tel:${about.phone}`} className="text-blue-600 dark:text-blue-400 hover:underline">
                                                        {about.phone}
                                                    </a>
                                                </div>
                                            )}
                                            {about?.socialLinks && Object.keys(about.socialLinks).length > 0 && (
                                                <div className="pt-4">
                                                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Connect</h4>
                                                    <div className="flex space-x-4">
                                                        {about.socialLinks.github && (
                                                            <a href={about.socialLinks.github} target="_blank" rel="noopener noreferrer"
                                                                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                                                                <Github className="h-6 w-6" />
                                                            </a>
                                                        )}
                                                        {about.socialLinks.linkedin && (
                                                            <a href={about.socialLinks.linkedin} target="_blank" rel="noopener noreferrer"
                                                                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                                                                <Linkedin className="h-6 w-6" />
                                                            </a>
                                                        )}
                                                        {about.socialLinks.twitter && (
                                                            <a href={about.socialLinks.twitter} target="_blank" rel="noopener noreferrer"
                                                                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                                                                <Twitter className="h-6 w-6" />
                                                            </a>
                                                        )}
                                                        {about.socialLinks.website && (
                                                            <a href={about.socialLinks.website} target="_blank" rel="noopener noreferrer"
                                                                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                                                                <ExternalLink className="h-6 w-6" />
                                                            </a>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Footer */}
                    <motion.footer
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true }}
                        variants={fadeInUp}
                        className="bg-gray-100 dark:bg-gray-800 py-8"
                    >
                        <div className="max-w-7xl mx-auto px-6">
                            <div className="flex flex-col md:flex-row justify-between items-center">
                                <div className="mb-4 md:mb-0">
                                    <p className="text-gray-600 dark:text-gray-300">
                                        &copy; 2025 {about?.name || 'Imteaj Hossain'}. All rights reserved.
                                    </p>
                                </div>
                                <div className="flex space-x-4">
                                    {about?.socialLinks?.github && (
                                        <a href={about.socialLinks.github} target="_blank" rel="noopener noreferrer"
                                            className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                                            <Github className="h-6 w-6" />
                                        </a>
                                    )}
                                    {about?.socialLinks?.linkedin && (
                                        <a href={about.socialLinks.linkedin} target="_blank" rel="noopener noreferrer"
                                            className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                                            <Linkedin className="h-6 w-6" />
                                        </a>
                                    )}
                                    {about?.socialLinks?.twitter && (
                                        <a href={about.socialLinks.twitter} target="_blank" rel="noopener noreferrer"
                                            className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                                            <Twitter className="h-6 w-6" />
                                        </a>
                                    )}
                                    {about?.socialLinks?.website && (
                                        <a href={about.socialLinks.website} target="_blank" rel="noopener noreferrer"
                                            className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                                            <ExternalLink className="h-6 w-6" />
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    </motion.footer>

                    {/* Scroll to Top Button */}
                    <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: isScrolled ? 1 : 0 }}
                        transition={{ duration: 0.3 }}
                        onClick={scrollToTop}
                        className="fixed bottom-8 right-8 p-2 rounded-full bg-blue-600 text-white shadow-lg"
                        aria-label="Scroll to top"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                        </svg>
                    </motion.button>
                </div>
            </div>
        )
    }


    'use client'

    import { useEffect, useState } from 'react'
    import { motion, AnimatePresence } from 'framer-motion'
    import { Briefcase, Code2, ExternalLink, FolderOpen, Github, Linkedin, Mail, MapPin, Moon, Palette, Sun, Twitter, Menu, X, Award, Calendar, CheckCircle, BookOpen, ChevronUp } from 'lucide-react'
    import { animateScroll as scroll, Link as ScrollLink } from 'react-scroll'
    import { Link as RouterLink } from 'react-router-dom'

    // Import custom hooks for dynamic data
    import { useProjects, useSkills, useExperience, useAbout, useContacts, useCertifications } from '../hooks/usePortfolio'
    import portfolioService from '../services/portfolioService'

    // Import new UI components
    import ParticleBackground from '../components/ui/ParticleBackground'
    import AnimatedText, { TextReveal, GradientText } from '../components/ui/AnimatedText'
    import { AnimatedButton, FloatingActionButton } from '../components/ui/AnimatedButton'
    import { ScrollAnimatedSection, StaggerContainer, StaggerItem } from '../components/ui/ScrollAnimations'
    import EnhancedNavigation from '../components/ui/EnhancedNavigation'
    import EnhancedSkillsSection from '../components/sections/EnhancedSkillsSection'
    import EnhancedProjectsSection from '../components/sections/EnhancedProjectsSection'

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
                    {/* Navigation - Clean & Modern */}
                    <motion.nav
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled 
                            ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-lg border-b border-gray-200/20 dark:border-gray-700/20' 
                            : 'bg-transparent'
                        }`}
                    >
                        <div className="max-w-7xl mx-auto px-6">
                            <div className="flex items-center justify-between h-16">
                                {/* Logo - Simplified */}
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

                                {/* Enhanced Desktop Navigation */}
                                <div className="hidden md:flex items-center space-x-6">
                                    <EnhancedNavigation 
                                        sections={[
                                            { id: "about", label: "About" },
                                            { id: "projects", label: "Work" },
                                            { id: "contact", label: "Contact" }
                                        ]}
                                        isDark={isDark}
                                        isScrolled={isScrolled}
                                    />
                                    
                                    {/* Blog Link */}
                                    <RouterLink 
                                        to="/blog"
                                        className="relative px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white cursor-pointer transition-colors duration-200 group flex items-center space-x-2"
                                    >
                                        <BookOpen className="h-4 w-4" />
                                        <span>Blog</span>
                                        <motion.span 
                                            className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-300"
                                            initial={{ width: 0 }}
                                            whileHover={{ width: '100%' }}
                                        />
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

                    {/* Mobile Menu - Redesigned */}
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
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                                                    <Code2 className="h-5 w-5 text-white" />
                                                </div>
                                                <span className="text-lg font-bold text-gray-900 dark:text-white">
                                                    Menu
                                                </span>
                                            </div>
                                        </div>

                                        {/* Navigation Links */}
                                        <nav className="space-y-2">
                                            {[
                                                { to: "about", label: "About", icon: "👋" },
                                                { to: "projects", label: "Work", icon: "💼" },
                                                { to: "contact", label: "Contact", icon: "📬" }
                                            ].map((item) => (
                                                <ScrollLink
                                                    key={item.to}
                                                    to={item.to}
                                                    smooth={true}
                                                    duration={500}
                                                    onClick={toggleMenu}
                                                    className="flex items-center space-x-3 p-3 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer transition-colors duration-200"
                                                >
                                                    <span className="text-xl">{item.icon}</span>
                                                    <span className="font-medium">{item.label}</span>
                                                </ScrollLink>
                                            ))}
                                            
                                            {/* Blog Link */}
                                            <RouterLink
                                                to="/blog"
                                                onClick={toggleMenu}
                                                className="flex items-center space-x-3 p-3 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer transition-colors duration-200"
                                            >
                                                <BookOpen className="h-5 w-5" />
                                                <span className="font-medium">Blog</span>
                                            </RouterLink>
                                        </nav>

                                        {/* Divider */}
                                        <div className="border-t border-gray-200 dark:border-gray-700"></div>

                                        {/* Bottom Actions */}
                                        <div className="space-y-3">
                                            {/* Theme Toggle */}
                                            <button
                                                onClick={() => {
                                                    toggleTheme();
                                                    toggleMenu();
                                                }}
                                                className="flex items-center space-x-3 p-3 w-full rounded-xl bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                                            >
                                                {isDark ? (
                                                    <>
                                                        <Sun className="h-5 w-5 text-yellow-500" />
                                                        <span className="font-medium text-gray-700 dark:text-gray-300">Light Mode</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Moon className="h-5 w-5 text-gray-600" />
                                                        <span className="font-medium text-gray-700 dark:text-gray-300">Dark Mode</span>
                                                    </>
                                                )}
                                            </button>

                                            {/* GitHub Link */}
                                            {about?.socialLinks?.github && (
                                                <a 
                                                    href={about.socialLinks.github} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    onClick={toggleMenu}
                                                    className="flex items-center space-x-3 p-3 w-full rounded-xl bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                                                >
                                                    <Github className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                                                    <span className="font-medium text-gray-700 dark:text-gray-300">GitHub</span>
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            </>
                        )}
                    </AnimatePresence>

                    {/* Enhanced Hero Section - Modern & Animated */}
                    <motion.div
                        initial="initial"
                        animate="animate"
                        variants={fadeInUp}
                        className="relative min-h-screen flex items-center"
                        id="about"
                    >
                        {/* Interactive Particle Background */}
                        <ParticleBackground isDark={isDark} density={60} />
                        
                        {/* Enhanced Background Elements */}
                        <div className="absolute inset-0 overflow-hidden">
                            <motion.div 
                                animate={{ 
                                    rotate: [0, 360],
                                    scale: [1, 1.1, 1]
                                }}
                                transition={{ 
                                    duration: 20, 
                                    repeat: Infinity, 
                                    ease: "linear" 
                                }}
                                className="absolute top-1/4 left-10 w-72 h-72 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"
                            />
                            <motion.div 
                                animate={{ 
                                    rotate: [360, 0],
                                    scale: [1.1, 1, 1.1]
                                }}
                                transition={{ 
                                    duration: 25, 
                                    repeat: Infinity, 
                                    ease: "linear" 
                                }}
                                className="absolute bottom-1/4 right-10 w-96 h-96 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"
                            />
                            
                            {/* Floating geometric shapes */}
                            <motion.div
                                animate={{ 
                                    y: [-20, 20, -20],
                                    rotate: [0, 180, 0]
                                }}
                                transition={{ 
                                    duration: 8, 
                                    repeat: Infinity,
                                    ease: "easeInOut" 
                                }}
                                className="absolute top-1/3 right-1/4 w-16 h-16 border-2 border-blue-400/30 rounded-lg"
                            />
                            <motion.div
                                animate={{ 
                                    y: [20, -20, 20],
                                    x: [-10, 10, -10]
                                }}
                                transition={{ 
                                    duration: 10, 
                                    repeat: Infinity,
                                    ease: "easeInOut" 
                                }}
                                className="absolute bottom-1/3 left-1/4 w-8 h-8 bg-gradient-to-r from-purple-500/30 to-pink-500/30 rounded-full"
                            />
                        </div>

                        <div className="relative max-w-7xl mx-auto px-6 py-20 w-full">
                            <div className="grid lg:grid-cols-2 gap-16 items-center">
                                {/* Content Side */}
                                <div className="space-y-8">
                                    {aboutLoading ? (
                                        <div className="animate-pulse space-y-6">
                                            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-32"></div>
                                            <div className="h-16 bg-gray-300 dark:bg-gray-700 rounded"></div>
                                            <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
                                            <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded"></div>
                                        </div>
                                    ) : (
                                        <>
                                            {/* Small Badge */}
                                            <motion.div
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.2 }}
                                                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/50 dark:to-purple-950/50 border border-blue-200/50 dark:border-blue-800/50 rounded-full text-sm font-medium text-blue-700 dark:text-blue-300"
                                            >
                                                <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                                                Available for new opportunities
                                            </motion.div>

                                            {/* Enhanced Name with Text Animation */}
                                            <motion.h1 
                                                initial={{ opacity: 0, y: 30 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.3 }}
                                                className="text-5xl lg:text-7xl font-bold text-gray-900 dark:text-white leading-tight mb-4"
                                            >
                                                <TextReveal delay={0.3}>
                                                    Hi, I&apos;m{' '}
                                                </TextReveal>
                                                <GradientText 
                                                    colors={["from-blue-600", "via-purple-600", "to-indigo-600"]}
                                                    className="block lg:inline-block"
                                                >
                                                    {about?.name?.split(' ')[0] || 'Imteaj'}
                                                </GradientText>
                                            </motion.h1>

                                            {/* Animated Title with Typewriter Effect */}
                                            <motion.div
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.6 }}
                                                className="text-2xl lg:text-4xl text-gray-600 dark:text-gray-300 font-light mb-6"
                                            >
                                                <AnimatedText 
                                                    strings={[
                                                        about?.title || 'Full Stack Developer',
                                                        'React Developer',
                                                        'UI/UX Enthusiast',
                                                        'Problem Solver'
                                                    ]}
                                                    typeSpeed={100}
                                                    backSpeed={50}
                                                    loop={true}
                                                />
                                            </motion.div>

                                            {/* Enhanced Bio with Reveal Animation */}
                                            <ScrollAnimatedSection 
                                                animation="fadeInUp"
                                                delay={0.8}
                                                className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed max-w-xl"
                                            >
                                                <TextReveal delay={0.8}>
                                                    {about?.bio || 'I create beautiful, functional web applications with clean code and exceptional user experiences. Passionate about turning ideas into reality through innovative technology solutions.'}
                                                </TextReveal>
                                            </ScrollAnimatedSection>
                                        </>
                                    )}

                                    {/* Enhanced CTA Buttons */}
                                    <StaggerContainer 
                                        staggerDelay={0.2}
                                        className="flex flex-col sm:flex-row gap-6 mt-8"
                                    >
                                        <StaggerItem>
                                            <ScrollLink
                                                to="contact"
                                                smooth={true}
                                                duration={500}
                                            >
                                                <AnimatedButton 
                                                    variant="primary"
                                                    size="lg"
                                                    className="w-full sm:w-auto"
                                                >
                                                    <span className="flex items-center">
                                                        Get In Touch
                                                        <motion.div 
                                                            className="ml-2"
                                                            animate={{ x: [0, 4, 0] }}
                                                            transition={{ repeat: Infinity, duration: 1.5 }}
                                                        >
                                                            →
                                                        </motion.div>
                                                    </span>
                                                </AnimatedButton>
                                            </ScrollLink>
                                        </StaggerItem>
                                        
                                        <StaggerItem>
                                            <ScrollLink
                                                to="projects"
                                                smooth={true}
                                                duration={500}
                                            >
                                                <AnimatedButton 
                                                    variant="outline"
                                                    size="lg"
                                                    icon={<FolderOpen className="h-5 w-5" />}
                                                    className="w-full sm:w-auto"
                                                >
                                                    View My Work
                                                </AnimatedButton>
                                            </ScrollLink>
                                        </StaggerItem>
                                        
                                        {/* New Social Links */}
                                        <StaggerItem>
                                            <div className="flex gap-3">
                                                {about?.socialLinks?.github && (
                                                    <motion.a
                                                        href={about.socialLinks.github}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="p-3 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                                                        whileHover={{ scale: 1.1, y: -2 }}
                                                        whileTap={{ scale: 0.9 }}
                                                    >
                                                        <Github className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                                                    </motion.a>
                                                )}
                                                {about?.socialLinks?.linkedin && (
                                                    <motion.a
                                                        href={about.socialLinks.linkedin}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="p-3 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                                                        whileHover={{ scale: 1.1, y: -2 }}
                                                        whileTap={{ scale: 0.9 }}
                                                    >
                                                        <Linkedin className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                                                    </motion.a>
                                                )}
                                                {about?.email && (
                                                    <motion.a
                                                        href={`mailto:${about.email}`}
                                                        className="p-3 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                                                        whileHover={{ scale: 1.1, y: -2 }}
                                                        whileTap={{ scale: 0.9 }}
                                                    >
                                                        <Mail className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                                                    </motion.a>
                                                )}
                                            </div>
                                        </StaggerItem>
                                    </StaggerContainer>
                                </div>

                                {/* Enhanced Profile Image with Advanced Animations */}
                                <ScrollAnimatedSection 
                                    animation="scaleIn"
                                    delay={0.6}
                                    duration={1}
                                    className="relative flex justify-center lg:justify-end"
                                >
                                    <div className="relative">
                                        {/* Animated Background Rings */}
                                        <motion.div 
                                            animate={{ 
                                                rotate: [0, 360],
                                                scale: [1, 1.05, 1]
                                            }}
                                            transition={{ 
                                                duration: 20, 
                                                repeat: Infinity, 
                                                ease: "linear" 
                                            }}
                                            className="absolute inset-0 bg-gradient-to-br from-blue-400/20 via-purple-400/20 to-pink-400/20 rounded-full transform scale-125 blur-sm"
                                        />
                                        
                                        <motion.div 
                                            animate={{ 
                                                rotate: [360, 0],
                                                scale: [1.05, 1, 1.05]
                                            }}
                                            transition={{ 
                                                duration: 15, 
                                                repeat: Infinity, 
                                                ease: "linear" 
                                            }}
                                            className="absolute inset-0 border-2 border-gradient-to-r from-blue-500/30 to-purple-500/30 rounded-full transform scale-110"
                                        />
                                        
                                        {/* Profile Image Container */}
                                        <motion.div 
                                            className="relative w-80 h-80 lg:w-96 lg:h-96"
                                            whileHover={{ scale: 1.02 }}
                                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                        >
                                            {aboutLoading ? (
                                                <div className="w-full h-full bg-gray-300 dark:bg-gray-700 rounded-full animate-pulse"></div>
                                            ) : (
                                                <motion.img
                                                    src={about?.profileImage ? portfolioService.getFileView(about.profileImage) : "/React_portfolio/images/imteaj.png"}
                                                    alt={about?.name || "Profile"}
                                                    className="w-full h-full object-cover rounded-full shadow-2xl border-4 border-white dark:border-gray-800 relative z-10"
                                                    whileHover={{ 
                                                        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.4)"
                                                    }}
                                                    onError={(e) => {
                                                        e.target.src = "/React_portfolio/images/imteaj.png";
                                                    }}
                                                />
                                            )}
                                        </motion.div>

                                        {/* Enhanced Floating Elements */}
                                        <motion.div 
                                            animate={{ 
                                                y: [-15, 15, -15],
                                                rotate: [0, 360]
                                            }}
                                            transition={{ 
                                                y: { repeat: Infinity, duration: 4, ease: "easeInOut" },
                                                rotate: { repeat: Infinity, duration: 10, ease: "linear" }
                                            }}
                                            className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl z-20"
                                            whileHover={{ scale: 1.1 }}
                                        >
                                            <Code2 className="w-8 h-8 text-white" />
                                        </motion.div>
                                        
                                        <motion.div 
                                            animate={{ 
                                                y: [15, -15, 15],
                                                x: [-5, 5, -5]
                                            }}
                                            transition={{ 
                                                y: { repeat: Infinity, duration: 3.5, ease: "easeInOut" },
                                                x: { repeat: Infinity, duration: 2, ease: "easeInOut" }
                                            }}
                                            className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-br from-green-500 to-teal-600 rounded-xl flex items-center justify-center shadow-xl z-20"
                                            whileHover={{ scale: 1.1 }}
                                        >
                                            <CheckCircle className="w-6 h-6 text-white" />
                                        </motion.div>
                                        
                                        {/* Additional floating icons */}
                                        <motion.div
                                            animate={{ 
                                                y: [-8, 8, -8],
                                                rotate: [0, -180, 0]
                                            }}
                                            transition={{ 
                                                y: { repeat: Infinity, duration: 5, ease: "easeInOut" },
                                                rotate: { repeat: Infinity, duration: 8, ease: "easeInOut" }
                                            }}
                                            className="absolute top-1/4 -left-8 w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center shadow-lg z-20"
                                            whileHover={{ scale: 1.1 }}
                                        >
                                            <Briefcase className="w-5 h-5 text-white" />
                                        </motion.div>
                                        
                                        <motion.div
                                            animate={{ 
                                                y: [12, -12, 12],
                                                x: [5, -5, 5]
                                            }}
                                            transition={{ 
                                                y: { repeat: Infinity, duration: 4.5, ease: "easeInOut" },
                                                x: { repeat: Infinity, duration: 3, ease: "easeInOut" }
                                            }}
                                            className="absolute bottom-1/4 -right-8 w-12 h-12 bg-gradient-to-br from-pink-400 to-red-500 rounded-full flex items-center justify-center shadow-lg z-20"
                                            whileHover={{ scale: 1.1 }}
                                        >
                                            <Palette className="w-5 h-5 text-white" />
                                        </motion.div>
                                    </div>
                                </ScrollAnimatedSection>
                            </div>
                        </div>
                    </motion.div>

                    {/* Enhanced Skills Section */}
                    <EnhancedSkillsSection 
                        skills={skills}
                        loading={skillsLoading}
                    />

                    {/* Enhanced Projects Section */}
                    <EnhancedProjectsSection 
                        projects={projects}
                        loading={projectsLoading}
                        onProjectView={(project) => {
                            console.log('View project:', project);
                            // Add project modal or navigation logic here
                        }}
                    />



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

                    {/* Contact Section - Modern Design */}
                    <motion.div
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true }}
                        variants={fadeInUp}
                        id="contact"
                        className="py-24 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-900 relative overflow-hidden"
                    >
                        {/* Background Elements */}
                        <div className="absolute inset-0">
                            <div className="absolute top-1/4 right-10 w-96 h-96 bg-gradient-to-br from-blue-400/5 to-purple-400/5 rounded-full blur-3xl"></div>
                            <div className="absolute bottom-1/4 left-10 w-72 h-72 bg-gradient-to-br from-purple-400/5 to-pink-400/5 rounded-full blur-3xl"></div>
                        </div>

                        <div className="relative max-w-6xl mx-auto px-6">
                            {/* Section Header */}
                            <div className="text-center mb-16">
                                <motion.h2 
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    className="text-4xl font-bold text-gray-900 dark:text-white mb-4"
                                >
                                    Let&apos;s Work Together
                                </motion.h2>
                                <motion.p 
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.1 }}
                                    className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
                                >
                                    Have a project in mind? I&apos;d love to hear about it and discuss how we can bring your ideas to life.
                                </motion.p>
                            </div>

                            <div className="grid lg:grid-cols-2 gap-12">
                                {/* Contact Form */}
                                <motion.div 
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    className="space-y-6"
                                >
                                    <div className="bg-white dark:bg-gray-800/50 backdrop-blur-sm p-8 rounded-3xl border border-gray-200/50 dark:border-gray-700/50 shadow-xl">
                                        {/* Success Message */}
                                        {contactSuccess && (
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.95 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-2xl"
                                            >
                                                <div className="flex items-center">
                                                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                                                    <p className="text-green-700 dark:text-green-400 font-medium">
                                                        Thank you! Your message has been sent successfully.
                                                    </p>
                                                </div>
                                            </motion.div>
                                        )}

                                        <form onSubmit={handleContactSubmit} className="space-y-6">
                                            {/* Name & Email Row */}
                                            <div className="grid sm:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                        Name *
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="name"
                                                        value={contactForm.name}
                                                        onChange={handleContactChange}
                                                        required
                                                        placeholder="Your name"
                                                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors duration-200"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                        Email *
                                                    </label>
                                                    <input
                                                        type="email"
                                                        name="email"
                                                        value={contactForm.email}
                                                        onChange={handleContactChange}
                                                        required
                                                        placeholder="your@email.com"
                                                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors duration-200"
                                                    />
                                                </div>
                                            </div>

                                            {/* Subject */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                    Subject *
                                                </label>
                                                <input
                                                    type="text"
                                                    name="subject"
                                                    value={contactForm.subject}
                                                    onChange={handleContactChange}
                                                    required
                                                    placeholder="Project discussion"
                                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors duration-200"
                                                />
                                            </div>

                                            {/* Message */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                    Message *
                                                </label>
                                                <textarea
                                                    rows={5}
                                                    name="message"
                                                    value={contactForm.message}
                                                    onChange={handleContactChange}
                                                    required
                                                    placeholder="Tell me about your project..."
                                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors duration-200 resize-none"
                                                />
                                            </div>

                                            {/* Submit Button */}
                                            <motion.button
                                                type="submit"
                                                disabled={contactLoading}
                                                whileHover={{ scale: contactLoading ? 1 : 1.02 }}
                                                whileTap={{ scale: contactLoading ? 1 : 0.98 }}
                                                className="w-full px-8 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-semibold rounded-xl hover:bg-gray-800 dark:hover:bg-gray-100 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center"
                                            >
                                                {contactLoading ? (
                                                    <>
                                                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white dark:border-gray-900 border-t-transparent mr-3"></div>
                                                        Sending...
                                                    </>
                                                ) : (
                                                    <>
                                                        Send Message
                                                        <motion.div 
                                                            className="ml-2"
                                                            animate={{ x: [0, 4, 0] }}
                                                            transition={{ repeat: Infinity, duration: 1.5 }}
                                                        >
                                                            →
                                                        </motion.div>
                                                    </>
                                                )}
                                            </motion.button>
                                        </form>
                                    </div>
                                </motion.div>

                                {/* Contact Information */}
                                <motion.div 
                                    initial={{ opacity: 0, x: 20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.2 }}
                                    className="space-y-6"
                                >
                                    {aboutLoading ? (
                                        <div className="bg-white dark:bg-gray-800/50 p-8 rounded-3xl border border-gray-200/50 dark:border-gray-700/50 shadow-xl">
                                            <div className="space-y-6 animate-pulse">
                                                <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-48"></div>
                                                <div className="space-y-4">
                                                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded"></div>
                                                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
                                                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            {/* Contact Info Cards */}
                                            <div className="space-y-4">
                                                {about?.email && (
                                                    <motion.div 
                                                        whileHover={{ scale: 1.02, y: -2 }}
                                                        className="bg-white dark:bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg"
                                                    >
                                                        <div className="flex items-center space-x-4">
                                                            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                                                                <Mail className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                                            </div>
                                                            <div>
                                                                <h4 className="font-semibold text-gray-900 dark:text-white">Email</h4>
                                                                <a 
                                                                    href={`mailto:${about.email}`} 
                                                                    className="text-blue-600 dark:text-blue-400 hover:underline transition-colors"
                                                                >
                                                                    {about.email}
                                                                </a>
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                )}

                                                {about?.location && (
                                                    <motion.div 
                                                        whileHover={{ scale: 1.02, y: -2 }}
                                                        className="bg-white dark:bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg"
                                                    >
                                                        <div className="flex items-center space-x-4">
                                                            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
                                                                <MapPin className="h-6 w-6 text-green-600 dark:text-green-400" />
                                                            </div>
                                                            <div>
                                                                <h4 className="font-semibold text-gray-900 dark:text-white">Location</h4>
                                                                <p className="text-gray-600 dark:text-gray-400">{about.location}</p>
                                                                <p className="text-sm text-gray-500 dark:text-gray-500">Available remotely</p>
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </div>

                                            {/* Social Links */}
                                            {about?.socialLinks && Object.keys(about.socialLinks).length > 0 && (
                                                <div className="bg-white dark:bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
                                                    <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Connect with me</h4>
                                                    <div className="grid grid-cols-2 gap-3">
                                                        {about.socialLinks.github && (
                                                            <motion.a 
                                                                href={about.socialLinks.github} 
                                                                target="_blank" 
                                                                rel="noopener noreferrer"
                                                                whileHover={{ scale: 1.05 }}
                                                                whileTap={{ scale: 0.95 }}
                                                                className="flex items-center justify-center space-x-2 p-3 bg-gray-100 dark:bg-gray-700/50 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600/50 transition-colors"
                                                            >
                                                                <Github className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                                                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">GitHub</span>
                                                            </motion.a>
                                                        )}
                                                        {about.socialLinks.linkedin && (
                                                            <motion.a 
                                                                href={about.socialLinks.linkedin} 
                                                                target="_blank" 
                                                                rel="noopener noreferrer"
                                                                whileHover={{ scale: 1.05 }}
                                                                whileTap={{ scale: 0.95 }}
                                                                className="flex items-center justify-center space-x-2 p-3 bg-gray-100 dark:bg-gray-700/50 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600/50 transition-colors"
                                                            >
                                                                <Linkedin className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">LinkedIn</span>
                                                            </motion.a>
                                                        )}
                                                        {about.socialLinks.twitter && (
                                                            <motion.a 
                                                                href={about.socialLinks.twitter} 
                                                                target="_blank" 
                                                                rel="noopener noreferrer"
                                                                whileHover={{ scale: 1.05 }}
                                                                whileTap={{ scale: 0.95 }}
                                                                className="flex items-center justify-center space-x-2 p-3 bg-gray-100 dark:bg-gray-700/50 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600/50 transition-colors"
                                                            >
                                                                <Twitter className="h-5 w-5 text-blue-500 dark:text-blue-400" />
                                                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Twitter</span>
                                                            </motion.a>
                                                        )}
                                                        {about.socialLinks.website && (
                                                            <motion.a 
                                                                href={about.socialLinks.website} 
                                                                target="_blank" 
                                                                rel="noopener noreferrer"
                                                                whileHover={{ scale: 1.05 }}
                                                                whileTap={{ scale: 0.95 }}
                                                                className="flex items-center justify-center space-x-2 p-3 bg-gray-100 dark:bg-gray-700/50 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600/50 transition-colors"
                                                            >
                                                                <ExternalLink className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                                                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Website</span>
                                                            </motion.a>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Footer - Clean & Modern */}
                    <motion.footer
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true }}
                        variants={fadeInUp}
                        className="bg-gray-900 dark:bg-black text-white py-12"
                    >
                        <div className="max-w-7xl mx-auto px-6">
                            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                                {/* Left Side - Logo & Copyright */}
                                <div className="flex items-center space-x-4">
                                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                                        <Code2 className="h-6 w-6 text-white" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-white">
                                            {about?.name || 'Imteaj Hossain'}
                                        </p>
                                        <p className="text-sm text-gray-400">
                                            &copy; 2025 All rights reserved.
                                        </p>
                                    </div>
                                </div>

                                {/* Right Side - Social Links */}
                                <div className="flex items-center space-x-3">
                                    {about?.socialLinks?.github && (
                                        <motion.a 
                                            href={about.socialLinks.github} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            whileHover={{ scale: 1.1, rotate: 5 }}
                                            whileTap={{ scale: 0.9 }}
                                            className="p-3 bg-gray-800 hover:bg-gray-700 rounded-xl transition-colors duration-200"
                                        >
                                            <Github className="h-5 w-5" />
                                        </motion.a>
                                    )}
                                    {about?.socialLinks?.linkedin && (
                                        <motion.a 
                                            href={about.socialLinks.linkedin} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            whileHover={{ scale: 1.1, rotate: 5 }}
                                            whileTap={{ scale: 0.9 }}
                                            className="p-3 bg-gray-800 hover:bg-gray-700 rounded-xl transition-colors duration-200"
                                        >
                                            <Linkedin className="h-5 w-5 text-blue-400" />
                                        </motion.a>
                                    )}
                                    {about?.socialLinks?.twitter && (
                                        <motion.a 
                                            href={about.socialLinks.twitter} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            whileHover={{ scale: 1.1, rotate: 5 }}
                                            whileTap={{ scale: 0.9 }}
                                            className="p-3 bg-gray-800 hover:bg-gray-700 rounded-xl transition-colors duration-200"
                                        >
                                            <Twitter className="h-5 w-5 text-blue-400" />
                                        </motion.a>
                                    )}
                                    {about?.socialLinks?.website && (
                                        <motion.a 
                                            href={about.socialLinks.website} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            whileHover={{ scale: 1.1, rotate: 5 }}
                                            whileTap={{ scale: 0.9 }}
                                            className="p-3 bg-gray-800 hover:bg-gray-700 rounded-xl transition-colors duration-200"
                                        >
                                            <ExternalLink className="h-5 w-5" />
                                        </motion.a>
                                    )}
                                </div>
                            </div>

                            {/* Bottom Text */}
                            <div className="border-t border-gray-800 mt-8 pt-6 text-center">
                                <p className="text-gray-400 text-sm">
                                    Built with ❤️ using React, Tailwind CSS, and Framer Motion
                                </p>
                            </div>
                        </div>
                    </motion.footer>

                    {/* Enhanced Scroll to Top Button */}
                    <AnimatePresence>
                        {isScrolled && (
                            <FloatingActionButton
                                onClick={scrollToTop}
                                color="blue"
                                className="shadow-2xl hover:shadow-blue-500/25 backdrop-blur-sm"
                            >
                                <motion.div
                                    animate={{ y: [-2, 2, -2] }}
                                    transition={{ repeat: Infinity, duration: 2 }}
                                >
                                    <ChevronUp className="h-6 w-6" />
                                </motion.div>
                            </FloatingActionButton>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        )
    }


    'use client'

    import React, { useEffect, useState } from 'react'
    import { motion, AnimatePresence } from 'framer-motion'
    import { Briefcase, Cloud, Code2, Database, ExternalLink, FolderOpen, Github, Linkedin, Mail, MapPin, Moon, Palette, Search, Server, Sun, Twitter, Menu, X, Award, Calendar, CheckCircle, BookOpen, ChevronUp } from 'lucide-react'
    import { animateScroll as scroll, Link as ScrollLink } from 'react-scroll'
    import { Link as RouterLink } from 'react-router-dom'
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

                                {/* Desktop Navigation */}
                                <div className="hidden md:flex items-center space-x-1">
                                    {[
                                        { to: "about", label: "About" },
                                        { to: "projects", label: "Work" },
                                        { to: "contact", label: "Contact" }
                                    ].map((item, index) => (
                                        <ScrollLink
                                            key={item.to}
                                            to={item.to}
                                            smooth={true}
                                            duration={500}
                                            className="relative px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white cursor-pointer transition-colors duration-200 group"
                                        >
                                            {item.label}
                                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-300 group-hover:w-full"></span>
                                        </ScrollLink>
                                    ))}
                                    
                                    {/* Blog Link */}
                                    <RouterLink 
                                        to="/blog"
                                        className="relative px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white cursor-pointer transition-colors duration-200 group flex items-center space-x-2"
                                    >
                                        <BookOpen className="h-4 w-4" />
                                        <span>Blog</span>
                                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-300 group-hover:w-full"></span>
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

                    {/* Hero Section - Clean & Modern */}
                    <motion.div
                        initial="initial"
                        animate="animate"
                        variants={fadeInUp}
                        className="relative min-h-screen flex items-center"
                        id="about"
                    >
                        {/* Subtle Background Elements */}
                        <div className="absolute inset-0 overflow-hidden">
                            <div className="absolute top-1/4 left-10 w-72 h-72 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl"></div>
                            <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-full blur-3xl"></div>
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

                                            {/* Name - Simplified */}
                                            <motion.h1 
                                                initial={{ opacity: 0, y: 30 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.3 }}
                                                className="text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight"
                                            >
                                                Hi, I'm{' '}
                                                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 dark:from-blue-400 dark:via-purple-400 dark:to-blue-600 text-transparent bg-clip-text">
                                                    {about?.name?.split(' ')[0] || 'Imteaj'}
                                                </span>
                                            </motion.h1>

                                            {/* Title - Clean */}
                                            <motion.h2 
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.4 }}
                                                className="text-2xl lg:text-3xl text-gray-600 dark:text-gray-300 font-light"
                                            >
                                                {about?.title || 'Full Stack Developer'}
                                            </motion.h2>

                                            {/* Bio - Improved Typography */}
                                            <motion.p 
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.5 }}
                                                className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed max-w-lg"
                                            >
                                                {about?.bio || 'I create beautiful, functional web applications with clean code and exceptional user experiences.'}
                                            </motion.p>
                                        </>
                                    )}

                                    {/* CTA Buttons - Redesigned */}
                                    <motion.div 
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.6 }}
                                        className="flex flex-col sm:flex-row gap-4"
                                    >
                                        <ScrollLink
                                            to="contact"
                                            smooth={true}
                                            duration={500}
                                            className="group inline-flex items-center justify-center px-8 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-medium rounded-xl hover:bg-gray-800 dark:hover:bg-gray-100 transition-all duration-300 cursor-pointer transform hover:scale-105 hover:shadow-lg"
                                        >
                                            Get In Touch
                                            <motion.div 
                                                className="ml-2"
                                                animate={{ x: [0, 4, 0] }}
                                                transition={{ repeat: Infinity, duration: 1.5 }}
                                            >
                                                →
                                            </motion.div>
                                        </ScrollLink>
                                        
                                        <ScrollLink
                                            to="projects"
                                            smooth={true}
                                            duration={500}
                                            className="inline-flex items-center justify-center px-8 py-4 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-xl hover:border-gray-400 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all duration-300 cursor-pointer"
                                        >
                                            <FolderOpen className="h-5 w-5 mr-2" />
                                            View My Work
                                        </ScrollLink>
                                    </motion.div>
                                </div>

                                {/* Image Side - Minimalist */}
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.4, duration: 0.8 }}
                                    className="relative flex justify-center lg:justify-end"
                                >
                                    <div className="relative">
                                        {/* Subtle Background Circle */}
                                        <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-full transform scale-110 opacity-50"></div>
                                        
                                        {/* Profile Image */}
                                        <div className="relative w-80 h-80 lg:w-96 lg:h-96">
                                            {aboutLoading ? (
                                                <div className="w-full h-full bg-gray-300 dark:bg-gray-700 rounded-full animate-pulse"></div>
                                            ) : (
                                                <img
                                                    src={about?.profileImage ? portfolioService.getFileView(about.profileImage) : "/React_portfolio/images/imteaj.png"}
                                                    alt={about?.name || "Profile"}
                                                    className="w-full h-full object-cover rounded-full shadow-2xl border-4 border-white dark:border-gray-800"
                                                    onError={(e) => {
                                                        e.target.src = "/React_portfolio/images/imteaj.png";
                                                    }}
                                                />
                                            )}
                                        </div>

                                        {/* Floating Elements */}
                                        <motion.div 
                                            animate={{ y: [-10, 10, -10] }}
                                            transition={{ repeat: Infinity, duration: 4 }}
                                            className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl"
                                        >
                                            <Code2 className="w-8 h-8 text-white" />
                                        </motion.div>
                                        
                                        <motion.div 
                                            animate={{ y: [10, -10, 10] }}
                                            transition={{ repeat: Infinity, duration: 3 }}
                                            className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-br from-green-500 to-teal-600 rounded-xl flex items-center justify-center shadow-xl"
                                        >
                                            <CheckCircle className="w-6 h-6 text-white" />
                                        </motion.div>
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Skills Section - Modern Design */}
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.2 }}
                        variants={fadeInUp}
                        className="py-24 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-900"
                    >
                        <div className="max-w-7xl mx-auto px-6">
                            {/* Section Header */}
                            <div className="text-center mb-16">
                                <motion.h2 
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    className="text-4xl font-bold text-gray-900 dark:text-white mb-4"
                                >
                                    Skills & Technologies
                                </motion.h2>
                                <motion.p 
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.1 }}
                                    className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
                                >
                                    Tools and technologies I use to bring ideas to life
                                </motion.p>
                            </div>

                            {skillsLoading ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {[...Array(6)].map((_, index) => (
                                        <div key={index} className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm animate-pulse">
                                            <div className="flex items-center mb-6">
                                                <div className="h-10 w-10 bg-gray-300 dark:bg-gray-700 rounded-xl mr-4"></div>
                                                <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-32"></div>
                                            </div>
                                            <div className="grid grid-cols-4 gap-3">
                                                {[...Array(8)].map((_, i) => (
                                                    <div key={i} className="h-12 bg-gray-300 dark:bg-gray-700 rounded-xl"></div>
                                                ))}
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
                                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
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
                                        <motion.div 
                                            key={index} 
                                            variants={itemFadeIn}
                                            whileHover={{ y: -8 }}
                                            className="group bg-white dark:bg-gray-800/50 p-8 rounded-2xl border border-gray-200/50 dark:border-gray-700/50 hover:shadow-xl hover:shadow-gray-200/50 dark:hover:shadow-gray-900/50 transition-all duration-500"
                                        >
                                            {/* Category Header */}
                                            <div className="flex items-center mb-6">
                                                <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 group-hover:from-blue-500/20 group-hover:to-purple-500/20 transition-colors duration-300">
                                                    {categoryGroup.category === 'frontend' && <Code2 className="h-6 w-6 text-blue-600 dark:text-blue-400" />}
                                                    {categoryGroup.category === 'backend' && <Server className="h-6 w-6 text-green-600 dark:text-green-400" />}
                                                    {categoryGroup.category === 'database' && <Database className="h-6 w-6 text-orange-600 dark:text-orange-400" />}
                                                    {categoryGroup.category === 'devops' && <Cloud className="h-6 w-6 text-blue-600 dark:text-blue-400" />}
                                                    {categoryGroup.category === 'design' && <Palette className="h-6 w-6 text-purple-600 dark:text-purple-400" />}
                                                    {categoryGroup.category === 'version-control' && <Github className="h-6 w-6 text-gray-600 dark:text-gray-400" />}
                                                </div>
                                                <div className="ml-4">
                                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white capitalize">
                                                        {categoryGroup.category.replace('-', ' ')}
                                                    </h3>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                                        {categoryGroup.skills.length} skills
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Skills Grid */}
                                            <div className="grid grid-cols-4 gap-3">
                                                {categoryGroup.skills.map((skill) => (
                                                    <motion.div 
                                                        key={skill.$id} 
                                                        whileHover={{ scale: 1.1, rotate: 5 }}
                                                        className="group/skill flex items-center justify-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-white dark:hover:bg-gray-600/50 transition-all duration-300 cursor-pointer"
                                                        title={`${skill.name} - ${skill.proficiency}% proficiency`}
                                                    >
                                                        {skill.icon ? (
                                                            <div
                                                                className="h-8 w-8 transition-transform duration-300 group-hover/skill:scale-110"
                                                                style={{ color: skill.color }}
                                                                dangerouslySetInnerHTML={{ __html: skill.icon }}
                                                            />
                                                        ) : (
                                                            <div className="h-8 w-8 bg-gradient-to-br from-gray-400 to-gray-500 rounded-lg flex items-center justify-center">
                                                                <span className="text-xs font-bold text-white">
                                                                    {skill.name.charAt(0)}
                                                                </span>
                                                            </div>
                                                        )}
                                                        
                                                        {/* Skill Name Tooltip */}
                                                        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs px-2 py-1 rounded opacity-0 group-hover/skill:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap z-10">
                                                            {skill.name}
                                                        </div>
                                                    </motion.div>
                                                ))}
                                            </div>
                                        </motion.div>
                                    ))}
                                </motion.div>
                            )}
                        </div>
                    </motion.div>

                    {/* Projects Section - Modern Design */}
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.2 }}
                        variants={fadeInUp}
                        id="projects"
                        className="py-24 bg-white dark:bg-gray-900"
                    >
                        <div className="max-w-7xl mx-auto px-6">
                            {/* Section Header */}
                            <div className="text-center mb-16">
                                <motion.h2 
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    className="text-4xl font-bold text-gray-900 dark:text-white mb-4"
                                >
                                    Featured Work
                                </motion.h2>
                                <motion.p 
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.1 }}
                                    className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
                                >
                                    A selection of projects that showcase my skills and passion for development
                                </motion.p>
                            </div>

                            {projectsLoading ? (
                                <div className="grid lg:grid-cols-2 gap-8">
                                    {[...Array(4)].map((_, index) => (
                                        <div key={index} className="bg-gray-50 dark:bg-gray-800/50 rounded-3xl p-1 animate-pulse">
                                            <div className="w-full h-64 bg-gray-300 dark:bg-gray-700 rounded-3xl mb-6"></div>
                                            <div className="p-6">
                                                <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded mb-3"></div>
                                                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded mb-4"></div>
                                                <div className="flex space-x-2 mb-4">
                                                    <div className="h-6 w-16 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
                                                    <div className="h-6 w-20 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
                                                </div>
                                                <div className="flex space-x-4">
                                                    <div className="h-10 w-24 bg-gray-300 dark:bg-gray-700 rounded-xl"></div>
                                                    <div className="h-10 w-20 bg-gray-300 dark:bg-gray-700 rounded-xl"></div>
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
                                    viewport={{ once: true, amount: 0.1 }}
                                    className="grid lg:grid-cols-2 gap-8"
                                >
                                    {projects.length > 0 ? projects.map((project, index) => (
                                        <motion.div 
                                            key={project.$id} 
                                            variants={itemFadeIn}
                                            whileHover={{ y: -8 }}
                                            className="group bg-gradient-to-b from-gray-50 to-white dark:from-gray-800/50 dark:to-gray-800/30 rounded-3xl p-1 hover:shadow-2xl hover:shadow-gray-200/50 dark:hover:shadow-gray-900/50 transition-all duration-500 border border-gray-200/50 dark:border-gray-700/50"
                                        >
                                            {/* Project Image */}
                                            <div className="relative overflow-hidden rounded-3xl mb-6">
                                                {project.image ? (
                                                    <img
                                                        src={portfolioService.getFileView(project.image)}
                                                        alt={project.title}
                                                        className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-700"
                                                        onError={(e) => {
                                                            e.target.src = "https://via.placeholder.com/600x320/f3f4f6/9ca3af?text=Project";
                                                        }}
                                                    />
                                                ) : (
                                                    <div className="w-full h-64 bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100 dark:from-blue-900/20 dark:via-purple-900/20 dark:to-pink-900/20 flex items-center justify-center">
                                                        <FolderOpen className="h-20 w-20 text-gray-400 dark:text-gray-500" />
                                                    </div>
                                                )}
                                                
                                                {/* Overlay with project index */}
                                                <div className="absolute top-4 left-4 w-12 h-12 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                                                    <span className="text-lg font-bold text-gray-900 dark:text-white">
                                                        {String(index + 1).padStart(2, '0')}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Project Content */}
                                            <div className="px-6 pb-6">
                                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                                                    {project.title}
                                                </h3>
                                                
                                                <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
                                                    {project.description}
                                                </p>

                                                {/* Technologies */}
                                                {project.technologies && project.technologies.length > 0 && (
                                                    <div className="flex flex-wrap gap-2 mb-6">
                                                        {project.technologies.slice(0, 4).map((tech, techIndex) => (
                                                            <span 
                                                                key={techIndex} 
                                                                className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-full border border-gray-200 dark:border-gray-600"
                                                            >
                                                                {tech}
                                                            </span>
                                                        ))}
                                                        {project.technologies.length > 4 && (
                                                            <span className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400 text-sm rounded-full border border-gray-200 dark:border-gray-600">
                                                                +{project.technologies.length - 4} more
                                                            </span>
                                                        )}
                                                    </div>
                                                )}

                                                {/* Project Links */}
                                                <div className="flex space-x-3">
                                                    {project.demoUrl && (
                                                        <motion.a 
                                                            href={project.demoUrl} 
                                                            target="_blank" 
                                                            rel="noopener noreferrer"
                                                            whileHover={{ scale: 1.05 }}
                                                            whileTap={{ scale: 0.95 }}
                                                            className="flex items-center px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-medium rounded-xl hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors duration-300"
                                                        >
                                                            <ExternalLink className="h-4 w-4 mr-2" />
                                                            Live Demo
                                                        </motion.a>
                                                    )}
                                                    {project.githubUrl && (
                                                        <motion.a 
                                                            href={project.githubUrl} 
                                                            target="_blank" 
                                                            rel="noopener noreferrer"
                                                            whileHover={{ scale: 1.05 }}
                                                            whileTap={{ scale: 0.95 }}
                                                            className="flex items-center px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-xl hover:border-gray-400 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all duration-300"
                                                        >
                                                            <Github className="h-4 w-4 mr-2" />
                                                            Code
                                                        </motion.a>
                                                    )}
                                                </div>
                                            </div>
                                        </motion.div>
                                    )) : (
                                        <div className="col-span-2 text-center py-20">
                                            <div className="w-24 h-24 mx-auto bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center mb-6">
                                                <FolderOpen className="h-12 w-12 text-gray-400" />
                                            </div>
                                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No Projects Yet</h3>
                                            <p className="text-gray-600 dark:text-gray-400">
                                                Projects will appear here once they're added.
                                            </p>
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

                    {/* Scroll to Top Button - Enhanced */}
                    <AnimatePresence>
                        {isScrolled && (
                            <motion.button
                                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.8, y: 20 }}
                                whileHover={{ scale: 1.1, y: -2 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={scrollToTop}
                                className="fixed bottom-8 right-8 p-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 backdrop-blur-sm"
                                aria-label="Scroll to top"
                            >
                                <motion.div
                                    animate={{ y: [-2, 2, -2] }}
                                    transition={{ repeat: Infinity, duration: 2 }}
                                >
                                    <ChevronUp className="h-6 w-6" />
                                </motion.div>
                            </motion.button>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        )
    }


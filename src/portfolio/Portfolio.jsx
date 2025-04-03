'use client'

import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Briefcase, Cloud, Code2, Database, ExternalLink, FolderOpen, Github, GraduationCap, Linkedin, Mail, MapPin, Moon, Palette, Search, Server, Sun, Twitter, Menu, X } from 'lucide-react'
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

    const toggleTheme = () => {
        setIsDark(!isDark)
    }

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen)
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
                        <span className="ml-2 font-semibold text-gray-800 dark:text-white">Imteaj.dev</span>
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
                        <a href="https://github.com"
                            className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white">
                            <Github className="h-5 w-5" />
                        </a>
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
                                <a href="https://github.com"
                                    className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white">
                                    <Github className="h-5 w-5" />
                                    <span>GitHub</span>
                                </a>
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
                                <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 dark:from-blue-400 dark:to-purple-400 text-transparent bg-clip-text mb-4">
                                IMTEAJ HOSSAIN
                                </h1>
                                <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
                                    Full Stack Web Developer
                                </h2>
                                <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                                    Building robust and scalable web applications with modern technologies and best practices.
                                </p>
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
                                    <img src="../public/images/imteaj.png" alt="Profile"
                                        className="w-full max-w-md rounded-full" />
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
                        <motion.div
                            variants={staggerContainer}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.2 }}
                            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
                        >
                            <motion.div variants={itemFadeIn} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                                <div className="flex items-center mb-4">
                                    <Code2 className="h-8 w-8 text-blue-500 mr-2" />
                                    <h3 className="text-xl font-semibold dark:text-white">Frontend</h3>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    <FaHtml5 className="h-8 w-8 text-orange-500" title="HTML5" />
                                    <FaCss3Alt className="h-8 w-8 text-blue-500" title="CSS3" />
                                    <FaJs className="h-8 w-8 text-yellow-500" title="JavaScript" />
                                    <FaReact className="h-8 w-8 text-blue-400" title="React" />
                                    <SiTailwindcss className="h-8 w-8 text-teal-500" title="Tailwind CSS" />
                                </div>
                            </motion.div>
                            <motion.div variants={itemFadeIn} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                                <div className="flex items-center mb-4">
                                    <Server className="h-8 w-8 text-green-500 mr-2" />
                                    <h3 className="text-xl font-semibold dark:text-white">Backend</h3>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    <FaPhp className="h-8 w-8 text-purple-500" title="PHP" />
                                    <FaLaravel className="h-8 w-8 text-red-500" title="Laravel" />
                                    <FaNodeJs className="h-8 w-8 text-green-500" title="Node.js" />
                                </div>
                            </motion.div>
                            <motion.div variants={itemFadeIn} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                                <div className="flex items-center mb-4">
                                    <Palette className="h-8 w-8 text-purple-500 mr-2" />
                                    <h3 className="text-xl font-semibold dark:text-white">Design</h3>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    <SiFigma className="h-8 w-8 text-purple-400" title="Figma" />
                                    <SiTailwindcss className="h-8 w-8 text-teal-500" title="Tailwind CSS" />
                                </div>
                            </motion.div>
                            <motion.div variants={itemFadeIn} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                                <div className="flex items-center mb-4">
                                    <Database className="h-8 w-8 text-orange-500 mr-2" />
                                    <h3 className="text-xl font-semibold dark:text-white">Database</h3>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    <SiMysql className="h-8 w-8 text-blue-500" title="MySQL" />
                                    <SiPostgresql className="h-8 w-8 text-blue-400" title="PostgreSQL" />
                                    <SiMongodb className="h-8 w-8 text-green-500" title="MongoDB" />
                                </div>
                            </motion.div>
                            <motion.div variants={itemFadeIn} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                                <div className="flex items-center mb-4">
                                    <Cloud className="h-8 w-8 text-blue-500 mr-2" />
                                    <h3 className="text-xl font-semibold dark:text-white">DevOps</h3>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    <FaDocker className="h-8 w-8 text-blue-500" title="Docker" />
                                    <FaLinux className="h-8 w-8 text-yellow-500" title="Linux" />
                                </div>
                            </motion.div>
                            <motion.div variants={itemFadeIn} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                                <div className="flex items-center mb-4">
                                    <Github className="h-8 w-8 text-gray-500 mr-2" />
                                    <h3 className="text-xl font-semibold dark:text-white">Version Control</h3>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    <FaGitAlt className="h-8 w-8 text-orange-500" title="Git" />
                                    <Github className="h-8 w-8 text-gray-700 dark:text-gray-300" title="GitHub" />
                                </div>
                            </motion.div>
                        </motion.div>
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
                        <motion.div
                            variants={staggerContainer}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.2 }}
                            className="grid md:grid-cols-2 gap-8"
                        >
                            <motion.div variants={itemFadeIn} className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
                                <img src="../public/images/ecommerce-store-trinidad.jpeg?height=192&width=384" alt="Project 1"
                                    className="w-full h-48 object-cover" />
                                <div className="p-6">
                                    <h3 className="text-xl font-semibold mb-2 dark:text-white">E-commerce Platform</h3>
                                    <p className="text-gray-600 dark:text-gray-300 mb-4">A full-stack e-commerce solution built with Laravel and Vue.js</p>
                                    <div className="flex space-x-4">
                                        <a href="#"
                                            className="text-blue-600 dark:text-blue-400 hover:underline flex items-center">
                                            <ExternalLink className="h-4 w-4 mr-1" /> Demo
                                        </a>
                                        <a href="#"
                                            className="text-blue-600 dark:text-blue-400 hover:underline flex items-center">
                                            <Github className="h-4 w-4 mr-1" /> Code
                                        </a>
                                    </div>
                                </div>
                            </motion.div>
                            <motion.div variants={itemFadeIn} className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
                                <img src="../public/images/project/textcrm.png" alt="Project 2"
                                    className="w-full h-48 object-cover" />
                                <div className="p-6">
                                    <h3 className="text-xl font-semibold mb-2 dark:text-white">Task Management App</h3>
                                    <p className="text-gray-600 dark:text-gray-300 mb-4">A collaborative task management tool with real-time updates using Laravel and React</p>
                                    <div className="flex space-x-4">
                                        <a href="#"
                                            className="text-blue-600 dark:text-blue-400 hover:underline flex items-center">
                                            <ExternalLink className="h-4 w-4 mr-1" /> Demo
                                        </a>
                                        <a href="#"
                                            className="text-blue-600 dark:text-blue-400 hover:underline flex items-center">
                                            <Github className="h-4 w-4 mr-1" /> Code
                                        </a>
                                    </div>
                                </div>
                            </motion.div>
                            <motion.div variants={itemFadeIn} className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
                                <img src="../public/images/project/Screenshot 2024-11-29 at 11.10.57 AM.png" alt="Project 3"
                                    className="w-full h-48 object-cover" />
                                <div className="p-6">
                                    <h3 className="text-xl font-semibold mb-2 dark:text-white">Blog Platform</h3>
                                    <p className="text-gray-600 dark:text-gray-300 mb-4">A modern blogging platform with markdown support and SEO optimization</p>
                                    <div className="flex space-x-4">
                                        <a href="#"
                                            className="text-blue-600 dark:text-blue-400 hover:underline flex items-center">
                                            <ExternalLink className="h-4 w-4 mr-1" /> Demo
                                        </a>
                                        <a href="#"
                                            className="text-blue-600 dark:text-blue-400 hover:underline flex items-center">
                                            <Github className="h-4 w-4 mr-1" /> Code
                                        </a>
                                    </div>
                                </div>
                            </motion.div>
                            <motion.div variants={itemFadeIn} className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
                                <img src="../public/images/project/Screenshot 2024-11-29 at 11.13.02 AM.png" alt="Project 4"
                                    className="w-full h-48 object-cover" />
                                <div className="p-6">
                                    <h3 className="text-xl font-semibold mb-2 dark:text-white">Weather Dashboard</h3>
                                    <p className="text-gray-600 dark:text-gray-300 mb-4">A responsive weather dashboard with real-time data and interactive maps</p>
                                    <div className="flex space-x-4">
                                        <a href="#"
                                            className="text-blue-600 dark:text-blue-400 hover:underline flex items-center">
                                            <ExternalLink className="h-4 w-4 mr-1" /> Demo
                                        </a>
                                        <a href="#"
                                            className="text-blue-600 dark:text-blue-400 hover:underline flex items-center">
                                            <Github className="h-4 w-4 mr-1" /> Code
                                        </a>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>
                </motion.div>

                {/* Education Section */}
                <motion.div
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true }}
                    variants={fadeInUp}
                    className="bg-gray-50 dark:bg-gray-800/50 py-20"
                >
                    <div className="max-w-7xl mx-auto px-6">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Education</h2>
                        <div className="space-y-6">
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md flex items-center">
                                <GraduationCap className="h-12 w-12 text-blue-500 mr-6 flex-shrink-0" />
                                <div>
                                    <h3 className="text-xl font-semibold dark:text-white">Bachelor of Computer Science</h3>
                                    <p className="text-gray-600 dark:text-gray-300">Your University, 2016-2020</p>
                                    <p className="text-gray-500 dark:text-gray-400 mt-2">Focus on Web Technologies and Software Engineering</p>
                                </div>
                            </div>
                        </div>
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
                        <motion.div
                            variants={staggerContainer}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.2 }}
                            className="space-y-6"
                        >
                            <motion.div variants={itemFadeIn} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                                <div className="flex items-center mb-4">
                                    <Briefcase className="h-8 w-8 text-blue-500 mr-4" />
                                    <div>
                                        <h3 className="text-xl font-semibold dark:text-white">Full Stack Developer</h3>
                                        <p className="text-gray-600 dark:text-gray-300">Tech Company, 2020-Present</p>
                                    </div>
                                </div>
                                <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
                                    <li>Developed and maintained multiple web applications using Laravel and React</li>
                                    <li>Implemented RESTful APIs and integrated third-party services</li>
                                    <li>Optimized database queries and improved application performance</li>
                                    <li>Collaborated with cross-functional teams to deliver high-quality software solutions</li>
                                </ul>
                            </motion.div>
                            <motion.div variants={itemFadeIn} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                                <div className="flex items-center mb-4">
                                    <Briefcase className="h-8 w-8 text-green-500 mr-4" />
                                    <div>
                                        <h3 className="text-xl font-semibold dark:text-white">Junior Web Developer</h3>
                                        <p className="text-gray-600 dark:text-gray-300">Startup Inc., 2018-2020</p>
                                    </div>
                                </div>
                                <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
                                    <li>Assisted in the development of responsive web applications using PHP and JavaScript</li>
                                    <li>Worked on both frontend and backend tasks, gaining full-stack experience</li>
                                    <li>Participated in code reviews and implemented best practices for web development</li>
                                </ul>
                            </motion.div>
                        </motion.div>
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
                                <form className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
                                        <input type="text"
                                            className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                                        <input type="email"
                                            className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Message</label>
                                        <textarea rows={4}
                                            className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"></textarea>
                                    </div>
                                    <button type="submit"
                                        className="w-full px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors">
                                        Send Message
                                    </button>
                                </form>
                            </div>
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                                <MapPin className="h-8 w-8 text-green-500 mb-4" />
                                <h3 className="text-xl font-semibold mb-4 dark:text-white">Location</h3>
                                <div className="space-y-4">
                                    <div>
                                        <h4 className="font-medium text-gray-900 dark:text-white mb-1">Your City, Country</h4>
                                        <p className="text-gray-600 dark:text-gray-300">Available for remote work and relocation</p>
                                    </div>
                                    <div className="pt-4">
                                        <h4 className="font-medium text-gray-900 dark:text-white mb-2">Connect</h4>
                                        <div className="flex space-x-4">
                                            <a href="#"
                                                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                                                <Github className="h-6 w-6" />
                                            </a>
                                            <a href="#"
                                                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                                                <Linkedin className="h-6 w-6" />
                                            </a>
                                            <a href="#"
                                                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                                                <Twitter className="h-6 w-6" />
                                            </a>
                                        </div>
                                    </div>
                                </div>
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
                                <p className="text-gray-600 dark:text-gray-300">&copy; 2025 Imteaj hossain. All rights reserved.</p>
                            </div>
                            <div className="flex space-x-4">
                                <a href="#"
                                    className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                                    <Github className="h-6 w-6" />
                                </a>
                                <a href="#"
                                    className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                                    <Linkedin className="h-6 w-6" />
                                </a>
                                <a href="#"
                                    className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                                    <Twitter className="h-6 w-6" />
                                </a>
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


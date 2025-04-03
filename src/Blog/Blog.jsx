'use client'

import React, {useState} from 'react'
import {ArrowRight, Calendar, ChevronDown, Code2, Github, Moon, Search, Sun, Tag, User} from 'lucide-react'

const blogPosts = [
    {
        id: 1,
        title: "The Importance of White Space in UI Design",
        excerpt: "Discover how proper use of white space can dramatically improve your designs...",
        author: "Jane Doe",
        date: "2023-05-15",
        category: "UI Design",
        image: "/placeholder.svg?height=200&width=400"
    },
    {
        id: 2,
        title: "Color Theory for Digital Designers",
        excerpt: "Learn the fundamentals of color theory and how to apply them in your digital designs...",
        author: "John Smith",
        date: "2023-05-10",
        category: "Color Theory",
        image: "/placeholder.svg?height=200&width=400"
    },
    {
        id: 3,
        title: "Responsive Design Best Practices",
        excerpt: "Explore the latest best practices for creating responsive designs that work across all devices...",
        author: "Emily Johnson",
        date: "2023-05-05",
        category: "Responsive Design",
        image: "/placeholder.svg?height=200&width=400"
    },
    {
        id: 4,
        title: "Typography in Web Design",
        excerpt: "Understand the importance of typography and how to choose the right fonts for your web projects...",
        author: "Michael Brown",
        date: "2023-04-30",
        category: "Typography",
        image: "/placeholder.svg?height=200&width=400"
    },
    {
        id: 5,
        title: "Creating Effective Call-to-Action Buttons",
        excerpt: "Learn the secrets to designing CTA buttons that drive user engagement and conversions...",
        author: "Sarah Wilson",
        date: "2023-04-25",
        category: "UI Design",
        image: "/placeholder.svg?height=200&width=400"
    },
]

const categories = ["All", "UI Design", "Color Theory", "Responsive Design", "Typography"]

export default function DesignBlog() {
    const [isDark, setIsDark] = useState(false)
    const [selectedCategory, setSelectedCategory] = useState("All")
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    const toggleTheme = () => {
        setIsDark(!isDark)
    }

    const filteredPosts = selectedCategory === "All"
        ? blogPosts
        : blogPosts.filter(post => post.category === selectedCategory)

    return (
        <div
            className={`${isDark ? 'dark' : ''} min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300`}>
            {/* Navigation */}
            <nav
                className="px-6 py-4 flex items-center justify-between bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50">
                <div className="flex items-center space-x-8">
                    <div className="flex items-center">
                        <Code2 className="h-8 w-8 text-blue-600 dark:text-blue-400"/>
                        <span className="ml-2 font-semibold text-gray-800 dark:text-white">DesignInsights</span>
                    </div>
                    <div className="relative hidden sm:block">
                        <input
                            type="search"
                            placeholder="Search articles..."
                            className="pl-8 pr-4 py-1 w-64 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"/>
                    </div>
                </div>
                <div className="flex items-center space-x-6">
                    <a href="#"
                       className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white">Home</a>
                    <a href="#"
                       className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white">Categories</a>
                    <a href="#"
                       className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white">About</a>
                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                        aria-label="Toggle theme"
                    >
                        {isDark ? (
                            <Sun className="h-4 w-4 text-gray-600 dark:text-gray-300"/>
                        ) : (
                            <Moon className="h-4 w-4 text-gray-600 dark:text-gray-300"/>
                        )}
                    </button>
                    <a href="https://github.com"
                       className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white">
                        <Github className="h-5 w-5"/>
                    </a>
                </div>
            </nav>

            {/* Hero Section */}
            <div
                className="relative bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-800 dark:to-purple-900">
                <div className="max-w-7xl mx-auto px-6 py-24 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                        Explore the World of Design
                    </h1>
                    <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                        Dive into our collection of insightful articles, tutorials, and resources to elevate your design
                        skills.
                    </p>
                    <button
                        className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-full hover:bg-blue-50 transition-colors">
                        Start Reading
                    </button>
                </div>
            </div>

            {/* Featured Post */}
            <div className="max-w-7xl mx-auto px-6 py-16">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Featured Post</h2>
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
                    <div className="md:flex">
                        <div className="md:flex-shrink-0">
                            <img className="h-48 w-full object-cover md:w-48"
                                 src="/placeholder.svg?height=400&width=400" alt="Featured post"/>
                        </div>
                        <div className="p-8">
                            <div className="uppercase tracking-wide text-sm text-blue-500 font-semibold">UI Design</div>
                            <a href="#"
                               className="block mt-1 text-2xl leading-tight font-bold text-gray-900 dark:text-white hover:underline">The
                                Importance of White Space in UI Design</a>
                            <p className="mt-2 text-gray-600 dark:text-gray-300">Discover how proper use of white space
                                can dramatically improve your designs and create a more enjoyable user experience.</p>
                            <div className="mt-4">
                                <a href="#" className="inline-flex items-center text-blue-600 hover:underline">
                                    Read more <ArrowRight className="ml-2 h-4 w-4"/>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Blog Posts */}
            <div className="max-w-7xl mx-auto px-6 py-16">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Latest Articles</h2>
                    <div className="relative">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            {selectedCategory}
                            <ChevronDown className="ml-2 h-4 w-4"/>
                        </button>
                        {isMenuOpen && (
                            <div
                                className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5">
                                <div className="py-1" role="menu" aria-orientation="vertical"
                                     aria-labelledby="options-menu">
                                    {categories.map((category) => (
                                        <button
                                            key={category}
                                            onClick={() => {
                                                setSelectedCategory(category)
                                                setIsMenuOpen(false)
                                            }}
                                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                            role="menuitem"
                                        >
                                            {category}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredPosts.map((post) => (
                        <div key={post.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
                            <img className="h-48 w-full object-cover" src={post.image} alt={post.title}/>
                            <div className="p-6">
                                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
                                    <Calendar className="h-4 w-4 mr-2"/>
                                    {post.date}
                                    <User className="h-4 w-4 ml-4 mr-2"/>
                                    {post.author}
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{post.title}</h3>
                                <p className="text-gray-600 dark:text-gray-300 mb-4">{post.excerpt}</p>
                                <div className="flex items-center justify-between">
                  <span
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    <Tag className="h-4 w-4 mr-1"/>
                      {post.category}
                  </span>
                                    <a href="#" className="inline-flex items-center text-blue-600 hover:underline">
                                        Read more <ArrowRight className="ml-2 h-4 w-4"/>
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Newsletter */}
            <div className="bg-gray-100 dark:bg-gray-800">
                <div className="max-w-7xl mx-auto px-6 py-16">
                    <div className="bg-white dark:bg-gray-700 rounded-xl shadow-md p-8">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Subscribe to Our
                            Newsletter</h2>
                        <p className="text-gray-600 dark:text-gray-300 mb-6">Get the latest design insights and
                            resources delivered straight to your inbox.</p>
                        <form className="flex flex-col sm:flex-row gap-4">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="flex-grow px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                            />
                            <button
                                type="submit"
                                className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors"
                            >
                                Subscribe
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
                <div className="max-w-7xl mx-auto px-6 py-12">
                    <div className="md:flex md:items-center md:justify-between">
                        <div className="flex justify-center md:order-2 space-x-6">
                            <a href="#" className="text-gray-400 hover:text-gray-500">
                                <span className="sr-only">Facebook</span>
                                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path fillRule="evenodd"
                                          d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                                          clipRule="evenodd"/>
                                </svg>
                            </a>
                            <a href="#" className="text-gray-400 hover:text-gray-500">
                                <span className="sr-only">Instagram</span>
                                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path fillRule="evenodd"
                                          d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                                          clipRule="evenodd"/>
                                </svg>
                            </a>
                            <a href="#" className="text-gray-400 hover:text-gray-500">
                                <span className="sr-only">Twitter</span>
                                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path
                                        d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"/>
                                </svg>
                            </a>
                            <a href="#" className="text-gray-400 hover:text-gray-500">
                                <span className="sr-only">GitHub</span>
                                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path fillRule="evenodd"
                                          d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                                          clipRule="evenodd"/>
                                </svg>
                            </a>
                        </div>
                        <div className="mt-8 md:mt-0 md:order-1">
                            <p className="text-center text-base text-gray-400">&copy; 2023 DesignInsights. All rights
                                reserved.</p>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    )
}
'use client'

import React, {useState} from 'react'
import {
    ArrowLeft,
    Bookmark,
    Calendar,
    Facebook,
    Linkedin,
    MessageCircle,
    Moon,
    Sun,
    Tag,
    ThumbsUp,
    Twitter,
    User
} from 'lucide-react'
import Link from 'next/link'

const blogPost = {
    title: "The Importance of White Space in UI Design",
    excerpt: "Discover how proper use of white space can dramatically improve your designs and create a more enjoyable user experience.",
    content: `
    <p>White space, also known as negative space, is the area between design elements. It's the space within individual design elements, including the space between typography glyphs (readable characters).</p>
    
    <h2>Why is White Space Important?</h2>
    <p>White space is an essential element in design for several reasons:</p>
    <ul>
      <li>It helps to create balance and harmony in a design</li>
      <li>It makes content more legible and easier to read</li>
      <li>It guides the user's eye to important elements</li>
      <li>It creates a clean, sophisticated look</li>
    </ul>

    <h2>Types of White Space</h2>
    <p>There are two main types of white space:</p>
    <ol>
      <li><strong>Macro White Space:</strong> The space between major elements in a composition</li>
      <li><strong>Micro White Space:</strong> The space between smaller elements, including the space between lines and letters</li>
    </ol>

    <h2>How to Use White Space Effectively</h2>
    <p>Here are some tips for using white space in your designs:</p>
    <ul>
      <li>Use white space to group related elements together</li>
      <li>Increase white space around important elements to draw attention to them</li>
      <li>Use consistent white space to create a sense of balance and harmony</li>
      <li>Don't be afraid of empty space - it can be a powerful design element</li>
    </ul>

    <p>Remember, the goal of using white space is not just to create a minimalist design, but to enhance the user experience and make your design more effective.</p>
  `,
    author: "Jane Doe",
    authorAvatar: "/placeholder.svg?height=100&width=100",
    date: "2023-05-15",
    category: "UI Design",
    readTime: "5 min read",
    image: "/placeholder.svg?height=400&width=800",
    tags: ["UI Design", "White Space", "User Experience"]
}

export default function BlogView() {
    const [isDark, setIsDark] = useState(false)
    const [isBookmarked, setIsBookmarked] = useState(false)
    const [likes, setLikes] = useState(42)
    const [hasLiked, setHasLiked] = useState(false)

    const toggleTheme = () => {
        setIsDark(!isDark)
    }

    const toggleBookmark = () => {
        setIsBookmarked(!isBookmarked)
    }

    const handleLike = () => {
        if (!hasLiked) {
            setLikes(likes + 1)
            setHasLiked(true)
        } else {
            setLikes(likes - 1)
            setHasLiked(false)
        }
    }

    return (
        <div
            className={`${isDark ? 'dark' : ''} min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300`}>
            <nav className="bg-white dark:bg-gray-800 shadow-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <Link href="/blog" className="flex-shrink-0 flex items-center">
                                <ArrowLeft className="h-6 w-6 text-gray-600 dark:text-gray-300"/>
                                <span className="ml-2 text-gray-800 dark:text-white font-semibold">Back to Blog</span>
                            </Link>
                        </div>
                        <div className="flex items-center">
                            <button
                                onClick={toggleTheme}
                                className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white"
                                aria-label="Toggle theme"
                            >
                                {isDark ? <Sun className="h-5 w-5"/> : <Moon className="h-5 w-5"/>}
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <article>
                    <header className="mb-8">
                        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">{blogPost.title}</h1>
                        <div className="flex items-center text-gray-600 dark:text-gray-400 mb-4">
                            <Calendar className="h-5 w-5 mr-2"/>
                            <span>{blogPost.date}</span>
                            <User className="h-5 w-5 ml-4 mr-2"/>
                            <span>{blogPost.author}</span>
                            <Tag className="h-5 w-5 ml-4 mr-2"/>
                            <span>{blogPost.category}</span>
                            <span className="ml-4">{blogPost.readTime}</span>
                        </div>
                        <img src={blogPost.image} alt={blogPost.title} className="w-full h-64 object-cover rounded-lg"/>
                    </header>

                    <div className="prose dark:prose-invert max-w-none mb-8"
                         dangerouslySetInnerHTML={{__html: blogPost.content}}/>

                    <footer>
                        <div className="flex flex-wrap gap-2 mb-6">
                            {blogPost.tags.map((tag, index) => (
                                <span key={index}
                                      className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-3 py-1 rounded-full text-sm font-medium">
                  {tag}
                </span>
                            ))}
                        </div>

                        <div
                            className="flex items-center justify-between border-t border-b border-gray-200 dark:border-gray-700 py-4 mb-8">
                            <div className="flex items-center">
                                <img src={blogPost.authorAvatar} alt={blogPost.author}
                                     className="w-12 h-12 rounded-full mr-4"/>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{blogPost.author}</h3>
                                    <p className="text-gray-600 dark:text-gray-400">UI/UX Designer</p>
                                </div>
                            </div>
                            <div className="flex space-x-4">
                                <button
                                    className="text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400">
                                    <Facebook className="h-6 w-6"/>
                                </button>
                                <button
                                    className="text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400">
                                    <Twitter className="h-6 w-6"/>
                                </button>
                                <button
                                    className="text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400">
                                    <Linkedin className="h-6 w-6"/>
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <button
                                    onClick={handleLike}
                                    className={`flex items-center space-x-2 ${hasLiked ? 'text-red-500' : 'text-gray-600 dark:text-gray-400'}`}
                                >
                                    <ThumbsUp className="h-6 w-6"/>
                                    <span>{likes}</span>
                                </button>
                                <button className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                                    <MessageCircle className="h-6 w-6"/>
                                    <span>23 Comments</span>
                                </button>
                            </div>
                            <button
                                onClick={toggleBookmark}
                                className={`${isBookmarked ? 'text-yellow-500' : 'text-gray-600 dark:text-gray-400'}`}
                            >
                                <Bookmark className="h-6 w-6"/>
                            </button>
                        </div>
                    </footer>
                </article>

                <section className="mt-12">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Comments</h2>
                    <form className="mb-8">
            <textarea
                rows={4}
                className="w-full px-3 py-2 text-gray-700 dark:text-gray-300 border rounded-lg focus:outline-none focus:border-blue-500 dark:border-gray-600 dark:bg-gray-800"
                placeholder="Add a comment..."
            ></textarea>
                        <button
                            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                            Post Comment
                        </button>
                    </form>
                    <div className="space-y-6">
                        {/* Sample comment */}
                        <div className="flex space-x-4">
                            <img src="/placeholder.svg?height=50&width=50" alt="Commenter"
                                 className="w-10 h-10 rounded-full"/>
                            <div>
                                <h3 className="font-semibold text-gray-900 dark:text-white">John Doe</h3>
                                <p className="text-gray-600 dark:text-gray-400">Great article! I've always struggled
                                    with using white space effectively. These tips are really helpful.</p>
                                <div className="mt-2 text-sm text-gray-500 dark:text-gray-500">2 hours ago · Reply</div>
                            </div>
                        </div>
                        {/* Add more comments as needed */}
                    </div>
                </section>
            </main>

            <footer className="bg-gray-100 dark:bg-gray-800 mt-12">
                <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                    <p className="text-center text-gray-500 dark:text-gray-400">&copy; 2023 DesignInsights. All rights
                        reserved.</p>
                </div>
            </footer>
        </div>
    )
}
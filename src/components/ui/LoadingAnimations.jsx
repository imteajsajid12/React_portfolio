import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

// Loading Spinner Component
export const LoadingSpinner = ({ size = "md", color = "blue" }) => {
    const sizes = {
        sm: "w-4 h-4",
        md: "w-8 h-8", 
        lg: "w-12 h-12",
        xl: "w-16 h-16"
    };
    
    const colors = {
        blue: "border-blue-600",
        purple: "border-purple-600",
        green: "border-green-600",
        gray: "border-gray-600"
    };
    
    return (
        <motion.div
            className={`${sizes[size]} border-2 ${colors[color]} border-t-transparent rounded-full`}
            animate={{ rotate: 360 }}
            transition={{
                duration: 1,
                repeat: Infinity,
                ease: "linear"
            }}
        />
    );
};

// Skeleton Loader Component
export const SkeletonLoader = ({ className = "", lines = 3 }) => {
    return (
        <div className={`animate-pulse ${className}`}>
            {[...Array(lines)].map((_, index) => (
                <motion.div
                    key={index}
                    className="bg-gray-300 dark:bg-gray-700 rounded h-4 mb-2"
                    style={{ 
                        width: `${Math.random() * 40 + 60}%` // Random width between 60-100%
                    }}
                    initial={{ opacity: 0.3 }}
                    animate={{ opacity: [0.3, 0.7, 0.3] }}
                    transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        delay: index * 0.2
                    }}
                />
            ))}
        </div>
    );
};

// Page Loader with Animation
export const PageLoader = ({ isLoading = true, onComplete }) => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        if (isLoading) {
            const timer = setInterval(() => {
                setProgress(prev => {
                    if (prev >= 100) {
                        clearInterval(timer);
                        setTimeout(() => onComplete && onComplete(), 500);
                        return 100;
                    }
                    return prev + Math.random() * 15;
                });
            }, 200);
            
            return () => clearInterval(timer);
        }
    }, [isLoading, onComplete]);

    return (
        <AnimatePresence mode="wait">
            {isLoading && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 1.1 }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                    className="fixed inset-0 z-50 bg-white dark:bg-gray-900 flex items-center justify-center"
                >
                    <div className="text-center max-w-md mx-auto px-6">
                        {/* Logo Animation */}
                        <motion.div
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="mb-8"
                        >
                            <motion.div
                                className="w-20 h-20 mx-auto bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center"
                                animate={{ 
                                    rotate: [0, 360],
                                    scale: [1, 1.1, 1]
                                }}
                                transition={{ 
                                    rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                                    scale: { duration: 1, repeat: Infinity, ease: "easeInOut" }
                                }}
                            >
                                <span className="text-3xl font-bold text-white">I</span>
                            </motion.div>
                        </motion.div>

                        {/* Loading Text */}
                        <motion.h2
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            className="text-2xl font-bold text-gray-900 dark:text-white mb-4"
                        >
                            Loading Portfolio
                        </motion.h2>

                        {/* Progress Bar */}
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-4 overflow-hidden">
                            <motion.div
                                className="h-full bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 0.3, ease: "easeOut" }}
                            />
                        </div>

                        {/* Progress Percentage */}
                        <motion.p
                            className="text-gray-600 dark:text-gray-400"
                            animate={{ opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                        >
                            {Math.round(progress)}% Complete
                        </motion.p>

                        {/* Floating Dots Animation */}
                        <div className="flex justify-center space-x-2 mt-6">
                            {[...Array(3)].map((_, index) => (
                                <motion.div
                                    key={index}
                                    className="w-3 h-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"
                                    animate={{ 
                                        y: [0, -10, 0],
                                        opacity: [0.5, 1, 0.5]
                                    }}
                                    transition={{
                                        duration: 1.2,
                                        repeat: Infinity,
                                        delay: index * 0.2,
                                        ease: "easeInOut"
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

// Advanced Card Loader
export const CardLoader = ({ count = 3, className = "" }) => {
    return (
        <div className={`grid gap-6 ${className}`}>
            {[...Array(count)].map((_, index) => (
                <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg animate-pulse"
                >
                    {/* Header */}
                    <div className="flex items-center mb-4">
                        <div className="w-12 h-12 bg-gray-300 dark:bg-gray-700 rounded-xl"></div>
                        <div className="ml-4 flex-1">
                            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded mb-2"></div>
                            <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-2/3"></div>
                        </div>
                    </div>
                    
                    {/* Content Lines */}
                    <div className="space-y-3">
                        <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded"></div>
                        <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-5/6"></div>
                        <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-4/6"></div>
                    </div>
                    
                    {/* Tags */}
                    <div className="flex gap-2 mt-4">
                        {[...Array(3)].map((_, tagIndex) => (
                            <div 
                                key={tagIndex}
                                className="h-6 bg-gray-300 dark:bg-gray-700 rounded-full w-16"
                            />
                        ))}
                    </div>
                </motion.div>
            ))}
        </div>
    );
};

// Pulse Loader for Buttons
export const PulseLoader = ({ size = "sm" }) => {
    const sizes = {
        sm: "w-4 h-4",
        md: "w-6 h-6",
        lg: "w-8 h-8"
    };

    return (
        <div className="flex space-x-1">
            {[...Array(3)].map((_, index) => (
                <motion.div
                    key={index}
                    className={`${sizes[size]} bg-current rounded-full`}
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.5, 1, 0.5]
                    }}
                    transition={{
                        duration: 1,
                        repeat: Infinity,
                        delay: index * 0.2,
                        ease: "easeInOut"
                    }}
                />
            ))}
        </div>
    );
};

export default PageLoader;
import { motion } from 'framer-motion';
import { useState } from 'react';

export const AnimatedButton = ({ 
    children, 
    onClick, 
    variant = "primary", 
    size = "md", 
    className = "",
    disabled = false,
    loading = false,
    icon,
    ...props 
}) => {
    const [isHovered, setIsHovered] = useState(false);

    const variants = {
        primary: "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700",
        secondary: "bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700",
        outline: "border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800/50",
        ghost: "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
    };

    const sizes = {
        sm: "px-4 py-2 text-sm",
        md: "px-6 py-3 text-base",
        lg: "px-8 py-4 text-lg"
    };

    return (
        <motion.button
            className={`
                relative overflow-hidden font-medium rounded-xl transition-all duration-300 
                ${variants[variant]} ${sizes[size]} ${className}
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                transform-gpu
            `}
            onClick={onClick}
            disabled={disabled || loading}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            whileHover={{ 
                scale: disabled ? 1 : 1.02,
                y: disabled ? 0 : -2
            }}
            whileTap={{ 
                scale: disabled ? 1 : 0.98,
                y: disabled ? 0 : 0
            }}
            transition={{ 
                type: "spring", 
                stiffness: 300, 
                damping: 20 
            }}
            {...props}
        >
            {/* Animated background overlay */}
            <motion.div
                className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"
                initial={{ x: '-100%', opacity: 0 }}
                animate={{ 
                    x: isHovered && !disabled ? '100%' : '-100%',
                    opacity: isHovered && !disabled ? 0.3 : 0
                }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
            />
            
            {/* Content */}
            <div className="relative z-10 flex items-center justify-center space-x-2">
                {loading ? (
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
                    />
                ) : icon && (
                    <span className="flex items-center">
                        {icon}
                    </span>
                )}
                <span>{children}</span>
            </div>

            {/* Ripple effect */}
            <motion.div
                className="absolute inset-0 bg-white/30 rounded-full"
                initial={{ scale: 0, opacity: 0.5 }}
                animate={{ scale: isHovered && !disabled ? 2 : 0, opacity: 0 }}
                transition={{ duration: 0.4 }}
            />
        </motion.button>
    );
};

export const FloatingActionButton = ({ 
    children, 
    onClick, 
    className = "",
    color = "blue" 
}) => {
    const colorVariants = {
        blue: "bg-blue-600 hover:bg-blue-700",
        purple: "bg-purple-600 hover:bg-purple-700", 
        green: "bg-green-600 hover:bg-green-700",
        red: "bg-red-600 hover:bg-red-700"
    };

    return (
        <motion.button
            className={`
                fixed bottom-8 right-8 z-50 w-14 h-14 rounded-full shadow-lg text-white
                flex items-center justify-center ${colorVariants[color]} ${className}
            `}
            onClick={onClick}
            whileHover={{ 
                scale: 1.1,
                boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 10px 10px -5px rgb(0 0 0 / 0.04)"
            }}
            whileTap={{ scale: 0.9 }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ 
                type: "spring", 
                stiffness: 300, 
                damping: 20,
                delay: 1
            }}
        >
            {children}
        </motion.button>
    );
};

export default AnimatedButton;
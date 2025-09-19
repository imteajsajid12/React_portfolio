import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Hook to detect mobile device and screen size
export const useResponsive = () => {
    const [screenSize, setScreenSize] = useState('desktop');
    const [isMobile, setIsMobile] = useState(false);
    const [isTablet, setIsTablet] = useState(false);

    useEffect(() => {
        const checkScreenSize = () => {
            const width = window.innerWidth;
            
            if (width < 640) {
                setScreenSize('mobile');
                setIsMobile(true);
                setIsTablet(false);
            } else if (width < 1024) {
                setScreenSize('tablet');
                setIsMobile(false);
                setIsTablet(true);
            } else {
                setScreenSize('desktop');
                setIsMobile(false);
                setIsTablet(false);
            }
        };

        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);
        
        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    return { screenSize, isMobile, isTablet };
};

// Hook to detect reduced motion preference
export const useReducedMotion = () => {
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        setPrefersReducedMotion(mediaQuery.matches);

        const handleChange = (event) => {
            setPrefersReducedMotion(event.matches);
        };

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);

    return prefersReducedMotion;
};

// Responsive Animation Component
export const ResponsiveMotion = ({ 
    children, 
    mobileProps = {}, 
    tabletProps = {}, 
    desktopProps = {},
    className = "",
    ...props 
}) => {
    const { isMobile, isTablet } = useResponsive();
    const prefersReducedMotion = useReducedMotion();

    // Get appropriate props based on screen size
    let responsiveProps = desktopProps;
    if (isMobile) responsiveProps = { ...desktopProps, ...mobileProps };
    if (isTablet) responsiveProps = { ...desktopProps, ...tabletProps };

    // Reduce animations if user prefers reduced motion
    if (prefersReducedMotion) {
        responsiveProps = {
            ...responsiveProps,
            animate: { opacity: 1 },
            initial: { opacity: 0 },
            transition: { duration: 0.2 }
        };
    }

    return (
        <motion.div 
            className={className}
            {...props}
            {...responsiveProps}
        >
            {children}
        </motion.div>
    );
};

// Mobile-first Grid Component
export const ResponsiveGrid = ({ 
    children, 
    cols = { mobile: 1, tablet: 2, desktop: 3 },
    gap = 6,
    className = "" 
}) => {
    const gridClasses = `
        grid gap-${gap}
        grid-cols-${cols.mobile}
        md:grid-cols-${cols.tablet}
        lg:grid-cols-${cols.desktop}
        ${className}
    `;

    return (
        <div className={gridClasses}>
            {children}
        </div>
    );
};

// Touch-friendly Button Component
export const TouchButton = ({ 
    children, 
    onClick, 
    variant = "primary",
    size = "md",
    className = "",
    disabled = false,
    ...props 
}) => {
    const { isMobile } = useResponsive();
    const prefersReducedMotion = useReducedMotion();

    const baseClasses = "font-medium rounded-xl transition-all duration-300 select-none";
    
    const variants = {
        primary: "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700",
        secondary: "bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600",
        outline: "border-2 border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950"
    };

    // Mobile-friendly sizing (larger touch targets)
    const sizes = {
        sm: isMobile ? "px-6 py-3 text-sm min-h-[44px]" : "px-4 py-2 text-sm",
        md: isMobile ? "px-8 py-4 text-base min-h-[48px]" : "px-6 py-3 text-base", 
        lg: isMobile ? "px-10 py-5 text-lg min-h-[52px]" : "px-8 py-4 text-lg"
    };

    const motionProps = prefersReducedMotion 
        ? {} 
        : {
            whileTap: { scale: 0.98 },
            whileHover: { scale: 1.02 }
        };

    return (
        <motion.button
            className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className} ${
                disabled ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            onClick={onClick}
            disabled={disabled}
            {...motionProps}
            {...props}
        >
            {children}
        </motion.button>
    );
};

// Swipeable Card Component for Mobile
export const SwipeableCard = ({ 
    children, 
    onSwipeLeft, 
    onSwipeRight, 
    className = "" 
}) => {
    const { isMobile } = useResponsive();

    if (!isMobile) {
        return <div className={className}>{children}</div>;
    }

    return (
        <motion.div
            className={className}
            drag="x"
            dragConstraints={{ left: -100, right: 100 }}
            dragElastic={0.1}
            onDragEnd={(event, info) => {
                if (info.offset.x > 100 && onSwipeRight) {
                    onSwipeRight();
                } else if (info.offset.x < -100 && onSwipeLeft) {
                    onSwipeLeft();
                }
            }}
            whileDrag={{ scale: 0.95 }}
        >
            {children}
        </motion.div>
    );
};

// Responsive Modal Component
export const ResponsiveModal = ({ 
    isOpen, 
    onClose, 
    children, 
    title,
    className = "" 
}) => {
    const { isMobile } = useResponsive();
    
    const mobileVariants = {
        initial: { y: "100%", opacity: 0 },
        animate: { y: 0, opacity: 1 },
        exit: { y: "100%", opacity: 0 }
    };
    
    const desktopVariants = {
        initial: { scale: 0.8, opacity: 0 },
        animate: { scale: 1, opacity: 1 },
        exit: { scale: 0.8, opacity: 0 }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                    />
                    
                    {/* Modal Content */}
                    <div className={`fixed z-50 ${
                        isMobile 
                            ? 'inset-x-0 bottom-0' 
                            : 'inset-0 flex items-center justify-center p-4'
                    }`}>
                        <motion.div
                            variants={isMobile ? mobileVariants : desktopVariants}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            className={`
                                bg-white dark:bg-gray-800 
                                ${isMobile 
                                    ? 'rounded-t-3xl w-full max-h-[90vh] overflow-y-auto' 
                                    : 'rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto'
                                }
                                shadow-2xl ${className}
                            `}
                        >
                            {title && (
                                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                        {title}
                                    </h2>
                                    <button
                                        onClick={onClose}
                                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                    >
                                        ✕
                                    </button>
                                </div>
                            )}
                            
                            <div className="p-6">
                                {children}
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
};

export default ResponsiveMotion;
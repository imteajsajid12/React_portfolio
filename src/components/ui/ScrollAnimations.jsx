import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

export const ScrollAnimatedSection = ({
    children,
    animation = "fadeInUp",
    delay = 0,
    duration = 0.6,
    className = "",
    ...props
}) => {
    const { ref, inView } = useInView({
        threshold: 0.1,
        triggerOnce: true
    });

    // Detect mobile for performance optimizations
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

    const animations = {
        fadeInUp: {
            initial: { opacity: 0, y: 60 },
            animate: { opacity: 1, y: 0 }
        },
        fadeInLeft: {
            initial: { opacity: 0, x: -60 },
            animate: { opacity: 1, x: 0 }
        },
        fadeInRight: {
            initial: { opacity: 0, x: 60 },
            animate: { opacity: 1, x: 0 }
        },
        scaleIn: {
            initial: { opacity: 0, scale: 0.8 },
            animate: { opacity: 1, scale: 1 }
        },
        slideInUp: {
            initial: { opacity: 0, y: 100 },
            animate: { opacity: 1, y: 0 }
        }
    };

    return (
        <motion.div
            ref={ref}
            className={className}
            initial={animations[animation].initial}
            animate={inView ? animations[animation].animate : animations[animation].initial}
            transition={{
                duration: isMobile ? duration * 0.5 : duration, // 50% faster on mobile
                delay: isMobile ? delay * 0.5 : delay, // Reduce delay on mobile
                type: "spring",
                stiffness: isMobile ? 50 : 100, // Reduce stiffness on mobile
                damping: 15
            }}
            {...props}
        >
            {children}
        </motion.div>
    );
};

export const StaggerContainer = ({
    children,
    staggerDelay = 0.1,
    className = ""
}) => {
    const { ref, inView } = useInView({
        threshold: 0.1,
        triggerOnce: true
    });

    const container = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: staggerDelay
            }
        }
    };

    return (
        <motion.div
            ref={ref}
            className={className}
            variants={container}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
        >
            {children}
        </motion.div>
    );
};

export const StaggerItem = ({ children, className = "" }) => {
    // Detect mobile for performance optimizations
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

    const item = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                stiffness: isMobile ? 50 : 100, // Reduce stiffness on mobile
                damping: 15
            }
        }
    };

    return (
        <motion.div
            className={className}
            variants={item}
        >
            {children}
        </motion.div>
    );
};

// Parallax component
export const ParallaxSection = ({
    children,
    speed = 0.5,
    className = ""
}) => {
    return (
        <motion.div
            className={className}
            initial={{ y: 0 }}
            whileInView={{ y: -50 * speed }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            viewport={{ once: false }}
        >
            {children}
        </motion.div>
    );
};

export default ScrollAnimatedSection;
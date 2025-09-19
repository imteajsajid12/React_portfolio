import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Typed from 'typed.js';
import PropTypes from 'prop-types';

const AnimatedText = ({ 
    strings = [], 
    typeSpeed = 50, 
    backSpeed = 30, 
    loop = true, 
    className = "",
    showCursor = true 
}) => {
    const el = useRef(null);
    const typed = useRef(null);

    useEffect(() => {
        const options = {
            strings: strings,
            typeSpeed: typeSpeed,
            backSpeed: backSpeed,
            loop: loop,
            showCursor: showCursor,
            cursorChar: '|',
            onComplete: (self) => {
                if (!loop) {
                    setTimeout(() => {
                        self.cursor.remove();
                    }, 1000);
                }
            }
        };

        typed.current = new Typed(el.current, options);

        return () => {
            typed.current.destroy();
        };
    }, [strings, typeSpeed, backSpeed, loop, showCursor]);

    return (
        <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className={className}
            ref={el}
        />
    );
};

// Advanced text reveal animation component
export const TextReveal = ({ 
    children, 
    delay = 0, 
    duration = 0.8, 
    className = "" 
}) => {
    const text = typeof children === 'string' ? children : String(children || '');
    const words = text.split(" ");

    const container = {
        hidden: { opacity: 0 },
        visible: (i = 1) => ({
            opacity: 1,
            transition: { 
                staggerChildren: 0.12, 
                delayChildren: delay * i,
            }
        })
    };

    const child = {
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                damping: 12,
                stiffness: 100,
                duration: duration
            }
        },
        hidden: {
            opacity: 0,
            y: 20,
            transition: {
                type: "spring",
                damping: 12,
                stiffness: 100,
                duration: duration
            }
        }
    };

    return (
        <motion.div
            style={{ overflow: "hidden", display: "flex", flexWrap: "wrap" }}
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className={className}
        >
            {words.map((word, index) => (
                <motion.span
                    variants={child}
                    style={{ marginRight: "5px" }}
                    key={index}
                >
                    {word}
                </motion.span>
            ))}
        </motion.div>
    );
};

// Gradient text animation
export const GradientText = ({ 
    children, 
    colors = ["from-blue-600", "via-purple-600", "to-indigo-600"],
    className = ""
}) => {
    return (
        <motion.span
            className={`bg-gradient-to-r ${colors.join(" ")} bg-clip-text text-transparent ${className}`}
            animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            }}
            transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear"
            }}
            style={{
                backgroundSize: "200% 200%",
            }}
        >
            {children}
        </motion.span>
    );
};

// PropTypes
AnimatedText.propTypes = {
    strings: PropTypes.arrayOf(PropTypes.string),
    typeSpeed: PropTypes.number,
    backSpeed: PropTypes.number,
    loop: PropTypes.bool,
    className: PropTypes.string,
    showCursor: PropTypes.bool
};

TextReveal.propTypes = {
    children: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    delay: PropTypes.number,
    duration: PropTypes.number,
    className: PropTypes.string
};

GradientText.propTypes = {
    children: PropTypes.node,
    colors: PropTypes.arrayOf(PropTypes.string),
    className: PropTypes.string
};

export default AnimatedText;
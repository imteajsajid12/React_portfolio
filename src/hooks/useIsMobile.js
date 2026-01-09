import { useState, useEffect } from 'react';

/**
 * Custom hook to detect mobile devices based on screen width
 * Uses window.matchMedia for responsive detection with debouncing
 * @param {number} breakpoint - Screen width breakpoint in pixels (default: 768)
 * @returns {boolean} - True if screen width is below breakpoint
 */
const useIsMobile = (breakpoint = 768) => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        // Create media query
        const mediaQuery = window.matchMedia(`(max-width: ${breakpoint}px)`);
        
        // Set initial value
        setIsMobile(mediaQuery.matches);

        // Debounce function to limit resize event calls
        let timeoutId = null;
        
        const handleResize = (e) => {
            // Clear existing timeout
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
            
            // Set new timeout (250ms debounce)
            timeoutId = setTimeout(() => {
                setIsMobile(e.matches);
            }, 250);
        };

        // Add event listener (modern approach)
        mediaQuery.addEventListener('change', handleResize);

        // Cleanup function
        return () => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
            mediaQuery.removeEventListener('change', handleResize);
        };
    }, [breakpoint]);

    return isMobile;
};

export default useIsMobile;

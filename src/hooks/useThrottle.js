import { useCallback, useRef } from 'react';

/**
 * Custom hook to throttle function execution
 * Limits function calls to once per specified delay
 * @param {Function} callback - Function to throttle
 * @param {number} delay - Minimum time between function calls in milliseconds (default: 100)
 * @returns {Function} - Throttled function
 */
const useThrottle = (callback, delay = 100) => {
    const lastRun = useRef(Date.now());
    const timeoutRef = useRef(null);

    const throttledFunction = useCallback(
        (...args) => {
            const now = Date.now();
            const timeSinceLastRun = now - lastRun.current;

            // Clear any pending timeout
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }

            if (timeSinceLastRun >= delay) {
                // Enough time has passed, execute immediately
                callback(...args);
                lastRun.current = now;
            } else {
                // Schedule execution for later
                timeoutRef.current = setTimeout(() => {
                    callback(...args);
                    lastRun.current = Date.now();
                }, delay - timeSinceLastRun);
            }
        },
        [callback, delay]
    );

    return throttledFunction;
};

export default useThrottle;

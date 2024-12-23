import { useRef, useEffect } from "react";

const useDebounce = (fn, delay) => {
    const timeoutRef = useRef(null);

    const debouncedFn = (...args) => {
        return new Promise((resolve, reject) => {
            window.clearTimeout(timeoutRef.current);

            timeoutRef.current = window.setTimeout(async () => {
                try {
                    const result = await fn(...args); 
                    resolve(result); 
                } catch (error) {
                    reject(error); 
                }
            }, delay);
        });
    };

    useEffect(() => {
        return () => window.clearTimeout(timeoutRef.current); 
    }, []);

    return debouncedFn;
};

export default useDebounce;

import { useRef, useEffect, useState } from "react";

const useDebounce = (fn, delay) => {
    const [isPending, setIsPeding] = useState(false);
    const timeoutRef = useRef(null);

    const debouncedFn = (...args) => {
        return new Promise((resolve, reject) => {
            if (isPending) return;
            window.clearTimeout(timeoutRef.current);

            timeoutRef.current = window.setTimeout(async () => {
                try {
                    setIsPeding(true)
                    const result = await fn(...args); 
                    resolve(result); 
                } catch (error) {
                    reject(error); 
                } finally {
                    setIsPeding(false);
                }
            }, delay);
        });
    };

    useEffect(() => {
        return () => window.clearTimeout(timeoutRef.current); 
    }, []);

    return { debouncedFn, isPending };
};

export default useDebounce;

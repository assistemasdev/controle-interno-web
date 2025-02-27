import { useCallback, useEffect, useState, useRef } from 'react';
import { toast } from 'react-toastify';

const useNotification = () => {
    const lastToastRef = useRef(null)
    const showNotification = useCallback((type, message) => {
        if (message && toast[type]) {
            if(lastToastRef.current) {
                console.log(lastToastRef.current)
                toast.dismiss(lastToastRef.current)
            }

            const selectedTheme = localStorage.getItem("selected-theme") || "light"; 
            lastToastRef.current = toast[type](message, {
                theme: selectedTheme, 
                onClose: () => {
                    lastToastRef.current = null; 
                },
            });
        }
    }, []);

    return { showNotification };
};

export default useNotification;

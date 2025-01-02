import { useCallback } from 'react';
import { toast } from 'react-toastify';

const useNotification = () => {
    const showNotification = useCallback((type, message) => {
        if (message && toast[type]) {
            const selectedTheme = localStorage.getItem("selected-theme") || "light"; 
            toast[type](message, {
                theme: selectedTheme, 
            });
        }
    }, []);

    return { showNotification };
};

export default useNotification;

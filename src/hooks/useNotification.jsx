import { useCallback } from 'react';
import { toast } from 'react-toastify';

const useNotification = () => {
    const showNotification = useCallback((type, message) => {
        if (message && toast[type]) {
            toast[type](message);
        }
    }, []);

    return { showNotification };
};

export default useNotification;

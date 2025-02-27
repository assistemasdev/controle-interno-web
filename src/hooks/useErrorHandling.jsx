import { useNavigate } from 'react-router-dom';
import useNotification from './useNotification';

const useErrorHandling = () => {
    const navigate = useNavigate();
    const { showNotification } = useNotification();

    const handleError = (error, fallbackMessage = 'Ocorreu um erro') => {
        const message = error.message || fallbackMessage;
        showNotification('error', message);

        if (error.status === 404) navigate('/dashboard');
    };

    return { handleError };
};

export default useErrorHandling;
import useNotification from './useNotification';

const useErrorHandling = (navigate = false) => {
    const { showNotification } = useNotification();

    const handleError = (error, fallbackMessage = 'Ocorreu um erro') => {
        if(error.status !== 404) {
            const message = error.message || fallbackMessage;
            showNotification('error', message);
        }

        if (error.status === 404 && navigate) navigate('/dashboard');
    };

    return { handleError };
};

export default useErrorHandling;
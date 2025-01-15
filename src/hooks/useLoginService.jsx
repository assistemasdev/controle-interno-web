import { useState, useCallback } from 'react';
import LoginService from '../services/LoginService';
import useNotification from './useNotification';

const useLoginService = (navigate) => {
    const { showNotification } = useNotification();
    const [formErrors, setFormErrors] = useState({});

    const login = useCallback(async (data) => {
        setFormErrors({}); 
        try {
            const response = await LoginService.login(data, navigate);
            showNotification('success', response.message || 'Login efetuado com sucesso.');
            return response;
        } catch (error) {
            if (error.status === 422) {
                setFormErrors(error.data); 
                return;
            }
            showNotification('error', error.message || 'Erro ao fazer o login.');
            throw error;
        }
    }, [showNotification]);


    return {
        login,
        formErrors, 
    };
};

export default useLoginService;

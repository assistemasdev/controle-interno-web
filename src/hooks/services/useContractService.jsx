import { useCallback, useState } from 'react';
import contractService from '../../services/contractService';
import useErrorHandling from '../useErrorHandling';
import useNotification from '../useNotification';

const useContractService = (navigate) => {
    const { handleError } = useErrorHandling();
    const { showNotification } = useNotification();
    const [formErrors, setFormErrors] = useState({});

    const clearFormErrors = useCallback(() => {
        setFormErrors({});
    }, []);

    const handleRequest = useCallback(
        async (requestFn, successMessage, customErrorMessage) => {
            clearFormErrors();
            try {
                const response = await requestFn();
                if (successMessage) {
                    showNotification('success', response.message || successMessage);
                }
                return response;
            } catch (error) {
                if (error.status === 422) {
                    setFormErrors(error.data || {});
                    showNotification('warning', 'Verifique os campos destacados.');
                    return;
                }
                handleError(error, customErrorMessage);
                throw error;
            }
        },
        [handleError, showNotification]
    );

    const fetchInfos = useCallback(
        async (id) => handleRequest(
            () => contractService.fetchInfo(id, navigate),
            null,
            'Erro ao buscar os dados.'
        ),
        [navigate, handleRequest]
    );


    return {
        fetchInfos,
    };
};

export default useContractService;

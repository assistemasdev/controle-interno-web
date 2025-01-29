import { useCallback, useState } from 'react';
import baseService from '../../services/baseService';
import useErrorHandling from '../useErrorHandling';
import useNotification from '../useNotification';

const useBaseService = (navigate) => {
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

    const get = useCallback(
        async (url, params = {}) => handleRequest(
            () => baseService.get(url, params, navigate),
            null,
            'Erro ao buscar os dados.'
        ),
        [navigate, handleRequest]
    );

    const getByColumn = useCallback(
        async (url) => handleRequest(
            () => baseService.getByColumn(url, navigate),
            null,
            'Erro ao buscar os dados.'
        ),
        [navigate, handleRequest]
    );

    const post = useCallback(
        async (url, data) => handleRequest(
            () => baseService.post(url, data, navigate),
            'Cadastro realizado com sucesso.',
            'Erro ao cadastrar.'
        ),
        [navigate, handleRequest]
    );

    const put = useCallback(
        async (url, data) => handleRequest(
            () => baseService.put(url, data, navigate),
            'Edição realizada com sucesso.',
            'Erro ao editar.'
        ),
        [navigate, handleRequest]
    );

    const del = useCallback(
        async (url) => handleRequest(
            () => baseService.delete(url, navigate),
            'Exclusão realizada com sucesso.',
            'Erro ao excluir.'
        ),
        [navigate, handleRequest]
    );

    return {
        get,
        getByColumn,
        post,
        put,
        del,
        formErrors,
        setFormErrors
    };
};

export default useBaseService;
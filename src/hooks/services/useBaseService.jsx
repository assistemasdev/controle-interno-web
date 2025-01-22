import { useCallback, useState } from 'react';
import baseService from '../../services/baseService';
import useErrorHandling from '../useErrorHandling';
import useNotification from '../useNotification';

const useBaseService = (entity, navigate) => {
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

    const fetchAll = useCallback(
        async (params = { deleted_at: false }) => handleRequest(
            () => baseService.fetchAll(entity, params, navigate),
            null,
            'Erro ao buscar os dados.'
        ),
        [entity, navigate, handleRequest]
    );

    const fetchById = useCallback(
        async (id) => handleRequest(
            () => baseService.fetchEntityById(entity, id, navigate),
            null,
            'Erro ao buscar os dados.'
        ),
        [entity, navigate, handleRequest]
    );

    const create = useCallback(
        async (data) => handleRequest(
            () => baseService.create(entity, data, navigate),
            'Cadastro realizado com sucesso.',
            'Erro ao cadastrar.'
        ),
        [entity, navigate, handleRequest]
    );

    const update = useCallback(
        async (id, data) => handleRequest(
            () => baseService.update(entity, id, data, navigate),
            'Edição realizada com sucesso.',
            'Erro ao editar.'
        ),
        [entity, navigate, handleRequest]
    );

    const remove = useCallback(
        async (id) => handleRequest(
            () => baseService.delete(entity, id, navigate),
            'Exclusão realizada com sucesso.',
            'Erro ao excluir.'
        ),
        [entity, navigate, handleRequest]
    );

    return {
        fetchAll,
        fetchById,
        create,
        update,
        remove,
        formErrors
    };
};

export default useBaseService;

import { useCallback, useState } from 'react';
import contactService from '../../services/contactService';
import useErrorHandling from '../useErrorHandling';
import useNotification from '../useNotification';

const useContactService = (entity, entityId, navigate) => {
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
            () => contactService.fetchAll(entity, entityId, params, navigate),
            null,
            'Erro ao buscar os dados.'
        ),
        [entity, entityId, navigate, handleRequest]
    );

    const fetchById = useCallback(
        async (id) => handleRequest(
            () => contactService.fetchContactById(entity, entityId, id, navigate),
            null,
            'Erro ao buscar os dados.'
        ),
        [entity, entityId, navigate, handleRequest]
    );

    const create = useCallback(
        async (data) => handleRequest(
            () => contactService.create(entity, entityId, data, navigate),
            'Cadastro realizado com sucesso.',
            'Erro ao cadastrar.'
        ),
        [entity, entityId, navigate, handleRequest]
    );

    const update = useCallback(
        async (id, data) => handleRequest(
            () => contactService.update(entity, entityId, id, data, navigate),
            'Edição realizada com sucesso.',
            'Erro ao editar.'
        ),
        [entity, entityId, navigate, handleRequest]
    );

    const remove = useCallback(
        async (id) => handleRequest(
            () => contactService.delete(entity, entityId, id, navigate),
            'Exclusão realizada com sucesso.',
            'Erro ao excluir.'
        ),
        [entity, entityId, navigate, handleRequest]
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

export default useContactService;

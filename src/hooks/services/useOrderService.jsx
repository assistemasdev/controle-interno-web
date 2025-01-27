import { useCallback, useState } from 'react';
import orderService from '../../services/OrderService'
import useErrorHandling from '../useErrorHandling';
import useNotification from '../useNotification';

const useOrderService = (navigate) => {
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

    const fetchAllOsItemsType = useCallback(
        async (params = { deleted_at: false }) => handleRequest(
            () => orderService.fetchAllOsItemsType(params, navigate),
            null,
            'Erro ao buscar os dados.'
        ),
        [navigate, handleRequest]
    );

    const removeOsItemType = useCallback(
        async (id) => handleRequest(
            () => orderService.removeOsItemType (id, navigate),
            'Exclusão realizada com sucesso.',
            'Erro ao excluir.'
        ),
        [navigate, handleRequest]
    );


    const createOsItemType = useCallback(
        async (data) => handleRequest(
            () => orderService.createOsItemType(data, navigate),
            'Cadastro realizado com sucesso.',
            'Erro ao cadastrar.'
        ),
        [navigate, handleRequest]
    );

    const fetchOsItemTypeById = useCallback(
        async (id) => handleRequest(
            () => orderService.fetchOsItemTypeById(id, navigate),
            null,
            'Erro ao buscar os dados.'
        ),
        [ navigate, handleRequest]
    );


    const updateOsItemType = useCallback(
        async (id, data) => handleRequest(
            () => orderService.updateOsItemType(id, data, navigate),
            'Edição realizada com sucesso.',
            'Erro ao editar.'
        ),
        [navigate, handleRequest]
    );


    return {
        fetchAllOsItemsType,
        removeOsItemType,
        createOsItemType,
        fetchOsItemTypeById,
        updateOsItemType,
        formErrors
    };
};

export default useOrderService;

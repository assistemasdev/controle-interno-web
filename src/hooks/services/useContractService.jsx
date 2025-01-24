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

    const fetchContractEventById = useCallback(
        async (id, eventId) => handleRequest(
            () => contractService.fetchContractEventById(id, eventId, navigate),
            null,
            'Erro ao buscar os dados.'
        ),
        [navigate, handleRequest]
    );

    const createContractEvent = useCallback(
        async (id, data) => handleRequest(
            () => contractService.createContractEvent(id, data, navigate),
            'Evento adicionado com sucesso!',
            'Erro ao adicionar evento!'
        ),
        [navigate, handleRequest]
    );

    const updateContractEvent = useCallback(
        async (id, eventId,data) => handleRequest(
            () => contractService.updateContractEvent(id, eventId, data, navigate),
            'Evento editado com sucesso!',
            'Erro ao adicionar evento!'
        ),
        [navigate, handleRequest]
    );

    const fetchEventsContract = useCallback(
        async (id) => handleRequest(
            () => contractService.allContractEvents(id, navigate),
            null,
            'Erro ao buscar os dados.'
        ),
        [navigate, handleRequest]
    );

    const deleteEventContract = useCallback(
        async (id, eventId) => handleRequest(
            () => contractService.deleteContractEvent(id, eventId, navigate),
            'Evento excluído com sucesso!',
            'Erro ao excluir evento.'
        ),
        [navigate, handleRequest]
    );

    return {
        fetchInfos,
        createContractEvent,
        formErrors,
        setFormErrors,
        fetchEventsContract,
        deleteEventContract,
        updateContractEvent,
        fetchContractEventById
    };
};

export default useContractService;

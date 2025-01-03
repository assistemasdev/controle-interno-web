import { useState, useCallback } from 'react';
import useErrorHandling from './useErrorHandling';
import useNotification from './useNotification';
import StatusService from '../services/StatusService';

const useStatusService = (navigate) => {
    const { handleError } = useErrorHandling();
    const { showNotification } = useNotification();
    
    const fetchAllStatus = useCallback(async (params) => {
        try {
            const response = await StatusService.getAll(params, navigate);
            return response.result;
        } catch (error) {
            handleError(error, 'Erro ao carregar a lista de produtos.');
            throw error;
        }
    }, [handleError, navigate])

    return {
        fetchAllStatus
    };
}

export default useStatusService;
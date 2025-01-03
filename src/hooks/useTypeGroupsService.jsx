import { useCallback } from 'react';
import useErrorHandling from './useErrorHandling';
import TypeGroupsService from '../services/TypeGroupsService';

const useTypeGroupsService = (navigate) => {
    const { handleError } = useErrorHandling();
    
    const fetchTypeGroups = useCallback(async (typeId) => {
        try {
            const response = await TypeGroupsService.showTypeGroups(typeId, navigate);
            return response.result;
        } catch (error) {
            handleError(error, 'Erro ao carregar endereços da organização.');
            throw error;
        }
    }, [handleError, navigate]);

    
    return {
        fetchTypeGroups
    };
}

export default useTypeGroupsService;
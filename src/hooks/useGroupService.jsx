import GroupService from '../services/GroupService';
import { useCallback } from 'react';
import useErrorHandling from './useErrorHandling';

const useGroupService = (navigate) => {
    const { handleError } = useErrorHandling();

    const fetchGroupsByType = useCallback(async (typeId) => {
        if (!typeId) {
            return [];
        }
        try {
            const response = await GroupService.getByType(typeId, navigate);
            return response.result;
        } catch (error) {
            handleError(error, 'Erro ao carregar grupos.');
            throw error;
        }
    }, [handleError, navigate]);

    return {
        fetchGroupsByType,
    };
};

export default useGroupService;

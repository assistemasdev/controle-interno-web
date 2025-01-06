import { useCallback } from 'react';
import useErrorHandling from './useErrorHandling';
import GroupService from '../services/GroupService';

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
            handleError(error, 'Erro ao carregar grupos associados ao tipo.');
            throw error;
        }
    }, [handleError, navigate]);

    const fetchAllGroups = useCallback(async () => {
        try {
            const response = await GroupService.getAll(navigate);
            return response.result;
        } catch (error) {
            handleError(error, 'Erro ao carregar todos os grupos.');
            throw error;
        }
    }, [handleError, navigate]);

    return {
        fetchGroupsByType,
        fetchAllGroups,
    };
};

export default useGroupService;

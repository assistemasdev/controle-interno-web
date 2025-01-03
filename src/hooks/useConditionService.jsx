import ConditionService from '../services/ConditionService';
import { useCallback } from 'react';
import useErrorHandling from './useErrorHandling';

const useConditionService = (navigate) => {
    const { handleError } = useErrorHandling();

    const fetchConditions = useCallback(async () => {
        try {
            const response = await ConditionService.getAll(navigate);
            return response.result;
        } catch (error) {
            handleError(error, 'Erro ao carregar condições.');
            throw error;
        }
    }, [handleError, navigate]);

    return {
        fetchConditions,
    };
};

export default useConditionService;

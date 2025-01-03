import CategoryService from '../services/CategoryService';
import { useCallback } from 'react';
import useErrorHandling from './useErrorHandling';

const useCategoryService = (navigate) => {
    const { handleError } = useErrorHandling();

    const fetchCategories = useCallback(async () => {
        try {
            const response = await CategoryService.getAll(navigate);
            return response.result;
        } catch (error) {
            handleError(error, 'Erro ao carregar categorias.');
            throw error;
        }
    }, [handleError, navigate]);

    return {
        fetchCategories,
    };
};

export default useCategoryService;

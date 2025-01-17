import CategoryService from '../services/CategoryService';
import { useCallback, useState } from 'react';
import useErrorHandling from './useErrorHandling';
import useNotification from './useNotification';

const useCategoryService = (navigate) => {
    const { handleError } = useErrorHandling();
    const { showNotification } = useNotification();
    const [formErrors, setFormErrors] = useState({});

    const fetchCategories = useCallback(async (params) => {
        try {
            const response = await CategoryService.getAll(params, navigate);
            return response.result;
        } catch (error) {
            handleError(error, 'Erro ao carregar categorias.');
            throw error;
        }
    }, [handleError, navigate]);

    const fetchCategoryById = useCallback(async (id) => {
        try {
            const response = await CategoryService.getById(id, navigate);
            return response.result;
        } catch (error) {
            handleError(error, 'Erro ao carregar categoria.');
            throw error;
        }
    }, [handleError, navigate]);

    const deleteCategory = useCallback(async (id) => {
        try {
            const response = await CategoryService.delete(id, navigate);
            showNotification('success', response.message);
            return response.result;
        } catch (error) {
            handleError(error, 'Erro ao deletar categoria');
            throw error;
        }
    }, [handleError, navigate]);

    const createCategory = useCallback(async (data) => {
        try {
            const response = await CategoryService.create(data, navigate);
            showNotification('success', response.message);
            return response.message;
        } catch (error) {
            if (error.status === 422) {
                setFormErrors({
                    name: error.data.name?.[0] || '',
                });
                return;
            }
            handleError(error, 'Erro ao cadastrar categoria');
            throw error;
        }
    }, [handleError, navigate]);

    const updateCategory = useCallback(async (id, data) => {
        try {
            const response = await CategoryService.update(id, data, navigate);
            showNotification('success', response.message);
            return response.result;
        } catch (error) {
            if (error.status === 422) {
                setFormErrors({
                    name: error.data.name?.[0] || '',
                });
                return;
            }
            handleError(error, 'Erro ao atualizar categoria');
            throw error;
        }
    }, [handleError, navigate]);

    return {
        fetchCategories,
        fetchCategoryById,
        deleteCategory,
        createCategory,
        updateCategory,
        formErrors,
    };
};

export default useCategoryService;

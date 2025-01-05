import ConditionService from '../services/ConditionService';
import { useCallback, useState } from 'react';
import useErrorHandling from './useErrorHandling';
import useNotification from './useNotification';

const useConditionService = (navigate) => {
    const { handleError } = useErrorHandling();
    const { showNotification } = useNotification();
    const [formErrors, setFormErrors] = useState({});

    const fetchConditions = useCallback(async (params) => {
        try {
            const response = await ConditionService.getAll(params, navigate);
            return response.result;
        } catch (error) {
            handleError(error, 'Erro ao carregar condições.');
            throw error;
        }
    }, [handleError, navigate]);

    const getConditionById = useCallback(async (id) => {
        try {
            const response = await ConditionService.getById(id, navigate);
            return response.result;
        } catch (error) {
            handleError(error, 'Erro ao buscar a condição.');
            throw error;
        }
    }, [handleError, navigate]);

    const createCondition = useCallback(async (data) => {
        setFormErrors({});
        try {
            const response = await ConditionService.create(data, navigate);
            showNotification('success', response.message);
            return response.result;
        } catch (error) {
            if (error.status === 422) {
                setFormErrors({
                    name: error.data.name?.[0] || ''
                });
                return;
            }
            handleError(error, 'Erro ao criar condição.');
            throw error;
        }
    }, [handleError, navigate]);

    const updateCondition = useCallback(async (id, data) => {
        setFormErrors({});
        try {
            const response = await ConditionService.update(id, data, navigate);
            showNotification('success', response.message);
            return response.result;
        } catch (error) {
            if (error.status === 422) {
                setFormErrors({
                    name: error.data.name?.[0] || ''
                });
                return;
            }
            handleError(error, 'Erro ao atualizar condição.');
            throw error;
        }
    }, [handleError, navigate]);

    const deleteCondition = useCallback(async (id) => {
        try {
            const response = await ConditionService.delete(id, navigate);
            showNotification('success', response.message);
            return response.result;
        } catch (error) {
            handleError(error, 'Erro ao deletar condição.');
            throw error;
        }
    }, [handleError, navigate]);

    return {
        fetchConditions,
        getConditionById,
        createCondition,
        updateCondition,
        deleteCondition,
        formErrors
    };
};

export default useConditionService;

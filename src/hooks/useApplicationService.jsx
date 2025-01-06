import { useCallback, useState } from 'react';
import ApplicationService from '../services/ApplicationService';
import useErrorHandling from './useErrorHandling';
import useNotification from './useNotification';

const useApplicationService = (navigate) => {
    const { handleError } = useErrorHandling();
    const { showNotification } = useNotification();
    const [formErrors, setFormErrors] = useState({});

    const fetchApplications = useCallback(async (params) => {
        try {
            const response = await ApplicationService.getAll(params, navigate);
            return response.result;
        } catch (error) {
            handleError(error, 'Erro ao carregar aplicações.');
            throw error;
        }
    }, [handleError, navigate]);

    const createApplication = useCallback(async (data) => {
        setFormErrors({});
        try {
            const response = await ApplicationService.create(data, navigate);
            showNotification('success', response.message || 'Aplicação criada com sucesso.');
            return response.message;
        } catch (error) {
            if (error.status === 422) {
                setFormErrors(error.data || {});
                return;
            }
            handleError(error, 'Erro ao criar aplicação.');
            throw error;
        }
    }, [handleError, navigate, showNotification]);

    const getApplicationById = useCallback(async (applicationId) => {
        try {
            const response = await ApplicationService.getById(applicationId, navigate);
            return response.result;
        } catch (error) {
            handleError(error, 'Erro ao carregar aplicação.');
            throw error;
        }
    }, [handleError, navigate]);

    const updateApplication = useCallback(async (applicationId, data) => {
        setFormErrors({});
        try {
            const response = await ApplicationService.update(applicationId, data, navigate);
            showNotification('success', response.message || 'Aplicação atualizada com sucesso.');
            return response.message;
        } catch (error) {
            if (error.status === 422) {
                setFormErrors(error.data || {});
                return;
            }
            handleError(error, 'Erro ao atualizar aplicação.');
            throw error;
        }
    }, [handleError, navigate, showNotification]);

    const deleteApplication = useCallback(async (applicationId) => {
        try {
            const response = await ApplicationService.delete(applicationId, navigate);
            showNotification('success', response.message || 'Aplicação excluída com sucesso.');
            return response.message;
        } catch (error) {
            handleError(error, 'Erro ao excluir aplicação.');
            throw error;
        }
    }, [handleError, navigate, showNotification]);

    return {
        fetchApplications,
        createApplication,
        getApplicationById,
        updateApplication,
        deleteApplication,
        formErrors,
    };
};

export default useApplicationService;

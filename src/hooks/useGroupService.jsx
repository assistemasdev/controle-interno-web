import { useCallback, useState } from 'react';
import useErrorHandling from './useErrorHandling';
import useNotification from './useNotification';
import GroupService from '../services/GroupService';

const useGroupService = (navigate) => {
    const { handleError } = useErrorHandling();
    const { showNotification } = useNotification();
    const [formErrors, setFormErrors] = useState({});

    const getById = useCallback(async (id) => {
        try {
            const response = await GroupService.getById(id, navigate);
            return response.result;
        } catch (error) {
            handleError(error, 'Erro ao carregar o grupo.');
            throw error;
        }
    }, [handleError, navigate]);

    const fetchAllGroups = useCallback(async (params) => {
        try {
            const response = await GroupService.getAll(params, navigate);
            return response.result;
        } catch (error) {
            handleError(error, 'Erro ao carregar todos os grupos.');
            throw error;
        }
    }, [handleError, navigate]);

    const createGroup = useCallback(async (data) => {
        setFormErrors({});
        try {
            const response = await GroupService.create(data, navigate);
            showNotification('success', response.message || 'Grupo criado com sucesso.');
            return response.message;
        } catch (error) {
            if (error.status === 422) {
                setFormErrors(error.data || {});
                return;
            }
            handleError(error, 'Erro ao criar grupo.');
            showNotification('error', error.message || 'Erro ao criar grupo.');
            throw error;
        }
    }, [handleError, navigate, showNotification]);

    const updateGroup = useCallback(async (groupId, data) => {
        setFormErrors({});
        try {
            const response = await GroupService.update(groupId, data, navigate);
            showNotification('success', response.message || 'Grupo atualizado com sucesso.');
            return response.message;
        } catch (error) {
            if (error.status === 422) {
                setFormErrors(error.data || {});
                return;
            }
            handleError(error, 'Erro ao atualizar grupo.');
            showNotification('error', error.message || 'Erro ao atualizar grupo.');
            throw error;
        }
    }, [handleError, navigate, showNotification]);

    const deleteGroup = useCallback(async (groupId) => {
        try {
            const response = await GroupService.delete(groupId, navigate);
            showNotification('success', response.message || 'Grupo excluído com sucesso.');
            return response.message;
        } catch (error) {
            handleError(error, 'Erro ao excluir grupo.');
            showNotification('error', error.message || 'Erro ao excluir grupo.');
            throw error;
        }
    }, [handleError, navigate, showNotification]);

    return {
        getById,
        fetchAllGroups,
        createGroup,
        updateGroup,
        deleteGroup,
        formErrors,
    };
};

export default useGroupService;

import { useState, useCallback } from 'react';
import PermissionService from '../services/PermissionService';
import useErrorHandling from './useErrorHandling';
import useNotification from './useNotification';

const usePermissionService = (navigate) => {
    const { handleError } = useErrorHandling();
    const { showNotification } = useNotification();
    const [permissions, setPermissions] = useState([]);

    const fetchPermissions = useCallback(async () => {
        try {
            const response = await PermissionService.getPermissions(navigate);
            setPermissions(response.result.data);
            return response.result.data;
        } catch (error) {
            handleError(error, 'Erro ao carregar permissões.');
            throw error;
        }
    }, [handleError]);

    const fetchPermissionsForUser = useCallback(async (userId) => {
        try {
            const response = await PermissionService.getPermissionUser(userId, navigate);
            return response.result || [];
        } catch (error) {
            handleError(error, 'Erro ao carregar permissões do usuário.');
            throw error;
        }
    }, [handleError]);

    const updateUserPermissions = useCallback(async (userId, permissions) => {
        try {
            const response = await PermissionService.updateUserPermissions(userId, { permissions }, navigate);
            showNotification('success', response.message || 'Permissões atualizadas com sucesso!');
            return response.message;
        } catch (error) {
            handleError(error, 'Erro ao atualizar permissões do usuário.');
            throw error;
        }
    }, [handleError, showNotification]);

    return { permissions, fetchPermissions, fetchPermissionsForUser, updateUserPermissions };
};

export default usePermissionService;

import { useState, useCallback } from 'react';
import RoleService from '../../services/RoleService';
import useErrorHandling from '../useErrorHandling';
import useNotification from '../useNotification';

const useRoleService = (navigate = null) => {
    const { handleError } = useErrorHandling();
    const { showNotification } = useNotification();
    const [formErrors, setFormErrors] = useState({});

    const clearFormErrors = useCallback(() => {
        setFormErrors({});
    }, []);

    const fetchPermissionsForRole = useCallback(async (roleId) => {
        try {
            const response = await RoleService.showRolePermissions(roleId, navigate);
            return response.result || [];
        } catch (error) {
            handleError(error, 'Erro ao buscar permissões para o cargo.');
            throw error;
        }
    }, [handleError, navigate]);

    const fetchRolesUser = useCallback(async (userId) => {
        try {
            const response = await RoleService.getRolesUser(userId, navigate);
            console.log(response)
            return response;
        } catch (error) {
            handleError(error, 'Erro ao buscar cargos do usuário.');
            throw error;
        }
    }, [handleError, navigate]);

    const updateRolePermissions = useCallback(async (roleId, data) => {
        clearFormErrors();
        try {
            const response = await RoleService.updateRolePermissions(roleId, data, navigate);
            showNotification('success', response.message || 'Permissões editada com sucesso.');
            return response;
        } catch (error) {
            if (error.status === 422) {
                setFormErrors(error.data || {});
                return;
            }
            handleError(error, 'Erro ao editar as permissões do cargo.');
            throw error;
        }
    }, [clearFormErrors, handleError, navigate, showNotification]);

    return { fetchPermissionsForRole, fetchRolesUser, formErrors, updateRolePermissions };
};

export default useRoleService;

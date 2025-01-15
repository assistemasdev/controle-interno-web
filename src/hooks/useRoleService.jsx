import { useState, useCallback } from 'react';
import RoleService from '../services/RoleService';
import useErrorHandling from './useErrorHandling';

const useRoleService = (navigate = null) => {
    const { handleError } = useErrorHandling();
    const [roles, setRoles] = useState([]);

    const fetchRoles = useCallback(async () => {
        try {
            const response = await RoleService.getRoles();
            setRoles(response.result.data);
            return response.result.data;
        } catch (error) {
            handleError(error, 'Erro ao carregar cargos.');
            throw error;
        }
    }, [handleError]);

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
            return response.result || [];
        } catch (error) {
            handleError(error, 'Erro ao buscar cargos do usuário.');
            throw error;
        }
    }, [handleError, navigate])

    return { roles, fetchRoles, fetchPermissionsForRole, fetchRolesUser };
};

export default useRoleService;

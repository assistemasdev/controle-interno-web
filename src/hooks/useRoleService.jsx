import { useState, useCallback } from 'react';
import RoleService from '../services/RoleService';
import useErrorHandling from './useErrorHandling';

const useRoleService = () => {
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
            const response = await RoleService.showRolePermissions(roleId);
            return response.result || [];
        } catch (error) {
            handleError(error, 'Erro ao buscar permissões para o cargo.');
            throw error;
        }
    }, [handleError]);

    return { roles, fetchRoles, fetchPermissionsForRole };
};

export default useRoleService;

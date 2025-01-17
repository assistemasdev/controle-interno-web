import { useState, useCallback } from 'react';
import RoleService from '../services/RoleService';
import useErrorHandling from './useErrorHandling';
import useNotification from './useNotification';

const useRoleService = (navigate = null) => {
    const { handleError } = useErrorHandling();
    const [roles, setRoles] = useState([]);
    const { showNotification } = useNotification();
    const [formErrors, setFormErrors] = useState({});

    const clearFormErrors = useCallback(() => {
        setFormErrors({});
    }, []);

    const fetchRoles = useCallback(async (params = {}) => {
        try {
            const response = await RoleService.getRoles(params);
            setRoles(response.result.data);
            return response.result;
        } catch (error) {
            handleError(error, 'Erro ao carregar cargos.');
            throw error;
        }
    }, [handleError]);

    const fetchRoleById = useCallback(async (roleId) => {
        try {
            const response = await RoleService.getById(roleId, navigate);
            return response.result || [];
        } catch (error) {
            handleError(error, 'Erro ao buscar o cargo.');
            throw error;
        }
    }, [handleError, navigate]);

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

    const createRole = useCallback(async (data) => {
        clearFormErrors();
        try {
            const response = await RoleService.create(data, navigate);
            showNotification('success', response.message || 'Cargo criado com sucesso.');
            return response.message;
        } catch (error) {
            if (error.status === 422) {
                setFormErrors(error.data || {});
                return;
            }
            handleError(error, 'Erro ao criar cargo.');
            throw error;
        }
    }, [clearFormErrors, handleError, navigate, showNotification]);

    const updateRole = useCallback(async (id, data) => {
        clearFormErrors();
        try {
            const response = await RoleService.update(id, data, navigate);
            showNotification('success', response.message || 'Cargo editado com sucesso.');
            return response.message;
        } catch (error) {
            if (error.status === 422) {
                setFormErrors(error.data || {});
                return;
            }
            handleError(error, 'Erro ao editar o cargo.');
            throw error;
        }
    }, [clearFormErrors, handleError, navigate, showNotification]);

    const updateRolePermissions = useCallback(async (roleId, data) => {
        clearFormErrors();
        try {
            const response = await RoleService.updateRolePermissions(roleId, data, navigate);
            showNotification('success', response.message || 'Permissões editada com sucesso.');
            return response.message;
        } catch (error) {
            if (error.status === 422) {
                setFormErrors(error.data || {});
                return;
            }
            handleError(error, 'Erro ao editar as permissões do cargo.');
            throw error;
        }
    }, [clearFormErrors, handleError, navigate, showNotification]);

    const deleteRole = useCallback(async (id) => {
        try {
            const response = await RoleService.delete(id, navigate);
            showNotification('success', response.message || 'Cargo excluído com sucesso!');
            return response;
        } catch (error) {
            handleError(error, 'Erro ao excluir o cargo.');
            throw error;
        }
    }, [handleError, navigate, showNotification]);


    return { roles, fetchRoles, fetchPermissionsForRole, fetchRolesUser, createRole, formErrors, fetchRoleById, updateRole, updateRolePermissions, deleteRole };
};

export default useRoleService;

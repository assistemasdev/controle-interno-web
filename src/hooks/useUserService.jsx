import { useState, useCallback } from 'react';
import UserService from '../services/UserService';
import useErrorHandling from './useErrorHandling';
import useNotification from './useNotification';

const useUserService = (navigate) => {
    const { handleError } = useErrorHandling();
    const { showNotification } = useNotification();
    const [loading, setLoading] = useState(false);
    const [formErrors, setFormErrors] = useState({});

    const fetchUserById = useCallback(async (id) => {
        setLoading(true);
        try {
            const response = await UserService.getById(id, navigate);
            return response.result;
        } catch (error) {
            handleError(error, 'Erro ao carregar os dados do usuário.');
            throw error;
        } finally {
            setLoading(false);
        }
    }, [handleError, navigate]);

    const fetchAllUsers = useCallback(async (params) => {
        try {
            const response = await UserService.getAll(params, navigate);
            return response.result;
        } catch (error) {
            handleError(error, 'Erro ao carregar a lista de usuários.');
            throw error;
        }
    }, [handleError, navigate]);

    const getUserApplications = useCallback(async (userId) => {
        try {
            const response = await UserService.getUserApplications(userId, navigate)
            return response.result;
        } catch (error) {
            handleError(error, 'Erro ao carregar aplicações do usuário.');
            throw error;
        }
    }, [handleError, navigate]);

    const getUserApplicationOrganizations = useCallback(async (userId, applicationId) => {
        try {
            const response = await UserService.getAllUserAppOrganizations(userId, applicationId, navigate);
            return response.result;
        } catch (error) {
            handleError(error, 'Erro ao carregar organizações do usuário')
        }
    }, [handleError, navigate])

    const syncMultipleUserAppOrganizations = useCallback(async (userId, data) => {
        try {
            const response = await UserService.syncMultipleUserAppOrganizations(userId, data,navigate);
            console.log(response)
            showNotification('success', response.message);
            return response.message;
        } catch (error) {
            handleError(error, 'Erro ao carregar organizações do usuário')
            throw error;
        }
    }, [handleError, navigate])

    const getUserOrganizations = useCallback(async (userId) => {
        try {
            const response = await UserService.getUserOrganizations(userId);
            return response.result;
        } catch (error) {
            handleError(error, 'Erro ao carregar organizações do usuário')
        }
    }, [handleError, navigate]);

    const getUserAppsAndOrgs = useCallback(async (userId) => {
        try {
            const response = await UserService.getUserAppsAndOrgs(userId);
            return response.result;
        } catch (error) {
            handleError(error, 'Erro ao carregar organizações do usuário')
        }
    }, [handleError, navigate])

    const updateUser = useCallback(async (id, data) => {
        setLoading(true);
        setFormErrors({});
        const dataToSend = { ...data };
        if (data.password === '' && data.password_confirmation === '') {
            delete dataToSend.password;
            delete dataToSend.password_confirmation;
        }
        try {
            const response = await UserService.update(id, dataToSend, navigate);
            showNotification('success', response.message || 'Usuário atualizado com sucesso!');
            return response;
        } catch (error) {
            if (error.status === 422) {
                setFormErrors(error.data);
                return;
            }
            handleError(error, 'Erro ao atualizar os dados do usuário.');
            throw error;
        } finally {
            setLoading(false);
        }
    }, [handleError, navigate, showNotification]);

    const deleteUser = useCallback(async (id) => {
        try {
            const response = await UserService.delete(id, navigate);
            showNotification('success', response.message || 'Usuário excluído com sucesso!');
            return response;
        } catch (error) {
            handleError(error, 'Erro ao excluir o usuário.');
            throw error;
        }
    }, [handleError, navigate, showNotification]);

    const createUser = useCallback(async (data) => {
        setLoading(true);
        setFormErrors({});
        try {
            const response = await UserService.create(data, navigate);
            showNotification('success', response.message || 'Usuário cadastrado com sucesso!');
            return response;
        } catch (error) {
            if (error.status === 422) {
                setFormErrors(error.data);
                return;
            }
            handleError(error, 'Erro ao cadastrar o usuário.');
            throw error;
        } finally {
            setLoading(false);
        }
    }, [handleError, navigate, showNotification]);

    return {
        loading,
        formErrors,
        fetchUserById,
        fetchAllUsers,
        updateUser,
        deleteUser,
        createUser,
        getUserApplications,
        getUserApplicationOrganizations,
        getUserOrganizations,
        syncMultipleUserAppOrganizations,
        getUserAppsAndOrgs
    };
};

export default useUserService;

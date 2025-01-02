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
    };
};

export default useUserService;

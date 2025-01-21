import { useCallback } from 'react';
import UserService from '../../services/UserService';
import useErrorHandling from '../useErrorHandling';
import useNotification from '../useNotification';

const useUserService = (navigate) => {
    const { handleError } = useErrorHandling();
    const { showNotification } = useNotification();

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

    return {
        getUserApplications,
        getUserApplicationOrganizations,
        getUserOrganizations,
        syncMultipleUserAppOrganizations,
        getUserAppsAndOrgs
    };
};

export default useUserService;

import { useCallback, useState } from 'react';
import useErrorHandling from './useErrorHandling';
import useNotification from './useNotification';
import OrganizationService from '../services/OrganizationService';

const useOrganizationService = (navigate) => {
    const { handleError } = useErrorHandling();
    const { showNotification } = useNotification();
    const [formErrors, setFormErrors] = useState({});

    const fetchOrganizationAddresses = useCallback(async (organizationId) => {
        try {
            const response = await OrganizationService.allOrganizationAddresses(organizationId, navigate);
            return response.result;
        } catch (error) {
            handleError(error, 'Erro ao carregar endereços da organização.');
            throw error;
        }
    }, [handleError, navigate]);

    const fetchOrganizationLocations = useCallback(async (organizationId, addressId) => {
        try {
            const response = await OrganizationService.allOrganizationLocation(organizationId, addressId, navigate);
            return response.result;
        } catch (error) {
            handleError(error, 'Erro ao carregar localizações da organização.');
            throw error; 
        }
    }, [handleError, navigate]);

    const fetchOrganizationsByApplicationId = useCallback(async (applicationId) => {
        try {
            const response = await OrganizationService.getByApplicationId(applicationId, navigate);
            return response.result;
        } catch (error) {
            handleError(error, 'Erro ao carregar organizações pela aplicação.');
            throw error;
        }
    }, [handleError, navigate]);

    const createOrganization = useCallback(async (data) => {
        try {
            const response = await OrganizationService.create(data, navigate);
            showNotification('success', response.message || 'Organização criada com sucesso.');
            return response.message;
        } catch (error) {
            if (error.status === 422) {
                setFormErrors(error.data || {});
                return;
            }
            handleError(error, 'Erro ao criar organização.');
            throw error;
        }
    }, [handleError, navigate, showNotification]);

    const updateOrganization = useCallback(async (organizationId, data) => {
        try {
            const response = await OrganizationService.update(organizationId, data, navigate);
            showNotification('success', response.message || 'Organização atualizada com sucesso.');
            return response.message;
        } catch (error) {
            if (error.status == 422) {
                const errors = error.data;
                
                setFormErrors({
                    'organization.color': errors?.color ? errors.color[0] : '',
                    'organization.name': errors?.name ? errors.name[0] : '',
                    'organization.active': errors?.active ? errors.active[0] : '',
                });
                return
            }
            handleError(error, 'Erro ao atualizar organização.');
            throw error;
        }
    }, [handleError, navigate, showNotification]);

    const fetchOrganizationById = useCallback(async (organizationId) => {
        try {
            const response = await OrganizationService.getById(organizationId, navigate);
            return response.result;
        } catch (error) {
            handleError(error, 'Erro ao buscar detalhes da organização.');
            throw error;
        }
    }, [handleError, navigate]);

    return {
        fetchOrganizationAddresses,
        fetchOrganizationLocations,
        fetchOrganizationsByApplicationId,
        createOrganization,
        updateOrganization,
        fetchOrganizationById,
        formErrors,
    };
};

export default useOrganizationService;

import { useCallback, useState } from 'react';
import useErrorHandling from '../useErrorHandling';
import useNotification from '../useNotification';
import OrganizationService from '../../services/OrganizationService';

const useOrganizationService = (navigate) => {
    const { handleError } = useErrorHandling();
    const { showNotification } = useNotification();
    const [formErrors, setFormErrors] = useState({});

    const clearFormErrors = useCallback(() => {
        setFormErrors({});
    }, []);

    const fetchOrganizationLocations = useCallback(async (organizationId, addressId) => {
        try {
            const response = await OrganizationService.allOrganizationLocation(organizationId, addressId, navigate);
            return response.result;
        } catch (error) {
            handleError(error, 'Erro ao carregar localizações da organização.');
            throw error;
        }
    }, [handleError, navigate]);

    const fetchOrganizationLocationById = useCallback(async (organizationId, addressId, locationId) => {
        try {
            const response = await OrganizationService.showOrganizationLocation(organizationId, addressId, locationId, navigate);
            return response.result;
        } catch (error) {
            handleError(error, 'Erro ao carregar os detalhes da localização.');
            throw error;
        }
    }, [handleError, navigate]);

    const addOrganizationLocation = useCallback(async (organizationId, addressId, data) => {
        clearFormErrors();
        try {
            const response = await OrganizationService.createOrganizationLocation(organizationId, addressId, data, navigate);
            showNotification('success', response.message || 'Localização adicionada com sucesso.');
            return response.message;
        } catch (error) {
            if (error.status === 422) {
                setFormErrors(error.data || {});
                return;
            }
            handleError(error, 'Erro ao adicionar localização.');
            throw error;
        }
    }, [clearFormErrors, handleError, navigate, showNotification]);

    const updateOrganizationLocation = useCallback(async (organizationId, addressId, locationId, data) => {
        clearFormErrors();
        try {
            const response = await OrganizationService.updateOrganizationLocation(organizationId, addressId, locationId, data, navigate);
            showNotification('success', response.message || 'Localização atualizada com sucesso.');
            return response.message;
        } catch (error) {
            if (error.status === 422) {
                setFormErrors(error.data || {});
                return;
            }
            handleError(error, 'Erro ao atualizar localização.');
            throw error;
        }
    }, [clearFormErrors, handleError, navigate, showNotification]);

    const deleteOrganizationLocation = useCallback(async (organizationId, addressId, locationId) => {
        try {
            const response = await OrganizationService.deleteOrganizationLocation(organizationId, addressId, locationId);
            showNotification("success", response.message || "Localização excluída com sucesso.");
        } catch (error) {
            handleError(error, "Erro ao excluir a localização.");
            throw error;
        }
    }, [handleError, showNotification]);

    return {
        fetchOrganizationLocations,
        fetchOrganizationLocationById,
        addOrganizationLocation,
        updateOrganizationLocation,
        deleteOrganizationLocation,
    };
};

export default useOrganizationService;

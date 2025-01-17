import { useCallback, useState } from 'react';
import useErrorHandling from './useErrorHandling';
import useNotification from './useNotification';
import OrganizationService from '../services/OrganizationService';

const useOrganizationService = (navigate) => {
    const { handleError } = useErrorHandling();
    const { showNotification } = useNotification();
    const [formErrors, setFormErrors] = useState({});

    const clearFormErrors = useCallback(() => {
        setFormErrors({});
    }, []);

    const fetchAll = useCallback(async (params) => {
        try {
            const response = await OrganizationService.getAll(params, navigate);
            return response.result;
        } catch (error) {
            handleError(error, 'Erro ao carregar organizações.');
            throw error;
        }
    }, [handleError, navigate])

    const fetchOrganizationAddresses = useCallback(async (organizationId) => {
        try {
            const response = await OrganizationService.allOrganizationAddresses(organizationId, navigate);
            return response.result;
        } catch (error) {
            handleError(error, 'Erro ao carregar endereços da organização.');
            throw error;
        }
    }, [handleError, navigate]);

    const fetchOrganizationAddressById = useCallback(async (organizationId, addressId) => {
        try {
            const response = await OrganizationService.showOrganizationAddress(organizationId, addressId, navigate);
            return response.result;
        } catch (error) {
            handleError(error, 'Erro ao carregar os detalhes do endereço.');
            throw error;
        }
    }, [handleError, navigate]);

    const updateOrganizationAddress = useCallback(async (organizationId, addressId, data) => {
        clearFormErrors();
        try {
            const response = await OrganizationService.updateOrganizationAddress(organizationId, addressId, data, navigate);
            showNotification('success', response.message || 'Endereço atualizado com sucesso.');
            return response.message;
        } catch (error) {
            if (error.status === 422) {
                setFormErrors(error.data || {});
                return;
            }
            handleError(error, 'Erro ao atualizar o endereço.');
            throw error;
        }
    }, [clearFormErrors, handleError, navigate, showNotification]);

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

    const addOrganizationAddress = useCallback(async (organizationId, data) => {
        clearFormErrors();
        try {
            const response = await OrganizationService.addOrganizationAddress(organizationId, data, navigate);
            showNotification('success', response.message || 'Endereço adicionado com sucesso.');
            return response.message;
        } catch (error) {
            if (error.status === 422) {
                setFormErrors(error.data || {});
                return;
            }
            handleError(error, 'Erro ao adicionar endereço.');
            throw error;
        }
    }, [clearFormErrors, handleError, navigate, showNotification]);

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
        clearFormErrors();
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
    }, [clearFormErrors, handleError, navigate, showNotification]);

    const updateOrganization = useCallback(async (organizationId, data) => {
        clearFormErrors();
        try {
            const response = await OrganizationService.update(organizationId, data, navigate);
            showNotification('success', response.message || 'Organização atualizada com sucesso.');
            return response.message;
        } catch (error) {
            if (error.status === 422) {
                setFormErrors(error.data || {});
                return;
            }
            handleError(error, 'Erro ao atualizar organização.');
            throw error;
        }
    }, [clearFormErrors, handleError, navigate, showNotification]);

    const fetchOrganizationById = useCallback(async (organizationId) => {
        try {
            const response = await OrganizationService.getById(organizationId, navigate);
            return response.result;
        } catch (error) {
            handleError(error, 'Erro ao buscar detalhes da organização.');
            throw error;
        }
    }, [handleError, navigate]);

    const deleteOrganizationAddress = useCallback(async (organizationId, addressId) => {
        try {
            await OrganizationService.deleteOrganizationAddress(organizationId, addressId, navigate);
            showNotification('success', 'Endereço excluído com sucesso.');
        } catch (error) {
            handleError(error, 'Erro ao excluir endereço.');
            throw error;
        }
    }, [handleError, navigate, showNotification]);

    const deleteOrganizationLocation = useCallback(async (organizationId, addressId, locationId) => {
        try {
            const response = await OrganizationService.deleteOrganizationLocation(organizationId, addressId, locationId);
            showNotification("success", response.message || "Localização excluída com sucesso.");
        } catch (error) {
            handleError(error, "Erro ao excluir a localização.");
            throw error;
        }
    }, [handleError, showNotification]);

    const deleteOrganization = useCallback(async (organizationId) => {
        try {
            const response = await OrganizationService.delete(organizationId, navigate);
            showNotification('success', response.message || 'Organização excluída com sucesso.');
            return response.message;
        } catch (error) {
            handleError(error, 'Erro ao excluir Organização.');
            throw error;
        }
    }, [handleError, navigate, showNotification]);
    
    return {
        fetchAll,
        fetchOrganizationAddresses,
        fetchOrganizationAddressById,
        updateOrganizationAddress,
        fetchOrganizationLocations,
        fetchOrganizationLocationById,
        fetchOrganizationsByApplicationId,
        createOrganization,
        updateOrganization,
        fetchOrganizationById,
        deleteOrganizationAddress,
        formErrors,
        addOrganizationAddress,
        addOrganizationLocation,
        updateOrganizationLocation,
        deleteOrganizationLocation,
        deleteOrganization
    };
};

export default useOrganizationService;

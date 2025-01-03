import { useCallback } from 'react';
import useErrorHandling from './useErrorHandling';
import OrganizationService from '../services/OrganizationService';

const useOrganizationService = (navigate) => {
    const { handleError } = useErrorHandling();
    
    const fetchOrganizationAddresses = useCallback(async (organizationId) => {
        try {
            const response = await OrganizationService.allOrganizationAddresses(organizationId, navigate);
            return response.result;
        } catch (error) {
            handleError(error, 'Erro ao carregar endereços da organização.');
            throw error;
        }
    }, [handleError, navigate])

    const fetchOrganizationLocations = useCallback(async (organizationId, addressId) => {
        try {
            const response = await OrganizationService.allOrganizationLocation(organizationId, addressId, navigate);
            return response.result;
        } catch (error) {
            handleError(error, 'Erro ao carregar localizações da organização.');
            throw error; 
        }
    }, [handleError, navigate]);

    
    return {
        fetchOrganizationAddresses,
        fetchOrganizationLocations
    };
}

export default useOrganizationService;
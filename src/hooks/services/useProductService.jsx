import { useCallback } from 'react';
import useErrorHandling from '../useErrorHandling';
import ProductService from '../../services/ProductService';

const useProductService = (navigate) => {
    const { handleError } = useErrorHandling();

    const fetchProductGroups = useCallback(async (id) => {
        try {
            const response = await ProductService.getProductGroupsById(id, navigate);
            return response.result;
        } catch (error) {
            handleError(error, 'Erro ao carregar grupos do produto.');
            throw error;
        }
    }, [navigate, handleError]);

    const fetchAddresses = useCallback(async (organizationId) => {
        try {
            const response = await ProductService.getAddresses(organizationId, navigate);
            return response.result.map((address) => ({
                value: address.id,
                label: `${address.street}, ${address.city} - ${address.state}`,
            }));
        } catch (error) {
            handleError(error, 'Erro ao carregar os endereços.');
            throw error;
        }
    }, [handleError, navigate]);

    const fetchLocations = useCallback(async (organizationId, addressId) => {
        try {
            const response = await ProductService.getLocations(organizationId, addressId, navigate);
            return response.result.map((location) => ({
                value: location.id,
                label: `${location.area}, ${location.section} - ${location.spot}`,
            }));
        } catch (error) {
            handleError(error, 'Erro ao carregar as localizações.');
            throw error;
        }
    }, [handleError, navigate]);

    return {
        fetchAddresses,
        fetchLocations,
        fetchProductGroups,
    };
};

export default useProductService;

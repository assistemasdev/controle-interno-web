import { useCallback, useState } from 'react';
import CustomerService from '../../services/CustomerService';
import useErrorHandling from '../useErrorHandling';
import useNotification from '../useNotification';

const useCustomerService = (navigate) => {
    const { handleError } = useErrorHandling();
    const { showNotification } = useNotification();
    const [formErrors, setFormErrors] = useState({});

    const clearFormErrors = useCallback(() => {
        setFormErrors({});
    }, []);
    
    const fetchCustomerLocations = useCallback(async (id, addressId, params) => {
        try {
            const response = await CustomerService.getAllCustomerLocation(id, addressId, params, navigate);
            return response.result
        } catch (error) {
            handleError(error, 'Erro ao carregar localizações do cliente');
            throw error;
        }
    }, [handleError, navigate]);

    const fetchCustomerLocation = useCallback(async (id, addressId, locationId) => {
        try {
            const response = await CustomerService.showCustomerLocation(id, addressId, locationId, navigate);
            return response.result
        } catch (error) {
            handleError(error, 'Erro ao carregar localização do cliente');
            throw error;
        }
    }, [handleError, navigate]);

    const createLocation = useCallback(async (id, addressId, data) => {
        clearFormErrors();
        try {
            const response = await CustomerService.createCustomerLocation(
                id, 
                addressId, 
                data, 
                navigate
            );;
            showNotification('success', response.message)
            return response.result
        } catch (error) {
            if (error.data) {
                setFormErrors(error.data || {});
                return;
            }
            handleError(error, 'Erro ao cadastrar localização do cliente');
            throw error;
        }
    }, [handleError, navigate]);

    const updateLocation = useCallback(async (id, addressId, locationId, data) => {
        clearFormErrors();
        try {
            const response = await CustomerService.updateCustomerLocation(
                id,
                addressId,
                locationId,
                data,
                navigate
            );
            showNotification('success', response.message)
            return response.result
        } catch (error) {
            if (error.data) {
                setFormErrors(error.data || {});
                return;
            }
            handleError(error, 'Erro ao atualizar localização do cliente');
            throw error;
        }
    }, [handleError, navigate]);

    const deleteLocation = useCallback(async (customerId, addressId, locationId) => {
        try {
            const response = await CustomerService.deleteCustomerLocation(
                customerId,
                addressId,
                locationId
            );

            showNotification('success', response.message);
            return response.result;
        } catch (error) {
            handleError(error, 'Erro ao excluir localização');
            throw error;
        }
    }, [handleError, navigate, showNotification])
   
    return {
        fetchCustomerLocations,
        fetchCustomerLocation,
        createLocation,
        updateLocation,
        deleteLocation,
        formErrors,
    };
};

export default useCustomerService;

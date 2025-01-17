import { useCallback, useState } from 'react';
import CustomerService from '../services/CustomerService';
import useErrorHandling from './useErrorHandling';
import useNotification from './useNotification';

const useCustomerService = (navigate) => {
    const { handleError } = useErrorHandling();
    const { showNotification } = useNotification();
    const [formErrors, setFormErrors] = useState({});

    const fetchCustomers = useCallback(async (filters = {}) => {
        try {
            const response = await CustomerService.getAll(filters, navigate);
            return response.result;
        } catch (error) {
            handleError(error, 'Erro ao carregar clientes.');
            throw error;
        }
    }, [handleError, navigate]);

    const fetchCustomerById = useCallback(async (customerId) => {
        try {
            const response = await CustomerService.getById(customerId, navigate);
            return response.result;
        } catch (error) {
            handleError(error, 'Erro ao carregar detalhes do cliente.');
            throw error;
        }
    }, [handleError, navigate]);

    const createCustomer = useCallback(async (data) => {
        clearFormErrors();
        try {
            const response = await CustomerService.create(data, navigate);
            showNotification('success', response.message || 'Cliente criado com sucesso.');
            return response.message;
        } catch (error) {
            if (error.status === 422) {
                setFormErrors(error.data || {});
                return;
            }
            handleError(error, 'Erro ao criar cliente.');
            throw error;
        }
    }, [handleError, showNotification, navigate]);

    const updateCustomer = useCallback(async (customerId, data) => {
        clearFormErrors();
        try {
            const response = await CustomerService.update(customerId, data, navigate);
            showNotification('success', response.message || 'Cliente atualizado com sucesso.');
            return response.result;
        } catch (error) {
            if (error.status === 422) {
                setFormErrors(error.data || {});
                return;
            }
            handleError(error, 'Erro ao atualizar cliente.');
            throw error;
        }
    }, [handleError, showNotification, navigate]);

    const deleteCustomer = useCallback(async (customerId) => {
        try {
            const response = await CustomerService.delete(customerId, navigate);
            showNotification('success', response.message || 'Cliente excluído com sucesso.');
            return response.result;
        } catch (error) {
            handleError(error, 'Erro ao excluir cliente.');
            throw error;
        }
    }, [handleError, showNotification, navigate]);

    const fetchCustomerAddresses = useCallback(async (customerId, filters = {}) => {
        try {
            const response = await CustomerService.getAllCustomerAddress(customerId, filters, navigate);
            return response.result;
        } catch (error) {
            handleError(error, 'Erro ao carregar endereços do cliente.');
            throw error;
        }
    }, [handleError, navigate]);

    const fetchCustomerAddress = useCallback(async (customerId, addressId) => {
        try {
            const response = await CustomerService.showCustomerAddress(customerId, addressId)
            return response.result;
        } catch (error) {
            handleError(error , 'Error ao carregar endereço do cliente');
            throw error;
        }
    }, [handleError, navigate])
    
    const fetchCustomerContacts = useCallback(async (customerId, filters = {}) => {
        try {
            const response = await CustomerService.getAllCustomerContact(customerId, filters, navigate);
            return response.result;
        } catch (error) {
            handleError(error, 'Erro ao carregar contatos do cliente.');
            throw error;
        }
    }, [handleError, navigate]);

    const fetchCustomerContact = useCallback(async (customerId, contactId) => {
        try {
            const response = await CustomerService.showCustomerContact(customerId, contactId, navigate);
            return response.result;
        } catch (error) {
            handleError(error, 'Erro ao carregar contato do cliente.');
            throw error;
        }
    }, [handleError, navigate]);

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
    const createAddress = useCallback(async (customerId, data) => {
        clearFormErrors();
        try {
            const response = await CustomerService.addCustomerAddress(customerId, data, navigate);
            showNotification('success', response.message || 'Endereço criado com sucesso.');
            return response.result;
        } catch (error) {
            if (error.status === 422) {
                setFormErrors(error.data || {});
                return
            }

            handleError(error, 'Erro ao criar endereço.');
            throw error;
        }
    }, [handleError, showNotification, navigate]);

    const updateAddress = useCallback(async (customerId, addressId, data) => {
        clearFormErrors();

        try {
            const response = await CustomerService.updateCustomerAddress(customerId, addressId, data, navigate);
            showNotification('success', response.message || 'Endereço atualizado com sucesso.');
            return response.result;
        } catch (error) {
            if (error.status === 422) {
                setFormErrors(error.data || {});
                return
            }
            handleError(error, 'Erro ao atualizar endereço.');
            throw error;
        }
    }, [handleError, showNotification, navigate]);

    const deleteAddress = useCallback(async (customerId, addressId) => {
        try {
            const response = await CustomerService.deleteCustomerAddress(customerId, addressId, navigate);
            showNotification('success', response.message || 'Endereço excluído com sucesso.');
            return response.result;
        } catch (error) {
            handleError(error, 'Erro ao excluir endereço.');
            throw error;
        }
    }, [handleError, showNotification, navigate]);

    const createContact = useCallback(async (customerId, data) => {
        try {
            clearFormErrors();
            const response = await CustomerService.addCustomerContact(customerId, data, navigate);
            showNotification('success', response.message || 'Contato criado com sucesso.');
            return response.result;
        } catch (error) {
            if (error.status == 422) {
                setFormErrors(error.data || {});
                return
            }
            handleError(error, 'Erro ao criar contato.');
            throw error;
        }
    }, [handleError, showNotification, navigate]);

    const updateContact = useCallback(async (customerId, contactId, data) => {
        try {
            clearFormErrors();
            const response = await CustomerService.updateCustomerContact(customerId, contactId, data, navigate);
            showNotification('success', response.message || 'Contato atualizado com sucesso.');
            return response.result;
        } catch (error) {
            if (error.status == 422) {
                setFormErrors(error.data || {});
                return
            }
            handleError(error, 'Erro ao atualizar contato.');
            throw error;
        }
    }, [handleError, showNotification, navigate]);

    const deleteContact = useCallback(async (customerId, contactId) => {
        try {
            const response = await CustomerService.deleteCustomerContact(customerId, contactId, navigate);
            showNotification('success', response.message || 'Contato excluído com sucesso.');
            return response.result;
        } catch (error) {
            handleError(error, 'Erro ao excluir contato.');
            throw error;
        }
    }, [handleError, showNotification, navigate]);

    const clearFormErrors = useCallback(() => {
        setFormErrors({});
    }, []);

    return {
        fetchCustomers,
        fetchCustomerById,
        createCustomer,
        updateCustomer,
        deleteCustomer,
        fetchCustomerAddresses,
        fetchCustomerAddress,
        fetchCustomerContacts,
        fetchCustomerContact,
        fetchCustomerLocations,
        fetchCustomerLocation,
        createLocation,
        updateLocation,
        deleteLocation,
        createAddress,
        updateAddress,
        deleteAddress,
        createContact,
        updateContact,
        deleteContact,
        clearFormErrors,
        formErrors,
    };
};

export default useCustomerService;

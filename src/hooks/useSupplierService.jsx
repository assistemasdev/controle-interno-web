import SupplierService from '../services/SupplierService';
import { useCallback, useState } from 'react';
import useErrorHandling from './useErrorHandling';
import useNotification from './useNotification';

const useSupplierService = (navigate) => {
    const { handleError } = useErrorHandling();
    const { showNotification } = useNotification();
    const [formErrors, setFormErrors] = useState({});

    const fetchSuppliers = useCallback(async (filters = {}) => {
        try {
            const response = await SupplierService.getAll(filters, navigate);
            return response.result;
        } catch (error) {
            handleError(error, 'Erro ao carregar fornecedores.');
            throw error;
        }
    }, [handleError, navigate]);

    const fetchSupplierById = useCallback(async (supplierId) => {
        try {
            const response = await SupplierService.getById(supplierId, navigate);
            return response.result;
        } catch (error) {
            handleError(error, 'Erro ao carregar os detalhes do fornecedor.');
            throw error;
        }
    }, [handleError, navigate]);

    const createSupplier = useCallback(async (data) => {
        setFormErrors({});
        try {
            const response = await SupplierService.create(data, navigate);
            showNotification('success', response.message || 'Fornecedor criado com sucesso.');
            return response.result;
        } catch (error) {
            if (error.status === 422) {
                setFormErrors(error.data || {});
                return;
            }
            handleError(error, 'Erro ao criar fornecedor.');
            throw error;
        }
    }, [handleError, navigate, showNotification]);

    const updateSupplier = useCallback(async (supplierId, data) => {
        setFormErrors({});
        try {
            const response = await SupplierService.update(supplierId, data, navigate);
            showNotification('success', response.message || 'Fornecedor atualizado com sucesso.');
            return response.result;
        } catch (error) {
            if (error.status === 422) {
                setFormErrors(error.data || {});
                return;
            }
            handleError(error, 'Erro ao atualizar fornecedor.');
            throw error;
        }
    }, [handleError, navigate, showNotification]);

    const createSupplierAddress = useCallback(async (supplierId, data) => {
        setFormErrors({});
        try {
            const response = await SupplierService.addSupplierAddress(supplierId, data, navigate);
            showNotification('success', response.message || 'Endereço criado com sucesso.');
            return response.result;
        } catch (error) {
            if (error.status === 422) {
                setFormErrors(error.data || {});
                return;
            }
            handleError(error, 'Erro ao criar endereço.');
            throw error;
        }
    }, [handleError, navigate, showNotification]);

    const updateSupplierAddress = useCallback(async (supplierId, addressId, data) => {
        setFormErrors({});
        try {
            const response = await SupplierService.updateSupplierAddress(supplierId, addressId, data, navigate);
            showNotification('success', response.message || 'Endereço atualizado com sucesso.');
            return response.result;
        } catch (error) {
            if (error.status === 422) {
                setFormErrors(error.data || {});
                return;
            }
            handleError(error, 'Erro ao atualizar endereço.');
            throw error;
        }
    }, [handleError, navigate, showNotification]);

    const fetchSupplierAddressById = useCallback(async (supplierId, addressId) => {
        try {
            const response = await SupplierService.showSupplierAddress(supplierId, addressId, navigate);
            return response.result;
        } catch (error) {
            handleError(error, 'Erro ao carregar os detalhes do endereço.');
            throw error;
        }
    }, [handleError, navigate]);

    const createSupplierContact = useCallback(async (supplierId, data) => {
        setFormErrors({});
        try {
            const response = await SupplierService.addSupplierContact(supplierId, data, navigate);
            showNotification('success', response.message || 'Contato criado com sucesso.');
            return response.result;
        } catch (error) {
            if (error.status === 422) {
                setFormErrors(error.data || {});
                return;
            }
            handleError(error, 'Erro ao criar contato.');
            throw error;
        }
    }, [handleError, navigate, showNotification]);

    const updateSupplierContact = useCallback(async (supplierId, contactId, data) => {
        setFormErrors({});
        try {
            const response = await SupplierService.updateSupplierContact(supplierId, contactId, data, navigate);
            showNotification('success', response.message || 'Contato atualizado com sucesso.');
            return response.result;
        } catch (error) {
            if (error.status === 422) {
                setFormErrors(error.data || {});
                return;
            }
            handleError(error, 'Erro ao atualizar contato.');
            throw error;
        }
    }, [handleError, navigate, showNotification]);

    const fetchSupplierContactById = useCallback(async (supplierId, contactId) => {
        try {
            const response = await SupplierService.showSupplierContact(supplierId, contactId, navigate);
            return response.result;
        } catch (error) {
            handleError(error, 'Erro ao carregar os detalhes do contato.');
            throw error;
        }
    }, [handleError, navigate]);

    const deleteSupplier = useCallback(async (supplierId) => {
        try {
            const response = await SupplierService.delete(supplierId, navigate);
            showNotification('success', response.message || 'Fornecedor excluído com sucesso.');
            return response.result;
        } catch (error) {
            handleError(error, 'Erro ao excluir fornecedor.');
            throw error;
        }
    }, [handleError, navigate, showNotification]);

    const fetchSupplierAddresses = useCallback(async (supplierId, filters = {}) => {
        try {
            const response = await SupplierService.getAllSupplierAddress(supplierId, filters, navigate);
            return response.result;
        } catch (error) {
            handleError(error, 'Erro ao carregar endereços do fornecedor.');
            throw error;
        }
    }, [handleError, navigate]);

    const fetchSupplierContacts = useCallback(async (supplierId, filters = {}) => {
        try {
            const response = await SupplierService.getAllSupplierContact(supplierId, filters, navigate);
            return response.result;
        } catch (error) {
            handleError(error, 'Erro ao carregar contatos do fornecedor.');
            throw error;
        }
    }, [handleError, navigate]);

    const deleteSupplierAddress = useCallback(async (supplierId, addressId) => {
        try {
            const response = await SupplierService.deleteSupplierAddress(supplierId, addressId, navigate);
            showNotification('success', response.message || 'Endereço excluído com sucesso.');
            return response.result;
        } catch (error) {
            handleError(error, 'Erro ao excluir endereço.');
            throw error;
        }
    }, [handleError, navigate, showNotification]);

    const deleteSupplierContact = useCallback(async (supplierId, contactId) => {
        try {
            const response = await SupplierService.deleteSupplierContact(supplierId, contactId, navigate);
            showNotification('success', response.message || 'Contato excluído com sucesso.');
            return response.result;
        } catch (error) {
            handleError(error, 'Erro ao excluir contato.');
            throw error;
        }
    }, [handleError, navigate, showNotification]);

    const clearFormErrors = useCallback(() => {
        setFormErrors({});
    }, []);

    return {
        fetchSuppliers,
        fetchSupplierById,
        createSupplier,
        updateSupplier,
        createSupplierAddress,
        updateSupplierAddress,
        fetchSupplierAddressById,
        createSupplierContact,
        updateSupplierContact,
        fetchSupplierContactById,
        deleteSupplier,
        fetchSupplierAddresses,
        fetchSupplierContacts,
        deleteSupplierAddress,
        deleteSupplierContact,
        clearFormErrors,
        formErrors,
    };
};

export default useSupplierService;

import { useState, useCallback } from 'react';
import useErrorHandling from './useErrorHandling';
import useNotification from './useNotification';
import ProductService from '../services/ProductService';

const useProductService = (navigate) => {
    const { handleError } = useErrorHandling();
    const { showNotification } = useNotification();
    const [formErrors, setFormErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const fetchAllProducts = useCallback(async (params) => {
        try {
            const response = await ProductService.getAll(params, navigate);
            return response.result;
        } catch (error) {
            handleError(error, 'Erro ao carregar a lista de produtos.');
            throw error;
        }
    }, [handleError, navigate]);

    const fetchProductGroups = useCallback(async (id) => {
        try {
            const response = await ProductService.getProductGroupsById(id, navigate);
            return response.result;
        } catch (error) {
            handleError(error, 'Erro ao carregar grupos do produto.');
            throw error;
        }
    }, [navigate, handleError]);

    const fetchProductById = useCallback(async (id) => {
        try {
            const response = await ProductService.getById(id, navigate);
            return response.result;
        } catch (error) {
            handleError(error, 'Erro ao carregar ao buscar produto.');
            throw error;
        }
    }, [handleError, navigate]);

    const createProduct = useCallback(async (data) => {
        setLoading(true);
        setFormErrors({});
        try {
            const response = await ProductService.create(data, navigate);
            showNotification('success', response.message || 'Produto cadastrado com sucesso!');
            return response;
        } catch (error) {
            if (error.status === 422) {
                setFormErrors({
                    'product.name': error.data['product.name']?.[0] || '',
                    'product.number': error.data['product.number']?.[0] || '',
                    'product.serial_number': error.data['product.serial_number']?.[0] || '',
                    'product.current_organization_id': error.data['product.current_organization_id']?.[0] || '',
                    'product.owner_organization_id': error.data['product.owner_organization_id']?.[0] || '',
                    'product.supplier_id': error.data['product.supplier_id']?.[0] || '',
                    'product.purchase_date': error.data['product.purchase_date']?.[0] || '',
                    'product.warranty_date': error.data['product.warranty_date']?.[0] || '',
                    'product.condition_id': error.data['product.condition_id']?.[0] || '',
                    'product.category_id': error.data['product.category_id']?.[0] || '',
                    'product.address_id': error.data['product.address_id']?.[0] || '',
                    'product.location_id': error.data['product.location_id']?.[0] || '',
                    'groups': error.data['groups']?.[0] || '',
                });
                return;
            }
            handleError(error, 'Erro ao cadastrar o produto.');
            throw error;
        } finally {
            setLoading(false);
        }
    }, [handleError, navigate, showNotification]);

    const updateProduct = useCallback(async (id, data) => {
        setLoading(true);
        setFormErrors({});
        try {
            const response = await ProductService.update(id, data, navigate);
            showNotification('success', response.message || 'Produto atualizado com sucesso!');
            return response;
        } catch (error) {
            if (error.status === 422) {
                setFormErrors({
                    'product.name': error.data['product.name']?.[0] || '',
                    'product.number': error.data['product.number']?.[0] || '',
                    'product.serial_number': error.data['product.serial_number']?.[0] || '',
                    'product.current_organization_id': error.data['product.current_organization_id']?.[0] || '',
                    'product.owner_organization_id': error.data['product.owner_organization_id']?.[0] || '',
                    'product.supplier_id': error.data['product.supplier_id']?.[0] || '',
                    'product.purchase_date': error.data['product.purchase_date']?.[0] || '',
                    'product.warranty_date': error.data['product.warranty_date']?.[0] || '',
                    'product.condition_id': error.data['product.condition_id']?.[0] || '',
                    'product.category_id': error.data['product.category_id']?.[0] || '',
                    'product.address_id': error.data['product.address_id']?.[0] || '',
                    'product.location_id': error.data['product.location_id']?.[0] || '',
                    'groups': error.data['groups']?.[0] || '',
                });
                return;
            }
            handleError(error, 'Erro ao atualizar o produto.');
            throw error;
        } finally {
            setLoading(false);
        }
    }, [handleError, navigate, showNotification]);

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

    const deleteProduct = useCallback(async (id) => {
        try {
            const response = await ProductService.delete(id, navigate);
            showNotification('success', response.message || 'Produto excluído com sucesso!');
            return response;
        } catch (error) {
            handleError(error, 'Erro ao excluir o produto.');
            throw error;
        }
    }, [handleError, navigate, showNotification]);

    return {
        fetchAllProducts,
        createProduct,
        updateProduct,
        fetchAddresses,
        fetchLocations,
        formErrors,
        fetchProductById,
        fetchProductGroups,
        deleteProduct
    };
};

export default useProductService;

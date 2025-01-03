import SupplierService from '../services/SupplierService';
import { useCallback } from 'react';
import useErrorHandling from './useErrorHandling';

const useSupplierService = (navigate) => {
    const { handleError } = useErrorHandling();

    const fetchSuppliers = useCallback(async () => {
        try {
            const response = await SupplierService.getAll(navigate);
            return response.result;
        } catch (error) {
            handleError(error, 'Erro ao carregar fornecedores.');
            throw error;
        }
    }, [handleError, navigate]);

    return {
        fetchSuppliers,
    };
};

export default useSupplierService;

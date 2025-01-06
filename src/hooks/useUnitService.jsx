import { useCallback, useState } from 'react';
import UnitService from '../services/UnitService';
import useErrorHandling from './useErrorHandling';
import useNotification from './useNotification';

const useUnitService = (navigate) => {
    const { handleError } = useErrorHandling();
    const { showNotification } = useNotification();
    const [formErrors, setFormErrors] = useState({});

    const fetchUnits = useCallback(async (params) => {
        try {
            const response = await UnitService.getAll(params, navigate);
            return response.result;
        } catch (error) {
            handleError(error, 'Erro ao carregar unidades.');
            throw error;
        }
    }, [handleError, navigate]);

    const fetchAttachedUnits = useCallback(async (unitId) => {
        try {
            const response = await UnitService.allOutputUnits(unitId, navigate);
            return response.result;
        } catch (error) {
            handleError(error, 'Erro ao carregar unidades atreladas.');
            throw error;
        }
    }, [handleError, navigate]);

    const createUnit = useCallback(async (data) => {
        setFormErrors({});
        try {
            const response = await UnitService.create(data, navigate);
            showNotification('success', response.message || 'Unidade criada com sucesso.');
            return response.message;
        } catch (error) {
            if (error.status === 422) {
                setFormErrors(error.data || {});
                return;
            }
            handleError(error, 'Erro ao criar unidade.');
            throw error;
        }
    }, [handleError, navigate, showNotification]);

    const getUnitById = useCallback(async (unitId) => {
        try {
            const response = await UnitService.getById(unitId, navigate);
            return response.result;
        } catch (error) {
            handleError(error, 'Erro ao carregar unidade.');
            throw error;
        }
    }, [handleError, navigate]);

    const updateUnit = useCallback(async (unitId, data) => {
        setFormErrors({});
        try {
            const response = await UnitService.update(unitId, data, navigate);
            showNotification('success', response.message || 'Unidade atualizada com sucesso.');
            return response.message;
        } catch (error) {
            if (error.status === 422) {
                setFormErrors(error.data || {});
                return;
            }
            handleError(error, 'Erro ao atualizar unidade.');
            throw error;
        }
    }, [handleError, navigate, showNotification]);

    const deleteUnit = useCallback(async (unitId) => {
        try {
            const response = await UnitService.delete(unitId, navigate);
            showNotification('success', response.message || 'Unidade excluída com sucesso.');
            return response.message;
        } catch (error) {
            handleError(error, 'Erro ao excluir unidade.');
            throw error;
        }
    }, [handleError, navigate, showNotification]);

    const syncRelatedUnits = useCallback(async (unitId, data) => {
        setFormErrors({});
        try {
            const response = await UnitService.syncOutputUnits(unitId, data, navigate);
            showNotification('success', response.message || 'Unidades relacionadas sincronizadas com sucesso.');
            return response.message;
        } catch (error) {
            if (error.status === 422) {
                setFormErrors(error.data || {});
                return;
            }
            handleError(error, 'Erro ao sincronizar unidades relacionadas.');
            throw error;
        }
    }, [handleError, navigate, showNotification]);

    return {
        fetchUnits,
        fetchAttachedUnits,
        createUnit,
        getUnitById,
        updateUnit,
        deleteUnit,
        syncRelatedUnits,
        formErrors,
    };
};

export default useUnitService;

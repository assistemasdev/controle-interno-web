import { useCallback, useState } from 'react';
import UnitService from '../../services/UnitService';
import useErrorHandling from '../useErrorHandling';
import useNotification from '../useNotification';

const useUnitService = (navigate) => {
    const { handleError } = useErrorHandling();
    const { showNotification } = useNotification();
    const [formErrors, setFormErrors] = useState({});

    const fetchAttachedUnits = useCallback(async (unitId) => {
        try {
            const response = await UnitService.allOutputUnits(unitId, navigate);
            return response.result;
        } catch (error) {
            handleError(error, 'Erro ao carregar unidades atreladas.');
            throw error;
        }
    }, [handleError, navigate]);

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
        fetchAttachedUnits,
        syncRelatedUnits,
        formErrors,
    };
};

export default useUnitService;

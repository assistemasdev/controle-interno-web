import { useCallback, useState } from 'react';
import useErrorHandling from './useErrorHandling';
import TypeGroupsService from '../services/TypeGroupsService';

const useTypeGroupsService = (navigate) => {
    const { handleError } = useErrorHandling();
    const [formErrors, setFormErrors] = useState({});

    const fetchTypeGroups = useCallback(async (typeId) => {
        try {
            const response = await TypeGroupsService.showTypeGroups(typeId, navigate);
            return response.result;
        } catch (error) {
            handleError(error, 'Erro ao carregar grupos associados ao tipo.');
            throw error;
        }
    }, [handleError, navigate]);

    const attachGroupToType = useCallback(async (typeId, groupIds) => {
        setFormErrors({}); 
        try {
            const response = await TypeGroupsService.attachGroupToType(typeId, { groups: groupIds }, navigate);
            return response.message;
        } catch (error) {
            if (error.status === 422 && error.data) {
                setFormErrors(error.data);
                return;
            }
            handleError(error, 'Erro ao associar grupos ao tipo.');
            throw error;
        }
    }, [handleError, navigate]);

    const detachGroupFromType = useCallback(async (typeId, groupId) => {
        try {
            const response = await TypeGroupsService.detachGroupFromType(typeId, groupId, navigate);
            return response.message;
        } catch (error) {
            handleError(error, 'Erro ao remover grupo do tipo.');
            throw error;
        }
    }, [handleError, navigate]);

    return {
        fetchTypeGroups,
        attachGroupToType,
        detachGroupFromType,
        formErrors,
    };
};

export default useTypeGroupsService;

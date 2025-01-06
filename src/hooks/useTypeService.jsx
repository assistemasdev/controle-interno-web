import { useState, useCallback } from 'react';
import TypeService from '../services/TypeService';
import useNotification from './useNotification';

const useTypeService = () => {
    const { showNotification } = useNotification();
    const [formErrors, setFormErrors] = useState({});

    const fetchTypes = useCallback(async (params) => {
        try {
            const response = await TypeService.getAll(params);
            return response.result;
        } catch (error) {
            showNotification('error', error.message || 'Erro ao carregar os tipos.');
            throw error;
        }
    }, [showNotification]);

    const fetchTypeById = useCallback(async (id) => {
        try {
            const response = await TypeService.getById(id);
            return response.result;
        } catch (error) {
            showNotification('error', error.message || 'Erro ao carregar o tipo.');
            throw error;
        }
    }, [showNotification]);

    const fetchTypeGroups = useCallback(async (id) => {
        try {
            const response = await TypeService.getGroups(id);
            return response.result;
        } catch (error) {
            showNotification('error', error.message || 'Erro ao carregar os grupos do tipo.');
            throw error;
        }
    }, [showNotification]);

    const deleteType = useCallback(async (id) => {
        try {
            const response = await TypeService.delete(id);
            showNotification('success', response.message || 'Tipo excluído com sucesso.');
        } catch (error) {
            showNotification('error', error.message || 'Erro ao excluir o tipo.');
            throw error;
        }
    }, [showNotification]);

    const createType = useCallback(async (data) => {
        setFormErrors({}); 
        try {
            const response = await TypeService.create(data);
            showNotification('success', response.message || 'Tipo criado com sucesso.');
            return response;
        } catch (error) {
            if (error.status === 422) {
                setFormErrors(error.data); 
                return;
            }
            showNotification('error', error.message || 'Erro ao criar o tipo.');
            throw error;
        }
    }, [showNotification]);

    const updateType = useCallback(async (id, data) => {
        setFormErrors({});
        try {
            const response = await TypeService.update(id, data);
            showNotification('success', response.message || 'Tipo atualizado com sucesso.');
            return response;
        } catch (error) {
            if (error.status === 422) {
                setFormErrors(error.data);
                return;
            }
            showNotification('error', error.message || 'Erro ao atualizar o tipo.');
            throw error;
        }
    }, [showNotification]);

    return {
        fetchTypes,
        fetchTypeById,
        fetchTypeGroups,
        deleteType,
        createType,
        updateType,
        formErrors, 
    };
};

export default useTypeService;

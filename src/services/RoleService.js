import api from "../services/api";
import handleError from "../utils/errorHandler"; 
import qs from 'qs';
import { buildDynamicFilters } from "../utils/filterUtils";

const RoleService = {
    async getRolesUser(userId, navigate = null) {
        try {
            const response = await api.get(`/users/${userId}/roles`);
            return {
                message: response.data.message,
                status: response.status,
                result: response.data.result
            };
        } catch (error) {
            return handleError(error, navigate); 
        }
    },

    async getById(roleId, navigate = null) {
        try {
            const response = await api.get(`/roles/${roleId}`);
            return {
                message: response.data.message,
                status: response.status,
                result: response.data.result
            };
        } catch (error) {
            return handleError(error, navigate); 
        }
    },

    async getRoles(data, navigate) {
        const query = qs.stringify({
            filters: buildDynamicFilters(data),
            page:data.page, 
            perPage: data.perPage
        }, { encode: false });
        try {
            const response = await api.get(`/roles/?${query}`);
            return {
                message: response.data.message,
                status: response.status,
                result: response.data.result
            };
        } catch (error) {
            return handleError(error, navigate); 
        }
    },

    async showRolePermissions(roleId, navigate) {
        try {
            const response = await api.get(`/roles/${roleId}/permissions`)
            return {
                message: response.data.message,
                status: response.status,
                result: response.data.result
            };
        } catch (error) {
            return handleError(error, navigate); 
        }
    },

    async create(data, navigate) {
        try {
            const response = await api.post(`/roles/`, data)
            return {
                message: response.data.message,
                status: response.status,
                result: response.data.result
            };
        } catch (error) {
            return handleError(error, navigate); 
        }
    },

    async update(roleId, data, navigate) {
        try {
            const response = await api.put(`/roles/${roleId}`, data)
            return {
                message: response.data.message,
                status: response.status,
                result: response.data.result
            };
        } catch (error) {
            return handleError(error, navigate); 
        }
    },

    async assignPermissionsToRole(id, data, navigate) {
        try {
            const response = await api.post(`/roles/${id}/permissions`, data)
            return {
                message: response.data.message,
                status: response.status,
                result: response.data.result
            };
        } catch (error) {
            return handleError(error, navigate); 
        }
    },
    async updateRolePermissions(id, data, navigate) {
        try {
            const response = await api.put(`/roles/${id}/permissions`, data)
            return {
                message: response.data.message,
                status: response.status,
                result: response.data.result
            };
        } catch (error) {
            return handleError(error, navigate); 
        }
    }
};

export default RoleService;

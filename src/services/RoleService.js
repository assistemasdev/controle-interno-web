import api from "../services/api";
import handleError from "../utils/errorHandler";
import { formatResponse } from "../utils/objectUtils";

const RoleService = {
    async getRolesUser(userId, navigate = null) {
        try {
            const response = await api.get(`/users/${userId}/roles`);
            return formatResponse(response.data.message, response.status, response.data.result);
        } catch (error) {
            return handleError(error, navigate); 
        }
    },

    async showRolePermissions(roleId, navigate) {
        try {
            const response = await api.get(`/roles/${roleId}/permissions`);
            return formatResponse(response.data.message, response.status, response.data.result);
        } catch (error) {
            return handleError(error, navigate); 
        }
    },

    async assignPermissionsToRole(id, data, navigate) {
        try {
            const response = await api.post(`/roles/${id}/permissions`, data);
            return formatResponse(response.data.message, response.status, response.data.result);
        } catch (error) {
            return handleError(error, navigate); 
        }
    },

    async updateRolePermissions(id, data, navigate) {
        try {
            const response = await api.put(`/roles/${id}/permissions`, data);
            return formatResponse(response.data.message, response.status, response.data.result);
        } catch (error) {
            return handleError(error, navigate); 
        }
    }
};

export default RoleService;

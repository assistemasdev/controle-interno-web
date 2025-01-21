import api from "../services/api";
import handleError from "../utils/errorHandler"; 
import { formatResponse } from "../utils/objectUtils";

const UserService = {
    async getUserApplications(userId, navigate) {
        try {
            const response = await api.get(`/users/${userId}/applications`);
            return formatResponse(response.data.message, response.status, response.data.result);
        } catch (error) {
            return handleError(error, navigate);
        }
    },

    async getAllUserAppOrganizations(userId, applicationId, navigate) {
        try {
            const response = await api.get(`/users/${userId}/applications/${applicationId}/organizations`);
            return formatResponse(response.data.message, response.status, response.data.result);
        } catch (error) {
            return handleError(error, navigate);
        }
    },

    async getUserOrganizations(userId, navigate) {
        try {
            const response = await api.get(`/users/${userId}/organizations`);
            return formatResponse(response.data.message, response.status, response.data.result);
        } catch (error) {
            return handleError(error, navigate);
        }
    },

    async getUserAppsAndOrgs(userId, navigate) {
        try {
            const response = await api.get(`/users/${userId}/applications/organizations`);
            return formatResponse(response.data.message, response.status, response.data.result);
        } catch (error) {
            return handleError(error, navigate);
        }
    },

    async syncMultipleUserAppOrganizations(userId, data, navigate) {
        try {
            const response = await api.post(`/users/${userId}/applications`, {applications_organizations:data});
            return formatResponse(response.data.message, response.status, response.data.result);
        } catch (error) {
            return handleError(error, navigate);
        }
    },

    async autocomplete(data, navigate) {
        try {
            const column = Object.keys(data)[0];
            const value = Object.values(data)[0];
            const response = await api.get("/users/autocomplete", {params: {[column]:value}});
            return formatResponse(response.data.message, response.status, response.data.result);
        } catch (error) {
            return handleError(error, navigate); 
        }
    }
};

export default UserService;

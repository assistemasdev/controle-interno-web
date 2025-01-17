import api from "../services/api";
import handleError from "../utils/errorHandler"; 
import qs from 'qs';
import { buildDynamicFilters } from "../utils/filterUtils";

const UserService = {
    async getAll (data,navigate) {
        const query = qs.stringify({
            filters: buildDynamicFilters(data),
            page:data.page, 
            perPage: data.perPage
        }, { encode: false });
        try {
            const response = await api.get(`/users/?${query}`);
            return {
                message: response.data.message,
                result: response.data.result,
                status: response.status
            };
        } catch (error) {
            return handleError(error, navigate); 
        }
    },

    async getUserApplications(userId, navigate) {
        try {
            const response = await api.get(`/users/${userId}/applications`)
            return {
                message: response.data.message,
                result: response.data.result,
                status: response.status
            }
        } catch (error) {
            return handleError(error, navigate)
        }
    },

    async getAllUserAppOrganizations(userId, applicationId, navigate) {
        try {
            const response = await api.get(`/users/${userId}/applications/${applicationId}/organizations`)
            return {
                message: response.data.message,
                result: response.data.result,
                status: response.status
            }
        } catch (error) {
            return handleError(error, navigate)
        }
    },

    async getUserOrganizations(userId, navigate) {
        try {
            const response = await api.get(`/users/${userId}/organizations`);
            return {
                message: response.data.message,
                result: response.data.result,
                status: response.status
            }
        } catch (error) {
            return handleError(error, navigate);
        }
    },

    async getUserAppsAndOrgs(userId, navigate) {
        try {
            const response = await api.get(`/users/${userId}/applications/organizations`);
            return {
                message: response.data.message,
                result: response.data.result,
                status: response.status
            }
        } catch (error) {
            return handleError(error, navigate);
        }
    },

    async syncMultipleUserAppOrganizations(userId, data, navigate) {
        try {
            const response = await api.post(`/users/${userId}/applications`, {applications_organizations:data});
            return {
                message: response.data.message,
                result: response.data.result,
                status: response.status
            }
        } catch (error) {
            return handleError(error, navigate);
        }
    },

    async getById(id, navigate) {
        try {
            const response = await api.get(`/users/${id}`);
            return {
                message: response.data.message,
                result: response.data.result,
                status: response.status
            };
        } catch (error) {
            return handleError(error, navigate); 
        }
    },

    async create(data, navigate) {
        try {
            const response = await api.post("/users", data);

            return {
                status: response.status,
                message: response.data.message,
            };
        } catch (error) {
            return handleError(error, navigate); 
        }
    },

    async update(id, data, navigate) {
        try {
            const response = await api.put(`/users/${id}`, data);
            return {
                message: response.data.message,
                result: response.data.result,
                status: response.status
            };
        } catch (error) {
            return handleError(error, navigate); 
        }
    },

    async delete(id, navigate) {
        try {
            const response = await api.delete(`/users/${id}`);
            return {
                message: response.data.message,
                result: response.data.result,
                status: response.status
            };
        } catch (error) {
            return handleError(error, navigate); 
        }
    },

    async autocomplete(data, navigate) {
        try {
            const column = Object.keys(data)[0]
            const value = Object.values(data)[0]
            const response = await api.get("/users/autocomplete", {params: {[column]:value}});
            return {
                message: response.data.message,
                result: response.data.result,
                status: response.status
            };
        } catch (error) {
            return handleError(error, navigate); 
        }
    }
};

export default UserService;

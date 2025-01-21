import api from "../services/api";
import handleError from "../utils/errorHandler"; 

const OrganizationService = {
    async allOrganizationLocation(id, idAddress, navigate) {
        try {
            const response = await api.get(`/organizations/${id}/addresses/${idAddress}/locations`);
            return {
                message: response.data.message,
                result: response.data.result,
                status: response.status
            };
        } catch (error) {
            return handleError(error, navigate)
        }
    },
    async createOrganizationLocation(id, idAddress, data, navigate) {
        try {
            const response = await api.post(`/organizations/${id}/addresses/${idAddress}/locations`, data);
            
            return {
                message: response.data.message,
                result: response.data.result,
                status: response.status
            };
        } catch (error) {
            return handleError(error, navigate)
        }
    },
    async showOrganizationLocation(id, idAddress, idLocation, navigate) {
        try {
            const response = await api.get(`/organizations/${id}/addresses/${idAddress}/locations/${idLocation}`);
            return {
                message: response.data.message,
                result: response.data.result,
                status: response.status
            };
        } catch (error) {
            return handleError(error, navigate)
        }
    },
    async updateOrganizationLocation(id, idAddress, idLocation, data, navigate) {
        try {
            const response = await api.put(`/organizations/${id}/addresses/${idAddress}/locations/${idLocation}`, data);
            return {
                message: response.data.message,
                result: response.data.result,
                status: response.status
            };
        } catch (error) {
            return handleError(error, navigate)
        }
    },    
    async deleteOrganizationLocation(id, idAddress, idLocation, navigate) {
        try {
            const response = await api.delete(`/organizations/${id}/addresses/${idAddress}/locations/${idLocation}`);
            return {
                message: response.data.message,
                result: response.data.result,
                status: response.status
            };
        } catch (error) {
            return handleError(error, navigate)
        }
    },
};

export default OrganizationService;

import api from "../services/api";
import handleError from "../utils/errorHandler"; 

const OrganizationService = {
    async getByApplicationId(applicationId, navigate) {
        try {
        const response = await api.get(`/organizations/application/${applicationId}`);
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
        const response = await api.post("/organizations", data);
        return {
            message: response.data.message,
            result: response.data.result,
            status: response.status
        };
        } catch (error) {
        return handleError(error, navigate)
        }
    },

    async getById(id, navigate) {
        try {
        const response = await api.get(`/organizations/${id}`);
        return {
            message: response.data.message,
            result: response.data.result,
            status: response.status
        };
        } catch (error) {
        return handleError(error, navigate); 
        }
    },

    async update(id, data, navigate) {
        try {
        const response = await api.put(`/organizations/${id}`, data);
        return {
            message: response.data.message,
            result: response.data.result,
            status: response.status
        };
        } catch (error) {
        return handleError(error, navigate)
        }
    },

    async delete(id, navigate) {
        try {
        const response = await api.delete(`/organizations/${id}`);
        console.log(response)
        return {
            message: response.data.message,
            result: response.data.result,
            status: response.status
        };
        } catch (error) {
        return handleError(error, navigate)
        }
    }
};

export default OrganizationService;

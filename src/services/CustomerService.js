import api from "./api";
import handleError from "../utils/errorHandler"; 

const CustomerService = {
    async allCustomerLocation(id, idAddress, navigate) {
        try {
            const response = await api.get(`/customers/${id}/addresses/${idAddress}/locations`);
            return {
                message: response.data.message,
                result: response.data.result,
                status: response.status
            };
        } catch (error) {
            return handleError(error, navigate)
        }
    },

    async getAllCustomerLocation(id, idAddress, data, navigate) {
        try {
            const response = await api.get(`/customers/${id}/addresses/${idAddress}/locations/`, {params: {page: data.page, perPage:data.perPage}});
            return {
                message: response.data.message,
                result: response.data.result,
                status: response.status
            };
        } catch (error) {
            return handleError(error, navigate)
        }
    },
    async createCustomerLocation(id, idAddress, data, navigate) {
        try {
            const response = await api.post(`/customers/${id}/addresses/${idAddress}/locations`, data);
            return {
                message: response.data.message,
                result: response.data.result,
                status: response.status
            };
        } catch (error) {
            return handleError(error, navigate)
        }
    },
    async showCustomerLocation(id, idAddress, idLocation, navigate) {
        try {
            const response = await api.get(`/customers/${id}/addresses/${idAddress}/locations/${idLocation}`);
            return {
                message: response.data.message,
                result: response.data.result,
                status: response.status
            };
        } catch (error) {
            return handleError(error, navigate)
        }
    },
    async updateCustomerLocation(id, idAddress, idLocation, data, navigate) {
        try {
            const response = await api.put(`/customers/${id}/addresses/${idAddress}/locations/${idLocation}`, data);
            return {
                message: response.data.message,
                result: response.data.result,
                status: response.status
            };
        } catch (error) {
            return handleError(error, navigate)
        }
    },    
    async deleteCustomerLocation(id, idAddress, idLocation, navigate) {
        try {
            const response = await api.delete(`/customers/${id}/addresses/${idAddress}/locations/${idLocation}`);
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

export default CustomerService;

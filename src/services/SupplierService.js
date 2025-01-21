import api from "../services/api";
import handleError from "../utils/errorHandler"; 
import { formatResponse } from "../utils/objectUtils";

const SupplierService = {
    async allSupplierLocation(id, idAddress, navigate) {
        try {
            const response = await api.get(`/suppliers/${id}/addresses/${idAddress}/locations`);
            return formatResponse(response.data.message, response.status, response.data.result);
        } catch (error) {
            return handleError(error, navigate)
        }
    },
    async getAllSupplierLocation(id, idAddress, data, navigate) {
        try {
            const response = await api.get(`/suppliers/${id}/addresses/${idAddress}/locations/`, {params: {page: data.page, perPage:data.perPage}});
            return formatResponse(response.data.message, response.status, response.data.result);
        } catch (error) {
            return handleError(error, navigate)
        }
    },
    async createSupplierLocation(id, idAddress, data, navigate) {
        try {
            const response = await api.post(`/suppliers/${id}/addresses/${idAddress}/locations`, data);
            return formatResponse(response.data.message, response.status, response.data.result);
        } catch (error) {
            return handleError(error, navigate)
        }
    },
    async showSupplierLocation(id, idAddress, idLocation, navigate) {
        try {
            const response = await api.get(`/suppliers/${id}/addresses/${idAddress}/locations/${idLocation}`);
            return formatResponse(response.data.message, response.status, response.data.result);
        } catch (error) {
            return handleError(error, navigate)
        }
    },
    async updateSupplierLocation(id, idAddress, idLocation, data, navigate) {
        try {
            const response = await api.put(`/suppliers/${id}/addresses/${idAddress}/locations/${idLocation}`, data);
            return formatResponse(response.data.message, response.status, response.data.result);
        } catch (error) {
            return handleError(error, navigate)
        }
    },    
    async deleteSupplierLocation(id, idAddress, idLocation, navigate) {
        try {
            const response = await api.delete(`/suppliers/${id}/addresses/${idAddress}/locations/${idLocation}`);
            return formatResponse(response.data.message, response.status, response.data.result);
        } catch (error) {
            return handleError(error, navigate)
        }
    },
};

export default SupplierService;

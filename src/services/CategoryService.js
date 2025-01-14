import api from "../services/api";
import handleError from "../utils/errorHandler"; 
import qs from 'qs';
import { buildDynamicFilters } from "../utils/filterUtils";

const CategoryService = {
    async getAll (data,navigate) {
        const query = qs.stringify({
            filters: buildDynamicFilters(data),
            page:data.page, 
            perPage: data.perPage
        }, { encode: false });
        
        try {
            const response = await api.get(`/categories/?${query}`);
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
            const response = await api.post("/categories", data);
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
            const response = await api.get(`/categories/${id}`);
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
            const response = await api.put(`/categories/${id}`, data);
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
            const response = await api.delete(`/categories/${id}`);
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

export default CategoryService;

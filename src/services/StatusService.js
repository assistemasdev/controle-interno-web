import api from "../services/api";
import handleError from "../utils/errorHandler"; 

const StatusService = {
    async getAll(navigate) {
        try {
            const response = await api.get("/status");
            return {
                message: response.data.message,
                result: response.data.result,
                status: response.status
            };
        } catch (error) {
            return handleError(error, navigate); 
        }
    },
    async getPaginated (data,navigate) {
        try {
            const response = await api.get("/status/pages", {params: {page:data.page, perPage: data.perPage}});
            console.log(response)
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
            const response = await api.post("/status", data);
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
            const response = await api.get(`/status/${id}`);
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
            const response = await api.put(`/status/${id}`, data);
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
            const response = await api.delete(`/status/${id}`);
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

export default StatusService;

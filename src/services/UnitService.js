import api from "../services/api";
import handleError from "../utils/errorHandler"; 

const UnitService = {
    async getAllOutputUnits (id, data,navigate) {
        try {
            const response = await api.get(`/units/${id}/units/`, {params: {page:data.page, perPage: data.perPage}});
            return {
                message: response.data.message,
                result: response.data.result,
                status: response.status
            };
        } catch (error) {
            return handleError(error, navigate); 
        }
    },

    async allOutputUnits(id, navigate) {
        try {
            const response = await api.get(`/units/${id}/units`);
            return {
                message: response.data.message,
                result: response.data.result,
                status: response.status
            };
        } catch (error) {
            return handleError(error, navigate)
        }
    },
    async syncOutputUnits(id, data, navigate) {
        try {
            const response = await api.post(`/units/${id}/units`, data);
            return {
                message: response.data.message,
                result: response.data.result,
                status: response.status
            };
        } catch (error) {
            return handleError(error, navigate)
        }
    },
    async detachOutputUnits(id, data, navigate) {
        try {
            const response = await api.put(`/units/${id}/units`, data);
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

export default UnitService;

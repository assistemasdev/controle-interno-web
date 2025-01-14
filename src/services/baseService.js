import api from "../services/api";
import handleError from "../utils/errorHandler"; 

const baseService = {
    async autocomplete(model, data, navigate = null) {
        try {
            const response = await api.get(`/a/${model}`, data);
            return {
                message: response.data.message,
                status: response.status,
                result: response.data.result
            };
        } catch (error) {
            return handleError(error, navigate); 
        }
    },
};

export default baseService;

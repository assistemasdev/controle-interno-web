import api from "./api";
import handleError from "../utils/errorHandler"; 

const TypeGroupsService = {
    async showTypeGroups(id,navigate) {
        try {
            const response = await api.get(`/products/types/${id}/groups`);
            return {
                message: response.data.message,
                result: response.data.result,
                status: response.status
            };
        } catch (error) {
            return handleError(error, navigate); 
        }
    },
    async attachGroupToType(id, data, navigate) {
        try {
            const response = await api.post(`/products/types/${id}/groups`, data);
            return {
                message: response.data.message,
                result: response.data.result,
                status: response.status
            };
        } catch (error) {
            return handleError(error, navigate); 
        }
    },
    async detachGroupFromType(id, data, navigate) {
        try {
            console.log(data)
            const response = await api.put(`/products/types/${id}/groups`, data);
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

export default TypeGroupsService;

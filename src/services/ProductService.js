import api from "../services/api";
import handleError from "../utils/errorHandler"; 
import { formatResponse } from "../utils/objectUtils";

const ProductService = {
    async getProductGroupsById(id, navigate) {
        try {
            const response = await api.get(`/products/${id}/groups`);
            return formatResponse(response.data.message, response.status, response.data.result);
        } catch (error) {
            return handleError(error, navigate); 
        }
    },
};

export default ProductService;

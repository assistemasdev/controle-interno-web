import api from "../services/api";
import handleError from "../utils/errorHandler"; 

const PermissionService = {
  async getPermissionUser(userId, navigate = null) {
    try {
      const response = await api.get(`/users/${userId}/permissions`);
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

export default PermissionService;

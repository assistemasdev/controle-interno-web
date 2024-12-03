import api from "../services/api";
import handleError from "../utils/errorHandler"; 

const RoleService = {
  async getRolesUser(userId, navigate = null) {
    try {
      const response = await api.get(`/users/${userId}/roles`);
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

export default RoleService;

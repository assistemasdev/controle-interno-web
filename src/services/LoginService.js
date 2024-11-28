import api from "../services/api";
import handleError from "../utils/errorHandler"; 

const LoginService = {
  async login(data) {
    try {
      const response = await api.post("/login", data);
      return response.data;
    } catch (error) {
      return handleError(error); 
    }
  },

  async logout() {
    try {
        const response = await api.post("/logout");
        return response.data;
    } catch (error) {
        return handleError(error);
    }
  }
};

export default LoginService;

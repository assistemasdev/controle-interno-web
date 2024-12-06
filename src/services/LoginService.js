import api from "../services/api";
import handleError from "../utils/errorHandler"; 

const LoginService = {
    async login(data, navigate = null) {
        try {
            const response = await api.post("/login", data);
            return {
                message: response.data.message,
                status: response.status,
                result: response.data.result
            };
        } catch (error) {
            return handleError(error, navigate); 
        }
    },

  async logout() {
    try {
        const response = await api.post("/logout");
        return {
            message: response.message,
            status: response.status,
        };
    } catch (error) {
        return handleError(error);
    }
  }
};

export default LoginService;

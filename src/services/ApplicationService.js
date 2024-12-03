import api from "../services/api";
import handleError from "../utils/errorHandler"; 

const ApplicationService = {
  async getAll(navigate) {
    try {
      const response = await api.get("/applications");
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

export default ApplicationService;

import api from "../services/api";
import handleError from "../utils/errorHandler"; 

const ApplicationService = {
  async getAll(navigate) {
    try {
      const response = await api.get("/applications");
      return response.data.data;
    } catch (error) {
      return handleError(error, navigate); 
    }
  },

  async getById(id, navigate) {
    try {
      const response = await api.get(`/applications/${id}`);
      return response.data.data;
    } catch (error) {
      return handleError(error, navigate); 
    }
  },

  async create(data, navigate) {
    try {
      const response = await api.post("/applications", data);
      return response.data;
    } catch (error) {
      return handleError(error, navigate); 
    }
  },

  async update(id, data, navigate) {
    try {
      const response = await api.put(`/applications/${id}`, data);
      return response.data;
    } catch (error) {
      return handleError(error, navigate); 
    }
  },

  async delete(id, navigate) {
    try {
      const response = await api.delete(`/applications/${id}`);
      return response.data;
    } catch (error) {
      return handleError(error, navigate); 
    }
  },
};

export default ApplicationService;
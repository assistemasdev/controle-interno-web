import api from "../services/api";
import handleError from "../utils/errorHandler"; 

const ApplicationService = {
  async getAll() {
    try {
      const response = await api.get("/applications");
      return response.data.data;
    } catch (error) {
      return handleError(error); 
    }
  },

  async getById(id) {
    try {
      const response = await api.get(`/applications/${id}`);
      return response.data.data;
    } catch (error) {
      return handleError(error); 
    }
  },

  async create(data) {
    try {
      const response = await api.post("/applications", data);
      return response.data;
    } catch (error) {
      return handleError(error); 
    }
  },

  async update(id, data) {
    try {
      const response = await api.put(`/applications/${id}`, data);
      return response.data;
    } catch (error) {
      return handleError(error); 
    }
  },

  async delete(id) {
    try {
      const response = await api.delete(`/applications/${id}`);
      return response.data;
    } catch (error) {
      return handleError(error); 
    }
  },
};

export default ApplicationService;

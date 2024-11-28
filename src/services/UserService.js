import api from "../services/api";
import handleError from "../utils/errorHandler"; 

const UserService = {
  async getAll(navigate) {
    try {
      const response = await api.get("/users");
      return response.data;
    } catch (error) {
      return handleError(error, navigate); 
    }
  },

  async getById(id, navigate) {
    try {
      const response = await api.get(`/users/${id}`);
      return response.data.data;
    } catch (error) {
      return handleError(error, navigate); 
    }
  },

  async create(data, navigate) {
    try {
      const response = await api.post("/users", data);
      return response.data;
    } catch (error) {
      return handleError(error, navigate); 
    }
  },

  async update(id, data, navigate) {
    try {
      const response = await api.put(`/users/${id}`, data);
      return response.data;
    } catch (error) {
      return handleError(error, navigate); 
    }
  },

  async delete(id, navigate) {
    try {
      const response = await api.delete(`/users/${id}`);
      return response.data;
    } catch (error) {
      return handleError(error, navigate); 
    }
  },
};

export default UserService;

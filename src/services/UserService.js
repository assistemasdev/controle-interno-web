import api from "../services/api";
import handleError from "../utils/errorHandler"; 

const UserService = {
  async getAll(navigate) {
    try {
      const response = await api.get("/users");
      return {
        message: response.data.message,
        result: response.data.result,
        status: response.status
      };
    } catch (error) {
      return handleError(error, navigate); 
    }
  },

  async getById(id, navigate) {
    try {
      const response = await api.get(`/users/${id}`);
      return {
        message: response.data.message,
        result: response.data.result,
        status: response.status
      };
    } catch (error) {
      return handleError(error, navigate); 
    }
  },

  async create(data, navigate) {
    try {
      const response = await api.post("/users", data);

      return {
        status: response.status,
        message: response.data.message,
      };
    } catch (error) {
      return handleError(error, navigate); 
    }
  },

  async update(id, data, navigate) {
    try {
      const response = await api.put(`/users/${id}`, data);
      return response;
    } catch (error) {
      return handleError(error, navigate); 
    }
  },

  async delete(id, navigate) {
    try {
      const response = await api.delete(`/users/${id}`);
      return response;
    } catch (error) {
      return handleError(error, navigate); 
    }
  },
};

export default UserService;
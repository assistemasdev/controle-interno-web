import api from "./api";
import handleError from "../utils/errorHandler";

const UserOrganizationService = {
  async getOrganizationsByUserAndApplication(userId, applicationId, navigate) {
    try {
      const response = await api.get(`/users/${userId}/organizations/applications/${applicationId}`);
      return response.data; 
    } catch (error) {
      return handleError(error, navigate); 
    }
  },

  async associateUserToOrganization(data, navigate) {
    try {
      const response = await api.post(`/users/${data.user_id}/organizations`, data);
      return response.data;
    } catch (error) {
      return handleError(error, navigate);
    }
  },

  async dissociateUserFromOrganization(userId, organizationId, navigate) {
    try {
      const response = await api.delete(`/users/${userId}/organizations/${organizationId}`);
      return response.data;
    } catch (error) {
      return handleError(error, navigate);
    }
  },

  async isUserAssociatedWithOrganization(userId, organizationId, navigate) {
    try {
      const response = await api.get(`/users/${userId}/organizations/${organizationId}`);
      return response.data.data;
    } catch (error) {
      return handleError(error, navigate);
    }
  },
};

export default UserOrganizationService;

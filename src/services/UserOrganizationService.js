import api from "./api";
import handleError from "../utils/errorHandler";

const UserOrganizationService = {
  async getOrganizationsByUserAndApplication(userId, applicationId) {
    try {
      const response = await api.get(`/users/${userId}/organizations/applications/${applicationId}`);
      return response.data.data; 
    } catch (error) {
      return handleError(error); 
    }
  },

  async associateUserToOrganization(data) {
    try {
      const response = await api.post(`/users/${data.user_id}/organizations`, data);
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  },

  async dissociateUserFromOrganization(userId, organizationId) {
    try {
      const response = await api.delete(`/users/${userId}/organizations/${organizationId}`);
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  },

  async isUserAssociatedWithOrganization(userId, organizationId) {
    try {
      const response = await api.get(`/users/${userId}/organizations/${organizationId}`);
      return response.data.data;
    } catch (error) {
      return handleError(error);
    }
  },
};

export default UserOrganizationService;

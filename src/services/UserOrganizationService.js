import api from "./api";
import handleError from "../utils/errorHandler";

const UserOrganizationService = {
  async getOrganizationsByUserAndApplication(userId, applicationId, navigate) {
    try {
      const response = await api.get(`/users/${userId}/organizations/applications/${applicationId}`);
      return {
        message: response.data.message,
        result: response.data.result,
        status: response.status
      }; 
    } catch (error) {
      return handleError(error, navigate); 
    }
  },
};

export default UserOrganizationService;

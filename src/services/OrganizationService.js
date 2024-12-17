import api from "../services/api";
import handleError from "../utils/errorHandler"; 

const OrganizationService = {
    async getByApplicationId(applicationId, navigate) {
        try {
        const response = await api.get(`/organizations/application/${applicationId}`);
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
        const response = await api.post("/organizations", data);
        return {
            message: response.data.message,
            result: response.data.result,
            status: response.status
        };
        } catch (error) {
        return handleError(error, navigate)
        }
    },

    async getAll(navigate) {
        try {
        const response = await api.get(`/organizations/`);
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
        const response = await api.get(`/organizations/${id}`);
        return {
            message: response.data.message,
            result: response.data.result,
            status: response.status
        };
        } catch (error) {
        return handleError(error, navigate); 
        }
    },

    async allOrganizationAddresses(id, navigate) {
        try {
            const response = await api.get(`/organizations/${id}/addresses`);
            return {
                message: response.data.message,
                result: response.data.result,
                status: response.status
            };
        } catch (error) {
            return handleError(error, navigate)
        }
    },

    async addOrganizationAddress(id, data, navigate) {
        try {
            const response = await api.post(`/organizations/${id}/addresses`, data);
            return {
                message: response.data.message,
                result: response.data.result,
                status: response.status
            };
        } catch (error) {
            return handleError(error, navigate)
        }
    },

    async showOrganizationAddress(id, addressId, navigate) {
        try {
            const response = await api.get(`/organizations/${id}/addresses/${addressId}`);
            return {
                message: response.data.message,
                result: response.data.result,
                status: response.status
            };
        } catch (error) {
            return handleError(error, navigate)
        }
    },

    async deleteOrganizationAddress(id, addressId, navigate) {
        try {
            const response = await api.delete(`/organizations/${id}/addresses/${addressId}`);
            return {
                message: response.data.message,
                result: response.data.result,
                status: response.status
            };
        } catch (error) {
            return handleError(error, navigate)
        }
    },
    
    async updateOrganizationAddress(id, addressId, data, navigate) {
        try {
            const response = await api.put(`/organizations/${id}/addresses/${addressId}`, data);
            return {
                message: response.data.message,
                result: response.data.result,
                status: response.status
            };
        } catch (error) {
            return handleError(error, navigate)
        }
    },


    async allOrganizationContacts(id, navigate) {
        try {
            const response = await api.get(`/organizations/${id}/contacts`);
            return {
                message: response.data.message,
                result: response.data.result,
                status: response.status
            };
        } catch (error) {
            return handleError(error, navigate)
        }
    },
    async createOrganizationContact(id, data, navigate) {
        try {
            const response = await api.post(`/organizations/${id}/contacts`, data);
            return {
                message: response.data.message,
                result: response.data.result,
                status: response.status
            };
        } catch (error) {
            return handleError(error, navigate)
        }
    },
    async showOrganizationContact(id, contactId, navigate) {
        try {
            const response = await api.get(`/organizations/${id}/contacts/${contactId}`);
            return {
                message: response.data.message,
                result: response.data.result,
                status: response.status
            };
        } catch (error) {
            return handleError(error, navigate)
        }
    },
    async updateOrganizationContact(id, contactId, data, navigate) {
        try {
            const response = await api.put(`/organizations/${id}/contacts/${contactId}`, data);
            return {
                message: response.data.message,
                result: response.data.result,
                status: response.status
            };
        } catch (error) {
            return handleError(error, navigate)
        }
    },

    async deleteOrganizationContact(id, contactId, navigate) {
        try {
            const response = await api.delete(`/organizations/${id}/contacts/${contactId}`);
            return {
                message: response.data.message,
                result: response.data.result,
                status: response.status
            };
        } catch (error) {
            return handleError(error, navigate)
        }
    },

    async allOrganizationLocation(id, idAddress, navigate) {
        try {
            const response = await api.get(`/organizations/${id}/addresses/${idAddress}/locations`);
            return {
                message: response.data.message,
                result: response.data.result,
                status: response.status
            };
        } catch (error) {
            return handleError(error, navigate)
        }
    },
    async createOrganizationLocation(id, idAddress, data, navigate) {
        try {
            const response = await api.post(`/organizations/${id}/addresses/${idAddress}/locations`, data);
            return {
                message: response.data.message,
                result: response.data.result,
                status: response.status
            };
        } catch (error) {
            return handleError(error, navigate)
        }
    },
    async showOrganizationLocation(id, idAddress, idLocation, navigate) {
        try {
            const response = await api.get(`/organizations/${id}/addresses/${idAddress}/locations/${idLocation}`);
            return {
                message: response.data.message,
                result: response.data.result,
                status: response.status
            };
        } catch (error) {
            return handleError(error, navigate)
        }
    },
    async updateOrganizationLocation(id, idAddress, idLocation, data, navigate) {
        try {
            const response = await api.put(`/organizations/${id}/addresses/${idAddress}/locations/${idLocation}`, data);
            return {
                message: response.data.message,
                result: response.data.result,
                status: response.status
            };
        } catch (error) {
            return handleError(error, navigate)
        }
    },    
    async deleteOrganizationLocation(id, idAddress, idLocation, navigate) {
        try {
            const response = await api.delete(`/organizations/${id}/addresses/${idAddress}/locations/${idLocation}`);
            return {
                message: response.data.message,
                result: response.data.result,
                status: response.status
            };
        } catch (error) {
            return handleError(error, navigate)
        }
    },
    async update(id, data, navigate) {
        try {
        const response = await api.put(`/organizations/${id}`, data);
        return {
            message: response.data.message,
            result: response.data.result,
            status: response.status
        };
        } catch (error) {
        return handleError(error, navigate)
        }
    },

    async delete(id, navigate) {
        try {
        const response = await api.delete(`/organizations/${id}`);
        console.log(response)
        return {
            message: response.data.message,
            result: response.data.result,
            status: response.status
        };
        } catch (error) {
        return handleError(error, navigate)
        }
    }
};

export default OrganizationService;

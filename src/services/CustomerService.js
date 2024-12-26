import api from "./api";
import handleError from "../utils/errorHandler"; 
import qs from 'qs';
import { buildDynamicFilters } from "../utils/filterUtils";
const CustomerService = {
    async getAll (data,navigate) {
        const query = qs.stringify({
            filters: buildDynamicFilters(data),
            page:data.page, 
            perPage: data.perPage
        })
        try {
            const response = await api.get(`/customers/?${query}`);
            return {
                message: response.data.message,
                result: response.data.result,
                status: response.status
            };
        } catch (error) {
            return handleError(error, navigate); 
        }
    },

    async autocomplete(data, navigate) {
        try {
            const response = await api.get("/customers/autocomplete", {params: {name: data.user}});
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
            const response = await api.post("/customers", data);
            return {
                message: response.data.message,
                result: response.data.result,
                status: response.status
            };
        } catch (error) {
            return handleError(error, navigate)
        }
    },

    async addCustomerAddress(id, data, navigate) {
        try {
            const response = await api.post(`/customers/${id}/addresses`, data);
            return {
                message: response.data.message,
                result: response.data.result,
                status: response.status
            };
        } catch (error) {
            return handleError(error, navigate)
        }
    },

    async allSupplierAddress(id, navigate) {
        try {
            const response = await api.get(`/suppliers/${id}/addresses`);
            return {
                message: response.data.message,
                result: response.data.result,
                status: response.status
            };
        } catch (error) {
            return handleError(error, navigate)
        }
    },

    async getAllCustomerAddress(id, data, navigate) {
        try {
            const response = await api.get(`/customers/${id}/addresses/`, {params: {page: data.page, perPage: data.perPage}});
            return {
                message: response.data.message,
                result: response.data.result,
                status: response.status
            };
        } catch (error) {
            return handleError(error, navigate)
        }
    },

    async addCustomerContact(id, data, navigate) {
        try {
            const response = await api.post(`/customers/${id}/contacts`, data);
            return {
                message: response.data.message,
                result: response.data.result,
                status: response.status
            };
        } catch (error) {
            return handleError(error, navigate)
        }
    },

    async getAllCustomerContact(id, data, navigate) {
        try {
            const response = await api.get(`/customers/${id}/contacts/`, {params: {page: data.page, perPage: data.perPage}});
            return {
                message: response.data.message,
                result: response.data.result,
                status: response.status
            };
        } catch (error) {
            return handleError(error, navigate)
        }
    },
    async showCustomerAddress(id, customerId, navigate) {
        try {
            const response = await api.get(`/customers/${id}/addresses/${customerId}`);
            return {
                message: response.data.message,
                result: response.data.result,
                status: response.status
            };
        } catch (error) {
            return handleError(error, navigate)
        }
    },
    async showCustomerContact(id, contactId, navigate) {
        try {
            const response = await api.get(`/customers/${id}/contacts/${contactId}`);
            return {
                message: response.data.message,
                result: response.data.result,
                status: response.status
            };
        } catch (error) {
            return handleError(error, navigate)
        }
    },
    async updateCustomerContact(id, contactId, data, navigate) {
        try {
            const response = await api.put(`/customers/${id}/contacts/${contactId}`, data);
            return {
                message: response.data.message,
                result: response.data.result,
                status: response.status
            };
        } catch (error) {
            return handleError(error, navigate)
        }
    },
    async deleteCustomerContact(id, contactId, navigate) {
        try {
            const response = await api.delete(`/customers/${id}/contacts/${contactId}`);
            return {
                message: response.data.message,
                result: response.data.result,
                status: response.status
            };
        } catch (error) {
            return handleError(error, navigate)
        }
    },
    async updateCustomerAddress(id, addressesId, data, navigate) {
        try {
            const response = await api.put(`/customers/${id}/addresses/${addressesId}`, data);
            return {
                message: response.data.message,
                result: response.data.result,
                status: response.status
            };
        } catch (error) {
            return handleError(error, navigate)
        }
    },
    async deleteCustomerAddress(id, addressesId, navigate) {
        try {
            const response = await api.delete(`/customers/${id}/addresses/${addressesId}`);
            return {
                message: response.data.message,
                result: response.data.result,
                status: response.status
            };
        } catch (error) {
            return handleError(error, navigate)
        }
    },
    async getById(id, navigate) {
        try {
            const response = await api.get(`/customers/${id}`);
            return {
                message: response.data.message,
                result: response.data.result,
                status: response.status
            };
        } catch (error) {
            return handleError(error, navigate); 
        }
    },

    async update(id, data, navigate) {
        try {
            const response = await api.put(`/customers/${id}`, data);
            console.log(response)
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
            const response = await api.delete(`/suppliers/${id}`);
            return {
                message: response.data.message,
                result: response.data.result,
                status: response.status
            };
        } catch (error) {
            return handleError(error, navigate)
        }
    },
    async allCustomerLocation(id, idAddress, navigate) {
        try {
            const response = await api.get(`/customers/${id}/addresses/${idAddress}/locations`);
            return {
                message: response.data.message,
                result: response.data.result,
                status: response.status
            };
        } catch (error) {
            return handleError(error, navigate)
        }
    },
    async autocomplete (data,navigate) {
        try {
            const response = await api.get("/customers/autocomplete", {params: {name:data.name,page:data.page, perPage: data.perPage}});
            return {
                message: response.data.message,
                result: response.data.result,
                status: response.status
            };
        } catch (error) {
            return handleError(error, navigate); 
        }
    },
    async getAllCustomerLocation(id, idAddress, data, navigate) {
        try {
            const response = await api.get(`/customers/${id}/addresses/${idAddress}/locations/`, {params: {page: data.page, perPage:data.perPage}});
            return {
                message: response.data.message,
                result: response.data.result,
                status: response.status
            };
        } catch (error) {
            return handleError(error, navigate)
        }
    },
    async createCustomerLocation(id, idAddress, data, navigate) {
        try {
            const response = await api.post(`/customers/${id}/addresses/${idAddress}/locations`, data);
            return {
                message: response.data.message,
                result: response.data.result,
                status: response.status
            };
        } catch (error) {
            return handleError(error, navigate)
        }
    },
    async showCustomerLocation(id, idAddress, idLocation, navigate) {
        try {
            const response = await api.get(`/customers/${id}/addresses/${idAddress}/locations/${idLocation}`);
            return {
                message: response.data.message,
                result: response.data.result,
                status: response.status
            };
        } catch (error) {
            return handleError(error, navigate)
        }
    },
    async updateCustomerLocation(id, idAddress, idLocation, data, navigate) {
        try {
            const response = await api.put(`/customers/${id}/addresses/${idAddress}/locations/${idLocation}`, data);
            return {
                message: response.data.message,
                result: response.data.result,
                status: response.status
            };
        } catch (error) {
            return handleError(error, navigate)
        }
    },    
    async deleteCustomerLocation(id, idAddress, idLocation, navigate) {
        try {
            const response = await api.delete(`/customers/${id}/addresses/${idAddress}/locations/${idLocation}`);
            return {
                message: response.data.message,
                result: response.data.result,
                status: response.status
            };
        } catch (error) {
            return handleError(error, navigate)
        }
    },
};

export default CustomerService;

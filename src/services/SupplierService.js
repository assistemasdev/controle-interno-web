import api from "../services/api";
import handleError from "../utils/errorHandler"; 

const SupplierService = {
    async getAll (data,navigate) {
        try {
            const response = await api.get("/suppliers/", {params: {page:data.page, perPage: data.perPage}});
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
            const response = await api.post("/suppliers", data);
            return {
                message: response.data.message,
                result: response.data.result,
                status: response.status
            };
        } catch (error) {
            return handleError(error, navigate)
        }
    },

    async addSupplierAddress(id, data, navigate) {
        try {
            const response = await api.post(`/suppliers/${id}/addresses`, data);
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

    async getAllSupplierAddress(id, data, navigate) {
        try {
            const response = await api.get(`/suppliers/${id}/addresses/`, {params: {page: data.page, perPage: data.perPage}});
            return {
                message: response.data.message,
                result: response.data.result,
                status: response.status
            };
        } catch (error) {
            return handleError(error, navigate)
        }
    },

    async addSupplierContact(id, data, navigate) {
        try {
            const response = await api.post(`/suppliers/${id}/contacts`, data);
            return {
                message: response.data.message,
                result: response.data.result,
                status: response.status
            };
        } catch (error) {
            return handleError(error, navigate)
        }
    },

    async getAllSupplierContact(id, data, navigate) {
        try {
            const response = await api.get(`/suppliers/${id}/contacts/`, {params: {page: data.page, perPage: data.perPage}});
            return {
                message: response.data.message,
                result: response.data.result,
                status: response.status
            };
        } catch (error) {
            return handleError(error, navigate)
        }
    },
    async showSupplierAddress(id, addressesId, navigate) {
        try {
            const response = await api.get(`/suppliers/${id}/addresses/${addressesId}`);
            return {
                message: response.data.message,
                result: response.data.result,
                status: response.status
            };
        } catch (error) {
            return handleError(error, navigate)
        }
    },
    async showSupplierContact(id, contactId, navigate) {
        try {
            const response = await api.get(`/suppliers/${id}/contacts/${contactId}`);
            return {
                message: response.data.message,
                result: response.data.result,
                status: response.status
            };
        } catch (error) {
            return handleError(error, navigate)
        }
    },
    async updateSupplierContact(id, contactId, data, navigate) {
        try {
            const response = await api.put(`/suppliers/${id}/contacts/${contactId}`, data);
            return {
                message: response.data.message,
                result: response.data.result,
                status: response.status
            };
        } catch (error) {
            return handleError(error, navigate)
        }
    },
    async deleteSupplierContact(id, contactId, navigate) {
        try {
            const response = await api.delete(`/suppliers/${id}/contacts/${contactId}`);
            return {
                message: response.data.message,
                result: response.data.result,
                status: response.status
            };
        } catch (error) {
            return handleError(error, navigate)
        }
    },
    async updateSupplierAddress(id, addressesId, data, navigate) {
        try {
            const response = await api.put(`/suppliers/${id}/addresses/${addressesId}`, data);
            return {
                message: response.data.message,
                result: response.data.result,
                status: response.status
            };
        } catch (error) {
            return handleError(error, navigate)
        }
    },
    async deleteSupplierAddress(id, addressesId, navigate) {
        try {
            const response = await api.delete(`/suppliers/${id}/addresses/${addressesId}`);
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
            const response = await api.get(`/suppliers/${id}`);
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
            const response = await api.put(`/suppliers/${id}`, data);
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
    async allSupplierLocation(id, idAddress, navigate) {
        try {
            const response = await api.get(`/suppliers/${id}/addresses/${idAddress}/locations`);
            return {
                message: response.data.message,
                result: response.data.result,
                status: response.status
            };
        } catch (error) {
            return handleError(error, navigate)
        }
    },
    async getAllSupplierLocation(id, idAddress, data, navigate) {
        try {
            const response = await api.get(`/suppliers/${id}/addresses/${idAddress}/locations/`, {params: {page: data.page, perPage:data.perPage}});
            return {
                message: response.data.message,
                result: response.data.result,
                status: response.status
            };
        } catch (error) {
            return handleError(error, navigate)
        }
    },
    async createSupplierLocation(id, idAddress, data, navigate) {
        try {
            const response = await api.post(`/suppliers/${id}/addresses/${idAddress}/locations`, data);
            return {
                message: response.data.message,
                result: response.data.result,
                status: response.status
            };
        } catch (error) {
            return handleError(error, navigate)
        }
    },
    async showSupplierLocation(id, idAddress, idLocation, navigate) {
        try {
            const response = await api.get(`/suppliers/${id}/addresses/${idAddress}/locations/${idLocation}`);
            return {
                message: response.data.message,
                result: response.data.result,
                status: response.status
            };
        } catch (error) {
            return handleError(error, navigate)
        }
    },
    async updateSupplierLocation(id, idAddress, idLocation, data, navigate) {
        try {
            const response = await api.put(`/suppliers/${id}/addresses/${idAddress}/locations/${idLocation}`, data);
            return {
                message: response.data.message,
                result: response.data.result,
                status: response.status
            };
        } catch (error) {
            return handleError(error, navigate)
        }
    },    
    async deleteSupplierLocation(id, idAddress, idLocation, navigate) {
        try {
            const response = await api.delete(`/suppliers/${id}/addresses/${idAddress}/locations/${idLocation}`);
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

export default SupplierService;

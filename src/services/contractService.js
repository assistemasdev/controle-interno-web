import request from "../utils/request";

const contractService = {
    async fetchInfo(id, navigate = null) {
        return request("get", `/contracts/${id}/infos/`, {}, navigate);
    },

    async fetchContractEventById(id, eventId, navigate = null) {
        return request("get", `/contracts/${id}/events/${eventId}/`, {}, navigate);
    },

    async createContractEvent(id, data,navigate = null) {
        return request("post", `/contracts/${id}/events/`, data, navigate);
    },

    async updateContractEvent(id, eventId, data,navigate = null) {
        return request("put", `/contracts/${id}/events/${eventId}`, data, navigate);
    },

    async allContractEvents(id, navigate) {
        return request("get", `/contracts/${id}/events/`, {}, navigate)
    },

    async deleteContractEvent(id, eventId, navigate) {
        return request("delete", `/contracts/${id}/events/${eventId}`, {}, navigate)
    }
};

export default contractService;

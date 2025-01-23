import request from "../utils/request";

const contractService = {
    async fetchInfo(id, navigate = null) {
        return request("get", `/contracts/${id}/infos/`, {}, navigate);
    },

    async createContractEvent(id, data,navigate = null) {
        return request("post", `/contracts/${id}/events/`, data, navigate);
    }
};

export default contractService;

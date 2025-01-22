import request from "../utils/request";

const contractService = {
    async fetchInfo(id, navigate = null) {
        return request("get", `/contracts/${id}/infos/`, {}, navigate);
    }
};

export default contractService;

import request from "../utils/request";
import qs from 'qs';
import { buildDynamicFilters } from "../utils/filterUtils";

const baseService = {
    async autocomplete(entity, params, navigate = null) {
        return request("get", `/a/${entity}`, params, navigate);
    },

    async get(url, data, navigate = null) {
        const query = qs.stringify({
            filters: buildDynamicFilters(data),
            page: data.page,
            perPage: data.perPage,
        }, { encode: false });

        return request("get", `${url}/?${query}`, {}, navigate);
    },

    async getByColumn(url, navigate = null) {
        return request("get", `${url}`, {}, navigate);
    },

    async post(url, data, navigate = null) {
        return request("post", `${url}`, data, navigate);
    },

    async put(url, data, navigate = null) {
        return request("put", `${url}`, data, navigate);
    },

    async delete(url, navigate = null) {
        return request("delete", `${url}`, {}, navigate);
    }
};

export default baseService;

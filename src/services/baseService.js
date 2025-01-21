import request from "../utils/request";
import qs from 'qs';
import { buildDynamicFilters } from "../utils/filterUtils";

const baseService = {
    async autocomplete(entity, params, navigate = null) {
        return request("get", `/a/${entity}`, params, navigate);
    },

    async fetchAll(entity, data, navigate = null) {
        const query = qs.stringify({
            filters: buildDynamicFilters(data),
            page: data.page,
            perPage: data.perPage,
        }, { encode: false });
        
        return request("get", `/${entity}/?${query}`, {}, navigate);
    },

    async fetchEntityById(entity, id, navigate = null) {
        return request("get", `/${entity}/${id}`, {}, navigate);
    },

    async create(entity, data, navigate = null) {
        return request("post", `/${entity}`, data, navigate);
    },

    async update(entity, id, data, navigate = null) {
        return request("put", `/${entity}/${id}`, data, navigate);
    },

    async delete(entity, id, navigate = null) {
        return request("delete", `/${entity}/${id}`, {}, navigate);
    }
};

export default baseService;

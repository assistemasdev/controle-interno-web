import request from "../utils/request";
import qs from 'qs';
import { buildDynamicFilters } from "../utils/filterUtils";

const addressService = {
    async fetchAll(entity, entityId, data, navigate = null) {
        const query = qs.stringify({
            filters: buildDynamicFilters(data),
            page: data.page,
            perPage: data.perPage,
        }, { encode: false });
        
        return request("get", `/${entity}/${entityId}/addresses/?${query}`, {}, navigate);
    },

    async fetchAddressById(entity, entityId, id, navigate = null) {
        return request("get", `/${entity}/${entityId}/addresses/${id}`, {}, navigate);
    },

    async create(entity, entityId, data, navigate = null) {
        return request("post", `/${entity}/${entityId}/addresses`, data, navigate);
    },

    async update(entity, entityId, id, data, navigate = null) {
        return request("put", `/${entity}/${entityId}/addresses/${id}`, data, navigate);
    },

    async delete(entity, entityId, id, navigate = null) {
        return request("delete", `/${entity}/${entityId}/addresses/${id}`, {}, navigate);
    }
};

export default addressService;

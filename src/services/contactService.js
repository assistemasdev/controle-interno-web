import request from "../utils/request";
import qs from 'qs';
import { buildDynamicFilters } from "../utils/filterUtils";

const contactService = {
    async fetchAll(entity, entityId, data, navigate = null) {
        const query = qs.stringify({
            filters: buildDynamicFilters(data),
            page: data.page,
            perPage: data.perPage,
        }, { encode: false });
        
        return request("get", `/${entity}/${entityId}/contacts/?${query}`, {}, navigate);
    },

    async fetchContactById(entity, entityId, id, navigate = null) {
        return request("get", `/${entity}/${entityId}/contacts/${id}`, {}, navigate);
    },

    async create(entity, entityId, data, navigate = null) {
        return request("post", `/${entity}/${entityId}/contacts`, data, navigate);
    },

    async update(entity, entityId, id, data, navigate = null) {
        return request("put", `/${entity}/${entityId}/contacts/${id}`, data, navigate);
    },

    async delete(entity, entityId, id, navigate = null) {
        return request("delete", `/${entity}/${entityId}/contacts/${id}`, {}, navigate);
    }
};

export default contactService;

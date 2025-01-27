
import request from "../utils/request";
import qs from 'qs';
import { buildDynamicFilters } from "../utils/filterUtils";

const orderService = {
    async fetchAllOsItemsType(data, navigate = null) {
        const query = qs.stringify({
            filters: buildDynamicFilters(data),
            page: data.page,
            perPage: data.perPage,
        }, { encode: false });
        
        return request("get", `/orders/items/types/?${query}`, {}, navigate);
    },

    async removeOsItemType(id, navigate = null) {
        return request("delete", `/orders/items/types/${id}`, {}, navigate);
    },

    
    async createOsItemType(data, navigate = null) {
        return request("post", `/orders/items/types/`, data, navigate);
    },

    async fetchOsItemTypeById(id, navigate = null) {
        return request("get", `/orders/items/types/${id}`, {}, navigate);
    },


    async updateOsItemType(id, data, navigate = null) {
        return request("put", `/orders/items/types/${id}`, data, navigate);
    },

};

export default orderService;

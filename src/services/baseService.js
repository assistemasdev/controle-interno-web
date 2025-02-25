import request from "../utils/request";
import qs from 'qs';
import { buildDynamicFilters } from "../utils/filterUtils";

const baseService = {
    async autocomplete(entity, params, navigate = null) {
        let filters = params;
        console.log(entity)
        if (entity) {
            try {
                const module = await import(`../utils/filters/${entity}Filters.js`);
                if (module.default) {
                    filters = module.default(params);
                }
            } catch (error) {
                console.warn(`Nenhum filtro específico encontrado para ${entity}, usando filtro padrão.`);
            }
        }
        
        const query = qs.stringify({
            filters,
        }, { encode: false });
        return request("get", `/a/${entity}?${query}`,{}, navigate);
    },

    async get(url, data, entity = null, navigate = null) {
        let filters = buildDynamicFilters(data);
        if (entity) {
            try {
                const module = await import(`../utils/filters/${entity}Filters.js`);
                if (module.default) {
                    filters = module.default(data);
                }
            } catch (error) {
                console.warn(`Nenhum filtro específico encontrado para ${entity}, usando filtro padrão.`);
            }
        }
        
        const query = qs.stringify({
            filters,
            page: data.page,
            perPage: data.perPage,
        }, { encode: false });
        
        return request("get", `${url}/${query? '?'+query : ''}`, {}, navigate);
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

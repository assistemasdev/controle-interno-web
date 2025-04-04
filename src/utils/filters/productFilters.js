export default function productFilters(data) {
    const filters = {};
    Object.entries(data).forEach(([key, value]) => {
        if (key === 'deleted_at') {
            filters.deleted_at = value === false ? { $eq: null } : { $ne: null };
        } else if (key === 'status_id' && value) {
            filters.status_id = { $eq: value };
        } else if (key === 'id' && value) {
            if (Array.isArray(value)) {
                filters.id = { $in: value };  // Caso seja array, usa o operador $in
            } else {
                filters.id = { $eq: value };  // Caso seja um único valor, usa o operador $eq
            }     
        } else if (key === 'exclude_ids' && Array.isArray(value) && value.length > 0) {
            filters.id = { ...(filters.id || {}), $notIn: value }; // Adiciona exclusão ao ID existente
        } else {
            filters[key] = {$contains: value};
        }
    });
    return filters;
}

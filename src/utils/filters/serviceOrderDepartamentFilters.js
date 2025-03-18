export default function serviceOrderDepartamentFilters(data) {
    const filters = {};
    Object.entries(data).forEach(([key, value]) => {
        if (key === 'deleted_at') {
            filters.deleted_at = value === false ? { $eq: null } : { $ne: null };
        } else if (key === 'id' && value) {
            filters.id = { ...(filters.id || {}), $eq: value }; // Mantém outras condições do ID
        } else if (key === 'exclude_ids' && Array.isArray(value) && value.length > 0) {
            filters.id = { ...(filters.id || {}), $notIn: value }; // Adiciona exclusão ao ID existente
        } else {
            filters[key] = {$contains: value};
        }
    });
    return filters;
}

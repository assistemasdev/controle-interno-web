export default function serviceOrderFilters(data) {
    const filters = {};
    
    Object.entries(data).forEach(([key, value]) => {
        if (key === 'deleted_at') {
            filters.deleted_at = value === false ? { $eq: null } : { $ne: null };
        } else if (key === 'id' && value) {
            filters.id = { ...(filters.id || {}), $contains: value }; 
        } else if (key === 'exclude_ids' && Array.isArray(value) && value.length > 0) {
            filters.id = { ...(filters.id || {}), $notIn: value }; 
        } else if (key === 'status_id' && Array.isArray(value) && value.length > 0) {
            filters.status_id = { $in: value }; 
        } else {
            filters[key] = { $contains: value };
        }
    });
    
    return filters;
}
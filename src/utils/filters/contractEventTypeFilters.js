export default function contractEventTypeFilters(data) {
    const filters = {};

    if (!data.exclude_ids || (Array.isArray(data.exclude_ids) && data.exclude_ids.length === 0)) {
        data.exclude_ids = [1];
    }
    Object.entries(data).forEach(([key, value]) => {
        if (key === 'deleted_at') {
            filters.deleted_at = value === false ? { $eq: null } : { $ne: null };
        } else if (key === 'status_id' && value) {
            filters.status_id = { $eq: value };
        } else if (key === 'id' && value) {
            filters.id = { ...(filters.id || {}), $eq: value }; 
        } else if (key === 'exclude_ids' && Array.isArray(value) && value.length > 0) {
            filters.id = { ...(filters.id || {}), $notIn: value }; 
        } else {
            filters[key] = { $contains: value };
        }
    });
    return filters;
}

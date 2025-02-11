export default function productFilters(data) {
    const filters = {};

    Object.entries(data).forEach(([key, value]) => {
        if (key === 'deleted_at') {
            if (value === false) {
                filters.deleted_at = { $eq: null }; // Apenas registros não deletados
            } else if (value === true) {
                filters.deleted_at = { $ne: null }; // Apenas registros deletados
            }
        } else if (key === 'status_id' && value) {
            filters.status_id = { $eq: value }; // Apenas registros com o status_id informado
        }
    });

    return filters;
}

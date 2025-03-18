export default function contractEventTypeFilters(data) {
    const filters = {};
    console.log(data)
    // Se exclude_ids não estiver definido ou estiver vazio, define o valor [1] como padrão
    if (!data.exclude_ids || (Array.isArray(data.exclude_ids) && data.exclude_ids.length === 0)) {
        data.exclude_ids = [1];
    } else if (Array.isArray(data.exclude_ids) && !data.exclude_ids.includes(1)) {
        // Se exclude_ids não incluir 1, adiciona o valor 1
        data.exclude_ids.push(1);
    }

    // Agora, podemos adicionar exclude_ids ao filtro
    if (Array.isArray(data.exclude_ids) && data.exclude_ids.length > 0) {
        filters.id = { ...(filters.id || {}), $notIn: data.exclude_ids };
    }

    Object.entries(data).forEach(([key, value]) => {
        if (key === 'deleted_at') {
            filters.deleted_at = value === false ? { $eq: null } : { $ne: null };
        } else if (key === 'status_id' && value) {
            filters.status_id = { $eq: value };
        } else if (key === 'id' && value) {
            filters.id = { ...(filters.id || {}), $eq: value };
        } else if (key === 'exclude_ids') {
            // Já tratamos exclude_ids acima, então não precisa de mais nada aqui
        } else {
            filters[key] = { $contains: value };
        }
    });

    console.log(data.exclude_ids); // Para debug
    return filters;
}

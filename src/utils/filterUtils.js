/**
 * Função utilitária para construir filtros dinâmicos
 * @param {Object} data - Objeto contendo os dados para gerar os filtros
 * @returns {Object} Filtros construídos dinamicamente
 */
export function buildDynamicFilters(data) {
    const filters = {};
    const orFilters = []; // Para condições que precisam de OR lógico
    const filledInputs = data.filledInputs || 0; // Total de inputs preenchidos
    console.log(data)
    Object.entries(data).forEach(([key, value]) => {
        if (key === 'startDate' && value) {
            // Filtrar por data inicial (maior ou igual)
            filters.date = { ...(filters.date || {}), $gte: value };
        } else if (key === 'endDate' && value) {
            // Filtrar por data final (menor ou igual)
            filters.date = { ...(filters.date || {}), $lte: value };
        } else if (Array.isArray(value) && value.length > 0) {
            if (key === 'id' && filledInputs > 1) {
                // Aplicar $in para IDs
                filters[key] = { ...(filters[key] || {}), $in: value };
            } else if (key === 'idLike' && filledInputs > 1) {
                // Aplicar $contains para idLike
                filters.id = {
                    ...(filters.id || {}),
                    $contains: Array.isArray(filters.id?.$contains)
                        ? [...filters.id.$contains, ...value]
                        : value,
                };
            } else if (key === 'idLike' && filledInputs <= 1) {
                filters.id = {
                    ...(filters.id || {}),
                    $in: Array.isArray(filters.id?.$contains)
                        ? [...filters.id.$contains, ...value]
                        : value,
                };
            } else {
                // Adicionar condições ao $or para arrays de outros campos
                orFilters.push(...value.map((item) => ({ [key]: { $contains: item } })));
            }
        } else if (typeof value === 'string' && value.trim() !== '') {
            if (key === 'idLike') {
                // Adicionar $contains para idLike como string
                filters.id = { ...(filters.id || {}), $contains: value };
            } else {
                // Adicionar strings ao $or
                orFilters.push({ [key]: { $contains: value } });
            }
        }
    });

    // Se mais de um input preenchido, combinar AND logic
    if (filledInputs > 1) {
        // Combinar os filtros em um único objeto (AND logic)
        orFilters.forEach((condition) => {
            Object.assign(filters, condition);
        });

    } else if (orFilters.length > 0) {
        // Usar OR logic apenas se houver um único input preenchido
        filters.$or = orFilters;
    }


    return filters;
}

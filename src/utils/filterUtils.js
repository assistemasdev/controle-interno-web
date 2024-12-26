/**
 * Função utilitária para construir filtros dinâmicos
 * @param {Object} data - Objeto contendo os dados para gerar os filtros
 * @returns {Object} Filtros construídos dinamicamente
 */
export function buildDynamicFilters(data) {
    const filters = {};

    Object.entries(data).forEach(([key, value]) => {
        if (key === 'startDate' && value) {
            // Filtrar por data inicial (maior ou igual)
            filters.date = { ...(filters.date || {}), $gte: value };
        } else if (key === 'endDate' && value) {
            // Filtrar por data final (menor ou igual)
            filters.date = { ...(filters.date || {}), $lte: value };
        } else if (Array.isArray(value) && value.length > 0) {
            // Se for um array, aplique $in ou $or dependendo da chave
            if (key === 'id') {
                filters[key] = { $in: value };
            } else {
                filters.$or = value.map((item) => ({
                    [key]: { $contains: item },
                }));
            }
        } else if (typeof value === 'string' && value.trim() !== '') {
            // Se for uma string, aplique $contains
            filters[key] = { $contains: value };
        }
    });

    return filters;
}

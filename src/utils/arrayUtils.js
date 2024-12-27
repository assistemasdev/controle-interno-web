/**
 * Remove duplicatas de uma lista, priorizando itens com base em uma condição.
 *
 * @param {Array} items - A lista de itens a ser filtrada.
 * @param {String} uniqueKey - A chave única para identificar duplicatas (ex: "label").
 * @param {String} priorityKey - A chave que define a prioridade (ex: "numberFilter").
 * @returns {Array} - A lista filtrada com itens únicos e priorizados.
 */
export function removeDuplicatesWithPriority(items, uniqueKey, priorityKey) {
    return items.reduce((acc, item) => {
        const existingItem = acc.find((i) => i[uniqueKey] === item[uniqueKey]);
        if (!existingItem || item[priorityKey]) {
            console.log(item)
            return acc.filter((i) => i[uniqueKey] != item[uniqueKey]).concat(item);
        }
        return acc;
    }, []);
}

/**
 * Divide um array em pedaços menores.
 *
 * @param {Array} array - O array a ser dividido.
 * @param {Number} size - O tamanho de cada pedaço.
 * @returns {Array} - Um array contendo os pedaços do array original.
 */
export function chunkArray(array, size) {
    if (!Array.isArray(array) || size <= 0) {
        throw new Error("Parâmetros inválidos");
    }

    const result = [];
    for (let i = 0; i < array.length; i += size) {
        result.push(array.slice(i, i + size));
    }
    return result;
}

/**
 * Remove itens de um array com base em uma condição.
 *
 * @param {Array} array - O array a ser filtrado.
 * @param {Function} condition - Função de condição que retorna true para itens a serem removidos.
 * @returns {Array} - O array filtrado.
 */
export function removeByCondition(array, condition) {
    return array.filter((item) => !condition(item));
}

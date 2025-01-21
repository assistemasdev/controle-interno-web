export function removeDuplicatesWithPriority(items, uniqueKey, priorityKey) {
    return items.reduce((acc, item) => {
        const existingItemIndex = acc.findIndex((i) => i[uniqueKey] == item[uniqueKey]);

        if (existingItemIndex === -1) {
            acc.push(item);
        } else {
            acc[existingItemIndex][priorityKey] = true;
            acc[existingItemIndex].value = acc[existingItemIndex].label;

        }

        return acc;
    }, []);
}



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


export function removeByCondition(array, condition) {
    return array.filter((item) => !condition(item));
}

export const buildFilteredArray = (selectedItems, column, filterType, filterValue) => 
    selectedItems.filter(item => item.column === column && item[filterType] === filterValue)
                .map(item => item.value);
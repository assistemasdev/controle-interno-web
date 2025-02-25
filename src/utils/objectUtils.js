export const setDefaultFieldValues = (sections) => {
    return sections.reduce((acc, section) => {
        return section.fields.reduce((innerAcc, field) => {
            const [category, key] = field.id.split('.');
            if (key) {
                return {
                    ...innerAcc,
                    [category]: {
                        ...innerAcc[category],
                        [key]: ''
                    }
                }
            }

            return {...innerAcc, [field.id]: ''}
        }, acc)
    }, {});
};

export const formatResponse = (message, status, result) => {
    return {
        message,
        status,
        result
    }
};

export const removeEmptyValues = (obj) => {
    return Object.fromEntries(
        Object.entries(obj).filter(([key, value]) => value !== null && value !== '')
    );
};

export const transformValues = (array) => {
    if(!Array.isArray(array)) {
        return []
    }
    
    return array.map(item => {
        const modifiedItem = {};

        Object.keys(item).forEach(key => {
            const value = item[key];

            if (value && value.hasOwnProperty('value') && value.hasOwnProperty('label')) {
                modifiedItem[key] = value.value;
            } else {
                modifiedItem[key] = value;
            }
        });

        return modifiedItem;
    });
};
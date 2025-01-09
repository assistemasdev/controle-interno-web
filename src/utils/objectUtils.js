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

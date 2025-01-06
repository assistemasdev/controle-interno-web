import { useState } from 'react';

const useForm = (initialData) => {
    const [formData, setFormData] = useState(initialData);

    const handleChange = (fieldId, value) => {
        const [category, key] = fieldId.split('.');

        if (key) {
            setFormData((prev) => ({
                ...prev,
                [category]: {
                    ...prev[category],
                    [key]: value,
                },
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [fieldId]: value,
            }));
        }
    };

    const resetForm = () => {
        setFormData(initialData);
    };

    const initializeData = (fields) => {
        const initializedData = fields.reduce((acc, section) => {
            return section.fields.reduce((innerAcc, field) => {
                const [category, key] = field.id.split('.');
                if (key) {
                    return {
                        ...innerAcc,
                        [category]: {
                            ...innerAcc[category],
                            [key]: '',
                        },
                    };
                }
                return { ...innerAcc, [field.id]: '' };
            }, acc);
        }, { ...initialData });
        setFormData(initializedData);
    };

    const formatData = (response, fields) => {
        const parsedData = fields.reduce((acc, section) => {
            return section.fields.reduce((innerAcc, field) => {
                const [category, key] = field.id.split('.');
                if (key) {
                    return {
                        ...innerAcc,
                        [category]: {
                            ...innerAcc[category],
                            [key]: response[category]?.[key] || '',
                        },
                    };
                }
                return { ...innerAcc, [field.id]: response[field.id] || '' };
            }, acc);
        }, { ...initialData });
        setFormData(parsedData);
    };

    return {
        formData,
        setFormData,
        handleChange,
        resetForm,
        initializeData,
        formatData,
    };
};

export default useForm;

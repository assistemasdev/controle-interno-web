import { useState } from 'react';

const useForm = (initialData) => {
    const [formData, setFormData] = useState(initialData);

    const handleChange = (fieldId, value) => {
        setFormData((prev) => ({
            ...prev,
            [fieldId]: value,
        }));
    };

    const resetForm = () => {
        setFormData(initialData);
    };

    const initializeData = (fields) => {
        const initializedData = fields.reduce((acc, section) => {
            return section.fields.reduce((innerAcc, field) => {
                return { ...innerAcc, [field.id]: '' };
            }, acc);
        }, {});
        setFormData(initializedData);
    };

    const formatData = (response, fields) => {
        console.log(response, fields)

        const parsedData = fields.reduce((acc, section) => {
            return section.fields.reduce((innerAcc, field) => {
                return { ...innerAcc, [field.id]: response[field.id] || '' };
            }, acc);
        }, {});
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

import React, { useEffect } from 'react';
import InputField from '../components/InputField';
import Select from 'react-select';

const FormField = ({ field, value, onChange, placeholder, error, getOptions, getSelectedValue }) => {
    useEffect(() => {
        console.log(value)
    }, [])

    const handleChange = (selectedOption) => {
        if (field.isMulti) {
            const values = selectedOption ? selectedOption.map(option => option.value) : [];
            onChange(values);
        } else {
            onChange(selectedOption ? selectedOption.value : "");
        }
    };

    return (
        <div>
            {field.type === "text" || field.type === "textarea" || field.type === "email" || field.type === "color" || field.type === "password" || field.type === "number" || field.type === "date" ? (
                <InputField
                    label={field.label}
                    type={field.type}
                    id={field.id}
                    value={value || ""}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    error={error}
                />
            ) : (
                <>
                    <label htmlFor={field.id} className="font-weight-bold mt-1">
                        {field.label}
                    </label>
                    <Select
                        name={field.id}
                        isMulti={field.isMulti}
                        options={getOptions(field.id)}
                        className={`basic-multi-select ${error ? "is-invalid" : ""}`}
                        classNamePrefix="select"
                        value={getSelectedValue(field.id)}
                        onChange={handleChange}
                        noOptionsMessage={() => `Nenhuma opção encontrada para ${field.label}`}
                        placeholder={placeholder}
                    />
                    {error && (
                        <div className="invalid-feedback d-block">
                            {error}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default FormField;

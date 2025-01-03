import React from 'react';
import InputField from '../components/InputField';
import Select from 'react-select';

const FormSection = ({ 
    section, 
    formData, 
    handleFieldChange, 
    getOptions, 
    getSelectedValue, 
    formErrors 
}) => {
    return (
        <div>
            <hr />
            <h5>{section.section}</h5>
            <hr />
            <div className="form-row">
                {section.fields.map((field) => (
                    <div className="d-flex flex-column col-md-6" key={field.id}>
                        {field.type === "text" || field.type === "email" || field.type === "password" || field.type === "number" || field.type === "date" ? (
                            <InputField
                                label={field.label}
                                type={field.type}
                                id={field.id}
                                value={formData[field.id] || ""}
                                onChange={(e) => {
                                    if (e && e.target) {
                                        handleFieldChange(field.id, e.target.value, field);
                                    } else {
                                        console.warn(`Evento inválido para o campo ${field.id}`);
                                    }
                                }}
                                placeholder={field.placeholder}
                                error={formErrors[field.id]}
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
                                    className={`basic-multi-select ${formErrors[field.id] ? "is-invalid" : ""}`}
                                    classNamePrefix="select"
                                    value={getSelectedValue(field.id)}
                                    onChange={(selectedOption) => {
                                        if (field.isMulti) {
                                            const values = selectedOption ? selectedOption.map((option) => option.value) : [];
                                            handleFieldChange(field.id, values, field);
                                        } else {
                                            handleFieldChange(
                                                field.id,
                                                selectedOption ? selectedOption.value : "",
                                                field
                                            );
                                        }
                                    }}
                                    noOptionsMessage={() => `Nenhuma opção encontrada para ${field.label}`}
                                    placeholder={field.placeholder}
                                />
                                {formErrors[field.id] && (
                                    <div className="invalid-feedback d-block">
                                        {formErrors[field.id]}
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FormSection;

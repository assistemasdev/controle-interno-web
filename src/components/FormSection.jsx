import React, { useEffect, useMemo, useState } from 'react';
import InputField from '../components/InputField';
import Select from 'react-select';
import Button from './Button';

const FormSection = ({ 
    section, 
    formData, 
    handleFieldChange, 
    getOptions, 
    getSelectedValue, 
    formErrors 
}) => {
    const [count, setCount] = useState(section.count);
    const [fieldsData, setFieldsData] = useState([]);

    useEffect(() => {
        console.log(fieldsData)
    }, [fieldsData])
    useEffect(() => {
        setFieldsData(Array.from({ length: count }).map((_, index) => ({ id: `field-${index}` })));
    }, [count]);

    const handleSectionCount = (action) => {
        if (action === 'increment') {
            setCount(count + 1);
            setFieldsData([...fieldsData, { id: `field-${count}` }]);
        } else if (action === 'decrement' && count > 0) {
            const updatedFields = fieldsData.slice(0, -1);
            setFieldsData(updatedFields);
            setCount(count - 1);
        }
    };

    const handleRemoveField = (fieldIndex) => {
        const updatedFields = fieldsData.filter((_, index) => index !== fieldIndex);
        setFieldsData(updatedFields);
        setCount(updatedFields.length);
    };

    const flattenObject = (obj, parentKey = '', result = {}) => {
        for (let key in obj) {
            if (obj.hasOwnProperty(key)) {
                const newKey = parentKey ? `${parentKey}.${key}` : key;
                if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
                    flattenObject(obj[key], newKey, result);
                } else {
                    result[newKey] = obj[key];
                }
            }
        }
        return result;
    };

    const flatData = useMemo(() => flattenObject(formData), [formData]);

    return (
        <div>
            <hr />
            <div className='d-flex align-items-center justify-content-between'>
                <h5>{section.section}</h5>
                {section.array && (
                    <Button 
                        text="Adicionar Campos" 
                        className='btn btn-blue-light fw-semibold' 
                        onClick={() => handleSectionCount('increment')}
                    />
                )}
            </div>
            <hr />
            {section.array ? (
                count === 0 ? (
                    <div style={{ 
                        backgroundColor: '#F0E68C', 
                        padding: '10px', 
                        borderRadius: '5px', 
                        width: '100%', 
                        display: 'flex', 
                        justifyContent: 'center', 
                        alignItems: 'center' 
                    }}>
                        <h6>Clique em 'Adicionar Campos' para exibir os campos adicionais</h6>
                    </div>  
                ) : (
                    fieldsData.map((field, index) => (
                        <div className="form-row" key={field.id}>
                            <div className="d-flex justify-content-between align-items-center mb-3 w-100">
                                <span className="font-weight-bold">Campo #{index + 1}</span>
                                <button
                                    type="button"
                                    className="btn btn-danger btn-sm"
                                    onClick={() => handleRemoveField(index)}
                                >
                                    Remover
                                </button>
                            </div>
                            {section.fields.map((sectionField) => (
                                <div 
                                    className={`d-flex flex-column ${sectionField.fullWidth ? 'col-md-12' : 'col-md-6'}`} 
                                    key={sectionField.id}
                                >
                                    {sectionField.type === "textarea" ? (
                                        <>
                                            <label htmlFor={sectionField.id} className="font-weight-bold mt-1">
                                                {sectionField.label}
                                            </label>
                                            <textarea
                                                id={`${field.id}-${sectionField.id}`}
                                                className={`form-control ${formErrors[sectionField.id] ? "is-invalid" : ""}`}
                                                value={flatData[`${field.id}-${sectionField.id}`] || ""}
                                                onChange={(e) => handleFieldChange(`${field.id}-${sectionField.id}`, e.target.value, sectionField)}
                                                placeholder={sectionField.placeholder}
                                            />
                                            {formErrors[sectionField.id] && (
                                                <div className="invalid-feedback d-block">
                                                    {formErrors[sectionField.id]}
                                                </div>
                                            )}
                                        </>
                                    ) : sectionField.type === "text" || sectionField.type === "email" || sectionField.type === "color" || sectionField.type === "password" || sectionField.type === "number" || sectionField.type === "date" ? (
                                        <InputField
                                            label={sectionField.label}
                                            type={sectionField.type}
                                            id={`${field.id}-${sectionField.id}`}
                                            value={flatData[`${field.id}-${sectionField.id}`] || ""}
                                            onChange={(e) => handleFieldChange(`${field.id}-${sectionField.id}`, e.target.value, sectionField)}
                                            placeholder={sectionField.placeholder}
                                            error={formErrors[sectionField.id]}
                                        />
                                    ) : (
                                        <>
                                            <label htmlFor={sectionField.id} className="font-weight-bold mt-1">
                                                {sectionField.label}
                                            </label>
                                            <Select
                                                name={`${field.id}-${sectionField.id}`}
                                                isMulti={sectionField.isMulti}
                                                options={getOptions(sectionField.id)}
                                                className={`basic-multi-select ${formErrors[sectionField.id] ? "is-invalid" : ""}`}
                                                classNamePrefix="select"
                                                value={getSelectedValue(`${field.id}-${sectionField.id}`)}
                                                onChange={(selectedOption) => {
                                                    if (sectionField.isMulti) {
                                                        const values = selectedOption ? selectedOption.map((option) => option.value) : [];
                                                        handleFieldChange(`${field.id}-${sectionField.id}`, values, sectionField);
                                                    } else {
                                                        handleFieldChange(`${field.id}-${sectionField.id}`, selectedOption ? selectedOption.value : "", sectionField);
                                                    }
                                                }}
                                                noOptionsMessage={() => `Nenhuma opção encontrada para ${sectionField.label}`}
                                                placeholder={sectionField.placeholder}
                                            />
                                            {formErrors[sectionField.id] && (
                                                <div className="invalid-feedback d-block">
                                                    {formErrors[sectionField.id]}
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                    ))
                )
            ) : (
                <div className="form-row">
                    {section.fields.map((field) => (
                        <div className={`d-flex flex-column ${field.fullWidth ? 'col-md-12' : 'col-md-6'}`} key={field.id}>
                            {field.type === "textarea" ? (
                                <>
                                    <label htmlFor={field.id} className="font-weight-bold mt-1">
                                        {field.label}
                                    </label>
                                    <textarea
                                        id={field.id}
                                        className={`form-control ${formErrors[field.id] ? "is-invalid" : ""}`}
                                        value={flatData[field.id] || ""}
                                        onChange={(e) => handleFieldChange(field.id, e.target.value, field)}
                                        placeholder={field.placeholder}
                                    />
                                    {formErrors[field.id] && (
                                        <div className="invalid-feedback d-block">
                                            {formErrors[field.id]}
                                        </div>
                                    )}
                                </>
                            ) : field.type === "text" || field.type === "email" || field.type === "color" || field.type === "password" || field.type === "number" || field.type === "date" ? (
                                <InputField
                                    label={field.label}
                                    type={field.type}
                                    id={field.id}
                                    value={flatData[field.id] || ""}
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
            )}
        </div>
    );
};

export default FormSection;


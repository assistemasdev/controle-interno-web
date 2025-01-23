import React, { useEffect, useMemo, useState } from 'react';
import InputField from '../components/InputField';
import Select from 'react-select';
import Button from './Button';
import DynamicTable from './DynamicTable';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { v4 as uuidv4 } from 'uuid';

const FormSection = ({ 
    section, 
    formData, 
    setFormData = null,
    handleFieldChange, 
    getOptions, 
    getSelectedValue, 
    formErrors ,
    setFormErrors = null
}) => {
    const [fieldsData, setFieldsData] = useState([]);
    const [viewTable, setViewTable] = useState(false);
    const [headers, setHeaders] = useState([]);
    
    useEffect(() => {
        if (section.array) {
            const fields = section.fields;
            
            setFieldsData(fields.reduce((acc, currentValue) => {
                const column = currentValue.id.split('.')[1]
                return {
                    ...acc,
                    [column]: ''
                }
            }, { id: '' }));

            setHeaders(fields.reduce((acc, currentValue) => {
                const cleanedValue = currentValue.label.replace(/:/g, '');

                return [
                    ...acc,
                    cleanedValue
                ]
            }, ['ID']))
        }
    }, [section.array]);

 
    const handleEdit = (item) => {
        setViewTable(false)
        setFieldsData(item)
    }

    const handleDelete = (item) => {
        const key = section.fields[0].id.split('.')[0]
        setFormData((prev) => ({
            ...prev,
            [key]: prev[key].filter((currentItem) => currentItem.id !== item.id)
        }));
    }

    const addFieldsInData = (section) => {
        const key = section.fields[0].id.split('.')[0];
        const newFormErrors = {};
        let hasError = false;

        section.fields.forEach((field) => {
            if (fieldsData[field.id.split('.')[1]]) {
                delete formErrors[fieldsData[field.id.split('.')[1]]];
            }
        });

        section.fields.forEach((field) => {
            const fieldKey = `${key}.0.${field.id.split('.')[1]}`;
            if (!fieldsData[field.id.split('.')[1]] || fieldsData[field.id.split('.')[1]].trim() === "") {
                hasError = true;
                newFormErrors[fieldKey] = `O campo ${field.label} é obrigatório.`;
            }
        });
    
        if (hasError) {
            setFormErrors((prev) => ({
                ...prev,
                ...newFormErrors, 
            }));
            return; 
        }
    
        setFormErrors((prev) => {
            const updatedErrors = Object.keys(prev).reduce((acc, errorKey) => {
                if (!errorKey.startsWith(`${key}.0.`)) {
                    acc[errorKey] = prev[errorKey]; 
                }
                return acc;
            }, {});
            return updatedErrors;
        });
        
        if (fieldsData.id) {
            setFormData((prev) => ({
                ...prev,
                [key]: prev[key].some(item => item.id === fieldsData.id)
                    ? prev[key].map(item => 
                        item.id === fieldsData.id 
                            ? { ...item, ...fieldsData } 
                            : item
                      )
                    : [
                        ...prev[key],
                        fieldsData 
                      ]
            }));
            setFieldsData({});
            return
        }

        fieldsData.id = uuidv4();

        setFormData((prev) => ({
            ...prev,
            [key]: [
                ...prev[key],
                fieldsData
            ],
        }));
    
        setFieldsData({});
    };
    
    const handleArrayFieldChange = (fieldId, value, field) => {
        const column = fieldId.split('.')[1];
        setFieldsData(prev => ({
            ...prev,
            [column]: value
        }));
    };

    const handleViewTable = () => {
        setViewTable(!viewTable);
    };

    const actions = useMemo(() => [
            {
                id:'edit',
                icon: faEdit,
                title: 'Editar',
                buttonClass: 'btn-primary',
                permission: '',
                onClick: handleEdit
            },
            {
                id: 'delete',
                icon: faTrash,
                title: 'Excluir',
                buttonClass: 'btn-danger',
                permission: '',
                onClick: handleDelete
            },
    ], []);
    

    // const handleRemoveField = (fieldId) => {
    //     const updatedFields = fieldsData.filter((item) => item.id !== fieldId);
    //     setFieldsData(updatedFields);
    //     setCount(updatedFields.length);
    // };

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
                    <div className='d-flex '>
                        <Button 
                            text={`${viewTable? 'Ver campos' : 'Ver tabela'}`} 
                            className='btn btn-blue-light fw-semibold mr-2' 
                            onClick={() => handleViewTable()}
                        />
                        <Button 
                            text="Adicionar Campos" 
                            className='btn btn-blue-light fw-semibold' 
                            onClick={() => addFieldsInData(section)}
                            disabled={viewTable}
                        />
                    </div>
                )}
            </div>
            <hr />
            {section.array ? (
                viewTable? (
                    <>
                        <DynamicTable
                            headers={headers}
                            data={formData[section.fields[0].id.split('.')[0]]}
                            actions={actions}
                        />
                    </>
                ) : (
                    <div className='form-row'>
                        {section.fields.map((sectionField) => (
                            <div
                                className={`d-flex flex-column ${sectionField.fullWidth ? 'col-md-12' : 'col-md-6'}`}
                                key={sectionField.id}
                            >
                                {sectionField.type === "text" || sectionField.type === "textarea" || sectionField.type === "email" || sectionField.type === "color" || sectionField.type === "password" || sectionField.type === "number" || sectionField.type === "date" ? (
                                    <InputField
                                        label={sectionField.label}
                                        type={sectionField.type}
                                        id={`${sectionField.id}`}
                                        value={fieldsData[sectionField.id.split('.')[1]] || ""}
                                        onChange={(e) => handleArrayFieldChange(sectionField.id, e.target.value, sectionField)}
                                        placeholder={sectionField.placeholder}
                                        error={formErrors[`${sectionField.id.split('.')[0]}.0.${sectionField.id.split('.')[1]}`]}
                                    />
                                ) : (
                                    <>
                                        <label htmlFor={sectionField.id} className="font-weight-bold mt-1">
                                            {sectionField.label}
                                        </label>
                                        <Select
                                            name={`${sectionField.id}`}
                                            isMulti={sectionField.isMulti}
                                            options={getOptions(sectionField.id)}
                                            className={`basic-multi-select ${formErrors[sectionField.id] ? "is-invalid" : ""}`}
                                            classNamePrefix="select"
                                            value={getSelectedValue(sectionField.id)}
                                            onChange={(selectedOption) => {
                                                if (sectionField.isMulti) {
                                                    const values = selectedOption ? selectedOption.map(option => option.value) : [];
                                                    handleArrayFieldChange(sectionField.id, values, sectionField);
                                                } else {
                                                    handleArrayFieldChange(sectionField.id, selectedOption ? selectedOption.value : "", sectionField);
                                                }
                                            }}
                                            noOptionsMessage={() => `Nenhuma opção encontrada para ${sectionField.label}`}
                                            placeholder={sectionField.placeholder}
                                        />
                                        {formErrors[`${sectionField.id.split('.')[0]}.0.${sectionField.id.split('.')[1]}`] && (
                                            <div className="invalid-feedback d-block">
                                                {formErrors[`${sectionField.id.split('.')[0]}.0.${sectionField.id.split('.')[1]}`]}
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                )
            ) : (
                <div className="form-row">
                    {section.fields.map((field) => (
                        <div className={`d-flex flex-column ${field.fullWidth ? 'col-md-12' : 'col-md-6'}`} key={field.id}>
                            {field.type === "text" || field.type === "textarea" || field.type === "email" || field.type === "color" || field.type === "password" || field.type === "number" || field.type === "date" ? (
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


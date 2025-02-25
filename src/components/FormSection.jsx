import React, { useEffect, useMemo, useState } from 'react';
import InputField from '../components/InputField';
import Select from 'react-select';
import Button from './Button';
import DynamicTable from './DynamicTable';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { v4 as uuidv4 } from 'uuid';
import useNotification from '../hooks/useNotification';
import AutoCompleteInput from './AutoCompleteInput';
import FlatList from './FlatList';

const inputTypes = ["text", "textarea", "email", "color", "password", "number", "date"];

const getFormErrorKey = (sectionFieldId) => {
    const [category, field] = sectionFieldId.split('.');
    return `${category}.0.${field}`;
};

const getArrayFieldValue = (fieldId, fieldsData) => {
    const fieldKey = fieldId.split('.')[1];
    return fieldsData[fieldKey]?.value || "";
};

const getArrayColumnData = (fieldId, formDataFormatted) => {
    const fieldKey = fieldId.split('.')[0];
    return formDataFormatted[fieldKey] || [];
};

const FormSection = ({ 
    section, 
    formData, 
    setFormData = null,
    handleFieldChange, 
    getOptions, 
    getSelectedValue, 
    formErrors ,
    setFormErrors = null,
    setAllFieldsData = null,
    allFieldsData = null
}) => {
    const [fieldsData, setFieldsData] = useState([]);
    const [viewTable, setViewTable] = useState(false);
    const [headers, setHeaders] = useState([]);
    const [formDataFormated, setFormDatFormated] = useState({});
    const { showNotification } = useNotification();

    useEffect(() => {
        if (section.array) {
            const fields = section.fields;
            
            setFieldsData(fields.reduce((acc, currentValue) => {
                const column = currentValue.id.split('.')[1]
                return {
                    ...acc,
                    [column]: ''
                }
            }, { identify: '' }));

            setHeaders(fields.reduce((acc, currentValue) => {
                const cleanedValue = currentValue.label.replace(/:/g, '');

                return [
                    ...acc,
                    cleanedValue
                ]
            }, ['identify']))
        }
    }, [section.array]);

    const handleArraySelectChange = (selectedOption, sectionField) => {
        if (sectionField.isMulti) {
            const values = selectedOption 
                ? selectedOption.map(option => ({ value: option.value, label: option.label })) 
                : []; 
            handleArrayFieldChange(sectionField.id, values, sectionField);
        } else {
            handleArrayFieldChange(
                sectionField.id, 
                selectedOption ? { value: selectedOption.value, label: selectedOption.label } : "", 
                sectionField
            );
        }
    };

    const handleSelectFieldChange = (selectedOption, field) => {
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
    };
 
    const removeValueKey = () => {
        const field = section.fields[0].id.split('.')[0];
        if (Array.isArray(formData[field])) {
            const modifiedData = formData[field].map(currentValue => {
                const modifiedItem = {};
            
                Object.keys(currentValue).forEach(key => {
                    const value = currentValue[key];
            
                    if (value && value.hasOwnProperty('value') && value.hasOwnProperty('label')) {
                        modifiedItem[key] = value.label;
                    } else {
                        modifiedItem[key] = value;
                    }
                });
            
                return modifiedItem;
            });
    
            setFormDatFormated({
                ...formData,
                [field]: modifiedData
            })
    
        }
    };

    const handleEdit = (item) => {
        setViewTable(false)
        setFieldsData(item)
    }

    const handleDelete = (item) => {
        const key = section.fields[0].id.split('.')[0];

        setFormData((prev) => ({
            ...prev,
            [key]: prev[key].filter((currentItem) => currentItem.identify !== item.identify)
        }));
    };
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
            
            if (!field.notRequired && (!fieldsData[field.id.split('.')[1]] || fieldsData[field.id.split('.')[1]]?.toString().trim() === "")) {
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
        
        if (fieldsData.identify) {
            setFormData((prev) => ({
                ...prev,
                [key]: prev[key].some(item => item.identify === fieldsData.identify)
                    ? prev[key].map(item => 
                        item.id === fieldsData.identify 
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

        fieldsData.identify = uuidv4();
        if(key && formData) {
            setFormData((prev) => ({
                ...prev,
                [key]: [
                    ...prev[key],
                    fieldsData
                ],
            }));
        }
        setFieldsData({});

        showNotification('success', 'Dados adicionados na tabela')
    };
    
    const handleArrayFieldChange = (fieldId, value, field) => {
        const column = fieldId.split('.')[1];

        setFieldsData((prev) => {
            const newFieldsData = {
                ...prev,
                [column]: value
            };
            
            if (allFieldsData) {
                const sectionField = field.id.split('.')[0]
                setAllFieldsData((prev) => ({
                    ...prev,
                    [sectionField]: newFieldsData
                }));
            }

            return newFieldsData;
        });
    };
    // useEffect(() => {
    //     removeValueKey(formData);
    // }, [formData]);

    const getSelectedValueArrayField = (fieldId) => {
        const [category, key] = fieldId.split(".");
        if (key) {
            const value = fieldsData[key];
            if(!value) return null;
            return getOptions(fieldId).find((option) => option.value === value?.value) || null;
        }
        return null;
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

    useEffect(() => {
        console.log(fieldsData)
    } , [fieldsData])
    
    
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
            <div className='d-flex align-items-center justify-content-between'>
                <div className='d-flex align-items-end'>
                    <h5 
                        className='mb-0 text-dark fw-bold section-border' 
                    >
                        Seção: {section.section}
                    </h5>                
                </div>
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
            {section.array ? (
                viewTable? (
                    <>
                        <FlatList
                            headers={headers}
                            data={getArrayColumnData(section.fields[0].id, formData)}
                            actions={actions}
                        />
                    </>
                ) : (
                    <div className='form-row my-3'>
                        {section.fields.map((sectionField) => (
                            <div
                                className={`d-flex flex-column ${sectionField.fullWidth ? 'col-md-12' : 'col-md-6'}`}
                                key={sectionField.id}
                            >
                                {inputTypes.includes(sectionField.type) ? (
                                    <InputField
                                        label={sectionField.label}
                                        type={sectionField.type}
                                        id={`${sectionField.id}`}
                                        icon={sectionField.icon}
                                        value={getArrayFieldValue(sectionField.id, fieldsData)}
                                        onChange={(e) => handleArrayFieldChange(
                                            sectionField.id, 
                                            { value: e.target.value, label: e.target.value },  
                                            sectionField
                                          )}
                                        placeholder={sectionField.placeholder}
                                        error={formErrors[getFormErrorKey(sectionField.id)]}
                                    />
                                ) : (
                                    <>
                                        <label htmlFor={sectionField.id} className="font-weight-bold mt-1">
                                            {sectionField.label}
                                        </label>
                                        
                                        {sectionField.entity ? (
                                            <AutoCompleteInput
                                                entity={sectionField.entity}
                                                column={sectionField.column}
                                                columnLabel={sectionField.columnLabel}
                                                columnDetails={sectionField.columnDetails}
                                                placeholder={sectionField.placeholder}
                                                isMulti={sectionField.isMulti}
                                                value={fieldsData?.[sectionField.id.split('.')[1]]?.value || ''}
                                                onChange={(selectedOption) => handleArraySelectChange(selectedOption, sectionField)}
                                            />
                                        ) : (
                                            <Select
                                                name={`${sectionField.id}`}
                                                isMulti={sectionField.isMulti}
                                                options={getOptions(sectionField.id)}
                                                className={`basic-multi-select ${formErrors[sectionField.id] ? "is-invalid" : ""}`}
                                                classNamePrefix="select"
                                                value={getSelectedValueArrayField(sectionField.id)}
                                                onChange={(selectedOption) => handleArraySelectChange(selectedOption, sectionField)}
                                                noOptionsMessage={() => `Nenhuma opção encontrada para ${sectionField.label}`}
                                                placeholder={sectionField.placeholder}
                                            />
                                        )}

                                        {formErrors[getFormErrorKey(sectionField.id)] && (
                                            <div className="invalid-feedback d-block">
                                                {formErrors[getFormErrorKey(sectionField.id)]}
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                )
            ) : (
                <div className="form-row my-3">
                    {section.fields.map((field) => (
                        <div className={`d-flex flex-column ${field.fullWidth ? 'col-md-12' : 'col-md-6'}`} key={field.id}>
                            {inputTypes.includes(field.type) ? (
                                <InputField
                                    label={field.label}
                                    type={field.type}
                                    id={field.id}
                                    value={flatData[field.id] || ""}
                                    icon={field.icon}
                                    onChange={(e) => {
                                        if (e && e.target) {
                                            handleFieldChange(field.id, e.target.value, field);
                                        }
                                    }}
                                    placeholder={field.placeholder}
                                    error={formErrors[field.id]}
                                    disabled={field.disabled}
                                />
                            ) : (
                                <>
                                    <label htmlFor={field.id} className="font-weight-bold mt-1">
                                        {field.label}
                                    </label>
                                    
                                    {field.entity ? (
                                        <AutoCompleteInput
                                            entity={field.entity}
                                            column={field.column}
                                            columnLabel={field.columnLabel}
                                            columnDetails={field.columnDetails}
                                            placeholder={field.placeholder}
                                            onChange={(selectedOption) => handleSelectFieldChange(selectedOption, field)} 
                                            value={flatData[field.id]}
                                        />
                                    ) : (
                                        <Select
                                            name={field.id}
                                            isMulti={field.isMulti}
                                            options={getOptions(field.id)}
                                            className={`basic-multi-select ${formErrors[field.id] ? "is-invalid" : ""}`}
                                            classNamePrefix="select"
                                            value={getSelectedValue(field.id)}
                                            onChange={(selectedOption) => handleSelectFieldChange(selectedOption, field)}
                                            noOptionsMessage={() => `Nenhuma opção encontrada para ${field.label}`}
                                            placeholder={field.placeholder}
                                        />
                                    )}
                                    
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


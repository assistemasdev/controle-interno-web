import React, { useEffect, useMemo } from "react";
import FlatList from "../FlatList";
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import InputField from "../InputField";
import AutoCompleteInput from "../AutoCompleteInput";
import Select from "react-select";

const inputTypes = ["text", "textarea", "email", "color", "password", "number", "date", "checkbox"];

const TableBody = ({ section, viewTable, setViewTable, formData, setFormData, headers, fieldsData, setFieldsData, allFieldsData, setAllFieldsData, formErrors, getOptions }) => {

    const getFormErrorKey = (sectionFieldId) => {
        if (!sectionFieldId) return [];
        const [category, key] = sectionFieldId.split('.');
        return [category, key];
    };

    const columnHeaderObject = section.fields[0].id.split('.')[0];

    const handleArrayFieldChange = (fieldId, value, field) => {
        const [key, column] = fieldId.split('.')

        setFieldsData((prev) => {
            const newFieldsData = {
                ...prev,
                [key]: {
                    ...prev[key],
                    [column]: value
                }
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

    const getArrayFieldValue = (fieldId, fieldsData) => {
        const [key, column] = fieldId.split('.');
        return fieldsData[key] && fieldsData[key][column] ? fieldsData[key][column].value || "" : "";
    };

    const getArrayColumnData = (fieldId, formDataFormatted) => {
        if (!formDataFormatted) return [];

        const fieldKey = fieldId.split('.')[0];

        return formDataFormatted[fieldKey] || [];
    };

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

    const getSelectedValueArrayField = (fieldId) => {
        const [category, key] = fieldId.split(".");
        if (category && fieldsData[category]) {  
            const value = fieldsData[category][key];
            if (value) {  
                return getOptions ? getOptions(fieldId).find((option) => option.value === value?.value) : null;
            }
        }
        return null;
    };

    const handleEdit = (item) => {
        setViewTable(prevState => ({
            ...prevState,
            [section.section]: false,  
        }));
        const key = section.fields[0].id.split('.')[0]

        setFieldsData(prev => ({
            ...prev,
            [key]: item 
        }));
    };

    const handleDelete = (item) => {
        const key = section.fields[0].id.split('.')[0];

        setFormData((prev) => {
            const updatedData = prev[key].filter((currentItem) => currentItem.identify !== item.identify);

            const indexToRemove = prev[key].findIndex((currentItem) => currentItem.identify === item.identify);

            setFieldsData((prevFields) => {
                const updatedExcludeIds = { ...prevFields.exclude_ids };

                Object.keys(updatedExcludeIds).forEach((fieldKey) => {
                    if (updatedExcludeIds[fieldKey] && Array.isArray(updatedExcludeIds[fieldKey])) {
                        updatedExcludeIds[fieldKey] = updatedExcludeIds[fieldKey].filter((_, index) => index !== indexToRemove);
                    }
                });

                return {
                    ...prevFields,
                    exclude_ids: updatedExcludeIds
                };
            });

            return {
                ...prev,
                [key]: updatedData
            };
        });
    };

    const actions = useMemo(() => [
        {
            id: 'edit',
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

   

    if (!viewTable[section.section]) {
        return (
            <div className='form-row my-3'>
                {section.fields?.map((sectionField) => (
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
                                disabled={sectionField.disabled}
                                value={getArrayFieldValue(sectionField.id, fieldsData)}
                                onChange={(e) => handleArrayFieldChange(
                                    sectionField.id, 
                                    { value: e.target.value, label: e.target.value },  
                                    sectionField
                                )}
                                placeholder={sectionField.placeholder}
                                error={formErrors[getFormErrorKey(sectionField.id)[0]] ? formErrors[getFormErrorKey(sectionField.id)[0]][getFormErrorKey(sectionField.id)[1]] : null}
                            />
                        ) : (
                            <>
                                <label htmlFor={sectionField.id} className="font-weight-bold mt-1">
                                    {sectionField.label}
                                </label>
                                
                                {sectionField.entity ? (
                                    <>
                                        <AutoCompleteInput
                                            entity={sectionField.entity}
                                            column={sectionField.column}
                                            columnLabel={sectionField.columnLabel}
                                            columnDetails={sectionField.columnDetails}
                                            placeholder={sectionField.placeholder}
                                            isMulti={sectionField.isMulti}
                                            value={fieldsData?.[sectionField.id.split('.')[0]]?.[sectionField.id.split('.')[1]] || ''}
                                            onChange={(selectedOption) => {
                                                handleArraySelectChange(selectedOption, sectionField);
                                            }}                                        
                                            exclude_ids={sectionField.isUnique? fieldsData?.exclude_ids?.[sectionField.id.split('.')[1]] : []}
                                            disabled={sectionField.disabled}
                                            filters={fieldsData?.filters?.[sectionField.id.split('.')[0]]?.[sectionField.id.split('.')[1]] || {}}
                                        />
                                    </>
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

                                {formErrors[getFormErrorKey(sectionField.id)[0]] && formErrors[getFormErrorKey(sectionField.id)[0]][getFormErrorKey(sectionField.id)[1]] && (
                                    <div className="invalid-feedback d-block">
                                        {formErrors[getFormErrorKey(sectionField.id)[0]][getFormErrorKey(sectionField.id)[1]]}
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                ))}
            </div>
        );
    }

    return (
        <FlatList
            headers={headers}
            data={getArrayColumnData(section.fields[0].id, formData)}
            actions={actions}
            columnHeader={columnHeaderObject}
        />
    );
};

export default TableBody;

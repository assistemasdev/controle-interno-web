import React, { useEffect } from "react";
import AutoCompleteInput from "../AutoCompleteInput";
import Select from 'react-select';

const FieldWithSelectOrAutoComplete = ({ 
    field, 
    formData, 
    formErrors, 
    handleSelectFieldChange, 
    getOptions, 
    getSelectedValue 
}) => {
    
    const [category, key] = field.id.split('.')

    return (
        <div className="d-flex flex-column">
            <label htmlFor={field.id} className="font-weight-bold mt-1">
                {field.label}
            </label>

            {field.entity ? (
                <AutoCompleteInput
                    entity={field.entity}
                    column={field.column}
                    columnLabel={field.columnLabel}
                    columnDetails={field.columnDetails}
                    isMulti={field.isMulti}
                    placeholder={field.placeholder}
                    disabled={field.disabled}
                    onChange={(selectedOption) => handleSelectFieldChange(selectedOption, field)} 
                    value={formData[category] && formData[category][key] !== undefined ? formData[category][key] : formData[field.id] || ""}
                    exclude_ids={formData.exclude_ids ? formData.exclude_ids[category]?.[key] : []}
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
        </div>
    );
};

export default FieldWithSelectOrAutoComplete;

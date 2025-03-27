import React, { useMemo } from "react";
import InputField from "../InputField";
import AutoCompleteInput from "../AutoCompleteInput";
import Select from "react-select";

const inputTypes = ["text", "textarea", "email", "color", "password", "number", "date"];

const SimpleForm = ({
    section,
    formData,
    handleFieldChange,
    getOptions,
    getSelectedValue,
    formErrors = {},
}) => {
    const flattenObject = (obj, parentKey = "", result = {}) => {
        Object.entries(obj).forEach(([key, value]) => {
            const newKey = parentKey ? `${parentKey}.${key}` : key;
            if (typeof value === "object" && value !== null && !Array.isArray(value)) {
                flattenObject(value, newKey, result);
            } else {
                result[newKey] = value;
            }
        });
        return result;
    };

    // const flatData = useMemo(() => flattenObject(formData), [formData]);

    const handleSelectFieldChange = (selectedOption, field) => {
        const value = field.isMulti
            ? selectedOption?.map(option => option.value) || []
            : selectedOption?.value || "";
        handleFieldChange(field.id, value, field);
    };

    const renderTextField = (field, value) => (
        <div key={field.id} className={`d-flex flex-column ${field.fullWidth ? "col-md-12" : "col-md-6"}`}>
            <InputField
                label={field.label}
                type={field.type}
                id={field.id}
                value={value}
                icon={field.icon}
                onChange={(e) => handleFieldChange(field.id, e.target.value, field)}
                placeholder={field.placeholder}
                error={formErrors[field.id]}
                disabled={field.disabled}
            />
        </div>
    );

    const renderSelectField = (field, value) => (
        <div key={field.id} className={`d-flex flex-column ${field.fullWidth ? "col-md-12" : "col-md-6"}`}>
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
                onChange={(selectedOption) => handleSelectFieldChange(selectedOption, field)}
                noOptionsMessage={() => `Nenhuma opção encontrada para ${field.label}`}
                placeholder={field.placeholder}
            />

            {formErrors[field.id] && <div className="invalid-feedback d-block">{formErrors[field.id]}</div>}
        </div>
    );

    const renderAutoCompleteField = (field, value) => (
        <div key={field.id} className={`d-flex flex-column ${field.fullWidth ? "col-md-12" : "col-md-6"}`}>
            <label htmlFor={field.id} className="font-weight-bold mt-1">
                {field.label}
            </label>
            <AutoCompleteInput
                entity={field.entity}
                column={field.column}
                columnLabel={field.columnLabel}
                columnDetails={field.columnDetails}
                placeholder={field.placeholder}
                onChange={(selectedOption) => handleSelectFieldChange(selectedOption, field)}
                value={value}
                disabled={field.disabled}
            />

            {formErrors[field.id] && <div className="invalid-feedback d-block">{formErrors[field.id]}</div>}
        </div>
    );

    return (
        <div>
            <div className="d-flex align-items-center justify-content-between">
                <h5 className="mb-0 text-dark fw-bold section-border">
                    Seção: {section.section}
                </h5>
            </div>

            <div className="form-row my-3">
                {section.fields.map((field) => {
                    const fieldValue = formData[field.id.split('.')[0]]?.[field.id.split('.')[1]] || "";
                    if (inputTypes.includes(field.type)) {
                        return renderTextField(field, fieldValue);
                    } else if (field.entity) {
                        return renderAutoCompleteField(field, fieldValue);
                    } else {
                        return renderSelectField(field, fieldValue);
                    }
                })}
            </div>
        </div>
    );
};

export default SimpleForm;

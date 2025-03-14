import React, { useEffect } from "react";
import InputField from "../InputField";
import FieldWithSelectOrAutoComplete from "./FieldWithSelectOrAutoComplete";

const inputTypes = ["text", "textarea", "email", "color", "password", "number", "date", "checkbox"];

const SimpleBody = ({ fields, formErrors, formData, handleFieldChange, getOptions, getSelectedValue }) => {

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

    return (
        <div className="form-row my-3">
            {fields.map((field) => {
                const [category, key] = field.id.split('.')
                return (
                    <div 
                        className={`d-flex flex-column ${field.fullWidth ? 'col-md-12' : 'col-md-6'}`} 
                        key={field.id}
                    >
                        {inputTypes.includes(field.type) ? (
                            <InputField
                                label={field.label}
                                type={field.type}
                                id={field.id}
                                value={formData[category] && formData[category][key] !== undefined ? formData[category][key] : formData[field.id] || ""}
                                icon={field.icon}
                                onChange={(e) => {
                                    if (e && e.target) {
                                        handleFieldChange(field.id, e.target.value, field);
                                    }
                                }}
                                placeholder={field.placeholder}
                                error={formErrors[category] && formErrors[category][key] !== undefined ? formErrors[category][key] : formErrors[field.id] || ""}
                                disabled={field.disabled}
                            />
                        ) : (
                            <FieldWithSelectOrAutoComplete 
                                field={field} 
                                formData={formData} 
                                formErrors={formErrors} 
                                handleSelectFieldChange={handleSelectFieldChange}
                                getOptions={getOptions}
                                getSelectedValue={getSelectedValue}
                            />
                        )}
                    </div>
                );
            })}
        </div>

    );
};

export default SimpleBody;

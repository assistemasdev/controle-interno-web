import React, { useEffect } from "react";
import InputField from "../InputField";
import AutoCompleteInput from "../AutoCompleteInput";
import Select from "react-select";
import { FaTrash } from "react-icons/fa";

const inputTypes = ["text", "textarea", "email", "color", "password", "number", "date", "checkbox", "file"];

const FieldList = ({
    section = [],
    values = {},
    index = 0,
    setValues = () => {},
    formErrors = {},
    getOptions = () => [],
    handleFileFieldChange = () => {},
    excludeIds = {},
    filters = {},
    fieldsData = [],
    setFieldsData = () => {},
    onDelete = () => {},
}) => {
    const parseFieldId = (fieldId) => {
        const match = fieldId.match(/^([^\.\[]+)(\[\d+\])?\.(.+)$/);
        if (!match) return [];
        return [match[1], match[3]];
    };

    const normalizeValue = (val) => {
        if (typeof val === 'object' && val !== null && 'value' in val) return val;
        if (typeof val === 'string' || typeof val === 'number') return { value: val, label: val };
        return { value: '', label: '' };
    };

    const handleFieldChange = (fieldId, value, sectionId) => {
        const [, column] = parseFieldId(fieldId);
    
        if (!Array.isArray(fieldsData.items)) return;
        setValues((prev) => {
            const updated = [...(prev || [])];
            updated[index] = {
                ...updated[index],
                [column]: value
            };
            return updated;
        });
    
        setFieldsData((prev) => {
            const updatedItems = [...(prev.items || [])];
            updatedItems[index] = {
                ...updatedItems[index],
                [column]: value
            };
    
            return {
                ...prev,
                items: updatedItems
            };
        });
    };

    const getValue = (fieldId) => {
        const [, column] = parseFieldId(fieldId);
        if (fieldsData?.items?.[index]?.[column]) {
            return normalizeValue(fieldsData.items[index][column]);
        }

        return normalizeValue(values?.[index]?.[column]);
    };

    const getSelectedValue = (fieldId, field) => {
        const [, column] = parseFieldId(fieldId);
        const value = fieldsData?.items?.[index]?.[column] ?? values?.[index]?.[column];

        if (field.isMulti && Array.isArray(value)) {
            return getOptions(fieldId).filter(option =>
                value.some(val => val.value === option.value)
            );
        }

        if (!field.isMulti && value) {
            return getOptions(fieldId).find(option => option.value === value.value) || null;
        }

        return field.isMulti ? [] : null;
    };

    return (
        <div className='d-flex flex-column gap-2 my-2'>

            <div className="d-flex flex-wrap gap-3">
                {section.fields.map((field) => {
                    const [column, key] = parseFieldId(field.id);

                    const columnError = `${column}.${index}.${key}`
                    const error = formErrors?.[columnError];

                    return (
                        <div key={field.id} className="d-flex flex-column" style={{ minWidth: "250px", flex: "1" }}>
                            {inputTypes.includes(field.type) ? (
                                <InputField
                                    label={field.label}
                                    type={field.type}
                                    id={field.id}
                                    icon={field.icon}
                                    disabled={field.disabled}
                                    value={getValue(field.id)?.value || ''}
                                    onChange={(e) =>
                                        field.type === "file"
                                            ? handleFileFieldChange(field.id, e, field)
                                            : handleFieldChange(field.id, { value: e.target.value, label: e.target.value })
                                    }
                                    placeholder={field.placeholder}
                                    error={error}
                                />
                            ) : (
                                <>
                                    <label htmlFor={field.id} className="font-weight-bold mt-1">{field.label}</label>
                                    {field.entity ? (
                                        <AutoCompleteInput
                                            entity={field.entity}
                                            column={field.column}
                                            columnLabel={field.columnLabel}
                                            columnDetails={field.columnDetails}
                                            placeholder={field.placeholder}
                                            isMulti={field.isMulti}
                                            value={getValue(field.id)}
                                            onChange={(selectedOption) => {
                                                const value = field.isMulti
                                                    ? (selectedOption?.map(opt => ({ value: opt.value, label: opt.label })) || [])
                                                    : (selectedOption || '');
                                                handleFieldChange(field.id, value);
                                            }}
                                            exclude_ids={field.isUnique ? excludeIds?.[key] : []}
                                            disabled={field.disabled}
                                            filters={filters?.[index]?.[key] || {}}
                                        />
                                    ) : (
                                        <Select
                                            name={field.id}
                                            isMulti={field.isMulti}
                                            options={getOptions(field.id)}
                                            className={`basic-multi-select ${error ? "is-invalid" : ""}`}
                                            classNamePrefix="select"
                                            value={getSelectedValue(field.id, field)}
                                            onChange={(selectedOption) => {
                                                const value = field.isMulti
                                                    ? (selectedOption?.map(opt => ({ value: opt.value, label: opt.label })) || [])
                                                    : (selectedOption || '');
                                                handleFieldChange(field.id, value);
                                            }}
                                            noOptionsMessage={() => `Nenhuma opção encontrada para ${field.label}`}
                                            placeholder={field.placeholder}
                                            isDisabled={field.disabled}
                                        />
                                    )}
                                    {error && <div className="invalid-feedback d-block">{error}</div>}
                                </>
                            )}
                        </div>
                    );
                })}

                <div className="d-flex align-items-end" style={{ minWidth: "50px" }}>
                    <button
                        type="button"
                        className="btn btn-danger p-2 d-flex align-items-center justify-content-center"
                        onClick={() => onDelete(index)}
                        style={{ height: "38px", width: "38px" }}
                        title="Excluir"
                    >
                        <FaTrash size={16} />
                    </button>
                </div>
            </div>


        </div>
    );
};

export default FieldList;

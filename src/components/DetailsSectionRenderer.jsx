import React from 'react';
import InputField from '../components/InputField';
import Button from './Button';

const resolveFieldValue = (formData, fieldId) => {
    if (fieldId.includes('.')) {
        const [parentKey, childKey] = fieldId.split('.');
        return formData[parentKey]?.[childKey] || formData[childKey] || '';
    }
    
    return formData[fieldId] || '';
};

const DetailsSectionRenderer = ({ sections, formData, handleBack }) => {
    return (
        <div className="row p-3 rounded shadow-sm">
            {sections.map((section) => (
                <div key={section.section} className="form-section mb-4">
                    <hr />
                    <h5 className="text-dark font-weight-bold">{section.section}</h5>
                    <hr />
                    <div className="form-row">
                        {section.fields.map((field) => {
                            const value = resolveFieldValue(formData, field.id);

                            return (
                                <div
                                    key={field.id}
                                    className={`d-flex flex-column ${field.fullWidth ? 'col-md-12' : 'col-md-6'}`}
                                >
                                    {field.type === "textarea" ? (
                                        <>
                                            <label htmlFor={field.id} className="font-weight-bold mt-1">
                                                {field.label}
                                            </label>
                                            <textarea
                                                id={field.id}
                                                className={`form-control`}
                                                value={value || "-"}
                                                placeholder={field.placeholder}
                                                disabled={field.disabled !== false}
                                            />
                                        </>
                                    ) : (
                                        <InputField
                                            label={field.label}
                                            id={field.id}
                                            value={value || "-"}
                                            type={field.type}
                                            placeholder={field.placeholder}
                                            disabled={field.disabled !== false}
                                        />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            ))}

            {handleBack && (
                <div className="form-row gap-2">
                    <Button
                        type="button"
                        text="Voltar"
                        className="btn btn-blue-light fw-semibold"
                        onClick={handleBack}
                    />
                </div>
            )}
        </div>
    );
};

export default DetailsSectionRenderer;

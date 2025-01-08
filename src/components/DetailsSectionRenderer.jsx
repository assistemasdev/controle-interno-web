import React from 'react';
import InputField from '../components/InputField';

const resolveFieldValue = (formData, fieldId) => {
    if (fieldId.includes('.')) {
        const [parentKey, childKey] = fieldId.split('.');
        return formData[parentKey]?.[childKey] || formData[childKey] || '';
    }
    return formData[fieldId] || '';
};


const DetailsSectionRenderer = ({ sections, formData }) => {
    return (
        <div className="row">
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
                                    <InputField
                                        label={field.label}
                                        id={field.id}
                                        value={value}
                                        type={field.type}
                                        placeholder={field.placeholder}
                                        disabled={field.disabled !== false}
                                    />
                                </div>
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default DetailsSectionRenderer;

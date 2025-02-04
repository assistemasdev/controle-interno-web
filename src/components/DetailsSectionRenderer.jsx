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
        <div className='p-3 mt-2 rounded shadow-sm'>
            {sections.map((section, index) => (
                <div key={section.section}>
                    <div className='d-flex align-items-end justify-content-between'>
                        <h5 
                            className='mb-0 text-dark fw-bold section-border' 
                        >
                            Seção: {section.section}
                        </h5>      
                        {handleBack && index == 0 && (
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
                    <div className="form-row my-3">
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
                                        value={value || "-"}
                                        type={field.type}
                                        icon={field.icon}
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

import React from "react";
import Button from "../Button";
import FlatList from "../FlatList";

const renderArrayContent = (section, viewTable, formData, headers, actions, children) => {
    const getArrayColumnData = (fieldId, formDataFormatted) => {
        const fieldKey = fieldId.split('.')[0];
        return formDataFormatted[fieldKey] || [];
    };

    if (!viewTable) {
        return (
            <div className='form-row my-3'>
                {children}
            </div>
        )
    };
    
    
    return (
        <FlatList
            headers={headers}
            data={getArrayColumnData(section.fields[0].id, formData)}
            actions={actions}
        />
    );
};

const renderNonArrayContent = (section) => (
    <p>Conteúdo para não arrays</p>
);

const SectionBody = ({ section, viewTable, formData, headers, actions, children }) => {
    if (!section) return null;

    return (
        <div>
            {section.array ? renderArrayContent(section, viewTable, formData, headers, actions, children) : renderNonArrayContent(section)}
        </div>
    );
};

export default SectionBody;

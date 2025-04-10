import React from "react";
import Button from "../Button";

const SectionHeader = ({ section, addFieldsInData, viewTable, setViewTable }) => {

    const handleViewTable = () => {
        setViewTable(prevState => ({
            ...prevState,
            [section.section]: !prevState[section.section],
        }));
    };

    return (
        <div className='d-flex align-items-center justify-content-between'>
            <div className='d-flex align-items-end'>
                <h5 className='mb-0 text-dark fw-bold section-border'>
                    Seção: {section.section}
                </h5>
            </div>

            <div className='d-flex gap-2'>
                {section.array && (
                    <>
                        <Button
                            text={`${viewTable[section.section] ? 'Ver campos' : 'Ver tabela'}`}
                            className='btn btn-blue-light fw-semibold'
                            onClick={handleViewTable}
                        />
                        <Button
                            text="Adicionar Campos"
                            className='btn btn-blue-light fw-semibold'
                            onClick={() => addFieldsInData(section)}
                            disabled={viewTable[section.section]}
                        />
                    </>
                )}
            </div>
        </div>
    );
};

export default SectionHeader;

import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { useOrgan } from '../hooks/useOrgan';

const DynamicTable = ({ headers, data, actions, currentPage, totalPages, onPageChange }) => {
    const { selectedOrgan } = useOrgan();
    const organColor = selectedOrgan ? selectedOrgan.color : '#343a40';
    const [isCollapsed, setIsCollapsed] = useState(false);

    const generatePageNumbers = () => {
        const pages = [];
        for (let i = 1; i <= totalPages; i++) {
            pages.push(i);
        }
        return pages;
    };

    const toggleCollapse = () => {
        setIsCollapsed((prev) => !prev);
    };

    return (
        <div className="p-3 mt-2 rounded shadow-sm mb-2 table-background">
            {/* Cabeçalho com Seta */}
            <div className="d-flex justify-content-between align-items-center">
                <button
                    className="btn btn-sm"
                    style={{ color: organColor }}
                    onClick={toggleCollapse}
                >
                    <FontAwesomeIcon icon={isCollapsed ? faChevronDown : faChevronUp} />
                </button>
            </div>

            {/* Corpo da Tabela */}
            {!isCollapsed && (
                <>
                    <table className="table table-striped mt-2 table-theme">
                        <thead>
                            <tr>
                                {headers.map((header, index) => (
                                    <th scope="col" className="text-dark" key={index}>{header}</th>
                                ))}
                                <th scope="col" className="text-dark">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.length > 0 ? (
                                data.map((item, index) => (
                                    <tr key={index}>
                                        {Object.values(item).map((value, idx) => (
                                            <td className="align-middle" key={idx}>{value}</td>
                                        ))}
                                        <td className="align-middle">
                                            {actions.map((action, idx) => (
                                                <button
                                                    key={idx}
                                                    className={`btn btn-sm ${action.buttonClass} btn-tooltip mr-1`}
                                                    title={action.title}
                                                    onClick={() => action.onClick(item)}
                                                >
                                                    <FontAwesomeIcon icon={action.icon} />
                                                </button>
                                            ))}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={headers.length + 1} className="text-center">Não há dados disponíveis.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    {/* Paginação */}
                    <div className="d-flex justify-content-center align-items-center mt-3">
                        <button
                            className="btn btn-sm mx-1"
                            style={{ color: organColor, border: `1px solid ${organColor}` }}
                            onClick={() => 
                                onPageChange(currentPage - 1) 
                            }
                            disabled={currentPage === 1}
                        >
                            Anterior
                        </button>
                        {generatePageNumbers().map((page) => (
                            <button
                                key={page}
                                className={`btn btn-sm mx-1`}
                                style={{
                                    backgroundColor: currentPage === page ? organColor : 'transparent',
                                    color: currentPage === page ? '#FFF' : organColor,
                                    border: `1px solid ${organColor}`
                                }}
                                onClick={() => 
                                    {
                                        onPageChange(page)
                                    }}
                            >
                                {page}
                            </button>
                        ))}
                        <button
                            className="btn btn-sm mx-1"
                            style={{ color: organColor, border: `1px solid ${organColor}` }}
                            onClick={() => onPageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                        >
                            Próximo
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default DynamicTable;

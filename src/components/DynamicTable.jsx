import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { useOrgan } from '../hooks/useOrgan';
import '../assets/styles/NestedCheckboxSelector/index.css';

const DynamicTable = ({ headers, data, actions, currentPage, totalPages, onPageChange, filters ,setFilters }) => {
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

    const handleStatus = (status) => {
        setFilters(prev => ({
            ...prev,
            deleted_at: !status
        }))
    };

    useEffect(() => {
        if(onPageChange && filters) {
            onPageChange(filters);
        }
    }, [filters])

    const toggleCollapse = () => {
        setIsCollapsed((prev) => !prev);
    };

    return (
        <div className="p-3 mt-2 rounded shadow-sm mb-2 table-background">
            {/* Cabeçalho com Seta */}
            <div className="d-flex justify-content-between align-items-center flex-wrap">
                <button
                    type="button"
                    className="btn btn-sm"
                    style={{ color: organColor }}
                    onClick={toggleCollapse}
                >
                    <FontAwesomeIcon icon={isCollapsed ? faChevronDown : faChevronUp} />
                </button>

                {filters && (
                    <div>
                        <div className="checkbox-container" style={{ width: '150px'}}>
                            <div className="box-switch">
                                <div className="switch status">
                                    <input
                                        type="checkbox"
                                        value={filters.deleted_at}
                                        onChange={() => handleStatus(filters.deleted_at)}
                                        id="active"
                                        checked={filters.deleted_at}
                                    />
                                </div>
                            </div>
                            <div className="label">
                                <p className='text-dark font-bold'>
                                    Ativos/Inativos
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Corpo da Tabela */}
            {!isCollapsed && (
                <>
                    <table className="table table-striped mt-2">
                        <thead>
                            <tr>
                                {headers.map((header, index) => (
                                    <th scope="col" className="text-dark" key={index}>{header}</th>
                                ))}

                                {actions && (
                                    <th scope="col" className="text-dark">Ações</th>
                                )}
                                    
                            </tr>
                        </thead>
                        <tbody>
                            {data.length > 0 ? (
                                data.map((item, index) => (
                                    <tr key={index}>
                                        {Object.values(item).map((value, idx) => {
                                            if (!value.toString().includes('delete')) {
                                                return (
                                                <td className="align-middle" key={idx}>
                                                    {value}
                                                </td>
                                                );
                                            }
                                            return null;
                                        })}
                                        <td className="align-middle">
                                            {actions && item.deleted_at? (
                                                actions.filter(action => {
                                                    const deletedAt = item.deleted_at.split('-')[1];
                                                    if (action.condition !== undefined && !action.condition(item)) {
                                                        return false;
                                                    }
                                                    if (action.id === 'delete' && deletedAt != 'null') {
                                                        return false;
                                                    }
                                                    if (action.id === 'activate' && deletedAt == 'null') {
                                                        return false; 
                                                    }
                                                    return true; 
                                                })
                                                .map((action, idx) => (
                                                    <button
                                                        key={idx}
                                                        type="button"
                                                        className={`btn btn-sm ${action.buttonClass} btn-tooltip  mr-1`}
                                                        title={action.title}
                                                        onClick={() => action.onClick(item, action.id)}
                                                    >
                                                        <FontAwesomeIcon icon={action.icon} />
                                                    </button>
                                                ))
                                            ) : (
                                                actions
                                                .map((action, idx) => (
                                                    <button
                                                        key={idx}
                                                        type="button"
                                                        className={`btn btn-sm ${action.buttonClass} btn-tooltip mr-1`}
                                                        title={action.title}
                                                        onClick={() => action.onClick(item, action.id)}
                                                    >
                                                        <FontAwesomeIcon icon={action.icon} />
                                                    </button>
                                                ))
                                            )}
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
                    {currentPage &&(
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
                                            setFilters(prev => ({
                                                ...prev,
                                                page
                                            }))
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
                    )}
                </>
            )}
        </div>
    );
};

export default DynamicTable;

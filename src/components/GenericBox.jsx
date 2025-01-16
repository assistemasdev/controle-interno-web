import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../assets/styles/NestedCheckboxSelector/index.css';
import Switch from './Switch';

const GenericBox = ({ 
    key,
    item,
    subItems, 
    handleChange,
    formData,
    isAllSelected,
    iconPrimary,
    iconSecundary
}) => {
    return (
        <>
            <div className="box d-flex flex-column mb-2" key={key}>
                <div className="box-application mb-2">
                    <div className="box-title">
                        <FontAwesomeIcon icon={iconPrimary}/>
                        <span>Aplicação: </span>
                    </div>
                    <div className="input-checkbox">
                        <p>
                            {item.name}
                        </p>
                    </div>
                </div>
                <div>
                    <div className="d-flex align-items-center justify-center">
                        <FontAwesomeIcon icon={iconSecundary}/>
                        <p className='secundary-title' style={{marginBottom: 0, marginLeft: '5px'}}>Organizações:</p>
                    </div>
                    {subItems.map((subItem) => (
                        <Switch
                            key={subItem.id}
                            label={subItem.name}
                            id={`secundary-${item.id}-${subItem.id}`}
                            value={subItem.id}
                            onChange={handleChange}
                            checked={formData[item.id][subItem.id]}
                        />
                    ))}
                </div>
                <div className="box-button">
                    <button
                        className="btn btn-blue-light"
                        type="button"
                        onClick={handleChange}
                        id={`primary-${item.id}`}
                    >
                        {isAllSelected(item.id) ? "Desmarcar Todos" : "Selecionar Todos"}
                    </button>
                </div>
            </div>
        </>
    );
};

export default GenericBox;


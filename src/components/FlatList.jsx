import React from "react";
import "../assets/styles/flatlist/index.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faIdCard } from '@fortawesome/free-solid-svg-icons';

const FlatList = ({ headers, data, actions, columnHeader }) => {
    if (!data || !Array.isArray(data) || data.length === 0) {
        return <p className="flatlist-empty">Nenhum dado disponível</p>;
    }

    return (
        <div className="container-flatlist">
            {data.map((item, index) => {
                const itemKey = item.id || Math.random();

                return (
                    <div key={itemKey} className="flatlist-card">
                        <div className="container-flatlist-title">
                            <h5>
                                <FontAwesomeIcon icon={faIdCard} /> <strong>Identificador: </strong>{item.identify?.label || "Sem identificação"}
                            </h5>
                            <div className="container-flatlist-icons">
                                {actions.map((action, actionIndex) => (
                                    <button
                                        key={actionIndex}
                                        type="button"
                                        className={`btn btn-sm ${action.buttonClass} btn-tooltip`}
                                        title={action.title}
                                        onClick={() => {
                                            action.onClick(item, action.id);
                                        }}
                                    >
                                        <FontAwesomeIcon icon={action.icon} />
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="container-flatlist-item">
                            {headers[columnHeader].map((header, headerIndex) => {
                                const key = Object.keys(item)[headerIndex];
                                let value = item[key];

                                if (Array.isArray(value)) {
                                    value = value.map(v => v.label || v.value || v).join(", ");
                                } else if (value && (value.label || value.value)) {
                                    value = value.label || value.value;
                                }

                                if (!value) return null; 

                                return (
                                    <p className="flatlist-item-box" key={headerIndex}>
                                        <strong>{header}:</strong> {value}
                                    </p>
                                );
                            })}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default FlatList;

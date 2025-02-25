import React, { useEffect } from "react";
import "../assets/styles/flatlist/index.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const FlatList = ({ headers, data, actions }) => {
    const renderData = () => {
        if (!data || data.length === 0) {
            return <p className="flatlist-empty">Nenhum dado disponível</p>;
        }

        const keys = Object.keys(data[0]);

        return data.map((item) => (
            <div key={item.identify || item.id || Math.random()}>
                <div className="container-flatlist-title">
                    <h5>Identificador: {item.identify || "Sem identificação"}</h5>
                    <div className="container-flatlist-icons">
                        {actions.map((action, indiceAction) => (
                            <button
                                key={indiceAction}
                                type="button"
                                className={`btn btn-sm ${action.buttonClass} btn-tooltip mr-1`}
                                title={action.title}
                                onClick={() => action.onClick(item, action.id)}
                            >
                                <FontAwesomeIcon icon={action.icon} />
                            </button>
                        ))}
                    </div>
                </div>
                <div className="container-flatlist-item">
                    {headers.map((header, index) => {
                        if (header === 'identify') return null;

                        const value = item[keys[index]]?.label || 'Valor não disponível';

                        return (
                            <p className="flatlist-item-box" key={index}>
                                {header}: {value}
                            </p>
                        );
                    })}
                </div>
            </div>
        ));
    };

    return (
        <div className="container-flatlist">
            {renderData()}
        </div>
    );
};

export default FlatList;

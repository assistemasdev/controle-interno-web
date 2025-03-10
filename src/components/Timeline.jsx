import React from "react";
import '../assets/styles/timeline/index.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faCalendarAlt, faCheckCircle } from '@fortawesome/free-solid-svg-icons';

const Status = ({ deletedAt }) => {
    const isActive = deletedAt.split('-')[1] === 'null';
    return (
        <div className={`small-status ${isActive ? 'active' : 'inactive'}`}>
            <FontAwesomeIcon icon={faCheckCircle} />
            <p>{isActive ? 'Ativo' : 'Inativo'}</p>
        </div>
    );
};

const Timeline = ({ data, actions }) => {
    const getFilteredActions = (item) => {
        return actions?.filter(action => {
            const deletedAt = item.deleted_at.split('-')[1];
            if ((action.id === 'delete' && deletedAt !== 'null') || (action.id === 'activate' && deletedAt === 'null')) {
                return false;
            }
            return true;
        });
    };

    return (
        <div className="timeline">
            {data.map((item, index) => {
                const filteredActions = getFilteredActions(item);
                return (
                    <div key={index} className={`container-timeline ${index % 2 === 0 ? 'left-container' : 'right-container'}`}>
                        <div className="icon-chevron">
                            <FontAwesomeIcon icon={faChevronDown} />
                        </div>
                        <div className="text-box-timeline">
                            <div className="text-box-timeline-title">
                                <h2>{item.title}</h2>
                                <div className="text-box-timeline-title-actions">
                                    {filteredActions?.map((action, idx) => (
                                        <button
                                            key={idx}
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

                            <small>
                                <div className="small-date">
                                    <FontAwesomeIcon icon={faCalendarAlt} />
                                    {new Date(item.date).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                </div>
                                <Status deletedAt={item.deleted_at} />
                            </small>
                            <p dangerouslySetInnerHTML={{ __html: item.description }}></p> 
                            <span className={`${index % 2 === 0 ? 'left-container-arrow' : 'right-container-arrow'}`}></span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default Timeline;

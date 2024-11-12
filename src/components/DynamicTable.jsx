import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const DynamicTable = ({ headers, data, actions }) => {
  return (
    <div className="p-3 mt-2 rounded shadow-sm mb-2" style={{ backgroundColor: '#FFFFFF' }}>
      <table className="table table-striped">
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
    </div>
  );
};

export default DynamicTable;

import React from 'react';
import '../assets/styles/NestedCheckboxSelector/index.css';

const Switch = ({ id, value, onChange, checked, label, key }) => {
  return (
    <div className="checkbox-container"  key={key}>
            <div className="label">
                <p>
                    {label}
                </p>
            </div>
        <div className="box-switch">
            <div className="switch">
                <input
                type="checkbox"
                value={value}
                onChange={onChange}
                id={id}
                checked={checked}
                />
            </div>
        </div>
    </div>
  );
};

export default Switch;

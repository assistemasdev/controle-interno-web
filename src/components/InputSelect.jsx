import React from 'react';

const InputSelect = ({ label, id, value, onChange, options, placeholder, error }) => {
  return (
    <div className="d-flex flex-column py-1">
      {label && <label htmlFor={id} className="form-label text-dark font-weight-bold">{label}</label>}
      
      <select
        id={id}
        className={`form-select ${error ? 'is-invalid' : ''}`} 
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      >
        <option value="">{placeholder}</option>
        {options && options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      
      {error && <div className="invalid-feedback">{error}</div>}
    </div>
  );
};

export default InputSelect;

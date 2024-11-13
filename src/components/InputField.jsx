import React from 'react';

const InputField = ({ label, id, value, onChange, placeholder, type = 'text', error }) => {
  return (
    <div className="d-flex flex-column py-1 ">
      {label && <label htmlFor={id} className="form-label text-dark font-weight-bold">{label}</label>}
      <input
        type={type}
        id={id}
        className={`form-control ${error ? 'is-invalid' : ''}`} 
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
      {error && <div className="invalid-feedback">{error}</div>}
    </div>
  );
};

export default InputField;

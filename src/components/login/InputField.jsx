import React from 'react';

const InputField = ({ type, id, placeholder, value, onChange, error }) => {
  return (
    <div className="form-group">
      <input
        type={type}
        className={`form-control form-control-user ${error ? 'is-invalid' : ''}`} 
        id={id}
        placeholder={placeholder}
        onChange={onChange}
      />
      {error && <div className="invalid-feedback">{error}</div>}
    </div>
  );
};

export default InputField;
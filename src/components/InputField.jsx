import React from 'react';

const InputField = ({ label, id, value, onChange, placeholder, type = 'text' }) => {
  return (
    <div className="d-flex flex-column py-1 ">
      {label && <label htmlFor={id} className="form-label text-dark font-weight-bold">{label}</label>}
      <input
        type={type}
        id={id}
        className="form-control"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
    </div>
  );
};

export default InputField;

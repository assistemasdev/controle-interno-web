import React from 'react';

const InputField = ({ type, id, placeholder, onChange }) => {
  return (
    <div className="form-group">
      <input
        type={type}
        className="form-control form-control-user"
        id={id}
        placeholder={placeholder}
        onChange={onChange}
      />
    </div>
  );
};

export default InputField;
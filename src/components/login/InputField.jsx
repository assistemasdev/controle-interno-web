import React, { useState } from 'react';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const InputField = ({ type, id, placeholder, value, onChange, error }) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <div className="form-group" style={{ position: 'relative' }}>
      <input
        type={isPasswordVisible ? 'text' : type}  
        className={`form-control form-control-user ${error ? 'is-invalid' : ''}`}
        id={id}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
      {type === 'password' && (  
        <FontAwesomeIcon
          icon={isPasswordVisible ? faEyeSlash : faEye}
          onClick={togglePasswordVisibility}
          style={{
            position: 'absolute',
            right: '15px',
            top: '50%',
            transform: 'translateY(-50%)',
            cursor: 'pointer',
          }}
        />
      )}
      {error && <div className="invalid-feedback">{error}</div>}
    </div>
  );
};

export default InputField;

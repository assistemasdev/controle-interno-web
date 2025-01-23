import React, { useState } from 'react';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const InputField = ({
    label,
    id,
    value,
    onChange,
    placeholder,
    type = 'text',
    error,
    disabled = false
}) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const togglePasswordVisibility = () => {
        setIsPasswordVisible((prev) => !prev);
    };

    const renderInputField = () => {
        if (type === 'textarea') {
            return (
                <textarea
                    id={id}
                    className={`form-control ${error ? 'is-invalid' : ''} rounded input-theme`}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    disabled={disabled}
                />
            );
        }

        return (
            <div className="input-group position-relative">
                <input
                    type={isPasswordVisible ? 'text' : type}  
                    id={id}
                    className={`form-control ${error ? 'is-invalid' : ''} rounded input-theme`}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    disabled={disabled}
                />

                {type === 'password' && (
                    <button
                        type="button"
                        className="input-group-text position-absolute"
                        onClick={togglePasswordVisibility}
                        style={{ right: '10px', top: '50%', transform: 'translateY(-50%)' }}
                    >
                        <FontAwesomeIcon icon={isPasswordVisible ? faEyeSlash : faEye} />
                    </button>
                )}
                {error && <div className="invalid-feedback">{error}</div>}
            </div>
        );
    };

    return (
        <div className="d-flex flex-column py-1">
            {label && <label htmlFor={id} className="form-label font-weight-bold">{label}</label>}
            {renderInputField()}
        </div>
    );
};

export default InputField;

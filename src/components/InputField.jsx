import React, { useState } from 'react';
import { faEye, faEyeSlash, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const InputField = ({
    label,
    id,
    value,
    onChange,
    placeholder,
    type = 'text',
    error,
    disabled = false,
    icon
}) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const togglePasswordVisibility = () => {
        setIsPasswordVisible((prev) => !prev);
    };

    const renderInputField = () => {
        if (type === 'textarea') {
            return (
                <div className="position-relative">
                    {/* Icon */}
                    <FontAwesomeIcon 
                        icon={icon} 
                        className="input-icon"
                        style={{
                            position: 'absolute', 
                            top: '50%', 
                            left: '10px', 
                            transform: 'translateY(-50%)',
                        }}
                    />

                    {/* Textarea */}
                    <textarea
                        id={id}
                        className={`form-control ${error ? 'is-invalid' : ''} rounded input-theme`}
                        value={value}
                        onChange={onChange}
                        placeholder={placeholder}
                        disabled={disabled}
                        style={{ paddingLeft: '2.5rem' }}
                    />
                </div>
            );
        }

        if (type === 'checkbox') {
            return (
                <div className="form-check d-flex align-items-center">
                    {/* Checkbox */}
                    <input
                        type="checkbox"
                        id={id}
                        className={`form-check-input ${error ? 'is-invalid' : ''}`}
                        checked={value}
                        onChange={onChange}
                        disabled={disabled}
                        style={{
                            width: '20px',
                            height: '20px',
                            borderRadius: '5px', // Rounded checkbox
                            marginRight: '10px',
                        }}
                    />
                </div>
            );
        }

        return (
            <div className="position-relative">
                {/* Icon */}
                <FontAwesomeIcon 
                    icon={icon} 
                    className="input-icon"
                    style={{
                        position: 'absolute', 
                        top: '50%', 
                        left: '10px', 
                        transform: 'translateY(-50%)',
                    }}
                />

                {/* Input field */}
                <input
                    type={isPasswordVisible ? 'text' : type}  
                    id={id}
                    className={`form-control ${error ? 'is-invalid' : ''} rounded input-theme`}
                    style={{ paddingLeft: '2.5rem' }}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    disabled={disabled}
                />

                {/* Password visibility toggle */}
                {type === 'password' && (
                    <button
                        type="button"
                        className="btn position-absolute password-toggle"
                        onClick={togglePasswordVisibility}
                        style={{ right: '10px', top: '50%', transform: 'translateY(-50%)' }}
                    >
                        <FontAwesomeIcon icon={isPasswordVisible ? faEyeSlash : faEye} />
                    </button>
                )}
            </div>
        );
    };

    return (
        <div className="d-flex flex-column py-1">
            {label && <label htmlFor={id} className="form-label fw-bold">{label}:</label>}
            {renderInputField()}
            {/* Error message */}
            {error && <div className={`invalid-feedback ${error ? 'd-block' : 'd-none'}`}>{error}</div>}
        </div>
    );
};

export default InputField;

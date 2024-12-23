import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useOrgan } from '../hooks/useOrgan';

const Button = ({ text, className = 'btn', link, onClick, type = 'button', disabled = false}) => {
    const { selectedCompany } = useOrgan();

    const buttonStyles = selectedCompany?.color
        ? {
            color: selectedCompany.color,
            borderColor: selectedCompany.color,
        }
        : {};
    
    return link ? (
        <Link to={link} className={className} style={buttonStyles}>
            {text}
        </Link>
    ) : (
        <button type={type} onClick={onClick} className={className} style={buttonStyles} disabled={disabled}>
            {text}
        </button>
    );
};

export default Button;

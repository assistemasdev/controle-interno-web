import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCompany } from '../hooks/useCompany';

const Button = ({ text, className = 'btn', link, onClick, type = 'button' }) => {
  const { selectedCompany } = useCompany();

  const buttonStyles = selectedCompany?.color
    ? {
        color: selectedCompany.color,
        borderColor: selectedCompany.color,
      }
    : {};
  useEffect(() => {
    console.log(buttonStyles)
  },[])
  return link ? (
    <Link to={link} className={className} style={buttonStyles}>
      {text}
    </Link>
  ) : (
    <button type={type} onClick={onClick} className={className} style={buttonStyles}>
      {text}
    </button>
  );
};

export default Button;

import React from 'react';
import { Link } from 'react-router-dom';

const Button = ({ text, className, link, onClick }) => {
  return link ? (
    <Link to={link} className={className}>
      {text}
    </Link>
  ) : (
    <button onClick={onClick} className={className}>{text}</button>
  );
};

export default Button;

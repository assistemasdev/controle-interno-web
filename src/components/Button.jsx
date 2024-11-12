import React from 'react';
import { Link } from 'react-router-dom';

const Button = ({ text, className, link }) => {
  return link ? (
    <Link to={link} className={className}>
      {text}
    </Link>
  ) : (
    <button className={className}>{text}</button>
  );
};

export default Button;

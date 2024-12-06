import React from 'react';

const Button = ({ text, onClick, className }) => {
  return (
    <button
      className={`${className} btn btn-blue-light`}
      onClick={onClick}
    >
      {text}
    </button>
  );
};

export default Button;
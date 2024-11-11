// src/components/Topbar.js
import React from 'react';
import '../assets/styles/layouts/Topbar.css';

const Topbar = ({ selectedCompany }) => {
  return (
    <div className="topbar">
      <span>Empresa Selecionada: <strong>{selectedCompany}</strong></span>
    </div>
  );
};

export default Topbar;

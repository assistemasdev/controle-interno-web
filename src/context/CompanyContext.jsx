import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const CompanyContext = createContext();

export const CompanyProvider = ({ children }) => {
  const [selectedCompany, setSelectedCompany] = useState(null); 
  const [loading, setLoading] = useState(true); 
  const navigate = useNavigate();
  
  const selectCompany = (company) => {
    setSelectedCompany(company);
    localStorage.setItem('selectedCompany', JSON.stringify(company));
    updateCSSVariables(company.color); 
    setLoading(false); 
  };

  useEffect(() => {
    const savedCompany = localStorage.getItem('selectedCompany');
    
    if (savedCompany) {
      const company = JSON.parse(savedCompany);
      setSelectedCompany(company);
      updateCSSVariables(company.color); 
      setLoading(false); 
    } else {
        navigate('/empresas'); 
    }
  }, []); 

  const updateCSSVariables = (color) => {
    if (color) {
      document.documentElement.style.setProperty('--primary-color', color);
    }
  };

  return (
    <CompanyContext.Provider value={{ selectedCompany, selectCompany, loading }}>
      {children}
    </CompanyContext.Provider>
  );
};

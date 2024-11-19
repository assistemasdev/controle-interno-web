import React, { createContext, useState, useEffect } from 'react';

export const CompanyContext = createContext();

export const CompanyProvider = ({ children }) => {
  const [selectedCompany, setSelectedCompany] = useState(null); 
  const [loading, setLoading] = useState(true); 

  const selectCompany = (company) => {
    setSelectedCompany(company);
    localStorage.setItem('selectedCompany', JSON.stringify(company));
    updateCSSVariables(company.color); 
  };

  useEffect(() => {
    const savedCompany = localStorage.getItem('selectedCompany');
    if (savedCompany) {
      const company = JSON.parse(savedCompany);
      setSelectedCompany(company);
      updateCSSVariables(company.color); 
    }
    setLoading(false); 
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

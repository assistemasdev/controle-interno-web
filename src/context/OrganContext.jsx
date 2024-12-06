import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const OrganContext = createContext();

export const OrganProvider = ({ children }) => {
  const [selectedOrgan, setOrgan] = useState(null); 
  const [loading, setLoading] = useState(true); 
  const navigate = useNavigate();
  
  const selectOrgan = (organ) => {
    setOrgan(organ);
    localStorage.setItem('selectedOrgan', JSON.stringify(organ));
    updateCSSVariables(organ.color); 
    setLoading(false); 
  };

  useEffect(() => {
    const savedOrgan = localStorage.getItem('selectedOrgan');
    
    if (savedOrgan) {
      const organ = JSON.parse(savedOrgan);
      setOrgan(organ);
      updateCSSVariables(organ.color); 
      setLoading(false); 
    } else {
        navigate('/orgaos'); 
    }
  }, []); 

  const updateCSSVariables = (color) => {
    if (color) {
      document.documentElement.style.setProperty('--primary-color', color);
    }
  };

  return (
    <OrganContext.Provider value={{ selectedOrgan, selectOrgan, loading }}>
      {children}
    </OrganContext.Provider>
  );
};

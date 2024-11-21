import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const ApplicationContext = createContext();

export const ApplacationProvider = ({ children }) => {
  const [selectedApplication, setApplication] = useState(null); 
  const [loading, setLoading] = useState(true); 
  const navigate = useNavigate();
  
  const selectApplication = (application) => {
    setApplication(application);
    localStorage.setItem('selectedApplication', JSON.stringify(application));
    setLoading(false); 
  };

  useEffect(() => {
    const savedApplicaiton = localStorage.getItem('selectedApplication');
    
    if (savedApplicaiton) {
      const company = JSON.parse(savedApplicaiton);
      setApplication(company);
      setLoading(false); 
    } else {
        navigate('/aplicacoes'); 
    }
  }, []); 

  return (
    <ApplicationContext.Provider value={{ selectedApplication, selectApplication, loading }}>
      {children}
    </ApplicationContext.Provider>
  );
};

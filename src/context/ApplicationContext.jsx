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

  const removeApplication = () => {
    setApplication(null);
    localStorage.removeItem("selectedApplication");
    navigate("/aplicacoes"); 
  };

  useEffect(() => {
    const savedApplication = localStorage.getItem('selectedApplication');
    
    if (savedApplication) {
      try {
        const application = JSON.parse(savedApplication);
        setApplication(application);
        setLoading(false);
      } catch (error) {
        console.error("Erro ao carregar a aplicação do localStorage:", error);
        setLoading(false); 
      }
    } else {
      navigate('/aplicacoes'); 
    }
  }, []);

  
  return (
    <ApplicationContext.Provider value={{ selectedApplication, selectApplication, removeApplication, loading }}>
      {children}
    </ApplicationContext.Provider>
  );
};

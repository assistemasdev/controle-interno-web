import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { hasPermission } from '../utils/permission';

export const PermissionsContext = createContext();

export const PermissionsProvider = ({ children }) => {
  const [userRoles, setUserRoles] = useState([]); 
  const [userPermissons, setUserPermissions] = useState([]);
  
  useEffect(() => {
    const storedRoles = JSON.parse(localStorage.getItem('userRoles'));
    const storedPermissions = JSON.parse(localStorage.getItem('userPermissions'));

    const roles = storedRoles || [];
    const permissions = storedPermissions || [];

    setUserRoles(roles);
    setUserPermissions(permissions);
  }, [])

  const canAccess = (requiredPermission) => {
    return hasPermission(userRoles, userPermissons, requiredPermission);
  };

  const addRoles = (roles) => {
    localStorage.setItem('userRoles', JSON.stringify(roles));
    setUserRoles(JSON.stringify(roles));
  };

  const addPermissions = (permissions) => {
    localStorage.setItem('userPermissions', JSON.stringify(permissions));
    setUserPermissions(permissions);
  }

  return (
    <PermissionsContext.Provider value={{ userRoles, userPermissons, canAccess, addRoles, addPermissions }}>
      {children}
    </PermissionsContext.Provider>
  );
};

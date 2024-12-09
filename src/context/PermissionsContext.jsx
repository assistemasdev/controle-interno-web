import React, { createContext, useState, useEffect } from 'react';
import { hasPermission, hasRole } from '../utils/permission';
import { CircularProgress } from '@mui/material';

export const PermissionsContext = createContext();

export const PermissionsProvider = ({ children }) => {
    const [userRoles, setUserRoles] = useState([]); 
    const [userPermissions, setUserPermissions] = useState([]);
    const [loading, setLoading] = useState(true); 

    useEffect(() => {
        const fetchRolesAndPermissions = () => {
            setLoading(true);

            const storedRoles = localStorage.getItem('userRoles');
            const storedPermissions = localStorage.getItem('userPermissions');

            try {
                if (storedRoles) {
                    setUserRoles(JSON.parse(storedRoles));
                } else {
                    setUserRoles([]);  
                }

                if (storedPermissions) {
                    setUserPermissions(JSON.parse(storedPermissions));
                } else {
                    setUserPermissions([]);  
                }
            } catch (error) {
                console.error('Erro ao carregar dados do localStorage', error);
            } finally {
                setLoading(false);  
            }
        };

        fetchRolesAndPermissions();
    }, []); 

    const canAccess = (requiredPermission) => {
        return hasPermission(userRoles, userPermissions, requiredPermission);
    };

    const UserHasRole = (rolesName, rolesUser) => {
        return hasRole(rolesName, rolesUser)
    };

    const addRoles = (roles) => {
        localStorage.setItem('userRoles', JSON.stringify(roles));
        setUserRoles(roles);
    };

    const addPermissions = (permissions) => {
        localStorage.setItem('userPermissions', JSON.stringify(permissions));
        setUserPermissions(permissions);
    };

    if (loading) {
        return <div style={{width:'100vw', height:'100vh', display:'flex', justifyContent:'center', alignItems:'center'}}><CircularProgress/></div>; 
    }

    return (
        <PermissionsContext.Provider
            value={{
                userRoles,
                userPermissions,
                canAccess,
                addRoles,
                addPermissions,
                UserHasRole
            }}
        >
            {children}
        </PermissionsContext.Provider>
    );
};

import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import LoginService from '../services/LoginService';
import { CircularProgress } from '@mui/material';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const storedUser = JSON.parse(localStorage.getItem('user'));

        try {
            if (token && storedUser) {
                const decodedToken = jwtDecode(token);

                if (decodedToken.exp * 1000 < Date.now()) {
                    // Handle expired token
                } else {
                    setIsAuthenticated(true);
                    setUser(storedUser);
                }
            }
        } catch (error) {
            setIsAuthenticated(false);
            setUser(null);
        } finally {
            setLoading(false);
        }
    }, []);

    return (
        loading ? (
            <CircularProgress />
        ) : (
            <AuthContext.Provider value={{ isAuthenticated, user }}>
                {children}
            </AuthContext.Provider>
        )
    );
};

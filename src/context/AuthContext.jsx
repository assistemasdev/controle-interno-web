import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = JSON.parse(localStorage.getItem('user'));

    if (token && storedUser) {
      setIsAuthenticated(true);
      setUser(storedUser);
    }

    setLoading(false); 
  }, []);

  const login = (token) => {
    const decoded = jwtDecode(token);
    console.log('Decoded Token:', decoded);

    // localStorage.setItem('token', 'fakeToken123');
    // localStorage.setItem('user', JSON.stringify(userData)); 
    // setIsAuthenticated(true);
    // setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

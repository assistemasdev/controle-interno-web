import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { CircularProgress } from '@mui/material';
import useBaseService from '../hooks/services/useBaseService';
import { entities } from '../constants/entities';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { post: userLogout } = useBaseService(navigate);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = JSON.parse(localStorage.getItem('user'));

    const checkAuth = () => {
      if (token && storedUser) {
        try {
          const decodedToken = jwtDecode(token);

          // Verifica se o token está expirado
          if (decodedToken.exp * 1000 < Date.now()) {
            logout();
            navigate('/login');
          } else {
            setIsAuthenticated(true);
            setUser(storedUser);
          }
        } catch (error) {
          console.log('Erro ao decodificar o token:', error);
          // Se houver erro no decoding, logout, mas apenas se o usuário já estiver logado
          if (user) {
            logout();
            navigate('/login', { state: { message: 'Sua sessão expirou. Por favor, faça login novamente.' } });
          }
        }
      } else {
        // Se não houver token ou usuário armazenado, não faz nada
        setLoading(false);
      }
    };

    checkAuth();

    // Define loading como false após a verificação
    setLoading(false);
  }, [user, navigate]);

  const login = (token) => {
    const decoded = jwtDecode(token);
    const userData = {
      id: decoded.user_id,
    };

    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setIsAuthenticated(true);
    setUser(userData);
  };

  const logout = async () => {
    try {
      await userLogout(entities.logout.create);
    } catch (error) {
      console.error('Erro ao desconectar do servidor:', error);
    } finally {
      localStorage.clear();
      setIsAuthenticated(false);
      setUser(null);
      document.documentElement.style.setProperty('--primary-color', '#4da8ff');
    }
  };

  if (loading) {
    return (
      <div
        style={{
          width: '100vw',
          height: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <CircularProgress />
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// src/routes.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import UsersPage from './pages/users/UsersPage';
import CreateUserPage from './pages/users/CreateUserPage';
import EditUserPage from './pages/users/EditUserPage';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute'; 
import CompanySelection from './pages/CompanySelection';
import { CompanyProvider } from './context/CompanyContext';

const AppRoutes = () => {
  return (
      <Router>
        <AuthProvider>
          <CompanyProvider>
            <Routes>
              <Route path="/login" element={<Login />} />

              <Route
                path="/dashboard"
                element={<PrivateRoute element={Dashboard} />}
              />
              <Route
                path="/empresas"
                element={<PrivateRoute element={CompanySelection} />}
              />
              <Route
                path="/usuarios"
                element={<PrivateRoute element={UsersPage} />}
              />
              <Route
                path="/usuarios/criar"
                element={<PrivateRoute element={CreateUserPage} />}
              />
              <Route
                path="/usuarios/editar/:id"
                element={<PrivateRoute element={EditUserPage} />}
              />
            </Routes>
          </CompanyProvider>
        </AuthProvider>
      </Router>
  );
};

export default AppRoutes;

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import CompanySelection from './pages/CompanySelection';
import Dashboard from './pages/Dashboard';
import UsersPage from './pages/users/UsersPage';  
import CreateUserPage from './pages/users/CreateUserPage'; 

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/selecao-empresas" element={<CompanySelection />} />
        <Route path="/dashboard" element={<Dashboard />} /> 
        <Route path="/usuarios" element={<UsersPage />} />
        <Route path="/usuarios/criar" element={<CreateUserPage />} /> 
      </Routes>
    </Router>
  );
};

export default AppRoutes;

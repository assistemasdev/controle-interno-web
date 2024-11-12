import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext'; 
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import UsersPage from './pages/users/UsersPage';
import CreateUserPage
 from './pages/users/CreateUserPage';
const App = () => {
  return (
    <AuthProvider>  
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/usuarios" element={<UsersPage />} />
          <Route path="/usuarios/criar" element={<CreateUserPage />} /> 
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;


// src/pages/Login.js
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../assets/styles/sb-admin-2.min.css';
import '../assets/styles/custom-styles.css'; 
import LoginCard from '../components/login/LoginCard';

const Login = () => {
    return (
        <div className="d-flex align-items-center justify-content-center vh-100 bg-pages-blue-light">
            <LoginCard />
        </div>
    );
};

export default Login;

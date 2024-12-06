import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import InputField from './InputField';
import Button from './Button';
import { useAuth } from '../../hooks/useAuth'; 
import MyAlert from '../MyAlert';  
import LoginService from '../../services/LoginService';
import { useLocation } from 'react-router-dom';
import RoleService from '../../services/RoleService';
import PermissionService from '../../services/PermissionService';
import { usePermissions } from '../../hooks/usePermissions';

const LoginCard = () => {
    const navigate = useNavigate();  
    const { login } = useAuth();  
    const { addRoles, addPermissions } = usePermissions();
    const location = useLocation();
  
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [formErrors, setFormErrors] = useState({ username: '', password: '' }); 
  
    useEffect(() => {
        if (location.state?.message) {
            setErrorMessage(location.state.message);
        }
    }, [location.state?.message]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (validateForm()) {
            try {
                const response = await LoginService.login(username, password);
                if (response.success) {
                    login(response.user);
                    addRoles(response.user.roles);
                    addPermissions(response.user.permissions);
                    setSuccessMessage('Login successful!');
                    navigate('/dashboard');
                } else {
                    setErrorMessage('Invalid credentials.');
                }
            } catch (error) {
                setErrorMessage('An error occurred. Please try again.');
            }
        }
    };

    const validateForm = () => {
        const errors = { username: '', password: '' };
        let formIsValid = true;

        if (!username) {
            errors.username = 'Username is required';
            formIsValid = false;
        }

        if (!password) {
            errors.password = 'Password is required';
            formIsValid = false;
        }

        setFormErrors(errors);
        return formIsValid;
    };

    return (
        <div className="login-card">
            <h2>Login</h2>
            {errorMessage && <MyAlert message={errorMessage} type="danger" />}
            {successMessage && <MyAlert message={successMessage} type="success" />}
            <form onSubmit={handleSubmit}>
                <InputField
                    type="text"
                    id="username"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    error={formErrors.username}
                />
                <InputField
                    type="password"
                    id="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    error={formErrors.password}
                />
                <Button text="Login" onClick={handleSubmit} className="btn-primary" />
            </form>
        </div>
    );
};

export default LoginCard;

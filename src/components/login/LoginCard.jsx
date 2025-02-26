import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import InputField from './InputField';
import Button from './Button';
import { useAuth } from '../../hooks/useAuth'; 
import { useLocation } from 'react-router-dom';
import { usePermissions } from '../../hooks/usePermissions';
import useNotification from '../../hooks/useNotification';
import useForm from '../../hooks/useForm';
import { loginFields } from '../../constants/forms/loginFields';
import useBaseService from '../../hooks/services/useBaseService';
import { entities } from '../../constants/entities';

const LoginCard = () => {
    const navigate = useNavigate();  
    const { login } = useAuth();  
    const { addRoles, addPermissions } = usePermissions();
    const location = useLocation();
    const { formData, handleChange } = useForm({ username: '', password: '' })
    const [formErrors, setFormErrors] = useState({ username: '', password: '' }); 
    const { showNotification } = useNotification();
    const { 
        post: loginUser,
        get: fetchRolesUser,
        get: fetchPermissionsForUser
    } = useBaseService(navigate);

    useEffect(() => {
        if (location.state?.message) {
            showNotification('error', location.state.message);
        }
    }, [location.state]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setFormErrors({ username: '', password: '' });

        try {
            const response = await loginUser(entities.login.create, formData);
            login(response.result);
            if(response) {
                const storedUser = JSON.parse(localStorage.getItem('user'));
                const userRoles = await fetchRolesUser(entities.users.roles.get(storedUser.id));
                const userPermissions = await fetchPermissionsForUser(entities.users.permissions.get(storedUser.id));
    
                addRoles(userRoles.result);
                addPermissions(userPermissions.result);
                
                navigate('/aplicacoes')
            }

        } catch (error) {
            console.log(error)
            showNotification('error', 'erro ao realizar login');
        }
    };

    return (
        <div className="col-xl-4 col-lg-6 col-md-8">
            <div className="card o-hidden border-0 shadow-lg">
                <div className="card-body p-0">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="p-5">
                                <div className="text-center">
                                    <h1 className="h2 font-color-blue-light mb-4">Bem vindo!</h1>
                                </div>

                                <form className="user" onSubmit={handleLogin}>
                                    {loginFields.map((field) => (
                                        <div key={field.id}>
                                            <InputField
                                                type={field.type}
                                                id={field.id}
                                                placeholder={field.placeholder}
                                                value={formData[field.id]}
                                                onChange={(e) => handleChange(field.id, e.target.value)}
                                                error={formErrors[field.id]}
                                            />
                                        </div>
                                    ))}
  
                                    <Button
                                        text="Login"
                                        className="btn btn-outline-info btn-block"
                                        link={null}
                                    />
                                    <hr />
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginCard;

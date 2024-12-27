import React, { useState, useEffect, use, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MainLayout from '../../layouts/MainLayout';
import InputField from '../../components/InputField';
import { CircularProgress } from '@mui/material'; 
import '../../assets/styles/custom-styles.css';
import MyAlert from '../../components/MyAlert';
import Select from 'react-select';  
import UserService from '../../services/UserService';
import PermissionService from '../../services/PermissionService';
import RoleService from '../../services/RoleService';
import Form from '../../components/Form';

const EditUserPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [selectedPermissions, setSelectedPermissions] = useState([]); 
    const [permissions, setPermissions] = useState([]);
    const [selectedRoles, setSelectedRoles] = useState([]);
    const [oldSelectedRoles, setOldSelectedRoles] = useState([]);
    const [roles, setRoles] = useState([]);
    const [message, setMessage] = useState(null);
    const [messagePermissions, setMessagePermissions] = useState(null);
    const [formErrors, setFormErrors] = useState({ 
        username: '', 
        email: '', 
        name: '', 
        permissions: '',  
        password: '',
        password_confirmation: '', 
    });
    const [loading, setLoading] = useState(true); 

    const [formData, setFormData] = useState({
        name: '',
        username: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const memoizedInitialData = useMemo(() => formData, [formData]);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true); 
            setMessage(null);
    
            try {
                const [userResponse, rolesResponse, permissionsResponse, userPermissionsResponse] = await Promise.all([
                    UserService.getById(id, navigate),              
                    RoleService.getRoles(navigate),                
                    PermissionService.getPermissions(),             
                    PermissionService.getPermissionUser(id, navigate) 
                ]);
    
                const user = userResponse.result;
                
                setFormData({
                    name: user.name,
                    username: user.username,
                    email: user.email,
                    password: '',
                    password_confirmation: '',
                });
    
                setRoles(rolesResponse.result.data);
    
                const formattedPermissions = permissionsResponse.result.data.map(permission => ({
                    value: permission.id,
                    label: permission.name,
                }));
                setPermissions(formattedPermissions);
    
                const userPermissions = userPermissionsResponse.result;
                setSelectedPermissions(userPermissions.map(permission => permission.id));
            } catch (error) {
                console.error('Erro ao carregar os dados:', error);
                setMessage({ type: 'error', text: 'Erro ao carregar dados do usuário.' });
            } finally {
                setLoading(false); 
            }
        };
    
        fetchData();
    }, [id]);

    const handlePermissionChange = (selectedOptions) => {
        setSelectedPermissions(selectedOptions ? selectedOptions.map(option => option.value) : []);
    };

    const handleRoleChange = async (selectedOptions) => {
        const safeSelectedOptions = selectedOptions || [];
        const safeOldSelectedRoles = oldSelectedRoles || [];

        const addedRoles = safeSelectedOptions.filter(option => !safeOldSelectedRoles.includes(option.value));
        const removedRoles = safeOldSelectedRoles.filter(role => !safeSelectedOptions.some(option => option.value === role));

        if (addedRoles.length > 0) {
            const selectedRole = addedRoles[addedRoles.length - 1]; 
            const response = await RoleService.showRolePermissions(selectedRole.value);
            const permissionsFromRole = response.result || [];
        
            setSelectedPermissions((prevPermissions) => {
                const updatedPermissions = [...prevPermissions];
                permissionsFromRole.forEach((permission) => {
                    if (!updatedPermissions.includes(permission.id)) {
                        updatedPermissions.push(permission.id);  
                    }
                });
                return updatedPermissions;
            });
        }

        if (removedRoles.length > 0) {
            const removedRole = removedRoles[0];
            const response = await RoleService.showRolePermissions(removedRole); 
            const permissionsFromRole = response.result || [];
            const remainingRoles = safeSelectedOptions.filter(role => role.value !== removedRole);

            const remainingPermissions = [];
            for (let role of remainingRoles) {
                const roleResponse = await RoleService.showRolePermissions(role.value); 
                const rolePermissions = roleResponse.result || [];
                remainingPermissions.push(...rolePermissions);
            }

            setSelectedPermissions((prevPermissions) => {
                return prevPermissions.filter((permissionId) => {
                    return !permissionsFromRole.some((permission) => {
                        return permission.id === permissionId && 
                        !remainingPermissions.some((p) => p.id === permission.id);
                    });
                });
            });
        }

        setOldSelectedRoles(safeSelectedOptions.map(option => option.value));  
        setSelectedRoles(safeSelectedOptions);
    };

    const handleUserSubmit = async (data) => {
        setFormErrors({ username: '', email: '', name: '', permissions: '' });
        setMessage(null);

        const dataToSend = { ...data };
        if (data.password === '' && data.password_confirmation === '') {
            delete dataToSend.password;
            delete dataToSend.password_confirmation;
        }

        try {
            const response = await UserService.update(id, dataToSend, navigate);
            setMessage({ type: 'success', text: response.message });
        } catch (error) {
            if (error.status === 422) {
                const errors = error.data;
                setFormErrors({
                    username: errors?.username ? errors.username[0] : '',
                    email: errors?.email ? errors.email[0] : '',
                    name: errors?.name ? errors.name[0] : '',
                    password: errors?.password ? errors.password[0] : '',
                    password_confirmation: errors?.password_confirmation ? errors.password_confirmation[0] : ''
                });
                return;
            }
            setMessage({ type: 'error', text: error.response?.data?.error || 'Erro ao editar o usuário' });
        }
    };

    const handlePermissionSubmit = async () => {
        setMessagePermissions(null);

        try {
            const response = await PermissionService.updateUserPermissions(id, { permissions: selectedPermissions }, navigate);
            setMessagePermissions({ type: 'success', text: response.message });
        } catch (error) {
            setMessagePermissions({ type: 'error', text: error.response?.data?.error || 'Erro ao atualizar permissões' });
        }
    };

    const handleBack = () => {
        navigate('/usuarios');
    };

    return (
        <MainLayout selectedCompany="ALUCOM">
            <div className="container-fluid p-1">
                <div className="text-xs font-weight-bold text-primary text-uppercase mb-1 text-dark">
                    Edição de Usuário
                </div>

                <Form
                    onSubmit={handleUserSubmit}
                    initialFormData={memoizedInitialData}
                    textSubmit="Atualizar Usuário"
                    textLoadingSubmit="Atualizando..."
                    handleBack={handleBack}
                >
                    {({ formData, handleChange }) => (
                        <>
                            {message && <MyAlert severity={message.type} message={message.text} onClose={() => setMessage('')} />}

                            <div className="form-row">
                                <div className="d-flex flex-column col-md-6">
                                    <InputField
                                        label="Nome:"
                                        type="text"
                                        id="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Digite o nome do usuário"
                                        error={formErrors.name}
                                    />
                                </div>
                                <div className="d-flex flex-column col-md-6">
                                    <InputField
                                        label="Usuário:"
                                        type="text"
                                        id="username"
                                        value={formData.username}
                                        onChange={handleChange}
                                        placeholder="Digite o nome de usuário"
                                        error={formErrors.username}
                                    />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="d-flex flex-column col-md-12">
                                    <InputField
                                        label="E-mail:"
                                        type="email"
                                        id="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="Digite seu e-mail"
                                        error={formErrors.email}
                                    />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="d-flex flex-column col-md-6">
                                    <InputField
                                        label="Senha:"
                                        id="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        type="password"
                                        placeholder="Digite a nova senha"
                                        error={formErrors.password}
                                    />
                                </div>
                                <div className="d-flex flex-column col-md-6">
                                    <InputField
                                        label="Confirmar Senha:"
                                        id="password_confirmation"
                                        value={formData.password_confirmation}
                                        onChange={handleChange}
                                        type="password"
                                        placeholder="Confirme a senha"
                                        error={formErrors.password_confirmation}
                                    />
                                </div>
                            </div>
                        </>
                    )}
                </Form>

                <Form
                    onSubmit={handlePermissionSubmit}
                    initialFormData={{ permissions: selectedPermissions }}
                    textSubmit="Atualizar Permissões"
                    textLoadingSubmit="Atualizando..."
                    handleBack={handleBack}
                >
                    {() => (
                        <>
                            {messagePermissions && <MyAlert severity={messagePermissions.type} message={messagePermissions.text} onClose={() => setMessagePermissions('')} />}

                            <div className="form-group">
                                <label htmlFor="roles" className='text-dark font-weight-bold '>Cargos:</label>
                                <Select
                                    id="roles"
                                    isMulti
                                    value={selectedRoles}
                                    onChange={handleRoleChange}
                                    options={roles.map(role => ({ value: role.id, label: role.name }))}
                                    isClearable
                                    noOptionsMessage={() => "Nenhuma cargo encontrado"}
                                    placeholder="Selecione os cargos (opcional)"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="permissions" className='text-dark font-weight-bold '>Permissões:</label>
                                <Select
                                    isMulti
                                    name="permissions"
                                    options={permissions}
                                    value={permissions.filter(permission => selectedPermissions.includes(permission.value))}
                                    onChange={handlePermissionChange}
                                    noOptionsMessage={() => "Nenhuma permissão encontrada"}
                                    placeholder="Selecione as permissões"
                                />
                            </div>
                        </>
                    )}
                </Form>
            </div>
        </MainLayout>
    );
};

export default EditUserPage;

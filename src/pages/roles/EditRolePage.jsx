import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MainLayout from '../../layouts/MainLayout';
import InputField from '../../components/InputField';
import Button from '../../components/Button';
import { CircularProgress } from '@mui/material'; 
import '../../assets/styles/custom-styles.css';
import MyAlert from '../../components/MyAlert';
import RoleService from '../../services/RoleService';
import PermissionService from '../../services/PermissionService';
import Select from 'react-select';  

const EditRolePage = () => {
    const navigate = useNavigate();
    const { roleId } = useParams();
    const [message, setMessage] = useState(null);
    const [formErrors, setFormErrors] = useState({ name: '' });
    const [loading, setLoading] = useState(true); 
    const [formData, setFormData] = useState({
        name: '',
    });

    const [permissions, setPermissions] = useState([]);
    const [selectedPermissions, setSelectedPermissions] = useState([]);
    const [rolePermissions, setRolePermissions] = useState([]);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData((prev) => ({ ...prev, [id]: value }));
    };

    const handlePermissionChange = (selectedOptions) => {
        setSelectedPermissions(selectedOptions ? selectedOptions.map(option => option.value) : []);
    };

    useEffect(() => {
        const fetchData = async () => {
        try {
            await fetchRole();
            await fetchPermissions();
            await fetchPermissionsRoles();
        } catch (error) {
            console.error('Erro ao carregar os dados:', error);
        }
        };
    
        fetchData();
    }, [roleId])


    const fetchRole = async () => {
        try {
            const response = await RoleService.getById(roleId, navigate);
            const role = response.result;

            setFormData({
                name: role.name,
                session_code: role.session_code,
                active: role.active
            });

        } catch (error) {
            setMessage({ type:'error', text: error.response?.data?.error || 'Erro ao buscar cargo' });
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const fetchPermissionsRoles = async () => {
        try {
            const response = await RoleService.showRolePermissions(roleId,navigate);
            const permissionsFromRole = response.result

            setSelectedPermissions((prevPermissions) => {
                const updatedPermissions = [...prevPermissions];
                permissionsFromRole.forEach((permission) => {
                if (!updatedPermissions.includes(permission.id)) {
                    updatedPermissions.push(permission.id);  
                }
                });
                return updatedPermissions;
            });
        } catch (error) {
            setMessage({ type:'error', text: error.response?.data?.error || 'Erro ao buscar permissões do cargo' });
            console.error(error);
        } finally {
            setLoading(false)
        }
    }

    const fetchPermissions = async () => {
        try {
        const response = await PermissionService.getPermissions(navigate);
        const formattedPermissions = response.result.map(permission => ({
            value: permission.id,
            label: permission.name
        }));
        setPermissions(formattedPermissions);  
        } catch (error) {
            setMessage({ type:'error', text: error.response?.data?.error || 'Erro ao buscar permissões' });
            console.error(error);
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormErrors({  name: '' });
        setMessage(null);

        try {
        const response = await RoleService.update(roleId, formData, navigate);
        if (response.status === 200) {
            setMessage({ type:'success', text: response.message });
            return;
        }
        if (response.status === 200 && selectedPermissions.length > 0) {
            const responsePermissions = await RoleService.updateRolePermissions(roleId, {permissions: selectedPermissions}, navigate)
                if (responsePermissions.status === 200) {
                setMessage({ type:'success', text: response.message });
                return;
            }

            if (responsePermissions.status !== 200) {
                setMessage({ type:'success', text: 'Cargo foi editado com sucesso, mas houve um erro ao editar suas permissões' });
                return;
            }
        }

        if (response.status === 422) {
            const errors = response.data;
            setFormErrors({
                name: errors?.name ? errors.name[0] : '',
            });
            return;
        }

        if (response.status === 404) {
            setMessage({ type:'error', text: response.message });
            return;
        } 

        } catch (error) {
            console.log(error)
            setMessage({ type:'error', text: error.response?.data?.error || 'Erro ao editar o cargo' });
        }
    };

    const handleBack = () => {
        navigate('/cargos/');
    };

    return (
        <MainLayout selectedCompany="ALUCOM">
            <div className="container-fluid p-1">
                <div className="text-xs font-weight-bold text-primary text-uppercase mb-1 text-dark">
                    Edição de Cargo
                </div>

                <form className="p-3 mt-2 rounded shadow-sm mb-2" style={{ backgroundColor: '#FFFFFF' }} onSubmit={handleSubmit}>
                    {message && <MyAlert severity={message.type} message={message.text} onClose={() => setMessage('')} />}

                    {loading ? (
                        <div className="d-flex justify-content-center mt-4">
                            <CircularProgress size={50} />
                        </div>
                    ) : (
                        <>
                            <div className="form-row">
                                <div className="d-flex flex-column col-md-12">
                                    <InputField
                                        label='Nome:'
                                        type="text"
                                        id="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Digite o nome do cargo"
                                        error={formErrors.name}
                                    />
                                </div>
                            </div>

                            <div className="form-group" style={{ marginLeft: '0px' }}>
                                <label htmlFor="roles" className='text-dark font-weight-bold '>Permissões:</label>
                                <Select
                                    isMulti
                                    name="permissions"
                                    options={permissions}  
                                    className="basic-multi-select"
                                    classNamePrefix="select"
                                    value={permissions.filter(permission => selectedPermissions.includes(permission.value))}
                                    onChange={handlePermissionChange}  
                                    noOptionsMessage={() => "Nenhuma permissão encontrada"}
                                    placeholder="Selecione as permissões"
                                />
                            </div>

                            <div className="mt-3 d-flex gap-2">
                                <Button type="submit" text="Atualizar Cargo" className="btn btn-blue-light fw-semibold" />
                                <Button type="button" text="Voltar" className="btn btn-blue-light fw-semibold" onClick={handleBack} />
                            </div>
                        </>
                    )}
                </form>
            </div>
        </MainLayout>
    );
};

export default EditRolePage;

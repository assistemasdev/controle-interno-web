import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MainLayout from '../../layouts/MainLayout';
import InputField from '../../components/InputField';
import Button from '../../components/Button';
import '../../assets/styles/custom-styles.css';
import RoleService from '../../services/RoleService';
import PermissionService from '../../services/PermissionService';
import Select from 'react-select';  
import useLoader from '../../hooks/useLoader';
import useNotification from '../../hooks/useNotification';

const EditRolePage = () => {
    const navigate = useNavigate();
    const { roleId } = useParams();
    const [formErrors, setFormErrors] = useState({ name: '' });
    const [formData, setFormData] = useState({
        name: '',
    });

    const [permissions, setPermissions] = useState([]);
    const [selectedPermissions, setSelectedPermissions] = useState([]);
    const { showLoader, hideLoader } = useLoader();
    const { showNotification } = useNotification();

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
                showLoader();
                await fetchRole();
                await fetchPermissions();
                await fetchPermissionsRoles();
            } catch (error) {
                console.error('Erro ao carregar os dados:', error);
            } finally {
                hideLoader();
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
            showNotification('error', 'Erro ao buscar cargo');
            console.error(error);
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
            showNotification('error', 'Erro ao buscar permissões do cargo');
            console.error(error);
        } 
    }

    const fetchPermissions = async () => {
        try {
            const response = await PermissionService.getPermissions(navigate);
            const formattedPermissions = response.result.data.map(permission => ({
                value: permission.id,
                label: permission.name
            }));
            setPermissions(formattedPermissions);  
        } catch (error) {
            showNotification('error', 'Erro ao buscar permissões');
            console.error(error);
        } 
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormErrors({  name: '' });

        try {
            const response = await RoleService.update(roleId, formData, navigate);
            if (response.status === 200) {
                showNotification('success', response.message);
                return;
            }
            if (response.status === 200 && selectedPermissions.length > 0) {
                const responsePermissions = await RoleService.updateRolePermissions(roleId, {permissions: selectedPermissions}, navigate)
                if (responsePermissions.status === 200) {
                    showNotification('success', response.message);
                    return;
                }
            }

        } catch (error) {
            console.log(error)
            if (error.status === 422) {
                const errors = error.data;
                setFormErrors({
                    name: errors?.name ? errors.name[0] : '',
                });
                return;
            }
            showNotification('error', 'Erro ao editar o cargo');
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
                    
                </form>
            </div>
        </MainLayout>
    );
};

export default EditRolePage;

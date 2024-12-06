import React, { useEffect, useState } from 'react';
import MainLayout from '../../layouts/MainLayout';
import InputField from '../../components/InputField'; 
import Button from '../../components/Button'; 
import { useNavigate } from 'react-router-dom';
import '../../assets/styles/custom-styles.css'; 
import MyAlert from '../../components/MyAlert';
import { usePermissions } from '../../hooks/usePermissions';
import RoleService from '../../services/RoleService';
import PermissionService from '../../services/PermissionService';
import Select from 'react-select';  

const CreateRolePage = () => {
    const navigate = useNavigate(); 
    const [permissions, setPermissions] = useState([]);
    const [selectedPermissions, setSelectedPermissions] = useState([]);
    const { canAccess } = usePermissions();
    const [formData, setFormData] = useState({
        name: '',
    });

    const [message, setMessage] = useState({ type: '', text: '' });
    const [formErrors, setFormErrors] = useState({    
        name: '',
    }); 

    useEffect(() => {
        fetchPermissions();
    }, [])

    const fetchPermissions = async () => {
        try {
        const response = await PermissionService.getPermissions();
        const formattedPermissions = response.result.map(permission => ({
            value: permission.id,
            label: permission.name
        }));
        setPermissions(formattedPermissions);  
        } catch (error) {
        console.error('Erro ao carregar permissões:', error);
        }
    };

    const handlePermissionChange = (selectedOptions) => {
        setSelectedPermissions(selectedOptions ? selectedOptions.map(option => option.value) : []);
    };

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData((prev) => ({ ...prev, [id]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormErrors({});
        setMessage({ type: '', text: '' });
        try {
        const response = await RoleService.create(formData, navigate);
        const { status, data, message } = response; 
        
        if (status === 201) {
            const permissions = await RoleService.assignPermissionsToRole(response.result.id, {permissions: selectedPermissions}, navigate)

            if ( permissions.status === 200) {
            setMessage({ type: 'success', text: message });
            setFormData({
                name: '',
            });
            setSelectedPermissions([]);
            return;
            }
            
            if ( permissions.status !== 200) {
            setMessage({ type: 'warning', text: 'Cargo foi registrados, mas houve um erro ao atribuir suas permissões' });
            setFormData({
                name: '',
            });
            setSelectedPermissions([]);
            return;
            }
        }
    
        if (status === 422 && data) {
            setFormErrors({
            name: data.name?.[0] || ''
            });
            return;
        }
    
        setMessage({ type: 'error', text: message || 'Erro ao realizar o cadastro' });
        } catch (error) {
        setMessage({ type: 'error', text: 'Erro ao realizar o cadastro' });
        }
    };

    const handleBack = () => {
        navigate('/cargos/');  
    };

    return (
        <MainLayout selectedCompany="ALUCOM">
        <div className="container-fluid p-1">
            <div className="text-xs font-weight-bold text-primary text-uppercase mb-1 text-dark">
                Cadastro de Cargos
            </div>

            <form className="p-3 mt-2 rounded shadow-sm mb-2" style={{ backgroundColor: '#FFFFFF' }} onSubmit={handleSubmit}>
                {message.text && <MyAlert severity={message.type} message={message.text} onClose={() => setMessage({ type: '', text: '' })} />}


                <div className="form-row">
                    <div className="d-flex flex-column col-md-12">
                        <InputField
                            label="Nome:"
                            type="text"
                            id="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Digite o nome da aplicação"
                            error={formErrors.name} 
                        />
                    </div>
                </div>

                <div className="form-group" style={{ marginLeft: '0px' }}>
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

                <div className="mt-3 form-row gap-2">
                    {canAccess('create applications') && (
                        <Button type="submit" text="Cadastrar Cargo" className="btn btn-blue-light fw-semibold" />
                    )}
                    <Button type="button" text="Voltar" className="btn btn-blue-light fw-semibold" onClick={handleBack} />
                </div>
            </form>
        </div>
        </MainLayout>
    );
};

export default CreateRolePage;

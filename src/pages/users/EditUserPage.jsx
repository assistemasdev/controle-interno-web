import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MainLayout from '../../layouts/MainLayout';
import InputField from '../../components/InputField';
import Button from '../../components/Button';
import { CircularProgress } from '@mui/material'; 
import '../../assets/styles/custom-styles.css';
import MyAlert from '../../components/MyAlert';
import Select from 'react-select';  
import UserService from '../../services/UserService';
import PermissionService from '../../services/PermissionService';
import RoleService from '../../services/RoleService';

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
  const [formErrors, setFormErrors] = useState({ username: '', email: '', name: '', permissions: '' });
  const [loading, setLoading] = useState(true); 
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    permissions: ''
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchUser();
  
        await fetchRoles();
  
        await fetchPermissions();
  
        await fetchUserPermissions();
  
      } catch (error) {
        console.error('Erro ao carregar os dados:', error);
      }
    };
  
    fetchData();
  }, [id])

  const fetchUserPermissions = async () => {
    try {
      const response = await PermissionService.getPermissionUser(id, navigate);
      const userPermissions = response.result;
      
      setSelectedPermissions(userPermissions.map(permission => permission.id));
    } catch (error) {
      console.error('Erro ao carregar permissões do usuário', error);
    }
  };


  const fetchUser = async () => {
    try {
      const response = await UserService.getById(id, navigate);
      const user = response.result;

      setFormData({
        name: user.name,
        username: user.username,
        email: user.email
      });

    } catch (error) {
      setMessage({ type:'error', text: error.response?.data?.error || 'Erro ao buscar pelo usuário' });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await RoleService.getRoles(navigate);
      setRoles(response.result); 
    } catch (error) {
      console.error('Erro ao carregar roles', error);
    }
  };

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

  const handleRoleChange = async (selectedOptions) => {
    const safeSelectedOptions = selectedOptions || [];
    const safeOldSelectedRoles = oldSelectedRoles || [];

    const addedRoles = selectedOptions.filter(option => !oldSelectedRoles.includes(option.value));
    
    const removedRoles = safeOldSelectedRoles.filter(
      (role) => !safeSelectedOptions.some((option) => option.value === role)
    );  

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
    
      const remainingRoles = selectedOptions.filter(role => role.value !== removedRole);
    
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
  
    setOldSelectedRoles(selectedOptions.map(option => option.value));  
    setSelectedRoles(selectedOptions)
  };

  const handleUserSubmit = async (e) => {
    e.preventDefault();
    setFormErrors({ username: '', email: '', name: '', permissions: '' });
    setMessage(null);

    try {
      const response = await UserService.update(id, formData, navigate);
      if (response.status === 200) {
        setMessage({ type:'success', text: response.message });
      }

      if (response.status === 422) {
        const errors = response.data;
        setFormErrors({
          username: errors?.username ? errors.username[0] : '',
          email: errors?.email ? errors.email[0] : '',
          name: errors?.name ? errors.name[0] : ''
        });
      }

      if (response.status === 404) {
        setMessage({ type:'error', text: response.message });
      } 

    } catch (error) {
      setMessage({ type:'error', text: error.response?.data?.error || 'Erro ao editar o usuário' });
    }
  };

  const handlePermissionSubmit = async (e) => {
    e.preventDefault();
    setFormErrors({ username: '', email: '', name: '' });
    setMessagePermissions(null);

    try {
      const response = await PermissionService.updateUserPermissions(id, {permissions: selectedPermissions }, navigate)

      if (response.status === 200) {
        setMessagePermissions({ type:'success', text: response.message });
        return;
      }

      if (response.status === 422) {
        const errors = response.data;

        setMessagePermissions({ type:'error', text: errors.permissions[0]  });
      }
    } catch (error) {
      setMessage({ type:'error', text: error.response?.data?.error || 'Erro ao atualizar permissões' });
    }
  }

  const handleBack = () => {
    navigate('/usuarios');
  };

  return (
    <MainLayout selectedCompany="ALUCOM">
      <div className="container-fluid p-1">
        <div className="text-xs font-weight-bold text-primary text-uppercase mb-1 text-dark">
          Edição de Usuário
        </div>

        <form className="p-3 mt-2 rounded shadow-sm mb-2" style={{ backgroundColor: '#FFFFFF' }} onSubmit={handleUserSubmit}>
          {message && <MyAlert severity={message.type} message={message.text} onClose={() => setMessage('')} />}

          {loading ? (
            <div className="d-flex justify-content-center mt-4">
              <CircularProgress size={50} />
            </div>
          ) : (
            <>
              <h5 className='text-dark font-weight-bold'>Dados do Usuário</h5>

              <hr />

              <div className="form-row">

                <div className="d-flex flex-column col-md-6">
                  <label htmlFor="name" className="form-label text-dark font-weight-bold">Nome:</label>
                  <InputField
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Digite o nome do usuário"
                    error={formErrors.name}
                  />
                </div>
                <div className="d-flex flex-column col-md-6">
                  <label htmlFor="username" className="form-label text-dark font-weight-bold">Usuário:</label>
                  <InputField
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
                  <label htmlFor="email" className="form-label text-dark font-weight-bold">E-mail:</label>
                  <InputField
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Digite seu e-mail"
                    error={formErrors.email}
                  />
                </div>
              </div>
                

              <div className="mt-3 d-flex gap-2">
                <Button type="submit" text="Atualizar Usuário" className="btn btn-blue-light fw-semibold" />
                <Button type="button" text="Voltar" className="btn btn-blue-light fw-semibold" onClick={handleBack} />
              </div>
            </>
          )}
        </form>
        <form className="p-3 mt-2 rounded shadow-sm mb-2" style={{ backgroundColor: '#FFFFFF' }} onSubmit={handlePermissionSubmit}>
        {messagePermissions && <MyAlert severity={messagePermissions.type} message={messagePermissions.text} onClose={() => setMessagePermissions('')} />}

          {loading ? (
            <div className="d-flex justify-content-center mt-4">
              <CircularProgress size={50} />
            </div>
          ) : (
            <>
              <h5 className='text-dark font-weight-bold mt-3'>Permissões do Usuário</h5>
                
                <hr />
            
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
                    placeholder="Selecione os cargos(opcional)"
                  />
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
                  <Button type="submit" text="Atualizar Permissões" className="btn btn-blue-light fw-semibold" />
                  <Button type="button" text="Voltar" className="btn btn-blue-light fw-semibold" onClick={handleBack} />
                </div>
            </>
          )}
        </form>
      </div>
    </MainLayout>
  );
};

export default EditUserPage;

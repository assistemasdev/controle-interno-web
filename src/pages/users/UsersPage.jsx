import React, { useState, useEffect } from 'react';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import DynamicTable from '../../components/DynamicTable';
import Button from '../../components/Button';
import InputField from '../../components/InputField';
import axios from '../../services/api';
import ConfirmationModal from '../../components/modals/ConfirmationModal'; 
import '../../assets/styles/custom-styles.css';
import api from '../../services/api';
import MyAlert from '../../components/MyAlert';
import MainLayout from '../../layouts/MainLayout';  
import { CircularProgress } from '@mui/material';

const UsersPage = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);  
  const [openDeleteModal, setOpenDeleteModal] = useState(false);  
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/users/');
      const filteredUsers = response.data.map(user => ({
        id: user.id,
        name: user.name,
        email: user.email,
      }));
      setUsers(filteredUsers);
    } catch (error) {
      setError('Erro ao carregar usuários');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleFilter = (e) => {
    e.preventDefault();
    console.log('Filtros aplicados', { name, email });
  };

  const handleClearFilters = () => {
    setName('');
    setEmail('');
  };

  const handleEdit = (user) => {
    navigate(`/usuarios/editar/${user.id}`);
  };

  const handleDelete = (user) => {
    setSelectedUser(user);  
    setOpenDeleteModal(true);  
  };

  const handleConfirmDelete = async (id) => {
    try {
      await api.delete(`/users/${id}`);
      setSuccessMessage('Usuário excluído com sucesso!');
      setOpenDeleteModal(false);  
    } catch (error) {
        console.log(error)
        setErrorMessage('Erro ao excluir o usuário');
        setOpenDeleteModal(false);  
    }    
  };

  const handleCancelDelete = () => {
    setOpenDeleteModal(false);  
  };

  const headers = ['id', 'Nome', 'E-mail'];

  const actions = [
    {
      icon: faEdit,
      title: 'Editar usuário',
      buttonClass: 'btn-primary',
      onClick: handleEdit,
    },
    {
      icon: faTrashAlt,
      title: 'Excluir usuário',
      buttonClass: 'btn-danger',
      onClick: handleDelete,
    },
  ];

  return (
    <MainLayout selectedCompany="ALUCOM">
      <div className="container-fluid">
        <div className="text-xs font-weight-bold text-primary text-uppercase mb-1 text-dark">
          Usuários
        </div>

        <form className="p-3 mt-2 rounded shadow-sm mb-2" style={{ backgroundColor: '#FFFFFF' }} onSubmit={handleFilter}>
          {errorMessage && <MyAlert severity="error" message={errorMessage} onClose={() => setErrorMessage('')} />}
          {successMessage && <MyAlert severity="success" message={successMessage} onClose={() => setSuccessMessage('')} />}

          <div className="d-flex row">
            <div className="d-flex flex-column col-6">
              <label htmlFor="name" className="form-label text-dark font-weight-bold">Nome do usuário:</label>
              <InputField
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Digite o nome do usuário"
              />
            </div>
            <div className="d-flex flex-column col-6">
              <label htmlFor="email" className="form-label text-dark font-weight-bold">E-mail do usuário:</label>
              <InputField
                type="text"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Digite o e-mail do usuário"
              />
            </div>
          </div>
          <div className="d-flex mt-3 gap-2">
            <Button type="submit" text="Filtrar" className="btn btn-blue-light fw-semibold" />
            <Button type="button" text="Limpar filtros" className="btn btn-blue-light fw-semibold mx-2" onClick={handleClearFilters} />
          </div>
        </form>

        <div className="mt-4 d-flex justify-content-between align-items-center">
          <div className="font-weight-bold text-primary text-uppercase mb-1 text-dark d-flex">
            Lista de usuários
          </div>
          <Button
            text="Novo usuário"
            className="btn btn-blue-light fw-semibold"
            link="/usuarios/criar"
          />
        </div>

        {loading ? (
          <div className="d-flex justify-content-center mt-4">
            <CircularProgress size={50} />
          </div>
        ) : error ? (
          <div className="text-danger">{error}</div>
        ) : (
          <DynamicTable headers={headers} data={users} actions={actions} />
        )}
        
        <ConfirmationModal
          open={openDeleteModal}
          onClose={handleCancelDelete}
          onConfirm={() => handleConfirmDelete(selectedUser.id)}
          userName={selectedUser ? selectedUser.name : ''}
        />
      </div>
    </MainLayout>
  );
};

export default UsersPage;

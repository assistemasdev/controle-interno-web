import React, { useState } from 'react';
import MainLayout from '../../layouts/MainLayout'; 
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons'; 
import DynamicTable from '../../components/DynamicTable'; 
import Button from '../../components/Button';
import InputField from '../../components/InputField'; 
import '../../assets/styles/custom-styles.css'; 

const UsersPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [users, setUsers] = useState([
    { name: 'João Silva', email: 'joao.silva@email.com', phone: '(11) 91234-5678', userType: 'Admin', createdAt: '01/01/2022' },
    { name: 'Maria Oliveira', email: 'maria.oliveira@email.com', phone: '(11) 92345-6789', userType: 'Usuário', createdAt: '15/03/2021' },
    { name: 'Carlos Souza', email: 'carlos.souza@email.com', phone: '(11) 93456-7890', userType: 'Admin', createdAt: '10/05/2020' },
    { name: 'Ana Santos', email: 'ana.santos@email.com', phone: '(11) 94567-8901', userType: 'Usuário', createdAt: '20/07/2019' },
  ]);

  const handleFilter = (e) => {
    e.preventDefault();
    console.log('Filtros aplicados', { name, email });
  };

  const handleClearFilters = () => {
    setName('');
    setEmail('');
  };

  const handleEdit = (user) => {
    console.log('Editando usuário', user);
  };

  const handleDelete = (user) => {
    console.log('Excluindo usuário', user);
  };

  const headers = ['Nome', 'E-mail', 'Telefone', 'Tipo de usuário', 'Cadastro'];

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
          <div className="font-weight-bold text-primary text-uppercase mb-1 text-dark d-flex ">
            Lista de usuários
          </div>
          <Button
            text="Novo usuário"
            className="btn btn-blue-light fw-semibold"
            link="/usuarios/criar" 
          />
        </div>

        <DynamicTable headers={headers} data={users} actions={actions} />
      </div>
    </MainLayout>
  );
};

export default UsersPage;

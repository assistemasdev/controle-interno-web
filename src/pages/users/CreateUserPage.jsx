import React, { useState } from 'react';
import MainLayout from '../../layouts/MainLayout';
import InputField from '../../components/InputField'; 
import Button from '../../components/Button'; 
import { useNavigate } from 'react-router-dom';
import '../../assets/styles/custom-styles.css'; 

const CreateUserPage = () => {
  const navigate = useNavigate(); 
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [userType, setUserType] = useState('');
  const [createdAt, setCreatedAt] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const newUser = { name, email, phone, userType, createdAt };
    
    console.log('Novo usuário criado:', newUser);

    navigate('/usuarios'); 
  };

  const handleBack = () => {
    navigate('/usuarios');  
  };

  return (
    <MainLayout selectedCompany="ALUCOM">
      <div className="container-fluid">
        <div className="text-xs font-weight-bold text-primary text-uppercase mb-1 text-dark">
          Cadastro de Usuário
        </div>

        <form className="p-3 mt-2 rounded shadow-sm mb-2" style={{ backgroundColor: '#FFFFFF' }} onSubmit={handleSubmit}>
          <div className="d-flex row">
            <div className="d-flex flex-column col-6">
              <label htmlFor="name" className="form-label text-dark font-weight-bold">Nome:</label>
              <InputField
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Digite o nome do usuário"
              />
            </div>
            <div className="d-flex flex-column col-6">
              <label htmlFor="email" className="form-label text-dark font-weight-bold">E-mail:</label>
              <InputField
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Digite o e-mail do usuário"
              />
            </div>
          </div>

          <div className="d-flex row">
            <div className="d-flex flex-column col-6">
              <label htmlFor="phone" className="form-label text-dark font-weight-bold">Telefone:</label>
              <InputField
                type="text"
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Digite o telefone do usuário"
              />
            </div>
            <div className="d-flex flex-column col-6">
              <label htmlFor="userType" className="form-label text-dark font-weight-bold">Tipo de usuário:</label>
              <InputField
                type="text"
                id="userType"
                value={userType}
                onChange={(e) => setUserType(e.target.value)}
                placeholder="Digite o tipo de usuário"
              />
            </div>
          </div>

          <div className="d-flex row">
            <div className="d-flex flex-column col-6">
              <label htmlFor="createdAt" className="form-label text-dark font-weight-bold">Data de Cadastro:</label>
              <InputField
                type="date"
                id="createdAt"
                value={createdAt}
                onChange={(e) => setCreatedAt(e.target.value)}
              />
            </div>
          </div>

          <div className="mt-3 d-flex gap-2">
            <Button type="submit" text="Cadastrar Usuário" className="btn btn-blue-light fw-semibold" />
            <Button type="button" text="Voltar" className="btn btn-blue-light fw-semibold" onClick={handleBack} />
          </div>
        </form>
      </div>
    </MainLayout>
  );
};

export default CreateUserPage;

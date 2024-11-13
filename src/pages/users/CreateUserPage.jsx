import React, { useState } from 'react';
import MainLayout from '../../layouts/MainLayout';
import InputField from '../../components/InputField'; 
import Button from '../../components/Button'; 
import { useNavigate } from 'react-router-dom';
import '../../assets/styles/custom-styles.css'; 
import api from '../../services/api';
import MyAlert from '../../components/MyAlert';

const CreateUserPage = () => {
  const navigate = useNavigate(); 
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation , setPasswordConfirmation] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [formErrors, setFormErrors] = useState({username: '', email:'',name: '', password:''}); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormErrors({username: '', email:'', name: '', password:''});
    setSuccessMessage('');
    setErrorMessage('');
    try {
      const response = await api.post('/users/', {name, username, email, password, password_confirmation: passwordConfirmation});

      setSuccessMessage(response.data.message);
      setName('');
      setUsername('');
      setEmail('');
      setPassword('');
      setPasswordConfirmation('');
    } catch (error) {
      if (error.response && error.response.data && error.response.data.errors) {
        const { errors } = error.response.data;
        setFormErrors({
          username: errors?.username ? errors.username[0] : '',
          password: errors?.password ? errors.password[0] : '',
          email: errors?.email ? errors.email[0] : '',
          name: errors?.name ? errors.name[0] : '',
        });
      } else {
        setErrorMessage(error.response?.data?.error || 'Erro ao realizar o cadastro');
      }
    }    
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
          {errorMessage && <MyAlert severity="error" message={errorMessage} onClose={() => setErrorMessage('')} />}
          {successMessage && <MyAlert severity="success" message={successMessage} onClose={() => setSuccessMessage('')} />}

          <div className="d-flex row">
            <div className="d-flex flex-column col-6">
              <label htmlFor="name" className="form-label text-dark font-weight-bold">Nome:</label>
              <InputField
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Digite o nome do usuário"
                error={formErrors.name} 
              />
            </div>
            <div className="d-flex flex-column col-6">
              <label htmlFor="username" className="form-label text-dark font-weight-bold">Usuário:</label>
              <InputField
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Digite o nome de usuário"
                error={formErrors.username} 
              />
            </div>
          </div>

          <div className="d-flex row">
            <div className="d-flex flex-column col-12">
              <label htmlFor="email" className="form-label text-dark font-weight-bold">E-mail:</label>
              <InputField
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Digite seu e-mail"
                error={formErrors.email} 
              />
            </div>
          </div>

          <div className="d-flex row">
            <div className="d-flex flex-column col-6">
              <label htmlFor="password" className="form-label text-dark font-weight-bold">Senha:</label>
              <InputField
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite sua senha"
                error={formErrors.password} 
              />
            </div>
            <div className="d-flex flex-column col-6">
              <label htmlFor="passwordConfirmation" className="form-label text-dark font-weight-bold">Confirme sua senha:</label>
              <InputField
                type="password"
                id="passwordConfirmation"
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                placeholder="Confirme sua senha"
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

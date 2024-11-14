import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom'; // Importando useParams
import MainLayout from '../../layouts/MainLayout';
import InputField from '../../components/InputField';
import Button from '../../components/Button';
import { CircularProgress } from '@mui/material'; // Importando CircularProgress
import '../../assets/styles/custom-styles.css';
import api from '../../services/api';
import MyAlert from '../../components/MyAlert';

const EditUserPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [formErrors, setFormErrors] = useState({ username: '', email: '', name: '' });
  const [loading, setLoading] = useState(true); // Adicionando o estado de loading

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get(`/users/${id}`);
        const user = response.data;
        setName(user.name);
        setUsername(user.username);
        setEmail(user.email);
      } catch (error) {
        setErrorMessage('Erro ao carregar dados do usuário');
      } finally {
        setLoading(false); // Finaliza o loading após os dados serem carregados
      }
    };

    if (id) {
      fetchUser();
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormErrors({ username: '', email: '', name: '' });
    setSuccessMessage('');
    setErrorMessage('');

    try {
      await api.put(`/users/${id}`, { name, username, email });
      setSuccessMessage('Usuário atualizado com sucesso!');
    } catch (error) {
      if (error.response && error.response.data && error.response.data.errors) {
        const { errors } = error.response.data;
        setFormErrors({
          username: errors?.username ? errors.username[0] : '',
          email: errors?.email ? errors.email[0] : '',
          name: errors?.name ? errors.name[0] : ''
        });
      } else {
        setErrorMessage(error.response?.data?.error || 'Erro ao editar o usuário');
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
          Edição de Usuário
        </div>

        <form className="p-3 mt-2 rounded shadow-sm mb-2" style={{ backgroundColor: '#FFFFFF' }} onSubmit={handleSubmit}>
          {errorMessage && <MyAlert severity="error" message={errorMessage} onClose={() => setErrorMessage('')} />}
          {successMessage && <MyAlert severity="success" message={successMessage} onClose={() => setSuccessMessage('')} />}

          {loading ? (
            <div className="d-flex justify-content-center mt-4">
              <CircularProgress size={50} />
            </div>
          ) : (
            <>
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

              <div className="mt-3 d-flex gap-2">
                <Button type="submit" text="Atualizar Usuário" className="btn btn-blue-light fw-semibold" />
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

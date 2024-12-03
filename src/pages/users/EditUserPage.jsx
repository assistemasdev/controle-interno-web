import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MainLayout from '../../layouts/MainLayout';
import InputField from '../../components/InputField';
import Button from '../../components/Button';
import { CircularProgress } from '@mui/material'; 
import '../../assets/styles/custom-styles.css';
import api from '../../services/api';
import MyAlert from '../../components/MyAlert';
import UserService from '../../services/UserService';

const EditUserPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: ''
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const [message, setMessage] = useState();
  const [formErrors, setFormErrors] = useState({ username: '', email: '', name: '' });
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await UserService.getById(id, navigate);
        const { status , message, result } = response; 

        if (status == 200) {
          const user = result;
          setFormData({
            name:user.name,
            username:user.username,
            email:user.email
          });
        }

        if (status == 404) {
          navigate('/usuarios', {state: { message: message }});
        }
      } catch (error) {
        console.log(error)
        setMessage({ type: 'success', text:'Erro ao carregar dados do usuário' });
      } finally {
        setLoading(false); 
      }
    };

    if (id) {
      fetchUser();
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormErrors({ username: '', email: '', name: '' });
    setMessage({ type: '', text: '' });

    try {
      await UserService.update(id, formData, navigate);
      setMessage({ type:'success', text: 'Usuário atualizado com sucesso!' });
    } catch (error) {
      if (error.response && error.response.data && error.response.data.errors) {
        const { errors } = error.response.data;
        setFormErrors({
          username: errors?.username ? errors.username[0] : '',
          email: errors?.email ? errors.email[0] : '',
          name: errors?.name ? errors.name[0] : ''
        });
      } else {
        setMessage({ type:'success', text: error.response?.data?.error || 'Erro ao editar o usuário' });
      }
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

        <form className="p-3 mt-2 rounded shadow-sm mb-2" style={{ backgroundColor: '#FFFFFF' }} onSubmit={handleSubmit}>
          {message && <MyAlert severity={message.type} message={message.text} onClose={() => setMessage('')} />}

          {loading ? (
            <div className="d-flex justify-content-center mt-4">
              <CircularProgress size={50} />
            </div>
          ) : (
            <>
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
      </div>
    </MainLayout>
  );
};

export default EditUserPage;

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MainLayout from '../../layouts/MainLayout';
import InputField from '../../components/InputField';
import Button from '../../components/Button';
import { CircularProgress } from '@mui/material'; 
import '../../assets/styles/custom-styles.css';
import MyAlert from '../../components/MyAlert';
import ApplicationService from '../../services/ApplicationService';
import InputSelect from '../../components/InputSelect';

const EditApplicationPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [message, setMessage] = useState(null);
  const [formErrors, setFormErrors] = useState({ name: '', session_code: '', active: '' });
  const [loading, setLoading] = useState(true); 
  const [formData, setFormData] = useState({
    name: '',
    session_code: '', 
    active: ''
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchApplications();
  
      } catch (error) {
        console.error('Erro ao carregar os dados:', error);
      }
    };
  
    fetchData();
  }, [id])


  const fetchApplications = async () => {
    try {
      const response = await ApplicationService.getById(id, navigate);
      const application = response.result;

      setFormData({
        name: application.name,
        session_code: application.session_code,
        active: application.active
      });

    } catch (error) {
      setMessage({ type:'error', text: error.response?.data?.error || 'Erro ao buscar pela aplicação' });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormErrors({  name: '', session_code: '', active: '' });
    setMessage(null);

    try {
      const response = await ApplicationService.update(id, formData, navigate);
      if (response.status === 200) {
        setMessage({ type:'success', text: response.message });
      }

      if (response.status === 422) {
        const errors = response.data;
        setFormErrors({
          session_code: errors?.session_code ? errors.session_code[0] : '',
          name: errors?.name ? errors.name[0] : '',
          active: errors?.active ? errors.active[0] : ''
        });
      }

      if (response.status === 404) {
        setMessage({ type:'error', text: response.message });
      } 

    } catch (error) {
      console.log(error)
      setMessage({ type:'error', text: error.response?.data?.error || 'Erro ao editar a aplicação' });
    }
  };

  const handleBack = () => {
    navigate('/aplicacoes/dashboard');
  };

  return (
    <MainLayout selectedCompany="ALUCOM">
      <div className="container-fluid p-1">
        <div className="text-xs font-weight-bold text-primary text-uppercase mb-1 text-dark">
          Edição de Aplicação
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
                  <InputField
                    label='Nome:'
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Digite o nome da aplicação"
                    error={formErrors.name}
                  />
                </div>
                <div className="d-flex flex-column col-md-6">
                  <InputField
                    label='Codigo de Sessão:'
                    type="text"
                    id="session_code"
                    value={formData.session_code}
                    onChange={handleChange}
                    placeholder="Digite o código de sessão"
                    error={formErrors.session_code}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="d-flex flex-column col-md-12">
                  <InputSelect
                    label="Ativo"
                    id="active"
                    value={formData.active}
                    onChange={handleChange}
                    placeholder="Selecione o status"
                    options={[
                      { label: 'Ativo', value: 1 },
                      { label: 'Inativo', value: 0 }
                    ]}
                    error={formErrors.active}
                  />
                </div>
              </div>

              <div className="mt-3 d-flex gap-2">
                <Button type="submit" text="Atualizar Aplicação" className="btn btn-blue-light fw-semibold" />
                <Button type="button" text="Voltar" className="btn btn-blue-light fw-semibold" onClick={handleBack} />
              </div>
            </>
          )}
        </form>
      </div>
    </MainLayout>
  );
};

export default EditApplicationPage;

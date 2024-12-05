import React, { useState } from 'react';
import MainLayout from '../../layouts/MainLayout';
import InputField from '../../components/InputField'; 
import Button from '../../components/Button'; 
import { useNavigate, useParams } from 'react-router-dom';
import '../../assets/styles/custom-styles.css'; 
import MyAlert from '../../components/MyAlert';
import { usePermissions } from '../../hooks/usePermissions';
import OrganizationService from '../../services/OrganizationService';
import colorToHex from '../../utils/colorToHex';

const CreateOrganizationPage = () => {
  const navigate = useNavigate(); 
  const { canAccess } = usePermissions();
  const { applicationId } = useParams();

  const [formData, setFormData] = useState({
    name: '',
    color: '',
    application_id: applicationId
  });

  const [message, setMessage] = useState({ type: '', text: '' });
  const [formErrors, setFormErrors] = useState({    
    name: '',
    color: ''
  }); 

  const handleChange = (e) => {
    const { id, value } = e.target;

    if (id === 'color') {
      const hexColor = colorToHex(value);
      setFormData((prev) => ({ ...prev, [id]: hexColor }));
    } else {
      setFormData((prev) => ({ ...prev, [id]: value }));
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormErrors({});
    setMessage({ type: '', text: '' });
  
    try {
      const response = await OrganizationService.create(formData, navigate);
      const { status, data, message } = response; 
  
      if (status === 201) {
        setMessage({ type: 'success', text: message });
        setFormData({
          name: '',
          color: '',
          application_id: applicationId
        });
        return;
      }
  
      if (status === 422 && data) {
        setFormErrors({
          name: data.name?.[0] || '',
          color: data.color?.[0] || ''
        });
        return;
      }
  
      setMessage({ type: 'error', text: message || 'Erro ao realizar o cadastro' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Erro ao realizar o cadastro' });
    }
  };

  const handleBack = () => {
    navigate(`/orgaos/${applicationId}`);  
  };

  return (
    <MainLayout selectedCompany="ALUCOM">
      <div className="container-fluid p-1">
        <div className="text-xs font-weight-bold text-primary text-uppercase mb-1 text-dark">
          Cadastro de Organizações
        </div>

        <form className="p-3 mt-2 rounded shadow-sm mb-2" style={{ backgroundColor: '#FFFFFF' }} onSubmit={handleSubmit}>
          {message.text && <MyAlert severity={message.type} message={message.text} onClose={() => setMessage({ type: '', text: '' })} />}


          <div className="form-row">
            <div className="d-flex flex-column col-md-6">
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
            <div className="d-flex flex-column col-md-6">
              <InputField
                label="Cor:"
                type="color"
                id="color"
                value={formData.color}
                onChange={handleChange}
                placeholder="Digite a cor da organização"
                error={formErrors.color} 
              />
            </div>
          </div>

          <div className="mt-3 form-row gap-2">
            {canAccess('create applications') && (
              <Button type="submit" text="Cadastrar Organização" className="btn btn-blue-light fw-semibold" />
            )}
            <Button type="button" text="Voltar" className="btn btn-blue-light fw-semibold" onClick={handleBack} />
          </div>
        </form>
      </div>
    </MainLayout>
  );
};

export default CreateOrganizationPage;

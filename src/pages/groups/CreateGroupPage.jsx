import React, { useState } from 'react';
import MainLayout from '../../layouts/MainLayout';
import InputField from '../../components/InputField'; 
import Button from '../../components/Button'; 
import Form from '../../components/Form';
import { useNavigate } from 'react-router-dom';
import '../../assets/styles/custom-styles.css'; 
import MyAlert from '../../components/MyAlert';
import { usePermissions } from '../../hooks/usePermissions';
import GroupService from '../../services/GroupService';

const CreateGroupPage = () => {
    const navigate = useNavigate(); 
    const { canAccess } = usePermissions();

    const [message, setMessage] = useState({ type: '', text: '' });
    const [formErrors, setFormErrors] = useState({});

    const initialFormData = {
        name: '',
    };

    const handleSubmit = async (formData) => {
        setFormErrors({});
        setMessage({ type: '', text: '' });
    
        try {
            const response = await GroupService.create(formData, navigate);
            const { message } = response; 
    
            setMessage({ type: 'success', text: message });
        } catch (error) {    
            if (error.data && error.status === 422) {
                setFormErrors({
                    name: error.data.name?.[0] || '',
                });
            } else {
                setMessage({ type: 'error', text: error.message || 'Erro ao realizar o cadastro' });
            }
        }
    };

    const handleBack = () => {
        navigate(`/grupos/`);  
    };

    return (
        <MainLayout selectedCompany="ALUCOM">
            <div className="container-fluid p-1">
                <div className="text-xs font-weight-bold text-primary text-uppercase mb-1 text-dark">
                    Cadastro de Grupo
                </div>

                <Form
                    initialFormData={initialFormData}
                    onSubmit={handleSubmit}
                    className="p-3 mt-2 rounded shadow-sm mb-2"
                    textSubmit="Cadastrar Grupo"
                    textLoadingSubmit="Cadastrando..."
                    handleBack={handleBack}
                >
                    {({ formData, handleChange }) => (
                        <>
                            {message.text && <MyAlert severity={message.type} message={message.text} onClose={() => setMessage({ type: '', text: '' })} />}

                            <div className="form-row">
                                <div className="d-flex flex-column col-md-12">
                                    <InputField
                                        label="Grupos:"
                                        type="text"
                                        id="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Digite o nome do grupo"
                                        error={formErrors.name} 
                                    />
                                </div>
                            </div>
                        </>
                    )}
                </Form>
            </div>
        </MainLayout>
    );
};

export default CreateGroupPage;

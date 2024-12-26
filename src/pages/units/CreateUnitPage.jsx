import React, { useState, useMemo } from 'react';
import MainLayout from '../../layouts/MainLayout';
import InputField from '../../components/InputField'; 
import Form from '../../components/Form'; 
import '../../assets/styles/custom-styles.css'; 
import MyAlert from '../../components/MyAlert';
import UnitService from '../../services/UnitService';
import { useNavigate } from 'react-router-dom';

const CreateUnitPage = () => {
    const navigate = useNavigate(); 

    const [message, setMessage] = useState({ type: '', text: '' });
    const [formErrors, setFormErrors] = useState({    
        name: '',
        abbreviation: ''
    }); 

    const initialFormData = {
        name: '',
        abbreviation: ''
    };

    const memoizedInitialData = useMemo(() => initialFormData, [initialFormData]);

    const handleSubmit = async (formData) => {
        setFormErrors({});
        setMessage({ type: '', text: '' });
    
        try {
            const response = await UnitService.create(formData, navigate);
            const { message } = response; 
        
            setMessage({ type: 'success', text: message });
            return;
        } catch (error) {
            if (error.status === 422 && error.data) {
                setFormErrors({
                    name: error.data.name?.[0] || '',
                    abbreviation: error.data.abbreviation?.[0] || ''
                });
                return;
            }

            setMessage({ type: 'error', text: error.message || 'Erro ao cadastrar a unidade' });
        }
    };

    const handleBack = () => {
        navigate(`/unidades/`);  
    };

    return (
        <MainLayout selectedCompany="ALUCOM">
            <div className="container-fluid p-1">
                <div className="text-xs font-weight-bold text-primary text-uppercase mb-1 text-dark">
                    Cadastro de Unidades
                </div>

                <Form
                    onSubmit={handleSubmit}
                    initialFormData={memoizedInitialData}
                    textSubmit="Cadastrar Unidade"
                    textLoadingSubmit="Cadastrando..."
                    handleBack={handleBack}
                >
                    {({ formData, handleChange }) => (
                        <>
                            {message.text && <MyAlert severity={message.type} message={message.text} onClose={() => setMessage({ type: '', text: '' })} />}

                            <div className="form-row">
                                <div className="d-flex flex-column col-md-6">
                                    <InputField
                                        label="Nome:"
                                        type="text"
                                        id="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Digite o nome da unidade"
                                        error={formErrors.name} 
                                    />
                                </div>
                                <div className="d-flex flex-column col-md-6">
                                    <InputField
                                        label="Abreviação:"
                                        type="text"
                                        id="abbreviation"
                                        value={formData.abbreviation}
                                        onChange={handleChange}
                                        placeholder="Digite a abreviação da unidade"
                                        error={formErrors.abbreviation} 
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

export default CreateUnitPage;

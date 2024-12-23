import React, { useState } from 'react';
import MainLayout from '../../layouts/MainLayout';
import InputField from '../../components/InputField'; 
import { useNavigate } from 'react-router-dom';
import '../../assets/styles/custom-styles.css'; 
import MyAlert from '../../components/MyAlert';
import { usePermissions } from '../../hooks/usePermissions';
import CategoryService from '../../services/CategoryService';
import Form from '../../components/Form';

const CreateCategoryPage = () => {
    const navigate = useNavigate(); 

    const [message, setMessage] = useState({ type: '', text: '' });
    const [formErrors, setFormErrors] = useState({    
        name: '',
    }); 

    const handleSubmit = async (formData) => {
        setFormErrors({});
        setMessage({ type: '', text: '' });
    
        try {
            const response = await CategoryService.create(formData, navigate);
            const {  message } = response; 
        
            setMessage({ type: 'success', text: message });
            return;
        } catch (error) {
            if (error.status === 422) {
                setFormErrors({
                    name: error.data.name?.[0] || ''
                });
                return;
            }
            setMessage({ type: 'error', text: 'Erro ao realizar o cadastro' });
        }
    };

    const handleBack = () => {
        navigate(`/categorias/`);  
    };

    return (
        <MainLayout selectedCompany="ALUCOM">
            <div className="container-fluid p-1">
                <div className="text-xs font-weight-bold text-primary text-uppercase mb-1 text-dark">
                    Cadastro de Categoria
                </div>

                <Form
                    onSubmit={handleSubmit}
                    initialFormData={{
                        name: '',
                    }}
                    textSubmit="Cadastrar Categoria"
                    textLoadingSubmit="Cadastrando..."
                    handleBack={handleBack}
                >
                    {({ formData, handleChange}) => (
                        <>
                            {message?.text && (
                                <MyAlert
                                    severity={message.type}
                                    message={message.text}
                                    onClose={() => setMessage({ type: '', text: '' })}
                                />
                            )}

                            <div className="form-row">
                                <div className="d-flex flex-column col-md-12">
                                    <InputField
                                        label="Categoria:"
                                        type="text"
                                        id="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Digite o nome da categoria"
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

export default CreateCategoryPage;

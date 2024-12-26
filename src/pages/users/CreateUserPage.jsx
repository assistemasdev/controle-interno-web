import React, { useState, useMemo } from 'react';
import MainLayout from '../../layouts/MainLayout';
import InputField from '../../components/InputField'; 
import { useNavigate } from 'react-router-dom';
import '../../assets/styles/custom-styles.css'; 
import MyAlert from '../../components/MyAlert';
import UserService from '../../services/UserService';
import Form from '../../components/Form';

const CreateUserPage = () => {
    const navigate = useNavigate(); 
    const [message, setMessage] = useState({ type: '', text: '' });
    const [formErrors, setFormErrors] = useState({
        username: '',
        email: '',
        name: '',
        password: '',
    });

    const handleSubmit = async (formData) => {
        setFormErrors({});
        setMessage({ type: '', text: '' });

        try {
            const response = await UserService.create(formData, navigate);
            const { message } = response;

            setMessage({ type: 'success', text: message });
            return;
        } catch (error) {
            if (error.status === 422) {
                const errors = error.data;
                setFormErrors({
                    email: errors.email?.[0] || '',
                    username: errors.username?.[0] || '',
                    name: errors.name?.[0] || '',
                    password: errors.password?.[0] || '',
                });
                return;
            }

            setMessage({ type: 'error', text: 'Erro ao realizar o cadastro' });
        }
    };

    const handleBack = () => {
        navigate('/usuarios');
    };

    return (
        <MainLayout selectedCompany="ALUCOM">
            <div className="container-fluid p-1">
                <div className="text-xs font-weight-bold text-primary text-uppercase mb-1 text-dark">
                    Cadastro de Usuário
                </div>

                <Form
                    onSubmit={handleSubmit}
                    initialFormData={{
                        name: '',
                        username: '',
                        email: '',
                        password: '',
                        password_confirmation: '',
                    }}
                    textSubmit="Cadastrar Usuário"
                    textLoadingSubmit="Cadastrando..."
                    handleBack={handleBack}
                >
                    {({ formData, handleChange }) => (
                        <>
                            {message.text && (
                                <MyAlert
                                    severity={message.type}
                                    message={message.text}
                                    onClose={() => setMessage({ type: '', text: '' })}
                                />
                            )}

                            <div className="form-row">
                                <div className="d-flex flex-column col-md-6">
                                    <InputField
                                        label="Nome:"
                                        type="text"
                                        id="name"
                                        value={formData?.name || ''}
                                        onChange={handleChange}
                                        placeholder="Digite o nome do usuário"
                                        error={formErrors.name}
                                    />
                                </div>
                                <div className="d-flex flex-column col-md-6">
                                    <InputField
                                        label="Usuário:"
                                        type="text"
                                        id="username"
                                        value={formData?.username || ''}
                                        onChange={handleChange}
                                        placeholder="Digite o nome de usuário"
                                        error={formErrors.username}
                                    />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="d-flex flex-column col-md-12">
                                    <InputField
                                        label="E-mail:"
                                        type="email"
                                        id="email"
                                        value={formData?.email || ''}
                                        onChange={handleChange}
                                        placeholder="Digite seu e-mail"
                                        error={formErrors.email}
                                    />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="d-flex flex-column col-md-6">
                                    <InputField
                                        label="Senha:"
                                        type="password"
                                        id="password"
                                        value={formData?.password || ''}
                                        onChange={handleChange}
                                        placeholder="Digite sua senha"
                                        error={formErrors.password}
                                    />
                                </div>
                                <div className="d-flex flex-column col-md-6">
                                    <InputField
                                        label="Confirme sua senha:"
                                        type="password"
                                        id="password_confirmation"
                                        value={formData?.password_confirmation || ''}
                                        onChange={handleChange}
                                        placeholder="Confirme sua senha"
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

export default CreateUserPage;

import React, { useState, useEffect, useMemo  } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MainLayout from '../../layouts/MainLayout';
import InputField from '../../components/InputField';
import Button from '../../components/Button';
import { CircularProgress } from '@mui/material'; 
import '../../assets/styles/custom-styles.css';
import MyAlert from '../../components/MyAlert';
import UserService from '../../services/UserService';
import Form from '../../components/Form';

const PerfilUserPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [message, setMessage] = useState(null);
    const [formErrors, setFormErrors] = useState({ 
        username: '', 
        email: '', 
        name: '', 
        password: '',
        password_confirmation: '', 
    });
    const [loading, setLoading] = useState(true); 
    const [formData, setFormData] = useState({
        name: '',
        username: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const memoizedInitialData = useMemo(() => formData, [formData]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                await fetchUser();

            } catch (error) {
                console.error('Erro ao carregar os dados:', error);
            }
        };
    
        fetchData();
    }, [id])


    const fetchUser = async () => {
        try {
            const response = await UserService.getById(id, navigate);

            const user = response.result;

            setFormData({
                name: user.name,
                username: user.username,
                email: user.email,
                password: '',
                password_confirmation: '',
            });
        } catch (error) {
            if (error.status === 404) {
                navigate('/dashboard', { state: { message: error.message }});
            }

            setMessage({ type:'error', text: error.response?.data?.error || 'Erro ao buscar pelo usuário' });
        console.error(error);
        } finally {
            setLoading(false);
        }
    };


    const handleSubmit = async () => {
        setFormErrors({ username: '', email: '', name: '' });
        setMessage(null);

        const dataToSend = { ...formData };
        if (formData.password === '' && formData.password_confirmation === '') {
            delete dataToSend.password;
            delete dataToSend.password_confirmation;
        }

        try {
            const response = await UserService.update(id, dataToSend, navigate);
            setMessage({ type:'success', text: response.message });

        } catch (error) {
            if (error.status === 422) {
                const errors = error.data;
                
                setFormErrors({
                username: errors?.username ? errors.username[0] : '',
                email: errors?.email ? errors.email[0] : '',
                name: errors?.name ? errors.name[0] : '',
                password: errors?.password ? errors.password[0] : '',
                password_confirmation: errors?.password_confirmation ? errors.password_confirmation[0] : ''
                });

                return;
            }

            setMessage({ type:'error', text: error.response?.data?.error || 'Erro ao editar o usuário' });
        }
    };


    const handleBack = () => {
        navigate('/dashboard');
    };

    return (
        <MainLayout selectedCompany="ALUCOM">
        <div className="w-100 h-100">
            <div className="text-xs font-weight-bold text-primary text-uppercase mb-1 text-dark">
                Perfil do Usuário
            </div>

            {loading ? (
                <div className="d-flex justify-content-center mt-4">
                    <CircularProgress size={50} />
                </div>
            ) : (
                <Form
                    initialFormData={memoizedInitialData}
                    onSubmit={handleSubmit}
                    textSubmit="Atualizar Usuário"
                    textLoadingSubmit="Atualizando..."
                    handleBack={handleBack}
                >
                    {({ handleChange }) => (
                        <>
                            {message && (
                                <MyAlert 
                                    severity={message.type} 
                                    message={message.text} 
                                    onClose={() => setMessage(null)} 
                                />
                            )}
                            <h5 className='text-dark font-weight-bold'>Dados do Usuário</h5>
                            <hr />
                            <div className="form-row">
                                <div className="d-flex flex-column col-md-6">
                                    <InputField
                                        label="Nome:"
                                        type="text"
                                        id="name"
                                        value={formData.name}
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
                                        value={formData.username}
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
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="Digite seu e-mail"
                                        error={formErrors.email}
                                    />
                                </div>
                            </div>

                            <div className="form-row">
                                <div div className="d-flex flex-column col-md-6">
                                    <InputField
                                        label="Senha:"
                                        id="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        type="password"
                                        placeholder="Digite a nova senha"
                                        error={formErrors.password}
                                    />
                                </div>
                                <div div className="d-flex flex-column col-md-6">
                                    <InputField
                                        label="Confirmar Senha:"
                                        id="password_confirmation"
                                        value={formData.password_confirmation}
                                        onChange={handleChange}
                                        type="password"
                                        placeholder="Confirme a senha"
                                        error={formErrors.password_confirmation}
                                    />
                                </div>
                            </div>
                        </>
                    )}
                </Form>
            )}
        </div>
        </MainLayout>
    );
};

export default PerfilUserPage;

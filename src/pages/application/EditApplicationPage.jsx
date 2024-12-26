import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MainLayout from '../../layouts/MainLayout';
import InputField from '../../components/InputField';
import Button from '../../components/Button';
import { CircularProgress } from '@mui/material'; 
import '../../assets/styles/custom-styles.css';
import MyAlert from '../../components/MyAlert';
import InputSelect from '../../components/InputSelect';
import Form from '../../components/Form';
import ApplicationService from '../../services/ApplicationService';

const EditApplicationPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [message, setMessage] = useState(null);
    const [formErrors, setFormErrors] = useState({ name: '', session_code: '', active: '' });
    const [loading, setLoading] = useState(true);
    const [initialFormData, setInitialFormData] = useState({
        name: '',
        session_code: '',
        active: ''
    });

    const memoizedInitialData = useMemo(() => initialFormData, [initialFormData]);

    useEffect(() => {
        const fetchApplicationData = async () => {
            try {
                setLoading(true);
                const response = await ApplicationService.getById(id, navigate);
                const application = response.result;

                setInitialFormData({
                    name: application.name,
                    session_code: application.session_code,
                    active: application.active
                });
            } catch (error) {
                setMessage({ type: 'error', text: error.response?.data?.error || 'Erro ao buscar pela aplicação' });
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchApplicationData();
    }, [id, navigate]);

    const handleSubmit = async (formData) => {
        setFormErrors({ name: '', session_code: '', active: '' });
        setMessage(null);

        try {
            const response = await ApplicationService.update(id, formData, navigate);
            setMessage({ type: 'success', text: response.message });
        } catch (error) {
            if (error.status === 422) {
                const errors = error.data;
                setFormErrors({
                    session_code: errors?.session_code ? errors.session_code[0] : '',
                    name: errors?.name ? errors.name[0] : '',
                    active: errors?.active ? errors.active[0] : ''
                });
                return;
            }

            setMessage({ type: 'error', text: error.response?.data?.error || 'Erro ao editar a aplicação' });
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

                {loading ? (
                    <div className="d-flex justify-content-center mt-4">
                        <CircularProgress size={50} />
                    </div>
                ) : (
                    <Form
                        onSubmit={handleSubmit}
                        initialFormData={memoizedInitialData}
                        textSubmit="Atualizar"
                        textLoadingSubmit="Atualizando..."
                        handleBack={handleBack}
                    >
                        {({ formData, handleChange }) => (
                            <>
                                {message && (
                                    <MyAlert
                                        severity={message.type}
                                        message={message.text}
                                        onClose={() => setMessage(null)}
                                    />
                                )}

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
                                            label="Código de Sessão:"
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
                            </>
                        )}
                    </Form>
                )}
            </div>
        </MainLayout>
    );
};

export default EditApplicationPage;

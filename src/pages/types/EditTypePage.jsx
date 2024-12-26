import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MainLayout from '../../layouts/MainLayout';
import InputField from '../../components/InputField';
import Form from '../../components/Form';
import { CircularProgress } from '@mui/material'; 
import '../../assets/styles/custom-styles.css';
import MyAlert from '../../components/MyAlert';
import TypeService from '../../services/TypeService';

const EditTypePage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [message, setMessage] = useState(null);
    const [formErrors, setFormErrors] = useState({});
    const [loading, setLoading] = useState(true);

    const [initialFormData, setInitialFormData] = useState({
        name: ''
    });

    const memoizedInitialData = useMemo(() => initialFormData, [initialFormData]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                await fetchType();
            } catch (error) {
                console.error('Erro ao carregar os dados:', error);
            }
        };

        fetchData();
    }, [id]);

    const fetchType = async () => {
        try {
            const response = await TypeService.getById(id, navigate);

            setInitialFormData({
                name: response.result.name,
            });
        } catch (error) {
            if (error.status === 404) {
                navigate(
                    '/tipos/',
                    {
                        state: {
                            type: 'error',
                            message: error.message
                        }
                    }
                );
            }

            setMessage({ type: 'error', text: error.response?.data?.error || 'Erro ao buscar pelo tipo' });
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (formData) => {
        setFormErrors({});
        setMessage(null);

        try {
            const response = await TypeService.update(id, formData, navigate);
            setMessage({ type: 'success', text: response.message });
        } catch (error) {
            if (error.status === 422) {
                const errors = error.data;
                setFormErrors({
                    name: errors?.name ? errors.name[0] : '',
                });
            }
            setMessage({ type: 'error', text: error.message || 'Erro ao editar a aplicação' });
        }
    };

    const handleBack = () => {
        navigate(`/tipos/`);
    };

    return (
        <MainLayout selectedCompany="ALUCOM">
            <div className="container-fluid p-1">
                <div className="text-xs font-weight-bold text-primary text-uppercase mb-1 text-dark">
                    Edição de Tipo
                </div>

                {loading ? (
                    <div className="d-flex justify-content-center mt-4">
                        <CircularProgress size={50} />
                    </div>
                ) : (
                    <Form
                        initialFormData={memoizedInitialData}
                        onSubmit={handleSubmit}
                        className="p-3 mt-2 rounded shadow-sm mb-2"
                        textSubmit="Atualizar Tipo"
                        textLoadingSubmit="Atualizando..."
                        handleBack={handleBack}
                    >
                        {({ formData, handleChange }) => (
                            <>
                                {message && <MyAlert severity={message.type} message={message.text} onClose={() => setMessage(null)} />}

                                <div className="form-row">
                                    <div className="d-flex flex-column col-md-12">
                                        <InputField
                                            label="Nome:"
                                            type="text"
                                            id="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            placeholder="Digite o nome do tipo"
                                            error={formErrors.name}
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

export default EditTypePage;

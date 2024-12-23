import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MainLayout from '../../layouts/MainLayout';
import InputField from '../../components/InputField';
import Button from '../../components/Button';
import { CircularProgress } from '@mui/material'; 
import '../../assets/styles/custom-styles.css';
import MyAlert from '../../components/MyAlert';
import ConditionService from '../../services/ConditionService';
import { usePermissions } from '../../hooks/usePermissions';
import Form from '../../components/Form';

const EditConditionPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { canAccess } = usePermissions();
    const [message, setMessage] = useState(null);
    const [formErrors, setFormErrors] = useState({ name: '', color: '' });
    const [loading, setLoading] = useState(true); 
    const [formData, setFormData] = useState({
        name: ''
    });

    useEffect(() => {
        const fetchData = async () => {
        try {
            await fetchCategory();
    
        } catch (error) {
            console.error('Erro ao carregar os dados:', error);
        }
        };
    
        fetchData();
    }, [id])


    const fetchCategory = async () => {
        try {
            const response = await ConditionService.getById(id, navigate);

            setFormData({
                name: response.result.name,
            });
        } catch (error) {
            if (error.status === 404) {
                navigate(
                    '/condicoes/', 
                    {
                        state: { 
                            type: 'error', 
                            message: error.message 
                        }
                    }
                );
            }
    
            setMessage({ type:'error', text: error.response?.data?.error || 'Erro ao buscar pela condição' });
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (formData) => {
        setFormErrors({  name: '', color: '', active: '' });
        setMessage(null);

        try {
            const response = await ConditionService.update(id, formData, navigate);

            setMessage({ type:'success', text: response.message });
        } catch (error) {
            if (error.status === 422) {
                const errors = error.data;
                setFormErrors({
                    name: errors?.name ? errors.name[0] : '',
                });
                return
            }
            setMessage({ type:'error', text: error.response?.data?.error || 'Erro ao editar a condição' });
        }
    };

    const handleBack = () => {
        navigate(`/condicoes/`);
    };

    return (
        <MainLayout selectedCompany="ALUCOM">
            <div className="container-fluid p-1">
                <div className="text-xs font-weight-bold text-primary text-uppercase mb-1 text-dark">
                    Edição de Condição
                </div>

                {loading ? (
                    <div className="d-flex justify-content-center mt-4">
                        <CircularProgress size={50} />
                    </div>
                ) : (
                    <Form
                        onSubmit={handleSubmit}
                        initialFormData={formData}
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
                                    <div className="d-flex flex-column col-md-12">
                                        <InputField
                                            label='Nome:'
                                            type="text"
                                            id="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            placeholder="Digite o nome da condição"
                                            error={formErrors?.name}
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

export default EditConditionPage;

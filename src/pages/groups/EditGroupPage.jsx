import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MainLayout from '../../layouts/MainLayout';
import InputField from '../../components/InputField';
import Form from '../../components/Form';
import '../../assets/styles/custom-styles.css';
import MyAlert from '../../components/MyAlert';
import GroupService from '../../services/GroupService';
import { CircularProgress } from '@mui/material';

const EditGroupPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [message, setMessage] = useState(null);
    const [formErrors, setFormErrors] = useState({ name: '' });
    const [loading, setLoading] = useState(true); 
    const [formData, setFormData] = useState({
        name: ''
    });

    const memoizedInitialData = useMemo(() => formData, [formData]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                await fetchGroup();
            } catch (error) {
                console.error('Erro ao carregar os dados:', error);
            }
        };
    
        fetchData();
    }, [id]);

    const fetchGroup = async () => {
        setLoading(true);
        try {
            const response = await GroupService.getById(id, navigate);
    
            setFormData({
                name: response.result.name,
            });
            return;
            
        } catch (error) {
            if (error.status === 404) {
                navigate('/grupos/', {
                    state: { 
                        type: 'error', 
                        message: error.message 
                    },
                });
                return;
            }

            setMessage({ type: 'error', text: error.message || 'Erro ao buscar pelo grupo' });
            console.error("Erro capturado no fetchGroup:", error);
        } finally {
            setLoading(false);
        }
    };
    

    const handleSubmit = async (formData) => {
        try {
            const response = await GroupService.update(id, formData, navigate);
            setMessage({ type: 'success', text: response.message });
            return;
        } catch (error) {
            if (error.status === 422) {
                const errors = error.data;
                setFormErrors({
                    name: errors?.name ? errors.name[0] : '',
                });
                return;
            }
            
            setMessage({ type: 'error', text: error.message || 'Erro ao editar o grupo' });
            console.error("Erro capturado no handleSubmit:", error);
        }
    };

    const handleBack = () => {
        navigate(`/grupos/`);
    };

    return (
        <MainLayout selectedCompany="ALUCOM">
            <div className="container-fluid p-1">
                <div className="text-xs font-weight-bold text-primary text-uppercase mb-1 text-dark">
                    Edição de Grupo
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
                                {message && <MyAlert severity={message.type} message={message.text} onClose={() => setMessage(null)} />}

                                <div className="form-row">
                                    <div className="d-flex flex-column col-md-12">
                                        <InputField
                                            label='Nome:'
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
                )}
            </div>
        </MainLayout>
    );
};

export default EditGroupPage;

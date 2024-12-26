import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MainLayout from '../../layouts/MainLayout';
import InputField from '../../components/InputField';
import { CircularProgress } from '@mui/material';
import '../../assets/styles/custom-styles.css';
import MyAlert from '../../components/MyAlert';
import SupplierService from '../../services/SupplierService';
import { maskCpfCnpj, removeMask } from '../../utils/maskUtils';
import Form from '../../components/Form';

const EditSupplierPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [message, setMessage] = useState({ type: '', text: '' });
    const [formErrors, setFormErrors] = useState({});
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        alias: '',
        name: '',
        cpf_cnpj: '',
    });

    const memoizedInitialData = useMemo(() => formData, [formData]);

    const handleChange = (e) => {
        const { id, value } = e.target;
    
        setFormData((prev) => ({
            ...prev,
            [id]: id === 'cpf_cnpj' ? maskCpfCnpj(value) : value
        }));
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                await fetchSupplier();
            } catch (error) {
                console.error('Erro ao carregar os dados:', error);
            }
        };

        fetchData();
    }, [id]);

    const fetchSupplier = async () => {
        try {
            const response = await SupplierService.getById(id, navigate);
            const supplier = response.result;
            setFormData({
                alias: supplier.alias || '',
                name: supplier.name || '',
                cpf_cnpj: maskCpfCnpj(supplier.cpf_cnpj || ''), 
            });

        } catch (error) {
            if (error.status === 404) {
                navigate(
                    '/fornecedores/', 
                    {
                        state: { 
                            type: 'error', 
                            message: error.message 
                        }
                    }
                );
            }

            setMessage({ type: 'error', text: error.response?.data?.error || 'Erro ao buscar pelo fornecedor' });
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (formData) => {
        const sanitizedData = {
            ...formData,
            cpf_cnpj: removeMask(formData.cpf_cnpj)
        };

        try {
            const response = await SupplierService.update(id, sanitizedData, navigate);
            setMessage({ type: 'success', text: response.message });
        } catch (error) {
            if (error.status === 422) {
                const errors = error.data;

                setFormErrors({
                    alias: errors?.alias?.[0] || '',
                    name: errors?.name?.[0] || '',
                    cpf_cnpj: errors?.cpf_cnpj?.[0] || '',
                });

                return
            }
            setMessage({ type: 'error', text: error.response?.data?.error || 'Erro ao editar o fornecedor' });
        }
    };

    const handleBack = () => {
        navigate('/fornecedores/');
    };

    return (
        <MainLayout selectedCompany="ALUCOM">
            <div className="container-fluid p-1">
                <div className="text-xs font-weight-bold text-primary text-uppercase mb-1 text-dark">
                    Edição de Fornecedor
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
                            {({ formData }) => (
                                <>
                                    {message.text && <MyAlert severity={message.type} message={message.text} onClose={() => setMessage({ type: '', text: '' })} />}

                                    <div className="form-row">
                                        <div className="d-flex flex-column col-md-4">
                                            <InputField
                                                label="Apelido:"
                                                type="text"
                                                id="alias"
                                                value={formData.alias}
                                                onChange={handleChange}
                                                placeholder="Digite o apelido do fornecedor"
                                                error={formErrors.alias}
                                            />
                                        </div>
                                        <div className="d-flex flex-column col-md-4">
                                            <InputField
                                                label="Nome:"
                                                type="text"
                                                id="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                placeholder="Digite o nome do fornecedor"
                                                error={formErrors.name}
                                            />
                                        </div>
                                        <div className="d-flex flex-column col-md-4">
                                            <InputField
                                                label="CPF/CNPJ:"
                                                type="text"
                                                id="cpf_cnpj"
                                                value={formData.cpf_cnpj}
                                                onChange={handleChange}
                                                placeholder="Digite o CPF ou CNPJ"
                                                error={formErrors.cpf_cnpj}
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

export default EditSupplierPage;

import React, { useState, useEffect } from 'react';
import MainLayout from '../../layouts/MainLayout';
import InputField from '../../components/InputField';
import { useNavigate, useParams } from 'react-router-dom';
import '../../assets/styles/custom-styles.css';
import MyAlert from '../../components/MyAlert';
import CustomerService from '../../services/CustomerService';
import { maskCpfCnpj, removeMask } from '../../utils/maskUtils';
import { CircularProgress } from '@mui/material';
import Form from '../../components/Form';
const EditCustomerPage = () => {
    const navigate = useNavigate();
    const { id } = useParams(); 
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        customer: { alias: '', name: '', cpf_cnpj: '' }
    });

    const [message, setMessage] = useState({ type: '', text: '' });
    const [formErrors, setFormErrors] = useState({});

    useEffect(() => {
        const fetchCustomerData = async () => {
            try {
                const response = await CustomerService.getById(id, navigate);
                setFormData({ customer: response.result });
            } catch (error) {
                if (error.status === 404) {
                    navigate('/dashboard', {
                    state: { 
                        type: 'error', 
                        message: error.message 
                    }
                    });
                    return
                }
                setMessage({ type:'error', text: error.response?.data?.error || 'Erro ao buscar pela organização' });
            } finally {
                setLoading(false);
            }
        };

        fetchCustomerData();
    }, [id]);

    const handleChange = (e) => {
        const { id, value } = e.target;
        const [category, key] = id.split('.');
        setFormData((prev) => ({
            ...prev,
            [category]: {
                ...prev[category],
                [key]: key === 'cpf_cnpj' ? maskCpfCnpj(value) : value
            }
        }));
    };

    const handleSubmit = async (formData) => {
        setFormErrors({});
        setMessage({ type: '', text: '' });
        const sanitizedData = {
            ...formData.customer,
            cpf_cnpj: removeMask(formData.customer.cpf_cnpj),
        };
        try {
            const response = await CustomerService.update(id, sanitizedData, navigate);
            setMessage({ type: 'success', text: response.message });
        } catch (error) {
            console.log(error)
            if (error.status === 422 && error.data) {
                setFormErrors({
                    'customer.alias': error.data?.alias?.[0] ?? '', 
                    'customer.name': error.data?.name?.[0] ?? '', 
                    'customer.cpf_cnpj': error.data?.cpf_cnpj?.[0] ?? '', 
                });
                return;
            }
            setMessage({ type: 'error', text: 'Erro ao atualizar o cliente' });
        }
    };

    const handleBack = () => {
        navigate('/clientes/');
    };


    return (
        <MainLayout selectedCompany="ALUCOM">
            <div className="container-fluid p-1">
                <div className="text-xs font-weight-bold text-primary text-uppercase mb-1 text-dark">
                    Editar Cliente
                </div>

                {loading? (
                    <CircularProgress size={50}/>
                ): (
                    <Form
                        onSubmit={handleSubmit}
                        initialFormData={formData}
                        textSubmit="Atualizar"
                        textLoadingSubmit="Atualizando..."
                        handleBack={handleBack}
                    >
                        {({ formData }) => (
                            <>
                                {message.text && <MyAlert severity={message.type} message={message.text} onClose={() => setMessage({ type: '', text: '' })} />}

                                <div className="form-row">
                                    <div className="d-flex flex-column col-md-6">
                                        <InputField
                                            label="Nome Fantasia:"
                                            id="customer.alias"
                                            value={formData.customer.alias}
                                            onChange={handleChange}
                                            placeholder="Digite o nome fantasia"
                                            error={formErrors['customer.alias']}
                                        />  
                                    </div>
                                    <div className="d-flex flex-column col-md-6">
                                        <InputField
                                            label="Nome:"
                                            id="customer.name"
                                            value={formData.customer.name}
                                            onChange={handleChange}
                                            placeholder="Digite o nome do cliente"
                                            error={formErrors['customer.name']}
                                        />
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="d-flex flex-column col-md-12">
                                        <InputField
                                            label="CPF/CNPJ:"
                                            id="customer.cpf_cnpj"
                                            value={formData.customer.cpf_cnpj}
                                            onChange={handleChange}
                                            placeholder="Digite o CPF ou CNPJ"
                                            error={formErrors['customer.cpf_cnpj']}
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

export default EditCustomerPage;

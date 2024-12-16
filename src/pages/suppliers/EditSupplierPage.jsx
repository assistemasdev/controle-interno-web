import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MainLayout from '../../layouts/MainLayout';
import InputField from '../../components/InputField';
import Button from '../../components/Button';
import { CircularProgress } from '@mui/material';
import '../../assets/styles/custom-styles.css';
import MyAlert from '../../components/MyAlert';
import SupplierService from '../../services/SupplierService';
import { maskCpfCnpj, removeMask } from '../../utils/maskUtils';
import { usePermissions } from '../../hooks/usePermissions';

const EditSupplierPage = () => {
    const { canAccess } = usePermissions();
    const navigate = useNavigate();
    const { id } = useParams();
    const [message, setMessage] = useState(null);
    const [formErrors, setFormErrors] = useState({});
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        alias: '',
        name: '',
        cpf_cnpj: '',
        ddd: '',
        phone: '',
        email: ''
    });

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
                ddd: supplier.ddd || '',
                phone: supplier.phone || '',
                email: supplier.email || ''
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormErrors({});
        setMessage(null);

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
                    ddd: errors?.ddd?.[0] || '',
                    phone: errors?.phone?.[0] || '',
                    email: errors?.email?.[0] || ''
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

                <form className="p-3 mt-2 rounded shadow-sm mb-2" style={{ backgroundColor: '#FFFFFF' }} onSubmit={handleSubmit}>
                    {message && <MyAlert severity={message.type} message={message.text} onClose={() => setMessage(null)} />}

                    {loading ? (
                        <div className="d-flex justify-content-center mt-4">
                            <CircularProgress size={50} />
                        </div>
                    ) : (
                        <>
                            <div className="form-row">
                                <div className="d-flex flex-column col-md-6">
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
                                <div className="d-flex flex-column col-md-6">
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
                            </div>
                            <div className="form-row">
                                <div className="d-flex flex-column col-md-6">
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
                                <div className="d-flex flex-column col-md-2">
                                    <InputField
                                        label="DDD:"
                                        type="text"
                                        id="ddd"
                                        value={formData.ddd}
                                        onChange={handleChange}
                                        placeholder="Digite o DDD"
                                        error={formErrors.ddd}
                                    />
                                </div>
                                <div className="d-flex flex-column col-md-4">
                                    <InputField
                                        label="Telefone:"
                                        type="text"
                                        id="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="Digite o telefone"
                                        error={formErrors.phone}
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
                                        placeholder="Digite o e-mail"
                                        error={formErrors.email}
                                    />
                                </div>
                            </div>

                            <div className="mt-3 d-flex gap-2">
                                {canAccess('Atualizar fornecedores') && (
                                    <Button type="submit" text="Atualizar Fornecedor" className="btn btn-blue-light fw-semibold" />
                                )}
                                <Button type="button" text="Voltar" className="btn btn-blue-light fw-semibold" onClick={handleBack} />
                            </div>
                        </>
                    )}
                </form>
            </div>
        </MainLayout>
    );
};

export default EditSupplierPage;

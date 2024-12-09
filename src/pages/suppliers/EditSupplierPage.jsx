import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MainLayout from '../../layouts/MainLayout';
import InputField from '../../components/InputField';
import Button from '../../components/Button';
import { CircularProgress } from '@mui/material';
import '../../assets/styles/custom-styles.css';
import MyAlert from '../../components/MyAlert';
import SupplierService from '../../services/SupplierService';
import { maskCep, maskCpfCnpj, removeMask } from '../../utils/maskUtils';
const EditSupplierPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [message, setMessage] = useState(null);
    const [formErrors, setFormErrors] = useState({});
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        alias: '',
        name: '',
        cpf_cnpj: '',
        zip: '',
        street: '',
        number: '',
        details: '',
        district: '',
        city: '',
        state: '',
        country: '',
        ddd: '',
        phone: '',
        email: ''
    });

    const handleChange = (e) => {
        const { id, value } = e.target;
    
        setFormData((prev) => ({
            ...prev,
            [id]: id === 'cpf_cnpj'
                ? maskCpfCnpj(value)
                : id === 'zip'
                ? maskCep(value)
                : value
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
                zip: maskCep(supplier.zip || ''), 
                street: supplier.street || '',
                number: supplier.number || '',
                details: supplier.details || '',
                district: supplier.district || '',
                city: supplier.city || '',
                state: supplier.state || '',
                country: supplier.country || '',
                ddd: supplier.ddd || '',
                phone: supplier.phone || '',
                email: supplier.email || ''
            });
        } catch (error) {
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
            cpf_cnpj: removeMask(formData.cpf_cnpj),
            zip: removeMask(formData.zip)
        };

        try {
            const response = await SupplierService.update(id, sanitizedData, navigate);
            if (response.status === 200) {
                setMessage({ type: 'success', text: response.message });
            }

            if (response.status === 422) {
                const errors = response.data;
                setFormErrors({
                    alias: errors?.alias?.[0] || '',
                    name: errors?.name?.[0] || '',
                    cpf_cnpj: errors?.cpf_cnpj?.[0] || '',
                    zip: errors?.zip?.[0] || '',
                    street: errors?.street?.[0] || '',
                    number: errors?.number?.[0] || '',
                    details: errors?.details?.[0] || '',
                    district: errors?.district?.[0] || '',
                    city: errors?.city?.[0] || '',
                    state: errors?.state?.[0] || '',
                    country: errors?.country?.[0] || '',
                    ddd: errors?.ddd?.[0] || '',
                    phone: errors?.phone?.[0] || '',
                    email: errors?.email?.[0] || ''
                });
            }

            if (response.status === 404) {
                setMessage({ type: 'error', text: response.message });
            }
        } catch (error) {
            console.error(error);
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
                                <div className="d-flex flex-column col-md-6">
                                    <InputField
                                        label="CEP:"
                                        type="text"
                                        id="zip"
                                        value={formData.zip}
                                        onChange={handleChange}
                                        placeholder="Digite o CEP"
                                        error={formErrors.zip}
                                    />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="d-flex flex-column col-md-6">
                                    <InputField
                                        label="Rua:"
                                        type="text"
                                        id="street"
                                        value={formData.street}
                                        onChange={handleChange}
                                        placeholder="Digite a rua"
                                        error={formErrors.street}
                                    />
                                </div>
                                <div className="d-flex flex-column col-md-3">
                                    <InputField
                                        label="Número:"
                                        type="text"
                                        id="number"
                                        value={formData.number}
                                        onChange={handleChange}
                                        placeholder="Digite o número"
                                        error={formErrors.number}
                                    />
                                </div>
                                <div className="d-flex flex-column col-md-3">
                                    <InputField
                                        label="Detalhes:"
                                        type="text"
                                        id="details"
                                        value={formData.details}
                                        onChange={handleChange}
                                        placeholder="Digite os detalhes"
                                        error={formErrors.details}
                                    />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="d-flex flex-column col-md-4">
                                    <InputField
                                        label="Bairro:"
                                        type="text"
                                        id="district"
                                        value={formData.district}
                                        onChange={handleChange}
                                        placeholder="Digite o bairro"
                                        error={formErrors.district}
                                    />
                                </div>
                                <div className="d-flex flex-column col-md-4">
                                    <InputField
                                        label="Cidade:"
                                        type="text"
                                        id="city"
                                        value={formData.city}
                                        onChange={handleChange}
                                        placeholder="Digite a cidade"
                                        error={formErrors.city}
                                    />
                                </div>
                                <div className="d-flex flex-column col-md-4">
                                    <InputField
                                        label="Estado:"
                                        type="text"
                                        id="state"
                                        value={formData.state}
                                        onChange={handleChange}
                                        placeholder="Digite o estado"
                                        error={formErrors.state}
                                    />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="d-flex flex-column col-md-6">
                                    <InputField
                                        label="País:"
                                        type="text"
                                        id="country"
                                        value={formData.country}
                                        onChange={handleChange}
                                        placeholder="Digite o país"
                                        error={formErrors.country}
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
                                <Button type="submit" text="Atualizar Fornecedor" className="btn btn-blue-light fw-semibold" />
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

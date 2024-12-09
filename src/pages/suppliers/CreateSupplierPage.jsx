import React, { useState } from 'react';
import MainLayout from '../../layouts/MainLayout';
import InputField from '../../components/InputField'; 
import Button from '../../components/Button'; 
import { useNavigate } from 'react-router-dom';
import '../../assets/styles/custom-styles.css'; 
import MyAlert from '../../components/MyAlert';
import { usePermissions } from '../../hooks/usePermissions';
import SupplierService from '../../services/SupplierService';
import { maskCpfCnpj, maskCep, removeMask } from '../../utils/maskUtils';

const CreateSupplierPage = () => {
    const navigate = useNavigate(); 
    const { canAccess } = usePermissions();
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

    const [message, setMessage] = useState({ type: '', text: '' });
    const [formErrors, setFormErrors] = useState({}); 

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormErrors({});
        setMessage({ type: '', text: '' });
    
        const sanitizedData = {
            ...formData,
            cpf_cnpj: removeMask(formData.cpf_cnpj),
            zip: removeMask(formData.zip)
        };
    
        try {
            const response = await SupplierService.create(sanitizedData, navigate);
            const { status, data, message } = response;

            if (status === 201) {
                setMessage({ type: 'success', text: message });
                setFormData({
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
                return;
            }

            if (status === 422 && data) {
                setFormErrors({
                    alias: data.alias?.[0] || '',
                    name: data.name?.[0] || '',
                    cpf_cnpj: data.cpf_cnpj?.[0] || '',
                    zip: data.zip?.[0] || '',
                    street: data.street?.[0] || '',
                    number: data.number?.[0] || '',
                    details: data.details?.[0] || '',
                    district: data.district?.[0] || '',
                    city: data.city?.[0] || '',
                    state: data.state?.[0] || '',
                    country: data.country?.[0] || '',
                    ddd: data.ddd?.[0] || '',
                    phone: data.phone?.[0] || '',
                    email: data.email?.[0] || ''
                });
                return;
            }

            setMessage({ type: 'error', text: message || 'Erro ao realizar o cadastro' });
        } catch (error) {
            setMessage({ type: 'error', text: 'Erro ao realizar o cadastro' });
        }
    };

    const handleBack = () => {
        navigate('/fornecedores/');  
    };

    return (
        <MainLayout selectedCompany="ALUCOM">
            <div className="container-fluid p-1">
                <div className="text-xs font-weight-bold text-primary text-uppercase mb-1 text-dark">
                    Cadastro de Fornecedores
                </div>

                <form className="p-3 mt-2 rounded shadow-sm mb-2" style={{ backgroundColor: '#FFFFFF' }} onSubmit={handleSubmit}>
                    {message.text && <MyAlert severity={message.type} message={message.text} onClose={() => setMessage({ type: '', text: '' })} />}

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
                                placeholder="Digite detalhes adicionais"
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

                    <div className="mt-3 form-row gap-2">
                        {canAccess('Criar fornecedores') && (
                            <Button type="submit" text="Cadastrar Fornecedor" className="btn btn-blue-light fw-semibold" />
                        )}
                        <Button type="button" text="Voltar" className="btn btn-blue-light fw-semibold" onClick={handleBack} />
                    </div>
                </form>
            </div>
        </MainLayout>
    );
};

export default CreateSupplierPage;

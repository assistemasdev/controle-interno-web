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
    const [loadingCep, setLoadingCep] = useState(false);
    const [formData, setFormData] = useState({
        supplier: {
            alias: '',
            name: '',
            cpf_cnpj: '',
            ddd: '',
            phone: '',
            email: ''
        },
        address: {
            alias: '',
            zip: '',
            street: '',
            number: '',
            details: '',
            district: '',
            city: '',
            state: '',
            country: ''
        }
    });

    const [message, setMessage] = useState({ type: '', text: '' });
    const [formErrors, setFormErrors] = useState({}); 

    const handleChange = (e) => {
        const { id, value } = e.target;
        const [category, key] = id.split('.');
    
        setFormData((prev) => ({
            ...prev,
            [category]: {
                ...prev[category],
                [key]: key === 'cpf_cnpj'
                    ? maskCpfCnpj(value)
                    : key === 'zip'
                    ? maskCep(value)
                    : value
            }
        }));
    };

    const handleCepChange = async (e) => {
        const value = maskCep(e.target.value);
        const zip = removeMask(value);

        setFormData((prev) => ({
            ...prev,
            address: {
                ...prev.address,
                zip: value
            }
        }));

        if (zip.length === 8) {
            setLoadingCep(true);
            try {
                const response = await fetch(`https://viacep.com.br/ws/${zip}/json/`);
                if (!response.ok) throw new Error('Erro ao buscar o CEP');
                
                const data = await response.json();
                if (data.erro) throw new Error('CEP não encontrado');

                setFormData((prev) => ({
                    ...prev,
                    address: {
                        ...prev.address,
                        street: data.logradouro || '',
                        district: data.bairro || '',
                        city: data.localidade || '',
                        state: data.uf || '',
                        country: 'Brasil' 
                    }
                }));
            } catch (error) {
                setMessage({ type: 'error', text: error.message });
            } finally {
                setLoadingCep(false);
            }
        }
    };

    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormErrors({});
        setMessage({ type: '', text: '' });
    
        const sanitizedData = {
            supplier: {
                ...formData.supplier,
                cpf_cnpj: removeMask(formData.supplier.cpf_cnpj),
            },
            address: {
                ...formData.address,
                zip: removeMask(formData.address.zip),
            }
        };
    
        try {
            const response = await SupplierService.create(sanitizedData, navigate);
            const { status, data, message } = response;

            if (status === 201) {
                setMessage({ type: 'success', text: message });
                setFormData({
                    supplier: {
                        alias: '',
                        name: '',
                        cpf_cnpj: '',
                        ddd: '',
                        phone: '',
                        email: ''
                    },
                    address: {
                        alias: '',
                        zip: '',
                        street: '',
                        number: '',
                        details: '',
                        district: '',
                        city: '',
                        state: '',
                        country: ''
                    }
                });
                return;
            }

            if (status === 422 && data) {
                console.log(data);
                setFormErrors({
                    'supplier.alias': data?.['supplier.alias']?.[0] || '',
                    'supplier.name': data?.['supplier.name']?.[0] || '',
                    'supplier.cpf_cnpj': data?.['supplier.cpf_cnpj']?.[0] || '',
                    'address.alias': data?.['address.alias']?.[0] || '',
                    'address.zip': data?.['address.zip']?.[0] || '',
                    'address.street': data?.['address.street']?.[0] || '',
                    'address.number': data?.['address.number']?.[0] || '',
                    'address.details': data?.['address.details']?.[0] || '',
                    'address.district': data?.['address.district']?.[0] || '',
                    'address.city': data?.['address.city']?.[0] || '',
                    'address.state': data?.['address.state']?.[0] || '',
                    'address.country': data?.['address.country']?.[0] || '',
                    'supplier.ddd': data?.['supplier.ddd']?.[0] || '',
                    'supplier.phone': data?.['supplier.phone']?.[0] || '',
                    'supplier.email': data?.['supplier.email']?.[0] || ''
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
                                id="supplier.alias"
                                value={formData.supplier.alias}
                                onChange={handleChange}
                                placeholder="Digite o apelido do fornecedor"
                                error={formErrors['supplier.alias']} 
                            />
                        </div>
                        <div className="d-flex flex-column col-md-6">
                            <InputField
                                label="Nome:"
                                type="text"
                                id="supplier.name"
                                value={formData.supplier.name}
                                onChange={handleChange}
                                placeholder="Digite o nome do fornecedor"
                                error={formErrors['supplier.name']} 
                            />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="d-flex flex-column col-md-6">
                            <InputField
                                label="CPF/CNPJ:"
                                type="text"
                                id="supplier.cpf_cnpj"
                                value={formData.supplier.cpf_cnpj}
                                onChange={handleChange}
                                placeholder="Digite o CPF ou CNPJ"
                                error={formErrors['supplier.cpf_cnpj']} 
                            />
                        </div>

                        <div className="d-flex flex-column col-md-6">
                            <InputField
                                label="CEP:"
                                type="text"
                                id="address.zip"
                                value={formData.address.zip}
                                onChange={handleCepChange} 
                                placeholder="Digite o CEP"
                                error={formErrors['address.zip']} 
                            />
                            {loadingCep && <p>Carregando endereço...</p>}
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="d-flex flex-column col-md-6">
                            <InputField
                                label="Rua:"
                                type="text"
                                id="address.street"
                                value={formData.address.street}
                                onChange={handleChange}
                                placeholder="Digite a rua"
                                error={formErrors['address.street']} 
                            />
                        </div>
                        <div className="d-flex flex-column col-md-3">
                            <InputField
                                label="Número:"
                                type="text"
                                id="address.number"
                                value={formData.address.number}
                                onChange={handleChange}
                                placeholder="Digite o número"
                                error={formErrors['address.number']} 
                            />
                        </div>
                        <div className="d-flex flex-column col-md-3">
                            <InputField
                                label="Detalhes:"
                                type="text"
                                id="address.details"
                                value={formData.address.details}
                                onChange={handleChange}
                                placeholder="Digite detalhes adicionais"
                                error={formErrors['address.details']} 
                            />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="d-flex flex-column col-md-12">
                            <InputField
                                label="Apelido do Endereço:"
                                type="text"
                                id="address.alias"
                                value={formData.address.alias}
                                onChange={handleChange}
                                placeholder="Digite o apelido de endereço"
                                error={formErrors['address.alias']} 
                            />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="d-flex flex-column col-md-4">
                            <InputField
                                label="Bairro:"
                                type="text"
                                id="address.district"
                                value={formData.address.district}
                                onChange={handleChange}
                                placeholder="Digite o bairro"
                                error={formErrors['address.district']} 
                            />
                        </div>
                        <div className="d-flex flex-column col-md-4">
                            <InputField
                                label="Cidade:"
                                type="text"
                                id="address.city"
                                value={formData.address.city}
                                onChange={handleChange}
                                placeholder="Digite a cidade"
                                error={formErrors['address.city']} 
                            />
                        </div>
                        <div className="d-flex flex-column col-md-4">
                            <InputField
                                label="Estado:"
                                type="text"
                                id="address.state"
                                value={formData.address.state}
                                onChange={handleChange}
                                placeholder="Digite o estado"
                                error={formErrors['address.state']} 
                            />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="d-flex flex-column col-md-6">
                            <InputField
                                label="País:"
                                type="text"
                                id="address.country"
                                value={formData.address.country}
                                onChange={handleChange}
                                placeholder="Digite o país"
                                error={formErrors['address.country']} 
                            />
                        </div>
                        <div className="d-flex flex-column col-md-2">
                            <InputField
                                label="DDD:"
                                type="text"
                                id="supplier.ddd"
                                value={formData.supplier.ddd}
                                onChange={handleChange}
                                placeholder="Digite o DDD"
                                error={formErrors['supplier.ddd']} 
                            />
                        </div>
                        <div className="d-flex flex-column col-md-4">
                            <InputField
                                label="Telefone:"
                                type="text"
                                id="supplier.phone"
                                value={formData.supplier.phone}
                                onChange={handleChange}
                                placeholder="Digite o telefone"
                                error={formErrors['supplier.phone']} 
                            />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="d-flex flex-column col-md-12">
                            <InputField
                                label="E-mail:"
                                type="email"
                                id="supplier.email"
                                value={formData.supplier.email}
                                onChange={handleChange}
                                placeholder="Digite o e-mail"
                                error={formErrors['supplier.email']} 
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

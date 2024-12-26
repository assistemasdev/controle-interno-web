import React, { useState, useMemo } from 'react';
import MainLayout from '../../layouts/MainLayout';
import InputField from '../../components/InputField';
import { useNavigate } from 'react-router-dom';
import '../../assets/styles/custom-styles.css';
import MyAlert from '../../components/MyAlert';
import CustomerService from '../../services/CustomerService';
import { maskCpfCnpj, maskCep, removeMask } from '../../utils/maskUtils';
import Form from '../../components/Form';

const CreateCustomerPage = () => {
    const navigate = useNavigate();
    const [loadingCep, setLoadingCep] = useState(false);
    const [formData, setFormData] = useState({
        customer: {
            alias: '',
            name: '',
            cpf_cnpj: '',
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
            country: '',
        },
        location: {
            area: '',
            section: '',
            spot: '',
            details: ''
        },
        contact: {
            name: '',
            surname: '',
            role: '',
            ddd: '',
            phone: '',
            cell_ddd: '',
            cell: '',
            email: ''
        }
    });

    const memoizedInitialData = useMemo(() => formData, [formData]);

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

    const handleSubmit = async (formData) => {
        const sanitizedData = {
            customer: {
                ...formData.customer,
                cpf_cnpj: removeMask(formData.customer.cpf_cnpj),
            },
            address: {
                ...formData.address,
                zip: removeMask(formData.address.zip),
            },
            location: {
                ...formData.location
            },
            contact: {
                ...formData.contact
            }
        };

        try {
            const response = await CustomerService.create(sanitizedData, navigate);
            const { message } = response;

            setMessage({ type: 'success', text: message });
            setFormData({
                customer: { alias: '', name: '', cpf_cnpj: '' },
                address: { alias: '', zip: '', street: '', number: '', details: '', district: '', city: '', state: '', country: '' },
                location: { area: '', section: '', spot: '', details: '' },
                contact: { name: '', surname: '', role: '', ddd: '', phone: '', cell_ddd: '', cell: '', email: '' }
            });
        } catch (error) {
            if (error.status === 422 && error.data) {
                setFormErrors(error.data);
                return;
            }
            setMessage({ type: 'error', text: 'Erro ao realizar o cadastro' });
        }
    };

    const handleBack = () => {
        navigate('/clientes/');
    };

    return (
        <MainLayout selectedCompany="ALUCOM">
            <div className="container-fluid p-1">
                <div className="text-xs font-weight-bold text-primary text-uppercase mb-1 text-dark">
                    Cadastro de Clientes
                </div>

                <Form
                    onSubmit={() => handleSubmit(formData)}
                    initialFormData={memoizedInitialData}
                    textSubmit="Cadastrar Cliente"
                    textLoadingSubmit="Cadastrando..."
                    handleBack={handleBack}
                >
                    {() => (
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

                        <div className="form-row">
                            <div className="d-flex flex-column col-md-6">
                                <InputField
                                    label="CEP:"
                                    id="address.zip"
                                    value={formData.address.zip}
                                    onChange={handleCepChange}
                                    placeholder="Digite o CEP"
                                    error={formErrors['address.zip']}
                                />
                            </div>
                            <div className="d-flex flex-column col-md-6">
                                <InputField
                                    label="Rua:"
                                    id="address.street"
                                    value={formData.address.street}
                                    onChange={handleChange}
                                    placeholder="Digite a rua"
                                    error={formErrors['address.street']}
                                />
                            </div>
                        </div>

                        
                        <div className="form-row">
                            <div className="d-flex flex-column col-md-12">
                                <InputField
                                    label="Apelido do Endereço:"
                                    id="address.alias"
                                    value={formData.address.alias}
                                    onChange={handleChange}
                                    placeholder="Digite o apelido do endereço"
                                    error={formErrors['address.alias']}
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="d-flex flex-column col-md-6">
                                <InputField
                                    label="Número:"
                                    id="address.number"
                                    value={formData.address.number}
                                    onChange={handleChange}
                                    placeholder="Digite o número"
                                    error={formErrors['address.number']}
                                />
                            </div>
                            <div className="d-flex flex-column col-md-6">
                                <InputField
                                    label="Bairro:"
                                    id="address.district"
                                    value={formData.address.district}
                                    onChange={handleChange}
                                    placeholder="Digite o bairro"
                                    error={formErrors['address.district']}
                                />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="d-flex flex-column col-md-6">
                                <InputField
                                    label="Cidade:"
                                    id="address.city"
                                    value={formData.address.city}
                                    onChange={handleChange}
                                    placeholder="Digite a cidade"
                                    error={formErrors['address.city']}
                                />
                            </div>
                            <div className="d-flex flex-column col-md-6">
                                <InputField
                                    label="Estado:"
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
                                    label="Área:"
                                    id="location.area"
                                    value={formData.location.area}
                                    onChange={handleChange}
                                    placeholder="Digite a área"
                                    error={formErrors['location.area']}
                                />
                            </div>
                            <div className="d-flex flex-column col-md-6">
                                <InputField
                                    label="Seção:"
                                    id="location.section"
                                    value={formData.location.section}
                                    onChange={handleChange}
                                    placeholder="Digite a seção"
                                    error={formErrors['location.section']}
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="d-flex flex-column col-md-6">
                                <InputField
                                    label="detalhes:"
                                    id="location.details"
                                    value={formData.location.details}
                                    onChange={handleChange}
                                    placeholder="Digite os detalhes"
                                    error={formErrors['location.details']}
                                />
                            </div>
                            <div className="d-flex flex-column col-md-6">
                                <InputField
                                    label="Ponto:"
                                    id="location.spot"
                                    value={formData.location.spot}
                                    onChange={handleChange}
                                    placeholder="Digite o ponto"
                                    error={formErrors['location.spot']}
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="d-flex flex-column col-md-6">
                                <InputField
                                    label="Nome do Contato:"
                                    id="contact.name"
                                    value={formData.contact.name}
                                    onChange={handleChange}
                                    placeholder="Digite o nome do contato"
                                    error={formErrors['contact.name']}
                                />
                            </div>
                            <div className="d-flex flex-column col-md-6">
                                <InputField
                                    label="Sobrenome do Contato:"
                                    id="contact.surname"
                                    value={formData.contact.surname}
                                    onChange={handleChange}
                                    placeholder="Digite o sobrenome do contato"
                                    error={formErrors['contact.surname']}
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="d-flex flex-column col-md-6">
                                <InputField
                                    label="DDD:"
                                    id="contact.ddd"
                                    value={formData.contact.ddd}
                                    onChange={handleChange}
                                    placeholder="Digite o ddd"
                                    error={formErrors['contact.ddd']}
                                />
                            </div>
                            <div className="d-flex flex-column col-md-6">
                                <InputField
                                    label="Telefone:"
                                    id="contact.phone"
                                    value={formData.contact.phone}
                                    onChange={handleChange}
                                    placeholder="Digite o telefone"
                                    error={formErrors['contact.phone']}
                                />
                            </div>
                            <div className="d-flex flex-column col-md-12">
                                <InputField
                                    label="E-mail:"
                                    id="contact.email"
                                    value={formData.contact.email}
                                    onChange={handleChange}
                                    placeholder="Digite o e-mail"
                                    error={formErrors['contact.email']}
                                />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="d-flex flex-column col-md-6">
                                <InputField
                                    label="DDD(CELULAR):"
                                    id="contact.cell_ddd"
                                    value={formData.contact.cell_ddd}
                                    onChange={handleChange}
                                    placeholder="Digite o ddd"
                                    error={formErrors['contact.cell_ddd']}
                                />
                            </div>
                            <div className="d-flex flex-column col-md-6">
                                <InputField
                                    label="Celular:"
                                    id="contact.cell"
                                    value={formData.contact.cell}
                                    onChange={handleChange}
                                    placeholder="Digite o telefone"
                                    error={formErrors['contact.cell']}
                                />
                            </div>
                        </div>
                    </>
                    )}
                </Form>
            </div>
        </MainLayout>
    );
};

export default CreateCustomerPage;

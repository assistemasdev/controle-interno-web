import React, { useState } from 'react';
import MainLayout from '../../layouts/MainLayout';
import InputField from '../../components/InputField'; 
import Button from '../../components/Button'; 
import { useNavigate, useParams } from 'react-router-dom';
import '../../assets/styles/custom-styles.css'; 
import MyAlert from '../../components/MyAlert';
import { usePermissions } from '../../hooks/usePermissions';
import OrganizationService from '../../services/OrganizationService';
import colorToHex from '../../utils/colorToHex';
import { maskCep, removeMask } from '../../utils/maskUtils';

const CreateOrganizationPage = () => {
    const navigate = useNavigate(); 
    const { canAccess } = usePermissions();
    const { applicationId } = useParams();
    const [loadingCep, setLoadingCep] = useState();
    const [formData, setFormData] = useState({
        organization: {
            name: '',
            color: '',
            application_id: applicationId,
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
        },
        location: {
            area: '',
            section: '',
            spot: ''
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

    const [message, setMessage] = useState({ type: '', text: '' });
    const [formErrors, setFormErrors] = useState({}); 

    const handleChange = (e) => {
        const { id, value } = e.target;
        const [section, key] = id.split('.');
        if (section && key) {
            setFormData((prev) => ({
                ...prev,
                [section]: { ...prev[section], [key]: value }
            }));
        } else if (key === 'color') {
            const hexColor = colorToHex(value);
            setFormData((prev) => ({ ...prev, [key]: hexColor }));
        } else {
            setFormData((prev) => ({ ...prev, [key]: value }));
        }
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
            organization: {
                ...formData.organization
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
            const response = await OrganizationService.create(sanitizedData, navigate);
            const { message } = response;

            setMessage({ type: 'success', text: message });
        } catch (error) {
            if (error.status === 422) {
                setFormErrors(error.data || {});
                return;
            }
            setMessage({ type: 'error', text: 'Erro ao realizar o cadastro' });
        }
    };

    const handleBack = () => {
        navigate(`/orgaos/${applicationId}`);  
    };

    return (
        <MainLayout selectedCompany="ALUCOM">
            <div className="container-fluid p-1">
                <div className="text-xs font-weight-bold text-primary text-uppercase mb-1 text-dark">
                    Cadastro de Organizações
                </div>

                <form className="p-3 mt-2 rounded shadow-sm mb-2" style={{ backgroundColor: '#FFFFFF' }} onSubmit={handleSubmit}>
                    {message.text && <MyAlert severity={message.type} message={message.text} onClose={() => setMessage({ type: '', text: '' })} />}

                    <div className="form-row">
                        <div className="d-flex flex-column col-md-6">
                            <InputField label="Nome:" id="organization.name" value={formData.organization.name} onChange={handleChange} error={formErrors['organization.name']} placeholder="Digite o nome" />
                        </div>
                        <div className="d-flex flex-column col-md-6">
                            <InputField label="Cor:" type="color" id="organization.color" value={formData.organization.color} onChange={handleChange} error={formErrors['organization.color']} />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="d-flex flex-column col-md-6">
                            <InputField label="Apelido:" id="address.alias" value={formData.address.alias} placeholder="Digite o apelido" onChange={handleChange} error={formErrors['address.alias']} />
                        </div>
                        <div className="d-flex flex-column col-md-6">
                            <InputField label="CEP:" id="address.zip" value={formData.address.zip} placeholder="Digite o cep" onChange={handleCepChange} error={formErrors['address.zip']} />
                            {loadingCep && <p>Carregando endereço...</p>}
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="d-flex flex-column col-md-6">
                            <InputField label="Cidade:" id="address.city" value={formData.address.city} placeholder="Digite o nome da cidade" onChange={handleChange} error={formErrors['address.city']} />
                        </div>
                        <div className="d-flex flex-column col-md-6">
                            <InputField label="Bairro:" id="address.district" value={formData.address.district} placeholder="Digite o nome do bairro" onChange={handleChange} error={formErrors['address.district']} />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="d-flex flex-column col-md-6">
                            <InputField label="Estado:" id="address.state" value={formData.address.state} placeholder="Digite o nome do estado" onChange={handleChange} error={formErrors['address.state']} />
                        </div>
                        <div className="d-flex flex-column col-md-6">
                            <InputField label="Pais:" id="address.country" value={formData.address.country} placeholder="Digite o nome do pais" onChange={handleChange} error={formErrors['address.country']} />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="d-flex flex-column col-md-12">
                            <InputField label="Detalhes:" id="address.details" value={formData.address.details} placeholder="Digite os detalhes" onChange={handleChange} error={formErrors['address.details']} />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="d-flex flex-column col-md-6">
                            <InputField label="Rua:" id="address.street" value={formData.address.street} placeholder="Digite o nome da rua" onChange={handleChange} error={formErrors['address.street']} />
                        </div>
                        <div className="d-flex flex-column col-md-6">
                            <InputField label="Número:" id="address.number" value={formData.address.number} placeholder="Digite o número" onChange={handleChange} error={formErrors['address.number']} />
                        </div>
                    </div>
                    

                    <div className="form-row">
                        <div className="d-flex flex-column col-md-6">
                            <InputField label="Área:" id="location.area" value={formData.location.area} placeholder="Digite a área" onChange={handleChange} error={formErrors['location.area']} />
                        </div>
                        <div className="d-flex flex-column col-md-6">
                            <InputField label="Seção:" id="location.section" value={formData.location.section} placeholder="Digite a seção" onChange={handleChange} error={formErrors['location.section']} />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="d-flex flex-column col-md-6">
                            <InputField label="Ponto:" id="location.spot" value={formData.location.spot} placeholder="Digite o ponto" onChange={handleChange} error={formErrors['location.spot']} />
                        </div>
                        <div className="d-flex flex-column col-md-6">
                            <InputField label="Detalhes:" id="location.details" value={formData.location.details} placeholder="Digite os detalhes" onChange={handleChange} error={formErrors['location.details']} />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="d-flex flex-column col-md-4">
                            <InputField label="Nome do Contato:" id="contact.name" value={formData.contact.name} placeholder="Digite o nome do contato" onChange={handleChange} error={formErrors['contact.name']} />
                        </div>
                        <div className="d-flex flex-column col-md-4">
                            <InputField label="Sobrenome do Contato:" id="contact.surname" value={formData.contact.surname} placeholder="Digite o sobrenome do contato" onChange={handleChange} error={formErrors['contact.surname']} />
                        </div>
                        <div className="d-flex flex-column col-md-4">
                            <InputField label="E-mail:" id="contact.email" value={formData.contact.email} placeholder="Digite o e-mail" onChange={handleChange} error={formErrors['contact.email']} />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="d-flex flex-column col-md-6">
                            <InputField label="DDD:" id="contact.ddd" value={formData.contact.ddd} placeholder="Digite o DDD" onChange={handleChange} error={formErrors['contact.ddd']} />
                        </div>
                        <div className="d-flex flex-column col-md-6">
                            <InputField label="Telefone Fixo:" id="contact.phone" value={formData.contact.phone} placeholder="Digite o telefone" onChange={handleChange} error={formErrors['contact.phone']} />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="d-flex flex-column col-md-6">
                            <InputField label="DDD:" id="contact.cell_ddd" value={formData.contact.cell_ddd} placeholder="Digite o DDD" onChange={handleChange} error={formErrors['contact.cell_ddd']} />
                        </div>
                        <div className="d-flex flex-column col-md-6">
                            <InputField label="Telefone Celular:" id="contact.cell" value={formData.contact.cell} placeholder="Digite o telefone" onChange={handleChange} error={formErrors['contact.cell']} />
                        </div>
                    </div>


                    <div className="mt-3 form-row gap-2">
                        {canAccess('create applications') && (
                            <Button type="submit" text="Cadastrar Organização" className="btn btn-blue-light fw-semibold" />
                        )}
                        <Button type="button" text="Voltar" className="btn btn-blue-light fw-semibold" onClick={handleBack} />
                    </div>
                </form>
            </div>
        </MainLayout>
    );
};

export default CreateOrganizationPage;

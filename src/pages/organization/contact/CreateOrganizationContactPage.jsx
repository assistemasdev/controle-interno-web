import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MainLayout from '../../../layouts/MainLayout';
import InputField from '../../../components/InputField';
import Button from '../../../components/Button';
import '../../../assets/styles/custom-styles.css';
import MyAlert from '../../../components/MyAlert';
import OrganizationService from '../../../services/OrganizationService';
import { usePermissions } from '../../../hooks/usePermissions';

const CreateOrganizationContactPage = () => {
    const navigate = useNavigate();
    const { applicationId, organizationId } = useParams();
    const { canAccess } = usePermissions();
    const [message, setMessage] = useState(null);
    const [formErrors, setFormErrors] = useState({});
    const [formData, setFormData] = useState({
        name: '',
        surname: '',
        role: '',
        ddd: '',
        phone: '',
        cell_ddd: '',
        cell: '',
        email: ''
    });

    const handleChange = (e) => {
        const { id, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [id]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormErrors({});
        setMessage(null);

        try {
            const response = await OrganizationService.createOrganizationContact(organizationId, formData, navigate);
            setMessage({ type: 'success', text: response.message });

            setFormData({
                name: '',
                surname: '',
                role: '',
                ddd: '',
                phone: '',
                cell_ddd: '',
                cell: '',
                email: ''
            });
        } catch (error) {
            if (error.status === 422) {
                const errors = error.data;
                setFormErrors({
                    name: errors?.name?.[0] || '',
                    surname: errors?.surname?.[0] || '',
                    role: errors?.role?.[0] || '',
                    ddd: errors?.ddd?.[0] || '',
                    phone: errors?.phone?.[0] || '',
                    cell_ddd: errors?.cell_ddd?.[0] || '',
                    cell: errors?.cell?.[0] || '',
                    email: errors?.email?.[0] || ''
                });
                return;
            }
            console.error(error);
            setMessage({ type: 'error', text: error.response?.data?.error || 'Erro ao criar contato' });
        }
    };

    const handleBack = () => {
        navigate(`/orgaos/detalhes/${applicationId}/${organizationId}/`);
    };

    return (
        <MainLayout selectedCompany="ALUCOM">
            <div className="container-fluid p-1">
                <div className="text-xs font-weight-bold text-primary text-uppercase mb-1 text-dark">
                    Cadastro de Contato da Organização
                </div>

                <form className="p-3 mt-2 rounded shadow-sm mb-2" style={{ backgroundColor: '#FFFFFF' }} onSubmit={handleSubmit}>
                    {message && <MyAlert severity={message.type} message={message.text} onClose={() => setMessage(null)} />}
                    
                    <div className="form-row">
                        <div className="d-flex flex-column col-md-6">
                            <InputField
                                label="Nome:"
                                type="text"
                                id="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Digite o nome"
                                error={formErrors.name}
                            />
                        </div>
                        <div className="d-flex flex-column col-md-6">
                            <InputField
                                label="Sobrenome:"
                                type="text"
                                id="surname"
                                value={formData.surname}
                                onChange={handleChange}
                                placeholder="Digite o sobrenome"
                                error={formErrors.surname}
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="d-flex flex-column col-md-6">
                            <InputField
                                label="Cargo:"
                                type="text"
                                id="role"
                                value={formData.role}
                                onChange={handleChange}
                                placeholder="Digite o cargo"
                                error={formErrors.role}
                            />
                        </div>
                        <div className="d-flex flex-column col-md-3">
                            <InputField
                                label="DDD Telefone Fixo:"
                                type="text"
                                id="ddd"
                                value={formData.ddd}
                                onChange={handleChange}
                                placeholder="Digite o DDD"
                                error={formErrors.ddd}
                            />
                        </div>
                        <div className="d-flex flex-column col-md-3">
                            <InputField
                                label="Telefone Fixo:"
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
                        <div className="d-flex flex-column col-md-3">
                            <InputField
                                label="DDD Celular:"
                                type="text"
                                id="cell_ddd"
                                value={formData.cell_ddd}
                                onChange={handleChange}
                                placeholder="Digite o DDD do celular"
                                error={formErrors.cell_ddd}
                            />
                        </div>
                        <div className="d-flex flex-column col-md-3">
                            <InputField
                                label="Celular:"
                                type="text"
                                id="cell"
                                value={formData.cell}
                                onChange={handleChange}
                                placeholder="Digite o celular"
                                error={formErrors.cell}
                            />
                        </div>
                        <div className="d-flex flex-column col-md-6">
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
                        {canAccess('Adicionar contatos de organizações') && (
                            <Button type="submit" text="Cadastrar Contato" className="btn btn-blue-light fw-semibold" />
                        )}
                        <Button type="button" text="Voltar" className="btn btn-blue-light fw-semibold" onClick={handleBack} />
                    </div>
                </form>
            </div>
        </MainLayout>
    );
};

export default CreateOrganizationContactPage;

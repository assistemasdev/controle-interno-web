import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MainLayout from '../../layouts/MainLayout';
import InputField from '../../components/InputField';
import Button from '../../components/Button';
import { CircularProgress } from '@mui/material'; 
import '../../assets/styles/custom-styles.css';
import MyAlert from '../../components/MyAlert';
import OrganizationService from '../../services/OrganizationService';
import InputSelect from '../../components/InputSelect';
import colorToHex from '../../utils/colorToHex';

const EditOrganizationPage = () => {
    const navigate = useNavigate();
    const { applicationId, organizationId } = useParams();
    const [organization, setOrganization] = useState({});
    const [message, setMessage] = useState(null);
    const [formErrors, setFormErrors] = useState({ name: '', color: '', active: '' });
    const [loading, setLoading] = useState(true); 
    const [formData, setFormData] = useState({
        name: '',
        color: '', 
        active: ''
    });

    const handleChange = (e) => {
        const { id, value } = e.target;

        if (id === 'color') {
            const hexColor = colorToHex(value);
            setFormData((prev) => ({ ...prev, [id]: hexColor }));
        } else {
            setFormData((prev) => ({ ...prev, [id]: value }));
        }
    };

    useEffect(() => {
        const fetchData = async () => {
        try {
            await fetchOrganization();
    
        } catch (error) {
            console.error('Erro ao carregar os dados:', error);
        }
        };
    
        fetchData();
    }, [organizationId])


    const fetchOrganization = async () => {
        try {
        const response = await OrganizationService.getById(organizationId, navigate);

        if (response.status === 200) {
            setOrganization(response.result);

            if (response.result.application_id != applicationId) {
                navigate('/aplicacoes/dashboard', {
                    state: { 
                    type: 'error', 
                    message: 'A organização não pertence a esta aplicação. Verifique e tente novamente.' 
                    }
                });
            }
    
            setFormData({
                name: response.result.name,
                color: response.result.color,
                active: response.result.active
            });
        }

        if (response.status === 404) {
            navigate('/aplicacoes/dashboard', {
            state: { 
                type: 'error', 
                message: response.message 
            }
            });
        }

        } catch (error) {
            setMessage({ type:'error', text: error.response?.data?.error || 'Erro ao buscar pela organização' });
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormErrors({  name: '', color: '', active: '' });
        setMessage(null);

        try {

        if(organization.id != organizationId) {
            navigate(`/orgaos/${applicationId}`, {
            state: { 
                type: 'error', 
                message: 'A URL foi alterada ou não corresponde à organização da aplicação. Verifique e tente novamente.' 
            }
            });
        }

        const response = await OrganizationService.update(organizationId, formData, navigate);
        if (response.status === 200) {
            setMessage({ type:'success', text: response.message });
        }

        if (response.status === 422) {
            const errors = response.data;
            setFormErrors({
            color: errors?.color ? errors.color[0] : '',
            name: errors?.name ? errors.name[0] : '',
            active: errors?.active ? errors.active[0] : ''
            });
        }

        if (response.status === 404) {
            setMessage({ type:'error', text: response.message });
        } 

        } catch (error) {
        console.log(error)
        setMessage({ type:'error', text: error.response?.data?.error || 'Erro ao editar a aplicação' });
        }
    };

    const handleBack = () => {
        navigate(`/orgaos/${applicationId}`);
    };

    return (
        <MainLayout selectedCompany="ALUCOM">
            <div className="container-fluid p-1">
                <div className="text-xs font-weight-bold text-primary text-uppercase mb-1 text-dark">
                    Edição de Aplicação
                </div>

                <form className="p-3 mt-2 rounded shadow-sm mb-2" style={{ backgroundColor: '#FFFFFF' }} onSubmit={handleSubmit}>
                    {message && <MyAlert severity={message.type} message={message.text} onClose={() => setMessage('')} />}

                    {loading ? (
                        <div className="d-flex justify-content-center mt-4">
                            <CircularProgress size={50} />
                        </div>
                    ) : (
                        <>
                            <div className="form-row">

                                <div className="d-flex flex-column col-md-6">
                                    <InputField
                                        label='Nome:'
                                        type="text"
                                        id="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Digite o nome da aplicação"
                                        error={formErrors.name}
                                    />
                                </div>
                                <div className="d-flex flex-column col-md-6">
                                    <InputField
                                        label='Cor:'
                                        type="color"
                                        id="color"
                                        value={formData.color}
                                        onChange={handleChange}
                                        placeholder="Digite a cor da organização"
                                        error={formErrors.color}
                                    />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="d-flex flex-column col-md-12">
                                    <InputSelect
                                        label="Ativo"
                                        id="active"
                                        value={formData.active}
                                        onChange={handleChange}
                                        placeholder="Selecione o status"
                                        options={[
                                        { label: 'Ativo', value: 1 },
                                        { label: 'Inativo', value: 0 }
                                        ]}
                                        error={formErrors.active}
                                    />
                                </div>
                            </div>

                            <div className="mt-3 d-flex gap-2">
                                <Button type="submit" text="Atualizar Organização" className="btn btn-blue-light fw-semibold" />
                                <Button type="button" text="Voltar" className="btn btn-blue-light fw-semibold" onClick={handleBack} />
                            </div>
                        </>
                    )}
                </form>
            </div>
        </MainLayout>
    );
};

export default EditOrganizationPage;
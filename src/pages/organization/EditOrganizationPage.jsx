import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MainLayout from '../../layouts/MainLayout';
import InputField from '../../components/InputField';
import { CircularProgress } from '@mui/material'; 
import '../../assets/styles/custom-styles.css';
import MyAlert from '../../components/MyAlert';
import OrganizationService from '../../services/OrganizationService';
import InputSelect from '../../components/InputSelect';
import colorToHex from '../../utils/colorToHex';
import Form from '../../components/Form';
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
        } catch (error) {
            if (error.status === 404) {
                navigate('/aplicacoes/dashboard', {
                state: { 
                    type: 'error', 
                    message: error.message 
                }
                });
                return
            }
            setMessage({ type:'error', text: error.response?.data?.error || 'Erro ao buscar pela organização' });
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
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
            setMessage({ type:'success', text: response.message });
        } catch (error) {
            if (error.status === 422) {
                const errors = error.data;
                setFormErrors({
                color: errors?.color ? errors.color[0] : '',
                name: errors?.name ? errors.name[0] : '',
                active: errors?.active ? errors.active[0] : ''
                });
                return
            }
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
                    Edição de Organização
                </div>

                {message && <MyAlert severity={message.type} message={message.text} onClose={() => setMessage(null)} />}

                {loading ? (
                    <div className="d-flex justify-content-center mt-4">
                        <CircularProgress size={50} />
                    </div>
                ) : (
                    <Form
                        onSubmit={handleSubmit}
                        initialFormData={{ 
                            name: '', 
                            color: '', 
                            active: '' 
                        }}
                        textSubmit="Atualizar"
                        textLoadingSubmit="Atualizando..."
                        handleBack={handleBack}
                    >
                        {({}) => (
                            <>
                                <div className="form-row">
                                    <div className="d-flex flex-column col-md-6">
                                        <InputField
                                            label="Nome:"
                                            type="text"
                                            id="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            placeholder="Digite o nome da organização"
                                            error={formErrors.name}
                                        />
                                    </div>
                                    <div className="d-flex flex-column col-md-6">
                                        <InputField
                                            label="Cor:"
                                            type="color"
                                            id="color"
                                            value={formData.color}
                                            onChange={(e) => {
                                                const { id, value } = e.target;
                                                handleChange({
                                                    target: {
                                                        id,
                                                        value: colorToHex(value),
                                                    },
                                                });
                                            }}
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
                                                { label: 'Inativo', value: 0 },
                                            ]}
                                            error={formErrors.active}
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

export default EditOrganizationPage;

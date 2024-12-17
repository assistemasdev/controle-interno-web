import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MainLayout from '../../../layouts/MainLayout';
import InputField from '../../../components/InputField';
import Button from '../../../components/Button';
import '../../../assets/styles/custom-styles.css';
import MyAlert from '../../../components/MyAlert';
import OrganizationService from '../../../services/OrganizationService';
import { usePermissions } from '../../../hooks/usePermissions';

const EditOrganizationLocationPage = () => {
    const navigate = useNavigate();
    const { applicationId, organizationId, addressId, locationId } = useParams(); 
    const { canAccess } = usePermissions();
    const [message, setMessage] = useState(null);
    const [formErrors, setFormErrors] = useState({});
    const [formData, setFormData] = useState({
        area: '',
        section: '',
        spot: '',
        details: ''
    });

    useEffect(() => {
        const fetchLocationData = async () => {
            try {
                const response = await OrganizationService.showOrganizationLocation(
                    organizationId,
                    addressId,
                    locationId
                );
                const { area, section, spot, details } = response.result;

                setFormData({
                    area: area || '',
                    section: section || '',
                    spot: spot || '',
                    details: details || ''
                });
            } catch (error) {
                setMessage({ type: 'error', text: 'Erro ao carregar os dados da localização' });
                console.error(error);
            }
        };

        fetchLocationData();
    }, [organizationId, addressId, locationId]);

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
            const response = await OrganizationService.updateOrganizationLocation(
                organizationId,
                addressId,
                locationId,
                formData,
                navigate
            );

            setMessage({ type: 'success', text: response.message });
        } catch (error) {
            if (error.status === 422) {
                const errors = error.data;
                setFormErrors({
                    area: errors?.area?.[0] || '',
                    section: errors?.section?.[0] || '',
                    spot: errors?.spot?.[0] || '',
                    details: errors?.details?.[0] || ''
                });
                return;
            }
            console.error(error);
            setMessage({ type: 'error', text: error.response?.data?.error || 'Erro ao atualizar localização' });
        }
    };

    const handleBack = () => {
        navigate(`/orgaos/detalhes/${applicationId}/${organizationId}`);
    };

    return (
        <MainLayout selectedCompany="ALUCOM">
            <div className="container-fluid p-1">
                <div className="text-xs font-weight-bold text-primary text-uppercase mb-1 text-dark">
                    Editar Localização
                </div>

                <form className="p-3 mt-2 rounded shadow-sm mb-2" style={{ backgroundColor: '#FFFFFF' }} onSubmit={handleSubmit}>
                    {message && <MyAlert severity={message.type} message={message.text} onClose={() => setMessage(null)} />}

                    <div className="form-row">
                        <div className="d-flex flex-column col-md-6">
                            <InputField
                                label="Área:"
                                type="text"
                                id="area"
                                value={formData.area}
                                onChange={handleChange}
                                placeholder="Digite a área"
                                error={formErrors.area}
                            />
                        </div>
                        <div className="d-flex flex-column col-md-6">
                            <InputField
                                label="Seção:"
                                type="text"
                                id="section"
                                value={formData.section}
                                onChange={handleChange}
                                placeholder="Digite a seção"
                                error={formErrors.section}
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="d-flex flex-column col-md-6">
                            <InputField
                                label="Ponto:"
                                type="text"
                                id="spot"
                                value={formData.spot}
                                onChange={handleChange}
                                placeholder="Digite o ponto"
                                error={formErrors.spot}
                            />
                        </div>
                        <div className="d-flex flex-column col-md-6">
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

                    <div className="mt-3 d-flex gap-2">
                        {canAccess('Atualizar endereço da organização') && (
                            <Button type="submit" text="Salvar Alterações" className="btn btn-blue-light fw-semibold" />
                        )}
                        <Button type="button" text="Voltar" className="btn btn-blue-light fw-semibold" onClick={handleBack} />
                    </div>
                </form>
            </div>
        </MainLayout>
    );
};

export default EditOrganizationLocationPage;

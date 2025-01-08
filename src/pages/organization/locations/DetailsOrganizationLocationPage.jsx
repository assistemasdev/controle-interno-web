import React, { useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MainLayout from '../../../layouts/MainLayout';
import '../../../assets/styles/custom-styles.css';
import Button from '../../../components/Button';
import DetailsSectionRenderer from '../../../components/DetailsSectionRenderer';
import useOrganizationService from '../../../hooks/useOrganizationService';
import useLoader from '../../../hooks/useLoader';
import useNotification from '../../../hooks/useNotification';
import { locationFields } from '../../../constants/forms/locationFields';
const DetailsOrganizationLocationPage = () => {
    const navigate = useNavigate();
    const { applicationId, organizationId, addressId, locationId } = useParams();
    const { fetchOrganizationLocationById } = useOrganizationService(navigate);
    const { showLoader, hideLoader } = useLoader();
    const { showNotification } = useNotification();

    const [formData, setFormData] = React.useState({
        area: '',
        section: '',
        spot: '',
        details: '',
    });

    const fetchLocationData = useCallback(async () => {
        showLoader();
        try {
            const location = await fetchOrganizationLocationById(organizationId, addressId, locationId);
            setFormData({
                area: location.area || '',
                section: location.section || '',
                spot: location.spot || '',
                details: location.details || '',
            });
        } catch (error) {
            showNotification('error', 'Erro ao carregar os dados da localização.');
        } finally {
            hideLoader();
        }
    }, [fetchOrganizationLocationById, organizationId, addressId, locationId, showLoader, hideLoader, showNotification]);

    useEffect(() => {
        fetchLocationData();
    }, [organizationId, addressId, locationId]);

    const handleBack = useCallback(() => {
        navigate(`/orgaos/detalhes/${applicationId}/${organizationId}/enderecos/${addressId}/localizacoes`);
    }, [navigate, applicationId, organizationId]);

    return (
        <MainLayout selectedCompany="ALUCOM">
            <div className="container-fluid p-1">
                <div className="text-xs font-weight-bold text-primary text-uppercase mb-1 text-dark">
                    Detalhes da Localização
                </div>

                <div className="p-3 mt-2 rounded shadow-sm mb-2" style={{ backgroundColor: '#FFFFFF' }}>

                    <DetailsSectionRenderer sections={locationFields} formData={formData} />

                    <div className="mt-3 d-flex gap-2">
                        <Button type="button" text="Voltar" className="btn btn-blue-light fw-semibold" onClick={handleBack} />
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default DetailsOrganizationLocationPage;

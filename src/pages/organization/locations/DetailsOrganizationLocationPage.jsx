import React, { useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MainLayout from '../../../layouts/MainLayout';
import '../../../assets/styles/custom-styles.css';
import Button from '../../../components/Button';
import DetailsSectionRenderer from '../../../components/DetailsSectionRenderer';
import useBaseService from '../../../hooks/services/useBaseService';
import useLoader from '../../../hooks/useLoader';
import useNotification from '../../../hooks/useNotification';
import { locationFields } from '../../../constants/forms/locationFields';
import useForm from '../../../hooks/useForm';
import { setDefaultFieldValues } from '../../../utils/objectUtils';
import { entities } from '../../../constants/entities';
import PageHeader from '../../../components/PageHeader';

const DetailsOrganizationLocationPage = () => {
    const navigate = useNavigate();
    const { organizationId, addressId, locationId } = useParams();
    const { getByColumn: fetchById } = useBaseService(navigate);
    const { showLoader, hideLoader } = useLoader();
    const { showNotification } = useNotification();
    const { formData, formatData } = useForm(setDefaultFieldValues(locationFields));

    const fetchLocationData = useCallback(async () => {
        showLoader();
        try {
            const response = await fetchById(entities.organizations.addresses.locations(organizationId).getByColumn(addressId, locationId));
            formatData(response.result, locationFields);
        } catch (error) {
            showNotification('error', 'Erro ao carregar os dados da localização.');
        } finally {
            hideLoader();
        }
    }, [fetchById, organizationId, addressId, locationId, showLoader, hideLoader, showNotification]);

    useEffect(() => {
        fetchLocationData();
    }, [organizationId, addressId, locationId]);

    const handleBack = useCallback(() => {
        navigate(`/organizacoes/detalhes/${organizationId}/enderecos/${addressId}/localizacoes`);
    }, [navigate, organizationId]);

    return (
        <MainLayout selectedCompany="ALUCOM">
            <PageHeader 
                title="Detalhes da Localização" 
                showBackButton={true} 
                backUrl={`/organizacoes/detalhes/${organizationId}/enderecos/${addressId}/localizacoes`} 
            />
            <div className="container-fluid p-1">
                <DetailsSectionRenderer sections={locationFields} formData={formData} />
            </div>
        </MainLayout>
    );
};

export default DetailsOrganizationLocationPage;

import React, { useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MainLayout from '../../../layouts/MainLayout';
import '../../../assets/styles/custom-styles.css';
import useLoader from '../../../hooks/useLoader';
import useNotification from '../../../hooks/useNotification';
import { maskCep } from '../../../utils/maskUtils';
import DetailsSectionRenderer from '../../../components/DetailsSectionRenderer';
import { addressFields } from '../../../constants/forms/addressFields';
import useForm from '../../../hooks/useForm';
import { setDefaultFieldValues } from '../../../utils/objectUtils';
import useBaseService from '../../../hooks/services/useBaseService';
import { entities } from '../../../constants/entities';
import PageHeader from '../../../components/PageHeader'; 

const OrganizationAddressDetailsPage = () => {
    const navigate = useNavigate();
    const { organizationId, addressId } = useParams();
    const { showLoader, hideLoader } = useLoader();
    const { showNotification } = useNotification();
    const { getByColumn: fetchById } = useBaseService(navigate);
    const { formData, setFormData, formatData } = useForm(setDefaultFieldValues(addressFields));
    
    const fetchAddress = useCallback(async () => {
        showLoader();
        try {
            const response = await fetchById(entities.organizations.addresses.getByColumn(organizationId,addressId));
            formatData(response.result, addressFields)
            setFormData(prev => ({
                ...prev,
                zip: maskCep(response.result.zip)
            }));
        } catch (error) {
            console.log(error)
            showNotification('error', 'Erro ao carregar os dados do endereço.');
        } finally {
            hideLoader();
        }
    }, [fetchById, organizationId, addressId, showLoader, hideLoader, showNotification]);

    useEffect(() => {
        fetchAddress();
    }, [organizationId, addressId]);

    const handleBack = useCallback(() => {
        navigate(`/organizacoes/detalhes/${organizationId}`);
    }, [navigate, organizationId]);

    return (
        <MainLayout selectedCompany="ALUCOM">
            <PageHeader 
                title="Detalhes do Endereço da Organização" 
                showBackButton={true} 
                backUrl={`/organizacoes/detalhes/${organizationId}/`}
            />
            <div className="container-fluid p-1">

                <div className="p-3 mt-2 rounded shadow-sm mb-2" style={{ backgroundColor: '#FFFFFF' }}>
                    <DetailsSectionRenderer sections={addressFields} formData={formData} handleBack={handleBack} />
                </div>
            </div>
        </MainLayout>
    );
};

export default OrganizationAddressDetailsPage;

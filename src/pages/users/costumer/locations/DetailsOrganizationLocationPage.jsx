import React, { useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MainLayout from '../../../../layouts/MainLayout';
import '../../../../assets/styles/custom-styles.css';
import useLoader from '../../../../hooks/useLoader';
import useNotification from '../../../../hooks/useNotification';
import useForm from '../../../../hooks/useForm';
import { locationFields } from '../../../../constants/forms/locationFields';
import DetailsSectionRenderer from '../../../../components/DetailsSectionRenderer';
import useBaseService from '../../../../hooks/services/useBaseService';
import { setDefaultFieldValues } from '../../../../utils/objectUtils';
import { entities } from '../../../../constants/entities';
import PageHeader from '../../../../components/PageHeader';

const DetailsCustomerLocationPage = () => {
    const navigate = useNavigate();
    const { id, addressId, locationId } = useParams(); 
    const { showLoader, hideLoader } = useLoader();
    const { showNotification } = useNotification();
    const { formData, setFormData } = useForm(setDefaultFieldValues(locationFields));
    const { getByColumn: fetchById } = useBaseService(navigate);

    useEffect(() => {
        fetchLocationData();
    }, [id, addressId]);

    const fetchLocationData = useCallback(async () => {
        showLoader();
        try {
            const response = await fetchById(entities.customers.addresses.locations(id).getByColumn(addressId, locationId));
            setFormData(response.result);
        } catch (error) {
            console.error(error);
        } finally {
            hideLoader();
        }
    }, [id, addressId, locationId, fetchById, setFormData, showLoader, hideLoader, showNotification]);

    return (
        <MainLayout selectedCompany="ALUCOM">
            <PageHeader title="Detalhes da Localização" showBackButton={true} backUrl={`/clientes/detalhes/${id}/enderecos/${addressId}/localizacoes`} />
            <div className="container-fluid p-1">
                <DetailsSectionRenderer
                    formData={formData}
                    sections={locationFields}
                />
            </div>
        </MainLayout>
    );
};

export default DetailsCustomerLocationPage;

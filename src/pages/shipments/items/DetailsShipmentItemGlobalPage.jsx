import React, { useEffect } from 'react';
import MainLayout from '../../../layouts/MainLayout';
import { useNavigate, useParams } from 'react-router-dom';
import '../../../assets/styles/custom-styles.css';
import useNotification from '../../../hooks/useNotification';
import useLoader from '../../../hooks/useLoader';
import useForm from '../../../hooks/useForm';
import { detailsShipmentItemFields } from "../../../constants/forms/shipmentItemFields";
import { setDefaultFieldValues } from '../../../utils/objectUtils';
import useBaseService from '../../../hooks/services/useBaseService';
import { entities } from '../../../constants/entities';
import PageHeader from '../../../components/PageHeader';
import DetailsSectionRenderer from '../../../components/DetailsSectionRenderer';

const DetailsShipmentItemGlobalPage = () => {
    const { id, shipmentItemId } = useParams();
    const navigate = useNavigate();
    const { showNotification } = useNotification();
    const { 
        getByColumn: fetchShipmentItemById,
        getByColumn: fetchMovementById,
        getByColumn: fetchAddress,
        getByColumn: fetchLocation,
    } = useBaseService(navigate);
    const { showLoader, hideLoader } = useLoader();
    const { formData, formatData, setFormData } = useForm(setDefaultFieldValues(detailsShipmentItemFields));

    useEffect(() => {
        const fetchData = async () => {
            try {
                showLoader();

                const [
                    response,
                ] = await Promise.all([
                    fetchShipmentItemById(entities.shipments.items.getByColumn(id, shipmentItemId)),
                ]);

                const addressReponse = await fetchAddress(entities.addresses.getByColumn(response.result.address_id));
                const locationsReponse = await fetchLocation(entities.addresses.locations.getByColumn(response.result.address_id));
                const address = addressReponse.result;
                const location = locationsReponse.result;

                formatData(response.result, detailsShipmentItemFields);
                setFormData((prev) => ({
                    ...prev,
                    address_id: (address.street && address.city && address.state) ? `${address.street}, ${address.city} - ${address.state}` : '',
                    location_id: (location.area && location.section && location.spot) ? `${location.area}, ${location.section} - ${location.spot}` : ''
                }));
            } catch (error) {
                const errorMessage = error.response?.data?.error || 'Erro ao carregar os dados.';
                showNotification('error', errorMessage);
                console.error('Erro no carregamento dos dados:', error);
            } finally {
                hideLoader();
            }
        };
        fetchData();
    }, []);

    return (
        <MainLayout selectedCompany="ALUCOM">
            <PageHeader title="Detalhes do Item do Carregamento" showBackButton={true} backUrl={`/carregamentos/${id}/detalhes/`}/>
            <div className="container-fluid p-1">
                <DetailsSectionRenderer formData={formData} sections={detailsShipmentItemFields}/>
            </div>
        </MainLayout>
    );
};

export default DetailsShipmentItemGlobalPage;

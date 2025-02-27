import React, { useEffect } from 'react';
import MainLayout from '../../../../../layouts/MainLayout';
import { useNavigate, useParams } from 'react-router-dom';
import '../../../../../assets/styles/custom-styles.css';
import useNotification from '../../../../../hooks/useNotification';
import useLoader from '../../../../../hooks/useLoader';
import useForm from '../../../../../hooks/useForm';
import { detailsShipmentItemFields } from "../../../../../constants/forms/shipmentItemFields";
import { setDefaultFieldValues } from '../../../../../utils/objectUtils';
import useBaseService from '../../../../../hooks/services/useBaseService';
import { entities } from '../../../../../constants/entities';
import PageHeader from '../../../../../components/PageHeader';
import DetailsSectionRenderer from '../../../../../components/DetailsSectionRenderer';

const DetailsShipmentItemPage = () => {
    const { id, shipmentId, shipmentItemId } = useParams();
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
                    responseMovement,
                ] = await Promise.all([
                    fetchShipmentItemById(entities.movements.shipments.items(id).getByColumn(shipmentId, shipmentItemId)),
                    fetchMovementById(entities.movements.getByColumn(id)),
                ]);

                const addressReponse = await fetchAddress(entities.customers.addresses.getByColumn(responseMovement.result.customer_id, response.result.address_id));
                const locationsReponse = await fetchLocation(entities.customers.addresses.locations(responseMovement.result.customer_id).getByColumn(addressReponse.result.id, response.result.location_id));
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
            <PageHeader title="Detalhes do Item do Carregamento" showBackButton={true} backUrl={`/movimentos/${id}/carregamentos/${shipmentId}/itens/`}/>
            <div className="container-fluid p-1">
                <DetailsSectionRenderer formData={formData} sections={detailsShipmentItemFields}/>
            </div>
        </MainLayout>
    );
};

export default DetailsShipmentItemPage;

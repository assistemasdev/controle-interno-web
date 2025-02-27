import React, { useEffect } from 'react';
import MainLayout from '../../../../layouts/MainLayout';
import { useNavigate, useParams } from 'react-router-dom';
import '../../../../assets/styles/custom-styles.css';
import useForm from '../../../../hooks/useForm';
import { DetailsOsItemFields } from '../../../../constants/forms/osItemFields';
import { setDefaultFieldValues } from '../../../../utils/objectUtils';
import useBaseService from '../../../../hooks/services/useBaseService';
import { entities } from '../../../../constants/entities';
import useLoader from '../../../../hooks/useLoader';
import useNotification from '../../../../hooks/useNotification';
import DetailsSectionRenderer from '../../../../components/DetailsSectionRenderer';
import PageHeader from '../../../../components/PageHeader';

const DetailsItemOrderServicePage = () => {
    const { id, osItemId } = useParams();
    const navigate = useNavigate();
    const { showLoader, hideLoader } = useLoader();
    const { showNotification } = useNotification();
    const { 
        getByColumn: fetchOsItemById,
        getByColumn: fetchMovementTypeById,
        getByColumn: fetchProductById,
    } = useBaseService(navigate);
    const { formData, setFormData } = useForm(setDefaultFieldValues(DetailsOsItemFields));

    useEffect(() => {
        fetchData();
    }, [])

    const fetchData = async () => {
        try {
            showLoader()
            const [
                contractOsItemResponse,
            ] = await Promise.all([
                fetchOsItemById(entities.orders.items.getByColumn(id, osItemId)),
            ])

            const [
                movementTypeResponse,
                productResponse,
            ] = await Promise.all([
                fetchMovementTypeById(entities.orders.itemsTypes.getByColumn(null, contractOsItemResponse.result.movement_type_id)),
                fetchProductById(entities.products.getByColumn(contractOsItemResponse.result.product_id)),
            ]);
            
            setFormData({
                address: contractOsItemResponse.result.address_id,
                details: contractOsItemResponse.result.details,
                identify: contractOsItemResponse.result.item_id,
                location: contractOsItemResponse.result.location_id,
                movementType: movementTypeResponse.result.name,
                product: productResponse.result.name,
                quantity: contractOsItemResponse.result.quantity
            });

        } catch (error) {
            console.log(error)
            showNotification('error', 'error ao carregar os dados')
        } finally {
            hideLoader()
        }
    }

    return (
        <MainLayout selectedCompany="ALUCOM">
            <PageHeader title="Detalhes do Item da Ordem de Serviço" showBackButton={true} backUrl={`/ordens-servicos/${id}/detalhes/`} />
            <div className="container-fluid p-1">
                <DetailsSectionRenderer sections={DetailsOsItemFields} formData={formData}/>
            </div>
        </MainLayout>
    );
};

export default DetailsItemOrderServicePage;

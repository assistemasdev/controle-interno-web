import React, { useCallback, useEffect } from 'react';
import MainLayout from '../../../../../layouts/MainLayout';
import { useNavigate, useParams } from 'react-router-dom';
import '../../../../../assets/styles/custom-styles.css';
import useForm from '../../../../../hooks/useForm';
import { DetailsOsItemFields } from '../../../../../constants/forms/osItemFields';
import { setDefaultFieldValues } from '../../../../../utils/objectUtils';
import useBaseService from '../../../../../hooks/services/useBaseService';
import { entities } from '../../../../../constants/entities';
import useLoader from '../../../../../hooks/useLoader';
import useNotification from '../../../../../hooks/useNotification';
import DetailsSectionRenderer from '../../../../../components/DetailsSectionRenderer';
import PageHeader from '../../../../../components/PageHeader';

const DetailsContractOsItensPage = () => {
    const { id, contractOsId, contractOsItemId } = useParams();
    const navigate = useNavigate();
    const { showLoader, hideLoader } = useLoader();
    const { showNotification } = useNotification();
    const { 
        getByColumn: fetchOsItemById,
        getByColumn: fetchMovementTypeById,
        getByColumn: fetchProductById,
        getByColumn: fetchAddress,
        getByColumn: fetchLocation,
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
                fetchOsItemById(entities.contracts.orders.items(id).getByColumn(contractOsId, contractOsItemId)),
            ])
                    
            setFormData({
                address:  contractOsItemResponse.result.address_name? contractOsItemResponse.result.address_name : '',
                details: contractOsItemResponse.result.details,
                identify: contractOsItemResponse.result.item_id,
                location: contractOsItemResponse.result.location_name? contractOsItemResponse.result.location_name : '',
                movementType: contractOsItemResponse.result.movement_type_name,
                product: contractOsItemResponse.result.product_name? contractOsItemResponse.result.product_name : '',
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
            <PageHeader title="Detalhes do Item da Ordem de Serviço" showBackButton={true} backUrl={`/contratos/${id}/ordens-servicos/detalhes/${contractOsId}`} />
            <div className="container-fluid p-1">
                <DetailsSectionRenderer sections={DetailsOsItemFields} formData={formData}/>
            </div>
        </MainLayout>
    );
};

export default DetailsContractOsItensPage;

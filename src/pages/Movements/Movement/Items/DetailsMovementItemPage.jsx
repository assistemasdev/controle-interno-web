import React, { useEffect, useCallback, useState } from 'react';
import MainLayout from '../../../../layouts/MainLayout';
import { useNavigate, useParams } from 'react-router-dom';
import '../../../../assets/styles/custom-styles.css';
import useNotification from '../../../../hooks/useNotification';
import useLoader from '../../../../hooks/useLoader';
import useForm from '../../../../hooks/useForm';
import { detailsMovementItemFields } from "../../../../constants/forms/movementItemFields";
import { setDefaultFieldValues } from '../../../../utils/objectUtils';
import useBaseService from '../../../../hooks/services/useBaseService';
import { entities } from '../../../../constants/entities';
import PageHeader from '../../../../components/PageHeader';
import DetailsSectionRenderer from '../../../../components/DetailsSectionRenderer';

const DetailsMovementItemPage = () => {
    const { id, movementProductId,} = useParams();
    const navigate = useNavigate();
    const { showNotification } = useNotification();
    const { 
        get: fetchOrganizations,
        getByColumn: fetchProductByColumn,
        getByColumn: fetchMovementTypeByColumn,
        getByColumn: fetchMovementItemById,
    } = useBaseService(navigate);
    const { showLoader, hideLoader } = useLoader();
    const { formData, setFormData, formatData } = useForm(setDefaultFieldValues(detailsMovementItemFields));

    const mapOrganizations = useCallback((organizations) => {
        return Object.fromEntries(organizations.map((organization) => [organization.id, organization.name]));
    }, []);
    
    useEffect(() => {
        setFormData(prev => ({
            ...prev,
            items: []
        }))

        const fetchData = async () => {
            try {
                showLoader();
                const [
                    response
                ] = await Promise.all([
                    fetchMovementItemById(entities.movements.items.getByColumn(id, movementProductId)),
                ]);

                const [
                    organizationsResponse,
                    productResponse,
                    movementTypeResponse,
                ] = await Promise.all([
                    fetchOrganizations(entities.organizations.get),
                    fetchProductByColumn(entities.products.getByColumn(response.result.product_id)),
                    fetchMovementTypeByColumn(entities.movements.types.getByColumn(null, response.result.movement_type_id)),
                ])
                const organizationsMap = mapOrganizations(organizationsResponse.result.data)
                formatData(response.result, detailsMovementItemFields)
                setFormData((prev) => ({
                    ...prev,
                    movement_type_id: movementTypeResponse.result.name,
                    product_id: productResponse.result.name,
                    new_organization_id: response.result.new_organization_id ? organizationsMap[response.result.new_organization_id] : '-',
                    old_organization_id: response.result.old_organization_id ? organizationsMap[response.result.old_organization_id] : '-'
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
            <PageHeader title="Editar Produto do Movimento" showBackButton={true} backUrl={`/movimentos/detalhes/${id}`} />
            <div className="container-fluid p-1">
                <DetailsSectionRenderer sections={detailsMovementItemFields} formData={formData}/>
            </div>
        </MainLayout>
    );
};

export default DetailsMovementItemPage;

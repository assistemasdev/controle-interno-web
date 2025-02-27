import React, { useEffect, useState } from 'react';
import MainLayout from '../../../layouts/MainLayout';
import { useNavigate, useParams } from 'react-router-dom';
import '../../../assets/styles/custom-styles.css';
import useNotification from '../../../hooks/useNotification';
import useLoader from '../../../hooks/useLoader';
import useForm from '../../../hooks/useForm';
import { setDefaultFieldValues } from '../../../utils/objectUtils';
import { detailsProductFields } from '../../../constants/forms/productFields';
import DetailsSectionRenderer from '../../../components/DetailsSectionRenderer';
import useBaseService from '../../../hooks/services/useBaseService';
import { entities } from '../../../constants/entities';
import PageHeader from '../../../components/PageHeader';

const DetailsProductPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [productDetails, setProductDetails] = useState({});
    const [productGroups, setProductGroups] = useState([]);
    const { showNotification } = useNotification();
    const { showLoader, hideLoader } = useLoader();
    const { formData, setFormData } = useForm(setDefaultFieldValues(detailsProductFields))
    const { 
        getByColumn: fetchById,
        get: fetchProductGroups,
        getByColumn: fetchOrganizationById,
        getByColumn: fetchConditionById,
        getByColumn: fetchCategoryById,
        getByColumn: fetchSupplierById,
        getByColumn: fetchTypeById,
        getByColumn: fetchStatusById,
        getByColumn: fetchAddressById,
        getByColumn: fetchLocationById,
    } = useBaseService(navigate);

    useEffect(() => {
        const fetchProductDetails = async () => {
            try {
                showLoader();
                const [productResponse, productGroupsResponse] = await Promise.all([
                    fetchById(entities.products.getByColumn(id)),
                    fetchProductGroups(entities.products.groups.get(id)),
                ]);
    
                setProductDetails(productResponse.result);
                setProductGroups(productGroupsResponse.result);
            } catch (error) {
                console.error('Erro ao carregar detalhes do produto:', error);
                showNotification('error', 'Erro ao carregar os dados.');
            } finally {
                hideLoader();
            }
        };
    
        fetchProductDetails();
    }, [id, navigate]);

    useEffect(() => {
        if (!productDetails || Object.keys(productDetails).length === 0) return;
    
        console.log(productDetails)
        const fetchOptions = async () => {
            showLoader();
            try {
                const responses = await Promise.all([
                    productDetails.current_organization_id
                        ? fetchOrganizationById(entities.organizations.getByColumn(productDetails.current_organization_id))
                        : Promise.resolve({ result: { id: null, name: 'Organização não disponível' } }),
                    productDetails.owner_organization_id 
                        ? fetchOrganizationById(entities.organizations.getByColumn(productDetails.owner_organization_id))
                        : Promise.resolve({ result: { id: null, name: 'Organização não disponível' } }),
                    productDetails.supplier_id
                        ? fetchSupplierById(entities.suppliers.getByColumn(productDetails.supplier_id))
                        : Promise.resolve({ result: { id: null, name: 'Fornecedor não disponível' } }),
    
                    productDetails.condition_id
                        ? fetchConditionById(entities.conditions.getByColumn(productDetails.condition_id))
                        : Promise.resolve({ result: { id: null, name: 'Condição não disponível' } }),
    
                    productDetails.category_id
                        ? fetchCategoryById(entities.categories.getByColumn(productDetails.category_id))
                        : Promise.resolve({ result: { id: null, name: 'Categoria não disponível' } }),
    
                    productDetails.type_id
                        ? fetchTypeById(entities.types.getByColumn(productDetails.type_id))
                        : Promise.resolve({ result: { id: null, name: 'Tipo não disponível' } }),
    
                    productDetails.status_id
                        ? fetchStatusById(entities.status.getByColumn(productDetails.status_id))
                        : Promise.resolve({ result: { id: null, name: 'Status não disponível' } }),
                    productDetails.address_id
                        ? fetchAddressById(entities.addresses.getByColumn(productDetails.address_id))
                        : Promise.resolve({ result: { id: null, name: 'Endereço não disponível' } }),
                    productDetails.location_id
                        ? fetchLocationById(entities.addresses.locations.getByColumn(productDetails.address_id, productDetails.location_id))
                        : Promise.resolve({ result: { id: null, name: 'Endereço não disponível' } }),
                ]);
                const [
                    organizationResponse,
                    ownerResponse,
                    supplierResponse,
                    conditionResponse,
                    categoryResponse,
                    typeResponse,
                    statusResponse,
                    addressResponse,
                    locationResponse
                ] = responses;
                const address = addressResponse.result
                const location = locationResponse.result

                setFormData({
                    product: {
                        name: productDetails.name || 'N/A',
                        number: productDetails.number || 'N/A',
                        serial_number: productDetails.serial_number || 'N/A',
                        current_organization: organizationResponse.result.name|| 'N/A',
                        owner_organization: ownerResponse.result.name || 'N/A',
                        supplier: supplierResponse.result.name || 'N/A',
                        address_id: (address.street && address.city && address.state) ? `${address.street}, ${address.city} - ${address.state}` : '',
                        location_id: `${location.area}${location.section ? `, ${location.section}` : ''}${location.spot ? ` - ${location.spot}` : ''}`,
                        purchase_date: productDetails.purchase_date || 'N/A',
                        warranty_date: productDetails.warranty_date || 'N/A',
                        condition: conditionResponse.result.name || 'N/A',
                        type: typeResponse.result.name || 'N/A',
                        category: categoryResponse.result.name || 'N/A',
                        status: statusResponse.result.name || 'N/A',
                        groups: productGroups && productGroups.length ? productGroups.map(group => group.name).join(' - ') : 'N/A',
                    }
                });
            } catch (error) {
                console.error('Erro ao buscar opções:', error);
            } finally {
                hideLoader();
            }
        };
    
        fetchOptions();
    }, [productDetails]);

    return (
        <MainLayout selectedCompany="ALUCOM">
            <PageHeader title="Detalhes do Produto" showBackButton={true} backUrl="/produtos/" /> 

            <div className="container-fluid p-1">
                <DetailsSectionRenderer formData={formData} sections={detailsProductFields} />
            </div>
        </MainLayout>
    );
};

export default DetailsProductPage;

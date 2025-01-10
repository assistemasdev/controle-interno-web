import React, { useEffect, useState } from 'react';
import MainLayout from '../../layouts/MainLayout';
import { useNavigate, useParams } from 'react-router-dom';
import '../../assets/styles/custom-styles.css';
import ProductService from '../../services/ProductService';
import OrganizationService from '../../services/OrganizationService';
import SupplierService from '../../services/SupplierService';
import ConditionService from '../../services/ConditionService';
import CategoryService from '../../services/CategoryService';
import TypeService from '../../services/TypeService';
import StatusService from '../../services/StatusService';
import Button from '../../components/Button';
import useNotification from '../../hooks/useNotification';
import useLoader from '../../hooks/useLoader';
import useForm from '../../hooks/useForm';
import { setDefaultFieldValues } from '../../utils/objectUtils';
import { detailsProductFields } from '../../constants/forms/productFields';
import DetailsSectionRenderer from '../../components/DetailsSectionRenderer';

const DetailsProductPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [productDetails, setProductDetails] = useState({});
    const [productGroups, setProductGroups] = useState([]);
    const { showNotification } = useNotification();
    const { showLoader, hideLoader } = useLoader();
    const { formData, setFormData } = useForm(setDefaultFieldValues(detailsProductFields))

    useEffect(() => {
        const fetchProductDetails = async () => {
            try {
                showLoader();
                const [productResponse, productGroupsResponse] = await Promise.all([
                    ProductService.getById(id, navigate),
                    ProductService.getProductGroupsById(id, navigate),
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
    
        const fetchOptions = async () => {
            showLoader();
            try {
                const responses = await Promise.all([
                    productDetails.current_organization_id
                        ? OrganizationService.getById(productDetails.current_organization_id)
                        : Promise.resolve({ result: { id: null, name: 'Organização não disponível' } }),
                    productDetails.owner_organization_id 
                        ? OrganizationService.getById(productDetails.owner_organization_id)
                        : Promise.resolve({ result: { id: null, name: 'Organização não disponível' } }),
                    productDetails.supplier_id
                        ? SupplierService.getById(productDetails.supplier_id)
                        : Promise.resolve({ result: { id: null, name: 'Fornecedor não disponível' } }),
    
                    productDetails.condition_id
                        ? ConditionService.getById(productDetails.condition_id)
                        : Promise.resolve({ result: { id: null, name: 'Condição não disponível' } }),
    
                    productDetails.category_id
                        ? CategoryService.getById(productDetails.category_id)
                        : Promise.resolve({ result: { id: null, name: 'Categoria não disponível' } }),
    
                    productDetails.type_id
                        ? TypeService.getById(productDetails.type_id)
                        : Promise.resolve({ result: { id: null, name: 'Tipo não disponível' } }),
    
                    productDetails.status_id
                        ? StatusService.getById(productDetails.status_id)
                        : Promise.resolve({ result: { id: null, name: 'Status não disponível' } }),
                ]);
    
                const [
                    organizationResponse,
                    ownerResponse,
                    supplierResponse,
                    conditionResponse,
                    categoryResponse,
                    typeResponse,
                    statusResponse,
                ] = responses;
    
                setFormData({
                    product: {
                        name: productDetails.name || 'N/A',
                        number: productDetails.number || 'N/A',
                        serial_number: productDetails.serial_number || 'N/A',
                        current_organization: organizationResponse.result.name|| 'N/A',
                        owner_organization: ownerResponse.result.name || 'N/A',
                        supplier: supplierResponse.result.name || 'N/A',
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

    const handleBack = () => {
        navigate(`/produtos/`);
    };

    return (
        <MainLayout selectedCompany="ALUCOM">
            <div className="container-fluid p-1">
                <div className="text-xs font-weight-bold text-primary text-uppercase mb-1 text-dark">
                    Detalhes do Produto
                </div>

                <DetailsSectionRenderer formData={formData} sections={detailsProductFields}/>

                <div className="form-row gap-2">
                    <Button type="button" text="Voltar" className="btn btn-blue-light fw-semibold" onClick={handleBack} />
                </div>
            </div>
        </MainLayout>
    );
};

export default DetailsProductPage;

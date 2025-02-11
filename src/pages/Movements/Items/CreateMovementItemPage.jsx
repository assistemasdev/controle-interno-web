import React, { useEffect, useCallback, useState } from 'react';
import MainLayout from '../../../layouts/MainLayout';
import { useNavigate, useParams } from 'react-router-dom';
import '../../../assets/styles/custom-styles.css';
import useNotification from '../../../hooks/useNotification';
import useLoader from '../../../hooks/useLoader';
import useForm from '../../../hooks/useForm';
import Form from '../../../components/Form'; 
import FormSection from '../../../components/FormSection';
import { movementItemFields } from "../../../constants/forms/movementItemFields";
import { setDefaultFieldValues } from '../../../utils/objectUtils';
import useBaseService from '../../../hooks/services/useBaseService';
import { entities } from '../../../constants/entities';
import PageHeader from '../../../components/PageHeader';

const CreateMovementItemPage = () => {
    const { id,orderServiceId} = useParams();
    const navigate = useNavigate();
    const { showNotification } = useNotification();
    const { 
        post: create, 
        get: fetchOrganizations,
        get: fetchProducts,
        get: fetchTypesItemsOs,
        get: fetchItemsOrdersServices,
        formErrors,
        setFormErrors
    } = useBaseService(entities.contracts, navigate);
    const { showLoader, hideLoader } = useLoader();
    const { formData, handleChange, resetForm, setFormData } = useForm(setDefaultFieldValues(movementItemFields));
    const [organizations, setOrganizations] = useState([]);
    const [products, setProducts] = useState([]);
    const [typesItemsOs, setTypesItemsOs] = useState([]);
    const [itemsOrdersServices, setItemsOrdersServices] = useState([]);
    const [allFieldsData, setAllFieldsData] = useState({});
    
    useEffect(() => {
        setFormData(prev => ({
            ...prev,
            items: []
        }))

        const fetchData = async () => {
            try {
                showLoader();
                const [
                    organizationsResponse,
                    productsResponse,
                    typesItemsOsResponse,
                    response,
                ] = await Promise.all([
                    fetchOrganizations(entities.organizations.get, {deleted_at: false}),
                    fetchProducts(entities.products.get, {deleted_at: false}),
                    fetchTypesItemsOs(entities.orders.itemsTypes.get(), {deleted_at: false}),
                    fetchItemsOrdersServices(entities.orders.items.get(orderServiceId), {deleted_at: false})
                ]);

                setItemsOrdersServices(response.result.data.map(orderItemService => ({ value: orderItemService.id, label: orderItemService.id })))
                setOrganizations(organizationsResponse.result.data.map(org => ({ value: org.id, label: org.name })));
                setProducts(productsResponse.result.data.map(product => ({ value: product.id, label: product.name })));
                setTypesItemsOs(typesItemsOsResponse.result.data.map(typeItemOs => ({ value: typeItemOs.id, label: typeItemOs.name })))
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

    const getOptions = (fieldId) => {
        switch (fieldId) {
            case "service_order_item_type_id":
                return typesItemsOs || [];
            case "product_id":
                return products || [];
            case "service_order_item_id":
                return itemsOrdersServices || [];
            case "new_organization_id":
                return organizations || [];
            case "old_organization_id":
                return organizations || [];
            default:
                return [];
        }
    };
    
    const getSelectedValue = (fieldId) => {
        const key = fieldId;
        if (key) {
            const value = formData[key];
            return getOptions(fieldId).find((option) => option.value === value) || null;
        }
        return null;
    };

    const handleSubmit = async () => {
        showLoader();
        try {
            const success = await create(entities.movements.items.create(id), formData);
            if (success) {
                resetForm();
            }
        } catch (error) {
            console.error('Error creating movement:', error);
        } finally {
            hideLoader();
        }
    };

    const handleBack = () => {
        navigate(`/movimentos/detalhes/${id}`);  
    };

    const handleFieldChange = useCallback((fieldId, value, field) => {
        handleChange(fieldId, value);    
    }, [getOptions]);

    return (
        <MainLayout selectedCompany="ALUCOM">
            <PageHeader title="Adicionar Produto No Movimento" showBackButton={true} backUrl={`/movimentos/detalhes/${id}`} />
            <div className="container-fluid p-1">
                <Form
                    initialFormData={formData}
                    onSubmit={handleSubmit}
                    textSubmit="Cadastrar"
                    textLoadingSubmit="Cadastrando..."
                    handleBack={handleBack}
                >
                    {() => 
                        movementItemFields.map((section) => (
                            <FormSection
                                key={section.section}
                                section={section}
                                formData={formData}
                                handleFieldChange={handleFieldChange}
                                getOptions={getOptions}
                                getSelectedValue={getSelectedValue}
                                formErrors={formErrors}
                                setFormData={setFormData}
                                allFieldsData={allFieldsData}
                                setAllFieldsData={setAllFieldsData}
                                setFormErrors={setFormErrors}
                            />
                        ))
                    }
                </Form>
            </div>
        </MainLayout>
    );
};

export default CreateMovementItemPage;

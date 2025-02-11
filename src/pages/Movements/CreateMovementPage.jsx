import React, { useEffect, useCallback, useState } from 'react';
import MainLayout from '../../layouts/MainLayout';
import { useNavigate } from 'react-router-dom';
import '../../assets/styles/custom-styles.css';
import useNotification from '../../hooks/useNotification';
import useLoader from '../../hooks/useLoader';
import useForm from '../../hooks/useForm';
import Form from '../../components/Form'; 
import FormSection from '../../components/FormSection';
import { movementFields } from "../../constants/forms/movementFields";
import { setDefaultFieldValues } from '../../utils/objectUtils';
import useBaseService from '../../hooks/services/useBaseService';
import { entities } from '../../constants/entities';
import PageHeader from '../../components/PageHeader';
import { transformValues, removeEmptyValues } from '../../utils/objectUtils';

const CreateMovementPage = () => {
    const navigate = useNavigate();
    const { showNotification } = useNotification();
    const { 
        post: create, 
        get: fetchOrganizations,
        get: fetchCustomers,
        get: fetchProducts,
        get: fetchTypesItemsOs,
        get: fetchOrdersServices,
        get: fetchItemsOrdersServices,
        formErrors,
        setFormErrors
    } = useBaseService(entities.contracts, navigate);
    const { showLoader, hideLoader } = useLoader();
    const { formData, handleChange, resetForm, setFormData } = useForm(setDefaultFieldValues(movementFields));
    const [organizations, setOrganizations] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [products, setProducts] = useState([]);
    const [typesItemsOs, setTypesItemsOs] = useState([]);
    const [ordersServices, setOrdersServices] = useState([]);
    const [itemsOrdersServices, setItemsOrdersServices] = useState([]);
    const [allFieldsData, setAllFieldsData] = useState({});
    
    const mapCustomers = useCallback((customers) => {
        return Object.fromEntries(customers.map((customer) => [customer.id, customer.name]));
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
                    organizationsResponse,
                    customersResponse,
                    typesItemsOsResponse,
                    ordersServicesResponse                
                ] = await Promise.all([
                    fetchOrganizations(entities.organizations.get, {deleted_at: false}),
                    fetchCustomers(entities.customers.get, {deleted_at: false}),
                    fetchTypesItemsOs(entities.orders.itemsTypes.get(), {deleted_at: false}),
                    fetchOrdersServices(entities.orders.get, {deleted_at: false}),
                ]);

                setOrganizations(organizationsResponse.result.data.map(org => ({ value: org.id, label: org.name })));
                setCustomers(customersResponse.result.data.map(customer => ({ value: customer.id, label: customer.name })));
                setTypesItemsOs(typesItemsOsResponse.result.data.map(typeItemOs => ({ value: typeItemOs.id, label: typeItemOs.name })));
                setOrdersServices(ordersServicesResponse.result.data.map(orderService => ({ value: orderService.id, label: orderService.id })));
                fetchProductsData();
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

    const fetchProductsData = async () => {
        try {
            showLoader();
            const response = await fetchProducts(entities.products.get, {status_id: 1, deleted_at: false}, 'product')
            let filteredProducts = response.result.data;
            if (formData.items.length > 0) {
                filteredProducts = response.result.data.filter(product =>
                    !formData.items.some(item => item.product_id.value == product.id)
                );
            }
            setProducts(filteredProducts.map(product => ({ value: product.id, label: `${product.number} - ${product.name}` }))); 
        } catch (error) {
            console.log(error)
        } finally {
            hideLoader();
        }
    }

    useEffect(() => {
        fetchProductsData()
    }, [formData.items])

    const fetchItemsOs = async () => {
        try {
            showLoader();
            if(formData.movement.service_order_id) {
                const response = await fetchItemsOrdersServices(entities.orders.items.get(formData.movement.service_order_id), {deleted_at: false})
                setItemsOrdersServices(response.result.data.map(orderItemService => ({ value: orderItemService.id, label: orderItemService.id })))
            }
        } catch (error) {
            const errorMessage = error.response?.data?.error || 'Erro ao carregar os dados.';
            showNotification('error', errorMessage);
            console.error('Erro no carregamento dos dados:', error);
        } finally {
            hideLoader();
        }
    }

    useEffect(() => {
        fetchItemsOs()
    }, [formData.movement.service_order_id]);

    const getOptions = (fieldId) => {
        switch (fieldId) {
            case "movement.organization_id":
                return organizations || [];
            case "movement.customer_id":
                return customers || [];
            case "items.service_order_item_type_id":
                return typesItemsOs || [];
            case "items.product_id":
                return products || [];
            case "movement.service_order_id":
                return ordersServices || [];
            case "items.service_order_item_id":
                return itemsOrdersServices || [];
            case "items.new_organization_id":
                return organizations || [];
            case "items.old_organization_id":
                return organizations || [];
            default:
                return [];
        }
    };
    
    const getSelectedValue = (fieldId) => {
        const [category, key] = fieldId.split(".");
        if (key) {
            const value = formData[category]?.[key];
            return getOptions(fieldId).find((option) => option.value === value) || null;
        }
        return null;
    };

    const handleSubmit = async () => {
        showLoader();
        try {
            const transformedData = {
                ...formData,
                items: transformValues(Array.isArray(formData.items)? formData.items.map((item) => removeEmptyValues(item)) : [])
            }
            const success = await create(entities.movements.create, transformedData);
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
        navigate(`/movimentos/`);  
    };

    const handleFieldChange = useCallback((fieldId, value, field) => {
        handleChange(fieldId, value);    
    }, [getOptions]);

    return (
        <MainLayout selectedCompany="ALUCOM">
            <PageHeader title="Cadastro de Movimento" showBackButton={true} backUrl="/movimentos" />
            <div className="container-fluid p-1">
                <Form
                    initialFormData={formData}
                    onSubmit={handleSubmit}
                    textSubmit="Cadastrar"
                    textLoadingSubmit="Cadastrando..."
                    handleBack={handleBack}
                >
                    {() => 
                        movementFields.map((section) => (
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

export default CreateMovementPage;

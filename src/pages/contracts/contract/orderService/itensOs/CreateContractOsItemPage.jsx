import React, { useCallback, useEffect, useState } from 'react';
import MainLayout from '../../../../../layouts/MainLayout';
import Form from '../../../../../components/Form';
import FormSection from '../../../../../components/FormSection';
import { useNavigate, useParams } from 'react-router-dom';
import '../../../../../assets/styles/custom-styles.css';
import useForm from '../../../../../hooks/useForm';
import { osItemFields } from '../../../../../constants/forms/osItemFields';
import { setDefaultFieldValues } from '../../../../../utils/objectUtils';
import useBaseService from '../../../../../hooks/services/useBaseService';
import { entities } from '../../../../../constants/entities';
import useLoader from '../../../../../hooks/useLoader';
import useNotification from '../../../../../hooks/useNotification';
import PageHeader from '../../../../../components/PageHeader';

const CreateContractOsItemPage = () => {
    const { id, contractOsId } = useParams();
    const navigate = useNavigate();
    const { showLoader, hideLoader } = useLoader();
    const { showNotification } = useNotification();
    const { 
        getByColumn: fetchContractById,
        get: fetchProducts,
        get: fetchOsItemsTypes,
        get: fetchLocations,
        get: fetchAddress,
        post: create, 
        formErrors,
        setFormErrors
    } = useBaseService(navigate);
    const { formData, handleChange, resetForm, setFormData } = useForm(setDefaultFieldValues(osItemFields));
    const [products, setProducts] = useState([]);
    const [osItemsTypes, setOsItemsTypes] = useState([]);
    const [addresses, setAddresses] = useState([]);
    const [locations, setLocations] = useState([]);
    const [contract, setContract] = useState({});
    useEffect(() => {
        fetchData();
    }, [])

    const fetchData = async () => {
        try {
            showLoader()
            const [
                productsResponse,
                osItemsTypesResponse,
                contractResponse
            ] = await Promise.all([
                fetchProducts(entities.products.get, {deleted_at: false}),
                fetchOsItemsTypes(entities.orders.itemsTypes.get(), {deleted_at: false}),
                fetchContractById(entities.contracts.getByColumn(id), {deleted_at: false})
            ])

            setContract(contractResponse.result);

            const addressResponse = await fetchAddress(entities.customers.addresses.get(contractResponse.result.customer_id), {deleted_at: false})

            setProducts(productsResponse.result.data.map((product) => ({
                label: product.name,
                value: product.id
            })));
            setOsItemsTypes(osItemsTypesResponse.result.data.map((item) => ({
                label: item.name,
                value: item.id
            })));
            setAddresses(addressResponse.result.data.map((address) => ({
                label: `${address.street}, ${address.city} - ${address.state}`,
                value: address.id
            })))
        } catch (error) {
            console.log(error)
            showNotification('error', 'error ao carregar os dados')
        } finally {
            hideLoader()
        }
    }

    const handleFieldChange = ((fieldId, value, field) => {
        handleChange(fieldId, value);
    
        if (fieldId == 'address_id') {
            handleAddressChange({ value, label: getOptions(fieldId).find(option => option.value === value)?.label });
        }
    });

    const handleAddressChange = useCallback((selectedOption) => {
        const selectedAddressId = selectedOption ? selectedOption.value : '';
        setFormData((prev) => ({
            ...prev,
            address_id: selectedAddressId,
        }));
    
        if (selectedAddressId) {
            fetchLocationsData(contract.customer_id, selectedAddressId);
        } else {
            setLocations([]);
        }
    }, [fetchLocations]);

    const fetchLocationsData = async (customerId, addressId) => {
        try {
            showLoader()

            const response = await fetchLocations(entities.customers.addresses.locations(customerId).get(addressId), {deleted_at: false});
            setLocations(response.result.data.map((location) => ({
                value: location.id,
                label: `${location.area}, ${location.section} - ${location.spot}`
            })))
        } catch (error) {
            console.log(error)
            showNotification('error', 'error ao carregar os dados')
        } finally {
            hideLoader();
        }
    };
    
    const getOptions = (fieldId) => {
        switch (fieldId) {
            case "product_id":
                return products || [];
            case "service_order_item_type_id":
                return osItemsTypes || [];
            case "address_id":
                return addresses || [];
            case "location_id":
                return locations
            default:
                return [];
        }
    };

    const getSelectedValue = (fieldId) => {
        if (fieldId) {
            const value = formData[fieldId];
            return getOptions(fieldId).find((option) => option.value === value) || null;
        }
        return null;
    };

    const handleSubmit = async () => {
        try {
            const success = await create(entities.contracts.orders.items(id).create(contractOsId),formData);
            if (success) {
                resetForm();
            }
        } catch (error) {
            console.error('Erro ao editar os:', error);
        }
    };

    const handleBack = useCallback(() => {
        navigate(`/contratos/${id}/ordens-servicos/detalhes/${contractOsId}`);
    }, [navigate]);

    return (
        <MainLayout selectedCompany="ALUCOM">
            <PageHeader title="Ordens de Serviços do Contrato" showBackButton={true} backUrl={`/contratos/${id}/ordens-servicos/detalhes/${contractOsId}`} />

            <div className="container-fluid p-1">
                <div className="text-xs font-weight-bold text-primary text-uppercase mb-1 text-dark">
                    Cadastro de Item da Ordem de Serviço
                </div>

                <Form
                    initialFormData={formData}
                    onSubmit={handleSubmit}
                    textSubmit="Cadastrar"
                    textLoadingSubmit="Cadastrando..."
                    handleBack={handleBack}
                >
                    {() =>
                        osItemFields.map((section) => (
                            <FormSection
                                key={section.section}
                                section={section}
                                formData={formData}
                                handleFieldChange={handleFieldChange}
                                formErrors={formErrors}
                                setFormErrors={setFormErrors}
                                getOptions={getOptions}
                                getSelectedValue={getSelectedValue}
                            />
                        ))
                    }
                </Form>
            </div>
        </MainLayout>
    );
};

export default CreateContractOsItemPage;

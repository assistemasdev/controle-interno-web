import React, { useCallback, useEffect, useState } from 'react';
import MainLayout from '../../../../layouts/MainLayout';
import Form from '../../../../components/Form';
import FormSection from '../../../../components/FormSection';
import { useNavigate, useParams } from 'react-router-dom';
import '../../../../assets/styles/custom-styles.css';
import useForm from '../../../../hooks/useForm';
import { orderServiceFields } from '../../../../constants/forms/orderServiceFields';
import { setDefaultFieldValues } from '../../../../utils/objectUtils';
import useBaseService from '../../../../hooks/services/useBaseService';
import { entities } from '../../../../constants/entities';
import useLoader from '../../../../hooks/useLoader';
import useNotification from '../../../../hooks/useNotification';
import { transformValues } from '../../../../utils/objectUtils';

const CreateContractOsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { showLoader, hideLoader } = useLoader();
    const { showNotification } = useNotification();
    const { 
        get: fetchOsStatus,
        get: fetchOsDepartaments,
        get: fetchOsDestinations,
        get: fetcOsTypesItem,
        get: fetchProducts,
        getByColumn: fetchContractById,
        get: fetchAddressCustomer,
        get: fetchLocationsCustomer,
        post: create, 
        formErrors,
        setFormErrors
    } = useBaseService(navigate);
    const { formData, handleChange, resetForm, setFormData } = useForm(setDefaultFieldValues(orderServiceFields));
    const [oSstatus, setOsStatus] = useState([]);
    const [osDepartaments, setOsDepartaments] = useState([]);
    const [osDestinations, setOsDestinations] = useState([]);
    const [osTypesItems, setOsTypesItems] = useState([]);
    const [products, setProducts] = useState([]);
    const [addresses, setAddresses] = useState([]);
    const [allFieldsData, setAllFieldsData] = useState({});
    const [contract, setContract] = useState({});
    const [locations, setLocations] = useState([]);

    useEffect(() => {
        setFormData(prev => ({
            ...prev,
            items: []
        }))
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            showLoader()
            const [
                osStatusResponse,
                osDepartamentsResponse,
                osDestinationsResponse,
                osTypesItemResponse,
                productsResponse,
                contractResponse
            ] = await Promise.all([
                fetchOsStatus(entities.orders.status.get()),
                fetchOsDepartaments(entities.orders.departaments.get()),
                fetchOsDestinations(entities.orders.destinations.get()),
                fetcOsTypesItem(entities.orders.itemsTypes.get()),
                fetchProducts(entities.products.get),
                fetchContractById(entities.contracts.getByColumn(id))
            ])
    
            const [addressesResponse] = await Promise.all([
                fetchAddressCustomer(entities.customers.addresses.get(contractResponse.result.customer_id))
            ])

            setContract(contractResponse.result);

            setOsStatus(osStatusResponse.result.data.map((status) => ({
                label: status.name,
                value: status.id
            })));
    
            setOsDepartaments(osDepartamentsResponse.result.data.map((departament) => ({
                label: departament.name,
                value: departament.id
            })))
    
            setOsDestinations(osDestinationsResponse.result.data.map((destination) => ({
                label: destination.name,
                value: destination.id
            })));
    
            setOsTypesItems(osTypesItemResponse.result.data.map((osTypeItem) => ({
                label: osTypeItem.name,
                value: osTypeItem.id
            })));
    
            setOsTypesItems(productsResponse.result.data.map((product) => ({
                label: product.name,
                value: product.id
            })));
    
            setAddresses(addressesResponse.result.data.map((address) => ({
                value: address.id,
                label: `${address.street}, ${address.city} - ${address.state}`,
            })));

            setProducts(productsResponse.result.data.map((product) => ({
                label: product.name,
                value: product.id
            })))
        } catch (error) {
            console.log(error)
            showNotification('error', 'error ao carregar os dados')
        } finally {
            hideLoader()
        }
    }
    
    const getOptions = (fieldId) => {
        switch (fieldId) {
            case "order.status_id":
                return oSstatus || [];
            case "order.departament_id":
                return osDepartaments || [];
            case "order.destination_id":
                return osDestinations || [];
            case "items.service_order_item_type_id":
                return osTypesItems || [];
            case "items.product_id":
                return products || [];
            case "items.address_id":
                return addresses || [];
            case "items.location_id":
                return locations || [];
            case "items.product_id":
                return products || [];
            default:
                return [];
        }
    };

    useEffect(() => {
        fetchLocations()
    }, [allFieldsData?.items?.address_id])
    
    const fetchLocations = async () => {
        try {
            showLoader()
            if (allFieldsData?.items?.address_id) {
                const response = await fetchLocationsCustomer(entities.customers.addresses.locations(contract.customer_id).get(allFieldsData?.items?.address_id?.value));
                setLocations(response.result.data.map((location) => ({
                    label: `${location.area}, ${location.section} - ${location.spot}`,
                    value: location.id
                })))
            }
        } catch (error) {
            console.log(error)
        } finally {
            hideLoader()
        }
    }
    const getSelectedValue = (fieldId) => {
        const [category, key] = fieldId.split(".");
        if (key) {
            const value = formData[category]?.[key];
            return getOptions(fieldId).find((option) => option.value === value) || null;
        }
        return null;
    };

    const handleSubmit = async () => {
        try {
            const transformedData = {
                ...formData,
                items: transformValues(formData.items)
            }
            const success = await create(entities.contracts.orders.create(id) ,transformedData);
            if (success) {
                resetForm();
            }
        } catch (error) {
            console.error('Erro ao criar status:', error);
        }
    };

    const handleBack = useCallback(() => {
        navigate(`/contratos/${id}/ordens-servicos/`);
    }, [navigate]);

    return (
        <MainLayout selectedCompany="ALUCOM">
            <div className="container-fluid p-1">
                <div className="text-xs font-weight-bold text-primary text-uppercase mb-1 text-dark">
                    Cadastro de Ordem de Serviço
                </div>

                <Form
                    initialFormData={formData}
                    onSubmit={handleSubmit}
                    textSubmit="Cadastrar"
                    textLoadingSubmit="Cadastrando..."
                    handleBack={handleBack}
                >
                    {() =>
                        orderServiceFields.map((section) => (
                            <FormSection
                                key={section.section}
                                section={section}
                                formData={formData}
                                setFormData={setFormData}
                                handleFieldChange={handleChange}
                                formErrors={formErrors}
                                setFormErrors={setFormErrors}
                                getOptions={getOptions}
                                getSelectedValue={getSelectedValue}
                                allFieldsData={allFieldsData}
                                setAllFieldsData={setAllFieldsData}
                            />
                        ))
                    }
                </Form>
            </div>
        </MainLayout>
    );
};

export default CreateContractOsPage;

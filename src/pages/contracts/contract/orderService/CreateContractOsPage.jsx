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
import PageHeader from '../../../../components/PageHeader';

const CreateContractOsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { showLoader, hideLoader } = useLoader();
    const { showNotification } = useNotification();
    const { 
        get: fetchProducts,
        getByColumn: fetchContractById,
        get: fetchAddressCustomer,
        get: fetchLocationsCustomer,
        post: create, 
        formErrors,
        setFormErrors
    } = useBaseService(navigate);
    const { formData, handleChange, resetForm, setFormData } = useForm(setDefaultFieldValues(orderServiceFields));
    const [products, setProducts] = useState([]);
    const [addresses, setAddresses] = useState([]);
    const [allFieldsData, setAllFieldsData] = useState({});
    const [contract, setContract] = useState({});
    const [locations, setLocations] = useState([]);
    const [reloadForm, setReloadForm] = useState(false);

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
                productsResponse,
                contractResponse
            ] = await Promise.all([
                fetchProducts(entities.products.get, {deleted_at: false}),
                fetchContractById(entities.contracts.getByColumn(id), {deleted_at: false})
            ])
    
            const [addressesResponse] = await Promise.all([
                fetchAddressCustomer(entities.customers.addresses.get(contractResponse.result.customer_id), {deleted_at: false})
            ])

            setContract(contractResponse.result);

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
                const response = await fetchLocationsCustomer(entities.customers.addresses.locations(contract.customer_id).get(allFieldsData?.items?.address_id?.value), {deleted_at: false});
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
                setReloadForm(true);
                setFormData(prev => ({
                    ...prev,
                    items: []
                }))
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
            <PageHeader title="Cadastro de Ordem de Serviço" showBackButton={true} backUrl={`/contratos/${id}/ordens-servicos/`} />
            <div className="container-fluid p-1">
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
                                setReloadForm={setReloadForm}
                                reloadForm={reloadForm}
                            />
                        ))
                    }
                </Form>
            </div>
        </MainLayout>
    );
};

export default CreateContractOsPage;

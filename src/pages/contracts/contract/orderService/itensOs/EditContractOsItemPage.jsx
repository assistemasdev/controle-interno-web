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

const EditContractOsItemPage = () => {
    const { id, contractOsId, contractOsItemId } = useParams();
    const navigate = useNavigate();
    const { showLoader, hideLoader } = useLoader();
    const { showNotification } = useNotification();
    const { 
        getByColumn: fetchContractById,
        getByColumn: fetchContractOsItemById,
        get: fetchLocations,
        get: fetchAddress,
        put: update, 
        formErrors,
        setFormErrors
    } = useBaseService(navigate);
    const { formData, handleChange, formatData, setFormData } = useForm(setDefaultFieldValues(osItemFields));
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
                contractOsItemResponse,
                contractResponse
            ] = await Promise.all([
                fetchContractOsItemById(entities.contracts.orders.items(id).getByColumn(contractOsId, contractOsItemId)),
                fetchContractById(entities.contracts.getByColumn(id))
            ])

            setContract(contractResponse.result);

            const addressResponse = await fetchAddress(entities.customers.addresses.get(contractResponse.result.customer_id))
            fetchLocationsData(contractResponse.result.customer_id, contractOsItemResponse.result.address_id)
            formatData(contractOsItemResponse.result, osItemFields);

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
            console.log(selectedAddressId, contract.customer_id)
            fetchLocationsData(contract.customer_id, selectedAddressId);
        } else {
            setLocations([]);
        }
    }, [fetchLocations]);

    const fetchLocationsData = async (customerId, addressId) => {
        try {
            showLoader()

            const response = await fetchLocations(entities.customers.addresses.locations(customerId).get(addressId));
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
            await update(entities.contracts.orders.items(id).update(contractOsId, contractOsItemId) ,formData);
        } catch (error) {
            console.error('Erro ao editar os:', error);
        }
    };

    const handleBack = useCallback(() => {
        navigate(`/contratos/${id}/ordens-servicos/detalhes/${contractOsId}`);
    }, [navigate]);

    return (
        <MainLayout selectedCompany="ALUCOM">
            <PageHeader title="Edição de Item da Ordem de Serviço" showBackButton={true} backUrl={`/contratos/${id}/ordens-servicos/detalhes/${contractOsId}`} />
            <div className="container-fluid p-1">
                <Form
                    initialFormData={formData}
                    onSubmit={handleSubmit}
                    textSubmit="Editar"
                    textLoadingSubmit="Editando..."
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

export default EditContractOsItemPage;

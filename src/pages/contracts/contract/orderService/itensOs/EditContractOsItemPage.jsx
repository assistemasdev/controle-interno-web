import React, { useCallback, useEffect, useState } from 'react';
import MainLayout from '../../../../../layouts/MainLayout';
import Form from '../../../../../components/Form';
import { useNavigate, useParams } from 'react-router-dom';
import '../../../../../assets/styles/custom-styles.css';
import useForm from '../../../../../hooks/useForm';
import { dynamicFields, baseOsItemFields } from '../../../../../constants/forms/osItemFields';
import { setDefaultFieldValues, transformObjectValues } from '../../../../../utils/objectUtils';
import useBaseService from '../../../../../hooks/services/useBaseService';
import { entities } from '../../../../../constants/entities';
import useLoader from '../../../../../hooks/useLoader';
import useNotification from '../../../../../hooks/useNotification';
import PageHeader from '../../../../../components/PageHeader';
import SectionHeader from '../../../../../components/forms/SectionHeader';
import SimpleBody from '../../../../../components/forms/SimpleBody';

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
    const { formData, handleChange, formatData, setFormData } = useForm({});
    const [addresses, setAddresses] = useState([]);
    const [locations, setLocations] = useState([]);
    const [contract, setContract] = useState({});
    const [formFields, setFormFields] = useState(baseOsItemFields);
    
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
            
            if(contractOsItemResponse.result.address_id) {
                const addressResponse = await fetchAddress(entities.addresses.getByColumn(contractOsItemResponse.result.address_id));
                const responsibleId = addressResponse.result.addressable_type == 'customer' ? contractResponse.result.customer_id : contractResponse.result.organization_id;
                const url = addressResponse.result.addressable_type == 'customer' ? entities.customers.addresses.get(responsibleId) : entities.organizations.addresses.get(responsibleId)
                const addressesResponse = await fetchAddress(url);
                fetchLocationsData(responsibleId, contractOsItemResponse.result.address_id, addressResponse.result.addressable_type)
                setAddresses(addressesResponse.result.data.map((address) => ({
                    label: `${address.street}, ${address.city} - ${address.state}`,
                    value: address.id
                })));
            }

            setFormData({
                contract_item_id: contractOsItemResponse.result.contract_item_id ?? "",
                quantity: contractOsItemResponse.result.quantity ?? "",
                product_id: {value: contractOsItemResponse.result.product_id ?? "", label:contractOsItemResponse.result.product_name ?? ""},
                movement_type_id: {value: contractOsItemResponse.result.movement_type_id ?? "", label: contractOsItemResponse.result.movement_type_name ?? ""},
                address_id: {value: contractOsItemResponse.result.address_id ?? "", label: contractOsItemResponse.result.address_name ?? ""},
                location_id: {value: contractOsItemResponse.result.location_id ?? "", label: contractOsItemResponse.result.location_name ?? ""},
                details: contractOsItemResponse.result.details
            })
        } catch (error) {
            console.log(error)
            showNotification('error', 'error ao carregar os dados')
        } finally {
            hideLoader()
        }
    }

    useEffect(() => {
        const updatedBaseOsFields = baseOsItemFields.map(section => ({
            ...section,
            fields: [...section.fields] 
        }));

        const sectionIndex = updatedBaseOsFields.findIndex(item => item.section === 'Item da Order de Serviço');
    
        if (sectionIndex !== -1) {
            const sectionFields = updatedBaseOsFields[sectionIndex].fields;
    
            const baseFields = sectionFields.filter(
                field => field.id === "movement_type_id"
            );
    
            const newDynamicFields = dynamicFields[formData.movement_type_id?.value] || [];
            updatedBaseOsFields[sectionIndex] = {
                ...updatedBaseOsFields[sectionIndex], 
                fields: [...baseFields, ...newDynamicFields] 
            };
        }

        setFormFields(updatedBaseOsFields);
        setFormData(prev => ({
            ...prev,
            filters: (formData.movement_type_id?.value === 2 || formData.movement_type_id?.value === 3)
                ? {
                    product_id: {
                        status_id: 2
                    }
                }
                : {}
        }));
    }, [formData.movement_type_id?.value]);    
    

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
            fetchLocationsData(contract.organization_id, selectedAddressId);
        } else {
            setLocations([]);
        }
    }, [fetchLocations]);

    const fetchLocationsData = async (responsibleId, addressId, typeAddress) => {
        try {
            showLoader()
            const url = typeAddress == 'customer' ? entities.customers.addresses.locations(responsibleId).get(addressId) : entities.organizations.addresses.locations(responsibleId).get(addressId)
            const response = await fetchLocations(url);
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
            return getOptions(fieldId).find((option) => option.value === value.value) || null;
        }
        return null;
    };

    const handleSubmit = async () => {
        try {
            const transformedData = transformObjectValues(formData)
            await update(entities.contracts.orders.items(id).update(contractOsId, contractOsItemId) ,transformedData);
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
                        formFields.map((section) => (
                            <>
                                <SectionHeader
                                    key={section.section}
                                    section={section}
                                    viewTable={false}
                                    setViewTable={() => {}}
                                    addFieldsInData={() => {}}
                                />
                                
                                <SimpleBody
                                    fields={section.fields}
                                    formErrors={formErrors}
                                    formData={formData}
                                    handleFieldChange={handleFieldChange}
                                    getOptions={getOptions}
                                    getSelectedValue={getSelectedValue}
                                />
                                
                            </>
                        ))
                        }
                </Form>
            </div>
        </MainLayout>
    );
};

export default EditContractOsItemPage;

import React, { useEffect, useCallback, useState } from 'react';
import MainLayout from '../../../layouts/MainLayout';
import { useNavigate } from 'react-router-dom';
import '../../../assets/styles/custom-styles.css';
import useNotification from '../../../hooks/useNotification';
import useLoader from '../../../hooks/useLoader';
import useForm from '../../../hooks/useForm';
import Form from '../../../components/Form'; 
import { productFields } from "../../../constants/forms/productFields";
import { setDefaultFieldValues } from '../../../utils/objectUtils';
import useBaseService from '../../../hooks/services/useBaseService';
import { entities } from '../../../constants/entities';
import PageHeader from '../../../components/PageHeader';
import SimpleForm from '../../../components/forms/SimpleForm';

const CreateProductPage = () => {
    const navigate = useNavigate();
    const { showNotification } = useNotification();
    const { 
        get: fetchOrganizationLocations,
        get: fetchOrganizationAddresses,
        get: fetchTypeGroups,
        post: create,
        formErrors
    } = useBaseService(navigate);
    const { showLoader, hideLoader } = useLoader();
    const { formData, handleChange, setFormData, resetForm } = useForm(setDefaultFieldValues(productFields));
    const [addresses, setAddresses] = useState([]);
    const [locations, setLocations] = useState([]);
    const [groups, setGroups] = useState([]);
    const [selectedOrganizationId, setSelectedOrganizationId] = useState();

    const getOptions = (fieldId) => {
        switch (fieldId) {
            case "product.address_id":
                return addresses || [];
            case "product.location_id":
                return locations || [];
            case 'groups':
                return groups || [];
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
        if (fieldId === "groups") {
            if (Array.isArray(formData.groups)) {
                return groups.filter((group) => formData.groups.includes(group.value));
            }
            return [];
        }
        return null;
    };

    const handleSubmit = async (data) => {
        showLoader();
        try {
            const success = await create(entities.products.create, data);
            if (success) {
                resetForm();
            }
        } catch (error) {
            console.error('Error creating product:', error);
        } finally {
            hideLoader();
        }
    };

    const handleTypeChange = async (selectedOption) => {
        if (!selectedOption || !selectedOption.value) {
            setGroups([]); 
            return;
        }
    
        const selectedTypeId = selectedOption.value;
    
        setFormData((prev) => ({
            ...prev,
            product: {
                ...prev.product,
                type_id: selectedTypeId,
            },
        }));
    
        try {
            showLoader(true);
            const response = await fetchTypeGroups(entities.types.groups.get(selectedTypeId), {deleted_at: false});
            const groupsFormatted = response.result.map((group) => ({
                value: group.id,
                label: group.name,
            }));
            setGroups(groupsFormatted);
        } catch (error) {
            const errorMessage =
                error.response?.data?.error || error.message || "Erro ao carregar grupos";
            showNotification("error", errorMessage);
        } finally {
            hideLoader();
        }
    };

    const fetchAddresses = useCallback(async () => {
        try {
            showLoader();
            const response = await fetchOrganizationAddresses(entities.organizations.addresses.get(selectedOrganizationId), {deleted_at: false});
            const addressesFormatted = response.result.data.map((address) => ({
                value: address.id,
                label: `${address.street}, ${address.city} - ${address.state}`,
            }));
            setAddresses(addressesFormatted);
        } catch (error) {
            const errorMessage = error.response?.data?.error || error.message || 'Erro ao carregar endereços';
            showNotification('error', errorMessage);
        } finally {
            hideLoader();
        }
    }, [fetchOrganizationAddresses, showLoader, hideLoader, showNotification]);

    const fetchLocations = async (organizationId, addressId) => {
        try {
            showLoader();
            const response = await fetchOrganizationLocations(entities.organizations.addresses.locations(organizationId).get(addressId), {deleted_at: false});
            const locationsFormatted = response.result.data.map(location => {
                const parts = [location.area];
            
                if (location.section) {
                    parts.push(location.section);
                }
            
                if (location.spot) {
                    parts.push(`- ${location.spot}`);
                }
            
                return {
                    value: location.id,
                    label: parts.join(', ')
                };
            });
            setLocations(locationsFormatted);
        } catch (error) {
            const errorMessage = error.response?.data?.error || error.message || 'Erro ao carregar localizações';
            console.log(errorMessage)
        } finally {
            hideLoader();
        }
    };

    const handleBack = () => {
        navigate(`/produtos/`);  
    };

    const handleOrganizationChange = useCallback((selectedOption) => {
        setSelectedOrganizationId(selectedOption ? selectedOption.value : '');
        setFormData((prev) => ({
            ...prev,
            product: {
                ...prev.product,
                current_organization_id: selectedOption.value,
            },
        }));
    }, [fetchAddresses]);

    useEffect(() => {
        if (selectedOrganizationId) {
            fetchAddresses();
        } else {
            setAddresses([]);
        }
    }, [selectedOrganizationId])

    const handleGroupChange = useCallback((selectedOptions) => {
        const selectedValues = Array.isArray(selectedOptions)
            ? selectedOptions.map((option) => option.value)
            : [];
        setFormData((prev) => ({
            ...prev,
            groups: selectedValues,
        }));
    }, []);
    

    const handleAddressChange = useCallback((selectedOption) => {
        const selectedAddressId = selectedOption ? selectedOption.value : '';
        setFormData((prev) => ({
            ...prev,
            product: {
                ...prev.product,
                address_id: selectedAddressId,
            },
        }));
    
        if (selectedAddressId && selectedOrganizationId) {
            fetchLocations(selectedOrganizationId, selectedAddressId);
        } else {
            setLocations([]);
        }
    }, [fetchLocations, selectedOrganizationId]);

    
    const handleFieldChange = useCallback((fieldId, value, field) => {
        handleChange(fieldId, value);
        switch (fieldId) {
            case "product.current_organization_id":
                handleOrganizationChange({ value, label: getOptions(fieldId).find(option => option.value === value)?.label });
                break;
            case "groups":
                handleGroupChange(
                    Array.isArray(value)
                        ? value.map((val) => ({
                                value: val,
                                label: getOptions(fieldId).find((option) => option.value === val)?.label || "",
                            }))
                        : []
                );
                break;
            case "product.type_id":
                handleTypeChange({ value, label: getOptions(fieldId).find(option => option.value === value)?.label });
                break;
            case "product.address_id":
                handleAddressChange({ value, label: getOptions(fieldId).find(option => option.value === value)?.label });
                break;
            default:
                console.warn("Nenhum handle definido para:", fieldId);
        }
        
    }, [handleOrganizationChange, handleGroupChange, handleTypeChange, handleAddressChange, getOptions]);

    return (
        <MainLayout selectedCompany="ALUCOM">
            <PageHeader title="Cadastro de Produto" showBackButton={true} backUrl="/produtos/" /> 
            <div className="container-fluid p-1">
                <Form
                    initialFormData={formData}
                    onSubmit={handleSubmit}
                    textSubmit="Cadastrar Produto"
                    textLoadingSubmit="Cadastrando..."
                    handleBack={handleBack}
                >
                    {() => 
                        productFields.map((section) => (
                            <SimpleForm
                                key={section.section}
                                section={section}
                                formData={formData}
                                handleFieldChange={handleFieldChange}
                                getOptions={getOptions}
                                getSelectedValue={getSelectedValue}
                                formErrors={formErrors}
                            />
                        ))
                    }
                </Form>
            </div>
        </MainLayout>
    );
};

export default CreateProductPage;

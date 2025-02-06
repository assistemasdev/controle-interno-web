import React, { useEffect, useState, useCallback } from 'react';
import MainLayout from '../../layouts/MainLayout';
import Form from '../../components/Form';
import FormSection from '../../components/FormSection';
import { productFields } from "../../constants/forms/productFields";
import useNotification from '../../hooks/useNotification';
import useLoader from '../../hooks/useLoader';
import useForm from '../../hooks/useForm';
import { useNavigate, useParams } from 'react-router-dom';
import { setDefaultFieldValues } from '../../utils/objectUtils';
import useBaseService from '../../hooks/services/useBaseService';
import { entities } from '../../constants/entities';
import PageHeader from '../../components/PageHeader';

const EditProductPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { showNotification } = useNotification();
    const { 
        get: fetchOrganizations,
        get: fetchProductGroups,
        get: fetchOrganizationLocations,
        get: fetchTypeGroups,
        get: fetchConditions,
        get: fetchCategories,
        get: fetchSuppliers,
        get: fetchOrganizationAddresses,
        get: fetchTypes,
        getByColumn: fetchById,
        put: update,
        formErrors

    } = useBaseService(navigate);
    const { showLoader, hideLoader } = useLoader();
    const {
        formData,
        setFormData,
        handleChange,
        initializeData,
        formatData
    } = useForm(setDefaultFieldValues(productFields));
    const [organizations, setOrganizations] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [conditions, setConditions] = useState([]);
    const [categories, setCategories] = useState([]);
    const [types, setTypes] = useState([]);
    const [addresses, setAddresses] = useState([]);
    const [locations, setLocations] = useState([]);
    const [groups, setGroups] = useState([]);
    const [selectedOrganizationId, setSelectedOrganizationId] = useState();

    useEffect(() => {
        initializeData(productFields);

        const fetchData = async () => {
            showLoader();
            try {
                const [
                    product,
                    orgResponse,
                    suppliersResponse,
                    conditionResponse,
                    categoryResponse,
                    typeResponse,
                    productGroups
                ] = await Promise.all([
                    fetchById(entities.products.getByColumn(id)),
                    fetchOrganizations(entities.organizations.get),
                    fetchSuppliers(entities.suppliers.get),
                    fetchConditions(entities.conditions.get),
                    fetchCategories(entities.categories.get),
                    fetchTypes(entities.types.get),
                    fetchProductGroups(entities.products.groups.get(id))
                ]);

                setOrganizations(orgResponse.result.data.map((org) => ({ value: org.id, label: org.name })));

                setSuppliers(suppliersResponse.result.data.map((supplier) => ({
                    value: supplier.id,
                    label: supplier.name,
                })));
                setConditions(conditionResponse.result.data.map((condition) => ({
                    value: condition.id,
                    label: condition.name,
                })));
                setCategories(categoryResponse.result.data.map((category) => ({
                    value: category.id,
                    label: category.name,
                })));
                setTypes(typeResponse.result.data.map((type) => ({
                    value: type.id,
                    label: type.name,
                })));
                setGroups(productGroups.result.map((group) => ({
                    value: group.id,
                    label: group.name,
                })));

                setSelectedOrganizationId(product.result.current_organization_id)
                formatData({product:product.result}, productFields)

                setFormData(prev => ({
                    ...prev,
                    product: {
                        ...prev.product,
                        type_id: product.result.type_id || '',
                    },
                    groups: productGroups.result.map((group) => group.id) || [],
                }));

                if (product.result.address_id && product.result.current_organization_id) {
                    await fetchLocations(product.result.current_organization_id, product.result.address_id);
                }
            } catch (error) {
                console.error(error);
                showNotification('error', 'Erro ao carregar dados do produto.');
            } finally {
                hideLoader();
            }
        };

        fetchData();
    }, [id]);

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
            const response = await fetchTypeGroups(entities.types.groups.get(selectedTypeId));
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

    const handleSubmit = async (data) => {
        try {
            showLoader();
            await update(entities.products.update(id), data);
        } catch (error) {
            console.log(error)
        } finally {
            hideLoader();
        }
    };

    const getOptions = (fieldId) => {
        switch (fieldId) {
            case 'product.current_organization_id':
            case 'product.owner_organization_id':
                return organizations;
            case 'product.supplier_id':
                return suppliers;
            case 'product.condition_id':
                return conditions;
            case 'product.category_id':
                return categories;
            case 'product.type_id':
                return types;
            case 'product.address_id':
                return addresses;
            case 'product.location_id':
                return locations;
            case 'groups':
                return groups;
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
        if (fieldId === 'groups') {
            return groups.filter(group => formData.groups.includes(group.value));
        }
        return null;
    };

    const fetchAddresses = useCallback(async () => {
        try {
            showLoader();
            const response = await fetchOrganizationAddresses(entities.organizations.addresses.get(selectedOrganizationId));
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
            const response = await fetchOrganizationLocations(entities.organizations.addresses.locations(organizationId).get(addressId));
            const locationsFormatted = response.result.data.map(location => ({
                value: location.id,
                label: `${location.area}, ${location.section} - ${location.spot}`
            }));
            setLocations(locationsFormatted);
        } catch (error) {
            const errorMessage = error.response?.data?.error || error.message || 'Erro ao carregar localizações';
            showNotification('error', errorMessage);
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
            fetchAddresses(selectedOrganizationId);
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

        if (field.handleChange) {
            switch (field.handleChange) {
                case "handleOrganizationChange":
                    handleOrganizationChange({ value, label: getOptions(fieldId).find(option => option.value === value)?.label });
                    break;
                case "handleGroupChange":
                    handleGroupChange(
                        Array.isArray(value)
                            ? value.map((val) => ({
                                value: val,
                                label: getOptions(fieldId).find((option) => option.value === val)?.label || "",
                            }))
                            : []
                    );
                    break;
                case "handleTypeChange":
                    handleTypeChange({ value, label: getOptions(fieldId).find(option => option.value === value)?.label });
                    break;
                case "handleAddressChange":
                    handleAddressChange({ value, label: getOptions(fieldId).find(option => option.value === value)?.label });
                    break;
                default:
                    console.warn("Nenhum handle definido para:", fieldId);
            }
        }
    }, [handleOrganizationChange, handleGroupChange, handleTypeChange, handleAddressChange, getOptions]);

    return (
        <MainLayout selectedCompany="ALUCOM">
            <PageHeader title="Editar Produto" showBackButton={true} backUrl="/produtos/" /> 
            <div className="container-fluid p-1">
                <Form
                    initialFormData={formData}
                    onSubmit={handleSubmit}
                    textSubmit="Salvar"
                    textLoadingSubmit="Salvando..."
                    handleBack={handleBack}
                >
                    {() =>
                        productFields.map(section => (
                            <FormSection
                                key={section.section}
                                section={section}
                                formData={formData}
                                handleFieldChange={handleFieldChange}
                                getOptions={getOptions}
                                formErrors={formErrors}
                                getSelectedValue={getSelectedValue}
                            />
                        ))
                    }
                </Form>
            </div>
        </MainLayout>
    );
};

export default EditProductPage;

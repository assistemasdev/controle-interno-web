import React, { useEffect, useState, useCallback } from 'react';
import MainLayout from '../../layouts/MainLayout';
import Form from '../../components/Form';
import FormSection from '../../components/FormSection';
import { productFields } from "../../constants/forms/productFields";
import useNotification from '../../hooks/useNotification';
import useProductService from '../../hooks/useProductService';
import useLoader from '../../hooks/useLoader';
import useSupplierService from '../../hooks/useSupplierService';
import useConditionService from '../../hooks/useConditionService';
import useCategoryService from '../../hooks/useCategoryService';
import useOrganizationService from '../../hooks/useOrganizationService';
import useTypeGroupsService from '../../hooks/useTypeGroupsService';
import useForm from '../../hooks/useForm';
import { useNavigate, useParams } from 'react-router-dom';
import TypeService from '../../services/TypeService';
import OrganizationService from '../../services/OrganizationService';

const EditProductPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const { showNotification } = useNotification();
    const { fetchProductById, fetchProductGroups, updateProduct, formErrors } = useProductService(navigate);
    const { fetchOrganizationAddresses, fetchOrganizationLocations } = useOrganizationService(navigate);
    const { fetchSuppliers } = useSupplierService(navigate);
    const { fetchConditions } = useConditionService(navigate);
    const { fetchCategories } = useCategoryService(navigate);
    const { fetchTypeGroups } = useTypeGroupsService(navigate);
    const { showLoader, hideLoader } = useLoader();

    const {
        formData,
        setFormData,
        handleChange,
        initializeData,
    } = useForm({
        product: {
            name: '',
            number: '',
            serial_number: '',
            current_organization_id: '',
            owner_organization_id: '',
            supplier_id: '',
            purchase_date: '',
            warranty_date: '',
            condition_id: '',
            category_id: '',
            address_id: '',
            location_id: '',
            type_id: '',
        },
        groups: [],
    });

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
                    fetchProductById(id),
                    OrganizationService.getAll(navigate),
                    fetchSuppliers(),
                    fetchConditions({}),
                    fetchCategories({}),
                    TypeService.getAll(navigate),
                    fetchProductGroups(id)
                ]);

                setOrganizations(orgResponse.result.data.map((org) => ({ value: org.id, label: org.name })));

                setSuppliers(suppliersResponse.data.map((supplier) => ({
                    value: supplier.id,
                    label: supplier.name,
                })));
                setConditions(conditionResponse.data.map((condition) => ({
                    value: condition.id,
                    label: condition.name,
                })));
                setCategories(categoryResponse.data.map((category) => ({
                    value: category.id,
                    label: category.name,
                })));
                setTypes(typeResponse.result.data.map((type) => ({
                    value: type.id,
                    label: type.name,
                })));

                setGroups(productGroups.map((group) => ({
                    value: group.id,
                    label: group.name,
                })));

                setFormData({
                    product: {
                        ...product,
                        type_id: product.type_id || '',
                    },
                    groups: productGroups.map((group) => group.id) || [],
                });

                if (product.current_organization_id) {
                    await fetchAddresses(product.current_organization_id);
                }
                if (product.address_id && product.current_organization_id) {
                    await fetchLocations(product.current_organization_id, product.address_id);
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
            const response = await fetchTypeGroups(selectedTypeId);
            const groupsFormatted = response.map((group) => ({
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
            await updateProduct(id, data);
        } catch (error) {
            showNotification('error', 'Erro ao atualizar o produto.');
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
        if (fieldId.startsWith('product.')) {
            const key = fieldId.replace('product.', '');
            const value = formData.product[key];
            return getOptions(fieldId).find(option => option.value === value) || null;
        }
        if (fieldId === 'groups') {
            return groups.filter(group => formData.groups.includes(group.value));
        }
        return null;
    };

    const fetchAddresses = useCallback(async (organizationId) => {
        try {
            showLoader();
            const response = await fetchOrganizationAddresses(organizationId);
            const addressesFormatted = response.data.map((address) => ({
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
            const response = await fetchOrganizationLocations(organizationId, addressId);
            const locationsFormatted = response.data.map(location => ({
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
        const selectedOrganizationId = selectedOption ? selectedOption.value : '';
        setFormData((prev) => ({
            ...prev,
            product: {
                ...prev.product,
                current_organization_id: selectedOrganizationId,
            },
        }));

        if (selectedOrganizationId) {
            fetchAddresses(selectedOrganizationId);
        } else {
            setAddresses([]);
        }
    }, [fetchAddresses]);

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
        console.log('oi')

        if (selectedAddressId && selectedOrganizationId) {
            console.log('oi')
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
            <div className="container-fluid p-1">
                <p className="text-xs font-weight-bold text-uppercase mb-1">
                    Editar Produto
                </p>

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

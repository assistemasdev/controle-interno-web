import React, { useEffect, useState, useMemo, useCallback } from 'react';
import MainLayout from '../../layouts/MainLayout';
import InputField from '../../components/InputField';
import { useNavigate } from 'react-router-dom';
import '../../assets/styles/custom-styles.css';
import OrganizationService from '../../services/OrganizationService';
import SupplierService from '../../services/SupplierService';
import ConditionService from '../../services/ConditionService';
import CategoryService from '../../services/CategoryService';
import TypeService from '../../services/TypeService';
import Select from 'react-select';
import Form from '../../components/Form'; 
import { productFields } from "../../constants/forms/productFields";
import useNotification from '../../hooks/useNotification';
import useProductService from '../../hooks/useProductService';
import useLoader from '../../hooks/useLoader';
import useOrganizationService from '../../hooks/useOrganizationService';
import useTypeGroupsService from '../../hooks/useTypeGroupsService';
import FormSection from '../../components/FormSection';

const CreateProductPage = () => {
    const navigate = useNavigate();
    const [organizations, setOrganizations] = useState([]);
    const [types, setTypes] = useState([]);
    const [conditions, setConditions] = useState([]);
    const [categories, setCategories] = useState([]);
    const [addresses, setAddresses] = useState([]);
    const [locations, setLocations] = useState([]);
    const [groups, setGroups] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [selectedOrganizationId, setSelectedOrganizationId] = useState();
    const [formData, setFormData] = useState({
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
            location_id: ''
        },
        groups: []
    })
    const { showNotification } = useNotification();
    const { createProduct, formErrors } = useProductService(navigate);
    const { fetchOrganizationAddresses, fetchOrganizationLocations } = useOrganizationService(navigate);
    const { showLoader, hideLoader } = useLoader();
    const { fetchTypeGroups } = useTypeGroupsService(navigate);

    const memoizedInitialData = useMemo(() => formData, [formData]);
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                showLoader();
                const [
                    organizationsResponse,
                    suppliersResponse,
                    conditionsResponse,
                    categoriesResponse,
                    typesResponse,
                ] = await Promise.all([
                    OrganizationService.getAll(navigate),
                    SupplierService.getAll(navigate),
                    ConditionService.getAll(navigate),
                    CategoryService.getAll(navigate),
                    TypeService.getAll(navigate),
                ]);

                setOrganizations(organizationsResponse.result.data.map(org => ({ value: org.id, label: org.name })));
                setSuppliers(suppliersResponse.result.data.map(supplier => ({ value: supplier.id, label: supplier.name })));
                setConditions(conditionsResponse.result.data.map(condition => ({ value: condition.id, label: condition.name })));
                setCategories(categoriesResponse.result.data.map(category => ({ value: category.id, label: category.name })));
                setTypes(typesResponse.result.data.map(type => ({ value: type.id, label: type.name })));
            } catch (error) {
                const errorMessage = error.response?.data?.error || 'Erro ao carregar os dados.';
                showNotification('error',errorMessage);
                console.error('Erro no carregamento dos dados:', error);
            } finally {
                hideLoader();
            }
        };
        fetchData();
    }, [navigate]);

    const getOptions = (fieldId) => {
        switch (fieldId) {
            case "product.current_organization_id":
            case "product.owner_organization_id":
                return organizations;
            case "product.supplier_id":
                return suppliers;
            case "product.condition_id":
                return conditions;
            case "product.category_id":
                return categories;
            case "product.type_id":
                return types;
            case "product.address_id":
                return addresses;
            case "product.location_id":
                return locations;
            case "groups":
                return groups;
            default:
                return [];
        }
    };
    
    const getSelectedValue = (fieldId) => {
        const [category, key] = fieldId.split(".");
        if (key) {
            const value = formData[category][key];
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
            await createProduct(data);
        } catch (error) {
            console.error('Error creating user:', error);
        } finally {
            hideLoader();
        }
    };

    const handleChange = useCallback((e) => {
        const { id, value } = e.target;
        const [category, key] = id.split('.');
        setFormData((prev) => ({
            ...prev,
            [category]: {
                ...prev[category],
                [key]: value,
            },
        }));
    }, []);


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
            hideLoader()
        }
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
    
        if (selectedAddressId && selectedOrganizationId) {
            fetchLocations(selectedOrganizationId, selectedAddressId);
        } else {
            setLocations([]);
        }
    }, [fetchLocations, selectedOrganizationId]);

    const handleBack = () => {
        navigate(`/produtos/`);  
    };

    return (
        <MainLayout selectedCompany="ALUCOM">
            <div className="container-fluid p-1">
                <p className="text-xs font-weight-bold text-uppercase mb-1">
                    Cadastro de Produto
                </p>

                <Form
                    initialFormData={memoizedInitialData}
                    onSubmit={handleSubmit}
                    textSubmit="Cadastrar Produto"
                    textLoadingSubmit="Cadastrando..."
                    handleBack={handleBack}
                >
                    {() => 
                        productFields.map((section) => (
                            <FormSection
                                key={section.section}
                                section={section}
                                formData={memoizedInitialData}
                                handleFieldChange={(fieldId, value, field) => {
                                    const [category, key] = fieldId.split(".");
                                    if (field.handleChange === "handleChange") {
                                        setFormData((prev) => ({
                                            ...prev,
                                            [category]: {
                                                ...prev[category],
                                                [key]: value,
                                            },
                                        }));
                                    } else if (field.handleChange === "handleOrganizationChange") {
                                        handleOrganizationChange({ value, label: getOptions(fieldId).find(option => option.value == value)?.label });
                                    } else if (field.handleChange === "handleGroupChange") {
                                        handleGroupChange(
                                            Array.isArray(value)
                                                ? value.map((val) => ({
                                                      value: val,
                                                      label: getOptions(fieldId).find((option) => option.value == val)?.label || "",
                                                  }))
                                                : []
                                        );                                    
                                    } else if (field.handleChange === "handleTypeChange") {
                                        handleTypeChange({ value, label: getOptions(fieldId).find(option => option.value == value)?.label });
                                    } else if (field.handleChange === "handleAddressChange") {
                                        handleAddressChange({ value, label: getOptions(fieldId).find(option => option.value == value)?.label });
                                    } else {
                                        console.warn("Nenhum handle definido para:", fieldId);
                                    }
                                }}
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

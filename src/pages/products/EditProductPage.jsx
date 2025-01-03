import React, { useEffect, useState, useMemo, useCallback } from 'react';
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
import { useNavigate, useParams } from 'react-router-dom';
import TypeService from '../../services/TypeService';
import OrganizationService from '../../services/OrganizationService';

const EditProductPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [organizations, setOrganizations] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [conditions, setConditions] = useState([]);
    const [categories, setCategories] = useState([]);
    const [types, setTypes] = useState([]);
    const [addresses, setAddresses] = useState([]);
    const [locations, setLocations] = useState([]);
    const [groups, setGroups] = useState([]);
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
            location_id: '',
            type_id: '',
        },
        groups: [],
    });

    const { showNotification } = useNotification();
    const { fetchProductById, fetchProductGroups, updateProduct, formErrors } = useProductService(navigate);
    const { fetchOrganizationAddresses, fetchOrganizationLocations } = useOrganizationService(navigate);
    const { fetchSuppliers } = useSupplierService(navigate);
    const { fetchConditions } = useConditionService(navigate);
    const { fetchCategories } = useCategoryService(navigate);
    const { fetchTypeGroups } = useTypeGroupsService(navigate);
    const { showLoader, hideLoader } = useLoader();

    const memoizedInitialData = useMemo(() => {
        const flatData = { ...formData };
        Object.keys(formData.product).forEach((key) => {
            flatData[`product.${key}`] = formData.product[key];
        });
        return flatData;
    }, [formData]);

    const fetchAddresses = useCallback(async (organizationId) => {
        try {
            const response = await fetchOrganizationAddresses(organizationId);
            setAddresses(response.data.map((address) => ({
                value: address.id,
                label: `${address.street}, ${address.city} - ${address.state}`,
            })));
        } catch (error) {
            showNotification('error', 'Erro ao carregar endereços.');
        }
    }, [fetchOrganizationAddresses, showNotification]);

    const fetchLocations = useCallback(async (organizationId, addressId) => {
        try {
            const response = await fetchOrganizationLocations(organizationId, addressId);
            setLocations(response.data.map((location) => ({
                value: location.id,
                label: `${location.area}, ${location.section} - ${location.spot}`,
            })));
        } catch (error) {
            showNotification('error', 'Erro ao carregar localizações.');
        }
    }, [fetchOrganizationLocations, showNotification]);

    useEffect(() => {
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
                    fetchConditions(),
                    fetchCategories(),
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

    const handleSubmit = async (data) => {
        try {
            showLoader();
            await updateProduct(id, data);
        } catch (error) {
            console.log(error)
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

    return (
        <MainLayout selectedCompany="ALUCOM">
            <div className="container-fluid p-1">
                <p className="text-xs font-weight-bold text-uppercase mb-1">
                    Editar Produto
                </p>

                <Form
                    initialFormData={memoizedInitialData}
                    onSubmit={handleSubmit}
                    textSubmit="Salvar Alterações"
                    textLoadingSubmit="Salvando..."
                >
                    {() =>
                        productFields.map(section => (
                            <FormSection
                                key={section.section}
                                section={section}
                                formData={memoizedInitialData}
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

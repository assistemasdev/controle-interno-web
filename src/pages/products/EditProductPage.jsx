import React, { use, useEffect, useMemo, useState } from 'react';
import MainLayout from '../../layouts/MainLayout';
import InputField from '../../components/InputField'; 
import { useNavigate, useParams } from 'react-router-dom';
import '../../assets/styles/custom-styles.css'; 
import MyAlert from '../../components/MyAlert';
import ProductService from '../../services/ProductService';
import OrganizationService from '../../services/OrganizationService';
import SupplierService from '../../services/SupplierService';
import ConditionService from '../../services/ConditionService';
import CategoryService from '../../services/CategoryService';
import TypeService from '../../services/TypeService';
import GroupService from '../../services/GroupService'; 
import Select from 'react-select';  
import { CircularProgress } from '@mui/material'; 
import Form from '../../components/Form';

const EditProductPage = () => {
    const navigate = useNavigate(); 
    const { id } = useParams();
    const [loading, setLoading] = useState(true); 
    const [message, setMessage] = useState({ type: '', text: '' });
    const [formErrors, setFormErrors] = useState({}); 
    const [organizations, setOrganizations] = useState([]);
    const [types, setTypes] = useState([]);
    const [conditions, setConditions] = useState([]);
    const [categories, setCategories] = useState([]);
    const [addresses, setAddresses] = useState([]); 
    const [locations, setLocations] = useState([]);
    const [groups, setGroups] = useState([]);
    const [suppliers, setSuppliers] = useState([])
    const [productGroups, setProductGroups] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false); 

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
    });

    const memoizedInitialData = useMemo(() => formData, [formData]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                
                const [
                    organizationsResponse,
                    suppliersResponse,
                    conditionsResponse,
                    categoriesResponse,
                    typesResponse,
                    groupsResponse,
                    productResponse,
                    productGroupsResponse
                ] = await Promise.all([
                    OrganizationService.getAll(navigate),
                    SupplierService.getAll(navigate),
                    ConditionService.getAll(navigate),
                    CategoryService.getAll(navigate),
                    TypeService.getAll(navigate),
                    GroupService.getAll(navigate),
                    ProductService.getById(id, navigate),
                    ProductService.getProductGroupsById(id, navigate),
                ]);

                setOrganizations(organizationsResponse.result.data.map(org => ({ value: org.id, label: org.name })));
                setSuppliers(suppliersResponse.result.data.map(supplier => ({ value: supplier.id, label: supplier.name })));
                setConditions(conditionsResponse.result.data.map(condition => ({ value: condition.id, label: condition.name })));
                setCategories(categoriesResponse.result.data.map(category => ({ value: category.id, label: category.name })));
                setTypes(typesResponse.result.data.map(type => ({ value: type.id, label: type.name })));
                setGroups(groupsResponse.result.data.map(group => ({ value: group.id, label: group.name })));
                setProductGroups(productGroupsResponse.result.map(productGroup => ({value: productGroup.id, label: productGroup.name})));
                
                const product = productResponse.result;

                setFormData({
                    product: {
                        name: product.name || '',
                        number: product.number || '',
                        serial_number: product.serial_number || '',
                        current_organization_id: product.current_organization_id || '',
                        owner_organization_id: product.owner_organization_id || '',
                        supplier_id: product.supplier_id || '',
                        purchase_date: product.purchase_date || '',
                        warranty_date: product.warranty_date || '',
                        condition_id: product.condition_id || '',
                        category_id: product.category_id || '',
                        address_id: product.address_id || '',
                        location_id: product.location_id || '',
                        type_id: product.type_id || '',
                    },
                    groups: productGroupsResponse.result.map(group => group.id) || []

                });

                if (product.current_organization_id) {
                    fetchAddresses(product.current_organization_id);
                }

                if (product.address_id && product.current_organization_id) {
                    fetchLocations(product.current_organization_id, product.address_id);
                }

            } catch (error) {
                const errorMessage = error.message || 'Erro ao carregar os dados.';
                setMessage({ type: 'error', text: errorMessage });
                console.error('Erro no carregamento dos dados:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id, navigate]);

    const handleChange = (e) => {
        const { id, value } = e.target;
        const [category, key] = id.split('.');

        setFormData((prev) => ({
            ...prev,
            [category]: {
                ...prev[category],
                [key]: value
            }
        }));
    };

    const handleOrganizationChange = (selectedOption) => {
        const selectedOrganizationId = selectedOption ? selectedOption.value : '';
        setFormData(prev => ({
            ...prev,
            product: {
                ...prev.product,
                current_organization_id: selectedOrganizationId
            }
        }));

        if (selectedOrganizationId) {
            fetchAddresses(selectedOrganizationId);
        } else {
            setAddresses([]);
        }
    };

    const fetchAddresses = async (organizationId) => {
        try {
            const response = await OrganizationService.allOrganizationAddresses(organizationId, navigate);
            const addressesFormatted = response.result.map(address => ({
                value: address.id,
                label: `${address.street}, ${address.city} - ${address.state}`
            }));
            setAddresses(addressesFormatted);
        } catch (error) {
            const errorMessage = error.response?.data?.error || error.message || 'Erro ao carregar endereços';
            setMessage({ type: 'error', text: errorMessage });
        }
    };

    const fetchLocations = async (organizationId, addressId) => {
        try {
            const response = await OrganizationService.allOrganizationLocation(organizationId, addressId, navigate);
            const locationsFormatted = response.result.map(location => ({
                value: location.id,
                label: `${location.area}, ${location.section} - ${location.spot}`
            }));
            setLocations(locationsFormatted);
        } catch (error) {
            const errorMessage = error.response?.data?.error || error.message || 'Erro ao carregar localizações';
            setMessage({ type: 'error', text: errorMessage });
        }
    };

    const handleSubmit = async () => {
        try {
            const response = await ProductService.update(id, formData, navigate);
            const { message } = response;

            setMessage({ type: 'success', text: message });
        } catch (error) {
            if (error.status === 422 && error.data) {
                setFormErrors(error.data);
                return;
            }

            setMessage({ type: 'error', text: error.message || 'Erro ao atualizar o produto' });
        } finally {
            setIsSubmitting(false)
        }
    };

    const handleBack = () => {
        navigate(`/produtos/`);
    };

    return (
        <MainLayout selectedCompany="ALUCOM">
            <div className="container-fluid p-1">
                <div className="text-xs font-weight-bold text-primary text-uppercase mb-1 text-dark">
                    Editar Produto
                </div>
                {loading ? (
                    <div className="d-flex justify-content-center mt-5">
                        <CircularProgress size={50} />
                    </div>
                ) : (
                    <Form
                        initialFormData={memoizedInitialData}
                        onSubmit={() => handleSubmit(formData)} 
                        textSubmit="Editar"
                        textLoadingSubmit="Editando..."
                        handleBack={handleBack}
                    >
                        {() => (
                            <>
                            
                                {message.text && <MyAlert severity={message.type} message={message.text} onClose={() => setMessage({ type: '', text: '' })} />}

                                <div className="form-row">
                                    <div className="d-flex flex-column col-md-6">
                                        <InputField
                                            label="Nome:"
                                            type="text"
                                            id="product.name"
                                            value={formData.product.name}
                                            onChange={handleChange}
                                            placeholder="Digite o nome do produto"
                                            error={formErrors['product.name']}
                                        />
                                    </div>
                                    <div className="d-flex flex-column col-md-6">
                                        <InputField
                                            label="Número:"
                                            type="number"
                                            id="product.number"
                                            value={formData.product.number}
                                            onChange={handleChange}
                                            placeholder="Digite o número do produto"
                                            error={formErrors['product.number']}
                                        />
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="d-flex flex-column col-md-6">
                                        <InputField
                                            label="Número de Série:"
                                            type="text"
                                            id="product.serial_number"
                                            value={formData.product.serial_number}
                                            onChange={handleChange}
                                            placeholder="Digite o número de série"
                                            error={formErrors['product.serial_number']}
                                        />
                                    </div>
                                    <div className="d-flex flex-column col-md-6">
                                        <label htmlFor="current_organization_id" className="text-dark font-weight-bold mt-1">Organização Atual:</label>
                                        <Select
                                            name="current_organization_id"
                                            options={organizations}
                                            classNamePrefix="select"
                                            value={organizations.find(org => org.value === formData.product.current_organization_id) || null}
                                            onChange={handleOrganizationChange}
                                            noOptionsMessage={() => "Nenhuma organização encontrada"}
                                            placeholder="Selecione a organização"
                                        />
                                        {formErrors['product.current_organization_id'] && (
                                            <div className="invalid-feedback d-block">
                                                {formErrors['product.current_organization_id']}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="d-flex flex-column col-md-6">
                                        <label htmlFor="owner_organization_id" className="text-dark font-weight-bold mt-1">Organização Proprietária:</label>
                                        <Select
                                            name="owner_organization_id"
                                            options={organizations}
                                            classNamePrefix="select"
                                            value={organizations.find(org => org.value === formData.product.owner_organization_id) || null}
                                            onChange={(selectedOption) =>
                                                setFormData(prev => ({
                                                    ...prev,
                                                    product: {
                                                        ...prev.product,
                                                        owner_organization_id: selectedOption ? selectedOption.value : ''
                                                    }
                                                }))
                                            }
                                            noOptionsMessage={() => "Nenhuma organização encontrada"}
                                            placeholder="Selecione a organização"
                                        />
                                        {formErrors['product.owner_organization_id'] && (
                                            <div className="invalid-feedback d-block">
                                                {formErrors['product.owner_organization_id']}
                                            </div>
                                        )}
                                    </div>
                                    <div className="d-flex flex-column col-md-6">
                                        <label htmlFor="supplier_id" className="text-dark font-weight-bold mt-1">Fornecedor:</label>
                                        <Select
                                            name="supplier_id"
                                            options={suppliers}
                                            classNamePrefix="select"
                                            value={suppliers.find(supplier => supplier.value === formData.product.supplier_id) || null}
                                            onChange={(selectedOption) =>
                                                setFormData(prev => ({
                                                    ...prev,
                                                    product: {
                                                        ...prev.product,
                                                        supplier_id: selectedOption ? selectedOption.value : ''
                                                    }
                                                }))
                                            }
                                            noOptionsMessage={() => "Nenhum fornecedor encontrado"}
                                            placeholder="Selecione o fornecedor"
                                        />
                                        {formErrors['product.supplier_id'] && (
                                            <div className="invalid-feedback d-block">
                                                {formErrors['product.supplier_id']}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="d-flex flex-column col-md-6">
                                        <label htmlFor="address_id" className="text-dark font-weight-bold mt-1">Endereço:</label>
                                        <Select
                                            name="address_id"
                                            options={addresses}
                                            classNamePrefix="select"
                                            value={addresses.find(address => address.value === formData.product.address_id) || null}
                                            onChange={(selectedOption) =>
                                                setFormData(prev => ({
                                                    ...prev,
                                                    product: {
                                                        ...prev.product,
                                                        address_id: selectedOption ? selectedOption.value : ''
                                                    }
                                                }))
                                            }
                                            noOptionsMessage={() => "Nenhum endereço encontrado"}
                                            placeholder="Selecione o endereço"
                                        />
                                        {formErrors['product.address_id'] && (
                                            <div className="invalid-feedback d-block">
                                                {formErrors['product.address_id']}
                                            </div>
                                        )}
                                    </div>
                                    <div className="d-flex flex-column col-md-6">
                                        <label htmlFor="location_id" className="text-dark font-weight-bold mt-1">Localização:</label>
                                        <Select
                                            name="location_id"
                                            options={locations}
                                            classNamePrefix="select"
                                            value={locations.find(location => location.value === formData.product.location_id) || null}
                                            onChange={(selectedOption) =>
                                                setFormData(prev => ({
                                                    ...prev,
                                                    product: {
                                                        ...prev.product,
                                                        location_id: selectedOption ? selectedOption.value : ''
                                                    }
                                                }))
                                            }
                                            noOptionsMessage={() => "Nenhuma localização encontrada"}
                                            placeholder="Selecione a localização"
                                        />
                                        {formErrors['product.location_id'] && (
                                            <div className="invalid-feedback d-block">
                                                {formErrors['product.location_id']}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="d-flex flex-column col-md-6">
                                        <InputField
                                            label="Data de Compra:"
                                            type="date"
                                            id="product.purchase_date"
                                            value={formData.product.purchase_date}
                                            onChange={handleChange}
                                            error={formErrors['product.purchase_date']}
                                        />
                                    </div>
                                    <div className="d-flex flex-column col-md-6">
                                        <InputField
                                            label="Data de Garantia:"
                                            type="date"
                                            id="product.warranty_date"
                                            value={formData.product.warranty_date}
                                            onChange={handleChange}
                                            error={formErrors['product.warranty_date']}
                                        />
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="d-flex flex-column col-md-4">
                                        <label htmlFor="condition_id" className="text-dark font-weight-bold mt-1">Condição:</label>
                                        <Select
                                            name="condition_id"
                                            options={conditions}
                                            classNamePrefix="select"
                                            value={conditions.find(condition => condition.value === formData.product.condition_id) || null}
                                            onChange={(selectedOption) =>
                                                setFormData(prev => ({
                                                    ...prev,
                                                    product: {
                                                        ...prev.product,
                                                        condition_id: selectedOption ? selectedOption.value : ''
                                                    }
                                                }))
                                            }
                                            noOptionsMessage={() => "Nenhuma condição encontrada"}
                                            placeholder="Selecione a condição"
                                        />
                                        {formErrors['product.condition_id'] && (
                                            <div className="invalid-feedback d-block">
                                                {formErrors['product.condition_id']}
                                            </div>
                                        )}
                                    </div>
                                    <div className="d-flex flex-column col-md-4">
                                        <label htmlFor="type_id" className="text-dark font-weight-bold mt-1">Tipo:</label>
                                        <Select
                                            name="type_id"
                                            options={types}
                                            classNamePrefix="select"
                                            value={types.find(type => type.value === formData.product.type_id) || null}
                                            onChange={(selectedOption) =>
                                                setFormData(prev => ({
                                                    ...prev,
                                                    product: {
                                                        ...prev.product,
                                                        type_id: selectedOption ? selectedOption.value : ''
                                                    }
                                                }))
                                            }
                                            noOptionsMessage={() => "Nenhum tipo encontrado"}
                                            placeholder="Selecione o tipo"
                                        />
                                        {formErrors['product.type_id'] && (
                                            <div className="invalid-feedback d-block">
                                                {formErrors['product.type_id']}
                                            </div>
                                        )}
                                    </div>
                                    <div className="d-flex flex-column col-md-4">
                                        <label htmlFor="type_id" className="text-dark font-weight-bold mt-1">Categoria:</label>
                                        <Select
                                            name="category_id"
                                            options={categories}
                                            classNamePrefix="select"
                                            value={categories.find(category => category.value === formData.product.category_id) || null}
                                            onChange={(selectedOption) =>
                                                setFormData(prev => ({
                                                    ...prev,
                                                    product: {
                                                        ...prev.product,
                                                        category_id: selectedOption ? selectedOption.value : ''
                                                    }
                                                }))
                                            }
                                            noOptionsMessage={() => "Nenhuma categoria encontrado"}
                                            placeholder="Selecione a categoria"
                                        />
                                        {formErrors['product.category_id'] && (
                                            <div className="invalid-feedback d-block">
                                                {formErrors['product.category_id']}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="d-flex flex-column col-md-12">
                                        <label htmlFor="groups" className="text-dark font-weight-bold mt-1">Grupos:</label>
                                        <Select
                                            isMulti
                                            name="groups"
                                            options={groups}
                                            classNamePrefix="select"
                                            value={groups.filter(group => formData.groups.includes(group.value))} 
                                            onChange={(selectedOptions) =>
                                                setFormData(prev => ({
                                                    ...prev,
                                                    groups: selectedOptions ? selectedOptions.map(option => option.value) : []
                                                }))
                                            }
                                            noOptionsMessage={() => "Nenhum grupo encontrado"}
                                            placeholder="Selecione os grupos"
                                        />
                                        {formErrors['groups'] && (
                                            <div className="invalid-feedback d-block">
                                                {formErrors['groups']}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </>
                        )}
                    </Form>
                )}
            </div>
        </MainLayout>
    );
};

export default EditProductPage;

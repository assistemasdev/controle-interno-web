import React, { useEffect, useState } from 'react';
import MainLayout from '../../layouts/MainLayout';
import InputField from '../../components/InputField'; 
import Button from '../../components/Button'; 
import { useNavigate } from 'react-router-dom';
import '../../assets/styles/custom-styles.css'; 
import MyAlert from '../../components/MyAlert';
import { usePermissions } from '../../hooks/usePermissions';
import ProductService from '../../services/ProductService';
import OrganizationService from '../../services/OrganizationService';
import SupplierService from '../../services/SupplierService';
import ConditionService from '../../services/ConditionService';
import CategoryService from '../../services/CategoryService';
import TypeService from '../../services/TypeService';
import GroupService from '../../services/GroupService'; 
import Select from 'react-select';  
import { CircularProgress } from '@mui/material'; 

const CreateProductPage = () => {
    const navigate = useNavigate(); 
    const { canAccess } = usePermissions();
    const [organizations, setOrganizations] = useState([]);
    const [types, setTypes] = useState([]);
    const [conditions, setConditions] = useState([]);
    const [categories, setCategories] = useState([]);
    const [addresses, setAddresses] = useState([]); 
    const [locations, setLocations] = useState([]);
    const [groups, setGroups] = useState([]);
    const [selectedOrganizationId, setSelectedOrganizationId] = useState('');
    const [suppliers, setSuppliers] = useState([]);
    const [loading, setLoading] = useState(true); 
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

    const [message, setMessage] = useState({ type: '', text: '' });

    const [formErrors, setFormErrors] = useState({}); 

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
                    groupsResponse
                ] = await Promise.all([
                    OrganizationService.getAll(navigate),
                    SupplierService.getAll(navigate),
                    ConditionService.getAll(navigate),
                    CategoryService.getAll(navigate),
                    TypeService.getAll(navigate),
                    GroupService.getAll(navigate),
                ]);
    
                setOrganizations(organizationsResponse.result.map(org => ({ value: org.id, label: org.name })));
                setSuppliers(suppliersResponse.result.map(supplier => ({ value: supplier.id, label: supplier.name })));
                setConditions(conditionsResponse.result.map(condition => ({ value: condition.id, label: condition.name })));
                setCategories(categoriesResponse.result.map(category => ({ value: category.id, label: category.name })));
                setTypes(typesResponse.result.map(type => ({ value: type.id, label: type.name })));
                setGroups(groupsResponse.result.map(group => ({ value: group.id, label: group.name })));
            } catch (error) {
                const errorMessage = error.response?.data?.error || 'Erro ao carregar os dados.';
                setMessage({ type: 'error', text: errorMessage });
                console.error('Erro no carregamento dos dados:', error);
            } finally {
                setLoading(false); 
            }
        };
        fetchData();
    }, [navigate]);

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

    const handleAddressChange = (selectedOption) => {
        const selectedAddressId = selectedOption ? selectedOption.value : '';
        setFormData(prev => ({
            ...prev,
            product: {
                ...prev.product,
                address_id: selectedAddressId
            }
        }));
    
        if (selectedAddressId && selectedOrganizationId) {
            fetchLocations(selectedOrganizationId, selectedAddressId); 
        } else {
            setLocations([]); 
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
            setMessage({type:'error', text:errorMessage});
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
            setMessage({type:'error', text:errorMessage});
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormErrors({});
        setMessage({ type: '', text: '' });
    
        try {
            const response = await ProductService.create(formData, navigate);
            const { message } = response; 
        
            setMessage({ type: 'success', text: message });
            setFormData({
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
                }
            });
            return;
        } catch (error) {
            if (error.status === 422 && error.data) {
                setFormErrors({
                    'product.name': error.data['product.name']?.[0] || '',
                    'product.number': error.data['product.number']?.[0] || '',
                    'product.serial_number': error.data['product.serial_number']?.[0] || '',
                    'product.current_organization_id': error.data['product.current_organization_id']?.[0] || '',
                    'product.owner_organization_id': error.data['product.owner_organization_id']?.[0] || '',
                    'product.supplier_id': error.data['product.supplier_id']?.[0] || '',
                    'product.purchase_date': error.data['product.purchase_date']?.[0] || '',
                    'product.warranty_date': error.data['product.warranty_date']?.[0] || '',
                    'product.condition_id': error.data['product.condition_id']?.[0] || '',
                    'product.category_id': error.data['product.category_id']?.[0] || '',
                    'product.address_id': error.data['product.address_id']?.[0] || '',
                    'product.location_id': error.data['product.location_id']?.[0] || '',
                    'groups': error.data['groups']?.[0] || '',

                });
                return;
            }

            setMessage({ type: 'error', text: error.message || 'Erro ao cadastrar o produto' });
        }
    };

    const handleBack = () => {
        navigate(`/produtos/`);  
    };

    return (
        <MainLayout selectedCompany="ALUCOM">
            <div className="container-fluid p-1">
                <div className="text-xs font-weight-bold text-primary text-uppercase mb-1 text-dark">
                    Cadastro de Produto
                </div>
                    {loading ? (
                        <div className="d-flex justify-content-center mt-5">
                            <CircularProgress size={50} /> 
                        </div>
                    ) : (
                        <form className="p-3 mt-2 rounded shadow-sm mb-2" style={{ backgroundColor: '#FFFFFF' }} onSubmit={handleSubmit}>
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
                                    <label htmlFor="roles" className='text-dark font-weight-bold mt-1'>Organização:</label>
                                    <Select
                                        name="current_organization_id"
                                        options={organizations} 
                                        className={`basic-multi-select`}
                                        classNamePrefix="select"
                                        value={organizations.find(org => org.value === formData.product.current_organization_id) || null}
                                        onChange={(selectedOption) => {
                                            const selectedOrgId = selectedOption ? selectedOption.value : '';
                                            setSelectedOrganizationId(selectedOrgId);
                                            handleOrganizationChange(selectedOption)
                                        }}
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
                                    <label htmlFor="roles" className='text-dark font-weight-bold mt-1'>Empresa de Aquisição:</label>
                                    <Select
                                        name="owner_organization_id"
                                        options={organizations} 
                                        className={`basic-multi-select`}
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
                                    <label htmlFor="roles" className='text-dark font-weight-bold mt-1'>Fornecedor:</label>
                                    <Select
                                        name="supplier_id"
                                        options={suppliers} 
                                        className={`basic-multi-select`}
                                        classNamePrefix="select"
                                        value={suppliers.find(org => org.value === formData.product.supplier_id) || null}
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
                                    <label htmlFor="address_id" className='text-dark font-weight-bold mt-1'>Endereço:</label>
                                    <Select
                                        name="address_id"
                                        options={addresses} 
                                        className={`basic-multi-select`}
                                        classNamePrefix="select"
                                        value={addresses.find(org => org.value === formData.product.address_id) || null}
                                        onChange={handleAddressChange}
                                        noOptionsMessage={() => "Nenhumm endereço encontrado"}
                                        placeholder="Selecione um endereço"
                                    />
                                    {formErrors['product.address_id'] && (
                                        <div className="invalid-feedback d-block">
                                            {formErrors['product.address_id']}
                                        </div>
                                    )}
                                </div>
                                <div className="d-flex flex-column col-md-6">
                                    <label htmlFor="address_id" className='text-dark font-weight-bold mt-1'>Localização:</label>
                                    <Select
                                        name="location_id"
                                        options={locations} 
                                        className={`basic-multi-select`}
                                        classNamePrefix="select"
                                        value={locations.find(org => org.value === formData.product.location_id) || null}
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
                                        placeholder="Selecione uma localização"
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
                                        placeholder="Adicione data de compra"
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
                                        placeholder="Adicione data de garantia"
                                        error={formErrors['product.warranty_date']} 
                                    />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="d-flex flex-column col-md-4">
                                    <label htmlFor="roles" className='text-dark font-weight-bold mt-1'>Condição do Produto:</label>
                                    <Select
                                        name="condition_id"
                                        options={conditions} 
                                        className={`basic-multi-select`}
                                        classNamePrefix="select"
                                        value={conditions.find(org => org.value === formData.product.condition_id) || null}
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
                                    <label htmlFor="roles" className='text-dark font-weight-bold mt-1'>Tipo:</label>
                                    <Select
                                        name="type_id"
                                        options={types} 
                                        className={`basic-multi-select`}
                                        classNamePrefix="select"
                                        value={types.find(org => org.value === formData.product.type_id) || null}
                                        onChange={(selectedOption) =>
                                            setFormData(prev => ({
                                                ...prev,
                                                product: {
                                                    ...prev.product,
                                                    type_id: selectedOption ? selectedOption.value : ''
                                                }
                                            }))
                                        }
                                        noOptionsMessage={() => "Nenhuma tipo encontrado"}
                                        placeholder="Selecione o tipo"
                                    />
                                    {formErrors['product.type_id'] && (
                                        <div className="invalid-feedback d-block">
                                            {formErrors['product.type_id']}
                                        </div>
                                    )}
                                </div>
                                <div className="d-flex flex-column col-md-4">
                                    <label htmlFor="roles" className='text-dark font-weight-bold mt-1'>Categoria:</label>
                                    <Select
                                        name="category_id"
                                        options={categories} 
                                        className={`basic-multi-select`}
                                        classNamePrefix="select"
                                        value={categories.find(org => org.value === formData.product.category_id) || null}
                                        onChange={(selectedOption) =>
                                            setFormData(prev => ({
                                                ...prev,
                                                product: {
                                                    ...prev.product,
                                                    category_id: selectedOption ? selectedOption.value : ''
                                                }
                                            }))
                                        }
                                        noOptionsMessage={() => "Nenhuma categoria encontrada"}
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
                                    <label htmlFor="groups" className='text-dark font-weight-bold'>Grupos:</label>
                                    <Select
                                        isMulti
                                        name="groups"
                                        options={groups}  
                                        className={`basic-multi-select ${formErrors['groups'] ? 'is-invalid' : ''}`}
                                        classNamePrefix="select"
                                        value={groups.filter(group => 
                                            formData.groups?.includes(group.value)
                                        )}
                                        onChange={(selectedOptions) =>
                                            setFormData(prev => ({
                                                ...prev,
                                                groups: selectedOptions.map(option => option.value) 
                                                
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

                            <div className="mt-3 form-row gap-2">
                                {canAccess('Criar produtos') && (
                                    <Button type="submit" text="Cadastrar Produto" className="btn btn-blue-light fw-semibold" />
                                )}
                                <Button type="button" text="Voltar" className="btn btn-blue-light fw-semibold" onClick={handleBack} />
                            </div>
                        </form>
                    )
                }

            </div>
        </MainLayout>
    );
};

export default CreateProductPage;

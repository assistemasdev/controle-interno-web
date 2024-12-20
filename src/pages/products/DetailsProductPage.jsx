import React, { useEffect, useState } from 'react';
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
import StatusService from '../../services/StatusService';
import { CircularProgress } from '@mui/material';
import Button from '../../components/Button';

const DetailsProductPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [productDetails, setProductDetails] = useState({});
    const [productGroups, setProductGroups] = useState([]);
    const [options, setOptions] = useState({
        organizations: {},
        suppliers: {},
        conditions: {},
        categories: {},
        types: {},
        statuses: {}
    });

    useEffect(() => {
        const fetchOptions = async () => {
            try {
                const [
                    organizationsResponse,
                    suppliersResponse,
                    conditionsResponse,
                    categoriesResponse,
                    typesResponse,
                    statusesResponse
                ] = await Promise.all([
                    OrganizationService.getAll(),
                    SupplierService.getAll(),
                    ConditionService.getAll(),
                    CategoryService.getAll(),
                    TypeService.getAll(),
                    StatusService.getAll()
                ]);

                setOptions({
                    organizations: Object.fromEntries(
                        organizationsResponse.result.map(org => [org.id, org.name])
                    ),
                    suppliers: Object.fromEntries(
                        suppliersResponse.result.map(supplier => [supplier.id, supplier.name])
                    ),
                    conditions: Object.fromEntries(
                        conditionsResponse.result.map(condition => [condition.id, condition.name])
                    ),
                    categories: Object.fromEntries(
                        categoriesResponse.result.map(category => [category.id, category.name])
                    ),
                    types: Object.fromEntries(
                        typesResponse.result.map(type => [type.id, type.name])
                    ),
                    statuses: Object.fromEntries(
                        statusesResponse.result.map(status => [status.id, status.name])
                    )
                });
            } catch (error) {
                console.error('Erro ao buscar opções:', error);
            }
        };

        const fetchProductDetails = async () => {
            try {
                setLoading(true);
                const [productResponse, productGroupsResponse] = await Promise.all([
                    ProductService.getById(id, navigate),
                    ProductService.getProductGroupsById(id, navigate)
                ]);

                setProductDetails(productResponse.result);
                setProductGroups(productGroupsResponse.result);
            } catch (error) {
                const errorMessage = error.message || 'Erro ao carregar os dados.';
                setMessage({ type: 'error', text: errorMessage });
                console.error('Erro no carregamento dos dados:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchOptions();
        fetchProductDetails();
    }, [id, navigate]);

    const handleBack = () => {
        navigate(`/produtos/`);
    };

    const getOptionLabel = (options, id) => options[id] || 'N/A';

    return (
        <MainLayout selectedCompany="ALUCOM">
            <div className="container-fluid p-1">
                <div className="text-xs font-weight-bold text-primary text-uppercase mb-1 text-dark">
                    Detalhes do Produto
                </div>
                {loading ? (
                    <div className="d-flex justify-content-center mt-5">
                        <CircularProgress size={50} />
                    </div>
                ) : (
                    <div className="p-3 mt-2 rounded shadow-sm mb-2" style={{ backgroundColor: '#FFFFFF' }}>
                        {message.text && (
                            <MyAlert
                                severity={message.type}
                                message={message.text}
                                onClose={() => setMessage({ type: '', text: '' })}
                            />
                        )}

                        <div className="form-row">
                            <div className="d-flex flex-column col-md-6">
                                <InputField
                                    label="Nome:"
                                    type="text"
                                    id="product.name"
                                    value={productDetails.name || 'N/A'}
                                    disabled
                                />
                            </div>
                            <div className="d-flex flex-column col-md-6">
                                <InputField
                                    label="Número:"
                                    type="text"
                                    id="product.number"
                                    value={productDetails.number || 'N/A'}
                                    disabled
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="d-flex flex-column col-md-6">
                                <InputField
                                    label="Número de Série:"
                                    type="text"
                                    id="product.serial_number"
                                    value={productDetails.serial_number || 'N/A'}
                                    disabled
                                />
                            </div>
                            <div className="d-flex flex-column col-md-6">
                                <InputField
                                    label="Organização Atual:"
                                    type="text"
                                    id="product.current_organization"
                                    value={getOptionLabel(options.organizations, productDetails.current_organization_id)}
                                    disabled
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="d-flex flex-column col-md-6">
                                <InputField
                                    label="Organização Proprietária:"
                                    type="text"
                                    id="product.owner_organization"
                                    value={getOptionLabel(options.organizations, productDetails.owner_organization_id)}
                                    disabled
                                />
                            </div>
                            <div className="d-flex flex-column col-md-6">
                                <InputField
                                    label="Fornecedor:"
                                    type="text"
                                    id="product.supplier"
                                    value={getOptionLabel(options.suppliers, productDetails.supplier_id)}
                                    disabled
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="d-flex flex-column col-md-6">
                                <InputField
                                    label="Data de Compra:"
                                    type="text"
                                    id="product.purchase_date"
                                    value={productDetails.purchase_date || 'N/A'}
                                    disabled
                                />
                            </div>
                            <div className="d-flex flex-column col-md-6">
                                <InputField
                                    label="Data de Garantia:"
                                    type="text"
                                    id="product.warranty_date"
                                    value={productDetails.warranty_date || 'N/A'}
                                    disabled
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="d-flex flex-column col-md-4">
                                <InputField
                                    label="Condição:"
                                    type="text"
                                    id="product.condition"
                                    value={getOptionLabel(options.conditions, productDetails.condition_id)}
                                    disabled
                                />
                            </div>
                            <div className="d-flex flex-column col-md-4">
                                <InputField
                                    label="Tipo:"
                                    type="text"
                                    id="product.type"
                                    value={getOptionLabel(options.types, productDetails.type_id)}
                                    disabled
                                />
                            </div>
                            <div className="d-flex flex-column col-md-4">
                                <InputField
                                    label="Categoria:"
                                    type="text"
                                    id="product.category"
                                    value={getOptionLabel(options.categories, productDetails.category_id)}
                                    disabled
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="d-flex flex-column col-md-6">
                                <InputField
                                    label="Status:"
                                    type="text"
                                    id="product.status"
                                    value={getOptionLabel(options.statuses, productDetails.status_id)}
                                    disabled
                                />
                            </div>
                            <div className="d-flex flex-column col-md-6">
                                <InputField
                                    label="Grupos:"
                                    type="text"
                                    id="product.groups"
                                    value={productGroups && productGroups.length
                                        ? productGroups.map(group => group.name).join(' - ')
                                        : 'N/A'}
                                    disabled
                                />
                            </div>
                        </div>

                        <div className="mt-3 form-row gap-2">
                            <Button type="button" text="Voltar" className="btn btn-blue-light fw-semibold" onClick={handleBack} />
                        </div>
                    </div>
                )}
            </div>
        </MainLayout>
    );
};

export default DetailsProductPage;

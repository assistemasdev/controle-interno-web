import React, { useState, useEffect } from "react";
import MainLayout from "../../layouts/MainLayout";
import MyAlert from "../../components/MyAlert";
import Button from "../../components/Button";
import { usePermissions } from "../../hooks/usePermissions";
import { CircularProgress } from '@mui/material';
import DynamicTable from "../../components/DynamicTable";
import ProductService from "../../services/ProductService";
import StatusService from "../../services/StatusService";
import { useNavigate, useLocation } from "react-router-dom";
import { faEdit, faTrash, faEye  } from '@fortawesome/free-solid-svg-icons';
import ConfirmationModal from "../../components/modals/ConfirmationModal";
import { PAGINATION } from "../../constants/pagination";
import Select from 'react-select';  
import { removeDuplicatesWithPriority } from "../../utils/arrayUtils";

const ProductsPage = () => {
    const { canAccess } = usePermissions();
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState([]);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);
    const [statusOptions, setStatusOptions] = useState({});
    const navigate = useNavigate();
    const location = useLocation();
    const [inputNumberValue, setInputNumberValue] = useState();
    const [currentPage, setCurrentPage] = useState(PAGINATION.DEFAULT_PAGE);
    const [itemsPerPage, setItemsPerPage] = useState(PAGINATION.DEFAULT_PER_PAGE);
    const [totalPages, setTotalPages] = useState(PAGINATION.DEFAULT_TOTAL_PAGES);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [numberFilter, setNumberFilter] = useState([]);
    const [productsOptions, setProductsOptions] = useState([]);

    useEffect(() => {
        setMessage(null);
        if (location.state?.message) {
            setMessage({type:location.state.type, text: location.state.message});
        }
    }, [location.state]); 

    const fetchData = async (ids, number, page = 1) => {
        try {
            setLoading(true);
            const [statusResponse, productsResponse] = await Promise.all([
                StatusService.getAll(),
                ProductService.getPaginated({number, ids, page, perPage: itemsPerPage}, navigate)
            ]);

            const statusMap = Object.fromEntries(
                statusResponse.result.map(status => [status.id, status.name])
            );
            setStatusOptions(statusMap);

            const result = productsResponse.result.data;
            const filteredProducts = result.map(product => {            
                return {
                    id: product.id,
                    name: product.name,
                    number: product.number,
                    status: statusMap[product.status_id] || 'N/A'
                };
            });

            setProducts(filteredProducts);
        } catch (error) {
            const errorMessage = error.response?.data?.error || error.message || 'Erro ao carregar produtos';
            setError(errorMessage);
            console.error("Erro capturado no fetchData:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleEdit = (product) => {
        navigate(`/produtos/editar/${product.id}`);
    };

    const handleDelete = (product) => {
        setProductToDelete(product);
        setDeleteModalOpen(true);
    };

    const handleViewDetails = (product) => {
        navigate(`/produtos/detalhes/${product.id}`);
    };

    const handleChangeNumber = (selectedOptions) => {
        setSelectedProducts(selectedOptions);
        setNumberFilter('');
        setInputNumberValue('');
    }

    const handleOnBlurNumber = () => {
        if (numberFilter && !selectedProducts.some(user => user.label === numberFilter)) {
            setProductsOptions([
                ...selectedProducts,
                { numberFilter: true,value: numberFilter, label: numberFilter }, 
            ]);
        }
        setNumberFilter(''); 
        setInputNumberValue('');
    }

    const handleInputNumberChange = (value, { action }) => {
        if(numberFilter && numberFilter.length == 0) {
            setProductsOptions([]);
        }

        if(action === 'input-change') {
            setNumberFilter(value)
            setInputNumberValue(value)
            fetchProductNumberAutocomplete(value)
        }
    }

    const handleFilterSubmit = (e) => {
        e.preventDefault();
        fetchData(
            selectedProducts.filter((product) => product.numberFilter == false).map(product => (product.value)),
            selectedProducts.filter((product) => product.numberFilter == true).map(product => (product.value))
        )
    }

    const fetchProductNumberAutocomplete = async (number) => {
        try {
            if(number.length > 0) {
                const response = await ProductService.autocomplete({number}, navigate);
                const filteredProducts = removeDuplicatesWithPriority(
                    [
                        { numberFilter: true, value: number, label: number },
                        ...response.result.map((product) => ({
                            numberFilter: false,
                            value: product.id,
                            label: product.number,
                        })),
                    ],
                    'label',
                    'numberFilter'
                )

                setProductsOptions(filteredProducts);
            }

            if(number.length == 0) {
                setProductsOptions([])
            }
        } catch (error) {
            console.log(error)
            setMessage({type: 'error', text:'Erro ao pesquisar pelo o usuário'});
        }    
    }

    const handleClearFilters = (e) => {
        e.preventDefault();
        setSelectedProducts('');
        setNumberFilter('');
    }

    const confirmDelete = async () => {
        try {
            setLoading(true);
            const response = await ProductService.delete(productToDelete.id);

            if (response.status === 200) {
                setMessage({ type: 'success', text: response.message });
                fetchData();
                return
            }
        } catch (error) {
            if(error.status == 404 || error.status == 400) {
                setMessage({ type: 'error', text: error.message });
                return
            }
            setError('Erro ao excluir o produto');
            console.error(error);
        } finally {
            setDeleteModalOpen(false);
            setLoading(false);
        }
    };

    const headers = ['id', 'Nome', 'Número', 'Status'];

    const actions = [
        {
            icon: faEdit,
            title: 'Editar Fornecedor',
            buttonClass: 'btn-primary',
            permission: 'Atualizar produtos',
            onClick: handleEdit
        },
        {
            icon: faTrash,
            title: 'Excluir Produtos',
            buttonClass: 'btn-danger',
            permission: 'Excluir produtos',
            onClick: handleDelete
        },{
            icon: faEye, 
            title: 'Ver Detalhes',
            buttonClass: 'btn-info',
            permission: 'Ver produtos', 
            onClick: handleViewDetails 
        }
    ];
    
    return (
        <MainLayout selectedCompany="ALUCOM">
            <div className="container-fluid p-1">
                <div className="text-xs font-weight-bold text-primary text-uppercase mb-1 text-dark">
                    Produtos
                </div>

                <form className="form-row p-3 mt-2 rounded shadow-sm mb-2" style={{ backgroundColor: '#FFFFFF' }} onSubmit={handleFilterSubmit}>
                    {message && <MyAlert severity={message.type} message={message.text} onClose={() => setMessage('')} />}
                    <div className="form-group col-md-12">
                        <label htmlFor="number" className='text-dark font-weight-bold mt-1'>Número:</label>
                            <Select
                                isMulti
                                name="number"
                                options={productsOptions} 
                                className={`basic-multi-select`}
                                classNamePrefix="select"
                                inputValue={inputNumberValue}
                                value={selectedProducts}
                                onInputChange={handleInputNumberChange}
                                onChange={handleChangeNumber}
                                onBlur={handleOnBlurNumber}
                                noOptionsMessage={() => "Nenhum número encontrado"}
                                placeholder="Filtre os produtos pelo número"
                            />
                    </div>
                    <div className="form-group gap-2">
                        <Button type="submit" text="Filtrar" className="btn btn-blue-light fw-semibold m-1" />
                        <Button type="button" text="Limpar filtros" className="btn btn-blue-light fw-semibold m-1" onClick={handleClearFilters} />
                    </div>
                </form>

                <div className="form-row mt-4 d-flex justify-content-between align-items-center">
                    <div className="font-weight-bold text-primary text-uppercase mb-1 text-dark d-flex">
                        Lista de Produtos
                    </div>
                    {canAccess('Criar Produtos') && (
                        <Button
                        text="Novo Produto"
                        className="btn btn-blue-light fw-semibold"
                        link="/produtos/criar"
                        />
                    )}
                </div>

                {loading ? (
                    <div className="d-flex justify-content-center mt-4">
                        <CircularProgress size={50} />
                    </div>
                    ) : error ? (
                    <div className='mt-3'>
                        <MyAlert notTime={true} severity="error" message={error} />
                    </div>
                    ) : (
                    <DynamicTable 
                        headers={headers} 
                        data={products} 
                        actions={actions} 
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={fetchData}
                    />
                )}

            </div>
            <ConfirmationModal
                open={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                itemName={productToDelete ? productToDelete.name : ''}
            />
        </MainLayout>
    )
}

export default ProductsPage;

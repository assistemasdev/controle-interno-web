import React, { useState, useEffect } from "react";
import MainLayout from "../../layouts/MainLayout";
import MyAlert from "../../components/MyAlert";
import InputField from "../../components/InputField";
import Button from "../../components/Button";
import { usePermissions } from "../../hooks/usePermissions";
import { CircularProgress } from '@mui/material';
import DynamicTable from "../../components/DynamicTable";
import ProductService from "../../services/ProductService";
import { useNavigate, useLocation } from "react-router-dom";
import { faEdit, faTrash, faEye  } from '@fortawesome/free-solid-svg-icons';
import { maskCpf, maskCnpj } from "../../utils/maskUtils";
import ConfirmationModal from "../../components/modals/ConfirmationModal";
import { PAGINATION } from "../../constants/pagination";

const ProductsPage = () => {
    const { canAccess } = usePermissions();
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState([]);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();
    const [currentPage, setCurrentPage] = useState(PAGINATION.DEFAULT_PAGE);
    const [itemsPerPage, setItemsPerPage] = useState(PAGINATION.DEFAULT_PER_PAGE);
    const [totalPages, setTotalPages] = useState(PAGINATION.DEFAULT_TOTAL_PAGES);

    useEffect(() => {
        setMessage(null);
        if (location.state?.message) {
            setMessage({type:location.state.type, text: location.state.message});
        }
    }, [location.state]); 
    
    const handleClearFilters = () => {
        setName('');
    };

    const fetchProducts = async (page = 1) => {
        try {
            setLoading(true);
        
            const response = await ProductService.getPaginated({page, perPage: itemsPerPage}, navigate);
            const result = response.result.data
        
            const filteredProducts = result.map(product => {            
                return {
                    id: product.id,
                    name: product.name,
                    number: product.number,
                };
            });
            
            setProducts(filteredProducts);
        } catch (error) {
            const errorMessage = error.response?.data?.error || error.message || 'Erro ao carregar produtos';
            setError(errorMessage);
            console.error("Erro capturado no fetchProducts:", error);
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        fetchProducts();
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

    const confirmDelete = async () => {
        try {
            setLoading(true);
            const response = await ProductService.delete(productToDelete.id);

            if (response.status === 200) {
                setMessage({ type: 'success', text: response.message });
                fetchProducts();
                return
            }

            if(response.status == 404 || response.status == 400) {
                setMessage({ type: 'error', text: response.message });
                return
            }
        } catch (error) {
            setError('Erro ao excluir o fornecedor');
            console.error(error);
        } finally {
            setDeleteModalOpen(false);
            setLoading(false);
        }
    };

    const headers = ['id', 'Nome', 'Número'];

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
            title: 'Excluir Fornecedor',
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

                <form className="form-row p-3 mt-2 rounded shadow-sm mb-2" style={{ backgroundColor: '#FFFFFF' }} onSubmit={() => console.log('oi')}>
                    {message && <MyAlert severity={message.type} message={message.text} onClose={() => setMessage('')} />}
                    <div className="form-group col-md-12">
                        <InputField
                            label='Nome do produto:'
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Digite o nome do produto"
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
                        onPageChange={fetchProducts}
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
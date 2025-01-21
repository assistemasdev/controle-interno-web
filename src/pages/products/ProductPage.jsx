import React, { useState, useEffect, useCallback } from "react";
import MainLayout from "../../layouts/MainLayout";
import Button from "../../components/Button";
import { usePermissions } from "../../hooks/usePermissions";
import DynamicTable from "../../components/DynamicTable";
import { useNavigate, useLocation } from "react-router-dom";
import { faEdit, faTrash, faEye, faUndo } from "@fortawesome/free-solid-svg-icons";
import ConfirmationModal from "../../components/modals/ConfirmationModal";
import { PAGINATION } from "../../constants/pagination";
import AutoCompleteFilter from "../../components/AutoCompleteFilter";
import useLoader from "../../hooks/useLoader";
import useNotification from "../../hooks/useNotification";
import useStatusService from "../../hooks/services/useStatusService";
import baseService from "../../services/baseService";
import useBaseService from "../../hooks/services/useBaseService";
import { entities } from "../../constants/entities";

const ProductsPage = () => {
    const { canAccess } = usePermissions();
    const [products, setProducts] = useState([]);;
    const [statusOptions, setStatusOptions] = useState({});
    const navigate = useNavigate();
    const location = useLocation();
    const [currentPage, setCurrentPage] = useState(PAGINATION.DEFAULT_PAGE);
    const [itemsPerPage] = useState(PAGINATION.DEFAULT_PER_PAGE);
    const [totalPages, setTotalPages] = useState(PAGINATION.DEFAULT_TOTAL_PAGES);
    const { fetchAll, remove } = useBaseService(entities.products,navigate);
    const { fetchAllStatus } = useStatusService(navigate);
    const { hideLoader, showLoader } = useLoader();
    const { showNotification } = useNotification();
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);  
    const [openModalConfirmation, setOpenModalConfirmation] = useState(false);  
    const [filters, setFilters] = useState({
        id: '',
        number: '',
        filledInputs: '',
        deleted_at: false,
        page: 1,
        perPage:itemsPerPage
    })
    const [action, setAction] = useState({
        action: '',
        text: '',
    });

    useEffect(() => {
        if (location.state?.message) {
            showNotification('error', location.state.message );
        }
    }, [location.state]);

    const mapStatus = useCallback((statusData) => {
        return Object.fromEntries(statusData.map((status) => [status.id, status.name]));
    }, []);

    const transformProducts = useCallback((productsData, statusMap) => {
        return productsData.map((product) => ({
            id: product.id,
            name: product.name,
            number: product.number,
            status: statusMap[product.status_id] || "N/A",
        }));
    }, []);

    const fetchData = useCallback(async (filtersSubmit) => {
        try {
            showLoader();
            const [statusResponse, productsResponse] = await Promise.all([
                fetchAllStatus(),
                fetchAll(filtersSubmit || filters),
            ]);
    
            const statusMap = mapStatus(statusResponse.data);
            setStatusOptions(statusMap);
    
            const filteredProducts = transformProducts(productsResponse.data, statusMap);
            setProducts(filteredProducts);
            setCurrentPage(productsResponse.currentPage);
            setTotalPages(productsResponse.last_page);
        } catch (error) {
            console.error("Erro capturado no fetchData:", error);
        } finally {
            hideLoader();
        }
    }, [fetchAllStatus, fetchAll, itemsPerPage, mapStatus, transformProducts, showLoader, hideLoader, showNotification]);

    const handleClearFilters = useCallback(() => {
        window.location.reload();
    }, []);

    useEffect(() => {
        const initializeData = async () => {
            await fetchData();
        };
    
        initializeData();
    }, []);

    const handleEdit = (product) => {
        navigate(`/produtos/editar/${product.id}`);
    };

    const handleViewDetails = (product) => {
        navigate(`/produtos/detalhes/${product.id}`);
    };

    const handleFilterSubmit = (e) => {
        e.preventDefault();
    
        const selectedIds = selectedProducts
            .filter((product) => product.column === 'id' && !product.numberFilter)
            .map((product) => product.value);
    
        const selectedNumbers = selectedProducts
            .filter((product) => product.column === 'number' && product.numberFilter)
            .map((product) => product.value);
    
        const filledInputs = new Set(selectedProducts.map((option) => option.column)).size;
    
        const previousFilters = filters || {};
    
        setFilters(prev => ({
            ...prev,
            id: selectedIds,
            number: selectedNumbers,
            filledInputs,
            page: 1, 
        }));
    
        fetchData({
            id: selectedIds,
            number: selectedNumbers,
            filledInputs,
            page: 1,
            deleted_at: previousFilters.deleted_at,
        });
    };
    
    const handleActivate = (user, action) => {
        setSelectedProduct(user); 
        setAction({
            action,
            text:'Você tem certeza que deseja ativar: '
        })
        setOpenModalConfirmation(true);  
    };

    const handleDelete = (user, action) => {
        setSelectedProduct(user);  
        setAction({
            action,
            text:'Você tem certeza que deseja excluir: '
        })
        setOpenModalConfirmation(true);  
    };
    
    const handleConfirmDelete = async (id) => {
        try {
            showLoader();
            await remove(id);
            setOpenModalConfirmation(false);  
            fetchAll();
        } catch (error) {
            console.log(error);
            setOpenModalConfirmation(false);  
        } finally {
            hideLoader();
        }    
    };

    const handleCancelConfirmation = () => {
        setOpenModalConfirmation(false);  
    };

    const headers = ["Id", "Nome", "Número", "Status"];

    const actions = [
        {
            id:'edit',
            icon: faEdit,
            title: "Editar Produto",
            buttonClass: "btn-primary",
            permission: "Atualizar produtos",
            onClick: handleEdit,
        },
        {
            id:'details',
            icon: faEye,
            title: "Ver Detalhes",
            buttonClass: "btn-info",
            permission: "Ver produtos",
            onClick: handleViewDetails,
        },
        {
            id:'delete',
            icon: faTrash,
            title: "Excluir Produto",
            buttonClass: "btn-danger",
            permission: "Excluir produtos",
            onClick: handleDelete,
        },
        {
            id: 'activate',
            icon: faUndo,
            title: 'Ativar usuário',
            buttonClass: 'btn-info',
            permission: 'Atualizar produtos',
            onClick: handleActivate,
        },
    ];

    return (
        <MainLayout selectedCompany="ALUCOM">
            <div className="container-fluid p-1">
                <div className="text-xs font-weight-bold text-primary text-uppercase mb-1 text-dark">
                    Produtos
                </div>

                <form
                    className="form-row p-3 mt-2 rounded shadow-sm mb-2"
                    style={{ backgroundColor: "#FFFFFF" }}
                    onSubmit={handleFilterSubmit}
                >
                    <div className="form-group col-md-12">
                        <label htmlFor="number" className="text-dark font-weight-bold mt-1">
                            Número:
                        </label>
                        <AutoCompleteFilter
                            service={baseService}
                            columnDataBase="number"
                            model='product'
                            value={selectedProducts}
                            onChange={(selected) => setSelectedProducts(selected)}
                            onBlurColumn="numberFilter"
                            placeholder="Filtre os produtos pelo número"
                            isMulti
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
                    {canAccess("Criar Produtos") && (
                        <Button
                            text="Novo Produto"
                            className="btn btn-blue-light fw-semibold"
                            link="/produtos/criar"
                        />
                    )}
                </div>

                <DynamicTable
                    headers={headers}
                    data={products}
                    actions={actions}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={fetchData}
                    setFilters={setFilters}
                    filters={filters}
                />

                <ConfirmationModal
                    open={openModalConfirmation}
                    onClose={handleCancelConfirmation}
                    onConfirm={() => action.action == 'delete'? handleConfirmDelete(selectedProduct.id) : console.log('oi')}
                    itemName={selectedProduct ? selectedProduct.name : ''}
                    text={action.text}
                />
            </div>
        </MainLayout>
    );
};

export default ProductsPage;

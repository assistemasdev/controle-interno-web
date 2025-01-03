import React, { useState, useEffect, useCallback } from "react";
import MainLayout from "../../layouts/MainLayout";
import MyAlert from "../../components/MyAlert";
import Button from "../../components/Button";
import { usePermissions } from "../../hooks/usePermissions";
import DynamicTable from "../../components/DynamicTable";
import ProductService from "../../services/ProductService";
import { useNavigate, useLocation } from "react-router-dom";
import { faEdit, faTrash, faEye } from "@fortawesome/free-solid-svg-icons";
import ConfirmationModal from "../../components/modals/ConfirmationModal";
import { PAGINATION } from "../../constants/pagination";
import AutoCompleteFilter from "../../components/AutoCompleteFilter";
import useProductService from "../../hooks/useProductService";
import useLoader from "../../hooks/useLoader";
import useNotification from "../../hooks/useNotification";
import useStatusService from "../../hooks/useStatusService";

const ProductsPage = () => {
    const { canAccess } = usePermissions();
    const [products, setProducts] = useState([]);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);
    const [statusOptions, setStatusOptions] = useState({});
    const navigate = useNavigate();
    const location = useLocation();
    const [currentPage, setCurrentPage] = useState(PAGINATION.DEFAULT_PAGE);
    const [itemsPerPage] = useState(PAGINATION.DEFAULT_PER_PAGE);
    const [totalPages, setTotalPages] = useState(PAGINATION.DEFAULT_TOTAL_PAGES);
    const { fetchAllProducts } = useProductService(navigate);
    const { fetchAllStatus } = useStatusService(navigate);
    const { hideLoader, showLoader } = useLoader();
    const { showNotification } = useNotification();
    const [selectedProducts, setSelectedProducts] = useState([]);

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

    const fetchData = useCallback(async (id, number, filledInputs, page = 1) => {
        try {
            showLoader();
            const [statusResponse, productsResponse] = await Promise.all([
                fetchAllStatus(),
                fetchAllProducts({ number, id, filledInputs, page, perPage: itemsPerPage }),
            ]);
    
            const statusMap = mapStatus(statusResponse.data);
            setStatusOptions(statusMap);
    
            const filteredProducts = transformProducts(productsResponse.data, statusMap);
            setProducts(filteredProducts);
            setCurrentPage(productsResponse.currentPage);
            setTotalPages(productsResponse.last_page);
        } catch (error) {
            const errorMessage = error.response?.data?.error || error.message || "Erro ao carregar produtos";
            showNotification(errorMessage);
            console.error("Erro capturado no fetchData:", error);
        } finally {
            hideLoader();
        }
    }, [fetchAllStatus, fetchAllProducts, itemsPerPage, mapStatus, transformProducts, showLoader, hideLoader, showNotification]);

    useEffect(() => {
        const initializeData = async () => {
            await fetchData();
        };
    
        initializeData();
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

    const handleFilterSubmit = (e) => {
        e.preventDefault();

        const filledInputs = new Set(selectedProducts.map((option) => option.column)).size;

        fetchData(
            selectedProducts.filter((product) => !product.numberFilter).map((product) => product.value),
            selectedProducts.filter((product) => product.numberFilter).map((product) => product.value),
            filledInputs
        );
    };

    const confirmDelete = async () => {
        try {
            showLoader();
            const response = await ProductService.delete(productToDelete.id);

            if (response.status === 200) {
                showNotification('success', response.message)
                fetchData();
            }
        } catch (error) {
            const errorMessage =
                error.response?.data?.error || error.message || "Erro ao excluir o produto";
            showNotification('error', errorMessage);
            console.error("Erro ao excluir produto:", error);
        } finally {
            setDeleteModalOpen(false);
            hideLoader();
        }
    };

    const headers = ["Id", "Nome", "Número", "Status"];

    const actions = [
        {
            icon: faEdit,
            title: "Editar Produto",
            buttonClass: "btn-primary",
            permission: "Atualizar produtos",
            onClick: handleEdit,
        },
        {
            icon: faTrash,
            title: "Excluir Produto",
            buttonClass: "btn-danger",
            permission: "Excluir produtos",
            onClick: handleDelete,
        },
        {
            icon: faEye,
            title: "Ver Detalhes",
            buttonClass: "btn-info",
            permission: "Ver produtos",
            onClick: handleViewDetails,
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
                            service={ProductService}
                            columnDataBase="number"
                            value={selectedProducts}
                            onChange={(selected) => setSelectedProducts(selected)}
                            onBlurColumn="numberFilter"
                            placeholder="Filtre os produtos pelo número"
                            isMulti
                        />
                    </div>
                    <div className="form-group gap-2">
                        <Button type="submit" text="Filtrar" className="btn btn-blue-light fw-semibold m-1" />
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
                    onPageChange={(page) => fetchData(undefined, undefined, undefined, page)}
                />

                <ConfirmationModal
                    open={deleteModalOpen}
                    onClose={() => setDeleteModalOpen(false)}
                    onConfirm={confirmDelete}
                    itemName={productToDelete ? productToDelete.name : ""}
                />
            </div>
        </MainLayout>
    );
};

export default ProductsPage;

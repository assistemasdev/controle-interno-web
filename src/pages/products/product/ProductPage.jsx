import React, { useState, useEffect, useCallback } from "react";
import MainLayout from "../../../layouts/MainLayout";
import { usePermissions } from "../../../hooks/usePermissions";
import DynamicTable from "../../../components/DynamicTable";
import { useNavigate, useLocation } from "react-router-dom";
import { faEdit, faTrash, faEye, faUndo, faShippingFast } from "@fortawesome/free-solid-svg-icons";
import ConfirmationModal from "../../../components/modals/ConfirmationModal";
import { PAGINATION } from "../../../constants/pagination";
import useLoader from "../../../hooks/useLoader";
import useNotification from "../../../hooks/useNotification";
import useBaseService from "../../../hooks/services/useBaseService";
import { entities } from "../../../constants/entities";
import PageHeader from "../../../components/PageHeader";
import ListHeader from "../../../components/ListHeader";
import useAction from "../../../hooks/useAction";
import useProductFilters from "../../../hooks/filters/useProductFilters";
import FilterForm from "../../../components/FilterForm";

const ProductsPage = () => {
    const { canAccess } = usePermissions();
    const [products, setProducts] = useState([]);;
    const navigate = useNavigate();
    const location = useLocation();
    const [currentPage, setCurrentPage] = useState(PAGINATION.DEFAULT_PAGE);
    const [itemsPerPage] = useState(PAGINATION.DEFAULT_PER_PAGE);
    const [totalPages, setTotalPages] = useState(PAGINATION.DEFAULT_TOTAL_PAGES);
    const { 
        get: fetchAll, 
        get: fetchAllStatus,
        post: confirmShipment
    } = useBaseService(navigate);
    const { hideLoader, showLoader } = useLoader();
    const { showNotification } = useNotification();
    const [filters, setFilters] = useState({
        id: '',
        number: '',
        filledInputs: '',
        deleted_at: false,
        page: 1,
        perPage:itemsPerPage
    })
    const [openModalConfirmationShipment, setOpenModalConfirmationShipment] = useState(false);
    const { openModalConfirmation, handleActivate, handleDelete, handleConfirmAction, handleCancelConfirmation, selectedItem, action, setAction, setSelectedItem } = useAction(navigate);

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
            deleted_at: product.deleted_at ? 'deleted-' + product.deleted_at : 'deleted-null'
        }));
    }, []);

    const fetchData = useCallback(async (filtersSubmit) => {
        try {
            showLoader();
            const [statusResponse, productsResponse] = await Promise.all([
                fetchAllStatus(entities.status.get),
                fetchAll(entities.products.get, filtersSubmit || filters),
            ]);
            const statusMap = mapStatus(statusResponse.result.data);
            
            const filteredProducts = transformProducts(productsResponse.result.data, statusMap);
            setProducts(filteredProducts);
            setCurrentPage(productsResponse.result.current_page);
            setTotalPages(productsResponse.result.last_page);
        } catch (error) {
            console.error("Erro capturado no fetchData:", error);
        } finally {
            hideLoader();
        }
    }, [fetchAllStatus, fetchAll, itemsPerPage, mapStatus, transformProducts, showLoader, hideLoader, showNotification]);

    const { handleFilterSubmit, handleClearFilters, inputsfilters } = useProductFilters(fetchData, filters, setFilters);

    useEffect(() => {
        const initializeData = async () => {
            await fetchData();
        };
    
        initializeData();
    }, []);

    const handleOpenConfirmShipment = (item, text) => {
        setSelectedItem(item);
        setOpenModalConfirmationShipment(true);
        setAction({
            action: 'confirmShipment',
            text: text,
        })
    }

    const handleConfirmActionShipment = async () => {
        try {
            showLoader()
            const response = await confirmShipment(entities.shipments.create + '/confirm-shipment', {product_id: selectedItem.id})
            if(response) {
                fetchData();
                setOpenModalConfirmationShipment(false);
            }
        } catch (error) {
            console.log(error)
        } finally {
            hideLoader();
        }
    }

    const handleCancelConfirmationShipment = () => {
        setOpenModalConfirmationShipment(false);
    }


    const headers = ["Id", "Nome", "Número", "Status"];

    const actions = [
        {
            id:'edit',
            icon: faEdit,
            title: "Editar",
            buttonClass: "btn-primary",
            permission: "Atualizar produtos",
            onClick: (product) => navigate(`/produtos/editar/${product.id}`),
        },
        {
            id:'details',
            icon: faEye,
            title: "Ver Detalhes",
            buttonClass: "btn-info",
            permission: "Ver produtos",
            onClick: (product) => navigate(`/produtos/detalhes/${product.id}`)
        },
        {
            id: 'confirmShipment',
            icon: faShippingFast,
            title: 'Confirmar Carregamento',
            buttonClass: 'btn-success',
            permission: 'Gerenciar carregamento',
            onClick: (product) => handleOpenConfirmShipment(product, 'Você tem certeza que deseja confirmar o carregamento de: ', fetchData),
            condition: (product) => product.status == 'A CAMINHO'
        },
        {
            id: 'delete',
            icon: faTrash,
            title: 'Excluir',
            buttonClass: 'btn-danger',
            permission: 'Excluir produtos',
            onClick: (product) => handleDelete(product, 'Você tem certeza que deseja excluir: ', entities.products.delete(product.id), fetchData)
        },
        {
            id: 'activate',
            icon: faUndo,
            title: 'Ativar',
            buttonClass: 'btn-info',
            permission: 'Atualizar produtos',
            onClick: (product) => handleActivate(product, 'Você tem certeza que deseja ativar: ', fetchData)
        },
    ];

    return (
        <MainLayout selectedCompany="ALUCOM">
            <PageHeader title="Produtos" showBackButton={true} backUrl="/dashboard" /> 
            <div className="container-fluid p-1">
                <FilterForm autoCompleteFields={inputsfilters} onSubmit={handleFilterSubmit} onClear={handleClearFilters} />

                <ListHeader 
                    title="Lista de Produtos" 
                    buttonText="Novo Produto" 
                    buttonLink="/produtos/criar" 
                    canAccess={canAccess} 
                    permission="Criar Produtos"
                />

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
                    onConfirm={handleConfirmAction}
                    itemName={selectedItem ? selectedItem.name : ''}
                    text={action.text}
                />

                <ConfirmationModal
                    open={openModalConfirmationShipment}
                    onClose={handleCancelConfirmationShipment}
                    onConfirm={handleConfirmActionShipment}
                    itemName={selectedItem ? selectedItem.name : ''}
                    text={action.text}
                />
            </div>
        </MainLayout>
    );
};

export default ProductsPage;

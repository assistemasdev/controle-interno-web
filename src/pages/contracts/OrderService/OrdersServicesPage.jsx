import React, { useState, useEffect, useCallback, useMemo } from "react";
import MainLayout from "../../../layouts/MainLayout";
import DynamicTable from "../../../components/DynamicTable";
import { useNavigate, useLocation } from "react-router-dom";
import { faEdit, faTrash, faUndo, faEye } from '@fortawesome/free-solid-svg-icons';
import ConfirmationModal from "../../../components/modals/ConfirmationModal";
import { PAGINATION } from "../../../constants/pagination";
import useLoader from "../../../hooks/useLoader";
import useBaseService from "../../../hooks/services/useBaseService";
import { entities } from "../../../constants/entities";
import PageHeader from "../../../components/PageHeader";
import useOrderServiceGlobalFilters from "../../../hooks/filters/useOrderServiceGlobalFilters";
import FilterForm from "../../../components/FilterForm";
import useAction from "../../../hooks/useAction";

const OrdersServicesPage = () => {
    const navigate = useNavigate();
    const { get: fetchAll, del: remove } = useBaseService(navigate);
    const { showLoader, hideLoader } = useLoader();
    const [OrdersServices, setOrdersServices] = useState([]);
    const location = useLocation();
    const [currentPage, setCurrentPage] = useState(PAGINATION.DEFAULT_PAGE);
    const [itemsPerPage, setItemsPerPage] = useState(PAGINATION.DEFAULT_PER_PAGE);
    const [totalPages, setTotalPages] = useState(PAGINATION.DEFAULT_TOTAL_PAGES);
    const [selectedOrderService, setSelectedOrderService] = useState(null);  
    const [filters, setFilters] = useState({
        id: '',
        name: '',
        id: '',
        filledInputs: '',
        deleted_at: false,
        page: 1,
        perPage:itemsPerPage
    })

    const { openModalConfirmation, handleActivate, handleDelete, handleConfirmAction, handleCancelConfirmation, selectedItem, action } = useAction(navigate);

    useEffect(() => {
        if (location.state?.message) {
            const { type, text } = location.state.message;
            setTimeout(() => navigate(location.pathname, { replace: true }), 0); 
        }
    }, [location.state, navigate]);

    const loadOrdersServices = useCallback(async (filtersSubmit) => {
        showLoader();
        try {
            const response = await fetchAll(entities.orders.get ,filtersSubmit || filters);
            setOrdersServices(response.result.data.map((orderService) => ({
                id: orderService.id,
                contract: orderService.contract_id,
                deadline: new Date(orderService.deadline).toLocaleDateString('pt-BR'),
                deleted_at: orderService.deleted_at ? 'deleted-' + orderService.deleted_at : 'deleted-null'
            })));
            setTotalPages(response.result.last_page);
            setCurrentPage(response.result.current_page);
        } finally {
            hideLoader();
        }
    }, [fetchAll, itemsPerPage, showLoader, hideLoader]);

    const { handleFilterSubmit, handleClearFilters, inputsfilters } = useOrderServiceGlobalFilters(loadOrdersServices, filters, setFilters);

    useEffect(() => {
        loadOrdersServices();
    }, [itemsPerPage]);



    const headers = useMemo(() => ['Id', 'Contrato', 'Prazo Final'], []);

    const actions = useMemo(() => [
        {
            id:'details',
            icon: faEye,
            title: "Ver Detalhes",
            buttonClass: "btn-info",
            permission: "Ver ordens de serviço",
            onClick: (orderService) => navigate(`/ordens-servicos/${orderService.id}/detalhes`),
        },
        {
            id:'edit',
            icon: faEdit,
            title: 'Editar',
            buttonClass: 'btn-primary',
            permission: 'Atualizar ordens de serviço',
            onClick: (orderService) => navigate(`/contratos/${orderService.contract}/ordens-servicos/editar/${orderService.id}`)        },
        {
            id: 'delete',
            icon: faTrash,
            title: 'Excluir',
            buttonClass: 'btn-danger',
            permission: 'Excluir ordens de serviço',
            onClick: (orderService) => handleDelete(orderService, 'Você tem certeza que deseja excluir: ', entities.orders.delete(orderService.id), loadOrdersServices)
        },
        {
            id: 'activate',
            icon: faUndo,
            title: 'Ativar',
            buttonClass: 'btn-info',
            permission: 'Atualizar ordens de serviço',
            onClick: (orderService) => handleActivate(orderService, 'Você tem certeza que deseja ativar: ', loadOrdersServices)
        },
    ], [handleActivate, handleDelete]);

    return (
        <MainLayout selectedCompany="ALUCOM">
            <PageHeader title="Ordens de Serviço" showBackButton={true} backUrl="/dashboard"/>
            <div className="container-fluid p-1">
                <FilterForm autoCompleteFields={inputsfilters} onSubmit={handleFilterSubmit} onClear={handleClearFilters} />

                <DynamicTable
                    headers={headers}
                    data={OrdersServices}
                    actions={actions}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={loadOrdersServices}
                    filters={filters}
                    setFilters={setFilters}
                />

                <ConfirmationModal
                    open={openModalConfirmation}
                    onClose={handleCancelConfirmation}
                    onConfirm={handleConfirmAction}
                    itemName={selectedItem ? `${selectedItem.id} - Contrato: ${selectedItem.contract}` : ''}
                    text={action.text}
                />
            </div>
        </MainLayout>
    );
};

export default OrdersServicesPage
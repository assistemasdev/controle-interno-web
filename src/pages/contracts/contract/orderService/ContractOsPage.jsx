import React, { useState, useEffect, useCallback, useMemo } from "react";
import MainLayout from "../../../../layouts/MainLayout";
import { usePermissions } from "../../../../hooks/usePermissions";
import DynamicTable from "../../../../components/DynamicTable";
import { useNavigate, useLocation } from "react-router-dom";
import { faEdit, faTrash, faUndo, faEye } from '@fortawesome/free-solid-svg-icons';
import ConfirmationModal from "../../../../components/modals/ConfirmationModal";
import { PAGINATION } from "../../../../constants/pagination";
import useLoader from "../../../../hooks/useLoader";
import useBaseService from "../../../../hooks/services/useBaseService";
import { entities } from "../../../../constants/entities";
import { useParams } from "react-router-dom";
import PageHeader from "../../../../components/PageHeader";
import ListHeader from '../../../../components/ListHeader';
import useAction from "../../../../hooks/useAction";
import useOrderServiceFilters from "../../../../hooks/filters/useOrderServiceFilters";
import FilterForm from "../../../../components/FilterForm";

const ContractOsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { canAccess } = usePermissions();
    const { 
        get: fetchAll, 
        get: fetchContracts,
        get: fetchOsStatus,
    } = useBaseService(navigate);
    const { showLoader, hideLoader } = useLoader();
    const [OsStatuses, setOrdersServices] = useState([]);
    const location = useLocation();
    const [currentPage, setCurrentPage] = useState(PAGINATION.DEFAULT_PAGE);
    const [itemsPerPage, setItemsPerPage] = useState(PAGINATION.DEFAULT_PER_PAGE);
    const [totalPages, setTotalPages] = useState(PAGINATION.DEFAULT_TOTAL_PAGES);
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

    const mapContracts = useCallback((contractsData) => {
        return Object.fromEntries(contractsData.map((contract) => [contract.id, contract.number]));
    }, []);

    const mapStatus = useCallback((statusData) => {
        return Object.fromEntries(statusData.map((status) => [status.id, status.name]));
    }, []);

    const transformOrdersServices = useCallback((ordersServices, contractsMap, statusMap) => {
        return ordersServices.map((orderService) => ({
            id: orderService.id,
            number: contractsMap[orderService.contract_id] || "N/A",
            status: statusMap[orderService.status_id] || "N/A",
            deleted_at: orderService.deleted_at ? 'deleted-' + orderService.deleted_at : 'deleted-null'
        }));
    }, []);

    const loadOrdersServices = useCallback(async (filtersSubmit) => {
        showLoader();
        try {
            const response = await fetchAll(entities.contracts.orders.get(id) ,filtersSubmit || filters);
            const responseContracts = await fetchContracts(entities.contracts.get);
            const responseOsStatus = await fetchOsStatus(entities.orders.status.get());
            const contractsMap = mapContracts(responseContracts.result.data);
            const osStatusMap = mapStatus(responseOsStatus.result.data)
            const filteredOrdersServices = transformOrdersServices(response.result.data, contractsMap, osStatusMap)
            setOrdersServices(filteredOrdersServices);
            setTotalPages(response.result.last_page);
            setCurrentPage(response.result.current_page);
        } finally {
            hideLoader();
        }
    }, [fetchAll, itemsPerPage, showLoader, hideLoader]);

    const { handleFilterSubmit, handleClearFilters, inputsfilters } = useOrderServiceFilters(loadOrdersServices, filters, setFilters);

    useEffect(() => {
        loadOrdersServices();
    }, [itemsPerPage]);

    const headers = useMemo(() => ['id', 'Nº Contrato', 'Status'], []);

    const actions = useMemo(() => [
        {
            id:'details',
            icon: faEye,
            title: "Ver Detalhes",
            buttonClass: "btn-info",
            permission: "Ver ordens de serviço",
            onClick: (os) => navigate(`/contratos/${id}/ordens-servicos/detalhes/${os.id}`),
        },
        {
            id:'edit',
            icon: faEdit,
            title: 'Editar',
            buttonClass: 'btn-primary',
            permission: 'Atualizar ordens de serviço',
            onClick: (os) => navigate(`/contratos/${id}/ordens-servicos/editar/${os.id}`),
        },
        {
            id: 'delete',
            icon: faTrash,
            title: 'Excluir',
            buttonClass: 'btn-danger',
            permission: 'Excluir ordens de serviço',
            onClick: (os) => handleDelete(os, 'Você tem certeza que deseja excluir: ', entities.contracts.orders.delete(id,os.id), loadOrdersServices),
        },
        {
            id: 'activate',
            icon: faUndo,
            title: 'Ativar',
            buttonClass: 'btn-info',
            permission: 'Atualizar ordens de serviço',
            onClick: (os) => handleActivate(os, 'Você tem certeza que deseja ativar: ', loadOrdersServices)
        },
    ], [handleActivate, handleDelete]);

    return (
        <MainLayout selectedCompany="ALUCOM">
            <PageHeader title="Ordens de Serviços do Contrato" showBackButton={true} backUrl="/contratos" />
            <div className="container-fluid p-1">
                <FilterForm autoCompleteFields={inputsfilters} onSubmit={handleFilterSubmit} onClear={handleClearFilters} />

                <ListHeader 
                    title="Lista de Ordens de Serviços do Contrato" 
                    buttonText="Nova Ordem de Serviço" 
                    buttonLink={`/contratos/${id}/ordens-servicos/criar`}
                    canAccess={canAccess} 
                    permission="Criar ordens de serviço"
                />

                <DynamicTable
                    headers={headers}
                    data={OsStatuses}
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
                    itemName={selectedItem ? selectedItem.number : ''}
                    text={action.text}
                />  
            </div>
        </MainLayout>
    );
};

export default ContractOsPage
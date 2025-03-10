import React, { useState, useEffect, useCallback, useMemo } from "react";
import MainLayout from "../../../layouts/MainLayout";
import Button from "../../../components/Button";
import { usePermissions } from "../../../hooks/usePermissions";
import DynamicTable from "../../../components/DynamicTable";
import { useNavigate, useLocation } from "react-router-dom";
import { faEdit, faTrash,faClipboard, faEye, faUndo, faCalendarPlus, faHistory } from '@fortawesome/free-solid-svg-icons';
import ConfirmationModal from "../../../components/modals/ConfirmationModal";
import { PAGINATION } from "../../../constants/pagination";
import useLoader from "../../../hooks/useLoader";
import useBaseService from "../../../hooks/services/useBaseService";
import { entities } from "../../../constants/entities";
import useContractsFilters from "../../../hooks/filters/useContractsFilters";
import FilterForm from '../../../components/FilterForm';
import PageHeader from "../../../components/PageHeader";
import ListHeader from "../../../components/ListHeader";
import useAction from "../../../hooks/useAction";

const ContractPage = () => {
    const navigate = useNavigate();
    const { canAccess } = usePermissions();
    const { get: fetchAll, del: remove, get: fetchAllCustomers } = useBaseService(navigate);
    const { showLoader, hideLoader } = useLoader();
    const [contracts, setContracts] = useState([]);
    const location = useLocation();
    const [currentPage, setCurrentPage] = useState(PAGINATION.DEFAULT_PAGE);
    const [itemsPerPage, setItemsPerPage] = useState(PAGINATION.DEFAULT_PER_PAGE);
    const [totalPages, setTotalPages] = useState(PAGINATION.DEFAULT_TOTAL_PAGES);
    const [selectedContract, setSelectedContract] = useState(null);  
    const [filters, setFilters] = useState({
        id: '',
        number: '',
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

    const mapCustomers = useCallback((customers) => {
        return Object.fromEntries(customers.map((customer) => [customer.id, customer.name]));
    }, []);

    const transformContracts = useCallback((contractsData, customersMap) => {
        return contractsData.map((contract) => ({
            id: contract.id,
            name: contract.name,
            number: contract.number,
            customer: customersMap[contract.customer_id] || "N/A",
            deleted_at: contract.deleted_at ? 'deleted-' + contract.deleted_at : 'deleted-null'

        }));
    }, []);

    const loadContracts = useCallback(async (filtersSubmit) => {
        showLoader();
        try {
            const response = await fetchAll(entities.contracts.get, filtersSubmit || filters);
            const customersReponse = await fetchAllCustomers(entities.customers.get);

            const customersMap = mapCustomers(customersReponse.result.data);
            const filteredContracts = transformContracts(response.result.data, customersMap)
            setContracts(filteredContracts);
            setTotalPages(response.result.last_page);
            setCurrentPage(response.result.current_page);
        } finally {
            hideLoader();
        }
    }, [fetchAll, itemsPerPage, showLoader, hideLoader]);

    const { handleFilterSubmit, handleClearFilters, inputsfilters } = useContractsFilters(loadContracts, filters, setFilters);

    useEffect(() => {
        loadContracts();
    }, [itemsPerPage]);

    const headers = useMemo(() => ['Id', 'Nome', 'Número', 'Cliente'], []);

    const actions = useMemo(() => [
        {
            id:'details',
            icon: faEye,
            title: "Ver Detalhes",
            buttonClass: "btn-info",
            permission: "Ver contratos",
            onClick: (contract) => navigate(`/contratos/detalhes/${contract.id}`),
        },
        {
            id: 'add-event',
            icon: faCalendarPlus,
            title: 'Adicionar Evento',
            buttonClass: 'btn-success',
            permission: 'Adicionar eventos',
            onClick: (contract) => navigate(`/contratos/${contract.id}/eventos/adicionar`),
        },
        {
            id: 'history',
            icon: faHistory, 
            title: 'Ver Histórico',
            buttonClass: 'btn-warning',
            permission: 'Ver histórico',
            onClick: (contract) => navigate(`/contratos/${contract.id}/eventos/historico/`), 
        },
        {
            id: 'os',
            icon: faClipboard,  
            title: 'Ordens de Serviços',
            buttonClass: 'btn-secondary',  
            permission: 'Listar ordens de serviço',  
            onClick: (contract) => navigate(`/contratos/${contract.id}/ordens-servicos/`),  
        },
        {
            id:'edit',
            icon: faEdit,
            title: 'Editar',
            buttonClass: 'btn-primary',
            permission: 'Atualizar contratos',
            onClick: (contract) => navigate(`/contratos/editar/${contract.id}`)
        },
        {
            id: 'delete',
            icon: faTrash,
            title: 'Excluir',
            buttonClass: 'btn-danger',
            permission: 'Excluir contratos',
            onClick: (contract) => handleDelete(contract, 'Você tem certeza que deseja excluir: ', entities.contracts.delete(contract.id), loadContracts)
        },
        {
            id: 'activate',
            icon: faUndo,
            title: 'Ativar',
            buttonClass: 'btn-info',
            permission: 'Atualizar contratos',
            onClick: (contract) => handleActivate(contract, 'Você tem certeza que deseja ativar: ', loadContracts)
        },
    ], [handleDelete, handleActivate]);

    return (
        <MainLayout selectedCompany="ALUCOM">
            <PageHeader title="Contratos" showBackButton={true} backUrl="/dashboard" />
            <div className="container-fluid p-1">
                <FilterForm autoCompleteFields={inputsfilters} onSubmit={handleFilterSubmit} onClear={handleClearFilters} />

                <ListHeader 
                    title="Lista de Contratos" 
                    buttonText="Novo Contrato" 
                    buttonLink="/contratos/criar" 
                    canAccess={canAccess} 
                    permission="Criar contratos"
                />

                <DynamicTable
                    headers={headers}
                    data={contracts}
                    actions={actions}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={loadContracts}
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

export default ContractPage
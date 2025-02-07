import React, { useState, useEffect, useCallback, useMemo } from "react";
import MainLayout from "../../../layouts/MainLayout";
import { usePermissions } from "../../../hooks/usePermissions";
import DynamicTable from "../../../components/DynamicTable";
import { useNavigate, useLocation } from "react-router-dom";
import { faEdit, faTrash, faUndo } from '@fortawesome/free-solid-svg-icons';
import ConfirmationModal from "../../../components/modals/ConfirmationModal";
import { PAGINATION } from "../../../constants/pagination";
import useLoader from "../../../hooks/useLoader";
import useBaseService from "../../../hooks/services/useBaseService";
import { entities } from "../../../constants/entities";
import PageHeader from "../../../components/PageHeader";
import ListHeader from "../../../components/ListHeader";
import useStatusOsFilters from "../../../hooks/filters/useStatusOsFilters";
import FilterForm from "../../../components/FilterForm";
import useAction from "../../../hooks/useAction";

const OsStatusPage = () => {
    const navigate = useNavigate();
    const { canAccess } = usePermissions();
    const { get: fetchAll } = useBaseService(navigate);
    const { showLoader, hideLoader } = useLoader();
    const [OsStatuses, setOsStatuses] = useState([]);
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

    const loadOsStatuses = useCallback(async (filtersSubmit) => {
        showLoader();
        try {
            const response = await fetchAll(entities.orders.status.get() ,filtersSubmit || filters);
            setOsStatuses(response.result.data.map((departament) => ({
                id: departament.id,
                name: departament.name,
                deleted_at: departament.deleted_at ? 'deleted-' + departament.deleted_at : 'deleted-null'
            })));
            setTotalPages(response.result.last_page);
            setCurrentPage(response.result.current_page);
        } finally {
            hideLoader();
        }
    }, [fetchAll, itemsPerPage, showLoader, hideLoader]);

    const { handleFilterSubmit, handleClearFilters, inputsfilters } = useStatusOsFilters(loadOsStatuses, filters, setFilters);

    useEffect(() => {
        loadOsStatuses();
    }, [itemsPerPage]);

    const headers = useMemo(() => ['id', 'Nome'], []);

    const actions = useMemo(() => [
        {
            id:'edit',
            icon: faEdit,
            title: 'Editar',
            buttonClass: 'btn-primary',
            permission: 'Atualizar status de ordens de serviço',
            onClick: (status) => navigate(`/contratos/ordem-servico/status/editar/${status.id}`)
        },
        {
            id: 'delete',
            icon: faTrash,
            title: 'Excluir',
            buttonClass: 'btn-danger',
            permission: 'Excluir status de ordens de serviço',
            onClick: (status) => handleDelete(status, 'Você tem certeza que deseja excluir: ', entities.orders.status.delete(null, status.id), loadOsStatuses)
        },
        {
            id: 'activate',
            icon: faUndo,
            title: 'Ativar',
            buttonClass: 'btn-info',
            permission: 'Atualizar status de ordens de serviço',
            onClick: (status) => handleActivate(status, 'Você tem certeza que deseja ativar: ', loadOsStatuses)
        },
    ], [handleActivate, handleDelete]);

    return (
        <MainLayout selectedCompany="ALUCOM">
            <PageHeader title="Status de Ordem de Serviço" showBackButton={true} backUrl="/dashboard" />
            <div className="container-fluid p-1">
                <FilterForm autoCompleteFields={inputsfilters} onSubmit={handleFilterSubmit} onClear={handleClearFilters} />

                <ListHeader 
                    title="Lista de Status de Ordem de Serviço" 
                    buttonText="Novo Status" 
                    buttonLink='/contratos/ordem-servico/status/criar'
                    canAccess={canAccess} 
                    permission="Criar status de ordens de serviço"
                />

                <DynamicTable
                    headers={headers}
                    data={OsStatuses}
                    actions={actions}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={loadOsStatuses}
                    filters={filters}
                    setFilters={setFilters}
                />

                <ConfirmationModal
                    open={openModalConfirmation}
                    onClose={handleCancelConfirmation}
                    onConfirm={handleConfirmAction}
                    itemName={selectedItem ? selectedItem.name : ''}
                    text={action.text}
                />
            </div>
        </MainLayout>
    );
};

export default OsStatusPage
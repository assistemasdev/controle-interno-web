import React, { useState, useEffect, useCallback, useMemo } from "react";
import MainLayout from "../../../layouts/MainLayout";
import Button from "../../../components/Button";
import { usePermissions } from "../../../hooks/usePermissions";
import DynamicTable from "../../../components/DynamicTable";
import { useNavigate, useLocation } from "react-router-dom";
import { faEdit, faTrash, faUndo } from '@fortawesome/free-solid-svg-icons';
import ConfirmationModal from "../../../components/modals/ConfirmationModal";
import { PAGINATION } from "../../../constants/pagination";
import useLoader from "../../../hooks/useLoader";
import AutoCompleteFilter from "../../../components/AutoCompleteFilter";
import baseService from "../../../services/baseService";
import useBaseService from "../../../hooks/services/useBaseService";
import { entities } from "../../../constants/entities";
import PageHeader from "../../../components/PageHeader";
import ListHeader from "../../../components/ListHeader";
import useAction from "../../../hooks/useAction";
import useDestinationOsFilters from "../../../hooks/filters/useDestinationOsFilters";
import FilterForm from "../../../components/FilterForm";

const OsDestinationsPage = () => {
    const navigate = useNavigate();
    const { canAccess } = usePermissions();
    const { get: fetchAll } = useBaseService(navigate);
    const { showLoader, hideLoader } = useLoader();
    const [selectedOsDestinations, setSelectedOsDestinations] = useState([]);
    const [OsDestinations, setOsDestinations] = useState([]);
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

    const loadOsDestinations = useCallback(async (filtersSubmit) => {
        showLoader();
        try {
            const response = await fetchAll(entities.orders.destinations.get() ,filtersSubmit || filters);
            setOsDestinations(response.result.data.map((departament) => ({
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

    const { handleFilterSubmit, handleClearFilters, inputsfilters } = useDestinationOsFilters(loadOsDestinations, filters, setFilters);

    useEffect(() => {
        loadOsDestinations();
    }, [itemsPerPage]);

    const handleEdit = useCallback((destination) => {
        navigate(`/contratos/ordem-servico/destinos/editar/${destination.id}`);
    }, [navigate]);

    const handleChangeCustomers = useCallback((newSelected, column) => {
        setSelectedOsDestinations((prev) => {
            if (!newSelected.length) {
                return prev.filter((option) => option.column !== column);
            }

            const newSelectedArray = Array.isArray(newSelected) ? newSelected : [newSelected];

            const filtered = prev.filter((option) => option.column !== column);
            return [...filtered, ...newSelectedArray];
        });
    }, []);

    const headers = useMemo(() => ['id', 'Nome'], []);

    const actions = useMemo(() => [
        {
            id:'edit',
            icon: faEdit,
            title: 'Editar',
            buttonClass: 'btn-primary',
            permission: 'Atualizar destinos de ordens de serviço',
            onClick: handleEdit
        },
        {
            id: 'delete',
            icon: faTrash,
            title: 'Excluir',
            buttonClass: 'btn-danger',
            permission: 'Excluir destinos de ordens de serviço',
            onClick: (destination) => handleDelete(destination, 'Você tem certeza que deseja excluir: ', entities.orders.destinations.delete(null, destination.id), loadOsDestinations)
        },
        {
            id: 'activate',
            icon: faUndo,
            title: 'Ativar',
            buttonClass: 'btn-info',
            permission: 'Atualizar destinos de ordens de serviço',
            onClick: (destination) => handleActivate(destination, 'Você tem certeza que deseja ativar: ', loadOsDestinations)
        },
    ], [handleEdit, handleDelete]);

    return (
        <MainLayout selectedCompany="ALUCOM">
            <PageHeader title="Destino de Ordem de Serviço" showBackButton={true} backUrl="/dashboard"/>
            <div className="container-fluid p-1">
                <FilterForm autoCompleteFields={inputsfilters} onSubmit={handleFilterSubmit} onClear={handleClearFilters} />

                <ListHeader 
                    title="Lista de Destino de Ordem de Serviço" 
                    buttonText="Novo Destino" 
                    buttonLink='/contratos/ordem-servico/destinos/criar'
                    canAccess={canAccess} 
                    permission="Criar destinos de ordens de serviço"
                />

                <DynamicTable
                    headers={headers}
                    data={OsDestinations}
                    actions={actions}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={loadOsDestinations}
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

export default OsDestinationsPage
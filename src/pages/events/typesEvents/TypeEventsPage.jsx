import React, { useState, useEffect, useCallback, useMemo } from "react";
import MainLayout from "../../../layouts/MainLayout";
import Button from "../../../components/Button";
import { usePermissions } from "../../../hooks/usePermissions";
import DynamicTable from "../../../components/DynamicTable";
import { useNavigate, useLocation } from "react-router-dom";
import { faEdit, faTrash, faEye, faUndo } from '@fortawesome/free-solid-svg-icons';
import ConfirmationModal from "../../../components/modals/ConfirmationModal";
import { PAGINATION } from "../../../constants/pagination";
import useLoader from "../../../hooks/useLoader";
import AutoCompleteFilter from "../../../components/AutoCompleteFilter";
import baseService from "../../../services/baseService";
import useBaseService from "../../../hooks/services/useBaseService";
import { entities } from "../../../constants/entities";
import { buildFilteredArray } from "../../../utils/arrayUtils";
import PageHeader from "../../../components/PageHeader";
import ListHeader from "../../../components/ListHeader";
import useAction from "../../../hooks/useAction";
import useTypeEventFilters from "../../../hooks/filters/useTypeEventFilters";
import FilterForm from "../../../components/FilterForm";

const TypeEventsPage = () => {
    const navigate = useNavigate();
    const { canAccess } = usePermissions();
    const { get: fetchAll, del: remove } = useBaseService(navigate);
    const { showLoader, hideLoader } = useLoader();
    const [selectedTypes, setSelectedTypes] = useState([]);
    const [types, setTypes] = useState([]);
    const location = useLocation();
    const [currentPage, setCurrentPage] = useState(PAGINATION.DEFAULT_PAGE);
    const [itemsPerPage, setItemsPerPage] = useState(PAGINATION.DEFAULT_PER_PAGE);
    const [totalPages, setTotalPages] = useState(PAGINATION.DEFAULT_TOTAL_PAGES);
    const [selectedType, setSelectedType] = useState(null);  
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

    const loadTypes = useCallback(async (filtersSubmit) => {
        showLoader();
        try {
            const response = await fetchAll(entities.contracts.eventsTypes.get(), filtersSubmit || filters);

            setTypes(response.result.data.map((type) => ({
                id: type.id,
                name: type.name,
                deleted_at: type.deleted_at ? 'deleted-' + type.deleted_at : 'deleted-null'
            })));
            setTotalPages(response.result.last_page);
            setCurrentPage(response.result.current_page);
        } finally {
            hideLoader();
        }
    }, [fetchAll, itemsPerPage, showLoader, hideLoader]);

    const { handleFilterSubmit, handleClearFilters, inputsfilters } = useTypeEventFilters(loadTypes, filters, setFilters);

    useEffect(() => {
        loadTypes();
    }, [itemsPerPage]);

    const headers = useMemo(() => ['id', 'Nome'], []);

    const actions = useMemo(() => [
        {
            id:'edit',
            icon: faEdit,
            title: 'Editar',
            buttonClass: 'btn-primary',
            permission: 'Atualizar tipos de eventos de contratos',
            onClick: (type) => navigate(`/contratos/tipos-eventos/editar/${type.id}`)
        },
        {
            id:'details',
            icon: faEye,
            title: "Ver Detalhes",
            buttonClass: "btn-info",
            permission: "Ver tipos de eventos de contratos",
            onClick: (type) => navigate(`/contratos/tipos-eventos/detalhes/${type.id}`),
        },
        {
            id: 'delete',
            icon: faTrash,
            title: 'Excluir',
            buttonClass: 'btn-danger',
            permission: 'Excluir tipos de eventos de contratos',
            onClick: (typeEvent) => handleDelete(typeEvent, 'Você tem certeza que deseja excluir: ', entities.contracts.eventsTypes.delete(null, typeEvent.id), loadTypes)
        },
        {
            id: 'activate',
            icon: faUndo,
            title: 'Ativar',
            buttonClass: 'btn-info',
            permission: 'Atualizar tipos de eventos de contratos',
            onClick: (typEvent) => handleActivate(typEvent, 'Você tem certeza que deseja ativar: ', loadTypes)
        },
    ], [handleActivate, handleDelete]);

    return (
        <MainLayout selectedCompany="ALUCOM">
            <PageHeader title="Tipos de Eventos de Contrato" showBackButton={true} backUrl="/dashboard"/>
            <div className="container-fluid p-1">
                <FilterForm autoCompleteFields={inputsfilters} onSubmit={handleFilterSubmit} onClear={handleClearFilters} />

                <ListHeader 
                    title="Lista de Tipos de Eventos" 
                    buttonText="Novo Tipo" 
                    buttonLink='/contratos/tipos-eventos/criar'
                    canAccess={canAccess} 
                    permission="Criar tipos de eventos de contratos"
                />
                
                <DynamicTable
                    headers={headers}
                    data={types}
                    actions={actions}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={loadTypes}
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

export default TypeEventsPage
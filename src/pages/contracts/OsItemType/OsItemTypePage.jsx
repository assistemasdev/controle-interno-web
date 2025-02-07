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
import useAction from "../../../hooks/useAction";
import useTypeOsFilters from "../../../hooks/filters/useTypeOsFilters";
import FilterForm from "../../../components/FilterForm";

const OsItemTypePage = () => {
    const navigate = useNavigate();
    const { canAccess } = usePermissions();
    const { get: fetchAllOsItemsType } = useBaseService(navigate);
    const { showLoader, hideLoader } = useLoader();
    const [OsItemsTypes, setOsItemsTypes] = useState([]);
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

    const loadOsItemsTypes = useCallback(async (filtersSubmit) => {
        showLoader();
        try {
            const response = await fetchAllOsItemsType(entities.orders.itemsTypes.get() ,filtersSubmit || filters);
            setOsItemsTypes(response.result.data.map((type) => ({
                id: type.id,
                name: type.name,
                deleted_at: type.deleted_at ? 'deleted-' + type.deleted_at : 'deleted-null'
            })));
            setTotalPages(response.result.last_page);
            setCurrentPage(response.result.current_page);
        } finally {
            hideLoader();
        }
    }, [fetchAllOsItemsType, itemsPerPage, showLoader, hideLoader]);

    const { handleFilterSubmit, handleClearFilters, inputsfilters } = useTypeOsFilters(loadOsItemsTypes, filters, setFilters);

    useEffect(() => {
        loadOsItemsTypes();
    }, [itemsPerPage]);

    const headers = useMemo(() => ['id', 'Nome'], []);

    const actions = useMemo(() => [
        {
            id:'edit',
            icon: faEdit,
            title: 'Editar',
            buttonClass: 'btn-primary',
            permission: 'Atualizar tipos de contratos',
            onClick: (osItemType) => navigate(`/contratos/ordem-servico/tipos-itens/editar/${osItemType.id}`)
        },
        {
            id: 'delete',
            icon: faTrash,
            title: 'Excluir',
            buttonClass: 'btn-danger',
            permission: 'Atualizar tipos de contratos',
            onClick: (osItemType) => handleDelete(osItemType, 'Você tem certeza que deseja excluir: ', entities.orders.itemsTypes.delete(null, osItemType.id), loadOsItemsTypes)
        },
        {
            id: 'activate',
            icon: faUndo,
            title: 'Ativar',
            buttonClass: 'btn-info',
            permission: 'Excluir tipos de contratos',
            onClick: (osItemType) => handleActivate(osItemType, 'Você tem certeza que deseja ativar: ', loadOsItemsTypes)
        },
    ], [handleActivate, handleDelete]);

    return (
        <MainLayout selectedCompany="ALUCOM">
            <PageHeader title="Tipos de Item de Ordem de Serviço" showBackButton={true} backUrl="/dashboard"/>
            <div className="container-fluid p-1">
                <FilterForm autoCompleteFields={inputsfilters} onSubmit={handleFilterSubmit} onClear={handleClearFilters} />

                <ListHeader 
                    title="Lista de Tipos de Item de Ordem de Serviço" 
                    buttonText="Novo Tipo" 
                    buttonLink='/contratos/ordem-servico/tipos-itens/criar'
                    canAccess={canAccess} 
                    permission="Criar tipos de itens de ordem de serviço"
                />

                <DynamicTable
                    headers={headers}
                    data={OsItemsTypes}
                    actions={actions}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={loadOsItemsTypes}
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

export default OsItemTypePage
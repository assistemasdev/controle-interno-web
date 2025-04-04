import React, { useState, useEffect, useCallback, useMemo } from "react";
import MainLayout from "../../../layouts/MainLayout";
import { usePermissions } from "../../../hooks/usePermissions";
import DynamicTable from "../../../components/DynamicTable";
import { useNavigate, useLocation } from "react-router-dom";
import { faEdit, faTrash, faCubes , faUndo } from '@fortawesome/free-solid-svg-icons';
import ConfirmationModal from "../../../components/modals/ConfirmationModal";
import { PAGINATION } from "../../../constants/pagination";
import useLoader from "../../../hooks/useLoader";
import useBaseService from "../../../hooks/services/useBaseService";
import { entities } from "../../../constants/entities";
import PageHeader from "../../../components/PageHeader";
import ListHeader from "../../../components/ListHeader";
import useEquipamentKitsFilters from "../../../hooks/filters/useEquipamentKitsFilters";
import FilterForm from "../../../components/FilterForm";
import useAction from "../../../hooks/useAction";

const KitPage = () => {
    const navigate = useNavigate();
    const { canAccess } = usePermissions();
    const { get: fetchAll, del: remove } = useBaseService(navigate);
    const { showLoader, hideLoader } = useLoader();
    const [types, setTypes] = useState([]);
    const location = useLocation();
    const [currentPage, setCurrentPage] = useState(PAGINATION.DEFAULT_PAGE);
    const [itemsPerPage, setItemsPerPage] = useState(PAGINATION.DEFAULT_PER_PAGE);
    const [totalPages, setTotalPages] = useState(PAGINATION.DEFAULT_TOTAL_PAGES);
    const { openModalConfirmation, handleActivate, handleDelete, handleConfirmAction, handleCancelConfirmation, selectedItem, action } = useAction(navigate);
    const [filters, setFilters] = useState({
        id: '',
        name: '',
        id: '',
        filledInputs: '',
        deleted_at: false,
        page: 1,
        perPage:itemsPerPage
    })

    useEffect(() => {
        if (location.state?.message) {
            const { type, text } = location.state.message;
            setTimeout(() => navigate(location.pathname, { replace: true }), 0); 
        }
    }, [location.state, navigate]);

    const loadKits = useCallback(async (filtersSubmit) => {
        showLoader();
        try {
            const response = await fetchAll(entities.equipamentsKits.get, filtersSubmit || filters);
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

    const { handleFilterSubmit, handleClearFilters, inputsfilters } = useEquipamentKitsFilters(loadKits, filters, setFilters);

    useEffect(() => {
        loadKits();
    }, [itemsPerPage]);

    const headers = useMemo(() => ['id', 'Nome'], []);

    const actions = useMemo(() => [
        {
            id:'edit',
            icon: faEdit,
            title: 'Editar',
            buttonClass: 'btn-primary',
            permission: 'Atualizar kits',
            onClick: (kit) => navigate(`/kits/editar/${kit.id}`)
        },
        {
            id: 'viewGroups',
            icon: faCubes ,
            title: 'Ver itens do kit',
            buttonClass: 'btn-info',
            permission: 'Visualizar kits',
            onClick: (kit) => navigate(`/kits/${kit.id}/itens`)
        },
        {
            id: 'delete',
            icon: faTrash,
            title: 'Excluir',
            buttonClass: 'btn-danger',
            permission: 'Excluir kits',
            onClick: (kit) => handleDelete(kit, 'Você tem certeza que deseja excluir: ', entities.equipamentsKits.delete(kit.id), loadKits)

        },
        {
            id: 'activate',
            icon: faUndo,
            title: 'Ativar',
            buttonClass: 'btn-info',
            permission: 'Atualizar kits',
            onClick: (kit) => handleActivate(kit, 'Você tem certeza que deseja ativar: ', loadKits)
        },
    ], [handleDelete, handleActivate]);

    return (
        <MainLayout selectedCompany="ALUCOM">
            <PageHeader title="Kits" showBackButton={true} backUrl="/dashboard" /> 
            <div className="container-fluid p-1">
                <FilterForm autoCompleteFields={inputsfilters} onSubmit={handleFilterSubmit} onClear={handleClearFilters} />

                <ListHeader 
                    title="Lista de Kits" 
                    buttonText="Novo Kit" 
                    buttonLink="/kits/criar" 
                    canAccess={canAccess} 
                    permission="Criar kits"
                />

                <DynamicTable
                    headers={headers}
                    data={types}
                    actions={actions}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={loadKits}
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

export default KitPage;

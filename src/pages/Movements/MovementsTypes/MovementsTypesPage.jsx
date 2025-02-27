import React, { useState, useEffect, useCallback, useMemo } from "react";
import MainLayout from "../../../layouts/MainLayout";
import { usePermissions } from "../../../hooks/usePermissions";
import DynamicTable from "../../../components/DynamicTable";
import { useNavigate, useLocation } from "react-router-dom";
import ConfirmationModal from "../../../components/modals/ConfirmationModal";
import { PAGINATION } from "../../../constants/pagination";
import useLoader from "../../../hooks/useLoader";
import useBaseService from "../../../hooks/services/useBaseService";
import { entities } from "../../../constants/entities";
import PageHeader from "../../../components/PageHeader";
import ListHeader from "../../../components/ListHeader";
import useAction from "../../../hooks/useAction";
import useMovementsTypesFilters from "../../../hooks/filters/useMovementsTypesFilters";
import FilterForm from "../../../components/FilterForm";

const MovementsTypesPage = () => {
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
            const response = await fetchAllOsItemsType(entities.movements.types.get() ,filtersSubmit || filters);
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

    const { handleFilterSubmit, handleClearFilters, inputsfilters } = useMovementsTypesFilters(loadOsItemsTypes, filters, setFilters);

    useEffect(() => {
        loadOsItemsTypes();
    }, [itemsPerPage]);

    const headers = useMemo(() => ['id', 'Nome'], []);

    const actions = useMemo(() => [
    ], [handleActivate, handleDelete]);

    return (
        <MainLayout selectedCompany="ALUCOM">
            <PageHeader title="Tipos de Movimentos" showBackButton={true} backUrl="/dashboard"/>
            <div className="container-fluid p-1">
                <FilterForm autoCompleteFields={inputsfilters} onSubmit={handleFilterSubmit} onClear={handleClearFilters} />

                <ListHeader 
                    title="Lista de Tipos de Movimentos" 
                    buttonIsNotVisible={true}
                    canAccess={canAccess} 
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

export default MovementsTypesPage
import React, { useState, useEffect, useCallback, useMemo } from "react";
import MainLayout from "../../layouts/MainLayout";
import Button from "../../components/Button";
import { usePermissions } from "../../hooks/usePermissions";
import DynamicTable from "../../components/DynamicTable";
import useLoader from "../../hooks/useLoader";
import useNotification from "../../hooks/useNotification";
import { useNavigate, useLocation } from "react-router-dom";
import { faEdit, faTrashAlt, faUndo, faLink } from '@fortawesome/free-solid-svg-icons';
import ConfirmationModal from "../../components/modals/ConfirmationModal";
import { PAGINATION } from "../../constants/pagination";
import useBaseService from "../../hooks/services/useBaseService";
import { entities } from "../../constants/entities";
import PageHeader from "../../components/PageHeader";
import useUnitFilters from "../../hooks/filters/useUnitFilters";
import FilterForm from "../../components/FilterForm";
import ListHeader from '../../components/ListHeader';
import useAction from "../../hooks/useAction";

const UnitPage = () => {
    const { canAccess } = usePermissions();
    const { showLoader, hideLoader } = useLoader();
    const { showNotification } = useNotification();
    const navigate = useNavigate();
    const { get: fetchAll } = useBaseService(navigate);
    const location = useLocation();
    const [units, setUnits] = useState([]);
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

    const fetchUnitList = useCallback(async (filtersSubmit) => {
        try {
            showLoader();
            const response = await fetchAll(entities.units.get, filtersSubmit || filters);
            setUnits(response.result.data.map((unit) => ({
                id: unit.id,
                name: unit.name,
                abbreviation: unit.abbreviation,
                deleted_at: unit.deleted_at ? 'deleted-' + unit.deleted_at : 'deleted-null'
            })));
            setCurrentPage(response.result.current_page);
            setTotalPages(response.result.last_page);
        } catch (error) {
            console.log(error)
        } finally {
            hideLoader();
        }

    }, [fetchAll, itemsPerPage, showLoader, hideLoader, showNotification]);
    const { handleFilterSubmit, handleClearFilters, inputsfilters } = useUnitFilters(fetchUnitList, filters, setFilters);

    useEffect(() => {
        if (location.state?.message) {
            showNotification(location.state.type, location.state.message);
            setTimeout(() => navigate(location.pathname, { replace: true }), 0);
        }
        fetchUnitList();
    }, [location.state]);

    const headers = useMemo(() => ['id', 'Nome', 'Abreviação'], []);
    const actions = useMemo(() => [
        {
            id:'edit',
            icon: faEdit,
            title: 'Editar',
            buttonClass: 'btn-primary',
            permission: 'Atualizar tipos de produto',
            onClick: (unit) => navigate(`/unidades/editar/${unit.id}`),
        },
        {
            id:'viewUnitsRelated',
            icon: faLink, 
            title: 'Ver unidades relacionadas',
            buttonClass: 'btn-info',
            permission: 'Listar unidades de medida relacionadas',
            onClick: (unit) => navigate(`/unidades/${unit.id}/relacionadas/criar`),
        },
        {
            id: 'delete',
            icon: faTrashAlt,
            title: 'Excluir ',
            buttonClass: 'btn-danger',
            permission: 'Excluir tipos de produto',
            onClick: (group) => handleDelete(group, 'Você tem certeza que deseja excluir: ', entities.units.delete(group.id), fetchUnitList)
        },
        {
            id: 'activate',
            icon: faUndo,
            title: 'Ativar ',
            buttonClass: 'btn-info',
            permission: 'activate users',
            onClick: (group) => handleActivate(group, 'Você tem certeza que deseja ativar: ', fetchUnitList)
        },
    ], [navigate]);

    return (
        <MainLayout selectedCompany="ALUCOM">
            <PageHeader title="Unidades" showBackButton={true} backUrl="/dashboard" /> 
            <div className="container-fluid p-1">
                <FilterForm autoCompleteFields={inputsfilters} onSubmit={handleFilterSubmit} onClear={handleClearFilters} />

                <ListHeader 
                    title="Lista de Unidades" 
                    buttonText="Nova Unidade" 
                    buttonLink="/unidades/criar" 
                    canAccess={canAccess} 
                    permission="Criar unidades de medida"
                />

                <DynamicTable
                    headers={headers}
                    data={units}
                    actions={actions}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={fetchUnitList}
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

export default UnitPage;

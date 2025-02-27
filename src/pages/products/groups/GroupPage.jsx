import React, { useEffect, useState, useCallback, useMemo } from "react";
import MainLayout from "../../../layouts/MainLayout";
import { usePermissions } from "../../../hooks/usePermissions";
import DynamicTable from "../../../components/DynamicTable";
import useLoader from "../../../hooks/useLoader";
import useNotification from "../../../hooks/useNotification";
import { useNavigate, useLocation } from "react-router-dom";
import { faEdit, faTrashAlt, faUndo } from '@fortawesome/free-solid-svg-icons';
import ConfirmationModal from "../../../components/modals/ConfirmationModal";
import { PAGINATION } from "../../../constants/pagination";
import useBaseService from "../../../hooks/services/useBaseService";
import { entities } from "../../../constants/entities";
import PageHeader from '../../../components/PageHeader';
import useGroupsFilters from "../../../hooks/filters/useGroupsFilters";
import FilterForm from "../../../components/FilterForm";
import useAction from "../../../hooks/useAction";
import ListHeader from "../../../components/ListHeader";

const GroupPage = () => {
    const { canAccess } = usePermissions();
    const { showLoader, hideLoader } = useLoader();
    const { showNotification } = useNotification();
    const navigate = useNavigate();
    const location = useLocation();
    const { get: fetchAll, del: remove } = useBaseService(navigate);
    const [groups, setGroups] = useState([]);
    const [currentPage, setCurrentPage] = useState(PAGINATION.DEFAULT_PAGE);
    const [itemsPerPage, setItemsPerPage] = useState(PAGINATION.DEFAULT_PER_PAGE);
    const [totalPages, setTotalPages] = useState(PAGINATION.DEFAULT_TOTAL_PAGES);
    const [selectedGroup, setSelectedGroup] = useState(null);  
    const [filters, setFilters] = useState({
        id: '',
        name: '',
        id: '',
        filledInputs: '',
        deleted_at: false,
        page: 1,
        perPage:itemsPerPage
    });
    const { openModalConfirmation, handleActivate, handleDelete, handleConfirmAction, handleCancelConfirmation, selectedItem, action } = useAction(navigate);

    const fetchGroup = useCallback(async (filtersSubmit) => {
        try {
            showLoader();
            const response = await fetchAll(entities.groups.get, filtersSubmit || filters);
            setGroups(response.result.data.map(group => ({
                id: group.id,
                name: group.name,
                deleted_at: group.deleted_at ? 'deleted-' + group.deleted_at : 'deleted-null'
            })));
            setCurrentPage(response.result.current_page);
            setTotalPages(response.result.last_page);
        } catch (error) {
            console.log(error)
        } finally {
            hideLoader();
        }
    }, [fetchAll, itemsPerPage, showLoader, hideLoader, showNotification]);

    const { handleFilterSubmit, handleClearFilters, inputsfilters } = useGroupsFilters(fetchGroup, filters, setFilters);

    useEffect(() => {
        fetchGroup();
    }, []);

    useEffect(() => {
        if (location.state?.message) {
            showNotification(location.state.type, location.state.message);
            setTimeout(() => navigate(location.pathname, { replace: true }), 0);
        }
    }, [location.state, navigate]);

    const headers = useMemo(() => ['id', 'Nome'], []);
    const actions = useMemo(() => [
        {
            icon: faEdit,
            title: 'Editar',
            buttonClass: 'btn-primary',
            permission: 'Atualizar grupos de produto',
            onClick: (group) => navigate(`/grupos/editar/${group.id}`),
        },
        {
            id: 'delete',
            icon: faTrashAlt,
            title: 'Excluir',
            buttonClass: 'btn-danger',
            permission: 'Excluir grupos de produto',
            onClick: (group) => handleDelete(group, 'Você tem certeza que deseja excluir: ', entities.groups.delete(group.id), fetchGroup)
        },
        {
            id: 'activate',
            icon: faUndo,
            title: 'Ativar',
            buttonClass: 'btn-info',
            permission: 'Atualizar grupos de produto',
            onClick: (group) => handleActivate(group, 'Você tem certeza que deseja ativar: ', fetchGroup)
        },
    ], [navigate]);

    return (
        <MainLayout selectedCompany="ALUCOM">
            <PageHeader title="Grupos" showBackButton={true} backUrl="/dashboard" /> 
            <div className="container-fluid p-1">
                <FilterForm autoCompleteFields={inputsfilters} onSubmit={handleFilterSubmit} onClear={handleClearFilters} />

                <ListHeader 
                    title="Lista de Grupos" 
                    buttonText="Novo Grupo" 
                    buttonLink="/grupos/criar" 
                    canAccess={canAccess} 
                    permission="Criar grupos de produto"
                />

                <DynamicTable
                    headers={headers}
                    data={groups}
                    actions={actions}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={fetchGroup}
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

export default GroupPage;

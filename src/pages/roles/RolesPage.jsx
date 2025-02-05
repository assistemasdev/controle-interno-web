import React, { useState, useEffect, useCallback, useMemo } from "react";
import MainLayout from "../../layouts/MainLayout";
import { usePermissions } from "../../hooks/usePermissions";
import DynamicTable from "../../components/DynamicTable";
import { useNavigate, useLocation } from "react-router-dom";
import { faEdit, faTrashAlt, faUndo } from '@fortawesome/free-solid-svg-icons';
import { PAGINATION } from "../../constants/pagination";
import useLoader from "../../hooks/useLoader";
import useNotification from "../../hooks/useNotification";
import ConfirmationModal from "../../components/modals/ConfirmationModal";
import useBaseService from "../../hooks/services/useBaseService";
import { entities } from "../../constants/entities";
import FilterForm from "../../components/FilterForm"; 
import PageHeader from "../../components/PageHeader"; 
import ListHeader from "../../components/ListHeader"; 
import { useRoleFilters } from "../../hooks/filters/useRoleFilters";
import useAction from "../../hooks/useAction";  

const RolePage = () => {
    const { canAccess } = usePermissions();
    const navigate = useNavigate();
    const location = useLocation();
    const { showLoader, hideLoader } = useLoader();
    const { showNotification } = useNotification();
    const { get: fetchAll } = useBaseService(navigate);
    
    const [roles, setRoles] = useState([]);
    const [filters, setFilters] = useState({
        id: '',
        name: '',
        filledInputs: '',
        deleted_at: false,
        page: 1,
        perPage: PAGINATION.DEFAULT_PER_PAGE
    });
    const [currentPage, setCurrentPage] = useState(PAGINATION.DEFAULT_PAGE);
    const [totalPages, setTotalPages] = useState(PAGINATION.DEFAULT_TOTAL_PAGES);
    const { openModalConfirmation, handleActivate, handleDelete, handleConfirmAction, handleCancelConfirmation, selectedItem, action } = useAction(navigate);  

    useEffect(() => {
        if (location.state?.message) {
            showNotification(location.state.type, location.state.message);
        }
    }, [location.state]);

    const fetchRoles = useCallback(
        async (filtersSubmit) => {
            try {
                showLoader();
                const response = await fetchAll(entities.roles.get, filtersSubmit || filters);
                const filteredRoles = response.result.data.map(role => ({
                    id: role.id,
                    name: role.name,
                    deleted_at: role.deleted_at ? 'deleted-' + role.deleted_at : 'deleted-null'
                }));

                setRoles(filteredRoles);
                setCurrentPage(response.result.current_page);
                setTotalPages(response.result.last_page);
            } catch (error) {
                console.error(error);
            } finally {
                hideLoader();
            }
        },
        [navigate, showLoader, hideLoader, showNotification]
    );

    const { handleFilterSubmit, handleClearFilters, inputsfilters } = useRoleFilters(fetchRoles, filters, setFilters);

    useEffect(() => {
        fetchRoles();
    }, []);

    const headers = useMemo(() => ['id', 'Nome'], []);

    const actions = useMemo(() => [
        {
            icon: faEdit,
            title: 'Editar Cargos',
            buttonClass: 'btn-primary',
            permission: 'Atualizar cargos',
            onClick: (role) => navigate(`/cargos/editar/${role.id}`) 
        },
        {
            id: 'delete',
            icon: faTrashAlt,
            title: 'Excluir cargo',
            buttonClass: 'btn-danger',
            permission: 'Excluir cargos',
            onClick: (role) => handleDelete(role, 'Você tem certeza que deseja excluir: ', entities.roles.delete(role.id), fetchRoles) 
        },
        {
            id: 'activate',
            icon: faUndo,
            title: 'Ativar cargo',
            buttonClass: 'btn-info',
            permission: 'Atualizar cargos',
            onClick: (role) => handleActivate(role, 'Você tem certeza que deseja ativar: ', fetchRoles) 
        },
    ], [handleActivate, handleDelete, navigate]);

    return (
        <MainLayout selectedCompany="ALUCOM">
            <PageHeader title="Cargos" showBackButton={true} backUrl="/dashboard" />

            <div className="container-fluid p-1">
                <FilterForm autoCompleteFields={inputsfilters} onSubmit={handleFilterSubmit} onClear={handleClearFilters} />

                <ListHeader
                    title="Lista de Cargos"
                    buttonText="Novo Cargo"
                    buttonLink="/cargos/criar"
                    canAccess={canAccess}
                    permission="Criar cargos"
                />

                <DynamicTable
                    headers={headers}
                    data={roles}
                    actions={actions}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={fetchRoles}
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

export default RolePage;

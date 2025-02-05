import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { faEdit, faTrashAlt, faUndo } from "@fortawesome/free-solid-svg-icons";
import MainLayout from "../../layouts/MainLayout";
import { usePermissions } from "../../hooks/usePermissions";
import { PAGINATION } from "../../constants/pagination";
import { entities } from "../../constants/entities";
import useLoader from "../../hooks/useLoader";
import useNotification from "../../hooks/useNotification";
import useBaseService from "../../hooks/services/useBaseService";
import useAction from "../../hooks/useAction";
import { useConditionFilters } from "../../hooks/filters/useConditionFilters";
import PageHeader from "../../components/PageHeader";
import ListHeader from "../../components/ListHeader";
import FilterForm from "../../components/FilterForm";
import DynamicTable from "../../components/DynamicTable";
import ConfirmationModal from "../../components/modals/ConfirmationModal";

const ConditionPage = () => {
    const { canAccess } = usePermissions();
    const [conditions, setConditions] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();
    const [selectedConditions, setSelectedConditions] = useState([]);
    const [currentPage, setCurrentPage] = useState(PAGINATION.DEFAULT_PAGE);
    const [itemsPerPage, setItemsPerPage] = useState(PAGINATION.DEFAULT_PER_PAGE);
    const [totalPages, setTotalPages] = useState(PAGINATION.DEFAULT_TOTAL_PAGES);
    const { get: fetchAll, del: remove } = useBaseService(navigate);
    const { showLoader, hideLoader } = useLoader();
    const { showNotification } = useNotification();
    const { action, selectedItem, openModalConfirmation, handleActivate, handleDelete, handleConfirmAction, handleCancelConfirmation } = useAction();
    const [filters, setFilters] = useState({
        id: '',
        name: '',
        session_code: '',
        deleted_at: false,
        page: 1,
        perPage: itemsPerPage
    });

    useEffect(() => {
        if (location.state?.message) {
            showNotification('error', location.state.message);
            navigate(location.pathname, { replace: true, state: {} });
        }
    }, [location, navigate]);

    const fetchCondition = useCallback(async (filtersSubmit) => {
        try {
            showLoader();
            const response = await fetchAll(entities.conditions.get, filtersSubmit || filters);
            const filteredCondition = response.result.data.map(condition => ({
                id: condition.id,
                name: condition.name,
                deleted_at: condition.deleted_at ? 'deleted-' + condition.deleted_at : 'deleted-null'
            }));
            setConditions(filteredCondition);
            setTotalPages(response.result.last_page);
            setCurrentPage(response.result.current_page);
        } catch (error) {
            console.error(error);
        } finally {
            hideLoader();
        }
    }, [fetchAll, showLoader, hideLoader, showNotification, itemsPerPage]);

    const { handleFilterSubmit, inputsFilters, handleClearFilters } = useConditionFilters(selectedConditions, fetchCondition);

    const handleEdit = (conditionId) => {
        navigate(`/condicoes/editar/${conditionId}`);
    };

    const headers = useMemo(() => ['id', 'Nome'], []);

    const actions = useMemo(() => [
        {
            icon: faEdit,
            title: 'Editar Categoria',
            buttonClass: 'btn-primary',
            permission: 'Atualizar condições de produto',
            onClick: (condition) => navigate(`/condicoes/editar/${condition.id}`)
        },
        {
            id: 'delete',
            icon: faTrashAlt,
            title: 'Excluir condição',
            buttonClass: 'btn-danger',
            permission: 'Excluir condições de produto',
            onClick: (condition) => handleDelete(
                condition, 
                'Você tem certeza que deseja excluir: ', 
                entities.conditions.delete(condition.id), 
                fetchCondition
            ),
        },
        {
            id: 'activate',
            icon: faUndo,
            title: 'Ativar condição',
            buttonClass: 'btn-info',
            permission: 'Atualizar condições de produto',
            onClick: (condition) => handleActivate(
                condition, 
                'Você tem certeza que deseja ativar: ', 
                fetchCondition
            ),
        },
    ], [handleDelete, handleEdit]);

    return (
        <MainLayout selectedCompany="ALUCOM">
            <PageHeader title="Condições" showBackButton backUrl="/dashboard" />
            <div className="container-fluid p-1">
                <FilterForm 
                    autoCompleteFields={inputsFilters}
                    onSubmit={handleFilterSubmit}
                    onClear={handleClearFilters}
                />
                <ListHeader 
                    title="Lista de Condições" 
                    buttonText="Nova Condição" 
                    buttonLink="/condicoes/criar" 
                    canAccess={canAccess} 
                    permission="Criar condições de produtos" 
                />
                <DynamicTable 
                    headers={headers}
                    data={conditions}
                    actions={actions}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={fetchCondition}
                    filters={filters}
                    setFilters={setFilters}
                />
                <ConfirmationModal 
                    open={openModalConfirmation}
                    onClose={handleCancelConfirmation}
                    onConfirm={() => action.action === 'delete' ? handleConfirmAction(selectedItem.id) : console.log('oi')}
                    itemName={selectedItem ? selectedItem.name : ''}
                    text={action.text}
                />
            </div>
        </MainLayout>
    );
};

export default ConditionPage;

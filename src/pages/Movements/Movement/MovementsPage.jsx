import React, { useState, useEffect, useCallback, useMemo } from "react";
import MainLayout from "../../../layouts/MainLayout";
import { usePermissions } from "../../../hooks/usePermissions";
import DynamicTable from "../../../components/DynamicTable";
import { useNavigate, useLocation } from "react-router-dom";
import { faEdit, faTrash, faEye, faUndo, faTruck } from '@fortawesome/free-solid-svg-icons';
import ConfirmationModal from "../../../components/modals/ConfirmationModal";
import { PAGINATION } from "../../../constants/pagination";
import useLoader from "../../../hooks/useLoader";
import useNotification from "../../../hooks/useNotification";
import useBaseService from "../../../hooks/services/useBaseService";
import { entities } from "../../../constants/entities";
import useApplicationFilters from "../../../hooks/filters/useApplicationFilters";  
import useAction from "../../../hooks/useAction";  
import FilterForm from "../../../components/FilterForm";  
import ListHeader from "../../../components/ListHeader";  
import PageHeader from "../../../components/PageHeader";  
import { formatDateToInput } from "../../../utils/formatDateToInput";

const MovementsPage = () => {
    const { canAccess } = usePermissions();
    const [movements, setMovements] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();
    const { showLoader, hideLoader } = useLoader();
    const { showNotification } = useNotification();
    const { 
        get: fetchAll
    } = useBaseService(navigate);
    const [currentPage, setCurrentPage] = useState(PAGINATION.DEFAULT_PAGE);
    const [totalPages, setTotalPages] = useState(PAGINATION.DEFAULT_TOTAL_PAGES);
    const [itemsPerPage, setItemsPerPage] = useState(PAGINATION.DEFAULT_PER_PAGE);
    const [filters, setFilters] = useState({ id: '', idlike: '', filledInputs: '', deleted_at: false, page: currentPage, perPage: itemsPerPage });
    const { openModalConfirmation, action, handleActivate, handleDelete, handleConfirmAction, handleCancelConfirmation, selectedItem } = useAction(navigate); 

    useEffect(() => {
        if (location.state?.message) {
            showNotification(location.state.type, location.state.message);
            navigate(location.pathname, { replace: true });
        }
    }, [location.state, showNotification, navigate]);

    const fetchMovements = useCallback(async (filtersSubmit) => {
        showLoader();
        try {
            const [
                response
            ] = await Promise.all([
                fetchAll(entities.movements.get, filtersSubmit || filters),
            ])
            
            setMovements(response.result.data.map((item) => ({
                id:item.id,
                movement_date: formatDateToInput(item.movement_date),
                status: item.status_name,
                customer: item.customer_name,
                organization: item.organization_name,
                deleted_at: item.deleted_at ? 'deleted-' + item.deleted_at : 'deleted-null'
            })));
            setCurrentPage(response.result.current_page);
            setTotalPages(response.result.last_page);
        } catch (error) {
            console.error("Erro ao carregar movimentos:", error);
        } finally {
            hideLoader();
        }
    }, [fetchAll, filters, showLoader, hideLoader]);

    const { handleFilterSubmit, handleClearFilters, inputsfilters } = useApplicationFilters(fetchMovements, filters, setFilters);  

    useEffect(() => {
        fetchMovements();
    }, []);

    const headers = useMemo(() => ['id', 'Data', 'Status', 'Cliente', 'Organização'], []);
    const actions = useMemo(() => [
        {
            id: 'edit',
            icon: faEdit,
            title: 'Editar',
            buttonClass: 'btn-primary',
            permission: 'Atualizar movimentos',
            onClick: (movement) => navigate(`/movimentos/editar/${movement.id}`)
        },
        {
            id: 'details',
            icon: faEye,
            title: 'Ver Detalhes',
            buttonClass: 'btn-info',
            permission: 'Ver movimentos',
            onClick: (movement) => navigate(`/movimentos/detalhes/${movement.id}`)
        },
        {
            id: 'shipments',
            icon: faTruck, 
            title: 'Ver Carregamentos',
            buttonClass: 'btn-warning',
            permission: 'Listar carregamentos',
            onClick: (movement) => navigate(`/movimentos/${movement.id}/carregamentos`)
        },
        {
            id: 'delete',
            icon: faTrash,
            title: 'Excluir',
            buttonClass: 'btn-danger',
            permission: 'Excluir movimentos',
            onClick: (movement) => handleDelete(movement, 'Você tem certeza que deseja excluir: ', entities.movements.delete(movement.id), fetchMovements),
        },
        {
            id: 'activate',
            icon: faUndo,
            title: 'Ativar',
            buttonClass: 'btn-info',
            permission: 'Atualizar movimentos',
            onClick: (movement) => handleActivate(movement, 'Você tem certeza que deseja ativar: '),
        },
    ], [handleDelete]);

    return (
        <MainLayout selectedCompany="ALUCOM">
            <PageHeader title="Movimentos" showBackButton={true} backUrl="/dashboard" />
            <div className="container-fluid p-1">
                <FilterForm autoCompleteFields={inputsfilters} onSubmit={handleFilterSubmit} onClear={handleClearFilters} />
                <ListHeader title="Lista de Movimentos" buttonText="Novo Movimento" buttonLink="/movimentos/criar" canAccess={canAccess} permission="Criar Movimentos" />
                <DynamicTable 
                    headers={headers} 
                    data={movements} 
                    actions={actions} 
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={fetchMovements}
                    filters={filters}
                    setFilters={setFilters}
                />
                <ConfirmationModal
                    open={openModalConfirmation}
                    onClose={handleCancelConfirmation}
                    onConfirm={handleConfirmAction}
                    itemName={selectedItem ? selectedItem.id : ''}
                    text={action.text}
                />
            </div>
        </MainLayout>
    );
};

export default MovementsPage;

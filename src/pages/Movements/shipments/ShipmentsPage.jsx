import React, { useState, useEffect, useCallback, useMemo } from "react";
import MainLayout from "../../../layouts/MainLayout";
import { usePermissions } from "../../../hooks/usePermissions";
import DynamicTable from "../../../components/DynamicTable";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { faEdit, faTrash, faEye, faUndo } from '@fortawesome/free-solid-svg-icons';
import ConfirmationModal from "../../../components/modals/ConfirmationModal";
import { PAGINATION } from "../../../constants/pagination";
import useLoader from "../../../hooks/useLoader";
import useNotification from "../../../hooks/useNotification";
import useBaseService from "../../../hooks/services/useBaseService";
import { entities } from "../../../constants/entities";
import useShiptmentGlobalFilters from "../../../hooks/filters/useShiptmentGlobalFilters";  
import useAction from "../../../hooks/useAction";  
import FilterForm from "../../../components/FilterForm";  
import ListHeader from "../../../components/ListHeader";  
import PageHeader from "../../../components/PageHeader";  

const ShipmentsPage = () => {
    const { canAccess } = usePermissions();
    const [shipments, setShipments] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();
    const { showLoader, hideLoader } = useLoader();
    const { showNotification } = useNotification();
    const { 
        get: fetchAll
    } = useBaseService(navigate);
    const [currentPage, setCurrentPage] = useState(PAGINATION.DEFAULT_PAGE);
    const [totalPages, setTotalPages] = useState(PAGINATION.DEFAULT_TOTAL_PAGES);
    const [itemsPerPage, setItemsPerPage] = useState(PAGINATION.itemsPerPage);
    const [filters, setFilters] = useState({ id: '', idlike: '', filledInputs: '', deleted_at: false, page: currentPage, perPage: itemsPerPage });
    const { openModalConfirmation, action, handleActivate, handleDelete, handleConfirmAction, handleCancelConfirmation, selectedItem } = useAction(navigate); 

    useEffect(() => {
        if (location.state?.message) {
            showNotification(location.state.type, location.state.message);
            navigate(location.pathname, { replace: true });
        }
    }, [location.state, showNotification, navigate]);

    const fetchShipments = useCallback(async (filtersSubmit) => {
        showLoader();
        try {
            const [
                response,
            ] = await Promise.all([
                fetchAll(entities.shipments.get, filtersSubmit || filters),
            ])

            setShipments(response.result.data.map((item) => ({
                id: item.id || 'N/A',
                movement_id: item.movement_id || 'N/A',
                status: item.status || 'N/A',
                deleted_at: item.deleted_at ? 'deleted-' + item.deleted_at : 'deleted-null'
            })));
            setCurrentPage(response.result.current_page);
            setTotalPages(response.result.last_page);
        } catch (error) {
            console.error("Erro ao carregar carregamentos:", error);
        } finally {
            hideLoader();
        }
    }, [fetchAll, filters, showLoader, hideLoader]);

    const { handleFilterSubmit, handleClearFilters, inputsfilters } = useShiptmentGlobalFilters(fetchShipments, filters, setFilters);  

    useEffect(() => {
        fetchShipments();
    }, []);

    const headers = useMemo(() => ['Id', 'Nº Movimento', 'Status'], []);
    const actions = useMemo(() => [
        {
            id: 'edit',
            icon: faEdit,
            title: 'Editar',
            buttonClass: 'btn-primary',
            permission: 'Atualizar carregamentos',
            onClick: (shipment) => navigate(`/movimentos/${shipment.movement_id}/carregamentos/${shipment.id}/editar`)
        },
        {
            id: 'details',
            icon: faEye,
            title: 'Ver Detalhes',
            buttonClass: 'btn-info',
            permission: 'Ver carregamentos',
            onClick: (shipment) => navigate(`/carregamentos/${shipment.id}/detalhes/`)
        },
        {
            id: 'delete',
            icon: faTrash,
            title: 'Excluir',
            buttonClass: 'btn-danger',
            permission: 'Excluir carregamentos',
            onClick: (movement) => handleDelete(movement, 'Você tem certeza que deseja excluir: ', entities.shipments.delete(movement.id), fetchShipments),
        },
        {
            id: 'activate',
            icon: faUndo,
            title: 'Ativar',
            buttonClass: 'btn-info',
            permission: 'Atualizar carregamentos',
            onClick: (movement) => handleActivate(movement, 'Você tem certeza que deseja ativar: '),
        },
    ], [handleDelete]);

    return (
        <MainLayout selectedCompany="ALUCOM">
            <PageHeader title="Carregamentos" showBackButton={true} backUrl="/movimentos" />
            <div className="container-fluid p-1">
                <FilterForm autoCompleteFields={inputsfilters} onSubmit={handleFilterSubmit} onClear={handleClearFilters} />
                <DynamicTable 
                    headers={headers} 
                    data={shipments} 
                    actions={actions} 
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={fetchShipments}
                    filters={filters}
                    setFilters={setFilters}
                />
                <ConfirmationModal
                    open={openModalConfirmation}
                    onClose={handleCancelConfirmation}
                    onConfirm={handleConfirmAction}
                    itemName={selectedItem ? `${selectedItem.id} - Movimento: ${selectedItem.movement_id}` : ''}
                    text={action.text}
                />
            </div>
        </MainLayout>
    );
};

export default ShipmentsPage;

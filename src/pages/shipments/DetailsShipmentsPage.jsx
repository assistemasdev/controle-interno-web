import React, { useEffect, useState } from 'react';
import MainLayout from '../../layouts/MainLayout';
import { useNavigate, useParams } from 'react-router-dom';
import '../../assets/styles/custom-styles.css';
import useNotification from '../../hooks/useNotification';
import useLoader from '../../hooks/useLoader';
import useForm from '../../hooks/useForm';
import { detailsMovementFields } from "../../constants/forms/shipmentFields";
import { setDefaultFieldValues } from '../../utils/objectUtils';
import useBaseService from '../../hooks/services/useBaseService';
import { entities } from '../../constants/entities';
import PageHeader from '../../components/PageHeader';
import DetailsSectionRenderer from '../../components/DetailsSectionRenderer';
import DynamicTable from '../../components/DynamicTable';
import { PAGINATION } from '../../constants/pagination';
import { faEdit, faTrash, faEye, faUndo } from '@fortawesome/free-solid-svg-icons';
import useAction from '../../hooks/useAction';
import ConfirmationModal from '../../components/modals/ConfirmationModal';

const DetailsShipmentsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { showNotification } = useNotification();
    const { 
        getByColumn: fetchById,
        get: fetchShipmentsItems,
    } = useBaseService(navigate);
    const [movementId, setMovementId] = useState();
    const { showLoader, hideLoader } = useLoader();
    const { formData, formatData } = useForm(setDefaultFieldValues(detailsMovementFields));
    const [shiptmentsItems, setShipmentsItems] = useState([]);
    const [currentPage, setCurrentPage] = useState(PAGINATION.DEFAULT_PAGE);
    const [itemsPerPage, setItemsPerPage] = useState(PAGINATION.DEFAULT_PER_PAGE);
    const [totalPages, setTotalPages] = useState(PAGINATION.DEFAULT_TOTAL_PAGES);
    const [filters, setFilters] = useState({
        deleted_at:false,
        page: 1,
        perPage:itemsPerPage
    });
    const { 
        openModalConfirmation,
        action,
        handleActivate,
        handleDelete,
        handleConfirmAction,
        handleCancelConfirmation,
        selectedItem
    } = useAction(navigate); 

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            showLoader();
            const [
                response,
                responseShipmentsItems
            ] = await Promise.all([
                fetchById(entities.shipments.getByColumn(id)),
                fetchShipmentsItems(entities.shipments.items.get(id), filters)
            ])
            setMovementId(response.result.movement_id)
            formatData(response.result, detailsMovementFields);
            setShipmentsItems(responseShipmentsItems.result.data.map((item) => ({
                id: item.id,
                movement_item_id: item.movement_item_id,
                delivery_date: item.delivery_date,
                deleted_at: item.deleted_at ? 'deleted-' + item.deleted_at : 'deleted-null'
            })))
            setCurrentPage(responseShipmentsItems.result.current_page);
            setTotalPages(responseShipmentsItems.result.last_page);
        } catch (error) {
            const errorMessage = error.response?.data?.error || 'Erro ao carregar os dados.';
            showNotification('error', errorMessage);
            console.error('Erro no carregamento dos dados:', error);
        } finally {
            hideLoader();
        }
    };

    const headers = ['Id', 'Nº Movimento Item', 'Data de Entrega'];
    const actions = [
        {
            id: 'edit',
            icon: faEdit,
            title: 'Editar',
            buttonClass: 'btn-primary',
            permission: 'Atualizar itens de carregamentos',
            onClick: (shipmentItemId) => navigate(`/movimentos/${movementId}/carregamentos/${id}/itens/${shipmentItemId.id}/editar`)
        },
        {
            id: 'details',
            icon: faEye,
            title: 'Ver Detalhes',
            buttonClass: 'btn-info',
            permission: 'Ver itens de carregamentos',
            onClick: (shipmentItemId) => navigate(`/carregamentos/${id}/detalhes/itens/${shipmentItemId.id}/detalhes`)
        },
        {
            id: 'delete',
            icon: faTrash,
            title: 'Excluir',
            buttonClass: 'btn-danger',
            permission: 'Excluir itens de carregamentos',
            onClick: (shipmentItemId) => handleDelete(shipmentItemId, 'Você tem certeza que deseja excluir: ', entities.shipments.items.delete(id, shipmentItemId.id), fetchData),
        },
        {
            id: 'activate',
            icon: faUndo,
            title: 'Ativar',
            buttonClass: 'btn-info',
            permission: 'Atualizar itens de carregamentos',
            onClick: (shipmentItemId) => handleActivate(shipmentItemId, 'Você tem certeza que deseja ativar: ', fetchData),
        },
    ];
    
    return (
        <MainLayout selectedCompany="ALUCOM">
            <PageHeader title="Detalhes do Carregamento" showBackButton={true} backUrl={`/carregamentos/`}/>
            <div className="container-fluid p-1">
                <DetailsSectionRenderer formData={formData} sections={detailsMovementFields}/>
                <DynamicTable 
                    headers={headers} 
                    data={shiptmentsItems} 
                    actions={actions} 
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={fetchData}
                    filters={filters}
                    setFilters={setFilters}
                />

                <ConfirmationModal
                    open={openModalConfirmation}
                    onClose={handleCancelConfirmation}
                    onConfirm={handleConfirmAction}
                    itemName={selectedItem ? `${selectedItem.id}` : ''}
                    text={action.text}
                />
            </div>
        </MainLayout>
    );
};

export default DetailsShipmentsPage;

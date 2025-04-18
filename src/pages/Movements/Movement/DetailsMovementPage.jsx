import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MainLayout from '../../../layouts/MainLayout';
import Button from '../../../components/Button';
import '../../../assets/styles/custom-styles.css';
import DynamicTable from '../../../components/DynamicTable';
import { faEdit, faTrash, faEye, faUndo } from '@fortawesome/free-solid-svg-icons';
import ConfirmationModal from '../../../components/modals/ConfirmationModal';
import { usePermissions } from '../../../hooks/usePermissions';
import { PAGINATION } from '../../../constants/pagination';
import useLoader from '../../../hooks/useLoader';
import { detailsMovementFields } from '../../../constants/forms/movementFields';
import DetailsSectionRenderer from '../../../components/DetailsSectionRenderer';
import useForm from '../../../hooks/useForm';
import { setDefaultFieldValues } from '../../../utils/objectUtils';
import useBaseService from '../../../hooks/services/useBaseService';
import { entities } from '../../../constants/entities';
import PageHeader from '../../../components/PageHeader';
import ListHeader from '../../../components/ListHeader';
import useAction from '../../../hooks/useAction';
import { formatDateToInput } from '../../../utils/formatDateToInput';

const DetailsMovementPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { canAccess } = usePermissions();
    const { showLoader, hideLoader } = useLoader();
    const { 
        getByColumn: fetchById,
        get: fetchMovementsItems,
    } = useBaseService(navigate);
    const { formData, setFormData, formatData } = useForm(setDefaultFieldValues(detailsMovementFields));
    const [currentPage, setCurrentPage] = useState(PAGINATION.DEFAULT_PAGE);
    const [itemsPerPage, setItemsPerPage] = useState(PAGINATION.DEFAULT_PER_PAGE);
    const [totalPages, setTotalPages] = useState(PAGINATION.DEFAULT_TOTAL_PAGES);
    const [movementsProducts, setMovementsProducts] = useState([]);
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
    
    const fetchData = useCallback(async () => {
        showLoader();

        try {
            const response = await fetchById(entities.movements.getByColumn(id));
            formatData(response.result, detailsMovementFields);
            setFormData((prev) => ({
                ...prev,
                customer_id: response.result.customer_name,
                organization_id: response.result.organization_name,
                movement_date: formatDateToInput(response.result.movement_date),
                status_id: response.result.status_name
            }))

            fetchMovementsItemsData(null)
        } catch (error) {
            console.log(error)
        } finally {
            hideLoader();
        }
    }, [fetchById]);

    useEffect(() => {
        fetchData();
    }, [id]);

    const fetchMovementsItemsData = async (filtersSubmit) => {
        try {
            showLoader()
            const response =  await fetchMovementsItems(entities.movements.items.get(id), filtersSubmit || filters)
            setCurrentPage(response.result.current_page);
            setTotalPages(response.result.last_page);
            setMovementsProducts(response.result.data.map((item) => ({
                id:item.id,
                product: item.product_name ?? 'N/A',
                movement_type: item.movement_name ?? 'N/A',
                status: item.status_name ?? 'N/A',
                deleted_at: item.deleted_at ? 'deleted-' + item.deleted_at : 'deleted-null'
            })));
        } catch (error) {
            console.log(error)
        } finally {
            hideLoader()
        }
    }

    const actions = useMemo(() => [
        {
            id:'viewDetails',
            icon: faEye,
            title: 'Ver Detalhes',
            buttonClass: 'btn-info',
            permission: 'Ver itens de movimentos',
            onClick: (movementItem) => navigate(`/movimentos/detalhes/${id}/produtos/detalhes/${movementItem.id}`),
        },
        {
            id:'edit',
            icon: faEdit,
            title: 'Editar',
            buttonClass: 'btn-primary',
            permission: 'Atualizar itens de movimentos',
            onClick: (movementItem) => navigate(`/movimentos/detalhes/${id}/produtos/editar/${movementItem.id}/${formData.service_order_id}`),
        },
        {
            id:'delete',
            icon: faTrash,
            title: 'Excluir',
            buttonClass: 'btn-danger',
            permission: 'Excluir itens de movimentos',
            onClick: (movementItem) => {
                handleDelete(movementItem, `Você tem certeza que deseja excluir o endereço: `, entities.movements.items.delete(id, movementItem.id), fetchMovementsItemsData);
            },
        },
        {
            id:'activate',
            icon: faUndo,
            title: 'Ativar',
            buttonClass: 'btn-success',
            permission: 'Ativar itens de movimentos',
            onClick: (movementItem) => {
                handleActivate(movementItem, `Você tem certeza que deseja ativar o endereço: `, entities.movements.items.activate(id, movementItem.id), fetchMovementsItemsData);
            },
        }
    ], [navigate, id, handleDelete, handleActivate]);

    return (
        <MainLayout selectedCompany="ALUCOM">
            <PageHeader title="Detalhes do Movimento" showBackButton={true} backUrl="/movimentos" />

            <div className="container-fluid p-1">
                <DetailsSectionRenderer sections={detailsMovementFields} formData={formData}/>

                <ListHeader 
                    title="Produtos do Movimento"
                    buttonText="Adicionar Produto"
                    buttonLink={`/movimentos/detalhes/${id}/produtos/adicionar/${formData.service_order_id}`}
                    canAccess={canAccess}
                    permission="Criar itens de movimentos"
                />
                
                <DynamicTable
                    headers={['Id', 'Produto', 'Movimento', 'Status']}
                    data={movementsProducts}
                    actions={actions}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={fetchData}
                    filters={filters}
                    setFilters={setFilters}
                />

                <div className="mt-3 d-flex gap-2">
                    <Button type="button" text="Voltar" className="btn btn-blue-light fw-semibold" onClick={() => navigate('/movimentos/')} />
                </div>
            </div>

            <ConfirmationModal
                open={openModalConfirmation}
                onClose={handleCancelConfirmation}
                onConfirm={handleConfirmAction}
                itemName={selectedItem ? `${selectedItem.number} - ${selectedItem.name}` : ''}
                text={action.text}
            />
        </MainLayout>
    );
};

export default DetailsMovementPage;

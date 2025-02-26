import React, { useCallback, useEffect, useState, useMemo } from 'react';
import MainLayout from '../../../../layouts/MainLayout';
import { useNavigate, useParams } from 'react-router-dom';
import '../../../../assets/styles/custom-styles.css';
import useForm from '../../../../hooks/useForm';
import { DetailsOrderServiceFields } from '../../../../constants/forms/orderServiceFields';
import { setDefaultFieldValues } from '../../../../utils/objectUtils';
import useBaseService from '../../../../hooks/services/useBaseService';
import { entities } from '../../../../constants/entities';
import useLoader from '../../../../hooks/useLoader';
import useNotification from '../../../../hooks/useNotification';
import DetailsSectionRenderer from '../../../../components/DetailsSectionRenderer';
import { usePermissions } from '../../../../hooks/usePermissions';
import { faEdit, faTrash, faEye, faUndo } from '@fortawesome/free-solid-svg-icons';
import DynamicTable from '../../../../components/DynamicTable';
import { PAGINATION } from '../../../../constants/pagination';
import ConfirmationModal from '../../../../components/modals/ConfirmationModal';
import PageHeader from '../../../../components/PageHeader';
import ListHeader from '../../../../components/ListHeader';
import useAction from '../../../../hooks/useAction';

const DetailsContractOsPage = () => {
    const { id, contractOsId } = useParams();
    const navigate = useNavigate();
    const { showLoader, hideLoader } = useLoader();
    const { canAccess } = usePermissions();
    const { showNotification } = useNotification();
    const { 
        getByColumn: fetchByContractOsById,
        getByColumn: fetchOsStatusById,
        getByColumn: fetchOsDepartamentById,
        getByColumn: fetchOsDestinationById,
        getByColumn: fetchUserById,
        get: fetchOsItens,
        get: fetchMovementsTypes,
        get: fetchProducts,
    } = useBaseService(navigate);
    const { formData,  setFormData } = useForm(setDefaultFieldValues(DetailsOrderServiceFields));
    const [osItens, setOsItens] = useState([]);
    const [currentPage, setCurrentPage] = useState(PAGINATION.DEFAULT_PAGE);
    const [itemsPerPage, setItemsPerPage] = useState(PAGINATION.DEFAULT_PER_PAGE);
    const [totalPages, setTotalPages] = useState(PAGINATION.DEFAULT_TOTAL_PAGES);
    const [filters, setFilters] = useState({
        deleted_at: false,
        page: 1,
        perPage:itemsPerPage
    })

    const { openModalConfirmation, handleActivate, handleDelete, handleConfirmAction, handleCancelConfirmation, selectedItem, action } = useAction(navigate);

    useEffect(() => {
        fetchData();
    }, [])

    const fetchData = async () => {
        try {
            showLoader()
            const [
                contractOsResponse,
            ] = await Promise.all([
                fetchByContractOsById(entities.contracts.orders.getByColumn(id, contractOsId)),
            ])

            const [
                osStatusResponse,
                osDepartamentResponse,
                osDestinationResponse,
                userResponse,
            ] = await Promise.all([
                fetchOsStatusById(entities.orders.status.getByColumn(null, contractOsResponse.result.status_id)),
                fetchOsDepartamentById(entities.orders.departaments.getByColumn(null, contractOsResponse.result.departament_id)),
                fetchOsDestinationById(entities.orders.destinations.getByColumn(null, contractOsResponse.result.destination_id)),
                fetchUserById(entities.users.getByColumn(contractOsResponse.result.user_id)),
            ]);

            setFormData({
                status: osStatusResponse.result.name,
                departament: osDepartamentResponse.result.name,
                destination: osDestinationResponse.result.name,
                deadline: contractOsResponse.result.deadline.split(" ")[0],
                details: contractOsResponse.result.details,
                user: userResponse.result.name
            });

            fetchOsItensDatas();
        } catch (error) {
            console.log(error)
            showNotification('error', 'error ao carregar os dados')
        } finally {
            hideLoader()
        }
    }

    const fetchOsItensDatas = async () => {
        try {
            showLoader();
            const [
                osItensResponse,
                osItensTypesResponse,
                productsResponse
            ] = await Promise.all([
                fetchOsItens(entities.contracts.orders.items(id).get(contractOsId), filters),
                fetchMovementsTypes(entities.movements.types.get()),
                fetchProducts(entities.products.get)
            ]);
            const osItensTypesMap = mapsMovementsTypes(osItensTypesResponse.result.data);
            const productsMap = mapsProduct(productsResponse.result.data);
            const filteredOsItens = transformOsItens(osItensResponse.result.data, osItensTypesMap, productsMap);
            setOsItens(filteredOsItens);
            setCurrentPage(osItensResponse.result.current_page);
            setTotalPages(osItensResponse.result.last_page);
        } catch (error) {
            console.log(error);
            showNotification('error', 'error ao carregar os dados');
        } finally {
            hideLoader();
        }
    }

    const mapsMovementsTypes = useCallback((movementsTypes) => {
        return Object.fromEntries(movementsTypes.map((movementType) => [movementType.id, movementType.name]));
    }, []);

    const mapsProduct = useCallback((products) => {
        return Object.fromEntries(products.map((product) => [product.id, product.name]));
    }, []);

    const transformOsItens = useCallback((osItensData, movementsTypesMap, productsMap) => {
        return osItensData.map((osItem) => ({
            id: osItem.id,
            movementsTypes: movementsTypesMap[osItem.movement_type_id] || "N/A",
            product: productsMap[osItem.product_id] || "N/A",
            quantity: osItem.quantity,
            deleted_at: osItem.deleted_at ? 'deleted-' + osItem.deleted_at : 'deleted-null'
        }));
    }, []);

    const osItensHeaders = [
        'Id',
        'Tipo de Movimento',
        'Produto',
        'Quantidade'
    ];

    const actions = useMemo(() => [
        {
            id:'details',
            icon: faEye,
            title: "Ver Detalhes",
            buttonClass: "btn-info",
            permission: "Ver contratos",
            onClick: (osItem) => navigate(`/contratos/${id}/ordens-servicos/detalhes/${contractOsId}/itens/detalhes/${osItem.id}`),
        },
        {
            id:'edit',
            icon: faEdit,
            title: 'Editar',
            buttonClass: 'btn-primary',
            permission: 'Atualizar contratos',
            onClick: (osItem) => navigate(`/contratos/${id}/ordens-servicos/detalhes/${contractOsId}/itens/editar/${osItem.id}`)
        },
        {
            id: 'delete',
            icon: faTrash,
            title: 'Excluir',
            buttonClass: 'btn-danger',
            permission: 'Excluir contratos',
            onClick: (osItem) => handleDelete(osItem, 'Você tem certeza que deseja excluir: ', entities.contracts.orders.items(id).delete(contractOsId, osItem.id), fetchData)
        },
        {
            id: 'activate',
            icon: faUndo,
            title: 'Ativar',
            buttonClass: 'btn-info',
            permission: 'Atualizar contratos',
            onClick: (osItem) => handleActivate(osItem, 'Você tem certeza que deseja ativar: ', fetchData)
        },
    ], []);

    return (
        <MainLayout selectedCompany="ALUCOM">
            <PageHeader title="Detalhes de Ordem de Serviço" showBackButton={true} backUrl={`/contratos/${id}/ordens-servicos/`} />
            <div className="container-fluid p-1">
                <DetailsSectionRenderer sections={DetailsOrderServiceFields} formData={formData}/>

                <ListHeader 
                    title="Itens da Ordem de Serviço" 
                    buttonText="Adicionar Item" 
                    buttonLink={`/contratos/${id}/ordens-servicos/detalhes/${contractOsId}/itens/criar`}
                    canAccess={canAccess} 
                    permission="Criar ordens de serviço"
                />

                <DynamicTable
                    headers={osItensHeaders}
                    data={osItens}
                    actions={actions}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={fetchOsItensDatas}
                    filters={filters}
                    setFilters={setFilters}
                />
            </div>

            <ConfirmationModal
                open={openModalConfirmation}
                onClose={handleCancelConfirmation}
                onConfirm={handleConfirmAction}
                itemName={selectedItem ? `${selectedItem.id} - ${selectedItem.osItemType}` : ''}
                text={action.text}
            />
        </MainLayout>
    );
};

export default DetailsContractOsPage;

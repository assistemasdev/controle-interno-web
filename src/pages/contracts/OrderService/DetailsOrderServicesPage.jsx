import React, { useCallback, useEffect, useState, useMemo } from 'react';
import MainLayout from '../../../layouts/MainLayout';
import { useNavigate, useParams } from 'react-router-dom';
import '../../../assets/styles/custom-styles.css';
import useForm from '../../../hooks/useForm';
import { DetailsOrderServiceGlobalFields } from '../../../constants/forms/orderServiceFields';
import { setDefaultFieldValues } from '../../../utils/objectUtils';
import useBaseService from '../../../hooks/services/useBaseService';
import { entities } from '../../../constants/entities';
import useLoader from '../../../hooks/useLoader';
import useNotification from '../../../hooks/useNotification';
import DetailsSectionRenderer from '../../../components/DetailsSectionRenderer';
import { faEdit, faTrash, faEye, faUndo } from '@fortawesome/free-solid-svg-icons';
import DynamicTable from '../../../components/DynamicTable';
import { PAGINATION } from '../../../constants/pagination';
import ConfirmationModal from '../../../components/modals/ConfirmationModal';
import PageHeader from '../../../components/PageHeader';
import useAction from '../../../hooks/useAction';

const DetailsOrderServicesPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { showLoader, hideLoader } = useLoader();
    const { showNotification } = useNotification();
    const { 
        getByColumn: fetchByOsById,
        getByColumn: fetchOsStatusById,
        getByColumn: fetchOsDepartamentById,
        getByColumn: fetchOsDestinationById,
        getByColumn: fetchUserById,
        get: fetchOsItens,
        get: fetchOsItensTypes,
        get: fetchProducts,
    } = useBaseService(navigate);
    const { formData,  setFormData } = useForm(setDefaultFieldValues(DetailsOrderServiceGlobalFields));
    const [osItens, setOsItens] = useState([]);
    const [currentPage, setCurrentPage] = useState(PAGINATION.DEFAULT_PAGE);
    const [itemsPerPage, setItemsPerPage] = useState(PAGINATION.DEFAULT_PER_PAGE);
    const [totalPages, setTotalPages] = useState(PAGINATION.DEFAULT_TOTAL_PAGES);
    const [contractId, setContractId] = useState();
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
                osResponse,
            ] = await Promise.all([
                fetchByOsById(entities.orders.getByColumn(id)),
            ])

            const [
                osStatusResponse,
                osDepartamentResponse,
                osDestinationResponse,
                userResponse,
            ] = await Promise.all([
                fetchOsStatusById(entities.orders.status.getByColumn(null, osResponse.result.status_id)),
                fetchOsDepartamentById(entities.orders.departaments.getByColumn(null, osResponse.result.departament_id)),
                fetchOsDestinationById(entities.orders.destinations.getByColumn(null, osResponse.result.destination_id)),
                fetchUserById(entities.users.getByColumn(osResponse.result.user_id)),
            ]);

            setContractId(osResponse.result.contract_id);
            setFormData({
                contract: osResponse.result.contract_id,
                status: osStatusResponse.result.name,
                departament: osDepartamentResponse.result.name,
                destination: osDestinationResponse.result.name,
                deadline: osResponse.result.deadline.split(" ")[0],
                details: osResponse.result.details,
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
                fetchOsItens(entities.orders.items.get(id), filters),
                fetchOsItensTypes(entities.orders.itemsTypes.get()),
                fetchProducts(entities.products.get)
            ]);
            const osItensTypesMap = mapsItensTypes(osItensTypesResponse.result.data);
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

    const mapsItensTypes = useCallback((osItensTypes) => {
        return Object.fromEntries(osItensTypes.map((osItemType) => [osItemType.id, osItemType.name]));
    }, []);

    const mapsProduct = useCallback((products) => {
        return Object.fromEntries(products.map((product) => [product.id, product.name]));
    }, []);

    const transformOsItens = useCallback((osItensData, osItensTypesMap, productsMap) => {
        return osItensData.map((osItem) => ({
            id: osItem.id,
            osItemType: osItensTypesMap[osItem.service_order_item_type_id] || "N/A",
            product: productsMap[osItem.product_id] || "N/A",
            quantity: osItem.quantity,
            deleted_at: osItem.deleted_at ? 'deleted-' + osItem.deleted_at : 'deleted-null'
        }));
    }, []);

    const osItensHeaders = [
        'Id',
        'Tipo de Item de OS',
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
            onClick: (osItem) => navigate(`/ordens-servicos/${id}/detalhes/itens/${osItem.id}`),
        },
        {
            id:'edit',
            icon: faEdit,
            title: 'Editar',
            buttonClass: 'btn-primary',
            permission: 'Atualizar contratos',
            onClick: (osItem) => navigate(`/contratos/${contractId}/ordens-servicos/detalhes/${id}/itens/editar/${osItem.id}`)
        },
        {
            id: 'delete',
            icon: faTrash,
            title: 'Excluir',
            buttonClass: 'btn-danger',
            permission: 'Excluir contratos',
            onClick: (osItem) => handleDelete(osItem, 'Você tem certeza que deseja excluir: ', entities.orders.items.delete(id, osItem.id), fetchData)
        },
        {
            id: 'activate',
            icon: faUndo,
            title: 'Ativar',
            buttonClass: 'btn-info',
            permission: 'Atualizar contratos',
            onClick: (osItem) => handleActivate(osItem, 'Você tem certeza que deseja ativar: ', fetchData)
        },
    ], [contractId]);

    return (
        <MainLayout selectedCompany="ALUCOM">
            <PageHeader title="Detalhes de Ordem de Serviço" showBackButton={true} backUrl={`/ordens-servicos/`} />
            <div className="container-fluid p-1">
                <DetailsSectionRenderer sections={DetailsOrderServiceGlobalFields} formData={formData}/>

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

export default DetailsOrderServicesPage;

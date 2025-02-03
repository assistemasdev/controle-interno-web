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
import Button from '../../../../components/Button';
import { usePermissions } from '../../../../hooks/usePermissions';
import { faEdit, faTrash, faEye, faUndo } from '@fortawesome/free-solid-svg-icons';
import DynamicTable from '../../../../components/DynamicTable';
import { PAGINATION } from '../../../../constants/pagination';
import ConfirmationModal from '../../../../components/modals/ConfirmationModal';

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
        get: fetchOsItensTypes,
        get: fetchProducts,
        del: remove
    } = useBaseService(navigate);
    const { formData, handleChange, resetForm, formatData, setFormData } = useForm(setDefaultFieldValues(DetailsOrderServiceFields));
    const [osItens, setOsItens] = useState([]);
    const [currentPage, setCurrentPage] = useState(PAGINATION.DEFAULT_PAGE);
    const [itemsPerPage, setItemsPerPage] = useState(PAGINATION.DEFAULT_PER_PAGE);
    const [totalPages, setTotalPages] = useState(PAGINATION.DEFAULT_TOTAL_PAGES);
    const [filters, setFilters] = useState({
        deleted_at: false,
        page: 1,
        perPage:itemsPerPage
    })
    const [action, setAction] = useState({
        action: '',
        text: '',
    });
    const [selectedOsItem, setSelectedOsItem] = useState(null);  
    const [openModalConfirmation, setOpenModalConfirmation] = useState(false);  

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

    const handleViewDetails = (osItem) => {
        navigate(`/contratos/${id}/ordens-servicos/detalhes/${contractOsId}/itens/detalhes/${osItem.id}`);
    };

    const handleEdit = (osItem) => {
        navigate(`/contratos/${id}/ordens-servicos/detalhes/${contractOsId}/itens/editar/${osItem.id}`);
    };

    const handleActivate = (osItem, action) => {
        setSelectedOsItem(osItem); 
        setAction({
            action,
            text:'Você tem certeza que deseja ativar: '
        })
        setOpenModalConfirmation(true);  
    };

    const handleDelete = (osItem, action) => {
        setSelectedOsItem(osItem);  
        setAction({
            action,
            text:'Você tem certeza que deseja excluir: '
        })
        setOpenModalConfirmation(true);  
    };
    
    const handleConfirmDelete = async (osItemId) => {
        try {
            showLoader();
            await remove(entities.contracts.orders.items(id).delete(contractOsId, osItemId));
            setOpenModalConfirmation(false);  
            fetchOsItensDatas();
        } catch (error) {
            console.log(error);
            setOpenModalConfirmation(false);  
        } finally {
            hideLoader();
        }    
    };

    const handleCancelConfirmation = () => {
        setOpenModalConfirmation(false);  
    };

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
            onClick: handleViewDetails,
        },
        {
            id:'edit',
            icon: faEdit,
            title: 'Editar Contratos',
            buttonClass: 'btn-primary',
            permission: 'Atualizar contratos',
            onClick: handleEdit
        },
        {
            id: 'delete',
            icon: faTrash,
            title: 'Excluir Tipo',
            buttonClass: 'btn-danger',
            permission: 'Excluir contratos',
            onClick: handleDelete
        },
        {
            id: 'activate',
            icon: faUndo,
            title: 'Ativar usuário',
            buttonClass: 'btn-info',
            permission: 'Atualizar contratos',
            onClick: handleActivate,
        },
    ], []);

    const handleBack = useCallback(() => {
        navigate(`/contratos/${id}/ordens-servicos/`);
    }, [navigate]);

    return (
        <MainLayout selectedCompany="ALUCOM">
            <div className="container-fluid p-1">
                <div className="text-xs font-weight-bold text-primary text-uppercase mb-1 text-dark">
                    Detalhes de Ordem de Serviço
                </div>

                <DetailsSectionRenderer sections={DetailsOrderServiceFields} formData={formData}/>

                <div className='form-row d-flex justify-content-between align-items-center mt-1'>
                    <h5 className='text-dark font-weight-bold mt-3'>Itens da Ordem de Serviço</h5>
                    {canAccess('') && (
                        <Button
                            text="Adicionar Item"
                            className="btn btn-blue-light fw-semibold"
                            link={`/contratos/${id}/ordens-servicos/detalhes/${contractOsId}/itens/criar`}
                        />
                    )}
                </div>
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
                onConfirm={() => action.action == 'delete'? handleConfirmDelete(selectedOsItem.id) : console.log('oi')}
                itemName={selectedOsItem ? `${selectedOsItem.id} - ${selectedOsItem.osItemType}` : ''}
                text={action.text}
            />
        </MainLayout>
    );
};

export default DetailsContractOsPage;

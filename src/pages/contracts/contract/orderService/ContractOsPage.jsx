import React, { useState, useEffect, useCallback, useMemo } from "react";
import MainLayout from "../../../../layouts/MainLayout";
import Button from "../../../../components/Button";
import { usePermissions } from "../../../../hooks/usePermissions";
import DynamicTable from "../../../../components/DynamicTable";
import { useNavigate, useLocation } from "react-router-dom";
import { faEdit, faTrash, faUndo, faEye } from '@fortawesome/free-solid-svg-icons';
import ConfirmationModal from "../../../../components/modals/ConfirmationModal";
import { PAGINATION } from "../../../../constants/pagination";
import useLoader from "../../../../hooks/useLoader";
import AutoCompleteFilter from "../../../../components/AutoCompleteFilter";
import baseService from "../../../../services/baseService";
import useBaseService from "../../../../hooks/services/useBaseService";
import { buildFilteredArray } from "../../../../utils/arrayUtils";
import { entities } from "../../../../constants/entities";
import { useParams } from "react-router-dom";

const ContractOsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { canAccess } = usePermissions();
    const { 
        get: fetchAll, 
        get: fetchContracts,
        get: fetchOsStatus,
        del: remove 
    } = useBaseService(navigate);
    const { showLoader, hideLoader } = useLoader();
    const [selectedOrdersServices, setSelectedOrdersServices] = useState([]);
    const [OsStatuses, setOrdersServices] = useState([]);
    const location = useLocation();
    const [currentPage, setCurrentPage] = useState(PAGINATION.DEFAULT_PAGE);
    const [itemsPerPage, setItemsPerPage] = useState(PAGINATION.DEFAULT_PER_PAGE);
    const [totalPages, setTotalPages] = useState(PAGINATION.DEFAULT_TOTAL_PAGES);
    const [selectedOrderService, setSelectedOrderService] = useState(null);  
    const [openModalConfirmation, setOpenModalConfirmation] = useState(false);  
    const [filters, setFilters] = useState({
        id: '',
        name: '',
        id: '',
        filledInputs: '',
        deleted_at: false,
        page: 1,
        perPage:itemsPerPage
    })
    const [action, setAction] = useState({
        action: '',
        text: '',
    });

    useEffect(() => {
        if (location.state?.message) {
            const { type, text } = location.state.message;
            setTimeout(() => navigate(location.pathname, { replace: true }), 0); 
        }
    }, [location.state, navigate]);

    const handleClearFilters = useCallback(() => {
        window.location.reload();
    }, []);

    const mapContracts = useCallback((contractsData) => {
        return Object.fromEntries(contractsData.map((contract) => [contract.id, contract.number]));
    }, []);

    const mapStatus = useCallback((statusData) => {
        return Object.fromEntries(statusData.map((status) => [status.id, status.name]));
    }, []);

    const transformOrdersServices = useCallback((ordersServices, contractsMap, statusMap) => {
        return ordersServices.map((orderService) => ({
            id: orderService.id,
            number: contractsMap[orderService.contract_id] || "N/A",
            status: statusMap[orderService.status_id] || "N/A",
            deleted_at: orderService.deleted_at ? 'deleted-' + orderService.deleted_at : 'deleted-null'
        }));
    }, []);

    const loadOrdersServices = useCallback(async (filtersSubmit) => {
        showLoader();
        try {
            const response = await fetchAll(entities.contracts.orders.get(id) ,filtersSubmit || filters);
            const responseContracts = await fetchContracts(entities.contracts.get);
            const responseOsStatus = await fetchOsStatus(entities.orders.status.get());
            const contractsMap = mapContracts(responseContracts.result.data);
            const osStatusMap = mapStatus(responseOsStatus.result.data)
            const filteredOrdersServices = transformOrdersServices(response.result.data, contractsMap, osStatusMap)
            setOrdersServices(filteredOrdersServices);
            setTotalPages(response.result.last_page);
            setCurrentPage(response.result.current_page);
        } finally {
            hideLoader();
        }
    }, [fetchAll, itemsPerPage, showLoader, hideLoader]);

    useEffect(() => {
        loadOrdersServices();
    }, [itemsPerPage]);

    const handleEdit = useCallback((status) => {
        navigate(`/contratos/${id}/ordens-servicos/editar/${status.id}`);
    }, [navigate]);

    const handleFilterSubmit = (e) => {
        e.preventDefault();
    
        const selectedIds = buildFilteredArray(selectedOrdersServices, 'id', 'numberFilter', false);
        const selectedIdLikes = buildFilteredArray(selectedOrdersServices, 'id', 'numberFilter', true);
        const filledInputs = new Set(selectedOrdersServices.map((option) => option.column)).size;
    
        const previousFilters = filters || {}; 
    
        setFilters(prev => ({
            ...prev,
            id: selectedIds,
            idLike: selectedIdLikes,
            filledInputs,
            page: 1,
        }));
    
        loadOrdersServices({
            id: selectedIds,
            idLike: selectedIdLikes,
            filledInputs,
            page: 1,
            deleted_at: previousFilters.deleted_at, 
        });
    };

    const handleViewDetails = (contractOs) => {
        navigate(`/contratos/${id}/ordens-servicos/detalhes/${contractOs.id}`);
    };
    
    const handleChangeCustomers = useCallback((newSelected, column) => {
        setSelectedOrdersServices((prev) => {
            if (!newSelected.length) {
                return prev.filter((option) => option.column !== column);
            }

            const newSelectedArray = Array.isArray(newSelected) ? newSelected : [newSelected];

            const filtered = prev.filter((option) => option.column !== column);
            return [...filtered, ...newSelectedArray];
        });
    }, []);

    const handleActivate = (status, action) => {
        setSelectedOrderService(status); 
        setAction({
            action,
            text:'Você tem certeza que deseja ativar: '
        })
        setOpenModalConfirmation(true);  
    };

    const handleDelete = (status, action) => {
        setSelectedOrderService(status);  
        setAction({
            action,
            text:'Você tem certeza que deseja excluir: '
        })
        setOpenModalConfirmation(true);  
    };
    
    const handleConfirmDelete = async (id) => {
        try {
            showLoader();
            await remove(entities.orders.delete(id));
            setOpenModalConfirmation(false);  
            loadOrdersServices();
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

    const headers = useMemo(() => ['id', 'Nº Contrato', 'Cliente'], []);

    const actions = useMemo(() => [
        {
            id:'details',
            icon: faEye,
            title: "Ver Detalhes",
            buttonClass: "btn-info",
            permission: "Ver ordens de serviço",
            onClick: handleViewDetails,
        },
        {
            id:'edit',
            icon: faEdit,
            title: 'Editar Cargos',
            buttonClass: 'btn-primary',
            permission: 'Atualizar ordens de serviço',
            onClick: handleEdit
        },
        {
            id: 'delete',
            icon: faTrash,
            title: 'Excluir Tipo',
            buttonClass: 'btn-danger',
            permission: 'Excluir ordens de serviço',
            onClick: handleDelete
        },
        {
            id: 'activate',
            icon: faUndo,
            title: 'Ativar usuário',
            buttonClass: 'btn-info',
            permission: 'Atualizar ordens de serviço',
            onClick: handleActivate,
        },
    ], [handleEdit, handleDelete]);

    return (
        <MainLayout selectedCompany="ALUCOM">
            <div className="container-fluid p-1">
                <div className="text-xs font-weight-bold text-primary text-uppercase mb-1 text-dark">
                    Ordens de Serviços do Contrato
                </div>

                <form className="form-row p-3 mt-2 rounded shadow-sm mb-2" style={{ backgroundColor: '#FFFFFF' }} onSubmit={handleFilterSubmit}>
                    <div className="form-group col-md-12">
                        <label htmlFor="name" className="text-dark font-weight-bold mt-1">
                            Número:
                        </label>
                        <AutoCompleteFilter
                            service={baseService}
                            columnDataBase="id"
                            model='serviceOrder'
                            value={selectedOrdersServices.filter((option) => option.column === 'id')}
                            onChange={(selected) => handleChangeCustomers(selected, 'id')}
                            onBlurColumn="numberFilter"
                            placeholder="Filtre as ordem de serviço pelo número"
                            isMulti
                        />
                    </div>
                    <div className="form-group gap-2">
                        <Button type="submit" text="Filtrar" className="btn btn-blue-light fw-semibold m-1" />
                        <Button type="button" text="Limpar Filtros" className="btn btn-blue-light fw-semibold m-1" onClick={handleClearFilters} />
                    </div>
                </form>

                <div className="form-row mt-4 d-flex justify-content-between align-items-center">
                    <div className="font-weight-bold text-primary text-uppercase mb-1 text-dark d-flex">
                        Lista de Ordens de Serviços do Contrato
                    </div>
                    {canAccess('Criar ordens de serviço') && (
                        <Button
                            text="Nova Ordem de Serviço"
                            className="btn btn-blue-light fw-semibold"
                            link={`/contratos/${id}/ordens-servicos/criar`}
                        />
                    )}
                </div>

                <DynamicTable
                    headers={headers}
                    data={OsStatuses}
                    actions={actions}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={loadOrdersServices}
                    filters={filters}
                    setFilters={setFilters}
                />

                <ConfirmationModal
                    open={openModalConfirmation}
                    onClose={handleCancelConfirmation}
                    onConfirm={() => action.action == 'delete'? handleConfirmDelete(selectedOrderService.id) : console.log('oi')}
                    itemName={selectedOrderService ? selectedOrderService.name : ''}
                    text={action.text}
                />
            </div>
        </MainLayout>
    );
};

export default ContractOsPage
import React, { useState, useEffect, useCallback, useMemo } from "react";
import MainLayout from "../../../layouts/MainLayout";
import Button from "../../../components/Button";
import { usePermissions } from "../../../hooks/usePermissions";
import DynamicTable from "../../../components/DynamicTable";
import { useNavigate, useLocation } from "react-router-dom";
import { faEdit, faTrash, faEye, faUndo, faCalendarPlus } from '@fortawesome/free-solid-svg-icons';
import ConfirmationModal from "../../../components/modals/ConfirmationModal";
import { PAGINATION } from "../../../constants/pagination";
import useLoader from "../../../hooks/useLoader";
import AutoCompleteFilter from "../../../components/AutoCompleteFilter";
import baseService from "../../../services/baseService";
import useBaseService from "../../../hooks/services/useBaseService";
import { entities } from "../../../constants/entities";
import { buildFilteredArray } from "../../../utils/arrayUtils";

const ContractPage = () => {
    const navigate = useNavigate();
    const { canAccess } = usePermissions();
    const { fetchAll, remove } = useBaseService(entities.contracts, navigate);
    const { fetchAll: fetchAllCustomers } = useBaseService(entities.customers, navigate);
    const { showLoader, hideLoader } = useLoader();
    const [selectedContracts, setSelectedContracts] = useState([]);
    const [contracts, setContracts] = useState([]);
    const location = useLocation();
    const [currentPage, setCurrentPage] = useState(PAGINATION.DEFAULT_PAGE);
    const [itemsPerPage, setItemsPerPage] = useState(PAGINATION.DEFAULT_PER_PAGE);
    const [totalPages, setTotalPages] = useState(PAGINATION.DEFAULT_TOTAL_PAGES);
    const [selectedContract, setSelectedContract] = useState(null);  
    const [openModalConfirmation, setOpenModalConfirmation] = useState(false);  
    const [filters, setFilters] = useState({
        id: '',
        number: '',
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

    const mapCustomers = useCallback((customers) => {
        return Object.fromEntries(customers.map((customer) => [customer.id, customer.name]));
    }, []);

    const transformContracts = useCallback((contractsData, customersMap) => {
        return contractsData.map((contract) => ({
            id: contract.id,
            number: contract.number,
            customer: customersMap[contract.customer_id] || "N/A",
            deleted_at: contract.deleted_at ? 'deleted-' + contract.deleted_at : 'deleted-null'

        }));
    }, []);

    const loadContracts = useCallback(async (filtersSubmit) => {
        showLoader();
        try {
            const response = await fetchAll(filtersSubmit || filters);
            const customersReponse = await fetchAllCustomers();

            const customersMap = mapCustomers(customersReponse.result.data);
            const filteredContracts = transformContracts(response.result.data, customersMap)
            setContracts(filteredContracts);
            setTotalPages(response.result.last_page);
            setCurrentPage(response.result.current_page);
        } finally {
            hideLoader();
        }
    }, [fetchAll, itemsPerPage, showLoader, hideLoader]);

    useEffect(() => {
        loadContracts();
    }, [itemsPerPage]);

    const handleEdit = useCallback((type) => {
        navigate(`/contratos/editar/${type.id}`);
    }, [navigate]);

    const handleFilterSubmit = (e) => {
        e.preventDefault();
    
        const selectedIds = buildFilteredArray(selectedContracts, 'id', 'numberFilter', false);
        const selectedNumbers = buildFilteredArray(selectedContracts, 'number', 'numberFilter', true);
        const selectedIdLikes = buildFilteredArray(selectedContracts, 'id', 'numberFilter', true);
        const filledInputs = new Set(selectedContracts.map((option) => option.column)).size;
        const previousFilters = filters || {}; 

        setFilters(prev => ({
            ...prev,
            id: selectedIds,
            number: selectedNumbers,
            idLike: selectedIdLikes,
            filledInputs,
            page: 1,
        }));
    
        loadContracts({
            id: selectedIds,
            number: selectedNumbers,
            idLike: selectedIdLikes,
            filledInputs,
            page: 1,
            deleted_at: previousFilters.deleted_at, 
        });
    };
    
    const handleChangeCustomers = useCallback((newSelected, column) => {
        setSelectedContracts((prev) => {
            if (!newSelected.length) {
                return prev.filter((option) => option.column !== column);
            }

            const newSelectedArray = Array.isArray(newSelected) ? newSelected : [newSelected];

            const filtered = prev.filter((option) => option.column !== column);
            return [...filtered, ...newSelectedArray];
        });
    }, []);

    const handleActivate = (type, action) => {
        setSelectedContract(type); 
        setAction({
            action,
            text:'Você tem certeza que deseja ativar: '
        })
        setOpenModalConfirmation(true);  
    };

    const handleDelete = (type, action) => {
        setSelectedContract(type);  
        setAction({
            action,
            text:'Você tem certeza que deseja excluir: '
        })
        setOpenModalConfirmation(true);  
    };
    
    const handleConfirmDelete = async (id) => {
        try {
            showLoader();
            await remove(id);
            setOpenModalConfirmation(false);  
            loadContracts();
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

    const handleViewDetails = (contract) => {
        navigate(`/contratos/detalhes/${contract.id}`);
    };

    const handleAddEvent = (contract) => {
        navigate(`/contratos/${contract.id}/evento/adicionar`)
    };

    const headers = useMemo(() => ['Id', 'Número', 'Cliente'], []);

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
            id: 'add-event',
            icon: faCalendarPlus,
            title: 'Adicionar Evento',
            buttonClass: 'btn-success',
            permission: 'Adicionar eventos',
            onClick: handleAddEvent,
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
    ], [handleEdit, handleDelete]);

    return (
        <MainLayout selectedCompany="ALUCOM">
            <div className="container-fluid p-1">
                <div className="text-xs font-weight-bold text-primary text-uppercase mb-1 text-dark">
                    Contratos
                </div>

                <form className="form-row p-3 mt-2 rounded shadow-sm mb-2" style={{ backgroundColor: '#FFFFFF' }} onSubmit={handleFilterSubmit}>
                    <div className="form-group col-md-6">
                        <label htmlFor="name" className="text-dark font-weight-bold mt-1">
                            Id:
                        </label>
                        <AutoCompleteFilter
                            service={baseService}
                            columnDataBase="id"
                            model='contract'
                            value={selectedContracts.filter((option) => option.column === 'id')}
                            onChange={(selected) => handleChangeCustomers(selected, 'id')}
                            onBlurColumn="numberFilter"
                            placeholder="Filtre os contratos pelo id"
                            isMulti
                        />
                    </div>
                    <div className="form-group col-md-6">
                        <label htmlFor="name" className="text-dark font-weight-bold mt-1">
                            Número:
                        </label>
                        <AutoCompleteFilter
                            service={baseService}
                            columnDataBase="number"
                            model='contract'
                            value={selectedContracts.filter((option) => option.column === 'number')}
                            onChange={(selected) => handleChangeCustomers(selected, 'number')}
                            onBlurColumn="numberFilter"
                            placeholder="Filtre os contratos pelo número"
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
                        Lista de Contratos
                    </div>
                    {canAccess('Criar contratos') && (
                        <Button
                            text="Novo Contrato"
                            className="btn btn-blue-light fw-semibold"
                            link="/contratos/criar"
                        />
                    )}
                </div>

                <DynamicTable
                    headers={headers}
                    data={contracts}
                    actions={actions}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={loadContracts}
                    filters={filters}
                    setFilters={setFilters}
                />

                <ConfirmationModal
                    open={openModalConfirmation}
                    onClose={handleCancelConfirmation}
                    onConfirm={() => action.action == 'delete'? handleConfirmDelete(selectedContract.id) : console.log('oi')}
                    itemName={selectedContract ? `${selectedContract.number} - ${selectedContract.customer}` : ''}
                    text={action.text}
                />
            </div>
        </MainLayout>
    );
};

export default ContractPage
import React, { useState, useEffect, useCallback, useMemo } from "react";
import MainLayout from "../../layouts/MainLayout";
import Button from "../../components/Button";
import { usePermissions } from "../../hooks/usePermissions";
import DynamicTable from "../../components/DynamicTable";
import { useNavigate, useLocation } from "react-router-dom";
import { faEdit, faTrash, faEye, faUndo } from '@fortawesome/free-solid-svg-icons';
import { maskCpf, maskCnpj } from "../../utils/maskUtils";
import ConfirmationModal from "../../components/modals/ConfirmationModal";
import { PAGINATION } from "../../constants/pagination";
import AutoCompleteFilter from "../../components/AutoCompleteFilter";
import useLoader from "../../hooks/useLoader";
import useNotification from "../../hooks/useNotification";
import baseService from "../../services/baseService";
import useBaseService from "../../hooks/services/useBaseService";
import { entities } from "../../constants/entities";
import { buildFilteredArray } from "../../utils/arrayUtils";

const CostumerPage = () => {
    const { canAccess } = usePermissions();
    const [customers, setCustomers] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();
    const [selectedCustomers, setSelectedCustomers] = useState([]);
    const [currentPage, setCurrentPage] = useState(PAGINATION.DEFAULT_PAGE);
    const [itemsPerPage, setItemsPerPage] = useState(PAGINATION.DEFAULT_PER_PAGE);
    const [totalPages, setTotalPages] = useState(PAGINATION.DEFAULT_TOTAL_PAGES);
    const { showLoader, hideLoader } = useLoader();
    const { showNotification } = useNotification();
    const { get: fetchAll, del: remove } = useBaseService(navigate);
    const [selectedCustomer, setSelectedCustomer] = useState(null);  
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
            showNotification(location.state.type, location.state.message);
            navigate(location.pathname, { replace: true });
        }
    }, [location.state, showNotification, navigate]); 

    const handleClearFilters = useCallback(() => {
        window.location.reload();
    }, []);

    const fetchCustomers = useCallback(async (filtersSubmit) => {
        showLoader();
        try {
            const response = await fetchAll(entities.customers.get, filtersSubmit || filters);
            const filteredCustomers = response.result.data.map(customer => {
                const numericValue = customer.cpf_cnpj.replace(/\D/g, '');

                return {
                    id: customer.id,
                    alias: customer.alias,
                    name: customer.name,
                    cpf_cnpj: numericValue.length <= 11 ? maskCpf(numericValue) : maskCnpj(numericValue),
                    deleted_at: customer.deleted_at ? 'deleted-' + customer.deleted_at : 'deleted-null'
                };
            });

            setCustomers(filteredCustomers);
            setTotalPages(response.result.last_page);
            setCurrentPage(response.result.current_page);
        } catch (error) {
            console.error("Erro capturado no fetchCustomers:", error);
        } finally {
            hideLoader();
        }
    }, [fetchAll, itemsPerPage, showLoader, hideLoader, showNotification]);

    useEffect(() => {
        fetchCustomers();
    }, []);

    const handleFilterSubmit = useCallback((e) => {
        e.preventDefault();
    
        const selectedCustIds = buildFilteredArray(selectedCustomers, 'id', 'numberFilter', false);
        const selectedNames = buildFilteredArray(selectedCustomers, 'name', 'textFilter', false);
        const selectedIdLikes = buildFilteredArray(selectedCustomers, 'id', 'textFilter', true);
        const filledInputs = new Set(selectedCustomers.map((option) => option.column)).size;
    
        const previousFilters = filters || {}; 
    
        setFilters(prev => ({
            ...prev,
            id: selectedCustIds,
            name: selectedNames,
            idLike: selectedIdLikes,
            filledInputs,
            page: 1
        }));
    
        fetchCustomers({
            id: selectedCustIds,
            name: selectedNames,
            idLike: selectedIdLikes,
            filledInputs,
            page: 1,
            deleted_at: previousFilters.deleted_at
        });
    }, [selectedCustomers, fetchCustomers, setFilters]);
    

    const handleChangeCustomers = useCallback((newSelected, column) => {
        setSelectedCustomers((prev) => {
            if (!newSelected.length) {
                return prev.filter((option) => option.column !== column);
            }

            const newSelectedArray = Array.isArray(newSelected) ? newSelected : [newSelected];

            const filtered = prev.filter((option) => option.column !== column);
            return [...filtered, ...newSelectedArray];
        });
    }, []);

    const handleEdit = useCallback((customer) => {
        navigate(`/clientes/editar/${customer.id}`);
    }, [navigate]);

    
    const handleViewDetails = useCallback((customer) => {
        navigate(`/clientes/detalhes/${customer.id}`);
    }, [navigate]);
    
    const handleActivate = (customer, action) => {
        setSelectedCustomer(customer); 
        setAction({
            action,
            text:'Você tem certeza que deseja ativar: '
        })
        setOpenModalConfirmation(true);  
    };
    
    const handleDelete = (customer, action) => {
        setSelectedCustomer(customer);  
        setAction({
            action,
            text:'Você tem certeza que deseja excluir: '
        })
        setOpenModalConfirmation(true);  
    };
    
    const handleConfirmDelete = async (id) => {
        try {
            showLoader();
            await remove(entities.customers.delete(id));
            setOpenModalConfirmation(false);  
            fetchCustomers();
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

    const headers = useMemo(() => ['id', 'Apelido', 'Nome', 'CPF/CPNPJ'], []);

    const actions = useMemo(() => [
        {
            id: 'edit',
            icon: faEdit,
            title: 'Editar Fornecedor',
            buttonClass: 'btn-primary',
            permission: 'Atualizar clientes',
            onClick: handleEdit
        },
        {
            id: 'details',
            icon: faEye,
            title: 'Ver Detalhes',
            buttonClass: 'btn-info',
            permission: 'Ver clientes',
            onClick: handleViewDetails
        },
        {
            id: 'delete',
            icon: faTrash,
            title: 'Excluir Fornecedor',
            buttonClass: 'btn-danger',
            permission: 'Excluir clientes',
            onClick: handleDelete
        },
        ,
        {
            id: 'activate',
            icon: faUndo,
            title: 'Ativar usuário',
            buttonClass: 'btn-info',
            permission: 'Atualizar clientes',
            onClick: handleActivate,
        },
    ], [handleEdit, handleDelete, handleViewDetails]);

    return (
        <MainLayout selectedCompany="ALUCOM">
            <div className="container-fluid p-1">
                <div className="text-xs font-weight-bold text-primary text-uppercase mb-1 text-dark">
                    Clientes
                </div>

                <form className="form-row p-3 mt-2 rounded shadow-sm mb-2" style={{ backgroundColor: '#FFFFFF' }} onSubmit={handleFilterSubmit}>
                    <div className="form-group col-md-6">
                        <label htmlFor="name" className='text-dark font-weight-bold mt-1'>Número:</label>
                        <AutoCompleteFilter
                            value={selectedCustomers.filter((option) => option.column === 'id')}
                            service={baseService}
                            model="customer"
                            columnDataBase="id"
                            isMulti={true}
                            onChange={(newSelected) => handleChangeCustomers(newSelected, "id")}
                            onBlurColumn='numberFilter'
                            placeholder="Filtre os usuários pelo número"
                        />
                    </div>
                    <div className="form-group col-md-6">
                        <label htmlFor="name" className='text-dark font-weight-bold mt-1'>Nome:</label>
                        <AutoCompleteFilter
                            value={selectedCustomers.filter((option) => option.column === 'name')}
                            service={baseService}
                            model="customer"
                            columnDataBase='name'
                            isMulti={true}
                            onChange={(newSelected) => handleChangeCustomers(newSelected, "name")}
                            onBlurColumn='textFilter'
                            placeholder="Filtre os usuários pelo nome"
                        />
                    </div>
                    <div className="form-group gap-2">
                        <Button type="submit" text="Filtrar" className="btn btn-blue-light fw-semibold m-1" />
                        <Button type="button" text="Limpar filtros" className="btn btn-blue-light fw-semibold m-1" onClick={handleClearFilters} />
                    </div>
                </form>

                <div className="form-row mt-4 d-flex justify-content-between align-items-center">
                    <div className="font-weight-bold text-primary text-uppercase mb-1 text-dark d-flex">
                        Lista de Clientes
                    </div>
                    {canAccess('Criar clientes') && (
                        <Button
                            text="Novo Cliente"
                            className="btn btn-blue-light fw-semibold"
                            link="/clientes/criar"
                        />
                    )}
                </div>

                <DynamicTable 
                    headers={headers} 
                    data={customers} 
                    actions={actions} 
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={fetchCustomers}
                    filters={filters}
                    setFilters={setFilters}
                />

            </div>
            <ConfirmationModal
                    open={openModalConfirmation}
                    onClose={handleCancelConfirmation}
                    onConfirm={() => action.action == 'delete'? handleConfirmDelete(selectedCustomer.id) : console.log('oi')}
                    itemName={selectedCustomer ? selectedCustomer.name : ''}
                    text={action.text}
                />
        </MainLayout>
    );
};

export default CostumerPage;

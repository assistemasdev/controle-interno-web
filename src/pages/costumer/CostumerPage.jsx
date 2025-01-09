import React, { useState, useEffect, useCallback, useMemo } from "react";
import MainLayout from "../../layouts/MainLayout";
import Button from "../../components/Button";
import { usePermissions } from "../../hooks/usePermissions";
import DynamicTable from "../../components/DynamicTable";
import { useNavigate, useLocation } from "react-router-dom";
import { faEdit, faTrash, faEye } from '@fortawesome/free-solid-svg-icons';
import { maskCpf, maskCnpj } from "../../utils/maskUtils";
import ConfirmationModal from "../../components/modals/ConfirmationModal";
import { PAGINATION } from "../../constants/pagination";
import AutoCompleteFilter from "../../components/AutoCompleteFilter";
import useLoader from "../../hooks/useLoader";
import useNotification from "../../hooks/useNotification";
import useCustomerService from "../../hooks/useCustomerService";

const CostumerPage = () => {
    const { canAccess } = usePermissions();
    const [customers, setCustomers] = useState([]);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [customerToDelete, setCustomerToDelete] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();
    const [selectedCustomers, setSelectedCustomers] = useState([]);
    const [currentPage, setCurrentPage] = useState(PAGINATION.DEFAULT_PAGE);
    const [itemsPerPage, setItemsPerPage] = useState(PAGINATION.DEFAULT_PER_PAGE);
    const [totalPages, setTotalPages] = useState(PAGINATION.DEFAULT_TOTAL_PAGES);
    const { showLoader, hideLoader } = useLoader();
    const { showNotification } = useNotification();
    const { fetchCustomers: getCustomers, deleteCustomer } = useCustomerService(navigate);

    useEffect(() => {
        if (location.state?.message) {
            showNotification(location.state.type, location.state.message);
            navigate(location.pathname, { replace: true });
        }
    }, [location.state, showNotification, navigate]); 

    const handleClearFilters = useCallback(() => {
        window.location.reload();
    }, []);

    const fetchCustomers = useCallback(async (id, name, idLike, filledInputs, page = 1) => {
        showLoader();
        try {
            const result = await getCustomers({ id, name, idLike, filledInputs, page, perPage: itemsPerPage });

            const filteredCustomers = result.data.map(supplier => {
                const numericValue = supplier.cpf_cnpj.replace(/\D/g, '');

                return {
                    id: supplier.id,
                    alias: supplier.alias,
                    name: supplier.name,
                    cpf_cnpj: numericValue.length <= 11 ? maskCpf(numericValue) : maskCnpj(numericValue)
                };
            });

            setCustomers(filteredCustomers);
            setTotalPages(result.last_page);
            setCurrentPage(result.current_page);
        } catch (error) {
            const errorMessage = error.response?.data?.error || error.message || 'Erro ao carregar clientes';
            showNotification('error', errorMessage);
            console.error("Erro capturado no fetchCustomers:", error);
        } finally {
            hideLoader();
        }
    }, [getCustomers, itemsPerPage, showLoader, hideLoader, showNotification]);

    useEffect(() => {
        fetchCustomers();
    }, []);

    const handleFilterSubmit = useCallback((e) => {
        e.preventDefault();

        const filledInputs = new Set(
            selectedCustomers.map((option) => option.column)
        ).size;

        fetchCustomers(
            selectedCustomers.filter((option) => option.textFilter === false || (option.column === 'id' && option.numberFilter === false)).map((item) => item.value),
            selectedCustomers.filter((option) => option.textFilter === true && option.column === 'name').map((item) => item.value),
            selectedCustomers.filter((option) => option.numberFilter === true && option.column === 'id').map((item) => item.value),
            filledInputs
        );
    }, [selectedCustomers, fetchCustomers]);

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

    const handleDelete = useCallback((customer) => {
        setCustomerToDelete(customer);
        setDeleteModalOpen(true);
    }, []);

    const handleViewDetails = useCallback((customer) => {
        navigate(`/clientes/detalhes/${customer.id}`);
    }, [navigate]);

    const confirmDelete = useCallback(async () => {
        showLoader();
        try {
            await deleteCustomer(customerToDelete.id);
            fetchCustomers();
        } catch (error) {
            showNotification('error', 'Erro ao excluir o cliente');
            console.error(error);
        } finally {
            setDeleteModalOpen(false);
            hideLoader();
        }
    }, [deleteCustomer, customerToDelete, fetchCustomers, showNotification, showLoader, hideLoader]);

    const headers = useMemo(() => ['id', 'Apelido', 'Nome', 'CPF/CPNPJ'], []);

    const actions = useMemo(() => [
        {
            icon: faEdit,
            title: 'Editar Fornecedor',
            buttonClass: 'btn-primary',
            permission: 'Atualizar clientes',
            onClick: handleEdit
        },
        {
            icon: faTrash,
            title: 'Excluir Fornecedor',
            buttonClass: 'btn-danger',
            permission: 'Excluir clientes',
            onClick: handleDelete
        },
        {
            icon: faEye,
            title: 'Ver Detalhes',
            buttonClass: 'btn-info',
            permission: 'Ver clientes',
            onClick: handleViewDetails
        }
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
                            service={getCustomers}
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
                            service={getCustomers}
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
                />

            </div>
            <ConfirmationModal
                open={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                itemName={customerToDelete ? customerToDelete.name : ''}
            />
        </MainLayout>
    );
};

export default CostumerPage;

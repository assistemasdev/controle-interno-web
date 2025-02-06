import React, { useState, useEffect, useCallback, useMemo } from "react";
import MainLayout from "../../layouts/MainLayout";
import { usePermissions } from "../../hooks/usePermissions";
import DynamicTable from "../../components/DynamicTable";
import { useNavigate, useLocation } from "react-router-dom";
import { faEdit, faTrash, faEye, faUndo } from '@fortawesome/free-solid-svg-icons';
import { maskCpf, maskCnpj } from "../../utils/maskUtils";
import ConfirmationModal from "../../components/modals/ConfirmationModal";
import { PAGINATION } from "../../constants/pagination";
import useLoader from "../../hooks/useLoader";
import useNotification from "../../hooks/useNotification";
import useBaseService from "../../hooks/services/useBaseService";
import { entities } from "../../constants/entities";
import useApplicationFilters from "../../hooks/filters/useApplicationFilters";  
import useAction from "../../hooks/useAction";  
import FilterForm from "../../components/FilterForm";  
import ListHeader from "../../components/ListHeader";  
import PageHeader from "../../components/PageHeader";  

const CostumerPage = () => {
    const { canAccess } = usePermissions();
    const [customers, setCustomers] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();
    const { showLoader, hideLoader } = useLoader();
    const { showNotification } = useNotification();
    const { get: fetchAll } = useBaseService(navigate);
    const [currentPage, setCurrentPage] = useState(PAGINATION.DEFAULT_PAGE);
    const [totalPages, setTotalPages] = useState(PAGINATION.DEFAULT_TOTAL_PAGES);
    const [filters, setFilters] = useState({ id: '', name: '', filledInputs: '', deleted_at: false, page: currentPage, perPage: totalPages });
    const { openModalConfirmation, action, handleActivate, handleDelete, handleConfirmAction, handleCancelConfirmation, selectedItem } = useAction(navigate); 

    useEffect(() => {
        if (location.state?.message) {
            showNotification(location.state.type, location.state.message);
            navigate(location.pathname, { replace: true });
        }
    }, [location.state, showNotification, navigate]);

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
            setCurrentPage(response.result.current_page);
            setTotalPages(response.result.last_page);
        } catch (error) {
            console.error("Erro ao carregar clientes:", error);
        } finally {
            hideLoader();
        }
    }, [fetchAll, filters, showLoader, hideLoader]);

    const { handleFilterSubmit, handleClearFilters, inputsfilters } = useApplicationFilters(fetchCustomers, filters, setFilters);  

    useEffect(() => {
        fetchCustomers();
    }, []);

    const headers = useMemo(() => ['id', 'Apelido', 'Nome', 'CPF/CNPJ'], []);
    const actions = useMemo(() => [
        {
            id: 'edit',
            icon: faEdit,
            title: 'Editar Cliente',
            buttonClass: 'btn-primary',
            permission: 'Atualizar clientes',
            onClick: (customer) => navigate(`/clientes/editar/${customer.id}`)
        },
        {
            id: 'details',
            icon: faEye,
            title: 'Ver Detalhes',
            buttonClass: 'btn-info',
            permission: 'Ver clientes',
            onClick: (customer) => navigate(`/clientes/detalhes/${customer.id}`)
        },
        {
            id: 'delete',
            icon: faTrash,
            title: 'Excluir Cliente',
            buttonClass: 'btn-danger',
            permission: 'Excluir clientes',
            onClick: (customer) => handleDelete(customer, 'Você tem certeza que deseja excluir: ', entities.customers.delete(customer.id), fetchCustomers),
        },
        {
            id: 'activate',
            icon: faUndo,
            title: 'Ativar Cliente',
            buttonClass: 'btn-info',
            permission: 'Atualizar clientes',
            onClick: (customer) => handleActivate(customer, 'Você tem certeza que deseja ativar: '),
        },
    ], [handleDelete]);

    return (
        <MainLayout selectedCompany="ALUCOM">
            <PageHeader title="Clientes" showBackButton={true} backUrl="/dashboard" />
            <div className="container-fluid p-1">
                <FilterForm autoCompleteFields={inputsfilters} onSubmit={handleFilterSubmit} onClear={handleClearFilters} />
                <ListHeader title="Lista de Clientes" buttonText="Novo Cliente" buttonLink="/clientes/criar" canAccess={canAccess} permission="Criar clientes" />
                <DynamicTable 
                    headers={headers} 
                    data={customers} 
                    actions={actions} 
                    currentPage={filters.page}
                    totalPages={filters.perPage}
                    onPageChange={fetchCustomers}
                    filters={filters}
                    setFilters={setFilters}
                />
                <ConfirmationModal
                    open={openModalConfirmation}
                    onClose={handleCancelConfirmation}
                    onConfirm={handleConfirmAction}
                    itemName={selectedItem ? selectedItem.name : ''}
                    text={action.text}
                />
            </div>
        </MainLayout>
    );
};

export default CostumerPage;

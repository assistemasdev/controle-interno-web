import React, { useEffect, useCallback, useState } from "react";
import MainLayout from "../../layouts/MainLayout";
import Button from "../../components/Button";
import { usePermissions } from "../../hooks/usePermissions";
import DynamicTable from "../../components/DynamicTable";
import { useNavigate } from "react-router-dom";
import { faEdit, faTrash, faEye, faUndo } from '@fortawesome/free-solid-svg-icons';
import ConfirmationModal from "../../components/modals/ConfirmationModal";
import { PAGINATION } from "../../constants/pagination";
import useLoader from "../../hooks/useLoader";
import useNotification from "../../hooks/useNotification";
import { maskCpf, maskCnpj } from "../../utils/maskUtils";
import AutoCompleteFilter from "../../components/AutoCompleteFilter";
import baseService from "../../services/baseService";
import useBaseService from "../../hooks/services/useBaseService";
import { entities } from "../../constants/entities";
import { buildFilteredArray } from "../../utils/arrayUtils";
import PageHeader from "../../components/PageHeader";
import ListHeader from "../../components/ListHeader";
import useAction from "../../hooks/useAction";
import useSupplierFilters from "../../hooks/filters/useSupplierFilters";
import FilterForm from "../../components/FilterForm";

const SuppliersPage = () => {
    const { canAccess } = usePermissions();
    const navigate = useNavigate();
    const { showLoader, hideLoader } = useLoader();
    const { showNotification } = useNotification();
    const { get: fetchAll, del: remove } = useBaseService( navigate);
    const [suppliers, setSuppliers] = useState([]);
    const [selectedSuppliers, setSelectedSuppliers] = useState([]);
    const [currentPage, setCurrentPage] = useState(PAGINATION.DEFAULT_PAGE);
    const [itemsPerPage, setItemsPerPage] = useState(PAGINATION.DEFAULT_PER_PAGE);
    const [totalPages, setTotalPages] = useState(PAGINATION.DEFAULT_TOTAL_PAGES);
    const [filters, setFilters] = useState({
        id: '',
        name: '',
        id: '',
        filledInputs: '',
        deleted_at: false,
        page: 1,
        perPage:itemsPerPage
    })

    const { openModalConfirmation, handleActivate, handleDelete, handleConfirmAction, handleCancelConfirmation, selectedItem, action } = useAction(navigate);


    const fetchSuppliersData = useCallback(async (filtersSubmit) => {
        showLoader();
        try {
            const response = await fetchAll(entities.suppliers.get, filtersSubmit || filters);
            const formattedSuppliers = response.result.data.map(supplier => {
                const numericValue = supplier.cpf_cnpj.replace(/\D/g, '');
                return {
                    id: supplier.id,
                    alias: supplier.alias,
                    name: supplier.name,
                    cpf_cnpj: numericValue.length <= 11 ? maskCpf(numericValue) : maskCnpj(numericValue),
                    deleted_at: supplier.deleted_at ? 'deleted-' + supplier.deleted_at : 'deleted-null'
                };
            });

            setSuppliers(formattedSuppliers);
            setTotalPages(response.result.last_page);
            setCurrentPage(response.result.current_page);
        } catch (error) {
            console.log(error)
            showNotification("error", "Erro ao carregar fornecedores.");
        } finally {
            hideLoader();
        }
    }, [fetchAll, itemsPerPage, showLoader, hideLoader, showNotification]);

    const { handleFilterSubmit, handleClearFilters, inputsfilters } = useSupplierFilters(fetchSuppliersData, filters, setFilters);

    useEffect(() => {
        fetchSuppliersData();
    }, []);

    const headers = ['ID', 'Apelido', 'Nome', 'CPF/CNPJ'];
    const actions = [
        {
            id: 'edit',
            icon: faEdit,
            title: 'Editar',
            buttonClass: 'btn-primary',
            permission: 'Atualizar fornecedores',
            onClick: (supplier) => navigate(`/fornecedores/editar/${supplier.id}`)
        },
        {
            id:'details',
            icon: faEye,
            title: 'Ver Detalhes',
            buttonClass: 'btn-info',
            permission: 'Ver fornecedores',
            onClick: (supplier) => navigate(`/fornecedores/detalhes/${supplier.id}`)
        },
        {
            id:'delete',
            icon: faTrash,
            title: 'Excluir',
            buttonClass: 'btn-danger',
            permission: 'Excluir fornecedores',
            onClick: (supplier) => handleDelete(supplier, 'Você tem certeza que deseja excluir: ', entities.suppliers.delete(supplier.id), fetchSuppliersData)
        },
        {
            id: 'activate',
            icon: faUndo,
            title: 'Ativar',
            buttonClass: 'btn-info',
            permission: 'Atualizar fornecedores',
            onClick: (supplier) => handleActivate(supplier, 'Você tem certeza que deseja ativar: ', fetchSuppliersData)
        },
    ];

    return (
        <MainLayout selectedCompany="ALUCOM">
            <PageHeader title="Fornecedores" showBackButton={true} backUrl="/fornecedores/" /> 
            <div className="container-fluid p-1">
                <FilterForm autoCompleteFields={inputsfilters} onSubmit={handleFilterSubmit} onClear={handleClearFilters} />

                <ListHeader 
                    title="Lista de Fornecedores" 
                    buttonText="Novo Fornecedor" 
                    buttonLink="/fornecedores/criar" 
                    canAccess={canAccess} 
                    permission="Criar fornecedores"
                />

                <DynamicTable
                    headers={headers}
                    data={suppliers}
                    actions={actions}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={fetchSuppliersData}
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

export default SuppliersPage;

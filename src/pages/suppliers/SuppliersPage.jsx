import React, { useEffect, useCallback, useState } from "react";
import MainLayout from "../../layouts/MainLayout";
import Button from "../../components/Button";
import { usePermissions } from "../../hooks/usePermissions";
import DynamicTable from "../../components/DynamicTable";
import { useNavigate } from "react-router-dom";
import { faEdit, faTrash, faEye } from '@fortawesome/free-solid-svg-icons';
import ConfirmationModal from "../../components/modals/ConfirmationModal";
import { PAGINATION } from "../../constants/pagination";
import useLoader from "../../hooks/useLoader";
import useNotification from "../../hooks/useNotification";
import { maskCpf, maskCnpj } from "../../utils/maskUtils";
import useSupplierService from "../../hooks/useSupplierService";
import AutoCompleteFilter from "../../components/AutoCompleteFilter";
import baseService from "../../services/baseService";
import { maskCpfCnpj } from "../../utils/maskUtils";

const SuppliersPage = () => {
    const { canAccess } = usePermissions();
    const navigate = useNavigate();
    const { showLoader, hideLoader } = useLoader();
    const { showNotification } = useNotification();
    const { fetchSuppliers, deleteSupplier } = useSupplierService(navigate);

    const [name, setName] = useState('');
    const [suppliers, setSuppliers] = useState([]);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [supplierToDelete, setSupplierToDelete] = useState(null);
    const [selectedSuppliers, setSelectedSuppliers] = useState([]);
    const [currentPage, setCurrentPage] = useState(PAGINATION.DEFAULT_PAGE);
    const [itemsPerPage, setItemsPerPage] = useState(PAGINATION.DEFAULT_PER_PAGE);
    const [totalPages, setTotalPages] = useState(PAGINATION.DEFAULT_TOTAL_PAGES);

    const fetchSuppliersData = useCallback(async (id, name, filledInputs, page = 1) => {
        showLoader();
        try {
            const response = await fetchSuppliers({ id, name, filledInputs, page, perPage: itemsPerPage, name });
            const formattedSuppliers = response.data.map(supplier => {
                const numericValue = supplier.cpf_cnpj.replace(/\D/g, '');
                return {
                    id: supplier.id,
                    alias: supplier.alias,
                    name: supplier.name,
                    cpf_cnpj: numericValue.length <= 11 ? maskCpf(numericValue) : maskCnpj(numericValue)
                };
            });
            setSuppliers(formattedSuppliers);
            setTotalPages(response.last_page);
            setCurrentPage(response.current_page);
        } catch (error) {
            console.log(error)
            showNotification("error", "Erro ao carregar fornecedores.");
        } finally {
            hideLoader();
        }
    }, [fetchSuppliers, name, itemsPerPage, showLoader, hideLoader, showNotification]);

    useEffect(() => {
        fetchSuppliersData();
    }, []);

    const handleEdit = (supplier) => {
        navigate(`/fornecedores/editar/${supplier.id}`);
    };

    const handleViewDetails = (supplier) => {
        navigate(`/fornecedores/detalhes/${supplier.id}`);
    };

    const handleDelete = (supplier) => {
        setSupplierToDelete(supplier);
        setDeleteModalOpen(true);
    };

    const confirmDelete = useCallback(async () => {
        showLoader();
        try {
            await deleteSupplier(supplierToDelete.id);
            setDeleteModalOpen(false);
            fetchSuppliersData();
        } catch (error) {
            console.log(error)
            showNotification("error", "Erro ao excluir o fornecedor.");
        } finally {
            hideLoader();
        }
    }, [deleteSupplier, supplierToDelete, fetchSuppliersData, showLoader, hideLoader, showNotification]);

    const handleChangeCustomers = useCallback((newSelected, column) => {
        setSelectedSuppliers((prev) => {
            if (!newSelected.length) {
                return prev.filter((option) => option.column !== column);
            }

            const newSelectedArray = Array.isArray(newSelected) ? newSelected : [newSelected];

            const filtered = prev.filter((option) => option.column !== column);
            return [...filtered, ...newSelectedArray];
        });
    }, []);

    const handleClearFilters = () => {
        setName('');
        fetchSuppliersData();
    };

    const handleFilterSubmit = (e) => {
        e.preventDefault();

        const filledInputs = new Set(selectedSuppliers.map((option) => option.column)).size;

        fetchSuppliersData(
            selectedSuppliers.filter((supplier) => !supplier.textFilter).map((supplier) => supplier.value),
            selectedSuppliers.filter((supplier) => supplier.textFilter).map((supplier) => supplier.value),
            filledInputs
        );
    };

    const headers = ['ID', 'Apelido', 'Nome', 'CPF/CNPJ'];
    const actions = [
        {
            icon: faEdit,
            title: 'Editar Fornecedor',
            buttonClass: 'btn-primary',
            permission: 'Atualizar fornecedores',
            onClick: handleEdit
        },
        {
            icon: faTrash,
            title: 'Excluir Fornecedor',
            buttonClass: 'btn-danger',
            permission: 'Excluir fornecedores',
            onClick: handleDelete
        },
        {
            icon: faEye,
            title: 'Ver Detalhes',
            buttonClass: 'btn-info',
            permission: 'Ver fornecedores',
            onClick: handleViewDetails
        }
    ];

    return (
        <MainLayout selectedCompany="ALUCOM">
            <div className="container-fluid p-1">
                <div className="text-xs font-weight-bold text-primary text-uppercase mb-1 text-dark">
                    Fornecedores
                </div>

                <form className="form-row p-3 mt-2 rounded shadow-sm mb-2" style={{ backgroundColor: '#FFFFFF' }} onSubmit={handleFilterSubmit}>
                    <div className="form-group col-md-6">
                        <label htmlFor="name" className="text-dark font-weight-bold mt-1">
                            Nome:
                        </label>
                        <AutoCompleteFilter
                            service={baseService}
                            columnDataBase="name"
                            model='supplier'
                            value={selectedSuppliers.filter((option) => option.column === 'name')}
                            onChange={(selected) => handleChangeCustomers(selected, 'name')}
                            onBlurColumn="textFilter"
                            placeholder="Filtre os fornecedores pelo nome"
                            isMulti
                        />
                    </div>
                    <div className="form-group col-md-6">
                        <label htmlFor="name" className="text-dark font-weight-bold mt-1">
                            CPF/CNPJ:
                        </label>
                        <AutoCompleteFilter
                            service={baseService}
                            columnDataBase="cpf_cnpj"
                            model='supplier'
                            value={selectedSuppliers.filter((option) => option.column === 'cpf_cnpj')}
                            onChange={(selected) => handleChangeCustomers(selected, 'cpf_cnpj')}
                            onBlurColumn="textFilter"
                            placeholder="Filtre os fornecedores pelo cpf/cnpj"
                            isMulti
                        />
                    </div>
                    <div className="form-group gap-2">
                        <Button
                            type="submit"
                            text="Filtrar"
                            className="btn btn-blue-light fw-semibold m-1"
                        />
                        <Button
                            type="button"
                            text="Limpar filtros"
                            className="btn btn-blue-light fw-semibold m-1"
                            onClick={handleClearFilters}
                        />
                    </div>
                </form>

                <div className="form-row mt-4 d-flex justify-content-between align-items-center">
                    <div className="font-weight-bold text-primary text-uppercase mb-1 text-dark d-flex">
                        Lista de Fornecedores
                    </div>
                    {canAccess('Criar fornecedores') && (
                        <Button
                            text="Novo Fornecedor"
                            className="btn btn-blue-light fw-semibold"
                            link="/fornecedores/criar"
                        />
                    )}
                </div>

                <DynamicTable
                    headers={headers}
                    data={suppliers}
                    actions={actions}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={fetchSuppliersData}
                />
            </div>

            <ConfirmationModal
                open={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                itemName={supplierToDelete ? supplierToDelete.name : ''}
            />
        </MainLayout>
    );
};

export default SuppliersPage;

import React, { useEffect, useCallback } from "react";
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

const SuppliersPage = () => {
    const { canAccess } = usePermissions();
    const navigate = useNavigate();
    const { showLoader, hideLoader } = useLoader();
    const { showNotification } = useNotification();
    const { fetchSuppliers, deleteSupplier } = useSupplierService(navigate);

    const [name, setName] = React.useState('');
    const [suppliers, setSuppliers] = React.useState([]);
    const [deleteModalOpen, setDeleteModalOpen] = React.useState(false);
    const [supplierToDelete, setSupplierToDelete] = React.useState(null);

    const [currentPage, setCurrentPage] = React.useState(PAGINATION.DEFAULT_PAGE);
    const [itemsPerPage, setItemsPerPage] = React.useState(PAGINATION.DEFAULT_PER_PAGE);
    const [totalPages, setTotalPages] = React.useState(PAGINATION.DEFAULT_TOTAL_PAGES);

    const fetchSuppliersData = useCallback(async (page = 1) => {
        showLoader();
        try {
            const response = await fetchSuppliers({ page, perPage: itemsPerPage, name });
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

    const handleClearFilters = () => {
        setName('');
        fetchSuppliersData();
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

                <form className="form-row p-3 mt-2 rounded shadow-sm mb-2" style={{ backgroundColor: '#FFFFFF' }}>
                    <div className="form-group col-md-12">
                        <label htmlFor="name" className="text-dark font-weight-bold mt-1">Nome:</label>
                        <input
                            type="text"
                            id="name"
                            className="form-control"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Digite o nome do fornecedor"
                        />
                    </div>
                    <div className="form-group gap-2">
                        <Button
                            type="button"
                            text="Filtrar"
                            className="btn btn-blue-light fw-semibold m-1"
                            onClick={() => fetchSuppliersData(1)}
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

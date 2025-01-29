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
    const [selectedUser, setSelectedUser] = useState(null);  
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

    useEffect(() => {
        fetchSuppliersData();
    }, []);

    const handleEdit = (supplier) => {
        navigate(`/fornecedores/editar/${supplier.id}`);
    };

    const handleViewDetails = (supplier) => {
        navigate(`/fornecedores/detalhes/${supplier.id}`);
    };

    const handleActivate = (user, action) => {
        setSelectedUser(user); 
        setAction({
            action,
            text:'Você tem certeza que deseja ativar: '
        })
        setOpenModalConfirmation(true);  
    };

    const handleDelete = (user, action) => {
        setSelectedUser(user);  
        setAction({
            action,
            text:'Você tem certeza que deseja excluir: '
        })
        setOpenModalConfirmation(true);  
    };
    
    const handleConfirmDelete = async (id) => {
        try {
            showLoader();
            await remove(entities.suppliers.getByColumn(id));
            setOpenModalConfirmation(false);  
            fetchSuppliersData();
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

    const handleClearFilters = useCallback(() => {
        window.location.reload();
    }, []);

    const handleFilterSubmit = (e) => {
        e.preventDefault();
        
        const selectedIds = buildFilteredArray(selectedSuppliers, 'id', 'textFilter', false);
        const selectedNames = buildFilteredArray(selectedSuppliers, 'name', 'textFilter', true);
        const selectedICpfCnpjs = buildFilteredArray(selectedSuppliers, 'cpf_cnpj', 'textFilter', true);
        const filledInputs = new Set(selectedSuppliers.map((option) => option.column)).size;
    
        const previousFilters = filters || {}; 
    
        setFilters(prev => ({
            ...prev,
            id: selectedIds,
            name: selectedNames,
            cpf_cnpj: selectedICpfCnpjs,
            filledInputs,
            page: 1, 
        }));
    
        fetchSuppliersData({
            id: selectedIds,
            name: selectedNames,
            cpf_cnpj: selectedICpfCnpjs,
            filledInputs,
            page: 1,
            perPage: previousFilters.perPage, 
            deleted_at: previousFilters.deleted_at, 
        });
    };
    

    const headers = ['ID', 'Apelido', 'Nome', 'CPF/CNPJ'];
    const actions = [
        {
            id: 'edit',
            icon: faEdit,
            title: 'Editar Fornecedor',
            buttonClass: 'btn-primary',
            permission: 'Atualizar fornecedores',
            onClick: handleEdit
        },
        {
            id:'details',
            icon: faEye,
            title: 'Ver Detalhes',
            buttonClass: 'btn-info',
            permission: 'Ver fornecedores',
            onClick: handleViewDetails
        },
        {
            id:'delete',
            icon: faTrash,
            title: 'Excluir Fornecedor',
            buttonClass: 'btn-danger',
            permission: 'Excluir fornecedores',
            onClick: handleDelete
        },
        {
            id: 'activate',
            icon: faUndo,
            title: 'Ativar usuário',
            buttonClass: 'btn-info',
            permission: 'Atualizar fornecedores',
            onClick: handleActivate,
        },
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
                    filters={filters}
                    setFilters={setFilters}
                />
            </div>

            <ConfirmationModal
                open={openModalConfirmation}
                onClose={handleCancelConfirmation}
                onConfirm={() => action.action == 'delete'? handleConfirmDelete(selectedUser.id) : console.log('oi')}
                itemName={selectedUser ? selectedUser.name : ''}
                text={action.text}
            />
        </MainLayout>
    );
};

export default SuppliersPage;

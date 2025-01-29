import React, { useState, useEffect, useCallback, useMemo } from "react";
import MainLayout from "../../../layouts/MainLayout";
import Button from "../../../components/Button";
import { usePermissions } from "../../../hooks/usePermissions";
import DynamicTable from "../../../components/DynamicTable";
import { useNavigate, useLocation } from "react-router-dom";
import { faEdit, faTrash, faLayerGroup, faUndo } from '@fortawesome/free-solid-svg-icons';
import ConfirmationModal from "../../../components/modals/ConfirmationModal";
import { PAGINATION } from "../../../constants/pagination";
import useLoader from "../../../hooks/useLoader";
import AutoCompleteFilter from "../../../components/AutoCompleteFilter";
import baseService from "../../../services/baseService";
import useBaseService from "../../../hooks/services/useBaseService";
import { entities } from "../../../constants/entities";
import { buildFilteredArray } from "../../../utils/arrayUtils";

const TypeContractPage = () => {
    const navigate = useNavigate();
    const { canAccess } = usePermissions();
    const { get: fetchAll, del: remove } = useBaseService(navigate);
    const { showLoader, hideLoader } = useLoader();
    const [selectedTypes, setSelectedTypes] = useState([]);
    const [types, setTypes] = useState([]);
    const location = useLocation();
    const [currentPage, setCurrentPage] = useState(PAGINATION.DEFAULT_PAGE);
    const [itemsPerPage, setItemsPerPage] = useState(PAGINATION.DEFAULT_PER_PAGE);
    const [totalPages, setTotalPages] = useState(PAGINATION.DEFAULT_TOTAL_PAGES);
    const [selectedType, setSelectedType] = useState(null);  
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

    const loadTypes = useCallback(async (filtersSubmit) => {
        showLoader();
        try {
            const response = await fetchAll(entities.contracts.types.get(), filtersSubmit || filters);
            setTypes(response.result.data.map((type) => ({
                id: type.id,
                name: type.name,
                deleted_at: type.deleted_at ? 'deleted-' + type.deleted_at : 'deleted-null'
            })));
            setTotalPages(response.result.last_page);
            setCurrentPage(response.result.current_page);
        } finally {
            hideLoader();
        }
    }, [fetchAll, itemsPerPage, showLoader, hideLoader]);

    useEffect(() => {
        loadTypes();
    }, [itemsPerPage]);

    const handleEdit = useCallback((type) => {
        navigate(`/contratos/tipos/editar/${type.id}`);
    }, [navigate]);

    const handleFilterSubmit = (e) => {
        e.preventDefault();
    
        const selectedIds = buildFilteredArray(selectedTypes, 'id', 'textFilter', false);
        const selectedNames = buildFilteredArray(selectedTypes, 'name', 'textFilter', true);
        const selectedIdLikes = buildFilteredArray(selectedTypes, 'id', 'numberFilter', true);
        const filledInputs = new Set(selectedTypes.map((option) => option.column)).size;
    
        const previousFilters = filters || {}; 
    
        setFilters(prev => ({
            ...prev,
            id: selectedIds,
            name: selectedNames,
            idLike: selectedIdLikes,
            filledInputs,
            page: 1,
        }));
    
        loadTypes({
            id: selectedIds,
            name: selectedNames,
            idLike: selectedIdLikes,
            filledInputs,
            page: 1,
            deleted_at: previousFilters.deleted_at, 
        });
    };
    
    const handleChangeCustomers = useCallback((newSelected, column) => {
        setSelectedTypes((prev) => {
            if (!newSelected.length) {
                return prev.filter((option) => option.column !== column);
            }

            const newSelectedArray = Array.isArray(newSelected) ? newSelected : [newSelected];

            const filtered = prev.filter((option) => option.column !== column);
            return [...filtered, ...newSelectedArray];
        });
    }, []);

    const handleActivate = (type, action) => {
        setSelectedType(type); 
        setAction({
            action,
            text:'Você tem certeza que deseja ativar: '
        })
        setOpenModalConfirmation(true);  
    };

    const handleDelete = (type, action) => {
        setSelectedType(type);  
        setAction({
            action,
            text:'Você tem certeza que deseja excluir: '
        })
        setOpenModalConfirmation(true);  
    };
    
    const handleConfirmDelete = async (id) => {
        try {
            showLoader();
            await remove(entities.contracts.types.delete(id));
            setOpenModalConfirmation(false);  
            loadTypes();
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

    const headers = useMemo(() => ['id', 'Nome'], []);

    const actions = useMemo(() => [
        {
            id:'edit',
            icon: faEdit,
            title: 'Editar Cargos',
            buttonClass: 'btn-primary',
            permission: 'Atualizar tipos de contratos',
            onClick: handleEdit
        },
        {
            id: 'delete',
            icon: faTrash,
            title: 'Excluir Tipo',
            buttonClass: 'btn-danger',
            permission: 'Atualizar tipos de contratos',
            onClick: handleDelete
        },
        {
            id: 'activate',
            icon: faUndo,
            title: 'Ativar usuário',
            buttonClass: 'btn-info',
            permission: 'Excluir tipos de contratos',
            onClick: handleActivate,
        },
    ], [handleEdit, handleDelete]);

    return (
        <MainLayout selectedCompany="ALUCOM">
            <div className="container-fluid p-1">
                <div className="text-xs font-weight-bold text-primary text-uppercase mb-1 text-dark">
                    Tipos de Contrato
                </div>

                <form className="form-row p-3 mt-2 rounded shadow-sm mb-2" style={{ backgroundColor: '#FFFFFF' }} onSubmit={handleFilterSubmit}>
                    <div className="form-group col-md-6">
                        <label htmlFor="name" className="text-dark font-weight-bold mt-1">
                            Número:
                        </label>
                        <AutoCompleteFilter
                            service={baseService}
                            columnDataBase="id"
                            model='contractType'
                            value={selectedTypes.filter((option) => option.column === 'id')}
                            onChange={(selected) => handleChangeCustomers(selected, 'id')}
                            onBlurColumn="numberFilter"
                            placeholder="Filtre os tipos pelo número"
                            isMulti
                        />
                    </div>
                    <div className="form-group col-md-6">
                        <label htmlFor="name" className="text-dark font-weight-bold mt-1">
                            Nome:
                        </label>
                        <AutoCompleteFilter
                            service={baseService}
                            columnDataBase="name"
                            model='contractType'
                            value={selectedTypes.filter((option) => option.column === 'name')}
                            onChange={(selected) => handleChangeCustomers(selected, 'name')}
                            onBlurColumn="textFilter"
                            placeholder="Filtre os tipos pelo nome"
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
                        Lista de Tipos
                    </div>
                    {canAccess('Criar tipos de contratos') && (
                        <Button
                            text="Novo Tipo"
                            className="btn btn-blue-light fw-semibold"
                            link="/contratos/tipos/criar"
                        />
                    )}
                </div>

                <DynamicTable
                    headers={headers}
                    data={types}
                    actions={actions}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={loadTypes}
                    filters={filters}
                    setFilters={setFilters}
                />

                <ConfirmationModal
                    open={openModalConfirmation}
                    onClose={handleCancelConfirmation}
                    onConfirm={() => action.action == 'delete'? handleConfirmDelete(selectedType.id) : console.log('oi')}
                    itemName={selectedType ? selectedType.name : ''}
                    text={action.text}
                />
            </div>
        </MainLayout>
    );
};

export default TypeContractPage
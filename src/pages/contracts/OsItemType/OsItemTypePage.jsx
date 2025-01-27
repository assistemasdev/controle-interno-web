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
import useOrderService from "../../../hooks/services/useOrderService";
import { buildFilteredArray } from "../../../utils/arrayUtils";

const OsItemTypePage = () => {
    const navigate = useNavigate();
    const { canAccess } = usePermissions();
    const { fetchAllOsItemsType, removeOsItemType } = useOrderService(navigate);
    const { showLoader, hideLoader } = useLoader();
    const [selectedOsItemsTypes, setSelectedOsItemsTypes] = useState([]);
    const [OsItemsTypes, setOsItemsTypes] = useState([]);
    const location = useLocation();
    const [currentPage, setCurrentPage] = useState(PAGINATION.DEFAULT_PAGE);
    const [itemsPerPage, setItemsPerPage] = useState(PAGINATION.DEFAULT_PER_PAGE);
    const [totalPages, setTotalPages] = useState(PAGINATION.DEFAULT_TOTAL_PAGES);
    const [selectedOsItemType, setSelectedOsItemType] = useState(null);  
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

    const loadOsItemsTypes = useCallback(async (filtersSubmit) => {
        showLoader();
        try {
            const response = await fetchAllOsItemsType(filtersSubmit || filters);
            setOsItemsTypes(response.result.data.map((type) => ({
                id: type.id,
                name: type.name,
                deleted_at: type.deleted_at ? 'deleted-' + type.deleted_at : 'deleted-null'
            })));
            setTotalPages(response.result.last_page);
            setCurrentPage(response.result.current_page);
        } finally {
            hideLoader();
        }
    }, [fetchAllOsItemsType, itemsPerPage, showLoader, hideLoader]);

    useEffect(() => {
        loadOsItemsTypes();
    }, [itemsPerPage]);

    const handleEdit = useCallback((type) => {
        navigate(`/contratos/ordem-servico/tipos-itens/editar/${type.id}`);
    }, [navigate]);

    const handleFilterSubmit = (e) => {
        e.preventDefault();
    
        const selectedIds = buildFilteredArray(selectedOsItemsTypes, 'id', 'textFilter', false);
        const selectedNames = buildFilteredArray(selectedOsItemsTypes, 'name', 'textFilter', true);
        const selectedIdLikes = buildFilteredArray(selectedOsItemsTypes, 'id', 'numberFilter', true);
        const filledInputs = new Set(selectedOsItemsTypes.map((option) => option.column)).size;
    
        const previousFilters = filters || {}; 
    
        setFilters(prev => ({
            ...prev,
            id: selectedIds,
            name: selectedNames,
            idLike: selectedIdLikes,
            filledInputs,
            page: 1,
        }));
    
        loadOsItemsTypes({
            id: selectedIds,
            name: selectedNames,
            idLike: selectedIdLikes,
            filledInputs,
            page: 1,
            deleted_at: previousFilters.deleted_at, 
        });
    };
    
    const handleChangeCustomers = useCallback((newSelected, column) => {
        setSelectedOsItemsTypes((prev) => {
            if (!newSelected.length) {
                return prev.filter((option) => option.column !== column);
            }

            const newSelectedArray = Array.isArray(newSelected) ? newSelected : [newSelected];

            const filtered = prev.filter((option) => option.column !== column);
            return [...filtered, ...newSelectedArray];
        });
    }, []);

    const handleActivate = (type, action) => {
        setSelectedOsItemType(type); 
        setAction({
            action,
            text:'Você tem certeza que deseja ativar: '
        })
        setOpenModalConfirmation(true);  
    };

    const handleDelete = (type, action) => {
        setSelectedOsItemType(type);  
        setAction({
            action,
            text:'Você tem certeza que deseja excluir: '
        })
        setOpenModalConfirmation(true);  
    };
    
    const handleConfirmDelete = async (id) => {
        try {
            showLoader();
            await removeOsItemType(id);
            setOpenModalConfirmation(false);  
            loadOsItemsTypes();
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
                    Tipos de Item de Ordem de Serviço
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
                            value={selectedOsItemsTypes.filter((option) => option.column === 'id')}
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
                            value={selectedOsItemsTypes.filter((option) => option.column === 'name')}
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
                        Lista de Tipos de Item de Ordem de Serviço
                    </div>
                    {canAccess('Criar tipos de itens de ordem de serviço') && (
                        <Button
                            text="Novo Tipo"
                            className="btn btn-blue-light fw-semibold"
                            link="/contratos/ordem-servico/tipos-itens/criar"
                        />
                    )}
                </div>

                <DynamicTable
                    headers={headers}
                    data={OsItemsTypes}
                    actions={actions}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={loadOsItemsTypes}
                    filters={filters}
                    setFilters={setFilters}
                />

                <ConfirmationModal
                    open={openModalConfirmation}
                    onClose={handleCancelConfirmation}
                    onConfirm={() => action.action == 'delete'? handleConfirmDelete(selectedOsItemType.id) : console.log('oi')}
                    itemName={selectedOsItemType ? selectedOsItemType.name : ''}
                    text={action.text}
                />
            </div>
        </MainLayout>
    );
};

export default OsItemTypePage
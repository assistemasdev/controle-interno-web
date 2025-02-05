import React, { useState, useEffect, useCallback, useMemo } from "react";
import MainLayout from "../../../layouts/MainLayout";
import Button from "../../../components/Button";
import { usePermissions } from "../../../hooks/usePermissions";
import DynamicTable from "../../../components/DynamicTable";
import { useNavigate, useLocation } from "react-router-dom";
import { faEdit, faTrash, faUndo } from '@fortawesome/free-solid-svg-icons';
import ConfirmationModal from "../../../components/modals/ConfirmationModal";
import { PAGINATION } from "../../../constants/pagination";
import useLoader from "../../../hooks/useLoader";
import AutoCompleteFilter from "../../../components/AutoCompleteFilter";
import baseService from "../../../services/baseService";
import useBaseService from "../../../hooks/services/useBaseService";
import { buildFilteredArray } from "../../../utils/arrayUtils";
import { entities } from "../../../constants/entities";

const OsDestinationsPage = () => {
    const navigate = useNavigate();
    const { canAccess } = usePermissions();
    const { get: fetchAll, del: remove } = useBaseService(navigate);
    const { showLoader, hideLoader } = useLoader();
    const [selectedOsDestinations, setSelectedOsDestinations] = useState([]);
    const [OsDestinations, setOsDestinations] = useState([]);
    const location = useLocation();
    const [currentPage, setCurrentPage] = useState(PAGINATION.DEFAULT_PAGE);
    const [itemsPerPage, setItemsPerPage] = useState(PAGINATION.DEFAULT_PER_PAGE);
    const [totalPages, setTotalPages] = useState(PAGINATION.DEFAULT_TOTAL_PAGES);
    const [selectedOsDepartament, setSelectedOsDestination] = useState(null);  
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

    const loadOsDestinations = useCallback(async (filtersSubmit) => {
        showLoader();
        try {
            const response = await fetchAll(entities.orders.destinations.get() ,filtersSubmit || filters);
            setOsDestinations(response.result.data.map((departament) => ({
                id: departament.id,
                name: departament.name,
                deleted_at: departament.deleted_at ? 'deleted-' + departament.deleted_at : 'deleted-null'
            })));
            setTotalPages(response.result.last_page);
            setCurrentPage(response.result.current_page);
        } finally {
            hideLoader();
        }
    }, [fetchAll, itemsPerPage, showLoader, hideLoader]);

    useEffect(() => {
        loadOsDestinations();
    }, [itemsPerPage]);

    const handleEdit = useCallback((destination) => {
        navigate(`/contratos/ordem-servico/destinos/editar/${destination.id}`);
    }, [navigate]);

    const handleFilterSubmit = (e) => {
        e.preventDefault();
    
        const selectedIds = buildFilteredArray(selectedOsDestinations, 'id', 'textFilter', false);
        const selectedNames = buildFilteredArray(selectedOsDestinations, 'name', 'textFilter', true);
        const selectedIdLikes = buildFilteredArray(selectedOsDestinations, 'id', 'numberFilter', true);
        const filledInputs = new Set(selectedOsDestinations.map((option) => option.column)).size;
    
        const previousFilters = filters || {}; 
    
        setFilters(prev => ({
            ...prev,
            id: selectedIds,
            name: selectedNames,
            idLike: selectedIdLikes,
            filledInputs,
            page: 1,
        }));
    
        loadOsDestinations({
            id: selectedIds,
            name: selectedNames,
            idLike: selectedIdLikes,
            filledInputs,
            page: 1,
            deleted_at: previousFilters.deleted_at, 
        });
    };
    
    const handleChangeCustomers = useCallback((newSelected, column) => {
        setSelectedOsDestinations((prev) => {
            if (!newSelected.length) {
                return prev.filter((option) => option.column !== column);
            }

            const newSelectedArray = Array.isArray(newSelected) ? newSelected : [newSelected];

            const filtered = prev.filter((option) => option.column !== column);
            return [...filtered, ...newSelectedArray];
        });
    }, []);

    const handleActivate = (destination, action) => {
        setSelectedOsDestination(destination); 
        setAction({
            action,
            text:'Você tem certeza que deseja ativar: '
        })
        setOpenModalConfirmation(true);  
    };

    const handleDelete = (destination, action) => {
        setSelectedOsDestination(destination);  
        setAction({
            action,
            text:'Você tem certeza que deseja excluir: '
        })
        setOpenModalConfirmation(true);  
    };
    
    const handleConfirmDelete = async (id) => {
        try {
            showLoader();
            await remove(entities.orders.destinations.delete(null, id));
            setOpenModalConfirmation(false);  
            loadOsDestinations();
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
            permission: 'Atualizar destinos de ordens de serviço',
            onClick: handleEdit
        },
        {
            id: 'delete',
            icon: faTrash,
            title: 'Excluir Tipo',
            buttonClass: 'btn-danger',
            permission: 'Excluir destinos de ordens de serviço',
            onClick: handleDelete
        },
        {
            id: 'activate',
            icon: faUndo,
            title: 'Ativar usuário',
            buttonClass: 'btn-info',
            permission: 'Atualizar destinos de ordens de serviço',
            onClick: handleActivate,
        },
    ], [handleEdit, handleDelete]);

    return (
        <MainLayout selectedCompany="ALUCOM">
            <div className="container-fluid p-1">
                <div className="text-xs font-weight-bold text-primary text-uppercase mb-1 text-dark">
                    Destino de Ordem de Serviço
                </div>

                <form className="form-row p-3 mt-2 rounded shadow-sm mb-2" style={{ backgroundColor: '#FFFFFF' }} onSubmit={handleFilterSubmit}>
                    <div className="form-group col-md-6">
                        <label htmlFor="name" className="text-dark font-weight-bold mt-1">
                            Número:
                        </label>
                        <AutoCompleteFilter
                            service={baseService}
                            columnDataBase="id"
                            model='serviceOrderDestination'
                            value={selectedOsDestinations.filter((option) => option.column === 'id')}
                            onChange={(selected) => handleChangeCustomers(selected, 'id')}
                            onBlurColumn="numberFilter"
                            placeholder="Filtre os destinos pelo número"
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
                            model='serviceOrderDestination'
                            value={selectedOsDestinations.filter((option) => option.column === 'name')}
                            onChange={(selected) => handleChangeCustomers(selected, 'name')}
                            onBlurColumn="textFilter"
                            placeholder="Filtre os destinos pelo nome"
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
                        Lista de Destino de Ordem de Serviço
                    </div>
                    {canAccess('Criar destinos de ordens de serviço') && (
                        <Button
                            text="Novo Destino"
                            className="btn btn-blue-light fw-semibold"
                            link="/contratos/ordem-servico/destinos/criar"
                        />
                    )}
                </div>

                <DynamicTable
                    headers={headers}
                    data={OsDestinations}
                    actions={actions}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={loadOsDestinations}
                    filters={filters}
                    setFilters={setFilters}
                />

                <ConfirmationModal
                    open={openModalConfirmation}
                    onClose={handleCancelConfirmation}
                    onConfirm={() => action.action == 'delete'? handleConfirmDelete(selectedOsDepartament.id) : console.log('oi')}
                    itemName={selectedOsDepartament ? selectedOsDepartament.name : ''}
                    text={action.text}
                />
            </div>
        </MainLayout>
    );
};

export default OsDestinationsPage
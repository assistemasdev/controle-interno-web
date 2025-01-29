import React, { useState, useEffect, useCallback, useMemo } from "react";
import MainLayout from "../../layouts/MainLayout";
import Button from "../../components/Button";
import { usePermissions } from "../../hooks/usePermissions";
import DynamicTable from "../../components/DynamicTable";
import useLoader from "../../hooks/useLoader";
import useNotification from "../../hooks/useNotification";
import { useNavigate, useLocation } from "react-router-dom";
import { faEdit, faTrashAlt, faUndo, faLink } from '@fortawesome/free-solid-svg-icons';
import ConfirmationModal from "../../components/modals/ConfirmationModal";
import { PAGINATION } from "../../constants/pagination";
import baseService from "../../services/baseService";
import AutoCompleteFilter from "../../components/AutoCompleteFilter";
import useBaseService from "../../hooks/services/useBaseService";
import { entities } from "../../constants/entities";
import { buildFilteredArray } from "../../utils/arrayUtils";

const UnitPage = () => {
    const { canAccess } = usePermissions();
    const { showLoader, hideLoader } = useLoader();
    const { showNotification } = useNotification();
    const navigate = useNavigate();
    const { get: fetchAll, del: remove } = useBaseService(navigate);
    const location = useLocation();
    const [selectedUnits, setSelectedUnits] = useState([]);
    const [units, setUnits] = useState([]);
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

    const fetchUnitList = useCallback(async (filtersSubmit) => {
        try {
            showLoader();
            const response = await fetchAll(entities.units.get, filtersSubmit || filters);
            setUnits(response.result.data.map((unit) => ({
                id: unit.id,
                name: unit.name,
                abbreviation: unit.abbreviation,
                deleted_at: unit.deleted_at ? 'deleted-' + unit.deleted_at : 'deleted-null'
            })));
            setCurrentPage(response.result.current_page);
            setTotalPages(response.result.last_page);
        } catch (error) {
            console.log(error)
        } finally {
            hideLoader();
        }
    }, [fetchAll, itemsPerPage, showLoader, hideLoader, showNotification]);

    useEffect(() => {
        if (location.state?.message) {
            showNotification(location.state.type, location.state.message);
            setTimeout(() => navigate(location.pathname, { replace: true }), 0);
        }
        fetchUnitList();
    }, [location.state]);

    const handleClearFilters = useCallback(() => {
        window.location.reload();
    }, []);

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
            await remove(entities.units.delete(id));
            setOpenModalConfirmation(false);  
            fetchUnitList();
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

    const handleFilterSubmit = (e) => {
        e.preventDefault();
    
        const selectedIds = buildFilteredArray(selectedUnits, 'id', 'textFilter', false);
        const selectedNames = buildFilteredArray(selectedUnits, 'name', 'textFilter', true);
        const selectedIdLikes = buildFilteredArray(selectedUnits, 'id', 'numberFilter', true);
        const filledInputs = new Set(selectedUnits.map((option) => option.column)).size;
        const previousFilters = filters || {};
    
        setFilters((prev) => ({
            ...prev,
            id: selectedIds,
            name: selectedNames,
            idLike: selectedIdLikes,
            filledInputs,
            page: 1, 
        }));
    
        fetchUnitList({
            id: selectedIds,
            name: selectedNames,
            idLike: selectedIdLikes,
            filledInputs,
            page: 1,
            deleted_at: previousFilters.deleted_at,
        });
    };
    
    
    const handleChangeUnits = useCallback((newSelected, column) => {
        setSelectedUnits((prev) => {
            if (!newSelected.length) {
                return prev.filter((option) => option.column !== column);
            }

            const newSelectedArray = Array.isArray(newSelected) ? newSelected : [newSelected];

            const filtered = prev.filter((option) => option.column !== column);
            return [...filtered, ...newSelectedArray];
        });
    }, []);

    const headers = useMemo(() => ['id', 'Nome', 'Abreviação'], []);
    const actions = useMemo(() => [
        {
            id:'edit',
            icon: faEdit,
            title: 'Editar Unidade',
            buttonClass: 'btn-primary',
            permission: 'Atualizar tipos de produto',
            onClick: (unit) => navigate(`/unidades/editar/${unit.id}`),
        },
        {
            id:'viewUnitsRelated',
            icon: faLink, 
            title: 'Ver unidades relacionadas',
            buttonClass: 'btn-info',
            permission: 'Listar unidades de medida relacionadas',
            onClick: (unit) => navigate(`/unidades/${unit.id}/relacionadas/criar`),
        },
        {
            id: 'delete',
            icon: faTrashAlt,
            title: 'Excluir usuário',
            buttonClass: 'btn-danger',
            permission: 'Excluir tipos de produto',
            onClick: handleDelete,
        },
        {
            id: 'activate',
            icon: faUndo,
            title: 'Ativar usuário',
            buttonClass: 'btn-info',
            permission: 'activate users',
            onClick: handleActivate,
        },
    ], [navigate]);

    return (
        <MainLayout selectedCompany="ALUCOM">
            <div className="container-fluid p-1">
                <div className="text-xs font-weight-bold text-primary text-uppercase mb-1 text-dark">
                    Unidades
                </div>

                <form className="form-row p-3 mt-2 rounded shadow-sm mb-2" style={{ backgroundColor: '#FFFFFF' }} onSubmit={handleFilterSubmit}>
                    <div className="form-group col-md-6">
                        <label htmlFor="name" className="text-dark font-weight-bold mt-1">
                            Número:
                        </label>
                        <AutoCompleteFilter
                            service={baseService}
                            columnDataBase="id"
                            model='unit'
                            value={selectedUnits.filter((option) => option.column === 'id')}
                            onChange={(selected) => handleChangeUnits(selected, 'id')}
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
                            model='unit'
                            value={selectedUnits.filter((option) => option.column === 'name')}
                            onChange={(selected) => handleChangeUnits(selected, 'name')}
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
                        Lista de Unidades
                    </div>
                    {canAccess('Criar unidades de medida') && (
                        <Button
                            text="Nova Unidade"
                            className="btn btn-blue-light fw-semibold"
                            link="/unidades/criar"
                        />
                    )}
                </div>

                <DynamicTable
                    headers={headers}
                    data={units}
                    actions={actions}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={fetchUnitList}
                    filters={filters}
                    setFilters={setFilters}
                />

                <ConfirmationModal
                    open={openModalConfirmation}
                    onClose={handleCancelConfirmation}
                    onConfirm={() => action.action == 'delete'? handleConfirmDelete(selectedUser.id) : console.log('oi')}
                    itemName={selectedUser ? selectedUser.name : ''}
                    text={action.text}
                />
            </div>
        </MainLayout>
    );
};

export default UnitPage;

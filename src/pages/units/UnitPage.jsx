import React, { useState, useEffect, useCallback, useMemo } from "react";
import MainLayout from "../../layouts/MainLayout";
import InputField from "../../components/InputField";
import Button from "../../components/Button";
import { usePermissions } from "../../hooks/usePermissions";
import DynamicTable from "../../components/DynamicTable";
import useUnitService from "../../hooks/useUnitService";
import useLoader from "../../hooks/useLoader";
import useNotification from "../../hooks/useNotification";
import { useNavigate, useLocation } from "react-router-dom";
import { faEdit, faTrash, faLink } from '@fortawesome/free-solid-svg-icons';
import ConfirmationModal from "../../components/modals/ConfirmationModal";
import { PAGINATION } from "../../constants/pagination";
import baseService from "../../services/baseService";
import AutoCompleteFilter from "../../components/AutoCompleteFilter";

const UnitPage = () => {
    const { canAccess } = usePermissions();
    const { fetchUnits, deleteUnit } = useUnitService();
    const { showLoader, hideLoader } = useLoader();
    const { showNotification } = useNotification();
    const navigate = useNavigate();
    const location = useLocation();
    const [selectedUnits, setSelectedUnits] = useState([]);
    const [name, setName] = useState('');
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [unitToDelete, setUnitToDelete] = useState(null);
    const [units, setUnits] = useState([]);
    const [currentPage, setCurrentPage] = useState(PAGINATION.DEFAULT_PAGE);
    const [itemsPerPage, setItemsPerPage] = useState(PAGINATION.DEFAULT_PER_PAGE);
    const [totalPages, setTotalPages] = useState(PAGINATION.DEFAULT_TOTAL_PAGES);

    const headers = useMemo(() => ['id', 'Nome', 'Abreviação'], []);
    const actions = useMemo(() => [
        {
            icon: faEdit,
            title: 'Editar Unidade',
            buttonClass: 'btn-primary',
            permission: 'Atualizar tipos de produto',
            onClick: (unit) => navigate(`/unidades/editar/${unit.id}`),
        },
        {
            icon: faTrash,
            title: 'Excluir Unidade',
            buttonClass: 'btn-danger',
            permission: 'Excluir tipos de produto',
            onClick: (unit) => {
                setUnitToDelete(unit);
                setDeleteModalOpen(true);
            },
        },
        {
            icon: faLink, 
            title: 'Ver unidades relacionadas',
            buttonClass: 'btn-info',
            permission: 'Listar unidades de medida relacionadas',
            onClick: (unit) => navigate(`/unidades/${unit.id}/relacionadas/criar`),
        }
    ], [navigate]);

    const fetchUnitList = useCallback(async (id, name, idLike, filledInputs, page = 1) => {
        try {
            showLoader();
            const result = await fetchUnits({ id, name, idLike, filledInputs, page, perPage: itemsPerPage });
            setUnits(result.data.map((unit) => ({
                id: unit.id,
                name: unit.name,
                abbreviation: unit.abbreviation,
            })));
            setCurrentPage(result.current_page);
            setTotalPages(result.last_page);
        } catch (error) {
            showNotification('error', 'Erro ao carregar unidades.');
        } finally {
            hideLoader();
        }
    }, [fetchUnits, itemsPerPage, showLoader, hideLoader, showNotification]);

    useEffect(() => {
        if (location.state?.message) {
            showNotification(location.state.type, location.state.message);
            setTimeout(() => navigate(location.pathname, { replace: true }), 0);
        }
        fetchUnitList();
    }, [location.state]);

    const handleClearFilters = useCallback(() => {
        setName('');
    }, []);

    const confirmDelete = useCallback(async () => {
        try {
            showLoader();
            await deleteUnit(unitToDelete.id);
            fetchUnitList();
        } catch (error) {
            showNotification('error', 'Erro ao excluir unidade.');
        } finally {
            setDeleteModalOpen(false);
            hideLoader();
        }
    }, [unitToDelete, deleteUnit, fetchUnitList, showLoader, hideLoader, showNotification]);

    const handleFilterSubmit = (e) => {
        e.preventDefault();

        const filledInputs = new Set(selectedUnits.map((option) => option.column)).size;

        fetchUnitList(
            selectedUnits.filter((type) => type.textFilter === false || (type.column === 'id' && type.numberFilter === false)).map((type) => type.value),
            selectedUnits.filter((type) => type.textFilter === true && type.column === 'name').map((type) => type.value),
            selectedUnits.filter((type) => type.numberFilter === true && type.column === 'id').map((type) => type.value),
            filledInputs
        );
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
                />

                <ConfirmationModal
                    open={deleteModalOpen}
                    onClose={() => setDeleteModalOpen(false)}
                    onConfirm={confirmDelete}
                    itemName={unitToDelete ? unitToDelete.name : ''}
                />
            </div>
        </MainLayout>
    );
};

export default UnitPage;

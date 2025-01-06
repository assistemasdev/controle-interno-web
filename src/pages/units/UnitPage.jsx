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

const UnitPage = () => {
    const { canAccess } = usePermissions();
    const { fetchUnits, deleteUnit } = useUnitService();
    const { showLoader, hideLoader } = useLoader();
    const { showNotification } = useNotification();
    const navigate = useNavigate();
    const location = useLocation();

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

    const fetchUnitList = useCallback(async (page = 1) => {
        try {
            showLoader();
            const result = await fetchUnits({ page, perPage: itemsPerPage });
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

    return (
        <MainLayout selectedCompany="ALUCOM">
            <div className="container-fluid p-1">
                <div className="text-xs font-weight-bold text-primary text-uppercase mb-1 text-dark">
                    Unidades
                </div>

                <form className="form-row p-3 mt-2 rounded shadow-sm mb-2" style={{ backgroundColor: '#FFFFFF' }}>
                    <div className="form-group col-md-12">
                        <InputField
                            label='Nome da Unidade:'
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Digite o nome da unidade"
                        />
                    </div>
                    <div className="form-group gap-2">
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

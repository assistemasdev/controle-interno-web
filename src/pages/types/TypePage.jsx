import React, { useState, useEffect, useCallback, useMemo } from "react";
import MainLayout from "../../layouts/MainLayout";
import InputField from "../../components/InputField";
import Button from "../../components/Button";
import { usePermissions } from "../../hooks/usePermissions";
import DynamicTable from "../../components/DynamicTable";
import useTypeService from "../../hooks/useTypeService";
import { useNavigate, useLocation } from "react-router-dom";
import { faEdit, faTrash, faLayerGroup } from '@fortawesome/free-solid-svg-icons';
import ConfirmationModal from "../../components/modals/ConfirmationModal";
import { PAGINATION } from "../../constants/pagination";
import useLoader from "../../hooks/useLoader";

const TypePage = () => {
    const { canAccess } = usePermissions();
    const { fetchTypes, deleteType } = useTypeService();
    const { showLoader, hideLoader } = useLoader();
    const [name, setName] = useState('');
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [typeToDelete, setTypeToDelete] = useState(null);
    const [types, setTypes] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();
    const [currentPage, setCurrentPage] = useState(PAGINATION.DEFAULT_PAGE);
    const [itemsPerPage, setItemsPerPage] = useState(PAGINATION.DEFAULT_PER_PAGE);
    const [totalPages, setTotalPages] = useState(PAGINATION.DEFAULT_TOTAL_PAGES);

    useEffect(() => {
        if (location.state?.message) {
            const { type, text } = location.state.message;
            setTimeout(() => navigate(location.pathname, { replace: true }), 0); 
        }
    }, [location.state, navigate]);

    const handleClearFilters = useCallback(() => {
        setName('');
    }, []);

    const loadTypes = useCallback(async (page = 1) => {
        showLoader();
        try {
            const result = await fetchTypes({ page, perPage: itemsPerPage });
            setTypes(result.data.map((type) => ({
                id: type.id,
                name: type.name
            })));
            setTotalPages(result.last_page);
            setCurrentPage(result.current_page);
        } finally {
            hideLoader();
        }
    }, [fetchTypes, itemsPerPage, showLoader, hideLoader]);

    useEffect(() => {
        loadTypes();
    }, [itemsPerPage]);

    const handleEdit = useCallback((type) => {
        navigate(`/tipos/editar/${type.id}`);
    }, [navigate]);

    const handleDelete = useCallback((type) => {
        setTypeToDelete(type);
        setDeleteModalOpen(true);
    }, []);

    const handleViewGroups = useCallback((type) => {
        navigate(`/tipos/${type.id}/grupos/associar`);
    }, [navigate]);

    const confirmDelete = useCallback(async () => {
        showLoader();
        try {
            await deleteType(typeToDelete.id);
            loadTypes();
        } finally {
            setDeleteModalOpen(false);
            hideLoader();
        }
    }, [deleteType, typeToDelete, loadTypes, showLoader, hideLoader]);

    const headers = useMemo(() => ['id', 'Nome'], []);

    const actions = useMemo(() => [
        {
            icon: faEdit,
            title: 'Editar Cargos',
            buttonClass: 'btn-primary',
            permission: 'Atualizar tipos de produto',
            onClick: handleEdit
        },
        {
            icon: faTrash,
            title: 'Excluir Tipo',
            buttonClass: 'btn-danger',
            permission: 'Excluir tipos de produto',
            onClick: handleDelete
        },
        {
            icon: faLayerGroup,
            title: 'Ver Grupos do Tipo',
            buttonClass: 'btn-info',
            permission: 'Visualizar grupos do tipo',
            onClick: handleViewGroups
        }
    ], [handleEdit, handleDelete, handleViewGroups]);

    return (
        <MainLayout selectedCompany="ALUCOM">
            <div className="container-fluid p-1">
                <div className="text-xs font-weight-bold text-primary text-uppercase mb-1 text-dark">
                    Tipos
                </div>

                <form className="form-row p-3 mt-2 rounded shadow-sm mb-2" style={{ backgroundColor: '#FFFFFF' }}>
                    <div className="form-group col-md-12">
                        <InputField
                            label='Nome do Tipo:'
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Digite o nome do tipo"
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
                    {canAccess('Criar tipos de produto') && (
                        <Button
                            text="Novo Tipo"
                            className="btn btn-blue-light fw-semibold"
                            link="/tipos/criar"
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
                />

                <ConfirmationModal
                    open={deleteModalOpen}
                    onClose={() => setDeleteModalOpen(false)}
                    onConfirm={confirmDelete}
                    itemName={typeToDelete ? typeToDelete.name : ''}
                />
            </div>
        </MainLayout>
    );
};

export default TypePage;

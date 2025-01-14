import React, { useEffect, useState, useCallback, useMemo } from "react";
import MainLayout from "../../layouts/MainLayout";
import InputField from "../../components/InputField";
import Button from "../../components/Button";
import { usePermissions } from "../../hooks/usePermissions";
import DynamicTable from "../../components/DynamicTable";
import useGroupService from "../../hooks/useGroupService";
import useLoader from "../../hooks/useLoader";
import useNotification from "../../hooks/useNotification";
import { useNavigate, useLocation } from "react-router-dom";
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import ConfirmationModal from "../../components/modals/ConfirmationModal";
import { PAGINATION } from "../../constants/pagination";
import AutoCompleteFilter from "../../components/AutoCompleteFilter";
import baseService from "../../services/baseService";

const GroupPage = () => {
    const { canAccess } = usePermissions();
    const { showLoader, hideLoader } = useLoader();
    const { showNotification } = useNotification();
    const navigate = useNavigate();
    const location = useLocation();
    const { fetchAllGroups, deleteGroup } = useGroupService(navigate);

    const [name, setName] = useState('');
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [groupToDelete, setGroupToDelete] = useState(null);
    const [groups, setGroups] = useState([]);
    const [currentPage, setCurrentPage] = useState(PAGINATION.DEFAULT_PAGE);
    const [itemsPerPage, setItemsPerPage] = useState(PAGINATION.DEFAULT_PER_PAGE);
    const [totalPages, setTotalPages] = useState(PAGINATION.DEFAULT_TOTAL_PAGES);
    const [selectedGroups, setSelectedGroups] = useState([]);
    const headers = useMemo(() => ['id', 'Nome'], []);
    const actions = useMemo(() => [
        {
            icon: faEdit,
            title: 'Editar Grupo',
            buttonClass: 'btn-primary',
            permission: 'Atualizar grupos de produto',
            onClick: (group) => navigate(`/grupos/editar/${group.id}`),
        },
        {
            icon: faTrash,
            title: 'Excluir Grupo',
            buttonClass: 'btn-danger',
            permission: 'Excluir grupos de produto',
            onClick: (group) => {
                setGroupToDelete(group);
                setDeleteModalOpen(true);
            },
        },
    ], [navigate]);

    const fetchGroup = useCallback(async (id, name, idLike, filledInputs, page = 1) => {
        try {
            showLoader();
            const response = await fetchAllGroups({ id, name, idLike, filledInputs, page, perPage: itemsPerPage });
            setGroups(response.data.map(group => ({
                id: group.id,
                name: group.name,
            })));
            setCurrentPage(response.current_page);
            setTotalPages(response.last_page);
        } catch (error) {
            console.log(error)
        } finally {
            hideLoader();
        }
    }, [fetchAllGroups, itemsPerPage, showLoader, hideLoader, showNotification]);

    useEffect(() => {
        fetchGroup();
    }, []);

    useEffect(() => {
        if (location.state?.message) {
            showNotification(location.state.type, location.state.message);
            setTimeout(() => navigate(location.pathname, { replace: true }), 0);
        }
    }, [location.state, navigate]);

    const handleClearFilters = useCallback(() => {
        window.location.reload();
    }, []);

    const handleFilterSubmit = useCallback((e) => {
        e.preventDefault();

        const filledInputs = new Set(
            selectedGroups.map((option) => option.column)
        ).size;

        fetchGroup(
            selectedGroups.filter((option) => option.textFilter === false || (option.column === 'id' && option.numberFilter === false)).map((item) => item.value),
            selectedGroups.filter((option) => option.textFilter === true && option.column === 'name').map((item) => item.value),
            selectedGroups.filter((option) => option.numberFilter === true && option.column === 'id').map((item) => item.value),
            filledInputs
        );
    }, [selectedGroups, fetchGroup]);

    const handleChangeGroup = useCallback((newSelected, column) => {
        setSelectedGroups((prev) => {
            if (!newSelected.length) {
                return prev.filter((option) => option.column !== column);
            }

            const newSelectedArray = Array.isArray(newSelected) ? newSelected : [newSelected];

            const filtered = prev.filter((option) => option.column !== column);
            return [...filtered, ...newSelectedArray];
        });
    }, []);

    const confirmDelete = useCallback(async () => {
        try {
            showLoader();
            await deleteGroup(groupToDelete.id);
            fetchGroup();
        } catch (error) {
            console.log(error)
        } finally {
            setDeleteModalOpen(false);
            hideLoader();
        }
    }, [groupToDelete, deleteGroup, fetchGroup, showLoader, hideLoader, showNotification]);

    return (
        <MainLayout selectedCompany="ALUCOM">
            <div className="container-fluid p-1">
                <div className="text-xs font-weight-bold text-primary text-uppercase mb-1 text-dark">
                    Grupos
                </div>

                <form className="form-row p-3 mt-2 rounded shadow-sm mb-2" style={{ backgroundColor: '#FFFFFF' }} onSubmit={handleFilterSubmit}>
                    <div className="form-group col-md-6">
                        <label htmlFor="name" className="text-dark font-weight-bold mt-1">
                            Número:
                        </label>
                        <AutoCompleteFilter
                            service={baseService}
                            columnDataBase="id"
                            model='type'
                            value={selectedGroups.filter((option) => option.column === 'id')}
                            onChange={(selected) => handleChangeGroup(selected, 'id')}
                            onBlurColumn="numberFilter"
                            placeholder="Filtre os grupos pelo número"
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
                            model='type'
                            value={selectedGroups.filter((option) => option.column === 'name')}
                            onChange={(selected) => handleChangeGroup(selected, 'name')}
                            onBlurColumn="textFilter"
                            placeholder="Filtre os grupos pelo nome"
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
                        Lista de Grupos
                    </div>
                    {canAccess('Criar grupos de produto') && (
                        <Button
                            text="Novo Grupo"
                            className="btn btn-blue-light fw-semibold"
                            link="/grupos/criar"
                        />
                    )}
                </div>

                <DynamicTable
                    headers={headers}
                    data={groups}
                    actions={actions}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={fetchGroup}
                />
                
                <ConfirmationModal
                    open={deleteModalOpen}
                    onClose={() => setDeleteModalOpen(false)}
                    onConfirm={confirmDelete}
                    itemName={groupToDelete ? groupToDelete.name : ''}
                />
            </div>
        </MainLayout>
    );
};

export default GroupPage;

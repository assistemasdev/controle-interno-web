import React, { useState, useEffect, useCallback, useMemo } from "react";
import MainLayout from "../../layouts/MainLayout";
import Button from "../../components/Button";
import { usePermissions } from "../../hooks/usePermissions";
import DynamicTable from "../../components/DynamicTable";
import RoleService from "../../services/RoleService";
import { useNavigate, useLocation } from "react-router-dom";
import { faEdit, faTrashAlt, faUndo } from '@fortawesome/free-solid-svg-icons';
import { PAGINATION } from "../../constants/pagination";
import AutoCompleteFilter from "../../components/AutoCompleteFilter";
import baseService from "../../services/baseService";
import useLoader from "../../hooks/useLoader";
import useNotification from "../../hooks/useNotification";
import ConfirmationModal from "../../components/modals/ConfirmationModal";
import useRoleService from "../../hooks/useRoleService";

const RolePage = () => {
    const { canAccess } = usePermissions();
    const navigate = useNavigate();
    const location = useLocation();
    const [roles, setRoles] = useState([]);
    const [selectedRoles, setSelectedRoles] = useState([]);
    const [currentPage, setCurrentPage] = useState(PAGINATION.DEFAULT_PAGE);
    const [itemsPerPage, setItemsPerPage] = useState(PAGINATION.DEFAULT_PER_PAGE);
    const [totalPages, setTotalPages] = useState(PAGINATION.DEFAULT_TOTAL_PAGES);
    const { showLoader, hideLoader } = useLoader();
    const { showNotification } = useNotification();
    const [selectedRole, setSelectedRole] = useState(null);  
    const [openModalConfirmation, setOpenModalConfirmation] = useState(false);  
    const { fetchRoles: getRoles, deleteRole} = useRoleService(navigate);
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
            showNotification(location.state.type, location.state.message);
        }
    }, [location.state]);

    const handleClearFilters = useCallback(() => {
        window.location.reload();
    }, []);

    const fetchRoles = useCallback(
        async (filtersSubmit) => {
            try {
                showLoader();
                const response = await getRoles(filtersSubmit || filters);
                const filteredRoles = response.data.map(role => ({
                    id: role.id,
                    name: role.name,
                    deleted_at: role.deleted_at ? 'deleted-' + role.deleted_at : 'deleted-null'
                }));

                setRoles(filteredRoles);
                setCurrentPage(response.current_page);
                setTotalPages(response.last_page);
            } catch (error) {
                showNotification('error', 'Erro ao carregar cargos');
                console.error(error);
            } finally {
                hideLoader();
            }
        },
        [itemsPerPage, navigate, showLoader, hideLoader, showNotification]
    );

    const handleFilterSubmit = useCallback(
        (e) => {
            e.preventDefault();
    
            const filledInputs = new Set(selectedRoles.map((option) => option.column)).size;
    
            const selectedRoleIds = selectedRoles
                .filter((type) => type.textFilter === false || (type.column === 'id' && type.numberFilter === false))
                .map((type) => type.value);
    
            const selectedRoleNames = selectedRoles
                .filter((type) => type.textFilter === true && type.column === 'name')
                .map((type) => type.value);
    
            const selectedRoleIdLikes = selectedRoles
                .filter((type) => type.numberFilter === true && type.column === 'id')
                .map((type) => type.value);
    
            const previousFilters = filters || {}; 
    
            setFilters(prev => ({
                ...prev,
                id: selectedRoleIds,
                name: selectedRoleNames,
                idLike: selectedRoleIdLikes,
                filledInputs,
                page: 1
            }));
    
            fetchRoles(
                {
                    id: selectedRoleIds,         
                    name: selectedRoleNames,       
                    idLike: selectedRoleIdLikes,     
                    filledInputs,
                    page: 1,         
                    deleted_at:previousFilters.deleted_at 
                }

            );
        },
        [selectedRoles, fetchRoles, filters, setFilters] 
    );
    
    const handleChangeRoles = useCallback((newSelected, column) => {
        setSelectedRoles((prev) => {
            if (!newSelected.length) {
                return prev.filter((option) => option.column !== column);
            }

            const newSelectedArray = Array.isArray(newSelected) ? newSelected : [newSelected];
            const filtered = prev.filter((option) => option.column !== column);
            return [...filtered, ...newSelectedArray];
        });
    }, []);

    useEffect(() => {
        fetchRoles();
    }, []);

    const handleEdit = useCallback(
        (application) => {
            navigate(`/cargos/editar/${application.id}`);
        },
        [navigate]
    );

    const handleActivate = (role, action) => {
        setSelectedRole(role); 
        setAction({
            action,
            text:'Você tem certeza que deseja ativar: '
        })
        setOpenModalConfirmation(true);  
    };

    const handleDelete = (role, action) => {
        setSelectedRole(role);  
        setAction({
            action,
            text:'Você tem certeza que deseja excluir: '
        })
        setOpenModalConfirmation(true);  
    };

    const handleConfirmDelete = async (id) => {
        try {
            showLoader();
            await deleteRole(id);
            setOpenModalConfirmation(false);  
            fetchRoles();
        } catch (error) {
            console.log(error);
            showNotification('error', 'Erro ao excluir o usuário');
            setOpenModalConfirmation(false);  
        } finally {
            hideLoader();
        }    
    };

    const handleCancelConfirmation = () => {
        setOpenModalConfirmation(false);  
    };


    const headers = useMemo(() => ['id', 'Nome'], []);
    const actions = useMemo(
        () => [
            {
                icon: faEdit,
                title: 'Editar Cargos',
                buttonClass: 'btn-primary',
                permission: 'Atualizar cargos',
                onClick: handleEdit
            },
            {
                id: 'delete',
                icon: faTrashAlt,
                title: 'Excluir usuário',
                buttonClass: 'btn-danger',
                permission: 'Excluir cargos',
                onClick: handleDelete,
            },
            {
                id: 'activate',
                icon: faUndo,
                title: 'Ativar usuário',
                buttonClass: 'btn-info',
                permission: 'Atualizar cargos',
                onClick: handleActivate,
            },
        ],
        [handleEdit]
    );

    return (
        <MainLayout selectedCompany="ALUCOM">
            <div className="container-fluid p-1">
                <div className="text-xs font-weight-bold text-primary text-uppercase mb-1 text-dark">
                    Cargos
                </div>

                <form className="form-row p-3 mt-2 rounded shadow-sm mb-2" style={{ backgroundColor: '#FFFFFF' }} onSubmit={handleFilterSubmit}>
                    <div className="form-group col-md-6">
                        <label htmlFor="name" className="text-dark font-weight-bold mt-1">
                            Número:
                        </label>
                        <AutoCompleteFilter
                            service={baseService}
                            columnDataBase="id"
                            model="role"
                            value={selectedRoles.filter((option) => option.column === 'id')}
                            onChange={(selected) => handleChangeRoles(selected, 'id')}
                            onBlurColumn="numberFilter"
                            placeholder="Filtre os cargos pelo número"
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
                            model="role"
                            value={selectedRoles.filter((option) => option.column === 'name')}
                            onChange={(selected) => handleChangeRoles(selected, 'name')}
                            onBlurColumn="textFilter"
                            placeholder="Filtre os cargos pelo nome"
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
                        Lista de Cargos
                    </div>
                    {canAccess('create role') && (
                        <Button text="Nova Cargo" className="btn btn-blue-light fw-semibold" link="/cargos/criar" />
                    )}
                </div>

                <DynamicTable
                    headers={headers}
                    data={roles}
                    actions={actions}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={fetchRoles}
                    filters={filters}
                    setFilters={setFilters}
                />

                <ConfirmationModal
                    open={openModalConfirmation}
                    onClose={handleCancelConfirmation}
                    onConfirm={() => action.action == 'delete'? handleConfirmDelete(selectedRole.id) : console.log('oi')}
                    itemName={selectedRole ? selectedRole.name : ''}
                    text={action.text}
                />
            </div>
        </MainLayout>
    );
};

export default RolePage;

import React, { useState, useEffect, useCallback } from 'react';
import { faEdit, faTrashAlt, faBuilding, faUndo } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import DynamicTable from '../../components/DynamicTable';
import Button from '../../components/Button';
import ConfirmationModal from '../../components/modals/ConfirmationModal'; 
import '../../assets/styles/custom-styles.css';
import MainLayout from '../../layouts/MainLayout';  
import { useLocation } from 'react-router-dom';
import { usePermissions } from '../../hooks/usePermissions';
import { PAGINATION } from '../../constants/pagination';
import AutoCompleteFilter from '../../components/AutoCompleteFilter';
import useLoader from '../../hooks/useLoader';
import useNotification from '../../hooks/useNotification';
import useUserService from '../../hooks/useUserService';
import baseService from '../../services/baseService';

const UsersPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { canAccess } = usePermissions();
    const { showLoader, hideLoader } = useLoader();
    const { showNotification } = useNotification();
    const { fetchAllUsers, deleteUser } = useUserService(navigate);
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);  
    const [openModalConfirmation, setOpenModalConfirmation] = useState(false);  
    const [currentPage, setCurrentPage] = useState(PAGINATION.DEFAULT_PAGE);
    const [itemsPerPage, setItemsPerPage] = useState(PAGINATION.DEFAULT_PER_PAGE);
    const [totalPages, setTotalPages] = useState(PAGINATION.DEFAULT_TOTAL_PAGES);
    const [selectedUsers, setSelectedUsers] = useState([]);
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
            showNotification('error', location.state.message);
        }
    }, [location.state, showNotification]);

    const fetchUsers = async (filtersSubmit) => {
        try {
            showLoader();
            const result = await fetchAllUsers(filtersSubmit || filters);

            const filteredUsers = result.data.map(user => ({
                id: user.id,
                name: user.name,
                email: user.email,
                deleted_at: 'deleted-' + user.deleted_at
            }));
            
            setUsers(filteredUsers);
            setTotalPages(result.last_page);
            setCurrentPage(result.current_page);
        } catch (error) {
            const errorMessage = error.response?.data?.error || error.message || 'Erro ao carregar usuários';
            showNotification('error', errorMessage);
            console.error(error);
        } finally {
            hideLoader();
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleFilterSubmit = (e) => {
        e.preventDefault();
    
        const selectedUserIds = selectedUsers
            .filter((type) => type.textFilter === false || (type.column === 'id' && type.numberFilter === false))
            .map((type) => type.value);
    
        const selectedNames = selectedUsers
            .filter((type) => type.textFilter === true && type.column === 'name')
            .map((type) => type.value);
    
        const selectedIdLikes = selectedUsers
            .filter((type) => type.numberFilter === true && type.column === 'id')
            .map((type) => type.value);
    
        const filledInputs = new Set(selectedUsers.map((option) => option.column)).size;
    
        const previousFilters = filters || {}; 
    
        setFilters(prev => ({
            ...prev,
            id: selectedUserIds,
            name: selectedNames,
            idLike: selectedIdLikes,
            filledInputs,
            page: 1
        }));
    
        fetchUsers({
            id: selectedUserIds,
            name: selectedNames,
            idLike: selectedIdLikes,
            filledInputs,
            page: 1,
            deleted_at: previousFilters.deleted_at
        });
    };
    

    const handleClearFilters = useCallback(() => {
        window.location.reload();
    }, []);
    
    const handleChangeUsers = useCallback((newSelected, column) => {
        setSelectedUsers((prev) => {
            if (!newSelected.length) {
                return prev.filter((option) => option.column !== column);
            }

            const newSelectedArray = Array.isArray(newSelected) ? newSelected : [newSelected];

            const filtered = prev.filter((option) => option.column !== column);
            return [...filtered, ...newSelectedArray];
        });
    }, []);

    const handleActivate = (user, action) => {
        setSelectedUser(user); 
        setAction({
            action,
            text:'Você tem certeza que deseja ativar: '
        })
        setOpenModalConfirmation(true);  
    };

    const handleEdit = (user) => {
        navigate(`/usuarios/editar/${user.id}`);
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
            await deleteUser(id);
            setOpenModalConfirmation(false);  
            fetchUsers();
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

    const handleViewOrganizationUsers = (user) => {
        navigate(`/usuarios/organizacoes/${user.id}`)
    }

    const headers = ['id', 'Nome', 'E-mail'];

    const actions = [
        {
            id: 'edit',
            icon: faEdit,
            title: 'Editar usuário',
            buttonClass: 'btn-primary',
            permission: 'update users',
            onClick: handleEdit
        },
        {
            id: 'viewOrganizations',
            icon: faBuilding,
            title: 'Organizações do usuário',
            buttonClass: 'btn-success',
            permission: 'Listar organizações de usuários',
            onClick: handleViewOrganizationUsers,
        },
        {
            id: 'delete',
            icon: faTrashAlt,
            title: 'Excluir usuário',
            buttonClass: 'btn-danger',
            permission: 'delete users',
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
    ];
    

    return (
        <MainLayout selectedCompany="ALUCOM">
            <div className="container-fluid p-1">
                <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                    Usuários
                </div>

                <form className="form-row p-3 mt-2 rounded shadow-sm mb-2 theme-background" onSubmit={handleFilterSubmit}>
                    <div className="form-group col-md-6">
                        <label htmlFor="name" className="text-dark font-weight-bold mt-1">
                            Número:
                        </label>
                        <AutoCompleteFilter
                            service={baseService}
                            columnDataBase="id"
                            model='user'
                            value={selectedUsers.filter((option) => option.column === 'id')}
                            onChange={(selected) => handleChangeUsers(selected, 'id')}
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
                            model='user'
                            value={selectedUsers.filter((option) => option.column === 'name')}
                            onChange={(selected) => handleChangeUsers(selected, 'name')}
                            onBlurColumn="textFilter"
                            placeholder="Filtre os tipos pelo nome"
                            isMulti
                        />
                    </div>

                    <div className="form-group gap-2">
                        <Button type="submit" text="Filtrar" className="btn btn-blue-light fw-semibold m-1" />
                        <Button type="button" text="Limpar filtros" className="btn btn-blue-light fw-semibold m-1" onClick={handleClearFilters} />
                    </div>
                </form>

                <div className="form-row mt-4 d-flex justify-content-between align-items-center">
                    <div className="font-weight-bold text-primary text-uppercase mb-1 d-flex">
                        Lista de usuários
                    </div>
                    {canAccess('create users') && (
                        <Button
                            text="Novo usuário"
                            className="btn btn-blue-light fw-semibold"
                            link="/usuarios/criar"
                        />
                    )}
                </div>

                <DynamicTable 
                    headers={headers} 
                    data={users} 
                    actions={actions} 
                    currentPage={currentPage} 
                    totalPages={totalPages}
                    onPageChange={fetchUsers}
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

export default UsersPage;

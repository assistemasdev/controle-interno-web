import React, { useState, useEffect } from 'react';
import { faEdit, faTrashAlt, faBuilding } from '@fortawesome/free-solid-svg-icons';
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
import UserService from '../../services/UserService';

const UsersPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { canAccess } = usePermissions();
    const { showLoader, hideLoader } = useLoader();
    const { showNotification } = useNotification();
    const { fetchAllUsers, deleteUser } = useUserService(navigate);
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);  
    const [openDeleteModal, setOpenDeleteModal] = useState(false);  
    const [currentPage, setCurrentPage] = useState(PAGINATION.DEFAULT_PAGE);
    const [itemsPerPage, setItemsPerPage] = useState(PAGINATION.DEFAULT_PER_PAGE);
    const [totalPages, setTotalPages] = useState(PAGINATION.DEFAULT_TOTAL_PAGES);
    const [selectedUsers, setSelectedUsers] = useState([]);

    useEffect(() => {
        if (location.state?.message) {
            showNotification('error', location.state.message);
        }
    }, [location.state, showNotification]);

    const fetchUsers = async (id, name, filledInputs, page = 1) => {
        try {
            showLoader();

            const result = await fetchAllUsers({ id, name, filledInputs, page, perPage: itemsPerPage });

            const filteredUsers = result.data.map(user => ({
                id: user.id,
                name: user.name,
                email: user.email,
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

    const handleFilter = (e) => {
        e.preventDefault();
        const filledInputs = new Set(
            selectedUsers.map((option) => option.column)
        ).size;

        fetchUsers(
            selectedUsers.filter((user) => user.textFilter === false).map(user => (user.value)),
            selectedUsers.filter((user) => user.textFilter === true).map(user => (user.value)),
            filledInputs
        );
    };

    const handleEdit = (user) => {
        navigate(`/usuarios/editar/${user.id}`);
    };

    const handleDelete = (user) => {
        setSelectedUser(user);  
        setOpenDeleteModal(true);  
    };
    
    const handleConfirmDelete = async (id) => {
        try {
            showLoader();
            await deleteUser(id);
            setOpenDeleteModal(false);  
            fetchUsers();
        } catch (error) {
            console.log(error);
            showNotification('error', 'Erro ao excluir o usuário');
            setOpenDeleteModal(false);  
        } finally {
            hideLoader();
        }    
    };

    const handleCancelDelete = () => {
        setOpenDeleteModal(false);  
    };

    const handleViewOrganizationUsers = (user) => {
        navigate(`/usuarios/organizacoes/${user.id}`)
    }

    const headers = ['id', 'Nome', 'E-mail'];

    const actions = [
        {
            icon: faEdit,
            title: 'Editar usuário',
            buttonClass: 'btn-primary',
            permission: 'update users',
            onClick: handleEdit
        },
        {
            icon: faTrashAlt,
            title: 'Excluir usuário',
            buttonClass: 'btn-danger',
            permission: 'delete users',
            onClick: handleDelete,
        },
        {
            icon: faBuilding,
            title: 'Organizações do usuário',
            buttonClass: 'btn-success',
            permission: 'Listar organizações de usuários',
            onClick: handleViewOrganizationUsers,
        },
    ];

    return (
        <MainLayout selectedCompany="ALUCOM">
            <div className="container-fluid p-1">
                <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                    Usuários
                </div>

                <form className="form-row p-3 mt-2 rounded shadow-sm mb-2 theme-background" onSubmit={handleFilter}>
                    <div className="form-group col-md-12">
                        <label htmlFor="name" className='font-weight-bold mt-1'>Nome:</label>
                        <AutoCompleteFilter
                            service={UserService}
                            value={selectedUsers}
                            columnDataBase='name'
                            isMulti={true}
                            onChange={(selected) => setSelectedUsers(selected)}
                            onBlurColumn='textFilter'
                            placeholder="Filtre os usuários pelo nome"
                        />
                    </div>

                    <div className="form-group gap-2">
                        <Button type="submit" text="Filtrar" className="btn btn-blue-light fw-semibold m-1" />
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
                />

                <ConfirmationModal
                    open={openDeleteModal}
                    onClose={handleCancelDelete}
                    onConfirm={() => handleConfirmDelete(selectedUser.id)}
                    itemName={selectedUser ? selectedUser.name : ''}
                />
            </div>
        </MainLayout>
    );
};

export default UsersPage;

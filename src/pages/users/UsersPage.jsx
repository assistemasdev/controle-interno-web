import React, { useState, useEffect } from 'react';
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
import useLoader from '../../hooks/useLoader';
import useNotification from '../../hooks/useNotification';
import useBaseService from '../../hooks/services/useBaseService';
import { entities } from '../../constants/entities';
import FilterForm from '../../components/FilterForm';
import { useUserFilters } from '../../hooks/filters/userFilters';
import PageHeader from '../../components/PageHeader';
import ListHeader from '../../components/ListHeader';

const UsersPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { canAccess } = usePermissions();
    const { showLoader, hideLoader } = useLoader();
    const { showNotification } = useNotification();
    const { get: fetchAll, del: remove } = useBaseService(navigate);
    const [users, setUsers] = useState([]);
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
        perPage: itemsPerPage
    });

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
            const response = await fetchAll(entities.users.get, filtersSubmit || filters);
            
            const filteredUsers = response.result.data.map(user => ({
                id: user.id,
                name: user.name,
                email: user.email,
                deleted_at: user.deleted_at ? 'deleted-' + user.deleted_at : 'deleted-null'
            }));
            
            setUsers(filteredUsers);
            setTotalPages(response.result.last_page);
            setCurrentPage(response.result.current_page);
        } catch (error) {
            console.error(error);
        } finally {
            hideLoader();
        }
    };

    const { handleFilterSubmit, handleClearFilters, inputsfilters } = useUserFilters(fetchUsers, filters, setFilters);

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleEdit = (user) => {
        navigate(`/usuarios/editar/${user.id}`);
    };
    
    const handleActivate = (user, action) => {
        setSelectedUser(user); 
        setAction({
            action,
            text: 'Você tem certeza que deseja ativar: '
        });
        setOpenModalConfirmation(true);  
    };

    const handleDelete = (user, action) => {
        setSelectedUser(user);  
        setAction({
            action,
            text: 'Você tem certeza que deseja excluir: '
        });
        setOpenModalConfirmation(true);  
    };
    
    const handleConfirmDelete = async (id) => {
        try {
            showLoader();
            await remove(entities.users.delete(id));
            setOpenModalConfirmation(false);  
            fetchUsers();
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

    const handleViewOrganizationUsers = (user) => {
        navigate(`/usuarios/organizacoes/${user.id}`);
    };

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
            <PageHeader title="Usuários" showBackButton={true} backUrl="/dashboard" /> 
            
            <div className="container-fluid p-1">
                <FilterForm autoCompleteFields={inputsfilters} onSubmit={handleFilterSubmit} onClear={handleClearFilters} />

                <ListHeader 
                    title="Lista de usuários" 
                    buttonText="Novo usuário" 
                    buttonLink="/usuarios/criar" 
                    canAccess={canAccess} 
                    permission="Criar usuários"
                />

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
                    onConfirm={() => action.action === 'delete' ? handleConfirmDelete(selectedUser.id) : console.log('oi')}
                    itemName={selectedUser ? selectedUser.name : ''}
                    text={action.text}
                />
            </div>
        </MainLayout>
    );
};

export default UsersPage;
